const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Döküman için Multer konfigürasyonu
const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads/documents');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Benzersiz dosya adı oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'document-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Resim için Multer konfigürasyonu
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads/images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Benzersiz dosya adı oluştur
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Döküman yükleme için multer
const upload = multer({
    storage: documentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Sadece PDF dosyaları kabul et
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Sadece PDF dosyaları yüklenebilir'), false);
        }
    }
});

// Resim yükleme için multer
const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Sadece resim dosyaları kabul et
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir'), false);
        }
    }
});

// Döküman yükleme
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Dosya yüklenmedi'
            });
        }

        // Dosya izinlerini ayarla (644 = rw-r--r--): Owner okuyabilir, herkes okuyabilir
        try {
            fs.chmodSync(req.file.path, 0o644);
        } catch (chmodError) {
            console.warn('Dosya izinleri ayarlanamadı:', chmodError);
            // İzin hatası kritik değil, devam et
        }

        // Tam URL oluştur (production'da api.dijinew.com kullan)
        const protocol = req.protocol || 'https';
        const host = req.get('host') || 'api.dijinew.com';
        const baseUrl = `${protocol}://${host}`;
        const relativePath = `/uploads/documents/${req.file.filename}`;
        const fullUrl = `${baseUrl}${relativePath}`;

        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: fullUrl, // Tam URL
                relativePath: relativePath, // Relative path (legacy için)
                size: req.file.size,
                type: req.file.mimetype
            },
            url: fullUrl, // EditCardPage'in beklediği format için - tam URL
            message: 'Döküman başarıyla yüklendi'
        });

    } catch (error) {
        console.error('Döküman yükleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Döküman yüklenirken hata oluştu'
        });
    }
};

// Resim yükleme
const uploadImage = async (req, res) => {
    try {
        // Multer middleware'ini manuel olarak çalıştır
        imageUpload.single('image')(req, res, (err) => {
            if (err) {
                console.error('Resim yükleme hatası:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message || 'Resim yüklenirken hata oluştu'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Resim dosyası yüklenmedi'
                });
            }

            // Dosya izinlerini ayarla (644 = rw-r--r--): Owner okuyabilir, herkes okuyabilir
            try {
                fs.chmodSync(req.file.path, 0o644);
            } catch (chmodError) {
                console.warn('Dosya izinleri ayarlanamadı:', chmodError);
                // İzin hatası kritik değil, devam et
            }

            // Tam URL oluştur (production'da api.dijinew.com kullan)
            const protocol = req.protocol || 'https';
            const host = req.get('host') || 'api.dijinew.com';
            const baseUrl = `${protocol}://${host}`;
            const relativePath = `/uploads/images/${req.file.filename}`;
            const fullUrl = `${baseUrl}${relativePath}`;
            
            res.json({
                success: true,
                data: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    filePath: fullUrl, // Tam URL (API base URL ile)
                    url: fullUrl, // Tam URL
                    relativePath: relativePath, // Relative path (ger Legacy için)
                    size: req.file.size,
                    type: req.file.mimetype
                },
                message: 'Resim başarıyla yüklendi'
            });
        });

    } catch (error) {
        console.error('Resim yükleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Resim yüklenirken hata oluştu'
        });
    }
};

module.exports = {
    upload,
    uploadDocument,
    uploadImage
};
