const express = require('express');
const router = express.Router();
const { protect: authMiddleware } = require('../../middleware/authMiddleware');
const { 
    createSimpleWizard, 
    validateSimpleWizardToken, 
    getCardByToken, 
    updateCardByToken, 
    updateCardOwnership, 
    markSimpleTokenAsUsed,
    getUserSimpleWizards,
    debugDatabaseSchema,
    testPermanentSlug
} = require('./simple-wizard.controller');

// Sihirbaz oluştur (Admin/Corporate için - korumalı)
router.post('/create', authMiddleware, createSimpleWizard);

// Token doğrula (Herkese açık)
router.get('/validate/:token', validateSimpleWizardToken);

// Token ile kart bilgilerini getir (Herkese açık)
router.get('/card/:token', getCardByToken);

// Token ile kart bilgilerini güncelle (Herkese açık)
router.put('/card/:token', updateCardByToken);

// Kartın sahipliğini güncelle (Herkese açık - wizard kullanımı için)
router.put('/update-ownership/:token', updateCardOwnership);

// Token'ı kullanıldı olarak işaretle (Herkese açık - wizard kullanımı için)
router.put('/use/:token', markSimpleTokenAsUsed);

// Kullanıcının sihirbazlarını listele (Admin/Corporate için - korumalı)
router.get('/my-wizards', authMiddleware, getUserSimpleWizards);

// Debug: Database şemasını kontrol et ve düzelt (Herkese açık - debugging için)
router.get('/debug-schema', debugDatabaseSchema);

// Debug: PermanentSlug test (Herkese açık - debugging için)
router.get('/test-permanent-slug', testPermanentSlug);

module.exports = router;
