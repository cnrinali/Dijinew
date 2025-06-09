import { getPool, sql } from '../../config/db.js';
import { requireAuth } from '../../utils/authUtils.js';

// Slug doğrulama fonksiyonu
const validateAndCleanSlug = (slug) => {
    if (!slug) return null;
    let cleanedSlug = slug.toLowerCase().trim();
    cleanedSlug = cleanedSlug.replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
    cleanedSlug = cleanedSlug.replace(/^-+|-+$/g, '');
    if (cleanedSlug.length < 1) return null;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanedSlug)) {
        return null;
    }
    return cleanedSlug;
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Auth kontrolü
    const user = await requireAuth(req, res);
    if (!user) return;

    const { id } = req.query;

    // ID doğrulaması
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Geçersiz Kart ID' });
    }

    const cardId = parseInt(id);

    try {
        const pool = await getPool();

        if (req.method === 'GET') {
            // Tek kart getir
            const result = await pool.request()
                .input('cardId', sql.Int, cardId)
                .input('userId', sql.Int, user.id)
                .query('SELECT TOP 1 * FROM Cards WHERE id = @cardId AND userId = @userId');

            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'Kartvizit bulunamadı' });
            }

            return res.status(200).json(result.recordset[0]);

        } else if (req.method === 'PUT') {
            // Kart güncelle
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
                linkedinUrl,
                twitterUrl,
                instagramUrl
            } = req.body;

            const customSlug = validateAndCleanSlug(rawCustomSlug);

            // Önce kartın varlığını ve sahipliğini kontrol et
            const cardExists = await pool.request()
                .input('cardId', sql.Int, cardId)
                .input('userId', sql.Int, user.id)
                .query('SELECT TOP 1 id FROM Cards WHERE id = @cardId AND userId = @userId');

            if (cardExists.recordset.length === 0) {
                return res.status(404).json({ message: 'Kartvizit bulunamadı' });
            }

            // Slug benzersizlik kontrolü (mevcut kartın dışında)
            if (customSlug) {
                const slugCheck = await pool.request()
                    .input('customSlug', sql.VarChar, customSlug)
                    .input('cardId', sql.Int, cardId)
                    .query('SELECT TOP 1 id FROM Cards WHERE customSlug = @customSlug AND id != @cardId');
                
                if (slugCheck.recordset.length > 0) {
                    return res.status(400).json({ message: `Bu özel URL (${customSlug}) zaten kullanımda.` });
                }
            }

            // Kartı güncelle
            await pool.request()
                .input('cardId', sql.Int, cardId)
                .input('userId', sql.Int, user.id)
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
                        linkedinUrl = @linkedinUrl,
                        twitterUrl = @twitterUrl,
                        instagramUrl = @instagramUrl,
                        updatedAt = GETUTCDATE()
                    WHERE id = @cardId AND userId = @userId
                `);

            // Güncellenmiş kartı getir
            const updatedResult = await pool.request()
                .input('cardId', sql.Int, cardId)
                .input('userId', sql.Int, user.id)
                .query('SELECT TOP 1 * FROM Cards WHERE id = @cardId AND userId = @userId');

            return res.status(200).json(updatedResult.recordset[0]);

        } else if (req.method === 'DELETE') {
            // Kartı sil
            const result = await pool.request()
                .input('cardId', sql.Int, cardId)
                .input('userId', sql.Int, user.id)
                .query('DELETE FROM Cards WHERE id = @cardId AND userId = @userId; SELECT @@ROWCOUNT as deletedCount;');

            if (result.recordset[0].deletedCount === 0) {
                return res.status(404).json({ message: 'Kartvizit bulunamadı' });
            }

            return res.status(200).json({ message: 'Kartvizit başarıyla silindi' });

        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error) {
        console.error("Card API hatası:", error);
        if (error.number === 2601 || error.number === 2627) {
            return res.status(400).json({ message: `Özel URL zaten kullanımda.` });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
} 