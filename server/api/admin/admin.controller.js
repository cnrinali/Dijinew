const { getPool, sql } = require('../../config/db');

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
        const result = await pool.request()
            .input('userId', sql.Int, parseInt(userIdToDelete))
            .query('DELETE FROM Users WHERE id = @userId');
        
        // Users tablosunda ON DELETE CASCADE varsa, ilişkili kartlar da silinir.
        // Eğer CASCADE yoksa, önce kullanıcının kartlarını silmek gerekebilir.

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Kullanıcı başarıyla silindi', id: userIdToDelete });
        } else {
            // Kullanıcı bulunamadı
             return res.status(404).json({ message: 'Silinecek kullanıcı bulunamadı' });
        }

    } catch (error) {
        console.error("Kullanıcı silme hatası (Admin):", error);
        // Foreign key gibi hatalar olabilir
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
            
            // Başarılı yanıt (şifre olmadan)
            res.status(201).json(newUser);

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
                updateRequest.input('companyId', sql.Int, companyIdToSet);
            }
            
            // OUTPUT clause trigger'larla uyumlu değil, ayrı SELECT kullan
            const updateQuery = `UPDATE Users SET ${setClauses} WHERE id = @userId`;
            const updateResult = await updateRequest.query(updateQuery);

            if (updateResult.rowsAffected[0] === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenecek kullanıcı bulunamadı.' });
            }

            // Güncellenmiş kullanıcıyı ayrı sorgu ile al
            const selectRequest = new sql.Request(transaction);
            selectRequest.input('userId', sql.Int, userIdToUpdate);
            const selectResult = await selectRequest.query(`
                SELECT id, name, email, role, createdAt, companyId 
                FROM Users 
                WHERE id = @userId
            `);

            if (selectResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenmiş kullanıcı bilgisi alınamadı.' });
            }

            const updatedUser = selectResult.recordset[0];

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

// @desc    Create a new company
// @route   POST /api/admin/companies
// @access  Private/Admin
const createCompany = async (req, res) => {
    console.log("createCompany controller çağrıldı", req.body);
    // Yeni alanları da alalım (status varsayılan olarak 1 olacak)
    const { name, userLimit, cardLimit, status = 1, phone, website, address } = req.body;

    if (!name || userLimit == null || cardLimit == null) {
        return res.status(400).json({ message: 'Şirket adı, kullanıcı limiti ve kart limiti zorunludur.' });
    }
    // Basit status kontrolü
    if (status !== 0 && status !== 1 && status !== true && status !== false) {
         return res.status(400).json({ message: 'Durum alanı 0, 1, true veya false olmalıdır.' });
    }
    const companyStatus = (status === 1 || status === true); // Boolean'a çevir

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('userLimit', sql.Int, userLimit)
            .input('cardLimit', sql.Int, cardLimit)
            .input('status', sql.Bit, companyStatus)
            .input('phone', sql.NVarChar, phone || null) // Boşsa NULL gönder
            .input('website', sql.NVarChar, website || null)
            .input('address', sql.NVarChar, address || null)
            // updatedAt eklendi
            .query('INSERT INTO Companies (name, userLimit, cardLimit, status, phone, website, address, updatedAt) OUTPUT INSERTED.* VALUES (@name, @userLimit, @cardLimit, @status, @phone, @website, @address, GETDATE())');
        
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error("Şirket oluşturma hatası:", error);
        if (error.number === 2627) { 
             return res.status(400).json({ message: 'Bu isimde bir şirket zaten mevcut olabilir.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private/Admin
const getCompanies = async (req, res) => {
    console.log("getCompanies controller çağrıldı");
    try {
        const pool = await getPool();
        // Yeni alanları da seçelim
        const result = await pool.request().query('SELECT id, name, userLimit, cardLimit, status, phone, website, address, createdAt, updatedAt FROM Companies ORDER BY createdAt DESC');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Şirketleri listeleme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Get company by ID
// @route   GET /api/admin/companies/:id
// @access  Private/Admin
const getCompanyById = async (req, res) => {
    const companyId = req.params.id;
    console.log(`getCompanyById controller çağrıldı, ID: ${companyId}`);
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('companyId', sql.Int, companyId)
            // Yeni alanları da seçelim
            .query('SELECT id, name, userLimit, cardLimit, status, phone, website, address, createdAt, updatedAt FROM Companies WHERE id = @companyId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Şirket bulunamadı.' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Şirket detayı getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Update a company
// @route   PUT /api/admin/companies/:id
// @access  Private/Admin
const updateCompany = async (req, res) => {
    const companyId = req.params.id;
    // Yeni alanları al
    const { name, userLimit, cardLimit, status, phone, website, address } = req.body;
    console.log(`updateCompany controller çağrıldı, ID: ${companyId}`, req.body);

     if (!name || userLimit == null || cardLimit == null) {
        return res.status(400).json({ message: 'Şirket adı, kullanıcı limiti ve kart limiti zorunludur.' });
    }
    // Status kontrolü (opsiyonel olduğu için null da olabilir)
    let companyStatus = null;
    if (status !== undefined && status !== null) {
        if (status !== 0 && status !== 1 && status !== true && status !== false) {
            return res.status(400).json({ message: 'Durum alanı 0, 1, true veya false olmalıdır.' });
        }
        companyStatus = (status === 1 || status === true);
    }

    try {
        const pool = await getPool();
        const request = pool.request()
            .input('companyId', sql.Int, companyId)
            .input('name', sql.NVarChar, name)
            .input('userLimit', sql.Int, userLimit)
            .input('cardLimit', sql.Int, cardLimit)
            .input('phone', sql.NVarChar, phone || null)
            .input('website', sql.NVarChar, website || null)
            .input('address', sql.NVarChar, address || null)
            .input('updatedAt', sql.DateTime2, new Date()); // Veya GETDATE() kullan

        // Status sadece gönderildiyse güncellensin
        let setClauses = 'name = @name, userLimit = @userLimit, cardLimit = @cardLimit, phone = @phone, website = @website, address = @address, updatedAt = @updatedAt';
        if (companyStatus !== null) {
            setClauses += ', status = @status';
            request.input('status', sql.Bit, companyStatus);
        }

        const query = `UPDATE Companies SET ${setClauses} OUTPUT INSERTED.* WHERE id = @companyId`;
        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Güncellenecek şirket bulunamadı.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Şirket güncelleme hatası:", error);
         if (error.number === 2627) { 
             return res.status(400).json({ message: 'Bu isimde bir şirket zaten mevcut olabilir.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

// @desc    Delete a company
// @route   DELETE /api/admin/companies/:id
// @access  Private/Admin
const deleteCompany = async (req, res) => {
    const companyId = req.params.id;

    if (isNaN(parseInt(companyId))) {
        return res.status(400).json({ message: 'Geçersiz Şirket ID' });
    }

    try {
        const pool = await getPool();
        
        const result = await pool.request()
            .input('companyId', sql.Int, parseInt(companyId))
            .query('DELETE FROM Companies WHERE id = @companyId');

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Şirket başarıyla silindi.', id: parseInt(companyId) });
        } else {
            return res.status(404).json({ message: 'Silinecek şirket bulunamadı.' });
        }
    } catch (error) {
        console.error("Şirket silme hatası (Admin):", error);
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
    getDashboardStats,
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
}; 