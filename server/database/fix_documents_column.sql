-- Documents kolonu için migration
-- Eğer documents kolonu yoksa ekle, varsa güncelle

-- Önce documents kolonunun var olup olmadığını kontrol et
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'documents')
BEGIN
    -- Documents kolonu yoksa ekle
    ALTER TABLE Cards ADD documents NVARCHAR(MAX) NULL;
    PRINT 'Documents kolonu eklendi';
END
ELSE
BEGIN
    PRINT 'Documents kolonu zaten mevcut';
END

-- Mevcut documents verilerini temizle (file objesi olanları kaldır)
UPDATE Cards 
SET documents = NULL 
WHERE documents IS NOT NULL 
  AND documents LIKE '%"file":%';

PRINT 'File objesi olan documents temizlendi';

-- Documents kolonunu NULL olarak ayarla (yeni veriler için)
UPDATE Cards 
SET documents = '[]' 
WHERE documents IS NULL;

PRINT 'Boş documents array''leri eklendi';
