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

    const { email, password } = req.body;

    // Giriş doğrulaması
    if (!email || !password) {
        return res.status(400).json({ message: 'Lütfen e-posta ve şifreyi girin' });
    }

    try {
        const pool = await getPool();

        // Kullanıcıyı bul
        const userResult = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT TOP 1 id, name, email, password, role, companyId FROM Users WHERE email = @email'); 

        if (userResult.recordset.length === 0) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' }); 
        }

        const user = userResult.recordset[0];

        // Şifreleri karşılaştır
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        // Giriş başarılı, JWT oluştur ve gönder
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            token: generateToken(user.id, user.role, user.companyId),
        });

    } catch (error) {
        console.error("Giriş hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
} 