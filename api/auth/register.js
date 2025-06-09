const { getPool, sql } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id, role, companyId) => {
    const payload = { id, role };
    if (companyId !== null && companyId !== undefined) {
        payload.companyId = companyId;
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, password, role } = req.body;

    // Giriş doğrulaması
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
    }

    try {
        const pool = await getPool();

        // Kullanıcı var mı kontrolü
        const userExistsResult = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT TOP 1 id FROM Users WHERE email = @email');

        if (userExistsResult.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
        }

        // Şifre hashleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Kullanıcı oluşturma
        const insertUserResult = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('role', sql.NVarChar, role || 'user')
            .query('INSERT INTO Users (name, email, password, role) OUTPUT inserted.id, inserted.role VALUES (@name, @email, @password, @role)');

        if (insertUserResult.recordset && insertUserResult.recordset.length > 0) {
            const user = insertUserResult.recordset[0];
            res.status(201).json({
                id: user.id,
                name: name,
                email: email,
                role: user.role,
                token: generateToken(user.id, user.role, null),
            });
        } else {
            throw new Error('Kullanıcı oluşturulamadı.');
        }

    } catch (error) {
        console.error("Kayıt hatası:", error);
        if (error.number === 2627 || error.number === 2601) {
             return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
} 