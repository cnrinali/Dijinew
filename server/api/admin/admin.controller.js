const { getPool, sql } = require('../../config/db');
const bcrypt = require('bcryptjs');
const { sendCorporateUserCredentials } = require('../../services/emailService');

// @desc    Get all users (Admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    console.log("getAllUsers controller (Admin) çağrıldı");
    // TODO: Sayfalama, arama, rol filtreleme eklenebilir
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`
                SELECT 
                    u.id, 
                    u.name, 
                    u.email, 
                    u.role, 
                    u.createdAt,
                    u.companyId,      -- companyId eklendi
                    c.name AS companyName -- Şirket adı eklendi (LEFT JOIN ile)
                FROM Users u
                LEFT JOIN Companies c ON u.companyId = c.id -- LEFT JOIN kullanıldı
                ORDER BY u.createdAt DESC
            `);

        // Belki direkt result.recordset döndürmek yerine sayfalama için bir obje döndürmek daha iyi olabilir
        // Örnek: res.status(200).json({ data: result.recordset, totalCount: result.recordset.length });
        res.status(200).json(result.recordset); // Şimdilik direkt diziyi döndürelim

    } catch (error) {
        console.error("Admin - Kullanıcıları listeleme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const userIdToDelete = req.params.id;
    const adminUserId = req.user.id; // Silen adminin ID'si

    // Adminin kendi kendini silmesini engelle
    if (parseInt(userIdToDelete) === adminUserId) {
        return res.status(400).json({ message: 'Yöneticiler kendi hesaplarını silemez.' });
    }

    if (isNaN(parseInt(userIdToDelete))) {
         return res.status(400).json({ message: 'Geçersiz Kullanıcı ID' });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Önce kullanıcının kartları var mı kontrol et
            const checkCards = new sql.Request(transaction);
            checkCards.input('userId', sql.Int, parseInt(userIdToDelete));
            const cardsCount = await checkCards.query('SELECT COUNT(*) as cardCount FROM Cards WHERE userId = @userId');
            const hasCards = cardsCount.recordset[0].cardCount > 0;
            
            if (hasCards) {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: 'Bu kullanıcının aktif kartları bulunmaktadır. Lütfen önce tüm kartlarını silin.' 
                });
            }
            
            console.log(`Kullanıcı ${userIdToDelete} için ilişkili veriler siliniyor...`);
            
            // 2. Tüm sistem tablolarındaki kayıtları sil (sistem aktiviteleri)
            const deleteApiRequests = new sql.Request(transaction);
            deleteApiRequests.input('userId', sql.Int, parseInt(userIdToDelete));
            const apiRequestsResult = await deleteApiRequests.query('DELETE FROM ApiRequests WHERE userId = @userId');
            console.log(`ApiRequests: ${apiRequestsResult.rowsAffected[0]} kayıt silindi`);

            // WizardTokens tablosundaki kayıtları sil
            const deleteWizardTokens = new sql.Request(transaction);
            deleteWizardTokens.input('userId', sql.Int, parseInt(userIdToDelete));
            const wizardTokensResult = await deleteWizardTokens.query('DELETE FROM WizardTokens WHERE createdBy = @userId');
            console.log(`WizardTokens: ${wizardTokensResult.rowsAffected[0]} kayıt silindi`);

            // SystemErrors tablosundaki kayıtları sil
            const deleteSystemErrors = new sql.Request(transaction);
            deleteSystemErrors.input('userId', sql.Int, parseInt(userIdToDelete));
            const systemErrorsResult = await deleteSystemErrors.query('DELETE FROM SystemErrors WHERE userId = @userId');
            console.log(`SystemErrors: ${systemErrorsResult.rowsAffected[0]} kayıt silindi`);

            // 3. Son olarak kullanıcıyı sil
            const deleteUser = new sql.Request(transaction);
            deleteUser.input('userId', sql.Int, parseInt(userIdToDelete));
            const result = await deleteUser.query('DELETE FROM Users WHERE id = @userId');
            console.log(`Users: ${result.rowsAffected[0]} kayıt silindi`);

            if (result.rowsAffected && result.rowsAffected[0] > 0) {
                await transaction.commit();
                res.status(200).json({ message: 'Kullanıcı ve tüm ilişkili veriler başarıyla silindi', id: userIdToDelete });
            } else {
                await transaction.rollback();
                return res.status(404).json({ message: 'Silinecek kullanıcı bulunamadı' });
            }

        } catch (error) {
            await transaction.rollback();
            console.error("Kullanıcı silme hatası (Transaction):", error);
            throw error;
        }

    } catch (error) {
        console.error("Kullanıcı silme hatası (Admin):", error);
        
        // Foreign key hatası için özel mesaj
        if (error.number === 547) {
            return res.status(400).json({ 
                message: 'Bu kullanıcı silinemez çünkü sistemde aktif kayıtları bulunmaktadır. Lütfen önce kullanıcının tüm kartlarını ve aktivitelerini silin.' 
            });
        }
        
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get all cards (regardless of user, with optional search, status filter and pagination)
// @route   GET /api/admin/cards
// @access  Private/Admin
const getAllCards = async (req, res) => {
    const { search, isActive, page = 1, limit = 10 } = req.query; // isActive filtresi eklendi
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ message: 'Geçersiz sayfa veya limit değeri.' });
    }
    // isActive filtresini işle (string "true"/"false" gelirse boolean'a çevir)
    let isActiveFilter = null;
    if (isActive === 'true') {
        isActiveFilter = 1; // SQL Server BIT için 1
    } else if (isActive === 'false') {
        isActiveFilter = 0; // SQL Server BIT için 0
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        let baseQuery = `FROM Cards c JOIN Users u ON c.userId = u.id`;
        let whereConditions = [];

        // Arama koşulu
        if (search) {
            whereConditions.push('(c.cardName LIKE @searchTerm OR u.name LIKE @searchTerm)');
            request.input('searchTerm', sql.NVarChar, `%${search}%`);
        }
        // Aktiflik durumu filtresi
        if (isActiveFilter !== null) {
             whereConditions.push('c.isActive = @isActiveFilter');
             request.input('isActiveFilter', sql.Bit, isActiveFilter);
        }

        // WHERE cümlesini oluştur
        let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // 1. Toplam kayıt sayısını al
        const countQuery = `SELECT COUNT(c.id) as totalCount ${baseQuery} ${whereClause}`;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

        // 2. Mevcut sayfanın verisini al
        const dataQuery = `
            SELECT c.*, u.name as userName, u.email as userEmail 
            ${baseQuery}
            ${whereClause} 
            ORDER BY c.createdAt DESC 
            OFFSET @offset ROWS 
            FETCH NEXT @limit ROWS ONLY
        `;
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limitNum);
        
        const dataResult = await request.query(dataQuery);
        
        res.status(200).json({
            data: dataResult.recordset,
            totalCount: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum)
        });

    } catch (error) {
        console.error("Tüm kartları getirme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Delete any card by ID
// @route   DELETE /api/admin/cards/:id
// @access  Private/Admin
const deleteAnyCard = async (req, res) => {
    const cardIdToDelete = req.params.id;

    if (isNaN(parseInt(cardIdToDelete))) {
         return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardIdToDelete))
            .query('DELETE FROM Cards WHERE id = @cardId');

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Kartvizit başarıyla silindi', id: cardIdToDelete });
        } else {
            return res.status(404).json({ message: 'Silinecek kartvizit bulunamadı' });
        }

    } catch (error) {
        console.error("Kart silme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Create a new user by Admin (GÜNCELLENDİ - Yeni Fonksiyon)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUserAdmin = async (req, res) => {
    const { name, email, password, role, companyId } = req.body;
    console.log("createUserAdmin controller çağrıldı:", { name, email, role, companyId }); // Şifreyi loglama

    // Gerekli alan kontrolü
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'İsim, e-posta, şifre ve rol zorunludur.' });
    }

    // Rol kontrolü (sadece admin, user ve corporate olabilir)
    const validRoles = ['admin', 'user', 'corporate'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: `Geçersiz rol. Rol ${validRoles.join(' veya ')} olmalıdır.` });
    }

    // E-posta format kontrolü
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return res.status(400).json({ message: 'Geçersiz e-posta formatı.' });
    }

    // Şifre uzunluğu kontrolü (opsiyonel ama önerilir)
    if (password.length < 6) { 
        return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    let companyIdToSet = null;
    if (companyId) { // Eğer companyId gönderildiyse, geçerliliğini kontrol et
        const parsedCompanyId = parseInt(companyId, 10);
        if (isNaN(parsedCompanyId)) {
            return res.status(400).json({ message: 'Geçersiz Şirket ID formatı.' });
        }
        companyIdToSet = parsedCompanyId;
    } // Gönderilmediyse NULL kalır (Bireysel)

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. E-posta zaten var mı?
            const emailCheckRequest = new sql.Request(transaction);
            emailCheckRequest.input('email', sql.NVarChar, email);
            const emailCheckResult = await emailCheckRequest.query('SELECT TOP 1 id FROM Users WHERE email = @email');
            if (emailCheckResult.recordset.length > 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
            }

            // 2. Eğer companyId varsa, şirket var mı?
            if (companyIdToSet !== null) {
                const companyCheckRequest = new sql.Request(transaction);
                companyCheckRequest.input('companyId', sql.Int, companyIdToSet);
                const companyCheckResult = await companyCheckRequest.query('SELECT TOP 1 id FROM Companies WHERE id = @companyId');
                if (companyCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: `Belirtilen şirket bulunamadı (ID: ${companyIdToSet}).` });
                }
            }

            // 3. Şifreyi hashle
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 4. Kullanıcıyı ekle
            const insertRequest = new sql.Request(transaction);
            insertRequest.input('name', sql.NVarChar, name);
            insertRequest.input('email', sql.NVarChar, email);
            insertRequest.input('password', sql.NVarChar, hashedPassword);
            insertRequest.input('role', sql.NVarChar, role);
            insertRequest.input('companyId', sql.Int, companyIdToSet); // NULL veya geçerli ID
            
            const insertResult = await insertRequest.query(`
                INSERT INTO Users (name, email, password, role, companyId)
                OUTPUT inserted.id, inserted.name, inserted.email, inserted.role, inserted.createdAt, inserted.companyId
                VALUES (@name, @email, @password, @role, @companyId);
            `);

            const newUser = insertResult.recordset[0];

            // Yeni eklenen kullanıcıya şirket adını ekle (varsa)
            if (newUser.companyId) {
                 const companyNameRequest = new sql.Request(transaction);
                 companyNameRequest.input('cId', sql.Int, newUser.companyId);
                 const companyNameResult = await companyNameRequest.query('SELECT name FROM Companies WHERE id = @cId');
                 newUser.companyName = companyNameResult.recordset[0]?.name;
            }

            await transaction.commit();
            
            // Kullanıcıya email gönder
            const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
            const companyName = newUser.companyName || 'Sistem';
            const emailResult = await sendCorporateUserCredentials(
                email,
                name,
                email,
                password, // Orijinal şifre (hash'lenmemiş)
                companyName,
                loginUrl
            );
            
            if (emailResult.success) {
                console.log('Kullanıcı oluşturma emaili başarıyla gönderildi:', emailResult.messageId);
            } else {
                console.warn('Kullanıcı oluşturma emaili gönderilemedi:', emailResult.message);
            }
            
            // Başarılı yanıt (şifre olmadan)
            res.status(201).json({
                ...newUser,
                emailSent: emailResult.success
            });

        } catch (error) {
            await transaction.rollback();
            console.error("Kullanıcı oluşturma (Admin - Transaction) hatası:", error);
            if (error.number === 2601 || error.number === 2627) { // Unique constraint email
                return res.status(400).json({ message: 'E-posta adresi zaten kullanılıyor (Tekrar kontrol).' });
            } else if (error.number === 547) { // Foreign key constraint companyId
                 return res.status(400).json({ message: 'Belirtilen şirket ID\'si geçersiz (FK hatası).' });
            }
            res.status(500).json({ message: 'Kullanıcı oluşturulurken bir sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kullanıcı oluşturma (Admin - Connection/Begin) hatası:", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// @desc    Update any user's profile (name, email, role, companyId) by Admin (GÜNCELLENDİ)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateAnyUser = async (req, res) => { // Fonksiyon adı değiştirildi
    const userIdToUpdate = req.params.id;
    const { name, email, role, companyId } = req.body; // Rol ve companyId eklendi
    const adminUserId = req.user.id;
    console.log(`updateAnyUser controller çağrıldı, ID: ${userIdToUpdate}`, { name, email, role, companyId });

    if (parseInt(userIdToUpdate) === adminUserId) {
        return res.status(400).json({ message: 'Kendi bilgilerinizi buradan güncelleyemezsiniz.' });
    }
    if (isNaN(parseInt(userIdToUpdate))) {
        return res.status(400).json({ message: 'Geçersiz Kullanıcı ID' });
    }

    // Gerekli alan kontrolü (role hariç hepsi zorunlu, role varsa geçerli olmalı)
    if (!name || !email) {
        return res.status(400).json({ message: 'İsim ve e-posta alanları zorunludur.' });
    }
    const validRoles = ['admin', 'user'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: `Geçersiz rol. Rol ${validRoles.join(' veya ')} olmalıdır.` });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return res.status(400).json({ message: 'Geçersiz e-posta formatı.' });
    }

    let companyIdToSet = null;
    let updateCompanyId = false; // companyId'nin güncellenip güncellenmeyeceğini takip et
    if (companyId !== undefined) { // companyId bilerek null veya bir değer olarak gönderilebilir
        updateCompanyId = true;
        if (companyId !== null) { // Eğer null değilse, geçerliliğini kontrol et
            const parsedCompanyId = parseInt(companyId, 10);
            if (isNaN(parsedCompanyId)) {
                return res.status(400).json({ message: 'Geçersiz Şirket ID formatı.' });
            }
            companyIdToSet = parsedCompanyId;
        } // null ise companyIdToSet null kalır
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. E-posta başka kullanıcıda var mı?
            const emailCheckRequest = new sql.Request(transaction);
            emailCheckRequest.input('email', sql.NVarChar, email);
            emailCheckRequest.input('userIdToExclude', sql.Int, parseInt(userIdToUpdate));
            const emailCheckResult = await emailCheckRequest.query(
                'SELECT TOP 1 id FROM Users WHERE email = @email AND id != @userIdToExclude'
            );
            if (emailCheckResult.recordset.length > 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor.' });
            }

            // 2. companyId null değilse ve güncelleniyorsa, şirket var mı?
            if (updateCompanyId && companyIdToSet !== null) {
                const companyCheckRequest = new sql.Request(transaction);
                companyCheckRequest.input('companyId', sql.Int, companyIdToSet);
                const companyCheckResult = await companyCheckRequest.query('SELECT TOP 1 id FROM Companies WHERE id = @companyId');
                if (companyCheckResult.recordset.length === 0) {
                    await transaction.rollback();
                    return res.status(404).json({ message: `Belirtilen şirket bulunamadı (ID: ${companyIdToSet}).` });
                }
            }

            // 3. Kullanıcıyı güncelle
            const updateRequest = new sql.Request(transaction);
            updateRequest.input('userId', sql.Int, parseInt(userIdToUpdate));
            updateRequest.input('name', sql.NVarChar, name);
            updateRequest.input('email', sql.NVarChar, email);

            let setClauses = 'name = @name, email = @email';
            if (role) { // Rol sadece gönderildiyse güncellenir
                setClauses += ', role = @role';
                updateRequest.input('role', sql.NVarChar, role);
            }
            if (updateCompanyId) { // CompanyId sadece gönderildiyse güncellenir (null olabilir)
                setClauses += ', companyId = @companyId';
                if (companyIdToSet === null) {
                    updateRequest.input('companyId', sql.Int, null);
                } else {
                    updateRequest.input('companyId', sql.Int, companyIdToSet);
                }
            }
            
            const updateQuery = `UPDATE Users SET ${setClauses} WHERE id = @userId`;
            const updateResult = await updateRequest.query(updateQuery);

            if (updateResult.rowsAffected[0] === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenecek kullanıcı bulunamadı.' });
            }

            // Güncellenmiş kullanıcı bilgilerini al
            const getUserRequest = new sql.Request(transaction);
            getUserRequest.input('userId', sql.Int, parseInt(userIdToUpdate));
            const getUserResult = await getUserRequest.query('SELECT id, name, email, role, createdAt, companyId FROM Users WHERE id = @userId');
            
            if (getUserResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenen kullanıcı bilgileri alınamadı.' });
            }

            const updatedUser = getUserResult.recordset[0];

            // Güncellenen kullanıcıya şirket adını ekle (varsa)
             if (updatedUser.companyId) {
                 const companyNameRequest = new sql.Request(transaction);
                 companyNameRequest.input('cId', sql.Int, updatedUser.companyId);
                 const companyNameResult = await companyNameRequest.query('SELECT name FROM Companies WHERE id = @cId');
                 updatedUser.companyName = companyNameResult.recordset[0]?.name;
            } else {
                updatedUser.companyName = null; // Eğer companyId null olduysa companyName'i de null yap
            }
            
            await transaction.commit();

            res.status(200).json({
                message: 'Kullanıcı bilgileri başarıyla güncellendi.',
                user: updatedUser // Güncellenmiş tam kullanıcı bilgisini döndür
            });

        } catch (error) {
            await transaction.rollback();
            console.error("Kullanıcı güncelleme (Admin - Transaction) hatası:", error);
            if (error.number === 2601 || error.number === 2627) { 
                return res.status(400).json({ message: 'E-posta adresi zaten kullanılıyor (Tekrar kontrol).' });
            } else if (error.number === 547) { // Foreign key constraint companyId
                 return res.status(400).json({ message: 'Belirtilen şirket ID\'si geçersiz (FK hatası).' });
            }
            res.status(500).json({ message: 'Güncelleme sırasında bir sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kullanıcı güncelleme (Admin - Connection/Begin) hatası:", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const pool = await getPool();

        // Paralel sorgular daha hızlı olabilir
        const [userCountResult, cardCountResult, activeCardCountResult] = await Promise.all([
            pool.request().query('SELECT COUNT(*) as totalUsers FROM Users'),
            pool.request().query('SELECT COUNT(*) as totalCards FROM Cards'),
            pool.request().query('SELECT COUNT(*) as activeCards FROM Cards WHERE isActive = 1')
        ]);

        const stats = {
            totalUsers: userCountResult.recordset[0].totalUsers,
            totalCards: cardCountResult.recordset[0].totalCards,
            activeCards: activeCardCountResult.recordset[0].activeCards
        };

        res.status(200).json(stats);

    } catch (error) {
        console.error("Dashboard istatistiklerini getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};


module.exports = {
    getAllUsers,
    deleteUser,
    getAllCards,
    deleteAnyCard,
    createUserAdmin,
    updateAnyUser,
    getDashboardStats
}; 