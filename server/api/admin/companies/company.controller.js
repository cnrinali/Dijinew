const { getPool, sql } = require('../../../config/db'); // Path'i kontrol et

// @desc    Create a new company
// @route   POST /api/admin/companies
// @access  Private/Admin
const createCompany = async (req, res) => {
    console.log("createCompany controller çağrıldı", req.body);
    const { name, userLimit, cardLimit } = req.body;

    if (!name || userLimit == null || cardLimit == null) {
        return res.status(400).json({ message: 'Şirket adı, kullanıcı limiti ve kart limiti zorunludur.' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('userLimit', sql.Int, userLimit)
            .input('cardLimit', sql.Int, cardLimit)
            .query('INSERT INTO Companies (name, userLimit, cardLimit) OUTPUT INSERTED.* VALUES (@name, @userLimit, @cardLimit)');
        
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error("Şirket oluşturma hatası:", error);
        if (error.number === 2627) { // Unique constraint violation (varsa)
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
        // TODO: Sayfalama (pagination) eklenebilir
        const result = await pool.request().query('SELECT id, name, userLimit, cardLimit, createdAt FROM Companies ORDER BY createdAt DESC');
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
            .query('SELECT id, name, userLimit, cardLimit, createdAt FROM Companies WHERE id = @companyId');

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
    const { name, userLimit, cardLimit } = req.body;
    console.log(`updateCompany controller çağrıldı, ID: ${companyId}`, req.body);

     if (!name || userLimit == null || cardLimit == null) {
        return res.status(400).json({ message: 'Şirket adı, kullanıcı limiti ve kart limiti zorunludur.' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('companyId', sql.Int, companyId)
            .input('name', sql.NVarChar, name)
            .input('userLimit', sql.Int, userLimit)
            .input('cardLimit', sql.Int, cardLimit)
            .query('UPDATE Companies SET name = @name, userLimit = @userLimit, cardLimit = @cardLimit OUTPUT INSERTED.* WHERE id = @companyId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Güncellenecek şirket bulunamadı.' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Şirket güncelleme hatası:", error);
         if (error.number === 2627) { // Unique constraint violation
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