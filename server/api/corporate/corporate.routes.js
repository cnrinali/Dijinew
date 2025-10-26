const express = require('express');
const router = express.Router();
const {
    getCompanyCards,
    createCompanyCard,
    createCompanyUser,
    getCompanyUsers,
    getCompanyInfo,
    updateCompanyInfo,
    updateCompanyLanguage
} = require('./corporate.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Şirkete ait kartları listeleme ve oluşturma rotaları
router.route('/cards')
    .get(protect, authorize('corporate'), getCompanyCards)
    .post(protect, authorize('corporate'), createCompanyCard);

// Şirkete ait kullanıcıları listeleme ve oluşturma rotaları
router.route('/users')
    .get(protect, authorize('corporate'), getCompanyUsers)
    .post(protect, authorize('corporate'), createCompanyUser);

// Şirket bilgilerini getirme ve güncelleme
router.route('/company')
    .get(protect, authorize('corporate'), getCompanyInfo)
    .put(protect, authorize('corporate'), updateCompanyInfo);

// Şirket dili güncelleme
router.route('/company/language')
    .put(protect, authorize('corporate'), updateCompanyLanguage);

module.exports = router; 