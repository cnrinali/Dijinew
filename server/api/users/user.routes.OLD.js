const express = require('express');
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile, 
    changePassword 
} = require('./user.controller');
const { protect } = require('../../middleware/authMiddleware');

// Profil bilgilerini getir
router.get('/profile', protect, getUserProfile);

// Profil bilgilerini güncelle (isim, e-posta)
router.put('/profile', protect, updateUserProfile);

// Şifreyi değiştir
router.put('/change-password', protect, changePassword);

module.exports = router; 