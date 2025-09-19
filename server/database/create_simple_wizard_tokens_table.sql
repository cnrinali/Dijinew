-- Basit Sihirbaz tokenleri tablosu
CREATE TABLE SimpleWizardTokens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    token NVARCHAR(255) UNIQUE NOT NULL,
    email NVARCHAR(255) NULL, -- İsteğe bağlı email
    createdBy INT NOT NULL, -- Token'ı oluşturan admin/kurumsal kullanıcı ID'si
    createdByType NVARCHAR(50) NOT NULL, -- 'admin' veya 'corporate'
    companyId INT NULL, -- Kurumsal token için şirket ID'si
    isUsed BIT DEFAULT 0, -- Token kullanıldı mı?
    cardId INT NULL, -- Oluşturulan kart ID'si
    expiresAt DATETIME2 NOT NULL, -- Token son geçerlilik tarihi
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    
    -- Foreign key constraints
    FOREIGN KEY (createdBy) REFERENCES Users(id),
    FOREIGN KEY (companyId) REFERENCES Companies(id),
    FOREIGN KEY (cardId) REFERENCES Cards(id)
);

-- Index'ler
CREATE INDEX IX_SimpleWizardTokens_Token ON SimpleWizardTokens(token);
CREATE INDEX IX_SimpleWizardTokens_CreatedBy ON SimpleWizardTokens(createdBy);
CREATE INDEX IX_SimpleWizardTokens_ExpiresAt ON SimpleWizardTokens(expiresAt);
CREATE INDEX IX_SimpleWizardTokens_IsUsed ON SimpleWizardTokens(isUsed);
