const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Veritabanı konfigürasyonu
const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourPassword123!',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'DijinewDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function runMigration() {
    try {
        console.log('Veritabanına bağlanılıyor...');
        await sql.connect(config);
        console.log('✅ Veritabanı bağlantısı başarılı');

        // Migration dosyasını oku
        const migrationPath = path.join(__dirname, 'add_missing_social_media_fields.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('Migration çalıştırılıyor...');
        const result = await sql.query(migrationSQL);
        
        console.log('✅ Migration başarıyla tamamlandı');
        console.log('Yeni sosyal medya ve pazaryeri alanları veritabanına eklendi');

        // Test için bir kart oluştur
        console.log('\nTest kartı oluşturuluyor...');
        const testCard = await sql.query(`
            INSERT INTO Cards (
                userId, cardName, name, title, company, 
                whatsappUrl, facebookUrl, telegramUrl, youtubeUrl, 
                skypeUrl, wechatUrl, snapchatUrl, pinterestUrl, tiktokUrl,
                arabamUrl, letgoUrl, pttAvmUrl, ciceksepetiUrl, 
                websiteUrl, whatsappBusinessUrl, isActive
            ) VALUES (
                1, 'Test Kart', 'Test Kullanıcı', 'Test Ünvan', 'Test Şirket',
                'https://wa.me/1234567890', 'https://facebook.com/test', 'https://t.me/test', 'https://youtube.com/test',
                'https://skype.com/test', 'https://wechat.com/test', 'https://snapchat.com/test', 'https://pinterest.com/test', 'https://tiktok.com/test',
                'https://arabam.com/test', 'https://letgo.com/test', 'https://pttavm.com/test', 'https://ciceksepeti.com/test',
                'https://website.com/test', 'https://wa.me/business/1234567890', 1
            );
        `);

        console.log('✅ Test kartı başarıyla oluşturuldu');

        // Test kartını kontrol et
        const checkResult = await sql.query(`
            SELECT TOP 1 
                whatsappUrl, facebookUrl, telegramUrl, youtubeUrl, 
                skypeUrl, wechatUrl, snapchatUrl, pinterestUrl, tiktokUrl,
                arabamUrl, letgoUrl, pttAvmUrl, ciceksepetiUrl, 
                websiteUrl, whatsappBusinessUrl
            FROM Cards 
            WHERE cardName = 'Test Kart'
        `);

        if (checkResult.recordset.length > 0) {
            console.log('✅ Tüm yeni alanlar başarıyla kaydedildi:');
            console.log(JSON.stringify(checkResult.recordset[0], null, 2));
        }

        // Test kartını sil
        await sql.query(`DELETE FROM Cards WHERE cardName = 'Test Kart'`);
        console.log('✅ Test kartı temizlendi');

    } catch (error) {
        console.error('❌ Migration hatası:', error);
    } finally {
        await sql.close();
        console.log('Veritabanı bağlantısı kapatıldı');
    }
}

runMigration();
