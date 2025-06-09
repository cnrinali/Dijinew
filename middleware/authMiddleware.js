const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../config/db');

const protect = async (req, res, next) => {
    console.log('--- Protect Middleware Başladı ---'); // Log 1
    let token;

    // Token'ı Authorization header'dan al (Bearer token)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Token'ı header'dan ayıkla ('Bearer ' kısmını atla)
            token = req.headers.authorization.split(' ')[1];
            console.log('Token bulundu:', token ? 'Evet' : 'Hayır'); // Log 2

            // Token'ı doğrula (Payload artık role ve companyId içerebilir, ancak verify sadece id'ye bakar)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token doğrulandı, decoded payload:', decoded); // Payload'ı logla

            // Kullanıcıyı bul (role ve companyId eklendi) - GÜNCELLENDİ
            const pool = await getPool();
            const userResult = await pool.request()
                .input('userId', sql.Int, decoded.id) 
                // Sorguya companyId eklendi
                .query('SELECT id, name, email, role, companyId FROM Users WHERE id = @userId'); 
            
            console.log('Kullanıcı bulundu mu:', userResult.recordset.length > 0 ? 'Evet' : 'Hayır'); // Log 4

            if (userResult.recordset.length === 0) {
                 console.log('Kullanıcı bulunamadı, 401 dönülüyor.'); // Log 5
                 return res.status(401).json({ message: 'Yetkilendirme başarısız, kullanıcı bulunamadı' });
            }

            // Kullanıcı bilgilerini isteğe ekle (companyId dahil) - GÜNCELLENDİ
            req.user = userResult.recordset[0]; 
            console.log('req.user oluşturuldu:', req.user); // Kullanıcı objesini logla
            console.log('--- Protect Middleware Başarılı, next() çağrılıyor --- '); // Log 6
            next(); // Sonraki middleware veya route handler'a geç

        } catch (error) {
            console.error('Token doğrulama hatası:', error.message); // Log 7
            // Hata mesajını daha spesifik hale getirelim
            if (error.name === 'JsonWebTokenError') {
                 return res.status(401).json({ message: 'Yetkilendirme başarısız, geçersiz token yapısı' });
            } else if (error.name === 'TokenExpiredError') {
                 return res.status(401).json({ message: 'Yetkilendirme başarısız, token süresi dolmuş' });
            } else {
                 return res.status(401).json({ message: 'Yetkilendirme başarısız, token doğrulanamadı' });
            }
        }
    }

    if (!token) {
        console.log('Token bulunamadı (Bearer), 401 dönülüyor.'); // Log 8
        res.status(401).json({ message: 'Yetkilendirme başarısız, token bulunamadı' });
    }
};

// Opsiyonel: Belirli roller için yetkilendirme middleware'i (örn: admin)
const authorize = (...roles) => {
    return (req, res, next) => {
        // protect middleware'inin req.user'ı ve req.user.role'ü ayarladığını varsayıyoruz
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
             console.log(`Yetkisiz Erişim Denemesi: Kullanıcı Rolü: ${req.user?.role}, Gerekli Roller: ${roles}`);
             // Kullanıcı giriş yapmış ama rolü yetersizse 403 Forbidden dön
             return res.status(403).json({ message: `Bu işlemi yapmak için yetkiniz yok (${roles.join(' veya ')} rolü gerekli).` });
        }
        // Rol uygunsa devam et
        console.log(`Yetkili Erişim: Kullanıcı Rolü: ${req.user.role}, İzin Verilen Roller: ${roles}`);
        next();
    }
}

module.exports = { protect, authorize }; 