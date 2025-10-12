const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// --- Multer Yapılandırması ---

// Dosyaların nereye kaydedileceğini ve dosya adlarının nasıl oluşturulacağını belirle
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Dosyaları server kök dizinindeki 'uploads' klasörüne kaydet
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Dosya adını benzersiz yap (orijinal ad + tarih + uzantı)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Dosya türünü kontrol et (sadece resimlere izin ver)
const fileFilter = (req, file, cb) => {
    console.log('[Upload Route] fileFilter çalışıyor, mimetype:', file.mimetype);
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Resimse kabul et
    } else {
        console.error('[Upload Route] Hatalı dosya türü reddedildi:', file.mimetype);
        cb(new Error(`Desteklenmeyen dosya türü: ${file.mimetype}. Sadece resim dosyaları kabul edilir.`), false);
    }
};

// Multer middleware'ini oluştur (tek dosya yükleme, alan adı 'image')
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit 10MB
}); 

// --- Rota Tanımı ---

// POST /api/upload
// 'image' alanından tek bir dosya yüklemesini bekle
// Bu rotayı korumak isteyebiliriz (sadece giriş yapan kullanıcılar yüklesin)
// const { protect } = require('../../middleware/authMiddleware');
// router.post('/', protect, upload.single('image'), (req, res) => {

// Middleware öncesi log
router.post('/', (req, res, next) => {
    console.log('[Upload Route] POST / isteği alındı, multer middleware öncesi.');
    next();
}, upload.single('image'), (req, res, next) => { // Multer sonrası ana işleyici
    console.log('[Upload Route] Multer middleware sonrası, req.file:', req.file);
    // Dosya yükleme başarılıysa req.file objesi mevcut olur
    if (req.file) {
        console.log('Dosya başarıyla yüklendi:', req.file);
        // Frontend'e dosyanın erişilebilir URL'ini gönder
        // (server.js'de /uploads yolunu statik olarak ayarladık)
        res.status(200).json({
            message: 'Dosya başarıyla yüklendi',
            // ÖNEMLİ: Frontend'in erişebilmesi için tam URL yerine sadece yolu gönderiyoruz.
            // Frontend, base URL'i (http://localhost:5001) veya proxy'yi kullanarak tam yolu oluşturmalı.
            // Ancak basitlik adına şimdilik sadece relative path gönderelim.
            filePath: `/uploads/${req.file.filename}` 
        });
    } else {
        // Bu blok normalde multer hata yakalayıcısı tarafından ele alınmalı
        console.error('[Upload Route] Multer sonrası req.file bulunamadı ama hata da yok?'); 
        res.status(400).json({ message: 'Dosya yüklenemedi (req.file yok).', file: req.file }); // req.file'ı da gönderelim
    }
}, (error, req, res, next) => {
    // Multer hata yönetimi (örn: dosya boyutu limiti, fileFilter hatası)
    console.error('[Upload Route] Multer hata yakalayıcısı:', error.message);
    // Hata mesajını daha detaylı logla
    console.error(error);
    res.status(400).json({ message: `Dosya yükleme hatası: ${error.message}` });
});

module.exports = router; 