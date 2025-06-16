-- Sistem Durumu İzleme Tabloları

-- Sistem Yedekleme Kayıtları
CREATE TABLE SystemBackups (
    id INT IDENTITY(1,1) PRIMARY KEY,
    backupType NVARCHAR(50) NOT NULL, -- 'full', 'incremental', 'differential'
    backupPath NVARCHAR(500) NOT NULL,
    fileSize BIGINT NOT NULL, -- bytes
    status NVARCHAR(20) NOT NULL, -- 'completed', 'failed', 'in_progress'
    startTime DATETIME2 NOT NULL,
    endTime DATETIME2 NULL,
    duration INT NULL, -- saniye
    errorMessage NVARCHAR(MAX) NULL,
    createdBy INT NULL, -- Admin user ID
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_SystemBackups_Users FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Sistem Hataları
CREATE TABLE SystemErrors (
    id INT IDENTITY(1,1) PRIMARY KEY,
    errorType NVARCHAR(100) NOT NULL, -- 'database', 'api', 'file_system', 'network'
    severity NVARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    errorCode NVARCHAR(50) NULL,
    errorMessage NVARCHAR(MAX) NOT NULL,
    stackTrace NVARCHAR(MAX) NULL,
    userId INT NULL, -- Hatayı tetikleyen kullanıcı
    endpoint NVARCHAR(255) NULL, -- API endpoint
    ipAddress NVARCHAR(45) NULL,
    userAgent NVARCHAR(500) NULL,
    isResolved BIT DEFAULT 0,
    resolvedAt DATETIME2 NULL,
    resolvedBy INT NULL,
    resolution NVARCHAR(MAX) NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_SystemErrors_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL,
    CONSTRAINT FK_SystemErrors_ResolvedBy FOREIGN KEY (resolvedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Sistem Bildirimleri
CREATE TABLE SystemNotifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    type NVARCHAR(50) NOT NULL, -- 'maintenance', 'update', 'security', 'backup', 'error'
    priority NVARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'urgent'
    title NVARCHAR(255) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    targetRole NVARCHAR(20) NULL, -- 'admin', 'corporate', 'user' - null means all
    isRead BIT DEFAULT 0,
    isActive BIT DEFAULT 1,
    scheduledFor DATETIME2 NULL, -- Zamanlanmış bildirimler için
    expiresAt DATETIME2 NULL,
    createdBy INT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    readAt DATETIME2 NULL,
    
    CONSTRAINT FK_SystemNotifications_Users FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Sistem Güncellemeleri
CREATE TABLE SystemUpdates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    version NVARCHAR(50) NOT NULL,
    updateType NVARCHAR(50) NOT NULL, -- 'major', 'minor', 'patch', 'hotfix'
    description NVARCHAR(MAX) NOT NULL,
    changeLog NVARCHAR(MAX) NULL,
    status NVARCHAR(20) NOT NULL, -- 'pending', 'in_progress', 'completed', 'failed', 'rolled_back'
    startTime DATETIME2 NULL,
    endTime DATETIME2 NULL,
    duration INT NULL, -- saniye
    appliedBy INT NULL,
    rollbackReason NVARCHAR(MAX) NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_SystemUpdates_Users FOREIGN KEY (appliedBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Sistem Performans Metrikleri (Geçmiş veriler için)
CREATE TABLE SystemMetrics (
    id INT IDENTITY(1,1) PRIMARY KEY,
    metricType NVARCHAR(50) NOT NULL, -- 'cpu', 'memory', 'disk', 'network', 'response_time'
    value DECIMAL(10,2) NOT NULL,
    unit NVARCHAR(20) NOT NULL, -- '%', 'GB', 'MB/s', 'ms'
    additionalData NVARCHAR(MAX) NULL, -- JSON formatında ek bilgiler
    recordedAt DATETIME2 DEFAULT GETDATE()
);

-- API İstekleri İzleme
CREATE TABLE ApiRequests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NULL,
    endpoint NVARCHAR(255) NOT NULL,
    method NVARCHAR(10) NOT NULL, -- GET, POST, PUT, DELETE
    statusCode INT NOT NULL,
    responseTime INT NOT NULL, -- milisaniye
    requestSize INT NULL, -- bytes
    responseSize INT NULL, -- bytes
    ipAddress NVARCHAR(45) NULL,
    userAgent NVARCHAR(500) NULL,
    errorMessage NVARCHAR(MAX) NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_ApiRequests_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL
);

-- İndeksler
CREATE INDEX IX_SystemBackups_CreatedAt ON SystemBackups(createdAt DESC);
CREATE INDEX IX_SystemBackups_Status ON SystemBackups(status);

CREATE INDEX IX_SystemErrors_CreatedAt ON SystemErrors(createdAt DESC);
CREATE INDEX IX_SystemErrors_Severity ON SystemErrors(severity);
CREATE INDEX IX_SystemErrors_IsResolved ON SystemErrors(isResolved);

CREATE INDEX IX_SystemNotifications_CreatedAt ON SystemNotifications(createdAt DESC);
CREATE INDEX IX_SystemNotifications_IsRead ON SystemNotifications(isRead);
CREATE INDEX IX_SystemNotifications_TargetRole ON SystemNotifications(targetRole);

CREATE INDEX IX_SystemUpdates_CreatedAt ON SystemUpdates(createdAt DESC);
CREATE INDEX IX_SystemUpdates_Status ON SystemUpdates(status);

CREATE INDEX IX_SystemMetrics_RecordedAt ON SystemMetrics(recordedAt DESC);
CREATE INDEX IX_SystemMetrics_MetricType ON SystemMetrics(metricType);

CREATE INDEX IX_ApiRequests_CreatedAt ON ApiRequests(createdAt DESC);
CREATE INDEX IX_ApiRequests_UserId ON ApiRequests(userId);
CREATE INDEX IX_ApiRequests_Endpoint ON ApiRequests(endpoint); 