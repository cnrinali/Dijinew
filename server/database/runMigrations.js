const { getPool } = require('../config/db');

async function runMigrations() {
    try {
        console.log('🔄 Veritabanı migration işlemleri başlatılıyor...');
        const pool = await getPool();
        
        // Companies tablosuna updatedAt kolonu ekle
        const checkCompaniesUpdatedAt = await pool.request().query(`
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'updatedAt'
        `);
        
        if (checkCompaniesUpdatedAt.recordset[0].count === 0) {
            console.log('📝 Companies tablosuna updatedAt kolonu ekleniyor...');
            await pool.request().query(`
                ALTER TABLE Companies ADD updatedAt DATETIME2 DEFAULT GETDATE();
            `);
            
            // Mevcut kayıtlar için updatedAt değerini createdAt ile aynı yap
            const checkCreatedAt = await pool.request().query(`
                SELECT COUNT(*) as count 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'createdAt'
            `);
            
            if (checkCreatedAt.recordset[0].count > 0) {
                await pool.request().query(`
                    UPDATE Companies SET updatedAt = createdAt WHERE updatedAt IS NULL;
                `);
            } else {
                await pool.request().query(`
                    UPDATE Companies SET updatedAt = GETDATE() WHERE updatedAt IS NULL;
                `);
            }
            
            console.log('✅ Companies tablosuna updatedAt kolonu başarıyla eklendi.');
        } else {
            console.log('✓ Companies tablosunda updatedAt kolonu zaten mevcut.');
        }

        // Dil desteği ekle (Users ve Companies tablolarına)
        const checkUsersLanguage = await pool.request().query(`
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'language'
        `);
        
        if (checkUsersLanguage.recordset[0].count === 0) {
            console.log('🌍 Users ve Companies tablolarına dil desteği ekleniyor...');
            const { addLanguageSupport } = require('./migrate_language_support');
            await addLanguageSupport();
        } else {
            console.log('✓ Dil desteği zaten mevcut.');
        }
        
        console.log('✅ Tüm migration işlemleri tamamlandı.');
    } catch (error) {
        console.error('❌ Migration hatası:', error);
        throw error;
    }
}

module.exports = { runMigrations };



