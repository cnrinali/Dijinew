const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer konfigürasyonu
const storage = multer.diskStorage({
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

const upload = multer({
    storage: storage,
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

// Döküman yükleme
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Dosya yüklenmedi'
            });
        }

        const documentUrl = `/uploads/documents/${req.file.filename}`;
        
        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: documentUrl,
                size: req.file.size,
                type: req.file.mimetype
            },
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

module.exports = {
    upload,
    uploadDocument
};
