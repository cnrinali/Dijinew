const sql = require('mssql');
const { getPool } = require('../../config/db');

// Kart görüntülenmesini kaydet
const recordCardView = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { 
            ipAddress = req.ip || req.connection.remoteAddress,
            userAgent = req.get('User-Agent'),
            referrer = req.get('Referer'),
            country = null,
            city = null
        } = req.body;

        console.log(`recordCardView çağrıldı - cardId: ${cardId}`);
        console.log(`IP: ${ipAddress}, UserAgent: ${userAgent?.substring(0, 50)}...`);

        const pool = await getPool();
        
        // Görüntülenmeyi kaydet
        await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('ipAddress', sql.NVarChar(45), ipAddress)
            .input('userAgent', sql.NVarChar(500), userAgent)
            .input('referrer', sql.NVarChar(500), referrer)
            .input('country', sql.NVarChar(100), country)
            .input('city', sql.NVarChar(100), city)
            .query(`
                INSERT INTO CardViews (cardId, ipAddress, userAgent, referrer, country, city)
                VALUES (@cardId, @ipAddress, @userAgent, @referrer, @country, @city)
            `);

        console.log(`View başarıyla kaydedildi - cardId: ${cardId}`);

        // Günlük istatistikleri güncelle
        await updateDailyStats(cardId, 'view');

        res.status(200).json({ success: true, message: 'Görüntülenme kaydedildi' });
    } catch (error) {
        console.error('Görüntülenme kaydetme hatası:', error);
        res.status(500).json({ error: 'Görüntülenme kaydedilemedi' });
    }
};

// Link tıklamasını kaydet
const recordCardClick = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { 
            clickType, 
            clickTarget,
            ipAddress = req.ip || req.connection.remoteAddress,
            userAgent = req.get('User-Agent')
        } = req.body;

        console.log(`recordCardClick çağrıldı - cardId: ${cardId}, clickType: ${clickType}, clickTarget: ${clickTarget}`);

        if (!clickType || !clickTarget) {
            console.log('Hata: clickType veya clickTarget eksik');
            return res.status(400).json({ error: 'clickType ve clickTarget gerekli' });
        }

        const pool = await getPool();
        
        // Tıklamayı kaydet
        await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('clickType', sql.NVarChar(50), clickType)
            .input('clickTarget', sql.NVarChar(100), clickTarget)
            .input('ipAddress', sql.NVarChar(45), ipAddress)
            .input('userAgent', sql.NVarChar(500), userAgent)
            .query(`
                INSERT INTO CardClicks (cardId, clickType, clickTarget, ipAddress, userAgent)
                VALUES (@cardId, @clickType, @clickTarget, @ipAddress, @userAgent)
            `);

        console.log(`Click başarıyla kaydedildi - cardId: ${cardId}, type: ${clickType}`);

        // Günlük istatistikleri güncelle
        await updateDailyStats(cardId, 'click', clickType);

        res.status(200).json({ success: true, message: 'Tıklama kaydedildi' });
    } catch (error) {
        console.error('Tıklama kaydetme hatası:', error);
        res.status(500).json({ error: 'Tıklama kaydedilemedi' });
    }
};

