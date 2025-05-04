const { getPool, sql } = require('../../config/db');
const bcrypt = require('bcryptjs'); // Şifre hashleme için
const jwt = require('jsonwebtoken'); // JWT oluşturma için
const crypto = require('crypto'); // Şifre sıfırlama token'ı için

// Helper function to generate JWT
const generateToken = (id, role, companyId) => {
    const payload = { id, role };
    // Eğer companyId varsa payload'a ekle
    if (companyId !== null && companyId !== undefined) {
        payload.companyId = companyId;
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token geçerlilik süresi (örnek: 30 gün)
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Giriş doğrulaması
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
    }

    try {
        const pool = await getPool();

        // 2. Kullanıcı var mı kontrolü (MSSQL için)
        const userExistsResult = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT TOP 1 id FROM Users WHERE email = @email'); // Varsayılan tablo adı: Users

        if (userExistsResult.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
        }

        // 3. Şifre hashleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Kullanıcı oluşturma (MSSQL için)
        // Not: Henüz Users tablosu yok, bu sorgu varsayımsaldır.
        // Gerçek tablo yapınıza göre OUTPUT inserted.id kısmını ayarlamanız gerekebilir.
        const insertUserResult = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            // .input('role', sql.NVarChar, 'user') // Varsayılan rol eklenebilir
            .query('INSERT INTO Users (name, email, password) OUTPUT inserted.id VALUES (@name, @email, @password)');

        if (insertUserResult.recordset && insertUserResult.recordset.length > 0) {
            const userId = insertUserResult.recordset[0].id;
            // 5. Yanıt döndürme (JWT ile)
            res.status(201).json({
                id: userId,
                name: name,
                email: email,
                token: generateToken(userId, null, null), // JWT oluştur ve gönder
            });
        } else {
            throw new Error('Kullanıcı oluşturulamadı.');
        }

    } catch (error) {
        console.error("Kayıt hatası:", error);
        // MSSQL özel hata kodlarını kontrol edebiliriz (örn: unique constraint)
        if (error.number === 2627 || error.number === 2601) { // Unique constraint violation
             return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Giriş doğrulaması
    if (!email || !password) {
        return res.status(400).json({ message: 'Lütfen e-posta ve şifreyi girin' });
    }

    try {
        const pool = await getPool();

        // Kullanıcıyı bul (role ve companyId eklendi) - GÜNCELLENDİ
        const userResult = await pool.request()
            .input('email', sql.NVarChar, email)
            // role ve companyId'yi de seç
            .query('SELECT TOP 1 id, name, email, password, role, companyId FROM Users WHERE email = @email'); 

        if (userResult.recordset.length === 0) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' }); 
        }

        const user = userResult.recordset[0];

        // 3. Şifreleri karşılaştır
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        // Giriş başarılı, JWT oluştur ve gönder (role ve companyId eklendi) - GÜNCELLENDİ
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Rol eklendi
            companyId: user.companyId, // Şirket ID eklendi (null olabilir)
            token: generateToken(user.id, user.role, user.companyId), // Token'a da eklendi
        });

    } catch (error) {
        console.error("Giriş hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private (Token gerekli olacak - middleware eklenecek)
const logoutUser = (req, res) => {
    // Genellikle istemci tarafında token silinir.
    // Backend tarafında token blacklisting gibi mekanizmalar yoksa, burada yapılacak pek bir şey yok.
    res.status(200).json({ message: 'Çıkış başarılı (istemci token silmeli)' });
};

// @desc    Forgot password
// @route   POST /api/auth/forgot
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Lütfen e-posta adresinizi girin' });
    }

    try {
        const pool = await getPool();
        const userResult = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT TOP 1 id FROM Users WHERE email = @email');

        if (userResult.recordset.length === 0) {
            // Kullanıcı bulunamasa bile, e-postanın kayıtlı olup olmadığını belli etmemek daha güvenlidir.
            return res.status(200).json({ message: 'E-posta adresinize bir şifre sıfırlama bağlantısı gönderildi (eğer kayıtlıysa).' });
        }

        const userId = userResult.recordset[0].id;

        // 1. Reset token oluştur
        const resetToken = crypto.randomBytes(20).toString('hex');
        // 2. Token'ı hash'le (veritabanında hashlenmiş halini saklamak daha güvenli)
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 3. Token geçerlilik süresi belirle (örn: 10 dakika)
        const expireDate = new Date(Date.now() + 10 * 60 * 1000);

        // 4. Token ve süresini veritabanına kaydet
        // !!! BU ADIM İÇİN Users TABLOSUNA resetPasswordToken (NVARCHAR) VE resetPasswordExpire (DATETIME2) SÜTUNLARI EKLEYİN !!!
        await pool.request()
            .input('userId', sql.Int, userId) // VEYA sql.UniqueIdentifier
            .input('token', sql.NVarChar, hashedToken)
            .input('expire', sql.DateTime2, expireDate)
            .query('UPDATE Users SET resetPasswordToken = @token, resetPasswordExpire = @expire WHERE id = @userId');

        // 5. Kullanıcıya e-posta gönder (Simülasyon)
        // Gerçek uygulamada nodemailer gibi bir kütüphane kullanın.
        const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`; // Frontend reset URL
        console.log('--- ŞİFRE SIFIRLAMA --- ');
        console.log('E-posta gönderilecek (simülasyon):', email);
        console.log('Sıfırlama URL:', resetUrl);
        console.log('-----------------------');

        // Kullanıcıya her durumda aynı mesajı dönmek güvenlik açısından daha iyidir.
        res.status(200).json({ message: 'E-posta adresinize bir şifre sıfırlama bağlantısı gönderildi (eğer kayıtlıysa).' });

    } catch (error) {
        console.error("Şifre sıfırlama isteği hatası:", error);
        // Kullanıcıya hata detayını gösterme, sadece genel bir mesaj dön
        res.status(500).json({ message: 'Şifre sıfırlama isteği sırasında bir hata oluştu.' });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Lütfen yeni şifrenizi girin' });
    }

    try {
        // 1. URL'den gelen token'ı hash'le (veritabanındaki ile karşılaştırmak için)
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const pool = await getPool();

        // 2. Hashlenmiş token ve geçerlilik süresine göre kullanıcıyı bul
        // !!! BU ADIM İÇİN Users TABLOSUNDA resetPasswordToken VE resetPasswordExpire SÜTUNLARI OLMALI !!!
        const userResult = await pool.request()
            .input('token', sql.NVarChar, hashedToken)
            .input('now', sql.DateTime2, new Date())
            .query('SELECT TOP 1 id FROM Users WHERE resetPasswordToken = @token AND resetPasswordExpire > @now');

        if (userResult.recordset.length === 0) {
            return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş şifre sıfırlama kodu.' });
        }

        const userId = userResult.recordset[0].id;

        // 3. Yeni şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Kullanıcının şifresini güncelle ve token bilgilerini temizle
        await pool.request()
            .input('userId', sql.Int, userId) // VEYA sql.UniqueIdentifier
            .input('password', sql.NVarChar, hashedPassword)
            .query('UPDATE Users SET password = @password, resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = @userId');

        // TODO: Kullanıcıya yeni şifreyle giriş yapabileceğini bildiren bir e-posta gönderilebilir.

        res.status(200).json({ message: 'Şifreniz başarıyla güncellendi.' });

    } catch (error) {
        console.error("Şifre güncelleme hatası:", error);
        res.status(500).json({ message: 'Şifre güncellenirken bir hata oluştu.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
}; 