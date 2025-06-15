const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Kart görüntülenmesini kaydet (public - herkes erişebilir)
router.post('/view/:cardId', analyticsController.recordCardView);

// Link tıklamasını kaydet (public - herkes erişebilir)
router.post('/click/:cardId', analyticsController.recordCardClick);

// Kart istatistiklerini getir (kart sahibi veya admin)
router.get('/card/:cardId', protect, analyticsController.getCardStats);

// Kullanıcının tüm kartları için istatistikler (kullanıcı kendisi veya admin)
router.get('/user/:userId', protect, analyticsController.getUserStats);

// Admin istatistikleri (sadece admin)
router.get('/admin', protect, authorize('admin'), analyticsController.getAdminStats);

module.exports = router; 