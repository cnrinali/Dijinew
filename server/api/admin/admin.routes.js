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
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require('./admin.controller');
const { protect } = require('../../middleware/authMiddleware');
const { authorize } = require('../../middleware/authMiddleware');
const companyRoutes = require('./companies/company.routes');
const cardRoutes = require('./cards/card.routes');

// Middleware'leri bu router'a gelen tüm istekler için uygula
router.use(protect);          // Önce giriş yapmış mı kontrol et
router.use(authorize('admin')); // Sonra admin mi kontrol et

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
    .get(getCompanies);

router.route('/companies/:id')
    .get(getCompanyById)
    .put(updateCompany)
    .delete(deleteCompany);

// Şirket Yönetimi Route'ları
router.use('/companies', companyRoutes);

// Kart Yönetimi Route'ları
router.use('/cards', cardRoutes);

// Şirketlere Özel Kart Route'ları (Nested)
router.use('/companies/:companyId/cards', cardRoutes);

module.exports = router; 