const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile, 
    changePassword,
    getUserBankAccounts,
    addUserBankAccount,
    updateUserBankAccount,
    deleteUserBankAccount
} = require('./user.controller');
const { protect } = require('../../middleware/authMiddleware'); // Path'in doğru olduğundan emin olun

// Profil bilgilerini getir (Client'ın istediği path: /api/users/profile)
router.get('/profile', protect, getUserProfile); 

// Profil bilgilerini güncelle (isim, e-posta)
router.put('/profile', protect, updateUserProfile);

// Şifreyi değiştir
router.put('/change-password', protect, changePassword);

// Banka hesap bilgileri
router.get('/bank-accounts', protect, getUserBankAccounts);
router.post('/bank-accounts', protect, addUserBankAccount);
router.put('/bank-accounts/:id', protect, updateUserBankAccount);
router.delete('/bank-accounts/:id', protect, deleteUserBankAccount);

module.exports = router; 