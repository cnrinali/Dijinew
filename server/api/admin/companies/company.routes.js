const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../../middleware/authMiddleware'); // Path'i kontrol et
const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require('./company.controller');

// Tüm route'lar admin yetkisi gerektirir
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .post(createCompany)    // POST /api/admin/companies
    .get(getCompanies);      // GET /api/admin/companies

router.route('/:id')
    .get(getCompanyById)   // GET /api/admin/companies/:id
    .put(updateCompany)    // PUT /api/admin/companies/:id
    .delete(deleteCompany); // DELETE /api/admin/companies/:id

module.exports = router; 