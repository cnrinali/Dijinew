const { getPool, sql } = require('../../config/db');

// @desc    Get all users (with optional search, role filter and pagination)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    const { search, role, page = 1, limit = 10 } = req.query; 
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ message: 'Geçersiz sayfa veya limit değeri.' });
    }
    // Geçerli rol filtresi (business eklendi)
    const validRoles = ['admin', 'business', 'user'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: `Geçersiz rol değeri. ${validRoles.join(', ')} olabilir.` });
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        
        // Temel sorgu ve JOIN (GÜNCELLENDİ)
        let baseQuery = `FROM Users u LEFT JOIN Companies c ON u.companyId = c.id`; 
        let whereConditions = []; 

        // Arama koşulu (u.name, u.email)
        if (search) {
            whereConditions.push('(u.name LIKE @searchTerm OR u.email LIKE @searchTerm)');
            request.input('searchTerm', sql.NVarChar, `%${search}%`);
        }
        // Rol filtresi koşulu (u.role)
        if (role) {
             whereConditions.push('u.role = @roleFilter');
             request.input('roleFilter', sql.NVarChar, role);
        }

        let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // 1. Toplam kayıt sayısını al
        const countQuery = `SELECT COUNT(u.id) as totalCount ${baseQuery} ${whereClause}`;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

        // 2. Mevcut sayfanın verisini al (GÜNCELLENDİ - c.name eklendi)
        const dataQuery = `
            SELECT u.id, u.name, u.email, u.role, u.companyId, u.createdAt, c.name as companyName 
            ${baseQuery} 
            ${whereClause} 
            ORDER BY u.id ASC 
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limitNum);
        
        const dataResult = await request.query(dataQuery);
        
        res.status(200).json({
            data: dataResult.recordset,
            totalCount: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum)
        });

    } catch (error) {
        console.error("Tüm kullanıcıları getirme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const userIdToDelete = req.params.id;
    const adminUserId = req.user.id; // Silen adminin ID'si

    // Adminin kendi kendini silmesini engelle
    if (parseInt(userIdToDelete) === adminUserId) {
        return res.status(400).json({ message: 'Yöneticiler kendi hesaplarını silemez.' });
    }

    if (isNaN(parseInt(userIdToDelete))) {
         return res.status(400).json({ message: 'Geçersiz Kullanıcı ID' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, parseInt(userIdToDelete))
            .query('DELETE FROM Users WHERE id = @userId');
        
        // Users tablosunda ON DELETE CASCADE varsa, ilişkili kartlar da silinir.
        // Eğer CASCADE yoksa, önce kullanıcının kartlarını silmek gerekebilir.

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Kullanıcı başarıyla silindi', id: userIdToDelete });
        } else {
            // Kullanıcı bulunamadı
             return res.status(404).json({ message: 'Silinecek kullanıcı bulunamadı' });
        }

    } catch (error) {
        console.error("Kullanıcı silme hatası (Admin):", error);
        // Foreign key gibi hatalar olabilir
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get all cards (regardless of user, with optional search, status filter and pagination)
// @route   GET /api/admin/cards
// @access  Private/Admin
const getAllCards = async (req, res) => {
    const { search, isActive, page = 1, limit = 10 } = req.query; // isActive filtresi eklendi
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ message: 'Geçersiz sayfa veya limit değeri.' });
    }
    // isActive filtresini işle (string "true"/"false" gelirse boolean'a çevir)
    let isActiveFilter = null;
    if (isActive === 'true') {
        isActiveFilter = 1; // SQL Server BIT için 1
    } else if (isActive === 'false') {
        isActiveFilter = 0; // SQL Server BIT için 0
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        let baseQuery = `FROM Cards c JOIN Users u ON c.userId = u.id`;
        let whereConditions = [];

        // Arama koşulu
        if (search) {
            whereConditions.push('(c.cardName LIKE @searchTerm OR u.name LIKE @searchTerm)');
            request.input('searchTerm', sql.NVarChar, `%${search}%`);
        }
        // Aktiflik durumu filtresi
        if (isActiveFilter !== null) {
             whereConditions.push('c.isActive = @isActiveFilter');
             request.input('isActiveFilter', sql.Bit, isActiveFilter);
        }

        // WHERE cümlesini oluştur
        let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // 1. Toplam kayıt sayısını al
        const countQuery = `SELECT COUNT(c.id) as totalCount ${baseQuery} ${whereClause}`;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

        // 2. Mevcut sayfanın verisini al
        const dataQuery = `
            SELECT c.*, u.name as userName, u.email as userEmail 
            ${baseQuery}
            ${whereClause} 
            ORDER BY c.createdAt DESC 
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limitNum);
        
        const dataResult = await request.query(dataQuery);
        
        res.status(200).json({
            data: dataResult.recordset,
            totalCount: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum)
        });

    } catch (error) {
        console.error("Tüm kartları getirme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Delete any card by ID
// @route   DELETE /api/admin/cards/:id
// @access  Private/Admin
const deleteAnyCard = async (req, res) => {
    const cardIdToDelete = req.params.id;

    if (isNaN(parseInt(cardIdToDelete))) {
         return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardIdToDelete))
            .query('DELETE FROM Cards WHERE id = @cardId');

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Kartvizit başarıyla silindi', id: cardIdToDelete });
        } else {
            return res.status(404).json({ message: 'Silinecek kartvizit bulunamadı' });
        }

    } catch (error) {
        console.error("Kart silme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update user role and assign/unassign company (GÜNCELLENDİ)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    const userIdToUpdate = req.params.id;
    // İstekten yeni rolü ve opsiyonel şirket ID'sini al
    const { role: newRole, companyId: requestedCompanyId } = req.body; 
    const adminUserId = req.user.id; 

    if (parseInt(userIdToUpdate) === adminUserId) {
        return res.status(400).json({ message: 'Yöneticiler kendi rollerini/şirketlerini değiştiremez.' });
    }

    if (isNaN(parseInt(userIdToUpdate))) {
         return res.status(400).json({ message: 'Geçersiz Kullanıcı ID' });
    }

    // Geçerli rol değerlerini kontrol et (business eklendi)
    const validRoles = ['admin', 'business', 'user'];
    if (!newRole || !validRoles.includes(newRole)) {
        return res.status(400).json({ message: `Geçersiz rol değeri. Rol ${validRoles.join(', ')} olmalıdır.` });
    }

    let companyIdToSet = null; // Varsayılan olarak NULL

    try {
        const pool = await getPool();
        
        // Eğer rol 'business' ise, geçerli bir companyId sağlanmalı
        if (newRole === 'business') {
            if (!requestedCompanyId) {
                 return res.status(400).json({ message: 'Business rolü için şirket ID\'si zorunludur.' });
            }
            const companyIdNum = parseInt(requestedCompanyId, 10);
            if (isNaN(companyIdNum)) {
                 return res.status(400).json({ message: 'Geçersiz şirket ID formatı.' });
            }
            
            // Şirketin var olup olmadığını kontrol et
            const companyCheck = await pool.request()
                .input('companyId', sql.Int, companyIdNum)
                .query('SELECT TOP 1 id FROM Companies WHERE id = @companyId');
            
            if (companyCheck.recordset.length === 0) {
                 return res.status(404).json({ message: `Şirket bulunamadı (ID: ${companyIdNum}).` });
            }
            companyIdToSet = companyIdNum; // Şirket geçerliyse atanacak ID'yi ayarla
        }
        
        // Kullanıcının var olup olmadığını kontrol et (zaten vardı, iyi)
        const userCheck = await pool.request()
            .input('userId', sql.Int, parseInt(userIdToUpdate))
            .query('SELECT TOP 1 id FROM Users WHERE id = @userId');
        
        if (userCheck.recordset.length === 0) {
             return res.status(404).json({ message: 'Rolü güncellenecek kullanıcı bulunamadı' });
        }

        // Rolü ve CompanyId'yi güncelle (GÜNCELLENDİ)
        const result = await pool.request()
            .input('userId', sql.Int, parseInt(userIdToUpdate))
            .input('newRole', sql.NVarChar, newRole)
            .input('newCompanyId', sql.Int, companyIdToSet) // NULL veya geçerli ID
            .query('UPDATE Users SET role = @newRole, companyId = @newCompanyId WHERE id = @userId');
        
        // rowsAffected MSSQL'de dizi olarak dönebilir, ilk elemanına bakmak lazım
         if (result.rowsAffected && result.rowsAffected[0] > 0) {
            // Güncellenen kullanıcı bilgisini (sadece ID, rol, companyId) döndür
            res.status(200).json({ 
                message: 'Kullanıcı rolü ve şirket bilgisi başarıyla güncellendi.',
                user: { id: parseInt(userIdToUpdate), role: newRole, companyId: companyIdToSet } 
            });
        } else {
            // Bu durum normalde userCheck ile yakalanmalı ama yine de kontrol edelim
            return res.status(404).json({ message: 'Kullanıcı bulunamadı (güncelleme sırasında).' });
        }

    } catch (error) {
        console.error("Kullanıcı rol/şirket güncelleme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update any user's profile (name, email) by Admin
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateAnyUserProfile = async (req, res) => {
    const userIdToUpdate = req.params.id;
    const { name, email } = req.body; // Sadece isim ve email alınır
    const adminUserId = req.user.id;

    // Adminin kendi profilini buradan güncellemesini engelle (profil sayfası var)
    // Aslında güncelleyebilir ama karışıklık olmasın diye ayıralım.
    if (parseInt(userIdToUpdate) === adminUserId) {
        return res.status(400).json({ message: 'Kendi profilinizi buradan güncelleyemezsiniz.' });
    }

    // ID kontrolü
    if (isNaN(parseInt(userIdToUpdate))) {
        return res.status(400).json({ message: 'Geçersiz Kullanıcı ID' });
    }

    // Gelen veriyi doğrula (boş olamaz)
    if (!name || !email) {
        return res.status(400).json({ message: 'İsim ve e-posta alanları zorunludur.' });
    }

    // E-posta formatı kontrolü (basit)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return res.status(400).json({ message: 'Geçersiz e-posta formatı.' });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool); // Transaction başlatalım

        await transaction.begin();

        try {
            // 1. E-posta adresinin başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
            const emailCheckRequest = new sql.Request(transaction); // Request'i transaction'a bağla
            emailCheckRequest.input('email', sql.NVarChar, email);
            emailCheckRequest.input('userIdToExclude', sql.Int, parseInt(userIdToUpdate));
            const emailCheckResult = await emailCheckRequest.query(
                'SELECT TOP 1 id FROM Users WHERE email = @email AND id != @userIdToExclude'
            );

            if (emailCheckResult.recordset.length > 0) {
                await transaction.rollback(); // Transaction'ı geri al
                return res.status(400).json({ message: 'Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor.' });
            }

            // 2. Kullanıcı bilgilerini güncelle
            const updateRequest = new sql.Request(transaction);
            updateRequest.input('userId', sql.Int, parseInt(userIdToUpdate));
            updateRequest.input('name', sql.NVarChar, name);
            updateRequest.input('email', sql.NVarChar, email);
            // Sadece isim ve email güncelleniyor
            const updateResult = await updateRequest.query(
                'UPDATE Users SET name = @name, email = @email OUTPUT inserted.id, inserted.name, inserted.email, inserted.role, inserted.createdAt WHERE id = @userId'
            );

            if (updateResult.recordset.length === 0) {
                // Kullanıcı bulunamadıysa (bu normalde olmamalı ama kontrol edelim)
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenecek kullanıcı bulunamadı.' });
            }
            
            await transaction.commit(); // Transaction'ı onayla

            res.status(200).json({
                message: 'Kullanıcı bilgileri başarıyla güncellendi.',
                user: updateResult.recordset[0] // Güncellenmiş kullanıcı bilgisini döndür
            });

        } catch (error) {
            await transaction.rollback(); // İç try-catch bloğunda hata olursa geri al
            console.error("Kullanıcı profil güncelleme (Admin - Transaction) hatası:", error);
            // Özel unique constraint hatası (çok düşük ihtimal)
             if (error.number === 2601 || error.number === 2627) { 
                return res.status(400).json({ message: 'E-posta adresi zaten kullanılıyor (Tekrar kontrol).' });
            }
            res.status(500).json({ message: 'Güncelleme sırasında bir sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kullanıcı profil güncelleme (Admin - Connection/Begin) hatası:", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// @desc    Update any card by Admin
// @route   PUT /api/admin/cards/:id
// @access  Private/Admin
const updateAnyCard = async (req, res) => {
    const cardId = req.params.id;
    const {
        cardName,
        profileImageUrl,
        coverImageUrl,
        name,
        title,
        company,
        bio,
        phone,
        email,
        website,
        address,
        theme,
        customSlug: rawCustomSlug,
        isActive,
        linkedinUrl,
        twitterUrl,
        instagramUrl
    } = req.body;

    if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    // Slug doğrulama ve temizleme (iç içe fonksiyon)
    const validateAndCleanSlug = (slug) => {
        if (!slug) return null;
        let cleanedSlug = slug.toLowerCase().trim();
        cleanedSlug = cleanedSlug.replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
        cleanedSlug = cleanedSlug.replace(/^-+|-+$/g, '');
        if (cleanedSlug.length < 1) return null;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanedSlug)) {
            console.warn('Slug temizleme sonrası beklenmedik format:', cleanedSlug);
            return null;
        }
        return cleanedSlug;
    };
    const newCustomSlug = validateAndCleanSlug(rawCustomSlug);

    if (rawCustomSlug && !newCustomSlug) {
        return res.status(400).json({ message: `Geçersiz özel URL formatı.` });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const currentCardRequest = new sql.Request(transaction);
            currentCardRequest.input('cardId', sql.Int, parseInt(cardId));
            const currentCardResult = await currentCardRequest.query(
                'SELECT TOP 1 customSlug FROM Cards WHERE id = @cardId'
            );

            if (currentCardResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenecek kartvizit bulunamadı.' });
            }
            const currentCustomSlug = currentCardResult.recordset[0].customSlug;

            if (newCustomSlug && newCustomSlug !== currentCustomSlug) {
                const slugCheckRequest = new sql.Request(transaction);
                slugCheckRequest.input('customSlug', sql.VarChar, newCustomSlug);
                slugCheckRequest.input('cardId', sql.Int, parseInt(cardId));
                const slugCheckResult = await slugCheckRequest.query(
                    'SELECT TOP 1 id FROM Cards WHERE customSlug = @customSlug AND id != @cardId'
                );

                if (slugCheckResult.recordset.length > 0) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Bu özel URL (${newCustomSlug}) zaten başka bir kartvizit tarafından kullanılıyor.` });
                }
            }

            const updateRequest = new sql.Request(transaction);
            updateRequest.input('cardId', sql.Int, parseInt(cardId));
            updateRequest.input('cardName', sql.NVarChar, cardName);
            updateRequest.input('profileImageUrl', sql.NVarChar, profileImageUrl);
            updateRequest.input('coverImageUrl', sql.NVarChar, coverImageUrl);
            updateRequest.input('name', sql.NVarChar, name);
            updateRequest.input('title', sql.NVarChar, title);
            updateRequest.input('company', sql.NVarChar, company);
            updateRequest.input('bio', sql.NVarChar, bio);
            updateRequest.input('phone', sql.NVarChar, phone);
            updateRequest.input('email', sql.NVarChar, email);
            updateRequest.input('website', sql.NVarChar, website);
            updateRequest.input('address', sql.NVarChar, address);
            updateRequest.input('theme', sql.NVarChar, theme);
            updateRequest.input('customSlug', sql.VarChar, newCustomSlug);
            updateRequest.input('isActive', sql.Bit, isActive);
            updateRequest.input('linkedinUrl', sql.NVarChar, linkedinUrl);
            updateRequest.input('twitterUrl', sql.NVarChar, twitterUrl);
            updateRequest.input('instagramUrl', sql.NVarChar, instagramUrl);

            const updateResult = await updateRequest.query(`
                UPDATE Cards SET
                    cardName = @cardName, profileImageUrl = @profileImageUrl, coverImageUrl = @coverImageUrl,
                    name = @name, title = @title, company = @company, bio = @bio, phone = @phone,
                    email = @email, website = @website, address = @address, theme = @theme,
                    customSlug = @customSlug, isActive = @isActive, linkedinUrl = @linkedinUrl,
                    twitterUrl = @twitterUrl, instagramUrl = @instagramUrl
                OUTPUT inserted.*
                WHERE id = @cardId;
            `);

             if (updateResult.recordset.length === 0) {
                 await transaction.rollback();
                 return res.status(404).json({ message: 'Kartvizit güncellenirken bulunamadı.' });
            }

            await transaction.commit();

            // Liste güncellemesi için kullanıcı bilgilerini de içeren tam kart verisini çek
            const finalResultRequest = new sql.Request(pool); // Yeni request, transaction bitti
            finalResultRequest.input('cardId', sql.Int, updateResult.recordset[0].id);
            const finalResult = await finalResultRequest.query(`
                SELECT c.*, u.name as userName, u.email as userEmail 
                FROM Cards c 
                JOIN Users u ON c.userId = u.id 
                WHERE c.id = @cardId
            `);

             if (finalResult.recordset.length === 0) {
                 // Bu olmamalı ama hata durumunda sadece güncellenen ham veriyi döndür
                 console.warn("Admin güncelleme sonrası tam kart verisi çekilemedi, ID:", updateResult.recordset[0].id);
                 return res.status(200).json({
                    message: 'Kartvizit başarıyla güncellendi (ancak tam veri çekilemedi).'
                 });
            }

            res.status(200).json({
                message: 'Kartvizit başarıyla güncellendi.',
                card: finalResult.recordset[0] 
            });

        } catch (error) {
            await transaction.rollback();
            console.error("Kartvizit güncelleme (Admin - Transaction) hatası:", error);
            if (error.number === 2601 || error.number === 2627) {
                return res.status(400).json({ message: `Özel URL (${newCustomSlug || rawCustomSlug}) zaten kullanılıyor (Tekrar kontrol).` });
            }
            res.status(500).json({ message: 'Güncelleme sırasında bir sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kartvizit güncelleme (Admin - Connection/Begin) hatası:", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const pool = await getPool();

        // Paralel sorgular daha hızlı olabilir
        const [userCountResult, cardCountResult, activeCardCountResult] = await Promise.all([
            pool.request().query('SELECT COUNT(*) as totalUsers FROM Users'),
            pool.request().query('SELECT COUNT(*) as totalCards FROM Cards'),
            pool.request().query('SELECT COUNT(*) as activeCards FROM Cards WHERE isActive = 1')
        ]);

        const stats = {
            totalUsers: userCountResult.recordset[0].totalUsers,
            totalCards: cardCountResult.recordset[0].totalCards,
            activeCards: activeCardCountResult.recordset[0].activeCards
        };

        res.status(200).json(stats);

    } catch (error) {
        console.error("Dashboard istatistiklerini getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Create a new company
// @route   POST /api/admin/companies
// @access  Private/Admin
const createCompany = async (req, res) => {
    const { name, userLimit = 5, cardLimit = 10 } = req.body; // Varsayılan limitler

    if (!name) {
        return res.status(400).json({ message: 'Şirket adı zorunludur.' });
    }
    const userLimitNum = parseInt(userLimit, 10);
    const cardLimitNum = parseInt(cardLimit, 10);
    if (isNaN(userLimitNum) || userLimitNum < 1 || isNaN(cardLimitNum) || cardLimitNum < 0) {
         return res.status(400).json({ message: 'Geçersiz kullanıcı veya kart limiti.' });
    }

    try {
        const pool = await getPool();
        // İsim benzersizliği kontrolü (opsiyonel ama önerilir)
        const nameCheck = await pool.request()
            .input('name', sql.NVarChar, name)
            .query('SELECT TOP 1 id FROM Companies WHERE name = @name');
        if (nameCheck.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu isimde bir şirket zaten mevcut.' });
        }

        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('userLimit', sql.Int, userLimitNum)
            .input('cardLimit', sql.Int, cardLimitNum)
            .query(`INSERT INTO Companies (name, userLimit, cardLimit) 
                    OUTPUT inserted.* 
                    VALUES (@name, @userLimit, @cardLimit)`);
        
        if (result.recordset && result.recordset.length > 0) {
            res.status(201).json(result.recordset[0]);
        } else {
            throw new Error('Şirket oluşturulamadı.');
        }
    } catch (error) {
        console.error("Şirket oluşturma hatası (Admin):", error);
         if (error.number === 2601 || error.number === 2627) { // Unique constraint (isim için)
             return res.status(400).json({ message: 'Bu isimde bir şirket zaten mevcut.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get all companies (with pagination)
// @route   GET /api/admin/companies
// @access  Private/Admin
const getAllCompanies = async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ message: 'Geçersiz sayfa veya limit değeri.' });
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        let whereClause = '';
        if (search) {
            whereClause = 'WHERE name LIKE @searchTerm';
            request.input('searchTerm', sql.NVarChar, `%${search}%`);
        }

        const countQuery = `SELECT COUNT(*) as totalCount FROM Companies ${whereClause}`;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

        const dataQuery = `
            SELECT * FROM Companies 
            ${whereClause} 
            ORDER BY id ASC 
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limitNum);
        
        const dataResult = await request.query(dataQuery);

        res.status(200).json({
            data: dataResult.recordset,
            totalCount: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum)
        });

    } catch (error) {
        console.error("Tüm şirketleri getirme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update a company (name, limits)
// @route   PUT /api/admin/companies/:id
// @access  Private/Admin
const updateCompany = async (req, res) => {
    const companyId = req.params.id;
    const { name, userLimit, cardLimit } = req.body;

    if (isNaN(parseInt(companyId))) {
        return res.status(400).json({ message: 'Geçersiz Şirket ID' });
    }
    if (!name && userLimit === undefined && cardLimit === undefined) {
         return res.status(400).json({ message: 'Güncellenecek en az bir alan gönderilmelidir (name, userLimit, cardLimit).' });
    }

    // Limitleri kontrol et
    const userLimitNum = userLimit !== undefined ? parseInt(userLimit, 10) : undefined;
    const cardLimitNum = cardLimit !== undefined ? parseInt(cardLimit, 10) : undefined;
    if ((userLimitNum !== undefined && (isNaN(userLimitNum) || userLimitNum < 1)) || 
        (cardLimitNum !== undefined && (isNaN(cardLimitNum) || cardLimitNum < 0))) {
         return res.status(400).json({ message: 'Geçersiz kullanıcı veya kart limiti.' });
    }

    try {
        const pool = await getPool();
        
        // İsim güncelleniyorsa, yeni ismin başka bir şirkette kullanılmadığını kontrol et
        if (name) {
             const nameCheck = await pool.request()
                .input('name', sql.NVarChar, name)
                .input('companyId', sql.Int, parseInt(companyId))
                .query('SELECT TOP 1 id FROM Companies WHERE name = @name AND id != @companyId');
            if (nameCheck.recordset.length > 0) {
                return res.status(400).json({ message: 'Bu isim başka bir şirkete ait.' });
            }
        }

        // Hangi alanların güncelleneceğini dinamik olarak belirle
        let setClauses = [];
        const request = pool.request().input('companyId', sql.Int, parseInt(companyId));
        if (name) {
            setClauses.push('name = @name');
            request.input('name', sql.NVarChar, name);
        }
        if (userLimitNum !== undefined) {
            setClauses.push('userLimit = @userLimit');
            request.input('userLimit', sql.Int, userLimitNum);
        }
        if (cardLimitNum !== undefined) {
            setClauses.push('cardLimit = @cardLimit');
            request.input('cardLimit', sql.Int, cardLimitNum);
        }
        
        // updatedAt otomatik güncellenmiyorsa elle ekle
        // setClauses.push('updatedAt = GETDATE()'); 

        if (setClauses.length === 0) {
             return res.status(400).json({ message: 'Güncellenecek geçerli alan bulunamadı.' });
        }

        const updateQuery = `UPDATE Companies SET ${setClauses.join(', ')} 
                             OUTPUT inserted.* 
                             WHERE id = @companyId`;
        const result = await request.query(updateQuery);

        if (result.recordset && result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            return res.status(404).json({ message: 'Güncellenecek şirket bulunamadı.' });
        }
    } catch (error) {
        console.error("Şirket güncelleme hatası (Admin):", error);
        if (error.number === 2601 || error.number === 2627) { // Unique constraint (isim için)
             return res.status(400).json({ message: 'Bu isim başka bir şirkete ait.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Delete a company
// @route   DELETE /api/admin/companies/:id
// @access  Private/Admin
const deleteCompany = async (req, res) => {
    const companyId = req.params.id;

    if (isNaN(parseInt(companyId))) {
        return res.status(400).json({ message: 'Geçersiz Şirket ID' });
    }

    try {
        const pool = await getPool();
        
        const result = await pool.request()
            .input('companyId', sql.Int, parseInt(companyId))
            .query('DELETE FROM Companies WHERE id = @companyId');

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Şirket başarıyla silindi.', id: parseInt(companyId) });
        } else {
            return res.status(404).json({ message: 'Silinecek şirket bulunamadı.' });
        }
    } catch (error) {
        console.error("Şirket silme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getAllCards,
    deleteAnyCard,
    updateUserRole,
    updateAnyUserProfile,
    updateAnyCard,
    getDashboardStats,
    createCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany
}; 