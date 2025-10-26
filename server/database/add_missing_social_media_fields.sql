-- Yeni sosyal medya ve pazaryeri alanlarını Cards tablosuna ekle
-- Bu script mevcut alanları kontrol eder ve eksik olanları ekler

-- Önce mevcut tablo yapısını kontrol et
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Cards' 
AND COLUMN_NAME IN (
    'whatsappUrl', 'facebookUrl', 'telegramUrl', 'youtubeUrl', 
    'skypeUrl', 'wechatUrl', 'snapchatUrl', 'pinterestUrl', 'tiktokUrl',
    'arabamUrl', 'letgoUrl', 'pttAvmUrl', 'ciceksepetiUrl', 
    'websiteUrl', 'whatsappBusinessUrl'
);

-- Eksik alanları ekle (sadece yoksa)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'whatsappUrl')
BEGIN
    ALTER TABLE Cards ADD whatsappUrl NVARCHAR(500) NULL;
    PRINT 'whatsappUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'facebookUrl')
BEGIN
    ALTER TABLE Cards ADD facebookUrl NVARCHAR(500) NULL;
    PRINT 'facebookUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'telegramUrl')
BEGIN
    ALTER TABLE Cards ADD telegramUrl NVARCHAR(500) NULL;
    PRINT 'telegramUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'youtubeUrl')
BEGIN
    ALTER TABLE Cards ADD youtubeUrl NVARCHAR(500) NULL;
    PRINT 'youtubeUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'skypeUrl')
BEGIN
    ALTER TABLE Cards ADD skypeUrl NVARCHAR(500) NULL;
    PRINT 'skypeUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'wechatUrl')
BEGIN
    ALTER TABLE Cards ADD wechatUrl NVARCHAR(500) NULL;
    PRINT 'wechatUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'snapchatUrl')
BEGIN
    ALTER TABLE Cards ADD snapchatUrl NVARCHAR(500) NULL;
    PRINT 'snapchatUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'pinterestUrl')
BEGIN
    ALTER TABLE Cards ADD pinterestUrl NVARCHAR(500) NULL;
    PRINT 'pinterestUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'tiktokUrl')
BEGIN
    ALTER TABLE Cards ADD tiktokUrl NVARCHAR(500) NULL;
    PRINT 'tiktokUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'arabamUrl')
BEGIN
    ALTER TABLE Cards ADD arabamUrl NVARCHAR(500) NULL;
    PRINT 'arabamUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'letgoUrl')
BEGIN
    ALTER TABLE Cards ADD letgoUrl NVARCHAR(500) NULL;
    PRINT 'letgoUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'pttAvmUrl')
BEGIN
    ALTER TABLE Cards ADD pttAvmUrl NVARCHAR(500) NULL;
    PRINT 'pttAvmUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'ciceksepetiUrl')
BEGIN
    ALTER TABLE Cards ADD ciceksepetiUrl NVARCHAR(500) NULL;
    PRINT 'ciceksepetiUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'websiteUrl')
BEGIN
    ALTER TABLE Cards ADD websiteUrl NVARCHAR(500) NULL;
    PRINT 'websiteUrl alanı eklendi';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cards' AND COLUMN_NAME = 'whatsappBusinessUrl')
BEGIN
    ALTER TABLE Cards ADD whatsappBusinessUrl NVARCHAR(500) NULL;
    PRINT 'whatsappBusinessUrl alanı eklendi';
END

-- Son durumu kontrol et
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Cards' 
AND COLUMN_NAME IN (
    'whatsappUrl', 'facebookUrl', 'telegramUrl', 'youtubeUrl', 
    'skypeUrl', 'wechatUrl', 'snapchatUrl', 'pinterestUrl', 'tiktokUrl',
    'arabamUrl', 'letgoUrl', 'pttAvmUrl', 'ciceksepetiUrl', 
    'websiteUrl', 'whatsappBusinessUrl'
)
ORDER BY COLUMN_NAME;
