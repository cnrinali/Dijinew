require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPool } = require('./config/db');

const app = express();
const port = process.env.PORT || 3001;

// Basit CORS
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Dijinew API Test', 
        port: port,
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        port: port,
        timestamp: new Date().toISOString()
    });
});

async function startServer() {
    try {
        console.log('🚀 API başlatılıyor...');
        console.log('Port:', port);
        console.log('Environment:', process.env.NODE_ENV);
        
        // Database bağlantısını test et
        console.log('🔍 Database bağlantısı kontrol ediliyor...');
        await getPool();
        console.log('✅ Database bağlantısı başarılı');
        
        // Server'ı başlat
        app.listen(port, () => {
            console.log(`✅ API başarıyla başlatıldı!`);
            console.log(`🌐 http://localhost:${port}`);
            console.log(`🔍 Health check: http://localhost:${port}/api/health`);
        });
        
    } catch (error) {
        console.error('❌ API başlatma hatası:', error.message);
        console.error('Detay:', error);
        process.exit(1);
    }
}

startServer();
