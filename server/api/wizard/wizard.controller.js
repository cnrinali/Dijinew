const { getPool, sql } = require('../../config/db');
const crypto = require('crypto');
const { getClientBaseUrl } = require('../../config/urls');

// Token oluştur (Admin/Corporate kullanıcılar için)
const createWizardToken = async (req, res) => {
    const { type, expiryDays = 7 } = req.body;
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

    // Type kontrolü
    if (!['admin', 'corporate'].includes(type)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Geçersiz token tipi. (admin veya corporate olmalı)' 
        });
    }

    // Kurumsal kullanıcı sadece corporate token oluşturabilir
    if (userRole === 'corporate' && type !== 'corporate') {
        return res.status(403).json({ 
            success: false, 
            message: 'Kurumsal kullanıcılar sadece kurumsal token oluşturabilir.' 
        });
    }

    try {
        const pool = await getPool();
        
        // Benzersiz token oluştur
        const token = crypto.randomBytes(32).toString('hex');
        
        // Geçerlilik süresi hesapla
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiryDays);
        
        // Token'ı veritabanına kaydet
        const result = await pool.request()
            .input('token', sql.NVarChar, token)
            .input('type', sql.NVarChar, type)
            .input('createdBy', sql.Int, userId)
            .input('companyId', sql.Int, type === 'corporate' ? companyId : null)
            .input('expiresAt', sql.DateTime2, expiresAt)
            .query(`
                INSERT INTO WizardTokens (token, type, createdBy, companyId, expiresAt)
                OUTPUT INSERTED.id, INSERTED.token, INSERTED.type, INSERTED.expiresAt, INSERTED.createdAt
                VALUES (@token, @type, @createdBy, @companyId, @expiresAt)
            `);

        const wizardToken = result.recordset[0];
        
        // Tam URL oluştur - Merkezi config kullan
        const baseUrl = getClientBaseUrl(req);
        const wizardUrl = `${baseUrl}/wizard?token=${token}`;

        res.status(201).json({
            success: true,
            data: {
                ...wizardToken,
                wizardUrl,
                expiryDays
            },
            message: 'Sihirbaz linki başarıyla oluşturuldu.'
        });

    } catch (error) {
        console.error('Wizard token oluşturma hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

// Token doğrula
const validateWizardToken = async (req, res) => {
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
                    id, token, type, createdBy, companyId, isUsed, usedBy, 
                    usedAt, expiresAt, createdAt,
                    CASE 
                        WHEN expiresAt < GETDATE() THEN 1 
                        ELSE 0 
                    END as isExpired
                FROM WizardTokens 
                WHERE token = @token
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Geçersiz token.' 
            });
        }

        const wizardToken = result.recordset[0];

        // Token süresi dolmuş mu?
        if (wizardToken.isExpired) {
            return res.status(410).json({ 
                success: false, 
                message: 'Token süresi dolmuş.' 
            });
        }

        // Token daha önce kullanılmış mı?
        if (wizardToken.isUsed) {
            return res.status(410).json({ 
                success: false, 
                message: 'Bu token daha önce kullanılmış.' 
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: wizardToken.id,
                type: wizardToken.type,
                companyId: wizardToken.companyId,
                expiresAt: wizardToken.expiresAt
            },
            message: 'Token geçerli.'
        });

    } catch (error) {
        console.error('Wizard token doğrulama hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

// Token'ı kullanıldı olarak işaretle
const markTokenAsUsed = async (req, res) => {
    const { token } = req.params;
    const userId = req.user?.id || null; // Kullanıcı giriş yaptıysa, yoksa null

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
            .input('usedBy', sql.Int, userId)
            .input('usedAt', sql.DateTime2, new Date())
            .query(`
                UPDATE WizardTokens 
                SET isUsed = 1, usedBy = @usedBy, usedAt = @usedAt, updatedAt = GETDATE()
                OUTPUT INSERTED.id, INSERTED.type, INSERTED.isUsed
                WHERE token = @token AND isUsed = 0 AND expiresAt > GETDATE()
            `);

        if (result.recordset.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token bulunamadı, süresi dolmuş veya daha önce kullanılmış.' 
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0],
            message: 'Token başarıyla kullanıldı olarak işaretlendi.'
        });

    } catch (error) {
        console.error('Wizard token kullanım işaretleme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

// Kullanıcının token'larını listele (Admin/Corporate)
const getUserWizardTokens = async (req, res) => {
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
                    id, token, type, companyId, isUsed, usedBy, usedAt, 
                    expiresAt, createdAt,
                    CASE 
                        WHEN expiresAt < GETDATE() THEN 1 
                        ELSE 0 
                    END as isExpired,
                    CASE 
                        WHEN isUsed = 1 THEN 'Kullanıldı'
                        WHEN expiresAt < GETDATE() THEN 'Süresi Dolmuş'
                        ELSE 'Aktif'
                    END as status
                FROM WizardTokens 
                WHERE createdBy = @createdBy
                ORDER BY createdAt DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset,
            message: 'Token listesi başarıyla getirildi.'
        });

    } catch (error) {
        console.error('Wizard token listesi getirme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sunucu hatası oluştu.' 
        });
    }
};

module.exports = {
    createWizardToken,
    validateWizardToken,
    markTokenAsUsed,
    getUserWizardTokens
}; 