const { getPool, sql } = require('../../../config/db'); // DB bağlantısı
const qrcode = require('qrcode'); // QR kod oluşturma kütüphanesi
const bcrypt = require('bcryptjs'); // Şifre hashleme için (eğer kullanıcı oluşturma eklenirse)
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

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
                c.customSlug, c.isActive, c.permanentSlug,
                c.companyId, co.name as companyName,
                c.userId, u.name as userName, u.email as userEmail,
                swt.token as wizardToken, swt.isUsed as wizardUsed,
                CASE 
                    WHEN swt.token IS NOT NULL AND c.isActive = 0 THEN 1 
                    ELSE 0 
                END as showWizardLink
            FROM Cards c 
            LEFT JOIN Companies co ON c.companyId = co.id 
            LEFT JOIN Users u ON c.userId = u.id
            LEFT JOIN SimpleWizardTokens swt ON c.id = swt.cardId AND swt.isUsed = 0
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

// @desc    Export cards to Excel
// @route   GET /api/admin/cards/export
// @access  Private/Admin
const exportCardsToExcel = async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                c.id, c.name, c.title, c.email, c.phone, c.website, c.address, 
                c.status, c.customSlug, c.createdAt, c.updatedAt,
                co.name as companyName,
                u.name as userName, u.email as userEmail
            FROM Cards c 
            LEFT JOIN Companies co ON c.companyId = co.id 
            LEFT JOIN Users u ON c.userId = u.id
            ORDER BY c.createdAt DESC
        `);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Kartvizitler');

        // Başlıkları ekle
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Kart Adı', key: 'name', width: 30 },
            { header: 'Ünvan', key: 'title', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Telefon', key: 'phone', width: 20 },
            { header: 'Website', key: 'website', width: 30 },
            { header: 'Adres', key: 'address', width: 40 },
            { header: 'Durum', key: 'status', width: 10 },
            { header: 'Özel URL', key: 'customSlug', width: 30 },
            { header: 'Şirket', key: 'companyName', width: 30 },
            { header: 'Kullanıcı Adı', key: 'userName', width: 30 },
            { header: 'Kullanıcı Email', key: 'userEmail', width: 30 },
            { header: 'Oluşturulma Tarihi', key: 'createdAt', width: 20 },
            { header: 'Güncelleme Tarihi', key: 'updatedAt', width: 20 }
        ];

        // Verileri ekle
        result.recordset.forEach(card => {
            worksheet.addRow({
                ...card,
                status: card.status ? 'Aktif' : 'Pasif',
                createdAt: new Date(card.createdAt).toLocaleString('tr-TR'),
                updatedAt: new Date(card.updatedAt).toLocaleString('tr-TR')
            });
        });

        // Stil ayarları
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=kartvizitler.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Excel export hatası:", error);
        res.status(500).json({ message: 'Excel dışa aktarma hatası oluştu.' });
    }
};

// @desc    Import cards from Excel
// @route   POST /api/admin/cards/import
// @access  Private/Admin
const importCardsFromExcel = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Lütfen bir Excel dosyası yükleyin.' });
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
                    title: row.getCell(3).value,
                    email: row.getCell(4).value,
                    phone: row.getCell(5).value,
                    website: row.getCell(6).value,
                    address: row.getCell(7).value,
                    status: row.getCell(8).value === 'Aktif',
                    customSlug: row.getCell(9).value
                };

                if (!cardData.name) {
                    errorCount++;
                    errors.push(`Satır ${rowNumber}: Kart adı boş olamaz.`);
                    continue;
                }

                try {
                    const insertRequest = new sql.Request(transaction);
                    Object.keys(cardData).forEach(key => {
                        insertRequest.input(key, sql.NVarChar, cardData[key]);
                    });

                    await insertRequest.query(`
                        INSERT INTO Cards (name, title, email, phone, website, address, status, customSlug)
                        VALUES (@name, @title, @email, @phone, @website, @address, @status, @customSlug)
                    `);

                    successCount++;
                } catch (err) {
                    errorCount++;
                    errors.push(`Satır ${rowNumber}: ${err.message}`);
                }
            }

            await transaction.commit();

            // Geçici dosyayı sil
            fs.unlinkSync(req.file.path);

            res.status(200).json({
                message: 'Excel içe aktarma tamamlandı.',
                successCount,
                errorCount,
                errors: errors.length > 0 ? errors : undefined
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error("Excel import hatası:", error);
        res.status(500).json({ message: 'Excel içe aktarma hatası oluştu.' });
    }
};

// @desc    Generate bulk QR codes
// @route   GET /api/admin/cards/qr-codes
// @access  Private/Admin
const generateBulkQRCodes = async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT c.id, c.name, c.customSlug, u.name as userName, co.name as companyName
            FROM Cards c
            LEFT JOIN Users u ON c.userId = u.id
            LEFT JOIN Companies co ON c.companyId = co.id
            WHERE c.status = 1
        `);

        const tempDir = path.join(__dirname, '../../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=qr-codes.zip');

        archive.pipe(res);

        for (const card of result.recordset) {
            const cardPath = card.customSlug ? `/card/${card.customSlug}` : `/card/${card.id}`;
            const qrCodeData = await qrcode.toDataURL(cardPath);
            const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Dosya adını oluştur
            let fileName = card.name;
            if (card.userName) {
                fileName += `-${card.userName}`;
            }
            if (card.companyName) {
                fileName += `-${card.companyName}`;
            }
            // Türkçe karakterleri ve boşlukları düzelt
            fileName = fileName
                .replace(/[ğ]/g, 'g')
                .replace(/[ü]/g, 'u')
                .replace(/[ş]/g, 's')
                .replace(/[ı]/g, 'i')
                .replace(/[ö]/g, 'o')
                .replace(/[ç]/g, 'c')
                .replace(/[Ğ]/g, 'G')
                .replace(/[Ü]/g, 'U')
                .replace(/[Ş]/g, 'S')
                .replace(/[İ]/g, 'I')
                .replace(/[Ö]/g, 'O')
                .replace(/[Ç]/g, 'C')
                .replace(/\s+/g, '-')
                .toLowerCase();
            
            archive.append(buffer, { name: `qr-${fileName}.png` });
        }

        await archive.finalize();
    } catch (error) {
        console.error("QR kod oluşturma hatası:", error);
        res.status(500).json({ message: 'QR kod oluşturma hatası oluştu.' });
    }
};

