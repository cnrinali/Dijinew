const { getPool, sql } = require('../../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT id, name, email, role, createdAt FROM Users WHERE id = @userId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json(result.recordset[0]);

    } catch (error) {
        console.error("Kullanıcı profili getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update user profile (name, email)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Gelen veriyi doğrula
    if (!name || !email) {
        return res.status(400).json({ message: 'İsim ve e-posta alanları zorunludur.' });
    }
     // E-posta formatını basitçe kontrol et (daha kapsamlı kontrol eklenebilir)
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Geçersiz e-posta formatı.' });
    }

    try {
        const pool = await getPool();

        // 1. Yeni e-postanın başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
        const emailCheck = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id FROM Users WHERE email = @email AND id != @userId'); // Kendisi hariç

        if (emailCheck.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten başka bir hesap tarafından kullanılıyor.' });
        }

        // 2. Kullanıcı bilgilerini güncelle
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .query('UPDATE Users SET name = @name, email = @email WHERE id = @userId');
        
        // 3. Güncellenmiş kullanıcı verisini çekip döndür
        const updatedUserResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT id, name, email, role, createdAt FROM Users WHERE id = @userId');

        if (updatedUserResult.recordset.length === 0) {
             // Bu durumun oluşmaması gerekir ama kontrol edelim
            console.error('Kullanıcı güncelleme sonrası bulunamadı, ID:', userId); 
            return res.status(404).json({ message: 'Kullanıcı bulunamadı (güncelleme sonrası)' });
        }

        res.status(200).json(updatedUserResult.recordset[0]); // Güncellenmiş veriyi döndür

    } catch (error) {
        console.error("Kullanıcı profili güncelleme hatası:", error);
         // E-posta için unique constraint hatası (yarış durumu)
         if (error.number === 2601 || error.number === 2627) { 
             return res.status(400).json({ message: 'Bu e-posta adresi zaten başka bir hesap tarafından kullanılıyor (tekrar kontrol).' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Gelen veriyi doğrula
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Mevcut şifre ve yeni şifre alanları zorunludur.' });
    }
    if (newPassword.length < 6) { // Auth controller'daki ile aynı olmalı
        return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
    }
    if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'Yeni şifre mevcut şifre ile aynı olamaz.' });
    }

    try {
        const pool = await getPool();

        // 1. Kullanıcının mevcut şifresini veritabanından çek
        const userResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT password FROM Users WHERE id = @userId');

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const user = userResult.recordset[0];

        // 2. Mevcut şifreyi doğrula
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mevcut şifreniz yanlış.' });
        }

        // 3. Yeni şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Yeni şifreyi veritabanında güncelle
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('hashedPassword', sql.NVarChar, hashedPassword)
            .query('UPDATE Users SET password = @hashedPassword WHERE id = @userId');

        res.status(200).json({ message: 'Şifreniz başarıyla değiştirildi.' });

    } catch (error) {
        console.error("Şifre değiştirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};


module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword
}; 