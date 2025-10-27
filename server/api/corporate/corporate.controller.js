const { getPool, sql } = require('../../config/db');
const bcrypt = require('bcryptjs');
const { generateQRCodeDataURL, checkSlugUniqueness } = require('../admin/cards/card.controller');
const { sendCorporateUserCredentials } = require('../../services/emailService');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

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
        
        // Önce Cards tablosunda companyId kolonu var mı kontrol et
        const columnCheckResult = await pool.request()
            .query(`
                SELECT COUNT(*) as hasCompanyId 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'companyId'
            `);
        
        const hasCompanyIdColumn = columnCheckResult.recordset[0].hasCompanyId > 0;
        
        if (!hasCompanyIdColumn) {
            // CompanyId kolonu yoksa boş liste döndür
            return res.status(200).json({
                success: true,
                data: [],
                totalCount: 0,
                page: pageNum,
                limit: limitNum,
                totalPages: 0,
                message: 'CompanyId kolonu henüz eklenmemiş. Database migration çalıştırın.'
            });
        }

        const request = pool.request();

        // Her zaman kullanıcının şirket ID'si ile filtrele
        request.input('companyId', sql.Int, companyId);
        
        let baseQuery = `FROM Cards c 
                        LEFT JOIN Users u ON c.userId = u.id 
                        LEFT JOIN SimpleWizardTokens swt ON c.id = swt.cardId 
                        WHERE (c.companyId = @companyId OR u.companyId = @companyId)`;
        let whereConditions = []; // Temel companyId filtresi zaten baseQuery'de

        if (search) {
            whereConditions.push('(c.cardName LIKE @searchTerm OR c.name LIKE @searchTerm OR u.name LIKE @searchTerm)');
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
            SELECT c.*, 
                   COALESCE(u.name, 'Sihirbaz Kartı') as userName, 
                   COALESCE(u.email, c.email) as userEmail,
                   CASE 
                       WHEN swt.cardId IS NOT NULL THEN 'Sihirbaz ile oluşturuldu'
                       ELSE 'Manuel oluşturuldu'
                   END as creationType
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
            success: true,
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
    const { userId, name, title, email, phone, website, address, isActive = true, customSlug } = req.body;

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
            insertRequest.input('isActive', sql.Bit, isActive);
            insertRequest.input('customSlug', sql.NVarChar, slugToCheck);
            
            const insertResult = await insertRequest.query(`
                INSERT INTO Cards (companyId, userId, name, title, email, phone, website, address, isActive, customSlug)
                VALUES (@companyId, @userId, @name, @title, @email, @phone, @website, @address, @isActive, @customSlug)
            `);

            // Son eklenen kartı al
            const selectRequest = new sql.Request(transaction);
            selectRequest.input('companyId', sql.Int, corporateCompanyId);
            const selectResult = await selectRequest.query('SELECT TOP 1 * FROM Cards WHERE companyId = @companyId ORDER BY id DESC');

            if (selectResult.recordset.length === 0) {
                throw new Error('Kart oluşturulamadı, ekleme sonucu boş.');
            }

            let newCard = selectResult.recordset[0];

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
            res.status(201).json({
                success: true,
                data: newCard
            });

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

    // Kurumsal kullanıcı 'user' ve 'corporate' rolünde kullanıcı ekleyebilir
    if (role !== 'user' && role !== 'corporate') {
        return res.status(400).json({ message: 'Sadece \'user\' veya \'corporate\' rolünde kullanıcı oluşturabilirsiniz.' });
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
            
            // Kullanıcıya email gönder
            const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
            const emailResult = await sendCorporateUserCredentials(
                email, 
                name, 
                email, 
                password, // Orijinal şifre (henüz hashlenmemiş hali kaydetmiyoruz, sadece emailde gösteriyoruz)
                newUser.companyName,
                loginUrl
            );
            
            if (emailResult.success) {
                console.log('Kurumsal kullanıcı emaili başarıyla gönderildi:', emailResult.messageId);
            } else {
                console.warn('Kurumsal kullanıcı emaili gönderilemedi:', emailResult.message);
                // Email gönderilemese bile kullanıcı oluşturuldu, hata döndürmeyelim
            }
            
            res.status(201).json({
                success: true,
                data: newUser,
                emailSent: emailResult.success
            }); // Şifre olmadan kullanıcı bilgisi döner

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
        
        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Şirket kullanıcılarını getirme hatası (Corporate):", error);
        res.status(500).json({ message: 'Kullanıcılar getirilirken sunucu hatası oluştu.' });
    }
};

