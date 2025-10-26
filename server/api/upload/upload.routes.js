const express = require('express');
const router = express.Router();
const { upload, uploadDocument } = require('./upload.controller');

// Döküman yükleme endpoint'i
router.post('/document', upload.single('document'), uploadDocument);

module.exports = router;