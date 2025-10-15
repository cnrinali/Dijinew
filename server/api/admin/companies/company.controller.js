const { getPool, sql } = require('../../../config/db'); // Path'i kontrol et

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
        const insertResult = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('userLimit', sql.Int, userLimit)
            .input('cardLimit', sql.Int, cardLimit)
            .input('status', sql.Bit, companyStatus)
            .input('phone', sql.NVarChar, phone || null) // Boşsa NULL gönder
            .input('website', sql.NVarChar, website || null)
            .input('address', sql.NVarChar, address || null)
            // updatedAt eklendi
            .query('INSERT INTO Companies (name, userLimit, cardLimit, status, phone, website, address, updatedAt) VALUES (@name, @userLimit, @cardLimit, @status, @phone, @website, @address, GETDATE()); SELECT SCOPE_IDENTITY() as id;');
        
        const newId = insertResult.recordset[0].id;
        
        // Yeni oluşturulan şirketi getir
        const selectResult = await pool.request()
            .input('id', sql.Int, newId)
            .query('SELECT * FROM Companies WHERE id = @id');
        
        res.status(201).json(selectResult.recordset[0]);
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

        const query = `UPDATE Companies SET ${setClauses} WHERE id = @companyId`;
        const updateResult = await request.query(query);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Güncellenecek şirket bulunamadı.' });
        }

        // Güncellenen şirketi getir
        const selectRequest = pool.request().input('companyId', sql.Int, companyId);
        const selectResult = await selectRequest.query('SELECT * FROM Companies WHERE id = @companyId');
        
        res.status(200).json(selectResult.recordset[0]);
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
    console.log(`deleteCompany controller çağrıldı, ID: ${companyId}`);
    
    // TODO: Şirket silinmeden önce ilişkili kullanıcılar ve kartlar ne olacak? 
    // Belki silmek yerine pasif hale getirmek (isActive=0) daha iyi olabilir.
    // Şimdilik doğrudan silelim.
    
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('companyId', sql.Int, companyId)
            .query('DELETE FROM Companies WHERE id = @companyId');
            
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Silinecek şirket bulunamadı.' });
        }

        res.status(200).json({ message: 'Şirket başarıyla silindi.', id: companyId });

    } catch (error) {
         // Foreign key constraint hatası olabilir (eğer ilişkili user/card varsa)
        console.error("Şirket silme hatası:", error);
        if (error.number === 547) { // Foreign key violation
             return res.status(400).json({ message: 'Şirket silinemedi. İlişkili kullanıcılar veya kartvizitler olabilir.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
};

module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
}; 