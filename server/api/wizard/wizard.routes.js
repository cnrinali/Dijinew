const express = require('express');
const router = express.Router();
const { protect: authMiddleware } = require('../../middleware/authMiddleware');
const {
    createWizardToken,
    validateWizardToken,
    markTokenAsUsed,
    getUserWizardTokens
} = require('./wizard.controller');

// Token oluştur (Admin/Corporate için - korumalı)
router.post('/create', authMiddleware, createWizardToken);

// Token doğrula (Herkese açık - wizard sayfası için)
router.get('/validate/:token', validateWizardToken);

// Token'ı kullanıldı olarak işaretle (Wizard tamamlandığında) - Opsiyonel auth
router.put('/use/:token', markTokenAsUsed);

// Kullanıcının token'larını listele (Admin/Corporate için - korumalı)
router.get('/my-tokens', authMiddleware, getUserWizardTokens);

module.exports = router; 