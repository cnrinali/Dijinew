const express = require('express');
const router = express.Router();
const cardController = require('./card.controller'); // Controller'ı tek bir obje olarak import edelim

// Rotaları korumak için authMiddleware'den protect fonksiyonunu import et
const { protect } = require('../../middleware/authMiddleware');

console.log('>>> card.routes.js (korumalı) yüklendi ve /api/cards altına bağlandı.');

// Middleware uygulanmadan ÖNCE bir log ekleyelim
router.use((req, res, next) => {
    // Eğer public rota buraya düşüyorsa bir sorun var demektir.
    if (req.originalUrl.includes('/public/')) {
        console.error('HATA: Public rota (/public/) yanlışlıkla korumalı card.routes.js e GELDİ');
    }
    next();
});

// *** HERKESE AÇIK ROTA BURADAN KALDIRILDI ***
// Middleware'lerden ÖNCE ve en başta tanımlanmalı!
// router.get('/public/:slugOrId', cardController.getPublicCard);

// --- Kimlik Doğrulaması Gerektiren Rotalar --- 

// Bu router'a bağlı sonraki tüm rotalar için protect middleware'ini uygula
router.use(protect);

// Route tanımları
router.route('/')
    .get(cardController.getCards)      // GET /api/cards
    .post(cardController.createCard);   // POST /api/cards

router.route('/:id')
    .get(cardController.getCardById)   // GET /api/cards/:id
    .put(cardController.updateCard)    // PUT /api/cards/:id
    .delete(cardController.deleteCard); // DELETE /api/cards/:id

// Yeni rota: Kart durumunu değiştirme
router.patch('/:id/status', cardController.toggleCardStatus);

// Slug ile kart işlemleri
router.put('/slug/:slug/ownership', cardController.updateCardOwnershipBySlug);
router.put('/slug/:slug', cardController.updateCardBySlug);

// Banka hesap bilgileri rotaları
router.route('/:cardId/bank-accounts')
    .get(cardController.getCardBankAccounts)    // GET /api/cards/:cardId/bank-accounts
    .post(cardController.addCardBankAccount);   // POST /api/cards/:cardId/bank-accounts

router.route('/:cardId/bank-accounts/:accountId')
    .put(cardController.updateCardBankAccount)    // PUT /api/cards/:cardId/bank-accounts/:accountId
    .delete(cardController.deleteCardBankAccount); // DELETE /api/cards/:cardId/bank-accounts/:accountId

module.exports = router; 