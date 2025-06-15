const { getPool, sql } = require('../config/db');

// Activity Logger Utility
class ActivityLogger {
    static async log({
        userId,
        userRole,
        companyId = null,
        action,
        actionType,
        targetType,
        targetId = null,
        targetName = null,
        description,
        metadata = null,
        req = null
    }) {
        try {
            const pool = await getPool();
            
            // IP ve User Agent bilgilerini req'den al
            let ipAddress = null;
            let userAgent = null;
            
            if (req) {
                ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                           (req.connection.socket ? req.connection.socket.remoteAddress : null);
                userAgent = req.get('User-Agent');
            }

            await pool.request()
                .input('userId', sql.Int, userId)
                .input('userRole', sql.NVarChar, userRole)
                .input('companyId', sql.Int, companyId)
                .input('action', sql.NVarChar, action)
                .input('actionType', sql.NVarChar, actionType)
                .input('targetType', sql.NVarChar, targetType)
                .input('targetId', sql.Int, targetId)
                .input('targetName', sql.NVarChar, targetName)
                .input('description', sql.NVarChar, description)
                .input('metadata', sql.NVarChar, metadata ? JSON.stringify(metadata) : null)
                .input('ipAddress', sql.NVarChar, ipAddress)
                .input('userAgent', sql.NVarChar, userAgent)
                .query(`
                    INSERT INTO ActivityLogs 
                    (userId, userRole, companyId, action, actionType, targetType, targetId, targetName, description, metadata, ipAddress, userAgent)
                    VALUES 
                    (@userId, @userRole, @companyId, @action, @actionType, @targetType, @targetId, @targetName, @description, @metadata, @ipAddress, @userAgent)
                `);

            console.log(`Activity logged: ${action} by user ${userId}`);
        } catch (error) {
            console.error('Activity logging error:', error);
            // Log hatası uygulamayı durdurmamalı
        }
    }

    // Önceden tanımlanmış aktivite tipleri
    static ACTIONS = {
        // Kullanıcı işlemleri
        USER_CREATED: 'user_created',
        USER_UPDATED: 'user_updated',
        USER_DELETED: 'user_deleted',
        USER_LOGIN: 'user_login',
        USER_LOGOUT: 'user_logout',
        
        // Kart işlemleri
        CARD_CREATED: 'card_created',
        CARD_UPDATED: 'card_updated',
        CARD_DELETED: 'card_deleted',
        CARD_VIEWED: 'card_viewed',
        CARD_STATUS_CHANGED: 'card_status_changed',
        
        // Şirket işlemleri
        COMPANY_CREATED: 'company_created',
        COMPANY_UPDATED: 'company_updated',
        COMPANY_DELETED: 'company_deleted',
        
        // Sistem işlemleri
        SYSTEM_BACKUP: 'system_backup',
        SYSTEM_MAINTENANCE: 'system_maintenance'
    };

    static ACTION_TYPES = {
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        VIEW: 'view',
        LOGIN: 'login',
        LOGOUT: 'logout',
        SYSTEM: 'system'
    };

    static TARGET_TYPES = {
        USER: 'user',
        CARD: 'card',
        COMPANY: 'company',
        SYSTEM: 'system'
    };

    // Kolay kullanım için helper metodlar
    static async logUserAction(userId, userRole, companyId, action, description, req, metadata = null) {
        await this.log({
            userId,
            userRole,
            companyId,
            action,
            actionType: this.ACTION_TYPES.CREATE,
            targetType: this.TARGET_TYPES.USER,
            description,
            metadata,
            req
        });
    }

    static async logCardAction(userId, userRole, companyId, action, cardId, cardName, description, req, metadata = null) {
        await this.log({
            userId,
            userRole,
            companyId,
            action,
            actionType: this.getActionTypeFromAction(action),
            targetType: this.TARGET_TYPES.CARD,
            targetId: cardId,
            targetName: cardName,
            description,
            metadata,
            req
        });
    }

    static async logCompanyAction(userId, userRole, companyId, action, targetCompanyId, companyName, description, req, metadata = null) {
        await this.log({
            userId,
            userRole,
            companyId,
            action,
            actionType: this.getActionTypeFromAction(action),
            targetType: this.TARGET_TYPES.COMPANY,
            targetId: targetCompanyId,
            targetName: companyName,
            description,
            metadata,
            req
        });
    }

    static getActionTypeFromAction(action) {
        if (action.includes('created')) return this.ACTION_TYPES.CREATE;
        if (action.includes('updated')) return this.ACTION_TYPES.UPDATE;
        if (action.includes('deleted')) return this.ACTION_TYPES.DELETE;
        if (action.includes('viewed')) return this.ACTION_TYPES.VIEW;
        if (action.includes('login')) return this.ACTION_TYPES.LOGIN;
        if (action.includes('logout')) return this.ACTION_TYPES.LOGOUT;
        return this.ACTION_TYPES.SYSTEM;
    }
}

module.exports = ActivityLogger; 