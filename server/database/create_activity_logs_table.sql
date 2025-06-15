-- ActivityLogs tablosu oluşturma
CREATE TABLE ActivityLogs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    userRole NVARCHAR(20) NOT NULL, -- 'admin', 'corporate', 'user'
    companyId INT NULL, -- Kurumsal kullanıcılar için
    action NVARCHAR(100) NOT NULL, -- 'created_card', 'updated_user', 'deleted_company', etc.
    actionType NVARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'view', 'login', 'logout'
    targetType NVARCHAR(50) NOT NULL, -- 'card', 'user', 'company', 'system'
    targetId INT NULL, -- Hedef nesnenin ID'si
    targetName NVARCHAR(255) NULL, -- Hedef nesnenin adı (kolay okuma için)
    description NVARCHAR(500) NOT NULL, -- Aktivite açıklaması
    metadata NVARCHAR(MAX) NULL, -- JSON formatında ek bilgiler
    ipAddress NVARCHAR(45) NULL, -- Kullanıcının IP adresi
    userAgent NVARCHAR(500) NULL, -- Tarayıcı bilgisi
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    -- Foreign Key Constraints
    CONSTRAINT FK_ActivityLogs_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT FK_ActivityLogs_Companies FOREIGN KEY (companyId) REFERENCES Companies(id) ON DELETE SET NULL
);

-- İndeksler (performans için)
CREATE INDEX IX_ActivityLogs_UserId ON ActivityLogs(userId);
CREATE INDEX IX_ActivityLogs_CompanyId ON ActivityLogs(companyId);
CREATE INDEX IX_ActivityLogs_CreatedAt ON ActivityLogs(createdAt DESC);
CREATE INDEX IX_ActivityLogs_ActionType ON ActivityLogs(actionType);
CREATE INDEX IX_ActivityLogs_TargetType ON ActivityLogs(targetType);
CREATE INDEX IX_ActivityLogs_UserRole ON ActivityLogs(userRole);

-- Composite index for common queries
CREATE INDEX IX_ActivityLogs_UserRole_CompanyId_CreatedAt ON ActivityLogs(userRole, companyId, createdAt DESC); 