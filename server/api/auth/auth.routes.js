const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
} = require('./auth.controller');

// const { protect } = require('../../middleware/authMiddleware'); // Yetkilendirme için (sonra eklenecek)

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // Belki protect middleware eklenecek
router.post('/forgot', forgotPassword);
router.put('/reset/:resetToken', resetPassword);

module.exports = router; 