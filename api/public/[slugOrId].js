import { getPool, sql } from '../../config/db.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { slugOrId } = req.query;

    if (!slugOrId) {
        return res.status(400).json({ message: 'Slug veya ID gereklidir' });
    }

    try {
        const pool = await getPool();
        let result;

        // Önce slug ile aramayı dene
        result = await pool.request()
            .input('slug', sql.VarChar, slugOrId)
            .query('SELECT TOP 1 * FROM Cards WHERE customSlug = @slug AND isActive = 1');

        // Slug ile bulunamadıysa ID ile dene
        if (result.recordset.length === 0 && !isNaN(parseInt(slugOrId))) {
            result = await pool.request()
                .input('cardId', sql.Int, parseInt(slugOrId))
                .query('SELECT TOP 1 * FROM Cards WHERE id = @cardId AND isActive = 1');
        }

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Kartvizit bulunamadı veya aktif değil' });
        }

        const card = result.recordset[0];

        // Görüntülenme sayısını artır (opsiyonel)
        await pool.request()
            .input('cardId', sql.Int, card.id)
            .query('UPDATE Cards SET viewCount = ISNULL(viewCount, 0) + 1 WHERE id = @cardId');

        return res.status(200).json(card);

    } catch (error) {
        console.error("Public card hatası:", error);
        res.status(500).json({ message: 'Sunucu hatası oluştu' });
    }
} 