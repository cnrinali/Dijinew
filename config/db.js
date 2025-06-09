import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
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

export { sql, getPool }; 