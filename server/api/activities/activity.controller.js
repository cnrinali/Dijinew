const { getPool, sql } = require('../../config/db');

// @desc    Get activities for admin (all activities)
// @route   GET /api/activities/admin
// @access  Private/Admin
const getAdminActivities = async (req, res) => {
    const { page = 1, limit = 20, actionType, targetType, userId, companyId } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir.' });
    }

    try {
        const pool = await getPool();
        const request = pool.request();

        let whereConditions = [];
        
        if (actionType) {
            whereConditions.push('al.actionType = @actionType');
            request.input('actionType', sql.NVarChar, actionType);
        }
        
        if (targetType) {
            whereConditions.push('al.targetType = @targetType');
            request.input('targetType', sql.NVarChar, targetType);
        }
        
        if (userId) {
            whereConditions.push('al.userId = @userId');
            request.input('userId', sql.Int, parseInt(userId));
        }
        
        if (companyId) {
            whereConditions.push('al.companyId = @companyId');
            request.input('companyId', sql.Int, parseInt(companyId));
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // Count query
        const countQuery = `
            SELECT COUNT(al.id) as totalCount 
            FROM ActivityLogs al 
            ${whereClause}
        `;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

        // Data query
        const dataQuery = `
            SELECT 
                al.*,
                u.name as userName,
                u.email as userEmail,
                c.name as companyName
            FROM ActivityLogs al
            LEFT JOIN Users u ON al.userId = u.id
            LEFT JOIN Companies c ON al.companyId = c.id
            ${whereClause}
            ORDER BY al.createdAt DESC
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limitNum);
        
        const dataResult = await request.query(dataQuery);
        
        // Parse metadata JSON
        const activities = dataResult.recordset.map(activity => ({
            ...activity,
            metadata: activity.metadata ? JSON.parse(activity.metadata) : null
        }));

        res.status(200).json({
            success: true,
            data: activities,
            totalCount: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum)
        });

    } catch (error) {
        console.error("Admin aktiviteleri getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get activities for corporate user (company activities only)
// @route   GET /api/activities/corporate
// @access  Private/Corporate
const getCorporateActivities = async (req, res) => {
    const { page = 1, limit = 20, actionType, targetType } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const companyId = req.user.companyId;

    if (req.user.role !== 'corporate') {
        return res.status(403).json({ message: 'Bu işlem için kurumsal kullanıcı yetkisi gereklidir.' });
    }

    if (!companyId) {
        return res.status(403).json({ message: 'Şirket bilgisi bulunamadı.' });
    }

    try {
        const pool = await getPool();
        const request = pool.request();

        let whereConditions = ['al.companyId = @companyId'];
        request.input('companyId', sql.Int, companyId);
        
        if (actionType) {
            whereConditions.push('al.actionType = @actionType');
            request.input('actionType', sql.NVarChar, actionType);
        }
        
        if (targetType) {
            whereConditions.push('al.targetType = @targetType');
            request.input('targetType', sql.NVarChar, targetType);
        }

        const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

        // Count query
        const countQuery = `
            SELECT COUNT(al.id) as totalCount 
            FROM ActivityLogs al 
            ${whereClause}
        `;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

        // Data query
        const dataQuery = `
            SELECT 
                al.*,
                u.name as userName,
                u.email as userEmail,
                c.name as companyName
            FROM ActivityLogs al
            LEFT JOIN Users u ON al.userId = u.id
            LEFT JOIN Companies c ON al.companyId = c.id
            ${whereClause}
            ORDER BY al.createdAt DESC
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limitNum);
        
        const dataResult = await request.query(dataQuery);
        
        // Parse metadata JSON
        const activities = dataResult.recordset.map(activity => ({
            ...activity,
            metadata: activity.metadata ? JSON.parse(activity.metadata) : null
        }));

        res.status(200).json({
            success: true,
            data: activities,
            totalCount: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum)
        });

    } catch (error) {
        console.error("Kurumsal aktiviteleri getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get recent activities (last 10) for dashboard
// @route   GET /api/activities/recent
// @access  Private
const getRecentActivities = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const companyId = req.user.companyId;

    try {
        const pool = await getPool();
        const request = pool.request();

        // Önce ActivityLogs tablosunun var olup olmadığını kontrol et
        try {
            await pool.request().query("SELECT TOP 1 * FROM ActivityLogs");
        } catch (tableError) {
            console.error("ActivityLogs tablosu bulunamadı:", tableError);
            return res.status(200).json({
                success: true,
                data: [],
                message: 'ActivityLogs tablosu henüz oluşturulmamış. Lütfen veritabanı migration\'ını çalıştırın.'
            });
        }

        let whereClause = '';
        
        if (userRole === 'admin') {
            // Admin tüm aktiviteleri görebilir
            whereClause = '';
        } else if (userRole === 'corporate') {
            // Kurumsal kullanıcı sadece kendi şirketinin aktivitelerini görebilir
            if (!companyId) {
                return res.status(403).json({ message: 'Şirket bilgisi bulunamadı.' });
            }
            whereClause = 'WHERE al.companyId = @companyId';
            request.input('companyId', sql.Int, companyId);
        } else {
            // Normal kullanıcı sadece kendi aktivitelerini görebilir
            whereClause = 'WHERE al.userId = @userId';
            request.input('userId', sql.Int, userId);
        }

        const query = `
            SELECT TOP 10
                al.*,
                u.name as userName,
                u.email as userEmail,
                c.name as companyName
            FROM ActivityLogs al
            LEFT JOIN Users u ON al.userId = u.id
            LEFT JOIN Companies c ON al.companyId = c.id
            ${whereClause}
            ORDER BY al.createdAt DESC
        `;
        
        const result = await request.query(query);
        
        // Parse metadata JSON
        const activities = result.recordset.map(activity => ({
            ...activity,
            metadata: activity.metadata ? JSON.parse(activity.metadata) : null
        }));

        res.status(200).json({
            success: true,
            data: activities
        });

    } catch (error) {
        console.error("Son aktiviteleri getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private
const getActivityStats = async (req, res) => {
    const userRole = req.user.role;
    const companyId = req.user.companyId;

    try {
        const pool = await getPool();
        const request = pool.request();

        let whereClause = '';
        
        if (userRole === 'admin') {
            whereClause = '';
        } else if (userRole === 'corporate') {
            if (!companyId) {
                return res.status(403).json({ message: 'Şirket bilgisi bulunamadı.' });
            }
            whereClause = 'WHERE companyId = @companyId';
            request.input('companyId', sql.Int, companyId);
        } else {
            whereClause = 'WHERE userId = @userId';
            request.input('userId', sql.Int, req.user.id);
        }

        const query = `
            SELECT 
                actionType,
                COUNT(*) as count
            FROM ActivityLogs
            ${whereClause}
            AND createdAt >= DATEADD(day, -30, GETDATE())
            GROUP BY actionType
            ORDER BY count DESC
        `;
        
        const result = await request.query(query);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Aktivite istatistikleri getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

module.exports = {
    getAdminActivities,
    getCorporateActivities,
    getRecentActivities,
    getActivityStats
}; 