// Kart istatistiklerini getir
const getCardStats = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { period = '30' } = req.query; // Son 30 gün varsayılan

        const pool = await getPool();

        // Genel istatistikler
        const generalStats = await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('days', sql.Int, parseInt(period))
            .query(`
                SELECT 
                    COUNT(DISTINCT cv.id) as totalViews,
                    COUNT(DISTINCT cc.id) as totalClicks,
                    COUNT(DISTINCT cv.ipAddress) as uniqueVisitors,
                    COUNT(DISTINCT CAST(cv.viewDate AS DATE)) as activeDays
                FROM Cards c
                LEFT JOIN CardViews cv ON c.id = cv.cardId 
                    AND cv.viewDate >= DATEADD(day, -@days, GETDATE())
                LEFT JOIN CardClicks cc ON c.id = cc.cardId 
                    AND cc.clickDate >= DATEADD(day, -@days, GETDATE())
                WHERE c.id = @cardId
            `);

        // Kategori bazlı tıklamalar
        const categoryStats = await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('days', sql.Int, parseInt(period))
            .query(`
                SELECT 
                    clickType,
                    COUNT(*) as clickCount
                FROM CardClicks 
                WHERE cardId = @cardId 
                    AND clickDate >= DATEADD(day, -@days, GETDATE())
                GROUP BY clickType
                ORDER BY clickCount DESC
            `);

        // Detaylı tıklama istatistikleri
        const detailedStats = await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('days', sql.Int, parseInt(period))
            .query(`
                SELECT 
                    clickType,
                    clickTarget,
                    COUNT(*) as clickCount
                FROM CardClicks 
                WHERE cardId = @cardId 
                    AND clickDate >= DATEADD(day, -@days, GETDATE())
                GROUP BY clickType, clickTarget
                ORDER BY clickCount DESC
            `);

        // Günlük trend
        const dailyTrend = await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('days', sql.Int, parseInt(period))
            .query(`
                SELECT 
                    CAST(viewDate AS DATE) as date,
                    COUNT(*) as views
                FROM CardViews 
                WHERE cardId = @cardId 
                    AND viewDate >= DATEADD(day, -@days, GETDATE())
                GROUP BY CAST(viewDate AS DATE)
                ORDER BY date DESC
            `);

        res.json({
            general: generalStats.recordset[0],
            categories: categoryStats.recordset,
            detailed: detailedStats.recordset,
            dailyTrend: dailyTrend.recordset
        });

    } catch (error) {
        console.error('İstatistik getirme hatası:', error);
        res.status(500).json({ error: 'İstatistikler getirilemedi' });
    }
};

