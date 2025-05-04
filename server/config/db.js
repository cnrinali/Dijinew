const sql = require('mssql');
require('dotenv').config({ path: '../.env' }); // Ana dizindeki .env dosyasını yükle

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Azure'da çalıştırıyorsanız true yapın
        trustServerCertificate: true // Localhost veya güvenilir olmayan sertifika için true
    }
};

let pool;

const ensurePool = async () => {
    if (!pool) {
        try {
            console.log("MSSQL bağlantı havuzu oluşturuluyor...");
            pool = await new sql.ConnectionPool(config).connect();
            console.log("MSSQL bağlantısı başarılı.");
            pool.on('error', err => {
                console.error('SQL Havuz Hatası:', err);
                // Hata durumunda havuzu yeniden oluşturmayı deneyebiliriz
                pool = null; 
            });
        } catch (err) {
            console.error("MSSQL bağlantı hatası:", err);
            pool = null; // Bağlantı başarısızsa pool'u null yap
            throw err; // Hatanın yukarıya iletilmesi
        }
    } else {
        // Havuz zaten varsa, bağlantıyı test et (isteğe bağlı)
        try {
            await pool.request().query('SELECT 1');
            // console.log("Mevcut MSSQL bağlantısı aktif.");
        } catch (err) {
            console.error("Mevcut MSSQL bağlantısı test edilemedi, yeniden bağlanılıyor...", err);
            pool = null;
            return ensurePool(); // Yeniden bağlanmayı dene
        }
    }
    return pool;
};

// Havuzu direkt export etmek yerine, havuzu getiren bir async fonksiyon export et
const getPool = async () => {
    if (!pool) {
        return await ensurePool();
    }
    return pool;
};

module.exports = { sql, getPool }; 