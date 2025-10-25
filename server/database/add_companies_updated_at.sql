-- Companies tablosuna updatedAt kolonu ekleme

-- updatedAt kolonu kontrolü ve ekleme
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'updatedAt'
)
BEGIN
    ALTER TABLE Companies ADD updatedAt DATETIME2 DEFAULT GETDATE();
    PRINT 'Companies tablosuna updatedAt kolonu eklendi.';
END
ELSE
BEGIN
    PRINT 'Companies tablosunda updatedAt kolonu zaten mevcut.';
END

-- Mevcut kayıtlar için updatedAt değerini createdAt ile aynı yap (eğer createdAt varsa)
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'updatedAt'
)
AND EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'createdAt'
)
BEGIN
    UPDATE Companies SET updatedAt = createdAt WHERE updatedAt IS NULL;
    PRINT 'Mevcut kayıtların updatedAt değerleri güncellendi.';
END