// Kullanıcının tüm kartları için özet istatistikler
const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const { period = '30' } = req.query;

        console.log(`getUserStats çağrıldı - userId: ${userId}, period: ${period}`);
        console.log(`İstek yapan kullanıcı:`, req.user);

        const pool = await getPool();

        // Admin kullanıcısı ise tüm kartları göster
        if (req.user && req.user.role === 'admin') {
            console.log(`Admin kullanıcısı - tüm kartlar getiriliyor`);
            
            const allCardsStats = await pool.request()
                .input('days', sql.Int, parseInt(period))
                .query(`
                    SELECT 
                        c.id as cardId,
                        ISNULL(c.name, 'İsimsiz Kart') as cardName,
                        u.name as userName,
                        u.email as userEmail,
                        ISNULL(COUNT(DISTINCT cv.id), 0) as totalViews,
                        ISNULL(COUNT(DISTINCT cc.id), 0) as totalClicks,
                        ISNULL(COUNT(DISTINCT cv.ipAddress), 0) as uniqueVisitors
                    FROM Cards c
                    LEFT JOIN Users u ON c.userId = u.id
                    LEFT JOIN CardViews cv ON c.id = cv.cardId 
                        AND cv.viewDate >= DATEADD(day, -@days, GETDATE())
                    LEFT JOIN CardClicks cc ON c.id = cc.cardId 
                        AND cc.clickDate >= DATEADD(day, -@days, GETDATE())
                    WHERE c.isActive = 1
                    GROUP BY c.id, c.name, u.name, u.email
                    ORDER BY ISNULL(c.name, 'İsimsiz Kart') ASC
                `);

            console.log(`Admin için tüm kartlar sonucu:`, allCardsStats.recordset);
            res.json(allCardsStats.recordset);
            return;
        }

        // Normal kullanıcı için sadece kendi kartları
        const userCardsCheck = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT id, name, userId, isActive 
                FROM Cards 
                WHERE userId = @userId
            `);

        console.log(`Kullanıcı ${userId} için bulunan kartlar:`, userCardsCheck.recordset);

        const userStats = await pool.request()
            .input('userId', sql.Int, userId)
            .input('days', sql.Int, parseInt(period))
            .query(`
                SELECT 
                    c.id as cardId,
                    ISNULL(c.name, 'İsimsiz Kart') as cardName,
                    ISNULL(COUNT(DISTINCT cv.id), 0) as totalViews,
                    ISNULL(COUNT(DISTINCT cc.id), 0) as totalClicks,
                    ISNULL(COUNT(DISTINCT cv.ipAddress), 0) as uniqueVisitors
                FROM Cards c
                LEFT JOIN CardViews cv ON c.id = cv.cardId 
                    AND cv.viewDate >= DATEADD(day, -@days, GETDATE())
                LEFT JOIN CardClicks cc ON c.id = cc.cardId 
                    AND cc.clickDate >= DATEADD(day, -@days, GETDATE())
                WHERE c.userId = @userId AND c.isActive = 1
                GROUP BY c.id, c.name
                ORDER BY ISNULL(c.name, 'İsimsiz Kart') ASC
            `);

        console.log(`getUserStats sonucu:`, userStats.recordset);
        res.json(userStats.recordset);

    } catch (error) {
        console.error('Kullanıcı istatistik hatası:', error);
        res.status(500).json({ error: 'Kullanıcı istatistikleri getirilemedi' });
    }
};

// Admin için tüm istatistikler
const getAdminStats = async (req, res) => {
    try {
        const { period = '30' } = req.query;

        const pool = await getPool();

        // Genel sistem istatistikleri
        const systemStats = await pool.request()
            .input('days', sql.Int, parseInt(period))
            .query(`
                SELECT 
                    COUNT(DISTINCT c.id) as totalCards,
                    COUNT(DISTINCT cv.id) as totalViews,
                    COUNT(DISTINCT cc.id) as totalClicks,
                    COUNT(DISTINCT cv.ipAddress) as uniqueVisitors,
                    COUNT(DISTINCT c.userId) as activeUsers
                FROM Cards c
                LEFT JOIN CardViews cv ON c.id = cv.cardId 
                    AND cv.viewDate >= DATEADD(day, -@days, GETDATE())
                LEFT JOIN CardClicks cc ON c.id = cc.cardId 
                    AND cc.clickDate >= DATEADD(day, -@days, GETDATE())
            `);

        // En popüler kartlar
        const topCards = await pool.request()
            .input('days', sql.Int, parseInt(period))
            .query(`
                SELECT TOP 10
                    c.id,
                    ISNULL(c.name, 'İsimsiz Kart') as cardName,
                    u.name as userName,
                    COUNT(DISTINCT cv.id) as views,
                    COUNT(DISTINCT cc.id) as clicks
                FROM Cards c
                LEFT JOIN Users u ON c.userId = u.id
                LEFT JOIN CardViews cv ON c.id = cv.cardId 
                    AND cv.viewDate >= DATEADD(day, -@days, GETDATE())
                LEFT JOIN CardClicks cc ON c.id = cc.cardId 
                    AND cc.clickDate >= DATEADD(day, -@days, GETDATE())
                GROUP BY c.id, c.name, u.name
                ORDER BY views DESC
            `);

        res.json({
            system: systemStats.recordset[0],
            topCards: topCards.recordset
        });

    } catch (error) {
        console.error('Admin istatistik hatası:', error);
        res.status(500).json({ error: 'Admin istatistikleri getirilemedi' });
    }
};

// Günlük istatistikleri güncelleme yardımcı fonksiyonu
const updateDailyStats = async (cardId, type, clickType = null) => {
    try {
        const pool = await getPool();
        const today = new Date().toISOString().split('T')[0];

        if (type === 'view') {
            await pool.request()
                .input('cardId', sql.Int, cardId)
                .input('statDate', sql.Date, today)
                .query(`
                    MERGE DailyStats AS target
                    USING (SELECT @cardId as cardId, @statDate as statDate) AS source
                    ON target.cardId = source.cardId AND target.statDate = source.statDate
                    WHEN MATCHED THEN
                        UPDATE SET totalViews = totalViews + 1
                    WHEN NOT MATCHED THEN
                        INSERT (cardId, statDate, totalViews) VALUES (@cardId, @statDate, 1);
                `);
        } else if (type === 'click') {
            const columnMap = {
                'phone': 'phoneClicks',
                'email': 'emailClicks',
                'social': 'socialClicks',
                'marketplace': 'marketplaceClicks',
                'bank': 'bankClicks',
                'website': 'websiteClicks',
                'address': 'addressClicks'
            };

            const column = columnMap[clickType] || 'totalClicks';

            await pool.request()
                .input('cardId', sql.Int, cardId)
                .input('statDate', sql.Date, today)
                .query(`
                    MERGE DailyStats AS target
                    USING (SELECT @cardId as cardId, @statDate as statDate) AS source
                    ON target.cardId = source.cardId AND target.statDate = source.statDate
                    WHEN MATCHED THEN
                        UPDATE SET totalClicks = totalClicks + 1, ${column} = ${column} + 1
                    WHEN NOT MATCHED THEN
                        INSERT (cardId, statDate, totalClicks, ${column}) VALUES (@cardId, @statDate, 1, 1);
                `);
        }
    } catch (error) {
        console.error('Günlük istatistik güncelleme hatası:', error);
    }
};

module.exports = {
    recordCardView,
    recordCardClick,
    getCardStats,
    getUserStats,
    getAdminStats
}; 