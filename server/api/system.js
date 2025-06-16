const express = require('express');
const router = express.Router();
const si = require('systeminformation');
const { protect, authorize } = require('../middleware/authMiddleware');

// Veritabanı bağlantısını test et
async function testDatabaseConnection() {
    try {
        const { getPool } = require('../config/db');
        const pool = await getPool();
        await pool.request().query('SELECT 1');
        return { status: 'connected', message: 'Veritabanı bağlantısı başarılı' };
    } catch (error) {
        return { status: 'disconnected', message: error.message };
    }
}

// Sistem durumu bilgilerini al
router.get('/status', protect, authorize('admin'), async (req, res) => {
    try {
        const startTime = Date.now();
        
        const [cpu, mem, fsSize, networkStats, osInfo, time, dbStatus] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.osInfo(),
            si.time(),
            testDatabaseConnection()
        ]);

        const responseTime = Date.now() - startTime;

        const systemStatus = {
            server: {
                status: 'online',
                uptime: Math.floor(time.uptime / 3600), // saat cinsinden
                response_time: responseTime
            },
            database: dbStatus,
            memory: {
                total: Math.round(mem.total / 1024 / 1024 / 1024), // GB
                used: Math.round(mem.used / 1024 / 1024 / 1024), // GB
                percentage: Math.round((mem.used / mem.total) * 100)
            },
            cpu: {
                usage: Math.round(cpu.currentLoad),
                cores: cpu.cpus?.length || 0
            },
            storage: fsSize.length > 0 ? {
                total: Math.round(fsSize[0].size / 1024 / 1024 / 1024), // GB
                used: Math.round(fsSize[0].used / 1024 / 1024 / 1024), // GB
                percentage: Math.round((fsSize[0].used / fsSize[0].size) * 100)
            } : null,
            network: networkStats.length > 0 ? {
                rx: Math.round(networkStats[0].rx_sec / 1024 / 1024 * 8), // Mbps
                tx: Math.round(networkStats[0].tx_sec / 1024 / 1024 * 8)  // Mbps
            } : null,
            os: {
                platform: osInfo.platform,
                distro: osInfo.distro,
                release: osInfo.release,
                arch: osInfo.arch
            },
            security: {
                status: dbStatus.status === 'connected' ? 'secure' : 'warning'
            }
        };

        res.json({
            success: true,
            data: systemStatus
        });
    } catch (error) {
        console.error('Sistem durumu alınırken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Sistem durumu alınamadı',
            error: error.message
        });
    }
});

// Kaynak kullanımı bilgilerini al
router.get('/resources', protect, authorize('admin'), async (req, res) => {
    try {
        const [cpu, mem, fsSize, networkStats, processes, time] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.processes(),
            si.time()
        ]);

        const resources = {
            cpu: {
                usage: Math.round(cpu.currentLoad),
                cores: cpu.cpus?.length || 0,
                speed: cpu.cpus?.[0]?.speed || 0
            },
            memory: {
                total: Math.round(mem.total / 1024 / 1024 / 1024), // GB
                used: Math.round(mem.used / 1024 / 1024 / 1024), // GB
                free: Math.round(mem.free / 1024 / 1024 / 1024), // GB
                percentage: Math.round((mem.used / mem.total) * 100)
            },
            storage: fsSize.length > 0 ? {
                total: Math.round(fsSize[0].size / 1024 / 1024 / 1024), // GB
                used: Math.round(fsSize[0].used / 1024 / 1024 / 1024), // GB
                free: Math.round((fsSize[0].size - fsSize[0].used) / 1024 / 1024 / 1024), // GB
                percentage: Math.round((fsSize[0].used / fsSize[0].size) * 100)
            } : null,
            network: networkStats.length > 0 ? {
                interface: networkStats[0].iface,
                rx_speed: Math.round(networkStats[0].rx_sec / 1024 / 1024), // MB/s
                tx_speed: Math.round(networkStats[0].tx_sec / 1024 / 1024), // MB/s
                rx_total: Math.round(networkStats[0].rx_bytes / 1024 / 1024 / 1024), // GB
                tx_total: Math.round(networkStats[0].tx_bytes / 1024 / 1024 / 1024)  // GB
            } : null,
            processes: {
                total: processes.all || 0,
                running: processes.running || 0,
                sleeping: processes.sleeping || 0
            },
            uptime: Math.floor(time.uptime / 3600) // saat cinsinden
        };

        res.json({
            success: true,
            data: resources
        });
    } catch (error) {
        console.error('Kaynak kullanımı alınırken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Kaynak kullanımı alınamadı',
            error: error.message
        });
    }
});

