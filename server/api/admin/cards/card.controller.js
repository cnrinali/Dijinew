const { getPool, sql } = require('../../../config/db'); // DB bağlantısı
const qrcode = require('qrcode'); // QR kod oluşturma kütüphanesi
const bcrypt = require('bcryptjs'); // Şifre hashleme için (eğer kullanıcı oluşturma eklenirse)

// Helper function to generate QR code data URL
const generateQRCodeDataURL = async (cardData) => {
    // QR kod içeriğini oluştur
    // Öncelikli olarak customSlug varsa onu, yoksa id'yi kullan
    // URL'yi göreceli yol olarak oluşturuyoruz
    const cardPath = cardData.customSlug ? `/card/${cardData.customSlug}` : `/card/${cardData.id}`;
    // Tam URL için domain ekleyebilirsiniz: const fullUrl = `http://localhost:5173${cardPath}`;
    console.log("Generating QR code for path:", cardPath);

    try {
        // QR kodu Data URL formatında oluştur
        return await qrcode.toDataURL(cardPath); // İçerik olarak yolu kullan
    } catch (err) {
        console.error('QR Code generation failed:', err);
        return null; // Hata durumunda null dön
    }
};

// Helper function to check if slug is unique
const checkSlugUniqueness = async (slug, currentCardId = null, transaction) => {
    if (!slug) return true; // Boş slug her zaman benzersiz kabul edilir
    // Transaction'a bağlı yeni bir request oluştur
    const checkRequest = new sql.Request(transaction);
    checkRequest.input('slug', sql.NVarChar, slug);
    let query = 'SELECT TOP 1 id FROM Cards WHERE customSlug = @slug';
    if (currentCardId) {
        query += ' AND id <> @currentCardId';
        checkRequest.input('currentCardId', sql.Int, currentCardId);
    }
    const result = await checkRequest.query(query); // Artık çalışmalı
    return result.recordset.length === 0;
};

