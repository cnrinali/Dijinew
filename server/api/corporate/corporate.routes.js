const express = require('express');
const router = express.Router();
const {
    getCompanyCards,
    createCompanyCard,
    createCompanyUser,
    getCompanyUsers
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

// Gelecekte eklenecek diğer kurumsal rotalar buraya gelebilir:
// router.route('/users').get(protect, authorize('corporate'), getCompanyUsers);
// router.route('/users').post(protect, authorize('corporate'), createCompanyUser);
// vb.

module.exports = router; 