const { getPool, sql } = require('../../config/db');

// @desc    Get all users with pagination and search
// @access  Private/Admin
const getAllUsersService = async (page = 1, limit = 10, search = '', role = '') => {
    try {
        const pool = await getPool();
        const offset = (page - 1) * limit;
        
        let whereConditions = [];
        let queryParams = {};
        
        // Arama koşulu
        if (search) {
            whereConditions.push('(u.name LIKE @search OR u.email LIKE @search)');
            queryParams.search = `%${search}%`;
        }
        
        // Rol filtresi
        if (role) {
            whereConditions.push('u.role = @role');
            queryParams.role = role;
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Toplam kayıt sayısını al
        const countQuery = `
            SELECT COUNT(*) as totalCount 
            FROM Users u
            LEFT JOIN Companies c ON u.companyId = c.id
            ${whereClause}
        `;
        
        const countRequest = pool.request();
        Object.keys(queryParams).forEach(key => {
            countRequest.input(key, sql.NVarChar, queryParams[key]);
        });
        const countResult = await countRequest.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;
        
        // Verileri al
        const dataQuery = `
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.createdAt,
                u.companyId,
                c.name AS companyName
            FROM Users u
            LEFT JOIN Companies c ON u.companyId = c.id
            ${whereClause}
            ORDER BY u.createdAt DESC
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        
        const dataRequest = pool.request();
        Object.keys(queryParams).forEach(key => {
            dataRequest.input(key, sql.NVarChar, queryParams[key]);
        });
        dataRequest.input('offset', sql.Int, offset);
        dataRequest.input('limit', sql.Int, limit);
        
        const dataResult = await dataRequest.query(dataQuery);
        
        return {
            users: dataResult.recordset,
            totalCount: totalCount,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit)
        };
        
    } catch (error) {
        console.error("getAllUsersService hatası:", error);
        throw error;
    }
};

// @desc    Get user by ID
// @access  Private/Admin
const getUserByIdService = async (userId) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    u.id, 
                    u.name, 
                    u.email, 
                    u.role, 
                    u.createdAt,
                    u.companyId,
                    c.name AS companyName
                FROM Users u
                LEFT JOIN Companies c ON u.companyId = c.id
                WHERE u.id = @userId
            `);
        
        return result.recordset[0] || null;
        
    } catch (error) {
        console.error("getUserByIdService hatası:", error);
        throw error;
    }
};

// @desc    Delete user by ID
// @access  Private/Admin
const deleteUserService = async (userId) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('DELETE FROM Users WHERE id = @userId');
        
        return result.rowsAffected[0] > 0;
        
    } catch (error) {
        console.error("deleteUserService hatası:", error);
        throw error;
    }
};

// @desc    Update user by ID
// @access  Private/Admin
const updateUserService = async (userId, userData) => {
    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        
        try {
            const { name, email, role, companyId } = userData;
            
            // E-posta kontrolü (başka kullanıcıda var mı?)
            if (email) {
                const emailCheckRequest = new sql.Request(transaction);
                emailCheckRequest.input('email', sql.NVarChar, email);
                emailCheckRequest.input('userId', sql.Int, userId);
                const emailCheckResult = await emailCheckRequest.query(
                    'SELECT TOP 1 id FROM Users WHERE email = @email AND id != @userId'
                );
                
                if (emailCheckResult.recordset.length > 0) {
                    await transaction.rollback();
                    throw new Error('Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor.');
                }
            }
            
            // Company ID kontrolü
            if (companyId !== null && companyId !== undefined) {
                const companyCheckRequest = new sql.Request(transaction);
                companyCheckRequest.input('companyId', sql.Int, companyId);
                const companyCheckResult = await companyCheckRequest.query(
                    'SELECT TOP 1 id FROM Companies WHERE id = @companyId'
                );
                
                if (companyId !== null && companyCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    throw new Error('Belirtilen şirket bulunamadı.');
                }
            }
            
            // Kullanıcıyı güncelle
            const updateRequest = new sql.Request(transaction);
            updateRequest.input('userId', sql.Int, userId);
            
            let setClauses = [];
            if (name) {
                setClauses.push('name = @name');
                updateRequest.input('name', sql.NVarChar, name);
            }
            if (email) {
                setClauses.push('email = @email');
                updateRequest.input('email', sql.NVarChar, email);
            }
            if (role) {
                setClauses.push('role = @role');
                updateRequest.input('role', sql.NVarChar, role);
            }
            if (companyId !== undefined) {
                setClauses.push('companyId = @companyId');
                updateRequest.input('companyId', sql.Int, companyId);
            }
            
            if (setClauses.length === 0) {
                await transaction.rollback();
                throw new Error('Güncellenecek alan bulunamadı.');
            }
            
            const updateQuery = `
                UPDATE Users 
                SET ${setClauses.join(', ')} 
                OUTPUT inserted.id, inserted.name, inserted.email, inserted.role, inserted.createdAt, inserted.companyId
                WHERE id = @userId
            `;
            
            const updateResult = await updateRequest.query(updateQuery);
            
            if (updateResult.recordset.length === 0) {
                await transaction.rollback();
                throw new Error('Güncellenecek kullanıcı bulunamadı.');
            }
            
            const updatedUser = updateResult.recordset[0];
            
            // Şirket adını ekle
            if (updatedUser.companyId) {
                const companyNameRequest = new sql.Request(transaction);
                companyNameRequest.input('companyId', sql.Int, updatedUser.companyId);
                const companyNameResult = await companyNameRequest.query(
                    'SELECT name FROM Companies WHERE id = @companyId'
                );
                updatedUser.companyName = companyNameResult.recordset[0]?.name;
            }
            
            await transaction.commit();
            return updatedUser;
            
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        
    } catch (error) {
        console.error("updateUserService hatası:", error);
        throw error;
    }
};