// @desc    Get single card QR code
// @route   GET /api/admin/cards/:id/qr
// @access  Private/Admin
const getCardQRCode = async (req, res) => {
    const cardId = req.params.id;
    console.log(`[getCardQRCode] Controller çağrıldı, ID: ${cardId}`);

    try {
        const pool = await getPool();
        console.log(`[getCardQRCode] Veritabanı bağlantısı başarılı, Kart ID: ${cardId}`);

        const result = await pool.request()
            .input('cardId', sql.Int, cardId)
            .query(`
                SELECT c.id, c.name, c.customSlug, u.name as userName, co.name as companyName
                FROM Cards c
                LEFT JOIN Users u ON c.userId = u.id
                LEFT JOIN Companies co ON c.companyId = co.id
                WHERE c.id = @cardId
            `);

        if (result.recordset.length === 0) {
            console.warn(`[getCardQRCode] Kartvizit bulunamadı, ID: ${cardId}`);
            return res.status(404).json({ message: 'Kartvizit bulunamadı.' });
        }

        const card = result.recordset[0];
        console.log(`[getCardQRCode] Kartvizit bilgisi alındı:`, card);

        const cardPath = card.customSlug ? `/card/${card.customSlug}` : `/card/${card.id}`;
        console.log(`[getCardQRCode] QR kod yolu oluşturuldu: ${cardPath}`);

        const qrCodeData = await qrcode.toDataURL(cardPath);
        console.log(`[getCardQRCode] QR kod Data URL oluşturuldu.`);
        
        const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        console.log(`[getCardQRCode] Buffer oluşturuldu.`);

        let fileName = card.name;
        if (card.userName) {
            fileName += `-${card.userName}`;
        }
        if (card.companyName) {
            fileName += `-${card.companyName}`;
        }
        fileName = fileName
            .replace(/[ğ]/g, 'g')
            .replace(/[ü]/g, 'u')
            .replace(/[ş]/g, 's')
            .replace(/[ı]/g, 'i')
            .replace(/[ö]/g, 'o')
            .replace(/[ç]/g, 'c')
            .replace(/[Ğ]/g, 'G')
            .replace(/[Ü]/g, 'U')
            .replace(/[Ş]/g, 'S')
            .replace(/[İ]/g, 'I')
            .replace(/[Ö]/g, 'O')
            .replace(/[Ç]/g, 'C')
            .replace(/\s+/g, '-')
            .toLowerCase();
        console.log(`[getCardQRCode] Oluşturulan dosya adı: qr-${fileName}.png`);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename=qr-${fileName}.png`);
        res.send(buffer);
        console.log(`[getCardQRCode] Yanıt gönderildi.`);

    } catch (error) {
        console.error("[getCardQRCode] QR kod oluşturma hatası:", error);
        res.status(500).json({ message: 'QR kod oluşturma hatası oluştu.' });
    }
};

module.exports = {
    getCards,
    createCard,
    updateCard,
    deleteCard,
    exportCardsToExcel,
    importCardsFromExcel,
    generateBulkQRCodes,
    getCardQRCode
}; 