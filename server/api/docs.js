const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Scalar API Reference HTML
router.get('/', (req, res) => {
  const swaggerPath = path.join(__dirname, '..', 'swagger.json');
  const swaggerUrl = `${req.protocol}://${req.get('host')}/api/docs/swagger.json`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dijinew API Documentation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <script
    id="api-reference"
    data-url="${swaggerUrl}"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>
  `;
  
  res.send(html);
});

// Swagger JSON endpoint
router.get('/swagger.json', (req, res) => {
  const swaggerPath = path.join(__dirname, '..', 'swagger.json');
  
  try {
    const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerJson = JSON.parse(swaggerFile);
    
    // Dinamik olarak server URL'lerini güncelle
    swaggerJson.servers = [
      {
        url: `${req.protocol}://${req.get('host')}`,
        description: "Current Server"
      },
      {
        url: "http://localhost:5001",
        description: "Development Server"
      },
      {
        url: "https://api.dijinew.com",
        description: "Production Server"
      }
    ];
    
    res.json(swaggerJson);
  } catch (error) {
    console.error('Swagger dosyası okunamadı:', error);
    res.status(500).json({ 
      success: false, 
      message: 'API dokümantasyonu yüklenemedi',
      error: error.message 
    });
  }
});

module.exports = router;
