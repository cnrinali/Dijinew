const express = require('express');
const router = express.Router();
const cardController = require('./card.controller'); // Controller'ı import et

console.log('>>> public.routes.js yüklendi ve /api/public altına bağlandı.');

// *** Sadece Herkese Açık Rota ***
router.get('/:slugOrId', (req, res, next) => {
    console.log(`>>> İstek /:slugOrId (${req.params.slugOrId}) için public.routes.js'e GELDİ (Base: /api/public)`);
    next(); // Asıl controller fonksiyonuna devam et
}, cardController.getPublicCard);

module.exports = router; 