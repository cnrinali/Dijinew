require('dotenv').config();
const { getPool } = require('./config/db');

async function testConnection() {
    try {
        console.log('🔍 Database bağlantısı test ediliyor...');
        console.log('Host:', process.env.DB_HOST);
        console.log('Database:', process.env.DB_DATABASE);
        console.log('User:', process.env.DB_USER);
        
        const pool = await getPool();
        console.log('✅ Database bağlantısı başarılı!');
        
        // Basit bir sorgu test et
        const result = await pool.request().query('SELECT 1 as test');
        console.log('✅ Test sorgusu başarılı:', result.recordset);
        
        await pool.close();
        console.log('✅ Bağlantı kapatıldı');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database bağlantı hatası:', error.message);
        console.error('Detay:', error);
        process.exit(1);
    }
}

testConnection();
