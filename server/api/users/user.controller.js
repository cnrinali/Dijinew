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
            .query('SELECT id, name, email, role, language, createdAt FROM Users WHERE id = @userId');

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
    const { name, email, language } = req.body;

    // Gelen veriyi doğrula
    if (!name || !email) {
        return res.status(400).json({ message: 'İsim ve e-posta alanları zorunludur.' });
    }
     // E-posta formatını basitçe kontrol et (daha kapsamlı kontrol eklenebilir)
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Geçersiz e-posta formatı.' });
    }

    // Dil kontrolü (opsiyonel)
    const validLanguages = ['tr', 'en', 'ar', 'ru', 'pt'];
    if (language && !validLanguages.includes(language)) {
        return res.status(400).json({ message: 'Geçersiz dil seçimi.' });
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
        const request = pool.request()
            .input('userId', sql.Int, userId)
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email);

        let updateQuery = 'UPDATE Users SET name = @name, email = @email';
        
        if (language) {
            request.input('language', sql.NVarChar(5), language);
            updateQuery += ', language = @language';
        }
        
        updateQuery += ' WHERE id = @userId';
        await request.query(updateQuery);
        
        // 3. Güncellenmiş kullanıcı verisini çekip döndür
        const updatedUserResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT id, name, email, role, language, createdAt FROM Users WHERE id = @userId');

        if (updatedUserResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Güncellenmiş kullanıcı verisi alınamadı.' });
        }

        res.status(200).json(updatedUserResult.recordset[0]);

    } catch (error) {
        console.error("Kullanıcı profili güncelleme hatası:", error);
        // Email unique constraint hatası
        if (error.number === 2601 || error.number === 2627) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
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

// @desc    Get user bank accounts
// @route   GET /api/users/bank-accounts
// @access  Private
const getUserBankAccounts = async (req, res) => {
    const userId = req.user.id;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM UserBankAccounts WHERE userId = @userId ORDER BY createdAt DESC');

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Kullanıcı banka hesapları getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Add user bank account
// @route   POST /api/users/bank-accounts
// @access  Private
const addUserBankAccount = async (req, res) => {
    const userId = req.user.id;
    const { bankName, iban, accountName } = req.body;

    // Gelen veriyi doğrula
    if (!bankName || !iban || !accountName) {
        return res.status(400).json({ message: 'Banka adı, IBAN ve hesap sahibi adı zorunludur.' });
    }

    // IBAN formatını basit kontrol et (TR ile başlamalı ve 26 karakter olmalı)
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    if (!cleanIban.match(/^TR\d{24}$/)) {
        return res.status(400).json({ message: 'Geçersiz IBAN formatı. IBAN TR ile başlamalı ve 26 karakter olmalıdır.' });
    }

    try {
        const pool = await getPool();

        // Aynı IBAN'ın kullanıcı için zaten eklenmiş olup olmadığını kontrol et
        const existingAccount = await pool.request()
            .input('userId', sql.Int, userId)
            .input('iban', sql.NVarChar, cleanIban)
            .query('SELECT TOP 1 id FROM UserBankAccounts WHERE userId = @userId AND iban = @iban');

        if (existingAccount.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu IBAN numarası zaten eklenmiş.' });
        }

        // Yeni banka hesabını ekle
        const insertResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('bankName', sql.NVarChar, bankName)
            .input('iban', sql.NVarChar, cleanIban)
            .input('accountName', sql.NVarChar, accountName)
            .query(`
                INSERT INTO UserBankAccounts (userId, bankName, iban, accountName)
                OUTPUT inserted.*
                VALUES (@userId, @bankName, @iban, @accountName)
            `);

        res.status(201).json(insertResult.recordset[0]);

    } catch (error) {
        console.error("Banka hesabı ekleme hatası:", error);
        if (error.number === 2601 || error.number === 2627) { // Unique constraint
            return res.status(400).json({ message: 'Bu IBAN numarası zaten eklenmiş.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update user bank account
// @route   PUT /api/users/bank-accounts/:id
// @access  Private
const updateUserBankAccount = async (req, res) => {
    const userId = req.user.id;
    const accountId = req.params.id;
    const { bankName, iban, accountName } = req.body;

    // Gelen veriyi doğrula
    if (!bankName || !iban || !accountName) {
        return res.status(400).json({ message: 'Banka adı, IBAN ve hesap sahibi adı zorunludur.' });
    }

    // IBAN formatını kontrol et
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    if (!cleanIban.match(/^TR\d{24}$/)) {
        return res.status(400).json({ message: 'Geçersiz IBAN formatı. IBAN TR ile başlamalı ve 26 karakter olmalıdır.' });
    }

    if (isNaN(parseInt(accountId))) {
        return res.status(400).json({ message: 'Geçersiz hesap ID' });
    }

    try {
        const pool = await getPool();

        // Aynı IBAN'ın kullanıcı için başka bir hesapta eklenmiş olup olmadığını kontrol et
        const existingAccount = await pool.request()
            .input('userId', sql.Int, userId)
            .input('iban', sql.NVarChar, cleanIban)
            .input('accountId', sql.Int, parseInt(accountId))
            .query('SELECT TOP 1 id FROM UserBankAccounts WHERE userId = @userId AND iban = @iban AND id != @accountId');

        if (existingAccount.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu IBAN numarası zaten başka bir hesapta kayıtlı.' });
        }

        // Banka hesabını güncelle
        const updateResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('accountId', sql.Int, parseInt(accountId))
            .input('bankName', sql.NVarChar, bankName)
            .input('iban', sql.NVarChar, cleanIban)
            .input('accountName', sql.NVarChar, accountName)
            .query(`
                UPDATE UserBankAccounts 
                SET bankName = @bankName, iban = @iban, accountName = @accountName, updatedAt = GETDATE()
                OUTPUT inserted.*
                WHERE id = @accountId AND userId = @userId
            `);

        if (updateResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Güncellenecek banka hesabı bulunamadı.' });
        }

        res.status(200).json(updateResult.recordset[0]);

    } catch (error) {
        console.error("Banka hesabı güncelleme hatası:", error);
        if (error.number === 2601 || error.number === 2627) { // Unique constraint
            return res.status(400).json({ message: 'Bu IBAN numarası zaten kullanılıyor.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Delete user bank account
// @route   DELETE /api/users/bank-accounts/:id
// @access  Private
const deleteUserBankAccount = async (req, res) => {
    const userId = req.user.id;
    const accountId = req.params.id;

    if (isNaN(parseInt(accountId))) {
        return res.status(400).json({ message: 'Geçersiz hesap ID' });
    }

    try {
        const pool = await getPool();

        // Hesabın varlığını ve kullanıcıya ait olup olmadığını kontrol et
        const checkResult = await pool.request()
            .input('accountId', sql.Int, parseInt(accountId))
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id FROM UserBankAccounts WHERE id = @accountId AND userId = @userId');

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Silinecek banka hesabı bulunamadı veya size ait değil.' });
        }

        // Banka hesabını sil
        const deleteResult = await pool.request()
            .input('accountId', sql.Int, parseInt(accountId))
            .query('DELETE FROM UserBankAccounts WHERE id = @accountId');

        if (deleteResult.rowsAffected && deleteResult.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Banka hesabı başarıyla silindi', id: accountId });
        } else {
            return res.status(404).json({ message: 'Silinecek banka hesabı bulunamadı (tekrar kontrol)' });
        }

    } catch (error) {
        console.error("Banka hesabı silme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserBankAccounts,
    addUserBankAccount,
    updateUserBankAccount,
    deleteUserBankAccount
}; 