// Sistem performans metrikleri
router.get('/performance', protect, authorize('admin'), async (req, res) => {
    try {
        const startTime = Date.now();
        
        const [cpu, mem, networkStats, diskIO] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.networkStats(),
            si.disksIO()
        ]);

        const responseTime = Date.now() - startTime;
        const memoryUsage = Math.round((mem.used / mem.total) * 100);

        const performance = {
            cpu_usage: Math.round(cpu.currentLoad),
            memory_usage: memoryUsage,
            disk_io: {
                read: Math.round(diskIO.rIO_sec / 1024 / 1024), // MB/s
                write: Math.round(diskIO.wIO_sec / 1024 / 1024) // MB/s
            },
            network_io: networkStats.length > 0 ? {
                rx: Math.round(networkStats[0].rx_sec / 1024 / 1024), // MB/s
                tx: Math.round(networkStats[0].tx_sec / 1024 / 1024)  // MB/s
            } : null,
            response_time: responseTime,
            uptime_percentage: 99.9, // Bu gerçek uptime hesaplaması yapılabilir
            performance_score: Math.max(0, 100 - memoryUsage) // Bellek kullanımına göre performans skoru
        };

        // Performans metriklerini veritabanına kaydet
        try {
            const { getPool } = require('../config/db');
            const pool = await getPool();
            
            await Promise.all([
                pool.request()
                    .input('metricType', 'cpu')
                    .input('value', performance.cpu_usage)
                    .input('unit', '%')
                    .query('INSERT INTO SystemMetrics (metricType, value, unit) VALUES (@metricType, @value, @unit)'),
                
                pool.request()
                    .input('metricType', 'memory')
                    .input('value', performance.memory_usage)
                    .input('unit', '%')
                    .query('INSERT INTO SystemMetrics (metricType, value, unit) VALUES (@metricType, @value, @unit)'),
                
                pool.request()
                    .input('metricType', 'response_time')
                    .input('value', performance.response_time)
                    .input('unit', 'ms')
                    .query('INSERT INTO SystemMetrics (metricType, value, unit) VALUES (@metricType, @value, @unit)')
            ]);
        } catch (dbError) {
            console.warn('Performans metrikleri veritabanına kaydedilemedi:', dbError.message);
        }

        res.json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error('Performans metrikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Performans metrikleri alınamadı',
            error: error.message
        });
    }
});

// Sistem bakım bilgileri
router.get('/maintenance', protect, authorize('admin'), async (req, res) => {
    try {
        const { getPool } = require('../config/db');
        const pool = await getPool();
        
        const [osInfo, versions, backupResult, errorResult, notificationResult, updateResult] = await Promise.all([
            si.osInfo(),
            si.versions(),
            
            // Son yedekleme bilgisi
            pool.request().query(`
                SELECT TOP 1 * FROM SystemBackups 
                WHERE status = 'completed' 
                ORDER BY createdAt DESC
            `),
            
            // Çözülmemiş hatalar
            pool.request().query(`
                SELECT COUNT(*) as count, severity 
                FROM SystemErrors 
                WHERE isResolved = 0 
                GROUP BY severity
            `),
            
            // Okunmamış bildirimler
            pool.request().query(`
                SELECT COUNT(*) as count 
                FROM SystemNotifications 
                WHERE isRead = 0 AND isActive = 1
            `),
            
            // Son güncelleme
            pool.request().query(`
                SELECT TOP 1 * FROM SystemUpdates 
                WHERE status = 'completed' 
                ORDER BY createdAt DESC
            `)
        ]);

        const lastBackup = backupResult.recordset[0];
        const errors = errorResult.recordset;
        const notifications = notificationResult.recordset[0];
        const lastUpdate = updateResult.recordset[0];

        // Hata sayılarını hesapla
        let totalErrors = 0;
        let criticalErrors = 0;
        errors.forEach(error => {
            totalErrors += error.count;
            if (error.severity === 'critical' || error.severity === 'high') {
                criticalErrors += error.count;
            }
        });

        const maintenance = {
            last_backup: lastBackup ? {
                timestamp: lastBackup.createdAt,
                hours_ago: Math.floor((Date.now() - new Date(lastBackup.createdAt).getTime()) / (1000 * 60 * 60)),
                display: (() => {
                    const hoursAgo = Math.floor((Date.now() - new Date(lastBackup.createdAt).getTime()) / (1000 * 60 * 60));
                    if (hoursAgo === 0) return 'Az önce';
                    if (hoursAgo < 24) return `${hoursAgo} saat önce`;
                    const daysAgo = Math.floor(hoursAgo / 24);
                    return `${daysAgo} gün önce`;
                })(),
                status: lastBackup.status,
                size: `${(lastBackup.fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`
            } : {
                timestamp: null,
                hours_ago: null,
                display: 'Yedekleme bulunamadı',
                status: 'none',
                size: '0 GB'
            },
            
            last_update: lastUpdate ? {
                version: lastUpdate.version,
                date: lastUpdate.createdAt,
                type: lastUpdate.updateType,
                description: lastUpdate.description
            } : {
                version: versions.node ? `Node ${versions.node}` : 'Bilinmiyor',
                date: osInfo.build || 'Bilinmiyor',
                type: 'system',
                description: 'Sistem güncellemesi'
            },
            
            active_errors: totalErrors,
            critical_errors: criticalErrors,
            pending_notifications: notifications?.count || 0,
            system_health: criticalErrors > 0 ? 'critical' : (totalErrors > 0 ? 'warning' : 'healthy')
        };

        res.json({
            success: true,
            data: maintenance
        });
    } catch (error) {
        console.error('Bakım bilgileri alınırken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Bakım bilgileri alınamadı',
            error: error.message
        });
    }
});

