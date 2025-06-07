const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../../../middleware/authMiddleware');
const multer = require('multer');
const {
    getCards,
    createCard,
    updateCard,
    deleteCard,
    exportCardsToExcel,
    importCardsFromExcel,
    generateBulkQRCodes,
    getCardQRCode
} = require('./card.controller');
const upload = require('../../../middleware/uploadMiddleware');

// Tüm kart route'ları admin yetkisi gerektirir
router.use(protect);
router.use(authorize('admin'));

// Özel route'ları önce tanımla
router.get('/export', (req, res, next) => { console.log('Route: /api/admin/cards/export hit'); next(); }, exportCardsToExcel);
router.get('/qr-codes', (req, res, next) => { console.log('Route: /api/admin/cards/qr-codes hit'); next(); }, generateBulkQRCodes);
router.post('/import', upload.single('file'), (req, res, next) => { console.log('Route: /api/admin/cards/import hit'); next(); }, importCardsFromExcel);

// Temel CRUD route'ları
router.route('/')
    .get((req, res, next) => { console.log('Route: /api/admin/cards/ (GET) hit'); next(); }, getCards)
    .post((req, res, next) => { console.log('Route: /api/admin/cards/ (POST) hit'); next(); }, createCard);

router.route('/:id')
    .put((req, res, next) => { console.log(`Route: /api/admin/cards/${req.params.id} (PUT) hit`); next(); }, updateCard)
    .delete((req, res, next) => { console.log(`Route: /api/admin/cards/${req.params.id} (DELETE) hit`); next(); }, deleteCard);

// Tekil QR kod route'u en sonda olmalı
router.get('/:id/qr', (req, res, next) => { console.log(`Route: /api/admin/cards/${req.params.id}/qr hit`); next(); }, getCardQRCode);

module.exports = router; 