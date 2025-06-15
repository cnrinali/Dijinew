-- İstatistik takibi için veritabanı tabloları

-- Kart görüntülenme istatistikleri
CREATE TABLE CardViews (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cardId INT NOT NULL,
    viewDate DATETIME2 DEFAULT GETDATE(),
    ipAddress NVARCHAR(45),
    userAgent NVARCHAR(500),
    referrer NVARCHAR(500),
    country NVARCHAR(100),
    city NVARCHAR(100),
    FOREIGN KEY (cardId) REFERENCES Cards(id) ON DELETE CASCADE
);

-- Link tıklama istatistikleri
CREATE TABLE CardClicks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cardId INT NOT NULL,
    clickType NVARCHAR(50) NOT NULL, -- 'phone', 'email', 'website', 'social', 'marketplace', 'bank', 'address'
    clickTarget NVARCHAR(100) NOT NULL, -- 'linkedin', 'trendyol', 'phone', 'email' vb.
    clickDate DATETIME2 DEFAULT GETDATE(),
    ipAddress NVARCHAR(45),
    userAgent NVARCHAR(500),
    FOREIGN KEY (cardId) REFERENCES Cards(id) ON DELETE CASCADE
);

-- Günlük özet istatistikleri (performans için)
CREATE TABLE DailyStats (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cardId INT NOT NULL,
    statDate DATE NOT NULL,
    totalViews INT DEFAULT 0,
    totalClicks INT DEFAULT 0,
    phoneClicks INT DEFAULT 0,
    emailClicks INT DEFAULT 0,
    socialClicks INT DEFAULT 0,
    marketplaceClicks INT DEFAULT 0,
    bankClicks INT DEFAULT 0,
    websiteClicks INT DEFAULT 0,
    addressClicks INT DEFAULT 0,
    FOREIGN KEY (cardId) REFERENCES Cards(id) ON DELETE CASCADE,
    UNIQUE(cardId, statDate)
);

-- İndeksler (performans için)
CREATE INDEX IX_CardViews_CardId_Date ON CardViews(cardId, viewDate);
CREATE INDEX IX_CardClicks_CardId_Date ON CardClicks(cardId, clickDate);
CREATE INDEX IX_CardClicks_Type ON CardClicks(clickType, clickTarget);
CREATE INDEX IX_DailyStats_CardId_Date ON DailyStats(cardId, statDate); 