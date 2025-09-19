const { getPool, sql } = require('../../config/db');
const ActivityLogger = require('../../middleware/activityLogger');

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
        
        // Status kolonunu isActive olarak map et
        const cardsWithMappedStatus = result.recordset.map(card => ({
            ...card,
            isActive: card.status === 1 || card.status === '1' || card.status === true
        }));
        
        res.status(200).json(cardsWithMappedStatus); // Kullanıcının kartlarını dizi olarak dön

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
        instagramUrl = null,
        // Pazaryeri alanları
        trendyolUrl = null,
        hepsiburadaUrl = null,
        ciceksepeti = null,
        sahibindenUrl = null,
        hepsiemlakUrl = null,
        gittigidiyorUrl = null,
        n11Url = null,
        amazonTrUrl = null,
        getirUrl = null,
        yemeksepetiUrl = null,
        // Kurumsal kullanıcı için seçilen kullanıcı ID'si
        userId: selectedUserId = null
    } = req.body;

    const customSlug = validateAndCleanSlug(rawCustomSlug); // Slug'ı doğrula ve temizle

    try {
        const pool = await getPool();

        // Bireysel kullanıcılar için kart sayısı kontrolü
        if (req.user.role === 'user') {
            const cardCountResult = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT COUNT(*) as cardCount FROM Cards WHERE userId = @userId');
            
            if (cardCountResult.recordset[0].cardCount > 0) {
                return res.status(400).json({ message: 'Bireysel kullanıcılar sadece bir kartvizit oluşturabilir.' });
            }
        }

        // Kurumsal kullanıcı için özel işlemler
        let finalUserId = userId;
        let finalCompany = company;
        
        if (req.user.role === 'corporate') {
            // Şirket bilgisini otomatik doldur
            if (req.user.companyName) {
                finalCompany = req.user.companyName;
            }
            
            // Eğer belirli bir kullanıcı seçildiyse, o kullanıcının şirkete ait olduğunu kontrol et
            if (selectedUserId) {
                const userCheck = await pool.request()
                    .input('selectedUserId', sql.Int, selectedUserId)
                    .input('companyId', sql.Int, req.user.companyId)
                    .query('SELECT TOP 1 id, name, email, phone FROM Users WHERE id = @selectedUserId AND companyId = @companyId');
                
                if (userCheck.recordset.length === 0) {
                    return res.status(400).json({ message: 'Seçilen kullanıcı şirketinize ait değil.' });
                }
                
                finalUserId = selectedUserId;
            }
        }

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
        const insertResult = await pool.request()
            .input('userId', sql.Int, finalUserId)
            .input('cardName', sql.NVarChar, cardName)
            .input('profileImageUrl', sql.NVarChar, profileImageUrl)
            .input('coverImageUrl', sql.NVarChar, coverImageUrl)
            .input('name', sql.NVarChar, name)
            .input('title', sql.NVarChar, title)
            .input('company', sql.NVarChar, finalCompany)
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
            // Pazaryeri inputları
            .input('trendyolUrl', sql.NVarChar, trendyolUrl)
            .input('hepsiburadaUrl', sql.NVarChar, hepsiburadaUrl)
            .input('ciceksepeti', sql.NVarChar, ciceksepeti)
            .input('sahibindenUrl', sql.NVarChar, sahibindenUrl)
            .input('hepsiemlakUrl', sql.NVarChar, hepsiemlakUrl)
            .input('gittigidiyorUrl', sql.NVarChar, gittigidiyorUrl)
            .input('n11Url', sql.NVarChar, n11Url)
            .input('amazonTrUrl', sql.NVarChar, amazonTrUrl)
            .input('getirUrl', sql.NVarChar, getirUrl)
            .input('yemeksepetiUrl', sql.NVarChar, yemeksepetiUrl)
            .query(`
                INSERT INTO Cards 
                (userId, cardName, profileImageUrl, coverImageUrl, name, title, company, bio, phone, email, website, address, theme, customSlug, isActive, linkedinUrl, twitterUrl, instagramUrl, trendyolUrl, hepsiburadaUrl, ciceksepeti, sahibindenUrl, hepsiemlakUrl, gittigidiyorUrl, n11Url, amazonTrUrl, getirUrl, yemeksepetiUrl)
                VALUES 
                (@userId, @cardName, @profileImageUrl, @coverImageUrl, @name, @title, @company, @bio, @phone, @email, @website, @address, @theme, @customSlug, 1, @linkedinUrl, @twitterUrl, @instagramUrl, @trendyolUrl, @hepsiburadaUrl, @ciceksepeti, @sahibindenUrl, @hepsiemlakUrl, @gittigidiyorUrl, @n11Url, @amazonTrUrl, @getirUrl, @yemeksepetiUrl);
            `);

        // 3. Son eklenen kartı al
        const selectResult = await pool.request()
            .input('userId', sql.Int, finalUserId)
            .query('SELECT TOP 1 * FROM Cards WHERE userId = @userId ORDER BY id DESC');

        if (selectResult.recordset && selectResult.recordset.length > 0) {
            const newCard = selectResult.recordset[0];
            
            // Activity log
            await ActivityLogger.logCardAction(
                req.user.id,
                req.user.role,
                req.user.companyId || null,
                ActivityLogger.ACTIONS.CARD_CREATED,
                newCard.id,
                newCard.cardName,
                `Yeni kartvizit oluşturuldu: ${newCard.cardName}`,
                req,
                { cardId: newCard.id, selectedUserId: selectedUserId }
            );
            
            res.status(201).json({
                success: true,
                message: 'Kartvizit başarıyla oluşturuldu',
                data: {
                    card: newCard
                }
            });
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
        instagramUrl,
        // Pazaryeri alanları
        trendyolUrl,
        hepsiburadaUrl,
        ciceksepeti,
        sahibindenUrl,
        hepsiemlakUrl,
        gittigidiyorUrl,
        n11Url,
        amazonTrUrl,
        getirUrl,
        yemeksepetiUrl
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
            // Pazaryeri inputları
            .input('trendyolUrl', sql.NVarChar, trendyolUrl)
            .input('hepsiburadaUrl', sql.NVarChar, hepsiburadaUrl)
            .input('ciceksepeti', sql.NVarChar, ciceksepeti)
            .input('sahibindenUrl', sql.NVarChar, sahibindenUrl)
            .input('hepsiemlakUrl', sql.NVarChar, hepsiemlakUrl)
            .input('gittigidiyorUrl', sql.NVarChar, gittigidiyorUrl)
            .input('n11Url', sql.NVarChar, n11Url)
            .input('amazonTrUrl', sql.NVarChar, amazonTrUrl)
            .input('getirUrl', sql.NVarChar, getirUrl)
            .input('yemeksepetiUrl', sql.NVarChar, yemeksepetiUrl)
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
                    instagramUrl = @instagramUrl,
                    trendyolUrl = @trendyolUrl,
                    hepsiburadaUrl = @hepsiburadaUrl,
                    ciceksepeti = @ciceksepeti,
                    sahibindenUrl = @sahibindenUrl,
                    hepsiemlakUrl = @hepsiemlakUrl,
                    gittigidiyorUrl = @gittigidiyorUrl,
                    n11Url = @n11Url,
                    amazonTrUrl = @amazonTrUrl,
                    getirUrl = @getirUrl,
                    yemeksepetiUrl = @yemeksepetiUrl
                WHERE id = @cardId;
            `);

        // 4. Güncellenmiş kartı ayrı bir sorgu ile çek
        const selectResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .query('SELECT * FROM Cards WHERE id = @cardId');

        if (selectResult.recordset && selectResult.recordset.length > 0) {
            const updatedCard = selectResult.recordset[0];
            
            // Activity log
            await ActivityLogger.logCardAction(
                req.user.id,
                req.user.role,
                req.user.companyId || null,
                ActivityLogger.ACTIONS.CARD_UPDATED,
                updatedCard.id,
                updatedCard.cardName,
                `Kartvizit güncellendi: ${updatedCard.cardName}`,
                req,
                { cardId: updatedCard.id }
            );
            
            res.status(200).json(updatedCard); 
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
            .query('SELECT TOP 1 id, cardName FROM Cards WHERE id = @cardId AND userId = @userId');
        
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
            const deletedCard = checkResult.recordset[0];
            
            // Activity log
            await ActivityLogger.logCardAction(
                req.user.id,
                req.user.role,
                req.user.companyId || null,
                ActivityLogger.ACTIONS.CARD_DELETED,
                deletedCard.id,
                deletedCard.cardName,
                `Kartvizit silindi: ${deletedCard.cardName}`,
                req,
                { cardId: deletedCard.id }
            );
            
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

        const card = result.recordset[0];

        // Kartın banka hesap bilgilerini de çek
        const bankAccountsResult = await pool.request()
            .input('cardId', sql.Int, card.id)
            .query('SELECT * FROM CardBankAccounts WHERE cardId = @cardId ORDER BY createdAt ASC');

        // Kartın sonucuna banka hesaplarını ekle
        card.bankAccounts = bankAccountsResult.recordset;

        res.status(200).json(card);

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
        const updateResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .input('status', sql.Bit, isActive) // SQL Server'da boolean için BIT kullanılır
            .query(`
                UPDATE Cards 
                SET status = @status 
                WHERE id = @cardId AND userId = @userId;
            `);

        if (updateResult.rowsAffected[0] === 0) {
            // Güncelleme yapılamadı (kart bulunamadı veya kullanıcıya ait değil)
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya bu işlem için yetkiniz yok' });
        }

        // Güncellenmiş kartı al
        const selectResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .query('SELECT id, status FROM Cards WHERE id = @cardId');

        const cardWithMappedStatus = {
            ...selectResult.recordset[0],
            isActive: selectResult.recordset[0].status === 1 || selectResult.recordset[0].status === '1' || selectResult.recordset[0].status === true
        };

        res.status(200).json({
            message: `Kartvizit başarıyla ${isActive ? 'aktif' : 'pasif'} hale getirildi.`,
            card: cardWithMappedStatus
        });

    } catch (error) {
        console.error("Kart durumu değiştirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Get card bank accounts
// @route   GET /api/cards/:cardId/bank-accounts
// @access  Private
const getCardBankAccounts = async (req, res) => {
    const userId = req.user.id;
    const cardId = req.params.cardId;

    if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    try {
        const pool = await getPool();

        // Önce kartın kullanıcıya ait olup olmadığını kontrol et
        const cardCheck = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id FROM Cards WHERE id = @cardId AND userId = @userId');

        if (cardCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya size ait değil' });
        }

        // Kartın banka hesaplarını getir
        const result = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .query('SELECT * FROM CardBankAccounts WHERE cardId = @cardId ORDER BY createdAt DESC');

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Kart banka hesapları getirme hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Add card bank account
// @route   POST /api/cards/:cardId/bank-accounts
// @access  Private
const addCardBankAccount = async (req, res) => {
    const userId = req.user.id;
    const cardId = req.params.cardId;
    const { bankName, iban, accountName } = req.body;

    if (isNaN(parseInt(cardId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    // Gelen veriyi doğrula
    if (!bankName || !iban || !accountName) {
        return res.status(400).json({ message: 'Banka adı, IBAN ve hesap sahibi adı zorunludur.' });
    }

    // IBAN formatını kontrol et
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    if (!cleanIban.match(/^TR\d{24}$/)) {
        return res.status(400).json({ message: 'Geçersiz IBAN formatı. IBAN TR ile başlamalı ve 26 karakter olmalıdır.' });
    }

    try {
        const pool = await getPool();

        // Önce kartın kullanıcıya ait olup olmadığını kontrol et
        const cardCheck = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id FROM Cards WHERE id = @cardId AND userId = @userId');

        if (cardCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya size ait değil' });
        }

        // Aynı IBAN'ın kart için zaten eklenmiş olup olmadığını kontrol et
        const existingAccount = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('iban', sql.NVarChar, cleanIban)
            .query('SELECT TOP 1 id FROM CardBankAccounts WHERE cardId = @cardId AND iban = @iban');

        if (existingAccount.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu IBAN numarası bu kartta zaten eklenmiş.' });
        }

        // Yeni banka hesabını ekle
        const insertResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('bankName', sql.NVarChar, bankName)
            .input('iban', sql.NVarChar, cleanIban)
            .input('accountName', sql.NVarChar, accountName)
            .query(`
                INSERT INTO CardBankAccounts (cardId, bankName, iban, accountName)
                OUTPUT inserted.*
                VALUES (@cardId, @bankName, @iban, @accountName)
            `);

        res.status(201).json(insertResult.recordset[0]);

    } catch (error) {
        console.error("Kart banka hesabı ekleme hatası:", error);
        if (error.number === 2601 || error.number === 2627) { // Unique constraint
            return res.status(400).json({ message: 'Bu IBAN numarası bu kartta zaten eklenmiş.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Update card bank account
// @route   PUT /api/cards/:cardId/bank-accounts/:accountId
// @access  Private
const updateCardBankAccount = async (req, res) => {
    const userId = req.user.id;
    const cardId = req.params.cardId;
    const accountId = req.params.accountId;
    const { bankName, iban, accountName } = req.body;

    if (isNaN(parseInt(cardId)) || isNaN(parseInt(accountId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID veya Hesap ID' });
    }

    // Gelen veriyi doğrula
    if (!bankName || !iban || !accountName) {
        return res.status(400).json({ message: 'Banka adı, IBAN ve hesap sahibi adı zorunludur.' });
    }

    // IBAN formatını kontrol et
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    if (!cleanIban.match(/^TR\d{24}$/)) {
        return res.status(400).json({ message: 'Geçersiz IBAN formatı. IBAN TR ile başlamalı ve 26 karakter olmalıdır.' });
    }

    try {
        const pool = await getPool();

        // Önce kartın kullanıcıya ait olup olmadığını kontrol et
        const cardCheck = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id FROM Cards WHERE id = @cardId AND userId = @userId');

        if (cardCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya size ait değil' });
        }

        // Aynı IBAN'ın kart için başka bir hesapta eklenmiş olup olmadığını kontrol et
        const existingAccount = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('iban', sql.NVarChar, cleanIban)
            .input('accountId', sql.Int, parseInt(accountId))
            .query('SELECT TOP 1 id FROM CardBankAccounts WHERE cardId = @cardId AND iban = @iban AND id != @accountId');

        if (existingAccount.recordset.length > 0) {
            return res.status(400).json({ message: 'Bu IBAN numarası bu kartta başka bir hesapta kayıtlı.' });
        }

        // Banka hesabını güncelle
        const updateResult = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('accountId', sql.Int, parseInt(accountId))
            .input('bankName', sql.NVarChar, bankName)
            .input('iban', sql.NVarChar, cleanIban)
            .input('accountName', sql.NVarChar, accountName)
            .query(`
                UPDATE CardBankAccounts 
                SET bankName = @bankName, iban = @iban, accountName = @accountName, updatedAt = GETDATE()
                OUTPUT inserted.*
                WHERE id = @accountId AND cardId = @cardId
            `);

        if (updateResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Güncellenecek banka hesabı bulunamadı.' });
        }

        res.status(200).json(updateResult.recordset[0]);

    } catch (error) {
        console.error("Kart banka hesabı güncelleme hatası:", error);
        if (error.number === 2601 || error.number === 2627) { // Unique constraint
            return res.status(400).json({ message: 'Bu IBAN numarası bu kartta zaten kullanılıyor.' });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
};

// @desc    Delete card bank account
// @route   DELETE /api/cards/:cardId/bank-accounts/:accountId
// @access  Private
const deleteCardBankAccount = async (req, res) => {
    const userId = req.user.id;
    const cardId = req.params.cardId;
    const accountId = req.params.accountId;

    if (isNaN(parseInt(cardId)) || isNaN(parseInt(accountId))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID veya Hesap ID' });
    }

    try {
        const pool = await getPool();

        // Önce kartın kullanıcıya ait olup olmadığını kontrol et
        const cardCheck = await pool.request()
            .input('cardId', sql.Int, parseInt(cardId))
            .input('userId', sql.Int, userId)
            .query('SELECT TOP 1 id FROM Cards WHERE id = @cardId AND userId = @userId');

        if (cardCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya size ait değil' });
        }

        // Hesabın karta ait olup olmadığını kontrol et
        const accountCheck = await pool.request()
            .input('accountId', sql.Int, parseInt(accountId))
            .input('cardId', sql.Int, parseInt(cardId))
            .query('SELECT TOP 1 id FROM CardBankAccounts WHERE id = @accountId AND cardId = @cardId');

        if (accountCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Silinecek banka hesabı bulunamadı.' });
        }

        // Banka hesabını sil
        const deleteResult = await pool.request()
            .input('accountId', sql.Int, parseInt(accountId))
            .query('DELETE FROM CardBankAccounts WHERE id = @accountId');

        if (deleteResult.rowsAffected && deleteResult.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Banka hesabı başarıyla silindi', id: accountId });
        } else {
            return res.status(404).json({ message: 'Silinecek banka hesabı bulunamadı (tekrar kontrol)' });
        }

    } catch (error) {
        console.error("Kart banka hesabı silme hatası:", error);
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
    toggleCardStatus,
    getCardBankAccounts,
    addCardBankAccount,
    updateCardBankAccount,
    deleteCardBankAccount
}; 