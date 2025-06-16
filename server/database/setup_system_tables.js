const { getPool } = require('../config/db');
const fs = require('fs');
const path = require('path');

async function setupSystemTables() {
    try {
        console.log('Sistem tablolarını oluşturuyor...');
        const pool = await getPool();
        
        // Sistem izleme tablolarını oluştur
        const createTablesSQL = `
        -- Sistem Yedekleme Kayıtları
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SystemBackups' AND xtype='U')
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
            
            CONSTRAINT FK_SystemBackups_Users FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE NO ACTION
        );

        -- Sistem Hataları
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SystemErrors' AND xtype='U')
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
            
            CONSTRAINT FK_SystemErrors_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE NO ACTION,
            CONSTRAINT FK_SystemErrors_ResolvedBy FOREIGN KEY (resolvedBy) REFERENCES Users(id) ON DELETE NO ACTION
        );

        -- Sistem Bildirimleri
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SystemNotifications' AND xtype='U')
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
            
            CONSTRAINT FK_SystemNotifications_Users FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE NO ACTION
        );

        -- Sistem Güncellemeleri
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SystemUpdates' AND xtype='U')
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
            
            CONSTRAINT FK_SystemUpdates_Users FOREIGN KEY (appliedBy) REFERENCES Users(id) ON DELETE NO ACTION
        );

        -- Sistem Performans Metrikleri (Geçmiş veriler için)
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SystemMetrics' AND xtype='U')
        CREATE TABLE SystemMetrics (
            id INT IDENTITY(1,1) PRIMARY KEY,
            metricType NVARCHAR(50) NOT NULL, -- 'cpu', 'memory', 'disk', 'network', 'response_time'
            value DECIMAL(10,2) NOT NULL,
            unit NVARCHAR(20) NOT NULL, -- '%', 'GB', 'MB/s', 'ms'
            additionalData NVARCHAR(MAX) NULL, -- JSON formatında ek bilgiler
            recordedAt DATETIME2 DEFAULT GETDATE()
        );

        -- API İstekleri İzleme
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ApiRequests' AND xtype='U')
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
            
            CONSTRAINT FK_ApiRequests_Users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE NO ACTION
        );
        `;

        await pool.request().query(createTablesSQL);
        console.log('✅ Sistem tabloları başarıyla oluşturuldu!');

        // İndeksleri oluştur
        const createIndexesSQL = `
        -- İndeksler
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemBackups_CreatedAt')
            CREATE INDEX IX_SystemBackups_CreatedAt ON SystemBackups(createdAt DESC);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemBackups_Status')
            CREATE INDEX IX_SystemBackups_Status ON SystemBackups(status);

        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemErrors_CreatedAt')
            CREATE INDEX IX_SystemErrors_CreatedAt ON SystemErrors(createdAt DESC);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemErrors_Severity')
            CREATE INDEX IX_SystemErrors_Severity ON SystemErrors(severity);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemErrors_IsResolved')
            CREATE INDEX IX_SystemErrors_IsResolved ON SystemErrors(isResolved);

        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemNotifications_CreatedAt')
            CREATE INDEX IX_SystemNotifications_CreatedAt ON SystemNotifications(createdAt DESC);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemNotifications_IsRead')
            CREATE INDEX IX_SystemNotifications_IsRead ON SystemNotifications(isRead);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemNotifications_TargetRole')
            CREATE INDEX IX_SystemNotifications_TargetRole ON SystemNotifications(targetRole);

        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemUpdates_CreatedAt')
            CREATE INDEX IX_SystemUpdates_CreatedAt ON SystemUpdates(createdAt DESC);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemUpdates_Status')
            CREATE INDEX IX_SystemUpdates_Status ON SystemUpdates(status);

        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemMetrics_RecordedAt')
            CREATE INDEX IX_SystemMetrics_RecordedAt ON SystemMetrics(recordedAt DESC);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SystemMetrics_MetricType')
            CREATE INDEX IX_SystemMetrics_MetricType ON SystemMetrics(metricType);

        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ApiRequests_CreatedAt')
            CREATE INDEX IX_ApiRequests_CreatedAt ON ApiRequests(createdAt DESC);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ApiRequests_UserId')
            CREATE INDEX IX_ApiRequests_UserId ON ApiRequests(userId);
        
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ApiRequests_Endpoint')
            CREATE INDEX IX_ApiRequests_Endpoint ON ApiRequests(endpoint);
        `;

        await pool.request().query(createIndexesSQL);
        console.log('✅ İndeksler başarıyla oluşturuldu!');

        // Örnek verileri ekle
        await insertSampleData(pool);

        console.log('🎉 Sistem tabloları kurulumu tamamlandı!');
        
    } catch (error) {
        console.error('❌ Sistem tabloları oluşturulurken hata:', error);
        throw error;
    }
}

