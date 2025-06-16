-- Sistem İzleme Tabloları için Örnek Veriler

-- Sistem Yedekleme Kayıtları
INSERT INTO SystemBackups (backupType, backupPath, fileSize, status, startTime, endTime, duration, createdBy) VALUES
('full', '/backups/full_backup_20250615.sql', 2147483648, 'completed', DATEADD(hour, -6, GETDATE()), DATEADD(hour, -5, GETDATE()), 3600, 1),
('incremental', '/backups/inc_backup_20250614.sql', 524288000, 'completed', DATEADD(day, -1, GETDATE()), DATEADD(day, -1, DATEADD(minute, 30, GETDATE())), 1800, 1),
('full', '/backups/full_backup_20250610.sql', 1073741824, 'completed', DATEADD(day, -5, GETDATE()), DATEADD(day, -5, DATEADD(hour, 1, GETDATE())), 3600, 1);

-- Sistem Hataları
INSERT INTO SystemErrors (errorType, severity, errorCode, errorMessage, userId, endpoint, ipAddress, isResolved) VALUES
('api', 'medium', 'API_TIMEOUT', 'API isteği zaman aşımına uğradı', 2, '/api/cards/upload', '192.168.1.100', 1),
('database', 'low', 'DB_SLOW_QUERY', 'Yavaş sorgu tespit edildi', NULL, NULL, NULL, 1),
('file_system', 'high', 'DISK_SPACE', 'Disk alanı %85 doldu', NULL, NULL, NULL, 0);

-- Sistem Bildirimleri
INSERT INTO SystemNotifications (type, priority, title, message, targetRole, isRead, isActive) VALUES
('maintenance', 'medium', 'Planlı Bakım', 'Sistem bakımı 16 Haziran 02:00-04:00 arası yapılacaktır.', 'admin', 0, 1),
('security', 'high', 'Güvenlik Güncellemesi', 'Yeni güvenlik yaması mevcut. Lütfen sistemi güncelleyin.', 'admin', 0, 1),
('backup', 'low', 'Yedekleme Tamamlandı', 'Günlük yedekleme başarıyla tamamlandı.', 'admin', 1, 1),
('update', 'medium', 'Sistem Güncellemesi', 'Yeni özellikler eklendi. Sürüm 2.1.4 yayınlandı.', NULL, 0, 1),
('error', 'high', 'Disk Alanı Uyarısı', 'Disk alanı kritik seviyede. Lütfen temizlik yapın.', 'admin', 0, 1);

-- Sistem Güncellemeleri
INSERT INTO SystemUpdates (version, updateType, description, changeLog, status, startTime, endTime, duration, appliedBy) VALUES
('2.1.4', 'minor', 'Yeni özellikler ve hata düzeltmeleri', 'QR kod indirme özelliği eklendi, performans iyileştirmeleri yapıldı', 'completed', DATEADD(day, -3, GETDATE()), DATEADD(day, -3, DATEADD(minute, 15, GETDATE())), 900, 1),
('2.1.3', 'patch', 'Güvenlik yaması', 'Kritik güvenlik açığı kapatıldı', 'completed', DATEADD(day, -7, GETDATE()), DATEADD(day, -7, DATEADD(minute, 5, GETDATE())), 300, 1),
('2.1.2', 'minor', 'UI iyileştirmeleri', 'Kullanıcı arayüzü güncellemeleri', 'completed', DATEADD(day, -14, GETDATE()), DATEADD(day, -14, DATEADD(minute, 20, GETDATE())), 1200, 1);

-- Sistem Performans Metrikleri (Son 24 saat için örnek veriler)
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

-- API İstekleri (Son 24 saat için örnek veriler)
DECLARE @j INT = 0;
DECLARE @endpoints TABLE (endpoint NVARCHAR(255));
INSERT INTO @endpoints VALUES 
('/api/auth/login'), ('/api/cards/create'), ('/api/users/profile'), 
('/api/analytics/stats'), ('/api/admin/dashboard'), ('/api/companies/list'),
('/api/cards/qr-download'), ('/api/system/status');

WHILE @j < 100
BEGIN
    DECLARE @randomEndpoint NVARCHAR(255);
    DECLARE @randomUserId INT;
    DECLARE @randomStatus INT;
    
    SELECT TOP 1 @randomEndpoint = endpoint FROM @endpoints ORDER BY NEWID();
    SELECT TOP 1 @randomUserId = id FROM Users ORDER BY NEWID();
    SET @randomStatus = CASE WHEN RAND() > 0.1 THEN 200 ELSE (CASE WHEN RAND() > 0.5 THEN 404 ELSE 500 END) END;
    
    INSERT INTO ApiRequests (userId, endpoint, method, statusCode, responseTime, ipAddress, createdAt) VALUES
    (@randomUserId, @randomEndpoint, 'GET', @randomStatus, RAND() * 500 + 50, '192.168.1.' + CAST(FLOOR(RAND() * 254 + 1) AS NVARCHAR), DATEADD(minute, -RAND() * 1440, GETDATE()));
    
    SET @j = @j + 1;
END; 