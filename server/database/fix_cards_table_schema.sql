-- Cards tablosuna eksik kolonları ekleme

-- Önce mevcut tablo yapısını kontrol edelim
-- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' ORDER BY ORDINAL_POSITION;

-- Cards tablosunda eksik olabilecek kolonları ekle

-- slug kolonu (URL için kullanılacak)
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'slug'
)
BEGIN
    ALTER TABLE Cards ADD slug NVARCHAR(255) NULL;
    CREATE UNIQUE INDEX IX_Cards_Slug ON Cards(slug) WHERE slug IS NOT NULL;
END

-- createdBy kolonu (kartı oluşturan kullanıcı)
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'createdBy'
)
BEGIN
    ALTER TABLE Cards ADD createdBy INT NULL;
    -- Foreign key constraint ekle
    ALTER TABLE Cards ADD CONSTRAINT FK_Cards_CreatedBy FOREIGN KEY (createdBy) REFERENCES Users(id);
END

-- updatedAt kolonu (güncelleme tarihi)
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'updatedAt'
)
BEGIN
    ALTER TABLE Cards ADD updatedAt DATETIME2 DEFAULT GETDATE();
END

-- createdAt kolonu kontrolü (olması gerekir ama kontrol edelim)
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'createdAt'
)
BEGIN
    ALTER TABLE Cards ADD createdAt DATETIME2 DEFAULT GETDATE();
END

-- companyId kolonu kontrolü
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'companyId'
)
BEGIN
    ALTER TABLE Cards ADD companyId INT NULL;
    ALTER TABLE Cards ADD CONSTRAINT FK_Cards_Companies FOREIGN KEY (companyId) REFERENCES Companies(id);
END

-- userId kolonu kontrolü
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'userId'
)
BEGIN
    ALTER TABLE Cards ADD userId INT NULL;
    ALTER TABLE Cards ADD CONSTRAINT FK_Cards_Users FOREIGN KEY (userId) REFERENCES Users(id);
END

-- Mevcut slug değeri null olan kayıtlar için rastgele slug oluştur
UPDATE Cards 
SET slug = LOWER(REPLACE(NEWID(), '-', ''))
WHERE slug IS NULL;

PRINT 'Cards tablosu şema güncellemeleri tamamlandı.';
