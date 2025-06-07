const multer = require('multer');
const path = require('path');

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
    // Excel dosyaları için MIME tipleri
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Sadece Excel dosyaları yüklenebilir.'), false);
    }
};

// Multer middleware'ini oluştur
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload; 