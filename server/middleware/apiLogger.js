const { getPool } = require('../config/db');

// API isteklerini kaydetmek için middleware
const apiLogger = async (req, res, next) => {
    const startTime = Date.now();
    
    // Response'u intercept et
    const originalSend = res.send;
    const originalJson = res.json;
    
    let responseSize = 0;
    let responseData = null;
    
    res.send = function(data) {
        responseSize = Buffer.byteLength(data, 'utf8');
        responseData = data;
        return originalSend.call(this, data);
    };
    
    res.json = function(data) {
        const jsonString = JSON.stringify(data);
        responseSize = Buffer.byteLength(jsonString, 'utf8');
        responseData = data;
        return originalJson.call(this, data);
    };
    
    // Response bittiğinde log kaydet
    res.on('finish', async () => {
        try {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            // Sadece API endpoint'lerini kaydet
            if (!req.path.startsWith('/api/')) {
                return;
            }
            
            // Sistem endpoint'lerini kaydetme (sonsuz döngü önlemi)
            if (req.path === '/api/system/log-request') {
                return;
            }
            
            const pool = await getPool();
            
            // Request size hesapla
            let requestSize = 0;
            if (req.body) {
                requestSize = Buffer.byteLength(JSON.stringify(req.body), 'utf8');
            }
            
            // Hata mesajını yakala
            let errorMessage = null;
            if (res.statusCode >= 400 && responseData) {
                if (typeof responseData === 'string') {
                    try {
                        const parsed = JSON.parse(responseData);
                        errorMessage = parsed.message || parsed.error;
                    } catch (e) {
                        errorMessage = responseData.substring(0, 500);
                    }
                } else if (responseData.message || responseData.error) {
                    errorMessage = responseData.message || responseData.error;
                }
            }
            
            await pool.request()
                .input('userId', req.user?.id || null)
                .input('endpoint', req.path)
                .input('method', req.method)
                .input('statusCode', res.statusCode)
                .input('responseTime', responseTime)
                .input('requestSize', requestSize || null)
                .input('responseSize', responseSize || null)
                .input('ipAddress', req.ip || req.connection.remoteAddress)
                .input('userAgent', req.get('User-Agent') || null)
                .input('errorMessage', errorMessage)
                .query(`
                    INSERT INTO ApiRequests (userId, endpoint, method, statusCode, responseTime, requestSize, responseSize, ipAddress, userAgent, errorMessage)
                    VALUES (@userId, @endpoint, @method, @statusCode, @responseTime, @requestSize, @responseSize, @ipAddress, @userAgent, @errorMessage)
                `);
                
        } catch (error) {
            // Log kaydı başarısız olursa sessizce devam et
            console.warn('API isteği kaydedilemedi:', error.message);
        }
    });
    
    next();
};

module.exports = apiLogger; 