require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Path modülünü import et
const fs = require('fs'); // File system modülünü import et
const { getPool } = require('./config/db'); // db.js'den fonksiyonu import et
const authRoutes = require('./api/auth/auth.routes'); // Auth rotalarını import et
const publicCardRoutes = require('./api/cards/public.routes.js'); // Yeni public card rotaları
const cardRoutes = require('./api/cards/card.routes'); // Korumalı card rotaları
const uploadRoutes = require('./api/upload/upload.routes'); // Upload rotalarını import et
const userRoutes = require('./api/users/user.routes.js'); // User rotalarını import et
const adminRoutes = require('./api/admin/admin.routes.js'); // Tüm admin rotalarını içeren dosya
const corporateRoutes = require('./api/corporate/corporate.routes.js'); // Kurumsal rotaları import et
const activityRoutes = require('./api/activities/activity.routes.js'); // Activity rotalarını import et
const analyticsRoutes = require('./api/analytics/analytics.routes.js'); // Analytics rotalarını import et

const app = express();
const port = process.env.PORT || 5001;

// Yükleme klasörünü kontrol et/oluştur
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
    console.log(`'uploads' klasörü oluşturuldu: ${uploadsDir}`);
}

// CORS Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      'https://dijinew.vercel.app', // Production frontend
    ];
    
    // Allow any Vercel preview URL
    if (origin.includes('dijinew') && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
// Gelen tüm istekleri logla
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json()); // Gelen JSON isteklerini parse etmek için

// Statik dosyaları (yüklenen resimler) sunmak için
app.use('/uploads', express.static(uploadsDir));

// Temel Route
app.get('/', (req, res) => {
  res.send('Dijinew Kartvizit API Çalışıyor!');
});

// API Rotaları
app.use('/api/auth', authRoutes); // Auth rotalarını kullan
app.use('/api/users', userRoutes); // User rotalarını kullan
app.use('/api/admin', adminRoutes); // Tüm admin rotalarını /api/admin altına bağla
app.use('/api/corporate', corporateRoutes); // Kurumsal rotaları /api/corporate altına bağla
app.use('/api/activities', activityRoutes); // Activity rotalarını /api/activities altına bağla
app.use('/api/analytics', analyticsRoutes); // Analytics rotalarını /api/analytics altına bağla

// Card Rotaları (Farklı base path'ler ile)
app.use('/api/public', publicCardRoutes); // Public card rotalarını /api/public altına bağla
app.use('/api/cards', cardRoutes); // Korumalı card rotaları /api/cards altında kalsın

app.use('/api/upload', uploadRoutes); // Upload rotalarını kullan
// TODO: Diğer API Rotalarını buraya ekleyeceğiz (örn: /api/cards)

// Veritabanı bağlantısını kontrol et ve sunucuyu başlat
const startServer = async () => {
    try {
        await getPool(); // Veritabanı bağlantısını başlat/kontrol et
        app.listen(port, () => {
            console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
            console.log(`Yüklenen dosyalar ${uploadsDir} klasöründe saklanacak ve /uploads altında sunulacak.`);
        });
    } catch (err) {
        console.error('Sunucu başlatılırken veritabanına bağlanılamadı:', err);
        process.exit(1); // Hata durumunda uygulamayı durdur
    }
};

startServer();

// TODO: API Rotalarını buraya ekleyeceğiz (örn: /api/auth, /api/cards) 