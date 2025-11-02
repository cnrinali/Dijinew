/**
 * URL Helper Functions
 * Relative path'leri tam URL'ye çevirir
 */

/**
 * Relative path'i tam URL'ye çevirir
 * @param {string} relativePath - Relative path (/uploads/images/...)
 * @param {object} req - Express request object (host bilgisi için)
 * @returns {string} - Tam URL
 */
const convertToFullUrl = (relativePath, req = null) => {
    if (!relativePath) return null;
    
    // Zaten tam URL ise olduğu gibi döndür
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    
    // Production'da api.dijinew.com kullan
    if (req) {
        const protocol = req.protocol || 'https';
        const host = req.get('host') || 'api.dijinew.com';
        return `${protocol}://${host}${relativePath}`;
    }
    
    // Fallback: Production URL
    return `https://api.dijinew.com${relativePath}`;
};

/**
 * Kartvizit verilerindeki image URL'lerini tam URL'ye çevirir
 * @param {object} card - Kartvizit verisi
 * @param {object} req - Express request object
 * @returns {object} - Güncellenmiş kartvizit verisi
 */
const normalizeCardImageUrls = (card, req = null) => {
    if (!card) return card;
    
    const cardCopy = { ...card };
    
    // Profile ve cover image URL'lerini düzelt
    if (cardCopy.profileImageUrl) {
        cardCopy.profileImageUrl = convertToFullUrl(cardCopy.profileImageUrl, req);
    }
    
    if (cardCopy.coverImageUrl) {
        cardCopy.coverImageUrl = convertToFullUrl(cardCopy.coverImageUrl, req);
    }
    
    // Documents içindeki URL'leri düzelt
    if (cardCopy.documents && Array.isArray(cardCopy.documents)) {
        cardCopy.documents = cardCopy.documents.map(doc => {
            if (doc && doc.url && typeof doc.url === 'string') {
                return {
                    ...doc,
                    url: convertToFullUrl(doc.url, req)
                };
            }
            return doc;
        });
    }
    
    return cardCopy;
};

/**
 * Kartvizit dizisindeki tüm image URL'lerini düzeltir
 * @param {array} cards - Kartvizit dizisi
 * @param {object} req - Express request object
 * @returns {array} - Güncellenmiş kartvizit dizisi
 */
const normalizeCardsImageUrls = (cards, req = null) => {
    if (!Array.isArray(cards)) return cards;
    
    return cards.map(card => normalizeCardImageUrls(card, req));
};

module.exports = {
    convertToFullUrl,
    normalizeCardImageUrls,
    normalizeCardsImageUrls
};



