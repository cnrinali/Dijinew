const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');

const verifyAuth = async (req) => {
    let token;

    // Token'ı Authorization header'dan al
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Token'ı doğrula
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Kullanıcıyı bul
            const pool = await getPool();
            const userResult = await pool.request()
                .input('userId', sql.Int, decoded.id)
                .query('SELECT id, name, email, role, companyId FROM Users WHERE id = @userId');
            
            if (userResult.recordset.length === 0) {
                throw new Error('Kullanıcı bulunamadı');
            }

            return userResult.recordset[0];

        } catch (error) {
            throw new Error('Token doğrulanamadı');
        }
    }

    if (!token) {
        throw new Error('Token bulunamadı');
    }
};

const requireAuth = async (req, res) => {
    try {
        const user = await verifyAuth(req);
        return user;
    } catch (error) {
        res.status(401).json({ message: 'Yetkilendirme başarısız' });
        return null;
    }
};

module.exports = { verifyAuth, requireAuth }; 