const { getPool, sql } = require('../../config/db');
const bcrypt = require('bcryptjs');

// @desc    Add a new user to the business user's company
// @route   POST /api/business/users
// @access  Private/Business
const addUserToCompany = async (req, res) => {
    const companyId = req.user.companyId; // İstek yapan business kullanıcının şirketi
    const { name, email, password } = req.body;

    // 1. Giriş doğrulaması
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Lütfen isim, e-posta ve şifre alanlarını doldurun' });
    }
    // Business kullanıcısının bir şirkete atanmış olması gerek
    if (!companyId) {
         return res.status(403).json({ message: 'Bu işlemi yapmak için bir şirkete atanmış olmalısınız.' });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool); // Transaction başlat

        await transaction.begin(); // Transaction başla

        try {
            // 2. Şirket limitini ve mevcut kullanıcı sayısını kontrol et (Transaction içinde)
            const companyCheck = await transaction.request()
                .input('companyId', sql.Int, companyId)
                .query(`
                    SELECT 
                        c.userLimit, 
                        (SELECT COUNT(id) FROM Users WHERE companyId = @companyId) as currentUserCount 
                    FROM Companies c 
                    WHERE c.id = @companyId
                `);

            if (companyCheck.recordset.length === 0) {
                 await transaction.rollback(); // Hata varsa rollback
                 return res.status(404).json({ message: 'Şirket bulunamadı.' });
            }

            const { userLimit, currentUserCount } = companyCheck.recordset[0];

            if (currentUserCount >= userLimit) {
                await transaction.rollback(); // Limit aşıldıysa rollback
                return res.status(400).json({ message: `Kullanıcı ekleme limitine ulaşıldı (${userLimit}).` });
            }

            // 3. Yeni kullanıcının e-postası zaten var mı kontrol et (Transaction içinde)
            const emailCheck = await transaction.request()
                .input('email', sql.NVarChar, email)
                .query('SELECT TOP 1 id FROM Users WHERE email = @email');

            if (emailCheck.recordset.length > 0) {
                 await transaction.rollback(); // E-posta varsa rollback
                 return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
            }

            // 4. Şifre hashleme
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 5. Yeni kullanıcıyı ekle (Transaction içinde)
            const insertResult = await transaction.request()
                .input('name', sql.NVarChar, name)
                .input('email', sql.NVarChar, email)
                .input('password', sql.NVarChar, hashedPassword)
                .input('role', sql.NVarChar, 'user') // Yeni kullanıcı her zaman 'user' rolünde
                .input('companyId', sql.Int, companyId) // İstek yapanın şirketi
                .query(`INSERT INTO Users (name, email, password, role, companyId) 
                        OUTPUT inserted.id, inserted.name, inserted.email, inserted.role, inserted.companyId 
                        VALUES (@name, @email, @password, @role, @companyId)`);

            if (insertResult.recordset && insertResult.recordset.length > 0) {
                 await transaction.commit(); // Başarılı, transaction'ı commit et
                 res.status(201).json(insertResult.recordset[0]); // Yeni kullanıcıyı döndür
            } else {
                 await transaction.rollback(); // Ekleme başarısızsa rollback
                 throw new Error('Kullanıcı oluşturulamadı (transaction).');
            }
        } catch (err) {
             await transaction.rollback(); // İç try-catch'te hata olursa rollback
             throw err; // Hatayı dış try-catch'e fırlat
        }

    } catch (error) {
        console.error("Şirkete kullanıcı ekleme hatası (Business):", error);
        if (error.number === 2601 || error.number === 2627) { // Unique constraint (e-posta)
             return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

module.exports = {
    addUserToCompany
}; 