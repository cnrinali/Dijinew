const { getPool } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function addLanguageSupport() {
    try {
        console.log('🌍 Dil desteği ekleniyor...');
        const pool = await getPool();
        
        // Users tablosuna language kolonu ekle
        console.log('📝 Users tablosuna language kolonu ekleniyor...');
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'language')
            BEGIN
                ALTER TABLE Users ADD language NVARCHAR(5) DEFAULT 'tr' NOT NULL;
                PRINT 'Users tablosuna language kolonu eklendi (varsayılan: tr).';
            END
            ELSE
            BEGIN
                PRINT 'Users tablosunda language kolonu zaten mevcut.';
            END
        `);
        
        // Users language constraint ekle
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Users_Language')
            BEGIN
                ALTER TABLE Users ADD CONSTRAINT CK_Users_Language CHECK (language IN ('tr', 'en', 'ar', 'ru', 'pt'));
                PRINT 'Users tablosuna language check constraint eklendi.';
            END
        `);
        
        // Companies tablosuna language kolonu ekle
        console.log('📝 Companies tablosuna language kolonu ekleniyor...');
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'language')
            BEGIN
                ALTER TABLE Companies ADD language NVARCHAR(5) DEFAULT 'tr' NOT NULL;
                PRINT 'Companies tablosuna language kolonu eklendi (varsayılan: tr).';
            END
            ELSE
            BEGIN
                PRINT 'Companies tablosunda language kolonu zaten mevcut.';
            END
        `);
        
        // Companies language constraint ekle
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Companies_Language')
            BEGIN
                ALTER TABLE Companies ADD CONSTRAINT CK_Companies_Language CHECK (language IN ('tr', 'en', 'ar', 'ru', 'pt'));
                PRINT 'Companies tablosuna language check constraint eklendi.';
            END
        `);
        
        // Index'leri oluştur
        console.log('📊 Index\'ler oluşturuluyor...');
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Language' AND object_id = OBJECT_ID('Users'))
            BEGIN
                CREATE INDEX IX_Users_Language ON Users(language);
                PRINT 'Users.language için index oluşturuldu.';
            END
        `);
        
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Companies_Language' AND object_id = OBJECT_ID('Companies'))
            BEGIN
                CREATE INDEX IX_Companies_Language ON Companies(language);
                PRINT 'Companies.language için index oluşturuldu.';
            END
        `);
        
        console.log('✅ Dil desteği başarıyla eklendi!');
        console.log('📋 Desteklenen diller:');
        console.log('   - 🇹🇷 Türkçe (tr) - Varsayılan');
        console.log('   - 🇬🇧 İngilizce (en)');
        console.log('   - 🇸🇦 Arapça (ar)');
        console.log('   - 🇷🇺 Rusça (ru)');
        console.log('   - 🇵🇹 Portekizce (pt)');
        
    } catch (error) {
        console.error('❌ Dil desteği eklenirken hata:', error);
        throw error;
    }
}

// Script doğrudan çalıştırılırsa
if (require.main === module) {
    addLanguageSupport()
        .then(() => {
            console.log('✅ İşlem tamamlandı!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ İşlem başarısız:', error);
            process.exit(1);
        });
}

module.exports = { addLanguageSupport };
