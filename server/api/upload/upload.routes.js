const express = require('express');
const router = express.Router();
const { upload, uploadDocument, uploadImage } = require('./upload.controller');

// Döküman yükleme endpoint'i
router.post('/document', upload.single('document'), uploadDocument);

// Resim yükleme endpoint'i
router.post('/', uploadImage);

module.exports = router;