// @desc    Create new user
// @access  Private/Admin
const createUserService = async (userData) => {
    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        
        try {
            const { name, email, password, role, companyId } = userData;
            
            // E-posta kontrolü
            const emailCheckRequest = new sql.Request(transaction);
            emailCheckRequest.input('email', sql.NVarChar, email);
            const emailCheckResult = await emailCheckRequest.query(
                'SELECT TOP 1 id FROM Users WHERE email = @email'
            );
            
            if (emailCheckResult.recordset.length > 0) {
                await transaction.rollback();
                throw new Error('Bu e-posta adresi zaten kullanılıyor.');
            }
            
            // Company ID kontrolü
            if (companyId) {
                const companyCheckRequest = new sql.Request(transaction);
                companyCheckRequest.input('companyId', sql.Int, companyId);
                const companyCheckResult = await companyCheckRequest.query(
                    'SELECT TOP 1 id FROM Companies WHERE id = @companyId'
                );
                
                if (companyCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    throw new Error('Belirtilen şirket bulunamadı.');
                }
            }
            
            // Kullanıcıyı oluştur
            const insertRequest = new sql.Request(transaction);
            insertRequest.input('name', sql.NVarChar, name);
            insertRequest.input('email', sql.NVarChar, email);
            insertRequest.input('password', sql.NVarChar, password);
            insertRequest.input('role', sql.NVarChar, role);
            insertRequest.input('companyId', sql.Int, companyId || null);
            
            const insertResult = await insertRequest.query(`
                INSERT INTO Users (name, email, password, role, companyId)
                OUTPUT inserted.id, inserted.name, inserted.email, inserted.role, inserted.createdAt, inserted.companyId
                VALUES (@name, @email, @password, @role, @companyId)
            `);
            
            const newUser = insertResult.recordset[0];
            
            // Şirket adını ekle
            if (newUser.companyId) {
                const companyNameRequest = new sql.Request(transaction);
                companyNameRequest.input('companyId', sql.Int, newUser.companyId);
                const companyNameResult = await companyNameRequest.query(
                    'SELECT name FROM Companies WHERE id = @companyId'
                );
                newUser.companyName = companyNameResult.recordset[0]?.name;
            }
            
            await transaction.commit();
            return newUser;
            
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        
    } catch (error) {
        console.error("createUserService hatası:", error);
        throw error;
    }
};

// @desc    Get dashboard statistics
// @access  Private/Admin
const getDashboardStatsService = async () => {
    try {
        const pool = await getPool();
        
        const [userCountResult, cardCountResult, activeCardCountResult, companyCountResult] = await Promise.all([
            pool.request().query('SELECT COUNT(*) as totalUsers FROM Users'),
            pool.request().query('SELECT COUNT(*) as totalCards FROM Cards'),
            pool.request().query('SELECT COUNT(*) as activeCards FROM Cards WHERE isActive = 1'),
            pool.request().query('SELECT COUNT(*) as totalCompanies FROM Companies')
        ]);
        
        return {
            totalUsers: userCountResult.recordset[0].totalUsers,
            totalCards: cardCountResult.recordset[0].totalCards,
            activeCards: activeCardCountResult.recordset[0].activeCards,
            totalCompanies: companyCountResult.recordset[0].totalCompanies
        };
        
    } catch (error) {
        console.error("getDashboardStatsService hatası:", error);
        throw error;
    }
};

module.exports = {
    getAllUsersService,
    getUserByIdService,
    deleteUserService,
    updateUserService,
    createUserService,
    getDashboardStatsService
};
