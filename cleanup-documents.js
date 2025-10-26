const sql = require('mssql');
const { getPool } = require('./server/config/db');

async function cleanupDocuments() {
    try {
        console.log('🔧 Döküman temizleme başlatılıyor...');
        
        const pool = await getPool();
        
        // Tüm kartları al
        const result = await pool.request().query('SELECT id, documents FROM Cards WHERE documents IS NOT NULL');
        
        console.log(`📊 Toplam ${result.recordset.length} kart bulundu`);
        
        let cleanedCount = 0;
        
        for (const card of result.recordset) {
            try {
                let documents = [];
                
                if (typeof card.documents === 'string') {
                    documents = JSON.parse(card.documents);
                } else {
                    documents = card.documents || [];
                }
                
                const originalCount = documents.length;
                
                // file objesi olan dökümanları kaldır
                const cleanedDocuments = documents.filter(doc => {
                    if (doc.file) {
                        console.log(`🗑️  Card ${card.id}: Removing document with file object:`, doc.name);
                        return false;
                    }
                    return true;
                });
                
                if (originalCount > cleanedDocuments.length) {
                    // Veritabanını güncelle
                    await pool.request()
                        .input('cardId', sql.Int, card.id)
                        .input('documents', sql.NVarChar, JSON.stringify(cleanedDocuments))
                        .query('UPDATE Cards SET documents = @documents WHERE id = @cardId');
                    
                    console.log(`✅ Card ${card.id}: ${originalCount} -> ${cleanedDocuments.length} döküman (${originalCount - cleanedDocuments.length} temizlendi)`);
                    cleanedCount++;
                }
                
            } catch (error) {
                console.error(`❌ Card ${card.id} temizlenirken hata:`, error.message);
            }
        }
        
        console.log(`🎉 Temizleme tamamlandı! ${cleanedCount} kart temizlendi.`);
        
    } catch (error) {
        console.error('❌ Temizleme hatası:', error);
    } finally {
        process.exit(0);
    }
}

cleanupDocuments();
