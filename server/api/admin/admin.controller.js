const { getPool, sql } = require('../../config/db');

// @desc    Get all users (with optional search, role filter and pagination)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    const { search, role, page = 1, limit = 10 } = req.query; 
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ message: 'Geçersiz sayfa veya limit değeri.' });
    }
    // Geçerli rol filtresi (business eklendi)
    const validRoles = ['admin', 'business', 'user'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: `Geçersiz rol değeri. ${validRoles.join(', ')} olabilir.` });
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        
        // Temel sorgu ve JOIN (GÜNCELLENDİ)
        let baseQuery = `FROM Users u LEFT JOIN Companies c ON u.companyId = c.id`; 
        let whereConditions = []; 

        // Arama koşulu (u.name, u.email)
        if (search) {
            whereConditions.push('(u.name LIKE @searchTerm OR u.email LIKE @searchTerm)');
            request.input('searchTerm', sql.NVarChar, `%${search}%`);
        }
        // Rol filtresi koşulu (u.role)
        if (role) {
             whereConditions.push('u.role = @roleFilter');
             request.input('roleFilter', sql.NVarChar, role);
        }

        let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // 1. Toplam kayıt sayısını al
        const countQuery = `SELECT COUNT(u.id) as totalCount ${baseQuery} ${whereClause}`;
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].totalCount;

        // 2. Mevcut sayfanın verisini al (GÜNCELLENDİ - c.name eklendi)
        const dataQuery = `
            SELECT u.id, u.name, u.email, u.role, u.companyId, u.createdAt, c.name as companyName 
            ${baseQuery} 
            ${whereClause} 
            ORDER BY u.id ASC 
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
        console.error("Tüm kullanıcıları getirme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
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

// @desc    Update user role and assign/unassign company (GÜNCELLENDİ)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    const userIdToUpdate = req.params.id;
    // İstekten yeni rolü ve opsiyonel şirket ID'sini al
    const { role: newRole, companyId: requestedCompanyId } = req.body; 
    const adminUserId = req.user.id; 

    if (parseInt(userIdToUpdate) === adminUserId) {
        return res.status(400).json({ message: 'Yöneticiler kendi rollerini/şirketlerini değiştiremez.' });
    }

    if (isNaN(parseInt(userIdToUpdate))) {
         return res.status(400).json({ message: 'Geçersiz Kullanıcı ID' });
    }

    // Geçerli rol değerlerini kontrol et (business eklendi)
    const validRoles = ['admin', 'business', 'user'];
    if (!newRole || !validRoles.includes(newRole)) {
        return res.status(400).json({ message: `Geçersiz rol değeri. Rol ${validRoles.join(', ')} olmalıdır.` });
    }

    let companyIdToSet = null; // Varsayılan olarak NULL

    try {
        const pool = await getPool();
        
        // Eğer rol 'business' ise, geçerli bir companyId sağlanmalı
        if (newRole === 'business') {
            if (!requestedCompanyId) {
                 return res.status(400).json({ message: 'Business rolü için şirket ID\'si zorunludur.' });
            }
            const companyIdNum = parseInt(requestedCompanyId, 10);
            if (isNaN(companyIdNum)) {
                 return res.status(400).json({ message: 'Geçersiz şirket ID formatı.' });
            }
            
            // Şirketin var olup olmadığını kontrol et
            const companyCheck = await pool.request()
                .input('companyId', sql.Int, companyIdNum)
                .query('SELECT TOP 1 id FROM Companies WHERE id = @companyId');
            
            if (companyCheck.recordset.length === 0) {
                 return res.status(404).json({ message: `Şirket bulunamadı (ID: ${companyIdNum}).` });
            }
            companyIdToSet = companyIdNum; // Şirket geçerliyse atanacak ID'yi ayarla
        }
        
        // Kullanıcının var olup olmadığını kontrol et (zaten vardı, iyi)
        const userCheck = await pool.request()
            .input('userId', sql.Int, parseInt(userIdToUpdate))
            .query('SELECT TOP 1 id FROM Users WHERE id = @userId');
        
        if (userCheck.recordset.length === 0) {
             return res.status(404).json({ message: 'Rolü güncellenecek kullanıcı bulunamadı' });
        }

        // Rolü ve CompanyId'yi güncelle (GÜNCELLENDİ)
        const result = await pool.request()
            .input('userId', sql.Int, parseInt(userIdToUpdate))
            .input('newRole', sql.NVarChar, newRole)
            .input('newCompanyId', sql.Int, companyIdToSet) // NULL veya geçerli ID
            .query('UPDATE Users SET role = @newRole, companyId = @newCompanyId WHERE id = @userId');
        
        // rowsAffected MSSQL'de dizi olarak dönebilir, ilk elemanına bakmak lazım
         if (result.rowsAffected && result.rowsAffected[0] > 0) {
            // Güncellenen kullanıcı bilgisini (sadece ID, rol, companyId) döndür
            res.status(200).json({ 
                message: 'Kullanıcı rolü ve şirket bilgisi başarıyla güncellendi.',
                user: { id: parseInt(userIdToUpdate), role: newRole, companyId: companyIdToSet } 
            });
        } else {
            // Bu durum normalde userCheck ile yakalanmalı ama yine de kontrol edelim
            return res.status(404).json({ message: 'Kullanıcı bulunamadı (güncelleme sırasında).' });
        }

    } catch (error) {
        console.error("Kullanıcı rol/şirket güncelleme hatası (Admin):", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update any user's profile (name, email) by Admin
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateAnyUserProfile = async (req, res) => {
    const userIdToUpdate = req.params.id;
    const { name, email } = req.body; // Sadece isim ve email alınır
    const adminUserId = req.user.id;

    // Adminin kendi profilini buradan güncellemesini engelle (profil sayfası var)
    // Aslında güncelleyebilir ama karışıklık olmasın diye ayıralım.
    if (parseInt(userIdToUpdate) === adminUserId) {
        return res.status(400).json({ message: 'Kendi profilinizi buradan güncelleyemezsiniz.' });
    }

    // ID kontrolü
    if (isNaN(parseInt(userIdToUpdate))) {
        return res.status(400).json({ message: 'Geçersiz Kullanıcı ID' });
    }

    // Gelen veriyi doğrula (boş olamaz)
    if (!name || !email) {
        return res.status(400).json({ message: 'İsim ve e-posta alanları zorunludur.' });
    }

    // E-posta formatı kontrolü (basit)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         return res.status(400).json({ message: 'Geçersiz e-posta formatı.' });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool); // Transaction başlatalım

        await transaction.begin();

        try {
            // 1. E-posta adresinin başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
            const emailCheckRequest = new sql.Request(transaction); // Request'i transaction'a bağla
            emailCheckRequest.input('email', sql.NVarChar, email);
            emailCheckRequest.input('userIdToExclude', sql.Int, parseInt(userIdToUpdate));
            const emailCheckResult = await emailCheckRequest.query(
                'SELECT TOP 1 id FROM Users WHERE email = @email AND id != @userIdToExclude'
            );

            if (emailCheckResult.recordset.length > 0) {
                await transaction.rollback(); // Transaction'ı geri al
                return res.status(400).json({ message: 'Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor.' });
            }

            // 2. Kullanıcı bilgilerini güncelle
            const updateRequest = new sql.Request(transaction);
            updateRequest.input('userId', sql.Int, parseInt(userIdToUpdate));
            updateRequest.input('name', sql.NVarChar, name);
            updateRequest.input('email', sql.NVarChar, email);
            // Sadece isim ve email güncelleniyor
            const updateResult = await updateRequest.query(
                'UPDATE Users SET name = @name, email = @email OUTPUT inserted.id, inserted.name, inserted.email, inserted.role, inserted.createdAt WHERE id = @userId'
            );

            if (updateResult.recordset.length === 0) {
                // Kullanıcı bulunamadıysa (bu normalde olmamalı ama kontrol edelim)
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenecek kullanıcı bulunamadı.' });
            }
            
            await transaction.commit(); // Transaction'ı onayla

            res.status(200).json({
                message: 'Kullanıcı bilgileri başarıyla güncellendi.',
                user: updateResult.recordset[0] // Güncellenmiş kullanıcı bilgisini döndür
            });

        } catch (error) {
            await transaction.rollback(); // İç try-catch bloğunda hata olursa geri al
            console.error("Kullanıcı profil güncelleme (Admin - Transaction) hatası:", error);
            // Özel unique constraint hatası (çok düşük ihtimal)
             if (error.number === 2601 || error.number === 2627) { 
                return res.status(400).json({ message: 'E-posta adresi zaten kullanılıyor (Tekrar kontrol).' });
            }
            res.status(500).json({ message: 'Güncelleme sırasında bir sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kullanıcı profil güncelleme (Admin - Connection/Begin) hatası:", error);
        res.status(500).json({ message: 'Sunucu bağlantı hatası oluştu.' });
    }
};

// @desc    Update any card by Admin
// @route   PUT /api/admin/cards/:id
// @access  Private/Admin
const updateAnyCard = async (req, res) => {
    const cardId = req.params.id;
    const {
        cardName,
        profileImageUrl,
        coverImageUrl,
        name,
        title,
        company,
        bio,
        phone,
        email,
        website,
        address,
        theme,
        customSlug: rawCustomSlug,
        isActive,
        linkedinUrl,
        twitterUrl,
        instagramUrl
    } = req.body;

    if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    // Slug doğrulama ve temizleme (iç içe fonksiyon)
    const validateAndCleanSlug = (slug) => {
        if (!slug) return null;
        let cleanedSlug = slug.toLowerCase().trim();
        cleanedSlug = cleanedSlug.replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
        cleanedSlug = cleanedSlug.replace(/^-+|-+$/g, '');
        if (cleanedSlug.length < 1) return null;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanedSlug)) {
            console.warn('Slug temizleme sonrası beklenmedik format:', cleanedSlug);
            return null;
        }
        return cleanedSlug;
    };
    const newCustomSlug = validateAndCleanSlug(rawCustomSlug);

    if (rawCustomSlug && !newCustomSlug) {
        return res.status(400).json({ message: `Geçersiz özel URL formatı.` });
    }

    try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const currentCardRequest = new sql.Request(transaction);
            currentCardRequest.input('cardId', sql.Int, parseInt(cardId));
            const currentCardResult = await currentCardRequest.query(
                'SELECT TOP 1 customSlug FROM Cards WHERE id = @cardId'
            );

            if (currentCardResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Güncellenecek kartvizit bulunamadı.' });
            }
            const currentCustomSlug = currentCardResult.recordset[0].customSlug;

            if (newCustomSlug && newCustomSlug !== currentCustomSlug) {
                const slugCheckRequest = new sql.Request(transaction);
                slugCheckRequest.input('customSlug', sql.VarChar, newCustomSlug);
                slugCheckRequest.input('cardId', sql.Int, parseInt(cardId));
                const slugCheckResult = await slugCheckRequest.query(
                    'SELECT TOP 1 id FROM Cards WHERE customSlug = @customSlug AND id != @cardId'
                );

                if (slugCheckResult.recordset.length > 0) {
                    await transaction.rollback();
                    return res.status(400).json({ message: `Bu özel URL (${newCustomSlug}) zaten başka bir kartvizit tarafından kullanılıyor.` });
                }
            }

            const updateRequest = new sql.Request(transaction);
            updateRequest.input('cardId', sql.Int, parseInt(cardId));
            updateRequest.input('cardName', sql.NVarChar, cardName);
            updateRequest.input('profileImageUrl', sql.NVarChar, profileImageUrl);
            updateRequest.input('coverImageUrl', sql.NVarChar, coverImageUrl);
            updateRequest.input('name', sql.NVarChar, name);
            updateRequest.input('title', sql.NVarChar, title);
            updateRequest.input('company', sql.NVarChar, company);
            updateRequest.input('bio', sql.NVarChar, bio);
            updateRequest.input('phone', sql.NVarChar, phone);
            updateRequest.input('email', sql.NVarChar, email);
            updateRequest.input('website', sql.NVarChar, website);
            updateRequest.input('address', sql.NVarChar, address);
            updateRequest.input('theme', sql.NVarChar, theme);
            updateRequest.input('customSlug', sql.VarChar, newCustomSlug);
            updateRequest.input('isActive', sql.Bit, isActive);
            updateRequest.input('linkedinUrl', sql.NVarChar, linkedinUrl);
            updateRequest.input('twitterUrl', sql.NVarChar, twitterUrl);
            updateRequest.input('instagramUrl', sql.NVarChar, instagramUrl);

            const updateResult = await updateRequest.query(`
                UPDATE Cards SET
                    cardName = @cardName, profileImageUrl = @profileImageUrl, coverImageUrl = @coverImageUrl,
                    name = @name, title = @title, company = @company, bio = @bio, phone = @phone,
                    email = @email, website = @website, address = @address, theme = @theme,
                    customSlug = @customSlug, isActive = @isActive, linkedinUrl = @linkedinUrl,
                    twitterUrl = @twitterUrl, instagramUrl = @instagramUrl
                OUTPUT inserted.*
                WHERE id = @cardId;
            `);

             if (updateResult.recordset.length === 0) {
                 await transaction.rollback();
                 return res.status(404).json({ message: 'Kartvizit güncellenirken bulunamadı.' });
            }

            await transaction.commit();

            // Liste güncellemesi için kullanıcı bilgilerini de içeren tam kart verisini çek
            const finalResultRequest = new sql.Request(pool); // Yeni request, transaction bitti
            finalResultRequest.input('cardId', sql.Int, updateResult.recordset[0].id);
            const finalResult = await finalResultRequest.query(`
                SELECT c.*, u.name as userName, u.email as userEmail 
                FROM Cards c 
                JOIN Users u ON c.userId = u.id 
                WHERE c.id = @cardId
            `);

             if (finalResult.recordset.length === 0) {
                 // Bu olmamalı ama hata durumunda sadece güncellenen ham veriyi döndür
                 console.warn("Admin güncelleme sonrası tam kart verisi çekilemedi, ID:", updateResult.recordset[0].id);
                 return res.status(200).json({
                    message: 'Kartvizit başarıyla güncellendi (ancak tam veri çekilemedi).'
                 });
            }

            res.status(200).json({
                message: 'Kartvizit başarıyla güncellendi.',
                card: finalResult.recordset[0] 
            });

        } catch (error) {
            await transaction.rollback();
            console.error("Kartvizit güncelleme (Admin - Transaction) hatası:", error);
            if (error.number === 2601 || error.number === 2627) {
                return res.status(400).json({ message: `Özel URL (${newCustomSlug || rawCustomSlug}) zaten kullanılıyor (Tekrar kontrol).` });
            }
            res.status(500).json({ message: 'Güncelleme sırasında bir sunucu hatası oluştu.' });
        }

    } catch (error) {
        console.error("Kartvizit güncelleme (Admin - Connection/Begin) hatası:", error);
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
    updateUserRole,
    updateAnyUserProfile,
    updateAnyCard,
    getDashboardStats,
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
}; 