// @desc    Get company information for logged-in corporate user
// @route   GET /api/corporate/company
// @access  Private/Corporate
const getCompanyInfo = async (req, res) => {
    const companyId = req.user.companyId;

    if (!companyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('companyId', sql.Int, companyId)
            .query('SELECT id, name, userLimit, cardLimit, status, phone, website, address, language, createdAt, updatedAt FROM Companies WHERE id = @companyId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Şirket bulunamadı.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Şirket bilgilerini getirme hatası (Corporate):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Update company information for logged-in corporate user
// @route   PUT /api/corporate/company
// @access  Private/Corporate
const updateCompanyInfo = async (req, res) => {
    const companyId = req.user.companyId;
    const { name, phone, website, address } = req.body;

    if (!companyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    try {
        const pool = await getPool();
        
        // Şirketin varlığını kontrol et
        const checkResult = await pool.request()
            .input('companyId', sql.Int, companyId)
            .query('SELECT id FROM Companies WHERE id = @companyId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Şirket bulunamadı.' });
        }

        // Şirket bilgilerini güncelle
        await pool.request()
            .input('companyId', sql.Int, companyId)
            .input('name', sql.NVarChar, name)
            .input('phone', sql.NVarChar, phone || null)
            .input('website', sql.NVarChar, website || null)
            .input('address', sql.NVarChar, address || null)
            .input('updatedAt', sql.DateTime2, new Date())
            .query('UPDATE Companies SET name = @name, phone = @phone, website = @website, address = @address, updatedAt = @updatedAt WHERE id = @companyId');

        // Güncellenmiş şirket bilgilerini getir
        const updatedResult = await pool.request()
            .input('companyId', sql.Int, companyId)
            .query('SELECT id, name, userLimit, cardLimit, status, phone, website, address, language, createdAt, updatedAt FROM Companies WHERE id = @companyId');

        res.status(200).json(updatedResult.recordset[0]);
    } catch (error) {
        console.error("Şirket bilgileri güncelleme hatası (Corporate):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Update company language for logged-in corporate user
// @route   PUT /api/corporate/company/language
// @access  Private/Corporate
const updateCompanyLanguage = async (req, res) => {
    const companyId = req.user.companyId;
    const { language } = req.body;

    if (!companyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    // Dil validasyonu
    const validLanguages = ['tr', 'en', 'ar', 'ru', 'pt'];
    if (!language || !validLanguages.includes(language)) {
        return res.status(400).json({ message: 'Geçersiz dil seçimi. Geçerli diller: tr, en, ar, ru, pt' });
    }

    try {
        const pool = await getPool();
        
        // Şirketin varlığını kontrol et
        const checkResult = await pool.request()
            .input('companyId', sql.Int, companyId)
            .query('SELECT id FROM Companies WHERE id = @companyId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Şirket bulunamadı.' });
        }

        // Dili güncelle
        await pool.request()
            .input('companyId', sql.Int, companyId)
            .input('language', sql.NVarChar(5), language)
            .input('updatedAt', sql.DateTime2, new Date())
            .query('UPDATE Companies SET language = @language, updatedAt = @updatedAt WHERE id = @companyId');

        // Güncellenmiş şirket bilgilerini getir
        const updatedResult = await pool.request()
            .input('companyId', sql.Int, companyId)
            .query('SELECT id, name, userLimit, cardLimit, status, phone, website, address, language, createdAt, updatedAt FROM Companies WHERE id = @companyId');

        res.status(200).json(updatedResult.recordset[0]);
    } catch (error) {
        console.error("Şirket dili güncelleme hatası (Corporate):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Delete a card from the logged-in corporate user's company
// @route   DELETE /api/corporate/cards/:id
// @access  Private/Corporate
const deleteCompanyCard = async (req, res) => {
    const corporateCompanyId = req.user.companyId;
    const cardId = req.params.id;

    if (!corporateCompanyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();

        // 1. Kartın şirkete ait olup olmadığını kontrol et
        const checkResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('companyId', sql.Int, corporateCompanyId)
            .query('SELECT TOP 1 id, cardName FROM Cards WHERE id = @cardId AND companyId = @companyId');
        
        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Silinecek kartvizit bulunamadı veya şirketinize ait değil' });
        }

        // 2. Silme işlemini yap
        const deleteResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .query('DELETE FROM Cards WHERE id = @cardId');

        if (deleteResult.rowsAffected && deleteResult.rowsAffected[0] > 0) {
            const deletedCard = checkResult.recordset[0];
            
            res.status(200).json({ 
                message: 'Kartvizit başarıyla silindi', 
                id: cardId,
                cardName: deletedCard.cardName
            });
        } else {
            return res.status(404).json({ message: 'Silinecek kartvizit bulunamadı (tekrar kontrol)' });
        }

    } catch (error) {
        console.error("Kurumsal kartvizit silme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get a card by ID for corporate users (can access any card in their company)
// @route   GET /api/corporate/cards/:id
// @access  Private/Corporate
const getCompanyCardById = async (req, res) => {
    const corporateCompanyId = req.user.companyId;
    const cardId = req.params.id;

    if (!corporateCompanyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();

        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('companyId', sql.Int, corporateCompanyId)
            .query(`
                SELECT c.*, 
                       COALESCE(u.name, 'Sihirbaz Kartı') as userName, 
                       COALESCE(u.email, c.email) as userEmail,
                       CASE 
                           WHEN swt.cardId IS NOT NULL THEN 'Sihirbaz ile oluşturuldu'
                           ELSE 'Manuel oluşturuldu'
                       END as creationType
                FROM Cards c 
                LEFT JOIN Users u ON c.userId = u.id 
                LEFT JOIN SimpleWizardTokens swt ON c.id = swt.cardId 
                WHERE c.id = @cardId AND (c.companyId = @companyId OR u.companyId = @companyId)
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya şirketinize ait değil' });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Kurumsal kartvizit getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get bank accounts for a card (corporate users can access any card in their company)
// @route   GET /api/corporate/cards/:cardId/bank-accounts
// @access  Private/Corporate
const getCompanyCardBankAccounts = async (req, res) => {
    const corporateCompanyId = req.user.companyId;
    const cardId = req.params.cardId;

    if (!corporateCompanyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();

        // Önce kartın şirkete ait olup olmadığını kontrol et
        const cardCheck = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('companyId', sql.Int, corporateCompanyId)
            .query('SELECT TOP 1 id FROM Cards c LEFT JOIN Users u ON c.userId = u.id WHERE c.id = @cardId AND (c.companyId = @companyId OR u.companyId = @companyId)');

        if (cardCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya şirketinize ait değil' });
        }

        // Banka hesaplarını getir
        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .query('SELECT * FROM CardBankAccounts WHERE cardId = @cardId ORDER BY createdAt DESC');

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Kurumsal kart banka hesapları getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Export company cards to Excel
// @route   GET /api/corporate/cards/export
// @access  Private/Corporate
const exportCompanyCardsToExcel = async (req, res) => {
    const companyId = req.user.companyId;

    if (!companyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input('companyId', sql.Int, companyId);

        const result = await request.query(`
            SELECT c.*, 
                   COALESCE(u.name, 'Sihirbaz Kartı') as userName, 
                   COALESCE(u.email, c.email) as userEmail,
                   comp.name as companyName
            FROM Cards c 
            LEFT JOIN Users u ON c.userId = u.id 
            LEFT JOIN Companies comp ON c.companyId = comp.id
            WHERE c.companyId = @companyId
            ORDER BY c.createdAt DESC
        `);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kartvizitler');

        // Başlık satırı
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Kart Adı/Sahibi', key: 'name', width: 25 },
            { header: 'Özel URL Slug', key: 'customSlug', width: 20 },
            { header: 'Kart URL', key: 'cardUrl', width: 30 },
            { header: 'Ünvan', key: 'title', width: 20 },
            { header: 'Şirket Adı', key: 'companyName', width: 25 },
            { header: 'Kullanıcı Adı', key: 'userName', width: 20 },
            { header: 'Kullanıcı Email', key: 'userEmail', width: 25 },
            { header: 'Durum', key: 'status', width: 15 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Telefon', key: 'phone', width: 20 },
            { header: 'Web Sitesi', key: 'website', width: 25 },
            { header: 'Adres', key: 'address', width: 30 },
            { header: 'Oluşturulma Tarihi', key: 'createdAt', width: 20 },
            { header: 'Güncellenme Tarihi', key: 'updatedAt', width: 20 },
            { header: 'QR Kod Data URL', key: 'qrCodeData', width: 30 }
        ];

        // Veri satırları
        result.recordset.forEach(card => {
            const cardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/card/${card.customSlug || card.id}`;
            worksheet.addRow({
                id: card.id,
                name: card.name,
                customSlug: card.customSlug || '-',
                cardUrl: cardUrl,
                title: card.title || '-',
                companyName: card.companyName || '-',
                userName: card.userName || '-',
                userEmail: card.userEmail || '-',
                status: card.isActive ? 'Aktif' : 'Pasif',
                email: card.email || '-',
                phone: card.phone || '-',
                website: card.website || '-',
                address: card.address || '-',
                createdAt: new Date(card.createdAt).toLocaleString('tr-TR'),
                updatedAt: new Date(card.updatedAt).toLocaleString('tr-TR'),
                qrCodeData: card.qrCodeData || '-'
            });
        });

        // Başlık satırını kalın yap
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="kurumsal_kartvizit_listesi.xlsx"');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Kurumsal kartları Excel'e aktarma hatası:", error);
        res.status(500).json({ message: 'Excel dosyası oluşturulurken hata oluştu.' });
    }
};

// @desc    Import cards from Excel
// @route   POST /api/corporate/cards/import
// @access  Private/Corporate
const importCompanyCardsFromExcel = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Lütfen bir Excel dosyası yükleyin.' });
    }

    const companyId = req.user.companyId;

    if (!companyId) {
        return res.status(403).json({ message: 'Bu işlem için bir şirkete atanmış olmanız gerekmektedir.' });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const worksheet = workbook.getWorksheet(1);

        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            // İlk satır başlık olduğu için atla
            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                const row = worksheet.getRow(rowNumber);
                const cardData = {
                    name: row.getCell(2).value,
                    title: row.getCell(4).value,
                    email: row.getCell(10).value,
                    phone: row.getCell(11).value,
                    website: row.getCell(12).value,
                    address: row.getCell(13).value,
                    status: row.getCell(9).value === 'Aktif',
                    customSlug: row.getCell(3).value
                };

                if (!cardData.name) {
                    errorCount++;
                    errors.push(`Satır ${rowNumber}: Kart adı boş olamaz.`);
                    continue;
                }

                try {
                    const insertRequest = new sql.Request(transaction);
                    insertRequest.input('companyId', sql.Int, companyId);
                    insertRequest.input('name', sql.NVarChar, cardData.name);
                    insertRequest.input('title', sql.NVarChar, cardData.title || null);
                    insertRequest.input('email', sql.NVarChar, cardData.email || null);
                    insertRequest.input('phone', sql.NVarChar, cardData.phone || null);
                    insertRequest.input('website', sql.NVarChar, cardData.website || null);
                    insertRequest.input('address', sql.NVarChar, cardData.address || null);
                    insertRequest.input('isActive', sql.Bit, cardData.status);
                    insertRequest.input('customSlug', sql.NVarChar, cardData.customSlug || null);

                    await insertRequest.query(`
                        INSERT INTO Cards (companyId, name, title, email, phone, website, address, isActive, customSlug)
                        VALUES (@companyId, @name, @title, @email, @phone, @website, @address, @isActive, @customSlug)
                    `);

                    successCount++;
                } catch (insertError) {
                    errorCount++;
                    errors.push(`Satır ${rowNumber}: ${insertError.message}`);
                }
            }

            await transaction.commit();

            // Geçici dosyayı sil
            fs.unlinkSync(req.file.path);

            res.status(200).json({
                success: true,
                message: `İçeri aktarma tamamlandı. ${successCount} kart başarıyla eklendi, ${errorCount} kart eklenemedi.`,
                successCount,
                errorCount,
                errors: errors.slice(0, 10) // İlk 10 hatayı göster
            });

        } catch (error) {
            await transaction.rollback();
            fs.unlinkSync(req.file.path);
            throw error;
        }

    } catch (error) {
        console.error("Kurumsal kartları Excel'den içeri aktarma hatası:", error);
        res.status(500).json({ message: 'Excel dosyası işlenirken hata oluştu.' });
    }
};

module.exports = {
    getCompanyCards,
    createCompanyCard,
    getCompanyCardById,
    deleteCompanyCard,
    getCompanyCardBankAccounts,
    createCompanyUser,
    getCompanyUsers,
    getCompanyInfo,
    updateCompanyInfo,
    updateCompanyLanguage,
    exportCompanyCardsToExcel,
    importCompanyCardsFromExcel
}; 