// Günlük istatistikler
router.get('/daily-stats', protect, authorize('admin'), async (req, res) => {
    try {
        const { getPool } = require('../config/db');
        const pool = await getPool();

        // Bugünkü tarihi al
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // Veritabanından günlük istatistikleri al
        const [newUsersResult, activeSessionsResult, apiRequestsResult, fsSize] = await Promise.all([
            // Bugün kayıt olan kullanıcılar
            pool.request()
                .input('todayStart', todayStart)
                .query(`
                    SELECT COUNT(*) as count 
                    FROM Users 
                    WHERE createdAt >= @todayStart
                `),
            
            // Aktif oturumlar (son 1 saat içinde aktivite gösterenler)
            pool.request()
                .input('oneHourAgo', new Date(Date.now() - 60 * 60 * 1000))
                .query(`
                    SELECT COUNT(DISTINCT userId) as count 
                    FROM ActivityLogs 
                    WHERE createdAt >= @oneHourAgo
                `),
            
            // Bugünkü API istekleri
            pool.request()
                .input('todayStart', todayStart)
                .query(`
                    SELECT COUNT(*) as count 
                    FROM ApiRequests 
                    WHERE createdAt >= @todayStart
                `),
            
            // Disk kullanımı
            si.fsSize()
        ]);

        // Disk kullanımını hesapla
        const diskUsage = fsSize.length > 0 ? 
            (fsSize[0].used / (1024 * 1024 * 1024)).toFixed(1) : '0.0'; // GB

        const dailyStats = {
            new_registrations: newUsersResult.recordset[0]?.count || 0,
            active_sessions: activeSessionsResult.recordset[0]?.count || 0,
            api_requests: apiRequestsResult.recordset[0]?.count || 0,
            disk_usage: `${diskUsage} GB`,
            last_updated: new Date().toISOString()
        };

        res.json({
            success: true,
            data: dailyStats
        });
    } catch (error) {
        console.error('Günlük istatistikler alınırken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Günlük istatistikler alınamadı',
            error: error.message
        });
    }
});

// API isteklerini kaydet (middleware olarak kullanılabilir)
router.post('/log-request', protect, async (req, res) => {
    try {
        const { endpoint, method, statusCode, responseTime, requestSize, responseSize } = req.body;
        const { getPool } = require('../config/db');
        const pool = await getPool();

        await pool.request()
            .input('userId', req.user?.id || null)
            .input('endpoint', endpoint)
            .input('method', method)
            .input('statusCode', statusCode)
            .input('responseTime', responseTime)
            .input('requestSize', requestSize || null)
            .input('responseSize', responseSize || null)
            .input('ipAddress', req.ip)
            .input('userAgent', req.get('User-Agent'))
            .query(`
                INSERT INTO ApiRequests (userId, endpoint, method, statusCode, responseTime, requestSize, responseSize, ipAddress, userAgent)
                VALUES (@userId, @endpoint, @method, @statusCode, @responseTime, @requestSize, @responseSize, @ipAddress, @userAgent)
            `);

        res.json({ success: true, message: 'API isteği kaydedildi' });
    } catch (error) {
        console.error('API isteği kaydedilirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'API isteği kaydedilemedi',
            error: error.message
        });
    }
});

module.exports = router; 