const { getPool } = require('../config/db');

async function verifyLanguageSupport() {
    try {
        console.log('🔍 Dil desteği doğrulanıyor...\n');
        const pool = await getPool();
        
        // Users tablosu kontrol
        console.log('📊 Users Tablosu:');
        const usersColumn = await pool.request().query(`
            SELECT 
                COLUMN_NAME,
                DATA_TYPE,
                CHARACTER_MAXIMUM_LENGTH,
                COLUMN_DEFAULT,
                IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'language'
        `);
        
        if (usersColumn.recordset.length > 0) {
            console.log('✅ language kolonu mevcut');
            console.log('   ', usersColumn.recordset[0]);
        } else {
            console.log('❌ language kolonu bulunamadı');
        }
        
        // Users constraint kontrol
        const usersConstraint = await pool.request().query(`
            SELECT name, definition 
            FROM sys.check_constraints 
            WHERE name = 'CK_Users_Language'
        `);
        
        if (usersConstraint.recordset.length > 0) {
            console.log('✅ Check constraint mevcut');
            console.log('   ', usersConstraint.recordset[0]);
        }
        
        // Users index kontrol
        const usersIndex = await pool.request().query(`
            SELECT name, type_desc 
            FROM sys.indexes 
            WHERE name = 'IX_Users_Language'
        `);
        
        if (usersIndex.recordset.length > 0) {
            console.log('✅ Index mevcut');
            console.log('   ', usersIndex.recordset[0]);
        }
        
        console.log('\n📊 Companies Tablosu:');
        
        // Companies tablosu kontrol
        const companiesColumn = await pool.request().query(`
            SELECT 
                COLUMN_NAME,
                DATA_TYPE,
                CHARACTER_MAXIMUM_LENGTH,
                COLUMN_DEFAULT,
                IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'language'
        `);
        
        if (companiesColumn.recordset.length > 0) {
            console.log('✅ language kolonu mevcut');
            console.log('   ', companiesColumn.recordset[0]);
        } else {
            console.log('❌ language kolonu bulunamadı');
        }
        
        // Companies constraint kontrol
        const companiesConstraint = await pool.request().query(`
            SELECT name, definition 
            FROM sys.check_constraints 
            WHERE name = 'CK_Companies_Language'
        `);
        
        if (companiesConstraint.recordset.length > 0) {
            console.log('✅ Check constraint mevcut');
            console.log('   ', companiesConstraint.recordset[0]);
        }
        
        // Companies index kontrol
        const companiesIndex = await pool.request().query(`
            SELECT name, type_desc 
            FROM sys.indexes 
            WHERE name = 'IX_Companies_Language'
        `);
        
        if (companiesIndex.recordset.length > 0) {
            console.log('✅ Index mevcut');
            console.log('   ', companiesIndex.recordset[0]);
        }
        
        // Kullanıcı sayısı
        console.log('\n📈 İstatistikler:');
        const userStats = await pool.request().query(`
            SELECT 
                language,
                COUNT(*) as count
            FROM Users
            GROUP BY language
            ORDER BY count DESC
        `);
        
        console.log('Kullanıcı dil dağılımı:');
        userStats.recordset.forEach(stat => {
            console.log(`   ${stat.language}: ${stat.count} kullanıcı`);
        });
        
        // Şirket sayısı
        const companyStats = await pool.request().query(`
            SELECT 
                language,
                COUNT(*) as count
            FROM Companies
            GROUP BY language
            ORDER BY count DESC
        `);
        
        if (companyStats.recordset.length > 0) {
            console.log('\nŞirket dil dağılımı:');
            companyStats.recordset.forEach(stat => {
                console.log(`   ${stat.language}: ${stat.count} şirket`);
            });
        }
        
        console.log('\n✅ Doğrulama tamamlandı!');
        
    } catch (error) {
        console.error('❌ Doğrulama hatası:', error);
        throw error;
    }
}

// Script doğrudan çalıştırılırsa
if (require.main === module) {
    verifyLanguageSupport()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Doğrulama başarısız:', error);
            process.exit(1);
        });
}

module.exports = { verifyLanguageSupport };