// @desc    Get all cards (optionally filter by company)
// @route   GET /api/admin/cards
// @route   GET /api/admin/companies/:companyId/cards
// @access  Private/Admin
const getCards = async (req, res) => {
    const companyIdParam = req.params.companyId;
    console.log(`getCards controller çağrıldı${companyIdParam ? ` for company ${companyIdParam}` : ''}`);
    try {
        const pool = await getPool();
        let query = `
            SELECT 
                c.id, c.name, c.title, c.email, c.phone, c.website, c.address, 
                c.status, c.qrCodeData, c.createdAt, c.updatedAt, 
                c.customSlug, -- customSlug'ı da seçelim
                c.companyId, co.name as companyName,
                c.userId, u.name as userName, u.email as userEmail
            FROM Cards c 
            LEFT JOIN Companies co ON c.companyId = co.id 
            LEFT JOIN Users u ON c.userId = u.id
        `;
        let request = pool.request();
        let whereConditions = [];

        if (companyIdParam) {
            whereConditions.push('c.companyId = @companyIdParam');
            request.input('companyIdParam', sql.Int, companyIdParam);
        }
        
        if (whereConditions.length > 0) {
             query += ` WHERE ${whereConditions.join(' AND ')}`;
        }

        query += ' ORDER BY c.createdAt DESC';

        // console.log("Executing card list query:", query);
        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Kartları listeleme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Create a new card (Individual or Corporate)
// @route   POST /api/admin/cards
// @access  Private/Admin
const createCard = async (req, res) => {
    console.log("createCard controller çağrıldı", req.body);
    // customSlug'ı da req.body'den al
    const { companyId, userId, name, title, email, phone, website, address, status, customSlug } = req.body; 

    if (!name) {
        return res.status(400).json({ message: 'Kart Adı zorunludur.' });
    }
    
    const slugToCheck = customSlug && customSlug.trim() ? customSlug.trim() : null;

    let companyIdToSet = null;
    let userIdToSet = null;
    const parsedCompanyId = companyId ? parseInt(companyId, 10) : null;
    const parsedUserId = userId ? parseInt(userId, 10) : null;
    if (parsedCompanyId && !isNaN(parsedCompanyId)) {
        companyIdToSet = parsedCompanyId;
        userIdToSet = (parsedUserId && !isNaN(parsedUserId)) ? parsedUserId : null;
    } else if (parsedUserId && !isNaN(parsedUserId)) {
        userIdToSet = parsedUserId;
    } else {
        return res.status(400).json({ message: 'Kart oluşturmak için geçerli bir Şirket ID veya Kullanıcı ID belirtilmelidir.' });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
             // Slug benzersiz mi kontrol et (varsa)
            if (slugToCheck) {
                const isUnique = await checkSlugUniqueness(slugToCheck, null, transaction);
                if (!isUnique) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Bu özel URL (${slugToCheck}) zaten kullanılıyor.` });
                }
            }

            // Eğer companyId varsa, şirket var mı kontrol et
            if (companyIdToSet !== null) {
                const companyCheckRequest = new sql.Request(transaction);
                companyCheckRequest.input('cId', sql.Int, companyIdToSet);
                const companyCheckResult = await companyCheckRequest.query('SELECT TOP 1 id FROM Companies WHERE id = @cId');
                if (companyCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: `Belirtilen şirket bulunamadı (ID: ${companyIdToSet}).` });
                }
            }

            // Eğer userId varsa, kullanıcı var mı kontrol et
            if (userIdToSet !== null) {
                const userCheckRequest = new sql.Request(transaction);
                userCheckRequest.input('uId', sql.Int, userIdToSet);
                const userCheckResult = await userCheckRequest.query('SELECT TOP 1 id FROM Users WHERE id = @uId');
                if (userCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: `Belirtilen kullanıcı bulunamadı (ID: ${userIdToSet}).` });
                }
            }

            // Kartı ekle (customSlug ile)
            const insertRequest = new sql.Request(transaction);
            insertRequest.input('companyId', sql.Int, companyIdToSet);
            insertRequest.input('userId', sql.Int, userIdToSet);
            insertRequest.input('name', sql.NVarChar, name);
            insertRequest.input('title', sql.NVarChar, title);
            insertRequest.input('email', sql.NVarChar, email);
            insertRequest.input('phone', sql.NVarChar, phone);
            insertRequest.input('website', sql.NVarChar, website);
            insertRequest.input('address', sql.NVarChar, address);
            insertRequest.input('status', sql.Bit, status !== undefined ? status : true);
            insertRequest.input('customSlug', sql.NVarChar, slugToCheck); // slug'ı ekle (null olabilir)
            
            // INSERT ve OUTPUT sorgusuna customSlug ekle
            const insertResult = await insertRequest.query(`
                INSERT INTO Cards (companyId, userId, name, title, email, phone, website, address, status, customSlug)
                OUTPUT INSERTED.id, INSERTED.companyId, INSERTED.userId, INSERTED.name, INSERTED.title, INSERTED.email, INSERTED.phone, INSERTED.website, INSERTED.address, INSERTED.status, INSERTED.customSlug, INSERTED.createdAt, INSERTED.updatedAt 
                VALUES (@companyId, @userId, @name, @title, @email, @phone, @website, @address, @status, @customSlug)
            `);

            if (insertResult.recordset.length === 0) {
                throw new Error('Kart oluşturulamadı, ekleme sonucu boş.');
            }

            const newCard = insertResult.recordset[0];

            // QR Kodunu oluştur (newCard'da customSlug olacak)
            const qrCodeData = await generateQRCodeDataURL(newCard);
            if (qrCodeData) {
                 // ... (QR kod güncelleme aynı)
                 const qrUpdateRequest = new sql.Request(transaction);
                 qrUpdateRequest.input('cardId', sql.Int, newCard.id);
                 qrUpdateRequest.input('qrCodeData', sql.NVarChar, qrCodeData);
                 await qrUpdateRequest.query('UPDATE Cards SET qrCodeData = @qrCodeData WHERE id = @cardId');
                 newCard.qrCodeData = qrCodeData; 
            }
            
            // Yanıta şirket ve kullanıcı adını da ekleyelim (varsa)
            if (newCard.companyId) {
                 const companyNameRequest = new sql.Request(transaction);
                 companyNameRequest.input('cId', sql.Int, newCard.companyId);
                 const companyNameResult = await companyNameRequest.query('SELECT name FROM Companies WHERE id = @cId');
                 newCard.companyName = companyNameResult.recordset[0]?.name;
            }
             if (newCard.userId) {
                 const userNameRequest = new sql.Request(transaction);
                 userNameRequest.input('uId', sql.Int, newCard.userId);
                 const userNameResult = await userNameRequest.query('SELECT name, email FROM Users WHERE id = @uId');
                 newCard.userName = userNameResult.recordset[0]?.name;
                 newCard.userEmail = userNameResult.recordset[0]?.email;
            }

            await transaction.commit();
            res.status(201).json(newCard);

        } catch (error) {
            // ... (hata yönetimi aynı, belki slug unique hatası eklenebilir)
            await transaction.rollback();
            console.error("Kart oluşturma hatası (Transaction):", error);
            if (error.number === 547) { // Foreign key constraint
                return res.status(400).json({ message: 'Geçersiz Şirket veya Kullanıcı ID.' });
            }
            // SQL unique constraint hatası (varsa)
            if (error.number === 2627 || error.number === 2601) { 
                 return res.status(400).json({ message: 'Bu özel URL zaten kullanılıyor (DB Kısıtlaması).' });
            }
            res.status(500).json({ message: 'Sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kart oluşturma hatası (Connection/Begin):", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};


// @desc    Update a card (Individual or Corporate)
// @route   PUT /api/admin/cards/:id
// @access  Private/Admin
const updateCard = async (req, res) => {
    const cardId = req.params.id;
    // customSlug'ı da req.body'den al
    const { companyId, userId, name, title, email, phone, website, address, status, customSlug } = req.body; 
    console.log(`updateCard controller çağrıldı, ID: ${cardId}`, req.body);

    if (!name) { return res.status(400).json({ message: 'Kart Adı zorunludur.' }); }
    if (isNaN(parseInt(cardId))) { return res.status(400).json({ message: 'Geçersiz Kart ID.' }); }

    const slugToCheck = customSlug !== undefined ? (customSlug && customSlug.trim() ? customSlug.trim() : null) : undefined;
    let updateSlug = customSlug !== undefined;

    let companyIdToSet = null;
    let userIdToSet = null;
    let updateCompanyId = false;
    let updateUserId = false;
    if (companyId !== undefined) {
        updateCompanyId = true;
        const parsedCompanyId = companyId ? parseInt(companyId, 10) : null;
        if (companyId !== null && (isNaN(parsedCompanyId) || parsedCompanyId <= 0)) {
            return res.status(400).json({ message: 'Geçersiz Şirket ID formatı.' });
        }
        companyIdToSet = parsedCompanyId; // null veya geçerli ID
    }

    if (userId !== undefined) {
        updateUserId = true;
        const parsedUserId = userId ? parseInt(userId, 10) : null;
        if (userId !== null && (isNaN(parsedUserId) || parsedUserId <= 0)) {
            return res.status(400).json({ message: 'Geçersiz Kullanıcı ID formatı.' });
        }
        userIdToSet = parsedUserId; // null veya geçerli ID
    }

    // Mantıksal kontrol: Hem companyId hem de userId null olamaz (güncelleme sonrası)
    // Eğer companyId null'a çekiliyorsa, userId null olamaz.
    // Eğer userId null'a çekiliyorsa, companyId null olamaz.
    const finalCompanyId = updateCompanyId ? companyIdToSet : undefined; // Güncellenmiyorsa undefined
    const finalUserId = updateUserId ? userIdToSet : undefined;          // Güncellenmiyorsa undefined
    
    // Bu kontrol backend'de biraz karmaşık, frontend'de validasyon yapmak daha iyi olabilir.
    // Şimdilik sadece temel kontrolleri yapalım.
    if (updateCompanyId && companyIdToSet === null && updateUserId && userIdToSet === null) {
         return res.status(400).json({ message: 'Bir kart hem şirketsiz hem de kullanıcısız olamaz.' });
    }
    // Not: Eğer sadece biri güncelleniyorsa, diğerinin mevcut değerini DB'den çekip kontrol etmek gerekebilir.
    // Şimdilik bu kontrolü atlıyoruz, frontend'in doğru veri göndereceğini varsayıyoruz.


    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Güncellenecek kart var mı kontrolü
            const cardCheckRequest = new sql.Request(transaction);
            cardCheckRequest.input('cardId', sql.Int, cardId);
            const cardCheckResult = await cardCheckRequest.query('SELECT TOP 1 id, companyId, userId, customSlug FROM Cards WHERE id = @cardId');
            if (cardCheckResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: `Güncellenecek kart bulunamadı (ID: ${cardId}).` });
            }
            const currentCard = cardCheckResult.recordset[0];

            // Slug güncelleniyorsa ve null değilse, benzersiz mi kontrol et
            if (updateSlug && slugToCheck !== null) {
                 if (slugToCheck !== currentCard.customSlug) {
                    const isUnique = await checkSlugUniqueness(slugToCheck, cardId, transaction);
                    if (!isUnique) {
                        await transaction.rollback();
                        return res.status(400).json({ message: `Bu özel URL (${slugToCheck}) zaten başka bir kart tarafından kullanılıyor.` });
                    }
                 }
            }

            // Eğer companyId null değilse ve güncelleniyorsa, şirket var mı kontrol et
            if (updateCompanyId && companyIdToSet !== null) {
                const companyCheckRequest = new sql.Request(transaction);
                companyCheckRequest.input('cId', sql.Int, companyIdToSet);
                const companyCheckResult = await companyCheckRequest.query('SELECT TOP 1 id FROM Companies WHERE id = @cId');
                if (companyCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: `Belirtilen şirket bulunamadı (ID: ${companyIdToSet}).` });
                }
            }

            // Eğer userId null değilse ve güncelleniyorsa, kullanıcı var mı kontrol et
            if (updateUserId && userIdToSet !== null) {
                const userCheckRequest = new sql.Request(transaction);
                userCheckRequest.input('uId', sql.Int, userIdToSet);
                const userCheckResult = await userCheckRequest.query('SELECT TOP 1 id FROM Users WHERE id = @uId');
                if (userCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: `Belirtilen kullanıcı bulunamadı (ID: ${userIdToSet}).` });
                }
            }
            
            // Son durumu tekrar kontrol et (eğer sadece biri güncelleniyorsa)
             const finalCompanyIdResolved = updateCompanyId ? companyIdToSet : currentCard.companyId;
             const finalUserIdResolved = updateUserId ? userIdToSet : currentCard.userId;
             if(finalCompanyIdResolved === null && finalUserIdResolved === null){
                 await transaction.rollback();
                 return res.status(400).json({ message: 'Bir kart hem şirketsiz hem de kullanıcısız bırakılamaz.' });
             }

            // Kartı güncelle
            const updateRequest = new sql.Request(transaction);
            // Input parametrelerini tanımla
            updateRequest.input('cardId', sql.Int, cardId);
            updateRequest.input('name', sql.NVarChar, name);
            updateRequest.input('title', sql.NVarChar, title);
            updateRequest.input('email', sql.NVarChar, email);
            updateRequest.input('phone', sql.NVarChar, phone);
            updateRequest.input('website', sql.NVarChar, website);
            updateRequest.input('address', sql.NVarChar, address);
            updateRequest.input('updatedAt', sql.DateTime2, new Date());

            let setClauses = 'name=@name, title=@title, email=@email, phone=@phone, website=@website, address=@address, updatedAt=@updatedAt';

            if (status !== undefined) {
                 setClauses += ', status=@status';
                 updateRequest.input('status', sql.Bit, status === true || status === 1);
            }
            if (updateCompanyId) {
                 setClauses += ', companyId=@companyId';
                 updateRequest.input('companyId', sql.Int, companyIdToSet); // null olabilir
            }
             if (updateUserId) {
                 setClauses += ', userId=@userId';
                 updateRequest.input('userId', sql.Int, userIdToSet); // null olabilir
            }
            // customSlug'ı da ekle
            if (updateSlug) {
                setClauses += ', customSlug=@customSlug';
                updateRequest.input('customSlug', sql.NVarChar, slugToCheck); // null olabilir
            }

            // OUTPUT tablosuna ve sorgusuna customSlug ekle
            const declareOutputTable = `
                DECLARE @UpdatedCards TABLE (
                    id INT, companyId INT NULL, userId INT NULL, name NVARCHAR(MAX),
                    title NVARCHAR(MAX), email NVARCHAR(MAX), phone NVARCHAR(MAX),
                    website NVARCHAR(MAX), address NVARCHAR(MAX), status BIT,
                    customSlug NVARCHAR(MAX) NULL, -- Eklendi
                    createdAt DATETIME2, updatedAt DATETIME2, qrCodeData NVARCHAR(MAX) NULL
                );
            `;
            
            const updateQuery = `
                ${declareOutputTable}
                UPDATE Cards SET ${setClauses}
                OUTPUT INSERTED.id, INSERTED.companyId, INSERTED.userId, INSERTED.name, INSERTED.title, INSERTED.email, INSERTED.phone, INSERTED.website, INSERTED.address, INSERTED.status, INSERTED.customSlug, INSERTED.createdAt, INSERTED.updatedAt, INSERTED.qrCodeData 
                INTO @UpdatedCards
                WHERE id = @cardId;

                SELECT * FROM @UpdatedCards;
            `;
            
            const updateResult = await updateRequest.query(updateQuery);

            if (updateResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Kart güncellenirken bir hata oluştu.' });
            }

            const updatedCard = updateResult.recordset[0];
            
            // QR Kodunu yeniden oluştur (updatedCard'da yeni slug olabilir)
            const qrCodeData = await generateQRCodeDataURL(updatedCard);
            if (qrCodeData && qrCodeData !== updatedCard.qrCodeData) { // Sadece değiştiyse güncelle
                 const qrUpdateRequest = new sql.Request(transaction);
                 qrUpdateRequest.input('cardId', sql.Int, updatedCard.id);
                 qrUpdateRequest.input('qrCodeData', sql.NVarChar, qrCodeData);
                 await qrUpdateRequest.query('UPDATE Cards SET qrCodeData = @qrCodeData WHERE id = @cardId');
                 updatedCard.qrCodeData = qrCodeData; 
            }
            
            // Yanıta şirket ve kullanıcı adını da ekleyelim (varsa)
             if (updatedCard.companyId) {
                 const companyNameRequest = new sql.Request(transaction);
                 companyNameRequest.input('cId', sql.Int, updatedCard.companyId);
                 const companyNameResult = await companyNameRequest.query('SELECT name FROM Companies WHERE id = @cId');
                 updatedCard.companyName = companyNameResult.recordset[0]?.name;
            }
             if (updatedCard.userId) {
                 const userNameRequest = new sql.Request(transaction);
                 userNameRequest.input('uId', sql.Int, updatedCard.userId);
                 const userNameResult = await userNameRequest.query('SELECT name, email FROM Users WHERE id = @uId');
                 updatedCard.userName = userNameResult.recordset[0]?.name;
                 updatedCard.userEmail = userNameResult.recordset[0]?.email;
            }

            await transaction.commit();
            res.status(200).json(updatedCard);

        } catch (error) {
            await transaction.rollback();
            console.error("Kart güncelleme hatası (Transaction):", error);
             if (error.number === 547) { // Foreign key constraint
                return res.status(400).json({ message: 'Geçersiz Şirket veya Kullanıcı ID.' });
            }
            // SQL unique constraint hatası (varsa)
            if (error.number === 2627 || error.number === 2601) { 
                 return res.status(400).json({ message: 'Bu özel URL zaten kullanılıyor (DB Kısıtlaması).' });
            }
            res.status(500).json({ message: 'Sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kart güncelleme hatası (Connection/Begin):", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// @desc    Delete a card
// @route   DELETE /api/admin/cards/:id
// @access  Private/Admin
const deleteCard = async (req, res) => {
    const cardId = req.params.id;
    console.log(`deleteCard controller çağrıldı, ID: ${cardId}`);

     if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID.' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId)) // parseInt eklendi
            .query('DELETE FROM Cards WHERE id = @cardId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Silinecek kart bulunamadı.' });
        }

        res.status(200).json({ message: 'Kart başarıyla silindi.', id: parseInt(cardId) }); // ID'yi de döndür

    } catch (error) {
        console.error("Kart silme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};


module.exports = {
    getCards,
    createCard,
    updateCard,
    deleteCard // deleteCard'ı unutmayalım
}; 