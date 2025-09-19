-- Sihirbaz tokenları tablosu
CREATE TABLE WizardTokens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    token NVARCHAR(255) UNIQUE NOT NULL,
    type NVARCHAR(50) NOT NULL, -- 'admin', 'corporate', 'user'
    createdBy INT NOT NULL, -- Token'ı oluşturan admin/kurumsal kullanıcı ID'si
    companyId INT NULL, -- Kurumsal token için şirket ID'si
    isUsed BIT DEFAULT 0, -- Token kullanıldı mı?
    usedBy INT NULL, -- Token'ı kullanan kullanıcı ID'si
    usedAt DATETIME2 NULL, -- Token kullanım tarihi
    expiresAt DATETIME2 NOT NULL, -- Token son geçerlilik tarihi
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    
    -- Foreign key constraints
    FOREIGN KEY (createdBy) REFERENCES Users(id),
    FOREIGN KEY (companyId) REFERENCES Companies(id),
    FOREIGN KEY (usedBy) REFERENCES Users(id)
);

-- Index'ler
CREATE INDEX IX_WizardTokens_Token ON WizardTokens(token);
CREATE INDEX IX_WizardTokens_CreatedBy ON WizardTokens(createdBy);
CREATE INDEX IX_WizardTokens_ExpiresAt ON WizardTokens(expiresAt);
CREATE INDEX IX_WizardTokens_IsUsed ON WizardTokens(isUsed); 