async function insertSampleData(pool) {
    try {
        console.log('Örnek veriler ekleniyor...');

        // Sistem Yedekleme Kayıtları
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM SystemBackups)
            BEGIN
                INSERT INTO SystemBackups (backupType, backupPath, fileSize, status, startTime, endTime, duration, createdBy) VALUES
                ('full', '/backups/full_backup_20250615.sql', 2147483648, 'completed', DATEADD(hour, -6, GETDATE()), DATEADD(hour, -5, GETDATE()), 3600, 1),
                ('incremental', '/backups/inc_backup_20250614.sql', 524288000, 'completed', DATEADD(day, -1, GETDATE()), DATEADD(day, -1, DATEADD(minute, 30, GETDATE())), 1800, 1),
                ('full', '/backups/full_backup_20250610.sql', 1073741824, 'completed', DATEADD(day, -5, GETDATE()), DATEADD(day, -5, DATEADD(hour, 1, GETDATE())), 3600, 1);
            END
        `);

        // Sistem Hataları
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM SystemErrors)
            BEGIN
                INSERT INTO SystemErrors (errorType, severity, errorCode, errorMessage, userId, endpoint, ipAddress, isResolved) VALUES
                ('api', 'medium', 'API_TIMEOUT', 'API isteği zaman aşımına uğradı', 2, '/api/cards/upload', '192.168.1.100', 1),
                ('database', 'low', 'DB_SLOW_QUERY', 'Yavaş sorgu tespit edildi', NULL, NULL, NULL, 1),
                ('file_system', 'high', 'DISK_SPACE', 'Disk alanı %85 doldu', NULL, NULL, NULL, 0);
            END
        `);

        // Sistem Bildirimleri
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM SystemNotifications)
            BEGIN
                INSERT INTO SystemNotifications (type, priority, title, message, targetRole, isRead, isActive) VALUES
                ('maintenance', 'medium', 'Planlı Bakım', 'Sistem bakımı 16 Haziran 02:00-04:00 arası yapılacaktır.', 'admin', 0, 1),
                ('security', 'high', 'Güvenlik Güncellemesi', 'Yeni güvenlik yaması mevcut. Lütfen sistemi güncelleyin.', 'admin', 0, 1),
                ('backup', 'low', 'Yedekleme Tamamlandı', 'Günlük yedekleme başarıyla tamamlandı.', 'admin', 1, 1),
                ('update', 'medium', 'Sistem Güncellemesi', 'Yeni özellikler eklendi. Sürüm 2.1.4 yayınlandı.', NULL, 0, 1),
                ('error', 'high', 'Disk Alanı Uyarısı', 'Disk alanı kritik seviyede. Lütfen temizlik yapın.', 'admin', 0, 1);
            END
        `);

        // Sistem Güncellemeleri
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM SystemUpdates)
            BEGIN
                INSERT INTO SystemUpdates (version, updateType, description, changeLog, status, startTime, endTime, duration, appliedBy) VALUES
                ('2.1.4', 'minor', 'Yeni özellikler ve hata düzeltmeleri', 'QR kod indirme özelliği eklendi, performans iyileştirmeleri yapıldı', 'completed', DATEADD(day, -3, GETDATE()), DATEADD(day, -3, DATEADD(minute, 15, GETDATE())), 900, 1),
                ('2.1.3', 'patch', 'Güvenlik yaması', 'Kritik güvenlik açığı kapatıldı', 'completed', DATEADD(day, -7, GETDATE()), DATEADD(day, -7, DATEADD(minute, 5, GETDATE())), 300, 1),
                ('2.1.2', 'minor', 'UI iyileştirmeleri', 'Kullanıcı arayüzü güncellemeleri', 'completed', DATEADD(day, -14, GETDATE()), DATEADD(day, -14, DATEADD(minute, 20, GETDATE())), 1200, 1);
            END
        `);

        // Sistem Performans Metrikleri (Son 24 saat için örnek veriler)
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM SystemMetrics)
            BEGIN
                DECLARE @i INT = 0;
                WHILE @i < 24
                BEGIN
                    INSERT INTO SystemMetrics (metricType, value, unit, recordedAt) VALUES
                    ('cpu', RAND() * 80 + 10, '%', DATEADD(hour, -@i, GETDATE())),
                    ('memory', RAND() * 70 + 20, '%', DATEADD(hour, -@i, GETDATE())),
                    ('disk', 65 + RAND() * 10, '%', DATEADD(hour, -@i, GETDATE())),
                    ('response_time', RAND() * 100 + 20, 'ms', DATEADD(hour, -@i, GETDATE()));
                    
                    SET @i = @i + 1;
                END;
            END
        `);

        console.log('✅ Örnek veriler başarıyla eklendi!');
        
    } catch (error) {
        console.error('❌ Örnek veriler eklenirken hata:', error);
        throw error;
    }
}

// Script doğrudan çalıştırılırsa
if (require.main === module) {
    setupSystemTables()
        .then(() => {
            console.log('✅ Kurulum tamamlandı!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Kurulum başarısız:', error);
            process.exit(1);
        });
}

module.exports = { setupSystemTables }; 