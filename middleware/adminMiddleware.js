const adminMiddleware = (req, res, next) => {
    // Bu middleware'in protect'ten sonra çalıştığını varsayıyoruz,
    // dolayısıyla req.user mevcut olmalı.
    if (req.user && req.user.role === 'admin') {
        // Kullanıcı admin ise bir sonraki adıma geç
        next();
    } else {
        // Admin değilse veya kullanıcı bilgisi yoksa yetkisiz hatası döndür
        res.status(403).json({ message: 'Yetkisiz erişim: Yönetici yetkisi gereklidir.' });
    }
};

module.exports = { adminMiddleware }; 