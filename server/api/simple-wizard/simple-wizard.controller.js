const { getPool, sql } = require('../../config/db');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const emailService = require('../../services/emailService');

// Basit Sihirbaz Token Oluştur (Sadece email ile)
const createSimpleWizard = async (req, res) => {
    const { email } = req.body; // Email isteğe bağlı
    const userId = req.user.id;
    const userRole = req.user.role;
    const companyId = req.user.companyId;

    // Yetki kontrolü
    if (!['admin', 'corporate'].includes(userRole)) {
        return res.status(403).json({ 
            success: false, 
            message: 'Bu işlem için yetkiniz yok.' 
        });
    }

    try {
        const pool = await getPool();
        
        // Benzersiz token oluştur
        const token = crypto.randomBytes(16).toString('hex'); // Daha kısa token
        
        // Geçerlilik süresi 30 gün
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        
        // Önce Cards tablosunun mevcut kolonlarını kontrol edelim
        // Sadece kesinlikle var olan kolonları kullanarak kart oluşturalım
        // GUID ile unique slug oluştur
        const uniqueSlug = uuidv4();
        
        const cardResult = await pool.request()
            .input('cardName', sql.NVarChar, 'Yeni Kartvizit')
            .input('customSlug', sql.NVarChar, uniqueSlug)
            .input('name', sql.NVarChar, 'Henüz Belirtilmedi')
            .input('email', sql.NVarChar, email || '')
            .input('userId', sql.Int, userId)
            .input('isActive', sql.Bit, false) // Başlangıçta pasif
            .query(`
                INSERT INTO Cards (cardName, customSlug, name, email, userId, isActive)
                OUTPUT INSERTED.id, INSERTED.customSlug
                VALUES (@cardName, @customSlug, @name, @email, @userId, @isActive)
            `);

        const card = cardResult.recordset[0];
        
        // Token'ı veritabanına kaydet
        const tokenResult = await pool.request()
            .input('token', sql.NVarChar, token)
            .input('email', sql.NVarChar, email)
            .input('createdBy', sql.Int, userId)
            .input('createdByType', sql.NVarChar, userRole)
            .input('companyId', sql.Int, userRole === 'corporate' ? companyId : null)
            .input('cardId', sql.Int, card.id)
            .input('expiresAt', sql.DateTime2, expiresAt)
            .query(`
                INSERT INTO SimpleWizardTokens (token, email, createdBy, createdByType, companyId, cardId, expiresAt)
                OUTPUT INSERTED.id, INSERTED.token, INSERTED.email, INSERTED.expiresAt, INSERTED.createdAt
                VALUES (@token, @email, @createdBy, @createdByType, @companyId, @cardId, @expiresAt)
            `);

        const wizardToken = tokenResult.recordset[0];
        
        // Wizard URL oluştur (CLIENT tarafında - port 5173)
        const clientBaseUrl = req.get('host').includes('localhost') 
            ? `http://localhost:5173` 
            : `https://${req.get('host').replace(':5001', '')}`;
        const wizardUrl = `${clientBaseUrl}/wizard/${card.customSlug}?token=${token}`;

        // Email göndermeyi dene (opsiyonel - sadece geçerli email varsa)
        let emailResult = { success: false, message: 'Email belirtilmedi' };
        
        // Email kontrolü: boş değil, @ içeriyor ve en az 5 karakter
        const isValidEmail = email && 
                            typeof email === 'string' && 
                            email.trim().length > 4 && 
                            email.includes('@') && 
                            email.includes('.');
        
        if (isValidEmail) {
            try {
                console.log('Email gönderme işlemi başlatılıyor:', email);
                
                const user = await pool.request()
                    .input('userId', sql.Int, userId)
                    .query('SELECT name FROM Users WHERE id = @userId');
                
                const senderName = user.recordset[0]?.name || 'DijiCard Ekibi';
                
                emailResult = await emailService.sendWizardLinkEmail(email.trim(), wizardUrl, senderName);
                console.log('Email gönderim sonucu:', emailResult);
                
            } catch (emailErr) {
                console.error('Email gönderim hatası (ana işlemi etkilemez):', emailErr);
                emailResult = { 
                    success: false, 
                    message: 'Email gönderilemedi: ' + (emailErr.message || 'Bilinmeyen hata')
                };
                // Email hatası ana işlemi ETKİLEMEZ
            }
        } else {
            console.log('Email gönderilmiyor - geçersiz veya boş email:', email);
        }

        res.status(201).json({
            success: true,
            data: {
                ...wizardToken,
                cardId: card.id,
                wizardUrl,
                emailSent: emailResult?.success || false,
                emailMessage: emailResult?.message
            },
            message: 'Sihirbaz linki başarıyla oluşturuldu.' + (emailResult?.success ? ' Email gönderildi.' : '')
        });

    } catch (error) {
        console.error('Basit sihirbaz token oluşturma hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

// Token ile kart bilgilerini getir
// Token doğrulama
const validateSimpleWizardToken = async (req, res) => {
    try {
        const { token } = req.params;
        const pool = await getPool();

        const result = await pool.request()
            .input('token', sql.NVarChar, token)
            .query(`
                SELECT swt.token, swt.email, swt.isUsed, swt.expiresAt, swt.cardId,
                       c.cardName, c.customSlug,
                       CASE 
                           WHEN swt.expiresAt < GETDATE() THEN 1 
                           ELSE 0 
                       END as isExpired
                FROM SimpleWizardTokens swt
                INNER JOIN Cards c ON swt.cardId = c.id
                WHERE swt.token = @token
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Geçersiz token.' 
            });
        }

        const data = result.recordset[0];

        // Token süresi dolmuş mu?
        if (data.isExpired) {
            return res.status(410).json({ 
                success: false, 
                message: 'Token süresi dolmuş.' 
            });
        }

        // Token daha önce kullanılmış mı?
        if (data.isUsed) {
            return res.status(409).json({ 
                success: false, 
                message: 'Bu token daha önce kullanılmış.' 
            });
        }

        res.json({
            success: true,
            message: 'Token geçerli.',
            data: {
                token: data.token,
                cardId: data.cardId,
                cardSlug: data.customSlug,
                cardName: data.cardName,
                email: data.email
            }
        });

    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

const getCardByToken = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: 'Token parametresi gerekli.' 
        });
    }

    try {
        const pool = await getPool();
        
        const result = await pool.request()
            .input('token', sql.NVarChar, token)
            .query(`
                SELECT 
                    swt.id as tokenId,
                    swt.token,
                    swt.email as tokenEmail,
                    swt.isUsed,
                    swt.expiresAt,
                    swt.createdByType,
                    c.id as cardId,
                    c.name,
                    c.title,
                    c.email,
                    c.phone,
                    c.website,
                    c.address,
                    c.bio,
                    c.customSlug,
                    c.isActive,
                    c.profileImageUrl,
                    c.qrCodeData,
                    CASE 
                        WHEN swt.expiresAt < GETDATE() THEN 1 
                        ELSE 0 
                    END as isExpired
                FROM SimpleWizardTokens swt
                INNER JOIN Cards c ON swt.cardId = c.id
                WHERE swt.token = @token
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Geçersiz token.' 
            });
        }

        const data = result.recordset[0];

        // Token süresi dolmuş mu?
        if (data.isExpired) {
            return res.status(410).json({ 
                success: false, 
                message: 'Token süresi dolmuş.' 
            });
        }

        res.status(200).json({
            success: true,
            data: data,
            message: 'Kart bilgileri başarıyla getirildi.'
        });

    } catch (error) {
        console.error('Token ile kart getirme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

// Kart bilgilerini güncelle (token ile)
const updateCardByToken = async (req, res) => {
    const { token } = req.params;
    const cardData = req.body;

    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: 'Token parametresi gerekli.' 
        });
    }

    try {
        const pool = await getPool();
        
        // Önce token'ı doğrula
        const tokenResult = await pool.request()
            .input('token', sql.NVarChar, token)
            .query(`
                SELECT cardId, isUsed, expiresAt,
                       CASE WHEN expiresAt < GETDATE() THEN 1 ELSE 0 END as isExpired
                FROM SimpleWizardTokens 
                WHERE token = @token
            `);

        if (tokenResult.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Geçersiz token.' 
            });
        }

        const tokenData = tokenResult.recordset[0];

        if (tokenData.isExpired) {
            return res.status(410).json({ 
                success: false, 
                message: 'Token süresi dolmuş.' 
            });
        }

        // Kartı güncelle
        const isActiveValue = cardData.isActive === true ? 1 : 0;
        
        const updateResult = await pool.request()
            .input('cardId', sql.Int, tokenData.cardId)
            .input('name', sql.NVarChar, cardData.name || '')
            .input('title', sql.NVarChar, cardData.title || '')
            .input('email', sql.NVarChar, cardData.email || '')
            .input('phone', sql.NVarChar, cardData.phone || '')
            .input('website', sql.NVarChar, cardData.website || '')
            .input('address', sql.NVarChar, cardData.address || '')
            .input('bio', sql.NVarChar, cardData.bio || '')
            .input('status', sql.Bit, isActiveValue)
            .query(`
                UPDATE Cards 
                SET name = @name,
                    title = @title,
                    email = @email,
                    phone = @phone,
                    website = @website,
                    address = @address,
                    bio = @bio,
                    status = @status,
                    updatedAt = GETDATE()
                WHERE id = @cardId
            `);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Kart bulunamadı.' 
            });
        }

        // Güncellenmiş kartı al
        const cardResult = await pool.request()
            .input('cardId', sql.Int, tokenData.cardId)
            .query(`
                SELECT id, name, customSlug, status 
                FROM Cards 
                WHERE id = @cardId
            `);

        const updatedCard = cardResult.recordset[0];

        // Eğer ad/soyad güncellendi ise slug'ı güncelle
        if (cardData.name && cardData.name.trim() !== '') {
            const slugBase = cardData.name
                .toLowerCase()
                .replace(/[üğışöç]/g, match => {
                    const map = { 'ü': 'u', 'ğ': 'g', 'ı': 'i', 'ş': 's', 'ö': 'o', 'ç': 'c' };
                    return map[match];
                })
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            const newSlug = slugBase + '-' + Math.random().toString(36).substr(2, 6);
            
            await pool.request()
                .input('cardId', sql.Int, tokenData.cardId)
                .input('customSlug', sql.NVarChar, newSlug)
                .query(`UPDATE Cards SET customSlug = @customSlug WHERE id = @cardId`);
            
            updatedCard.customSlug = newSlug;
        }

        // Token'ı kullanıldı olarak işaretle (sadece kart aktifleştirildi ise)
        if (isActiveValue === 1) {
            await pool.request()
                .input('token', sql.NVarChar, token)
                .query(`
                    UPDATE SimpleWizardTokens 
                    SET isUsed = 1, updatedAt = GETDATE()
                    WHERE token = @token
                `);
        }

        res.status(200).json({
            success: true,
            data: updatedCard,
            message: 'Kart başarıyla güncellendi.'
        });

    } catch (error) {
        console.error('Token ile kart güncelleme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

// Kullanıcının sihirbazlarını listele
// Kartın sahipliğini güncelle (token ile)
const updateCardOwnership = async (req, res) => {
    try {
        const { token } = req.params;
        const { newUserId } = req.body;
        
        if (!token || !newUserId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token ve yeni kullanıcı ID gerekli.' 
            });
        }
        
        const pool = await getPool();
        
        // Önce token ile kart ID'sini bul
        const tokenResult = await pool.request()
            .input('token', sql.NVarChar, token)
            .query(`
                SELECT cardId FROM SimpleWizardTokens 
                WHERE token = @token AND isUsed = 0
            `);
            
        if (tokenResult.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Geçersiz veya kullanılmış token.' 
            });
        }
        
        const cardId = tokenResult.recordset[0].cardId;
        
        // Kartın userId'sini güncelle
        const updateResult = await pool.request()
            .input('cardId', sql.Int, cardId)
            .input('newUserId', sql.Int, newUserId)
            .query(`
                UPDATE Cards 
                SET userId = @newUserId, updatedAt = GETDATE()
                WHERE id = @cardId
            `);
            
        if (updateResult.rowsAffected[0] > 0) {
            res.json({
                success: true,
                message: 'Kart sahipliği başarıyla güncellendi.',
                data: { cardId, newUserId }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Kart güncellenemedi.'
            });
        }
        
    } catch (error) {
        console.error('Kart sahipliği güncelleme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

// Token'ı kullanıldı olarak işaretle
const markSimpleTokenAsUsed = async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token parametresi gerekli.' 
            });
        }
        
        const pool = await getPool();
        
        // Token'ı kullanıldı olarak işaretle
        const result = await pool.request()
            .input('token', sql.NVarChar, token)
            .query(`
                UPDATE SimpleWizardTokens 
                SET isUsed = 1, updatedAt = GETDATE()
                WHERE token = @token AND isUsed = 0
            `);
            
        if (result.rowsAffected[0] > 0) {
            res.json({
                success: true,
                message: 'Token başarıyla kullanıldı olarak işaretlendi.'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Token bulunamadı veya zaten kullanılmış.'
            });
        }
        
    } catch (error) {
        console.error('Token işaretleme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

const getUserSimpleWizards = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!['admin', 'corporate'].includes(userRole)) {
        return res.status(403).json({ 
            success: false, 
            message: 'Bu işlem için yetkiniz yok.' 
        });
    }

    try {
        const pool = await getPool();
        
        const result = await pool.request()
            .input('createdBy', sql.Int, userId)
            .query(`
                SELECT 
                    swt.id,
                    swt.token,
                    swt.email,
                    swt.isUsed,
                    swt.expiresAt,
                    swt.createdAt,
                    c.name as cardName,
                    c.customSlug as cardSlug,
                    c.isActive as cardStatus,
                    CASE 
                        WHEN swt.expiresAt < GETDATE() THEN 1 
                        ELSE 0 
                    END as isExpired,
                    CASE 
                        WHEN swt.isUsed = 1 THEN 'Kullanıldı'
                        WHEN swt.expiresAt < GETDATE() THEN 'Süresi Dolmuş'
                        ELSE 'Aktif'
                    END as status
                FROM SimpleWizardTokens swt
                INNER JOIN Cards c ON swt.cardId = c.id
                WHERE swt.createdBy = @createdBy
                ORDER BY swt.createdAt DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset,
            message: 'Sihirbaz listesi başarıyla getirildi.'
        });

    } catch (error) {
        console.error('Sihirbaz listesi getirme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

module.exports = {
    createSimpleWizard,
    validateSimpleWizardToken,
    getCardByToken,
    updateCardByToken,
    updateCardOwnership,
    markSimpleTokenAsUsed,
    getUserSimpleWizards
};
