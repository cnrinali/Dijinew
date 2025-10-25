-- Kullanıcılar ve Kurumsal Hesaplar için Dil Desteği Ekleme
-- Desteklenen diller: Türkçe (tr), İngilizce (en), Arapça (ar), Rusça (ru), Portekizce (pt)

-- Users tablosuna language kolonu ekle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'language')
BEGIN
    ALTER TABLE Users ADD language NVARCHAR(5) DEFAULT 'tr' NOT NULL;
    PRINT 'Users tablosuna language kolonu eklendi (varsayılan: tr).';
    
    -- Check constraint ekle (sadece izin verilen diller)
    ALTER TABLE Users ADD CONSTRAINT CK_Users_Language CHECK (language IN ('tr', 'en', 'ar', 'ru', 'pt'));
    PRINT 'Users tablosuna language check constraint eklendi.';
END
ELSE
BEGIN
    PRINT 'Users tablosunda language kolonu zaten mevcut.';
END

-- Companies tablosuna language kolonu ekle
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Companies' AND COLUMN_NAME = 'language')
BEGIN
    ALTER TABLE Companies ADD language NVARCHAR(5) DEFAULT 'tr' NOT NULL;
    PRINT 'Companies tablosuna language kolonu eklendi (varsayılan: tr).';
    
    -- Check constraint ekle (sadece izin verilen diller)
    ALTER TABLE Companies ADD CONSTRAINT CK_Companies_Language CHECK (language IN ('tr', 'en', 'ar', 'ru', 'pt'));
    PRINT 'Companies tablosuna language check constraint eklendi.';
END
ELSE
BEGIN
    PRINT 'Companies tablosunda language kolonu zaten mevcut.';
END

-- Performans için index oluştur
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Language' AND object_id = OBJECT_ID('Users'))
BEGIN
    CREATE INDEX IX_Users_Language ON Users(language);
    PRINT 'Users.language için index oluşturuldu.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Companies_Language' AND object_id = OBJECT_ID('Companies'))
BEGIN
    CREATE INDEX IX_Companies_Language ON Companies(language);
    PRINT 'Companies.language için index oluşturuldu.';
END

PRINT 'Dil desteği kurulumu tamamlandı!';
PRINT 'Desteklenen diller: Türkçe (tr), İngilizce (en), Arapça (ar), Rusça (ru), Portekizce (pt)';
