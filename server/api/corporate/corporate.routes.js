const express = require('express');
const router = express.Router();
const {
    getCompanyCards,
    createCompanyCard,
    getCompanyCardById,
    deleteCompanyCard,
    getCompanyCardBankAccounts,
    createCompanyUser,
    getCompanyUsers,
    getCompanyInfo,
    updateCompanyInfo,
    updateCompanyLanguage,
    exportCompanyCardsToExcel,
    importCompanyCardsFromExcel
} = require('./corporate.controller');
const { protect, authorize } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

// Şirkete ait kartları listeleme ve oluşturma rotaları
router.route('/cards')
    .get(protect, authorize('corporate'), getCompanyCards)
    .post(protect, authorize('corporate'), createCompanyCard);

// Şirkete ait kartları silme rotası
router.route('/cards/:id')
    .get(protect, authorize('corporate'), getCompanyCardById)
    .delete(protect, authorize('corporate'), deleteCompanyCard);

// Şirkete ait kartların banka hesapları
router.route('/cards/:cardId/bank-accounts')
    .get(protect, authorize('corporate'), getCompanyCardBankAccounts);

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

// Excel export/import rotaları
router.route('/cards/export')
    .get(protect, authorize('corporate'), exportCompanyCardsToExcel);

router.route('/cards/import')
    .post(protect, authorize('corporate'), upload.single('file'), importCompanyCardsFromExcel);

module.exports = router; 