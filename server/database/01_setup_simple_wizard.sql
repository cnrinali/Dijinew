-- 1. Cards tablosuna eksik kolonları ekle (sadece yoksa)

-- slug kolonu ekle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'slug')
BEGIN
    ALTER TABLE Cards ADD slug NVARCHAR(255) NULL;
    PRINT 'Cards tablosuna slug kolonu eklendi.';
END

-- createdBy kolonu ekle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'createdBy')
BEGIN
    ALTER TABLE Cards ADD createdBy INT NULL;
    PRINT 'Cards tablosuna createdBy kolonu eklendi.';
END

-- updatedAt kolonu ekle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'updatedAt')
BEGIN
    ALTER TABLE Cards ADD updatedAt DATETIME2 DEFAULT GETDATE();
    PRINT 'Cards tablosuna updatedAt kolonu eklendi.';
END

-- createdAt kolonu ekle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'createdAt')
BEGIN
    ALTER TABLE Cards ADD createdAt DATETIME2 DEFAULT GETDATE();
    PRINT 'Cards tablosuna createdAt kolonu eklendi.';
END

-- Mevcut null slug'ları güncelle
UPDATE Cards SET slug = LOWER(CONVERT(VARCHAR(36), NEWID())) WHERE slug IS NULL;

-- slug için unique index oluştur
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Cards_Slug' AND object_id = OBJECT_ID('Cards'))
BEGIN
    CREATE UNIQUE INDEX IX_Cards_Slug ON Cards(slug) WHERE slug IS NOT NULL;
    PRINT 'Cards.slug için unique index oluşturuldu.';
END

-- 2. SimpleWizardTokens tablosunu oluştur

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SimpleWizardTokens')
BEGIN
    CREATE TABLE SimpleWizardTokens (
        id INT IDENTITY(1,1) PRIMARY KEY,
        token NVARCHAR(255) UNIQUE NOT NULL,
        email NVARCHAR(255) NULL,
        createdBy INT NOT NULL,
        createdByType NVARCHAR(50) NOT NULL,
        companyId INT NULL,
        isUsed BIT DEFAULT 0,
        cardId INT NULL,
        expiresAt DATETIME2 NOT NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
    );
    
    -- Index'ler
    CREATE INDEX IX_SimpleWizardTokens_Token ON SimpleWizardTokens(token);
    CREATE INDEX IX_SimpleWizardTokens_CreatedBy ON SimpleWizardTokens(createdBy);
    CREATE INDEX IX_SimpleWizardTokens_ExpiresAt ON SimpleWizardTokens(expiresAt);
    CREATE INDEX IX_SimpleWizardTokens_IsUsed ON SimpleWizardTokens(isUsed);
    
    PRINT 'SimpleWizardTokens tablosu oluşturuldu.';
END

PRINT 'Simple Wizard kurulumu tamamlandı!';
