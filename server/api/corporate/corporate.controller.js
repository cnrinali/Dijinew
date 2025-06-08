const { getPool, sql } = require('../../config/db');
const bcrypt = require('bcryptjs');
const { generateQRCodeDataURL, checkSlugUniqueness } = require('../admin/cards/card.controller');

// @desc    Get cards for the logged-in corporate user's company
// @route   GET /api/corporate/cards
// @access  Private/Corporate
const getCompanyCards = async (req, res) => {
    const { search, isActive, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Giriş yapmış kullanıcının şirket ID'sini al
    const companyId = req.user.companyId;

    if (!companyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ message: 'Geçersiz sayfa veya limit değeri.' });
    }

    let isActiveFilter = null;
    if (isActive === 'true') {
        isActiveFilter = 1;
    } else if (isActive === 'false') {
        isActiveFilter = 0;
    }

    try {
        const pool = await getPool();
        const request = pool.request();

        // Her zaman kullanıcının şirket ID'si ile filtrele
        request.input('companyId', sql.Int, companyId);
        
        let baseQuery = `FROM Cards c JOIN Users u ON c.userId = u.id WHERE c.companyId = @companyId`;
        let whereConditions = []; // Temel companyId filtresi zaten baseQuery'de

        if (search) {
            whereConditions.push('(c.cardName LIKE @searchTerm OR u.name LIKE @searchTerm)');
            request.input('searchTerm', sql.NVarChar, `%${search}%`);
        }
        if (isActiveFilter !== null) {
            whereConditions.push('c.isActive = @isActiveFilter');
            request.input('isActiveFilter', sql.Bit, isActiveFilter);
        }

        let whereClause = whereConditions.length > 0 ? ` AND ${whereConditions.join(' AND ')}` : '';

        const countQuery = `SELECT COUNT(c.id) as totalCount ${baseQuery} ${whereClause}`;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

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
        console.error("Şirket kartlarını getirme hatası (Corporate):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Create a new card for the corporate user's company
// @route   POST /api/corporate/cards
// @access  Private/Corporate
const createCompanyCard = async (req, res) => {
    const corporateCompanyId = req.user.companyId;
    const { userId, name, title, email, phone, website, address, status = true, customSlug } = req.body;

    if (!corporateCompanyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    // Kart adı her zaman zorunlu
    if (!name) {
        return res.status(400).json({ message: 'Kart Adı zorunludur.' });
    }

    const slugToCheck = customSlug && customSlug.trim() ? customSlug.trim() : null;
    const parsedUserId = userId ? parseInt(userId, 10) : null;

    let finalCardName = name; // Kartın adı her zaman req.body.name'den gelecek
    let finalCardTitle = title; // Varsayılan olarak req.body.title
    let finalCardEmail = email; // Varsayılan olarak req.body.email
    let finalCardPhone = phone;
    let finalCardWebsite = website;
    let finalCardAddress = address;

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            if (parsedUserId && !isNaN(parsedUserId)) {
                // userId varsa, kullanıcıyı doğrula ve bilgilerini al
                const userCheckRequest = new sql.Request(transaction);
                userCheckRequest.input('uId', sql.Int, parsedUserId);
                userCheckRequest.input('cId', sql.Int, corporateCompanyId);
                // Kullanıcıdan email ve (varsa) name alalım (gerçi cardName zaten req.body'den geliyor)
                const userResult = await userCheckRequest.query('SELECT email, name FROM Users WHERE id = @uId AND companyId = @cId');
                
                if (userResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: `Belirtilen kullanıcı (ID: ${parsedUserId}) şirketinizde bulunamadı veya geçersiz.` });
                }
                const companyUser = userResult.recordset[0];
                finalCardEmail = companyUser.email; // E-posta kullanıcıdan alınacak
                finalCardTitle = null; // Ünvan userId varsa NULL olacak (isteğiniz üzerine)
                // finalCardName, req.body.name olarak kalacak (kullanıcının adı değil, kartın adı)
            } else {
                // userId yoksa, e-posta isteğe bağlı, ünvan formdan alınacak
                // finalCardEmail zaten req.body.email'e eşit, ekstra bir şey yapmaya gerek yok
                // finalCardTitle zaten req.body.title'a eşit
            }
            
            // Şirket kart limitini ve mevcut kart sayısını kontrol et
            const cardLimitCheckRequest = new sql.Request(transaction);
            cardLimitCheckRequest.input('companyId', sql.Int, corporateCompanyId);
            const cardLimitCheckResult = await cardLimitCheckRequest.query(`
                SELECT 
                    c.cardLimit, 
                    (SELECT COUNT(id) FROM Cards WHERE companyId = @companyId) as currentCardCount 
                FROM Companies c 
                WHERE c.id = @companyId
            `);

            if (cardLimitCheckResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Şirket bulunamadı.' });
            }

            const { cardLimit, currentCardCount } = cardLimitCheckResult.recordset[0];

            if (currentCardCount >= cardLimit) {
                await transaction.rollback();
                return res.status(400).json({ message: `Kart ekleme limitine ulaşıldı (${cardLimit}).` });
            }
            
            // Slug benzersiz mi kontrol et (varsa)
            if (slugToCheck) {
                const isUnique = await checkSlugUniqueness(slugToCheck, null, transaction);
                if (!isUnique) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Bu özel URL (${slugToCheck}) zaten kullanılıyor.` });
                }
            }

            // Kartı ekle
            const insertRequest = new sql.Request(transaction);
            insertRequest.input('companyId', sql.Int, corporateCompanyId);
            insertRequest.input('userId', sql.Int, (parsedUserId && !isNaN(parsedUserId)) ? parsedUserId : null);
            insertRequest.input('name', sql.NVarChar, finalCardName);
            insertRequest.input('title', sql.NVarChar, finalCardTitle); // finalCardTitle (NULL olabilir)
            insertRequest.input('email', sql.NVarChar, finalCardEmail); // finalCardEmail (kullanıcıdan veya formdan)
            insertRequest.input('phone', sql.NVarChar, finalCardPhone);
            insertRequest.input('website', sql.NVarChar, finalCardWebsite);
            insertRequest.input('address', sql.NVarChar, finalCardAddress);
            insertRequest.input('status', sql.Bit, status);
            insertRequest.input('customSlug', sql.NVarChar, slugToCheck);
            
            const insertResult = await insertRequest.query(`
                INSERT INTO Cards (companyId, userId, name, title, email, phone, website, address, status, customSlug)
                OUTPUT INSERTED.*
                VALUES (@companyId, @userId, @name, @title, @email, @phone, @website, @address, @status, @customSlug)
            `);

            if (insertResult.recordset.length === 0) {
                throw new Error('Kart oluşturulamadı, ekleme sonucu boş.');
            }

            let newCard = insertResult.recordset[0];

            const qrCodeData = await generateQRCodeDataURL(newCard);
            if (qrCodeData) {
                 const qrUpdateRequest = new sql.Request(transaction);
                 qrUpdateRequest.input('cardId', sql.Int, newCard.id);
                 qrUpdateRequest.input('qrCodeData', sql.NVarChar, qrCodeData);
                 await qrUpdateRequest.query('UPDATE Cards SET qrCodeData = @qrCodeData WHERE id = @cardId');
                 newCard.qrCodeData = qrCodeData; 
            }
            
            const companyNameRequest = new sql.Request(transaction);
            companyNameRequest.input('cId', sql.Int, newCard.companyId);
            const companyNameResult = await companyNameRequest.query('SELECT name FROM Companies WHERE id = @cId');
            newCard.companyName = companyNameResult.recordset[0]?.name;

            if (newCard.userId) {
                 const userNameRequest = new sql.Request(transaction);
                 userNameRequest.input('uId', sql.Int, newCard.userId);
                 const userNameResult = await userNameRequest.query('SELECT name, email FROM Users WHERE id = @uId');
                 newCard.userName = userNameResult.recordset[0]?.name; // Bu zaten kartı görüntülemede kullanılacak
                 // newCard.userEmail = userNameResult.recordset[0]?.email; // Kartın kendi email'i artık finalCardEmail
            }

            await transaction.commit();
            res.status(201).json(newCard);

        } catch (error) {
            await transaction.rollback();
            console.error("Şirket kartı oluşturma hatası (Corporate - Transaction):", error);
            if (error.number === 547) { // Foreign key constraint
                return res.status(400).json({ message: 'Geçersiz Kullanıcı ID (FK).' });
            }
            if (error.number === 2627 || error.number === 2601) { 
                 return res.status(400).json({ message: 'Bu özel URL zaten kullanılıyor (DB).' });
            }
            res.status(500).json({ message: 'Kart oluşturulurken sunucuda bir hata oluştu.' });
        }

    } catch (error) {
        console.error("Şirket kartı oluşturma hatası (Corporate - Connection/Begin):", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// @desc    Create a new user for the logged-in corporate user's company
// @route   POST /api/corporate/users
// @access  Private/Corporate
const createCompanyUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const corporateCompanyId = req.user.companyId; // Giriş yapmış kullanıcının şirket ID'si

    if (!corporateCompanyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'İsim, e-posta, şifre ve rol zorunludur.' });
    }

    // Kurumsal kullanıcı sadece 'user' rolünde kullanıcı ekleyebilir
    if (role !== 'user') {
        return res.status(400).json({ message: 'Bu işlemle sadece \'user\' rolünde kullanıcı oluşturabilirsiniz.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return res.status(400).json({ message: 'Geçersiz e-posta formatı.' });
    }

    if (password.length < 6) { 
        return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Şirket limitini ve mevcut kullanıcı sayısını kontrol et
            const companyCheckRequest = new sql.Request(transaction);
            companyCheckRequest.input('companyId', sql.Int, corporateCompanyId);
            const companyCheckResult = await companyCheckRequest.query(`
                SELECT 
                    c.userLimit, 
                    (SELECT COUNT(id) FROM Users WHERE companyId = @companyId) as currentUserCount 
                FROM Companies c 
                WHERE c.id = @companyId
            `);

            if (companyCheckResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Şirket bulunamadı.' });
            }

            const { userLimit, currentUserCount } = companyCheckResult.recordset[0];

            if (currentUserCount >= userLimit) {
                await transaction.rollback();
                return res.status(400).json({ message: `Kullanıcı ekleme limitine ulaşıldı (${userLimit}).` });
            }

            const emailCheckRequest = new sql.Request(transaction);
            emailCheckRequest.input('email', sql.NVarChar, email);
            const emailCheckResult = await emailCheckRequest.query('SELECT TOP 1 id FROM Users WHERE email = @email');
            if (emailCheckResult.recordset.length > 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const insertRequest = new sql.Request(transaction);
            insertRequest.input('name', sql.NVarChar, name);
            insertRequest.input('email', sql.NVarChar, email);
            insertRequest.input('password', sql.NVarChar, hashedPassword);
            insertRequest.input('role', sql.NVarChar, role); // Her zaman 'user' olacak
            insertRequest.input('companyId', sql.Int, corporateCompanyId); // Otomatik olarak kullanıcının şirketi
            
            const insertResult = await insertRequest.query(`
                INSERT INTO Users (name, email, password, role, companyId)
                OUTPUT inserted.id, inserted.name, inserted.email, inserted.role, inserted.createdAt, inserted.companyId
                VALUES (@name, @email, @password, @role, @companyId);
            `);

            const newUser = insertResult.recordset[0];

            // Yeni eklenen kullanıcıya şirket adını ekle (zaten bu şirkette olacak)
            const companyNameRequest = new sql.Request(transaction);
            companyNameRequest.input('cId', sql.Int, newUser.companyId);
            const companyNameResult = await companyNameRequest.query('SELECT name FROM Companies WHERE id = @cId');
            newUser.companyName = companyNameResult.recordset[0]?.name;

            await transaction.commit();
            res.status(201).json(newUser); // Şifre olmadan kullanıcı bilgisi döner

        } catch (error) {
            await transaction.rollback();
            console.error("Şirket kullanıcısı oluşturma (Corporate - Transaction) hatası:", error);
            if (error.number === 2601 || error.number === 2627) { // Unique constraint email
                return res.status(400).json({ message: 'E-posta adresi zaten kullanılıyor (Tekrar kontrol).' });
            }
            // companyId için FK hatası burada olmamalı çünkü req.user.companyId'den geliyor ve geçerli olmalı.
            res.status(500).json({ message: 'Kullanıcı oluşturulurken bir sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Şirket kullanıcısı oluşturma (Corporate - Connection/Begin) hatası:", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// Kurumsal kullanıcının kendi şirketindeki kullanıcıları listeleme
// Bu fonksiyon `getMyCompanyUsersForSelection` için zaten planlanmıştı, şimdi tam liste için de kullanılabilir.
const getCompanyUsers = async (req, res) => {
    const corporateCompanyId = req.user.companyId;
    // const { search, page = 1, limit = 10 } = req.query; // İleride sayfalama ve arama eklenebilir

    if (!corporateCompanyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('companyId', sql.Int, corporateCompanyId);

        // Şimdilik basit bir liste, ileride sayfalama, arama, filtreleme eklenebilir
        const result = await request.query(
            'SELECT id, name, email, role, createdAt FROM Users WHERE companyId = @companyId ORDER BY createdAt DESC'
        );
        
        // Frontend'in beklediği formatı { data: result.recordset } olarak ayarlayabiliriz
        // veya direkt result.recordset gönderebiliriz. `getMyCompanyUsersForSelection` ile tutarlı olmalı.
        res.status(200).json(result.recordset); // Şimdilik direkt array dönsün

    } catch (error) {
        console.error("Şirket kullanıcılarını getirme hatası (Corporate):", error);
        res.status(500).json({ message: 'Kullanıcılar getirilirken sunucu hatası oluştu.' });
    }
};

module.exports = {
    getCompanyCards,
    createCompanyCard,
    createCompanyUser,
    getCompanyUsers
}; 