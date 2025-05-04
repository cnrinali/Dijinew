const { getPool, sql } = require('../../config/db');

// Yardımcı Fonksiyon: Slug'ı doğrular ve temizler
const validateAndCleanSlug = (slug) => {
    if (!slug) return null; // Slug boşsa null dön

    // Küçük harfe çevir, baştaki/sondaki boşlukları kaldır
    let cleanedSlug = slug.toLowerCase().trim();

    // İzin verilmeyen karakterleri kaldır (sadece harf, rakam ve tireye izin ver)
    // Birden fazla tireyi tek tireye indir
    cleanedSlug = cleanedSlug.replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');

    // Baştaki ve sondaki tireleri kaldır
    cleanedSlug = cleanedSlug.replace(/^-+|-+$/g, '');

    // Çok kısaysa (örn. sadece tirelerden oluşuyorsa) veya hala geçersizse null dön
    if (cleanedSlug.length < 1) return null;
    // Basit bir regex kontrolü (isteğe bağlı, yukarıdaki temizleme yeterli olabilir)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanedSlug)) {
        // Bu durumun oluşması zor ama ek kontrol
        console.warn('Slug temizleme sonrası beklenmedik format:', cleanedSlug);
        return null;
    }

    return cleanedSlug;
};

// @desc    Get all cards for the logged-in user
// @route   GET /api/cards
// @access  Private
const getCards = async (req, res) => {
    const userId = req.user.id;

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, userId) // Users.id INT ise
            // VEYA .input('userId', sql.UniqueIdentifier, userId) // Users.id UUID ise
            .query('SELECT * FROM Cards WHERE userId = @userId ORDER BY createdAt DESC'); // En yeniden eskiye sırala
        
        res.status(200).json(result.recordset); // Kullanıcının kartlarını dizi olarak dön

    } catch (error) {
        console.error("Kartvizitleri getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Create a new card
// @route   POST /api/cards
// @access  Private
const createCard = async (req, res) => {
    const userId = req.user.id;
    const {
        cardName = 'Kartvizitim',
        profileImageUrl = null,
        coverImageUrl = null,
        name = null,
        title = null,
        company = null,
        bio = null,
        phone = null,
        email = null,
        website = null,
        address = null,
        theme = null,
        customSlug: rawCustomSlug, // Ham slug'ı al
        // Yeni sosyal medya alanları
        linkedinUrl = null,
        twitterUrl = null,
        instagramUrl = null
    } = req.body;

    const customSlug = validateAndCleanSlug(rawCustomSlug); // Slug'ı doğrula ve temizle

    try {
        const pool = await getPool();

        // 1. customSlug gönderildiyse ve geçerliyse, benzersizliğini kontrol et
        if (customSlug) {
            const slugCheck = await pool.request()
                .input('customSlug', sql.VarChar, customSlug)
                .query('SELECT TOP 1 id FROM Cards WHERE customSlug = @customSlug');
            
            if (slugCheck.recordset.length > 0) {
                return res.status(400).json({ message: `Bu özel URL (${customSlug}) zaten kullanımda.` });
            }
        } else if (rawCustomSlug) {
            // Ham slug gönderildi ama geçerli değilse
            return res.status(400).json({ message: `Geçersiz özel URL formatı. Sadece harf, rakam ve tire kullanın.` });
        }

        // 2. Kartı oluştur
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('cardName', sql.NVarChar, cardName)
            .input('profileImageUrl', sql.NVarChar, profileImageUrl)
            .input('coverImageUrl', sql.NVarChar, coverImageUrl)
            .input('name', sql.NVarChar, name)
            .input('title', sql.NVarChar, title)
            .input('company', sql.NVarChar, company)
            .input('bio', sql.NVarChar, bio)
            .input('phone', sql.NVarChar, phone)
            .input('email', sql.NVarChar, email)
            .input('website', sql.NVarChar, website)
            .input('address', sql.NVarChar, address)
            .input('theme', sql.NVarChar, theme)
            .input('customSlug', sql.VarChar, customSlug)
            // Yeni sosyal medya inputları
            .input('linkedinUrl', sql.NVarChar, linkedinUrl)
            .input('twitterUrl', sql.NVarChar, twitterUrl)
            .input('instagramUrl', sql.NVarChar, instagramUrl)
            .query(`
                INSERT INTO Cards 
                (userId, cardName, profileImageUrl, coverImageUrl, name, title, company, bio, phone, email, website, address, theme, customSlug, isActive, linkedinUrl, twitterUrl, instagramUrl)
                OUTPUT inserted.* 
                VALUES 
                (@userId, @cardName, @profileImageUrl, @coverImageUrl, @name, @title, @company, @bio, @phone, @email, @website, @address, @theme, @customSlug, 1, @linkedinUrl, @twitterUrl, @instagramUrl);
            `);
            // NOT: Alan listesini ve VALUES listesini tekrar kontrol edin.

        if (result.recordset && result.recordset.length > 0) {
            res.status(201).json(result.recordset[0]);
        } else {
            throw new Error('Kartvizit oluşturulamadı.');
        }

    } catch (error) {
        console.error("Kartvizit oluşturma hatası:", error);
         // Unique constraint hatası hala yakalanabilir (race condition nadir de olsa mümkün)
         if (error.number === 2601 || error.number === 2627) {
             // Hangi alanın unique olduğunu belirtmek daha iyi olabilir ama şimdilik slug varsayalım
             return res.status(400).json({ message: `Özel URL (${customSlug || rawCustomSlug}) zaten kullanımda.` });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get a single card by ID
// @route   GET /api/cards/:id
// @access  Private 
const getCardById = async (req, res) => {
    const userId = req.user.id;
    const cardId = req.params.id;

    // ID'nin geçerli bir sayı olup olmadığını kontrol et (eğer ID INT ise)
    if (isNaN(parseInt(cardId))) {
         return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId)) // INT ise parseInt gerekli
            .input('userId', sql.Int, userId)
            // VEYA .input('cardId', sql.UniqueIdentifier, cardId) // UUID ise
            // VEYA .input('userId', sql.UniqueIdentifier, userId) // UUID ise
            .query('SELECT TOP 1 * FROM Cards WHERE id = @cardId AND userId = @userId');

        if (result.recordset.length === 0) {
            // Kart bulunamadı veya kullanıcıya ait değil
            return res.status(404).json({ message: 'Kartvizit bulunamadı' });
        }

        res.status(200).json(result.recordset[0]); // Bulunan kartviziti dön

    } catch (error) {
        console.error("Kartvizit getirme hatası (ID):". error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private
const updateCard = async (req, res) => {
    console.log('[updateCard] İstek gövdesi (req.body):', req.body); // Log eklendi
    const userId = req.user.id;
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
        customSlug: rawCustomSlug, // Ham slug'ı al
        isActive,
        // Yeni sosyal medya alanları
        linkedinUrl,
        twitterUrl,
        instagramUrl
    } = req.body;

    if (isNaN(parseInt(cardId))) {
         return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    const newCustomSlug = validateAndCleanSlug(rawCustomSlug); // Yeni slug'ı doğrula ve temizle
    
    // Raw slug varsa ama temizlenmiş slug null ise geçersiz format hatası ver
    if (rawCustomSlug && !newCustomSlug) {
        return res.status(400).json({ message: `Geçersiz özel URL formatı. Sadece harf, rakam ve tire kullanın.` });
    }

    try {
        const pool = await getPool();

        // 1. Kartın mevcut bilgilerini (özellikle customSlug) çek ve sahipliği doğrula
        const currentCardResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id, customSlug FROM Cards WHERE id = @cardId AND userId = @userId');
        
        if (currentCardResult.recordset.length === 0) {
             return res.status(404).json({ message: 'Güncellenecek kartvizit bulunamadı veya size ait değil' });
        }

        const currentCustomSlug = currentCardResult.recordset[0].customSlug;

        // 2. customSlug değiştiriliyorsa ve yeni slug boş değilse, benzersizliğini kontrol et
        if (newCustomSlug && newCustomSlug !== currentCustomSlug) {
             const slugCheck = await pool.request()
                .input('customSlug', sql.VarChar, newCustomSlug)
                .input('cardId', sql.Int, parseInt(cardId))
                .query('SELECT TOP 1 id FROM Cards WHERE customSlug = @customSlug AND id != @cardId'); // Başka bir kartta var mı?
            
            if (slugCheck.recordset.length > 0) {
                return res.status(400).json({ message: `Bu özel URL (${newCustomSlug}) zaten başka bir kartvizit tarafından kullanılıyor.` });
            }
        } else if (!newCustomSlug && rawCustomSlug) {
             // Kullanıcı geçersiz bir slug göndermiş, yukarıda yakalanmalıydı ama tekrar kontrol
             return res.status(400).json({ message: `Geçersiz özel URL formatı.` });
        }

        // 3. Güncelleme sorgusunu çalıştır
        const updateResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('cardName', sql.NVarChar, cardName)
            .input('profileImageUrl', sql.NVarChar, profileImageUrl)
            .input('coverImageUrl', sql.NVarChar, coverImageUrl)
            .input('name', sql.NVarChar, name)
            .input('title', sql.NVarChar, title)
            .input('company', sql.NVarChar, company)
            .input('bio', sql.NVarChar, bio)
            .input('phone', sql.NVarChar, phone)
            .input('email', sql.NVarChar, email)
            .input('website', sql.NVarChar, website)
            .input('address', sql.NVarChar, address)
            .input('theme', sql.NVarChar, theme)
            .input('customSlug', sql.VarChar, newCustomSlug) // Temizlenmiş veya null slug
            .input('isActive', sql.Bit, isActive)
            // Yeni sosyal medya inputları
            .input('linkedinUrl', sql.NVarChar, linkedinUrl)
            .input('twitterUrl', sql.NVarChar, twitterUrl)
            .input('instagramUrl', sql.NVarChar, instagramUrl)
            .query(`
                UPDATE Cards SET 
                    cardName = @cardName,
                    profileImageUrl = @profileImageUrl,
                    coverImageUrl = @coverImageUrl,
                    name = @name,
                    title = @title,
                    company = @company,
                    bio = @bio,
                    phone = @phone,
                    email = @email,
                    website = @website,
                    address = @address,
                    theme = @theme,
                    customSlug = @customSlug,
                    isActive = @isActive,
                    linkedinUrl = @linkedinUrl,
                    twitterUrl = @twitterUrl,
                    instagramUrl = @instagramUrl
                OUTPUT inserted.* 
                WHERE id = @cardId;
            `);
            // NOT: SET listesini kontrol edin.

         if (updateResult.recordset && updateResult.recordset.length > 0) {
            res.status(200).json(updateResult.recordset[0]); 
        } else {
            throw new Error('Kartvizit güncellenemedi.');
        }

    } catch (error) {
        console.error("Kartvizit güncelleme hatası:", error);
         // Unique constraint hatası (yarış durumu veya slug değişmese de başka yerde varsa)
         if (error.number === 2601 || error.number === 2627) { 
             return res.status(400).json({ message: `Özel URL (${newCustomSlug || rawCustomSlug}) zaten başka bir kartvizit tarafından kullanılıyor.` });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
const deleteCard = async (req, res) => {
    const userId = req.user.id;
    const cardId = req.params.id;

    if (isNaN(parseInt(cardId))) {
         return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();

        // 1. Kartın varlığını ve kullanıcıya ait olup olmadığını kontrol et
        //    DELETE sorgusu direkt olarak WHERE ile iki koşulu da kontrol edebilir,
        //    ama ayrı kontrol etmek isteğe bağlı olarak daha bilgilendirici hata mesajı sağlar.
        const checkResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id FROM Cards WHERE id = @cardId AND userId = @userId');
        
        if (checkResult.recordset.length === 0) {
             return res.status(404).json({ message: 'Silinecek kartvizit bulunamadı veya size ait değil' });
        }

        // 2. Silme işlemini yap
        const deleteResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            // userId kontrolünü WHERE içinde tekrar yapmaya gerek yok, yukarıda yaptık.
            // Ancak güvenlik katmanı olarak eklenebilir: .input('userId', sql.Int, userId)
            .query('DELETE FROM Cards WHERE id = @cardId'); // AND userId = @userId

        // rowsAffected kontrolü, silme işleminin başarılı olup olmadığını teyit eder.
        if (deleteResult.rowsAffected && deleteResult.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Kartvizit başarıyla silindi', id: cardId });
        } else {
            // Bu duruma normalde gelinmemeli (yukarıda kontrol edildi)
             return res.status(404).json({ message: 'Silinecek kartvizit bulunamadı (tekrar kontrol)' });
        }

    } catch (error) {
        // Foreign key hatası gibi durumlar olabilir, ama Users için ON DELETE CASCADE ayarlı
        console.error("Kartvizit silme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get a public card by ID or customSlug
// @route   GET /api/cards/public/:slugOrId
// @access  Public
const getPublicCard = async (req, res) => {
    const slugOrId = req.params.slugOrId;
    let query = '';
    let inputName = '';
    let inputType;
    let inputValue;

    // Gelen parametrenin sayı (ID) mı yoksa string (slug) mı olduğunu kontrol et
    if (!isNaN(parseInt(slugOrId))) {
        // Sayı ise ID'ye göre ara
        query = 'SELECT TOP 1 * FROM Cards WHERE id = @idValue AND isActive = 1';
        inputName = 'idValue';
        inputType = sql.Int;
        inputValue = parseInt(slugOrId);
    } else {
        // Sayı değilse customSlug'a göre ara
        const cleanedSlug = validateAndCleanSlug(slugOrId); // Gelen slug'ı temizle
        if (!cleanedSlug) {
             return res.status(400).json({ message: 'Geçersiz kartvizit URL formatı.' });
        }
        query = 'SELECT TOP 1 * FROM Cards WHERE customSlug = @slugValue AND isActive = 1';
        inputName = 'slugValue';
        inputType = sql.VarChar;
        inputValue = cleanedSlug;
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input(inputName, inputType, inputValue)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Aktif kartvizit bulunamadı' });
        }

        res.status(200).json(result.recordset[0]);

    } catch (error) {
        console.error("Herkese açık kartvizit getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Toggle card active status
// @route   PATCH /api/cards/:id/status
// @access  Private
const toggleCardStatus = async (req, res) => {
    const userId = req.user.id;
    const cardId = req.params.id;
    const { isActive } = req.body; // Yeni durumu body'den al (true/false)

    // ID'nin geçerli bir sayı olup olmadığını kontrol et
    if (isNaN(parseInt(cardId))) {
         return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    // isActive değerinin boolean olup olmadığını kontrol et
    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Geçersiz aktiflik durumu. True veya false olmalı.' });
    }

    try {
        const pool = await getPool();

        // Kartın kullanıcıya ait olup olmadığını kontrol et ve güncelle
        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .input('isActive', sql.Bit, isActive) // SQL Server'da boolean için BIT kullanılır
            .query(`
                UPDATE Cards 
                SET isActive = @isActive 
                OUTPUT inserted.id, inserted.isActive 
                WHERE id = @cardId AND userId = @userId;
            `);

        if (result.recordset.length === 0) {
            // Güncelleme yapılamadı (kart bulunamadı veya kullanıcıya ait değil)
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya bu işlem için yetkiniz yok' });
        }

        res.status(200).json({
            message: `Kartvizit başarıyla ${isActive ? 'aktif' : 'pasif'} hale getirildi.`,
            card: result.recordset[0]
        });

    } catch (error) {
        console.error("Kart durumu değiştirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

module.exports = {
    getCards,
    createCard,
    getCardById,
    updateCard,
    deleteCard,
    getPublicCard,
    toggleCardStatus
}; 