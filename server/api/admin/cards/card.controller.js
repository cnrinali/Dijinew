const { getPool, sql } = require('../../../config/db'); // DB bağlantısı
const qrcode = require('qrcode'); // QR kod oluşturma kütüphanesi

// Helper function to generate QR code data URL
const generateQRCodeDataURL = async (cardData) => {
    // QR kod içeriğini oluştur (örneğin vCard benzeri bir format veya basit bir URL)
    // Şimdilik kart ID'sine veya özel bir URL'ye yönlendirecek basit bir text yapalım.
    // İleride daha detaylı vCard formatı eklenebilir.
    const qrContent = `CARD_ID:${cardData.id}`; // Veya `https://yourdomain.com/card/${cardData.id}`
    try {
        return await qrcode.toDataURL(qrContent);
    } catch (err) {
        console.error('QR Code generation failed:', err);
        return null; // Hata durumunda null dön
    }
};

// @desc    Get all cards (optionally filter by company)
// @route   GET /api/admin/cards
// @route   GET /api/admin/companies/:companyId/cards
// @access  Private/Admin
const getCards = async (req, res) => {
    const companyId = req.params.companyId; // Eğer /companies/:companyId/cards üzerinden geliyorsa
    console.log(`getCards controller çağrıldı${companyId ? ` for company ${companyId}` : ''}`);
    try {
        const pool = await getPool();
        let query = 'SELECT c.id, c.name, c.title, c.email, c.phone, c.website, c.address, c.status, c.qrCodeData, c.createdAt, c.updatedAt, co.name as companyName FROM Cards c JOIN Companies co ON c.companyId = co.id';
        let request = pool.request();

        if (companyId) {
            query += ' WHERE c.companyId = @companyId';
            request.input('companyId', sql.Int, companyId);
        }
        query += ' ORDER BY c.createdAt DESC';

        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Kartları listeleme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Create a new card for a company
// @route   POST /api/admin/cards
// @access  Private/Admin
const createCard = async (req, res) => {
    console.log("createCard controller çağrıldı", req.body);
    const { companyId, name, title, email, phone, website, address, status } = req.body;

    if (!companyId || !name) {
        return res.status(400).json({ message: 'Şirket ID ve Kart Adı zorunludur.' });
    }

    try {
        const pool = await getPool();
        const insertResult = await pool.request()
            .input('companyId', sql.Int, companyId)
            .input('name', sql.NVarChar, name)
            .input('title', sql.NVarChar, title)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('website', sql.NVarChar, website)
            .input('address', sql.NVarChar, address)
            .input('status', sql.Bit, status !== undefined ? status : true)
            .query(`INSERT INTO Cards (companyId, name, title, email, phone, website, address, status)
                    OUTPUT INSERTED.id, INSERTED.companyId, INSERTED.name, INSERTED.title, INSERTED.email, INSERTED.phone, INSERTED.website, INSERTED.address, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt 
                    VALUES (@companyId, @name, @title, @email, @phone, @website, @address, @status)`);

        if (insertResult.recordset.length === 0) {
            throw new Error('Kart oluşturulamadı, ekleme sonucu boş.');
        }

        const newCard = insertResult.recordset[0];

        // QR Kodunu oluştur ve veritabanını güncelle
        const qrCodeData = await generateQRCodeDataURL(newCard);
        if (qrCodeData) {
            await pool.request()
                .input('cardId', sql.Int, newCard.id)
                .input('qrCodeData', sql.NVarChar, qrCodeData)
                .query('UPDATE Cards SET qrCodeData = @qrCodeData WHERE id = @cardId');
            newCard.qrCodeData = qrCodeData; // Dönen yanıta QR kodunu ekle
        }
        
        // Şirket adını da yanıta ekleyelim (frontend'de gerekebilir)
        const companyResult = await pool.request().input('companyId', sql.Int, newCard.companyId).query('SELECT name FROM Companies WHERE id = @companyId');
        newCard.companyName = companyResult.recordset[0]?.name || 'Bilinmiyor';

        res.status(201).json(newCard);
    } catch (error) {
        console.error("Kart oluşturma hatası:", error);
         if (error.number === 547) { // Foreign key constraint (companyId yoksa)
            return res.status(400).json({ message: 'Geçersiz Şirket ID.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};


// @desc    Update a card
// @route   PUT /api/admin/cards/:id
// @access  Private/Admin
const updateCard = async (req, res) => {
    const cardId = req.params.id;
    const { companyId, name, title, email, phone, website, address, status } = req.body;
    console.log(`updateCard controller çağrıldı, ID: ${cardId}`, req.body);

     if (!companyId || !name) { // companyId güncelleme sırasında da gerekli olabilir (veya opsiyonel)
        return res.status(400).json({ message: 'Şirket ID ve Kart Adı zorunludur.' });
    }

    try {
        const pool = await getPool();
        const updateResult = await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('companyId', sql.Int, companyId) // Gerekliyse güncellenmeli
            .input('name', sql.NVarChar, name)
            .input('title', sql.NVarChar, title)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('website', sql.NVarChar, website)
            .input('address', sql.NVarChar, address)
            .input('status', sql.Bit, status !== undefined ? status : true)
            .input('updatedAt', sql.DateTime2, new Date()) // updatedAt alanını güncelle
            .query(`UPDATE Cards SET 
                        companyId = @companyId, 
                        name = @name, 
                        title = @title, 
                        email = @email, 
                        phone = @phone, 
                        website = @website, 
                        address = @address, 
                        status = @status,
                        updatedAt = @updatedAt
                    OUTPUT INSERTED.id, INSERTED.companyId, INSERTED.name, INSERTED.title, INSERTED.email, INSERTED.phone, INSERTED.website, INSERTED.address, INSERTED.status, INSERTED.createdAt, INSERTED.updatedAt, INSERTED.qrCodeData
                    WHERE id = @cardId`);

        if (updateResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Güncellenecek kart bulunamadı.' });
        }

        const updatedCard = updateResult.recordset[0];
        
        // Şirket adını ekle
        const companyResult = await pool.request().input('companyId', sql.Int, updatedCard.companyId).query('SELECT name FROM Companies WHERE id = @companyId');
        updatedCard.companyName = companyResult.recordset[0]?.name || 'Bilinmiyor';

        res.status(200).json(updatedCard);

    } catch (error) {
        console.error("Kart güncelleme hatası:", error);
         if (error.number === 547) { // Foreign key constraint
            return res.status(400).json({ message: 'Geçersiz Şirket ID.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Delete a card
// @route   DELETE /api/admin/cards/:id
// @access  Private/Admin
const deleteCard = async (req, res) => {
    const cardId = req.params.id;
    console.log(`deleteCard controller çağrıldı, ID: ${cardId}`);

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('cardId', sql.Int, cardId)
            .query('DELETE FROM Cards WHERE id = @cardId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Silinecek kart bulunamadı.' });
        }

        res.status(200).json({ message: 'Kart başarıyla silindi.', id: cardId });

    } catch (error) {
        console.error("Kart silme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

module.exports = {
    getCards,
    createCard,
    updateCard,
    deleteCard
}; 