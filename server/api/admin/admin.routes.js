const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    getAllCards,
    deleteAnyCard,
    updateUserRole,
    updateAnyUserProfile,
    updateAnyCard,
    getDashboardStats,
    createCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany
} = require('./admin.controller');
const { protect } = require('../../middleware/authMiddleware');
const { authorize } = require('../../middleware/authMiddleware');

// Tüm rotalar önce giriş yapmış olmayı (protect), sonra admin olmayı (authorize('admin')) gerektirir

// İstatistik Rotası
router.get('/stats', getDashboardStats);

// Kullanıcı Yönetimi
router.route('/users')
    .get(getAllUsers);

router.route('/users/:id')
    .delete(deleteUser)
    .put(updateAnyUserProfile);

router.route('/users/:id/role')
    .put(updateUserRole);

// Kartvizit Yönetimi
router.route('/cards')
    .get(getAllCards);

router.route('/cards/:id')
    .delete(deleteAnyCard)
    .put(updateAnyCard);

// Şirket Yönetimi (YENİ)
router.route('/companies')
    .post(createCompany)
    .get(getAllCompanies);

router.route('/companies/:id')
    .put(updateCompany)
    .delete(deleteCompany);

module.exports = router; 