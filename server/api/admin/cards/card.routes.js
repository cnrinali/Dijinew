const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams ekledik (nested route için)
const { protect, authorize } = require('../../../middleware/authMiddleware'); // Auth middleware
const {
    getCards,
    createCard,
    updateCard,
    deleteCard
} = require('./card.controller');

// Tüm kart route'ları admin yetkisi gerektirir
router.use(protect);
router.use(authorize('admin'));

// Route'ları tanımla
router.route('/')
    .get(getCards)      // GET /api/admin/cards veya GET /api/admin/companies/:companyId/cards
    .post(createCard);     // POST /api/admin/cards

router.route('/:id')
    // GET /api/admin/cards/:id (Şimdilik tek kart getirme yok, listeleme yeterli)
    .put(updateCard)    // PUT /api/admin/cards/:id
    .delete(deleteCard); // DELETE /api/admin/cards/:id

module.exports = router; 