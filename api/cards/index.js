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
    if (!user) return; // requireAuth zaten error response gönderdi

    try {
        const pool = await getPool();

        if (req.method === 'GET') {
            // Kullanıcının kartlarını getir
            const result = await pool.request()
                .input('userId', sql.Int, user.id)
                .query('SELECT * FROM Cards WHERE userId = @userId ORDER BY createdAt DESC');
            
            return res.status(200).json(result.recordset);

        } else if (req.method === 'POST') {
            // Yeni kart oluştur
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
                customSlug: rawCustomSlug,
                linkedinUrl = null,
                twitterUrl = null,
                instagramUrl = null
            } = req.body;

            const customSlug = validateAndCleanSlug(rawCustomSlug);

            // Bireysel kullanıcılar için kart sayısı kontrolü
            if (user.role === 'user') {
                const cardCountResult = await pool.request()
                    .input('userId', sql.Int, user.id)
                    .query('SELECT COUNT(*) as cardCount FROM Cards WHERE userId = @userId');
                
                if (cardCountResult.recordset[0].cardCount > 0) {
                    return res.status(400).json({ message: 'Bireysel kullanıcılar sadece bir kartvizit oluşturabilir.' });
                }
            }

            // Slug benzersizlik kontrolü
            if (customSlug) {
                const slugCheck = await pool.request()
                    .input('customSlug', sql.VarChar, customSlug)
                    .query('SELECT TOP 1 id FROM Cards WHERE customSlug = @customSlug');
                
                if (slugCheck.recordset.length > 0) {
                    return res.status(400).json({ message: `Bu özel URL (${customSlug}) zaten kullanımda.` });
                }
            } else if (rawCustomSlug) {
                return res.status(400).json({ message: `Geçersiz özel URL formatı. Sadece harf, rakam ve tire kullanın.` });
            }

            // Kartı oluştur
            await pool.request()
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
                    INSERT INTO Cards 
                    (userId, cardName, profileImageUrl, coverImageUrl, name, title, company, bio, phone, email, website, address, theme, customSlug, isActive, linkedinUrl, twitterUrl, instagramUrl)
                    VALUES 
                    (@userId, @cardName, @profileImageUrl, @coverImageUrl, @name, @title, @company, @bio, @phone, @email, @website, @address, @theme, @customSlug, 1, @linkedinUrl, @twitterUrl, @instagramUrl);
                `);

            // Son eklenen kartı al
            const selectResult = await pool.request()
                .input('userId', sql.Int, user.id)
                .query('SELECT TOP 1 * FROM Cards WHERE userId = @userId ORDER BY id DESC');

            return res.status(201).json(selectResult.recordset[0]);

        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error) {
        console.error("Cards API hatası:", error);
        if (error.number === 2601 || error.number === 2627) {
            return res.status(400).json({ message: `Özel URL zaten kullanımda.` });
        }
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
} 