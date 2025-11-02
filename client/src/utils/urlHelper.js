/**
 * URL normalizasyon utility fonksiyonları
 */

// Platform bazlı domain mapping'leri
const URL_DOMAINS = {
    linkedinUrl: 'linkedin.com',
    twitterUrl: 'twitter.com',
    instagramUrl: 'instagram.com',
    facebookUrl: 'facebook.com',
    whatsappUrl: 'wa.me',
    telegramUrl: 't.me',
    youtubeUrl: 'youtube.com',
    skypeUrl: 'skype.com',
    wechatUrl: 'weixin.qq.com',
    snapchatUrl: 'snapchat.com',
    pinterestUrl: 'pinterest.com',
    tiktokUrl: 'tiktok.com',
    trendyolUrl: 'trendyol.com',
    hepsiburadaUrl: 'hepsiburada.com',
    ciceksepeti: 'ciceksepeti.com',
    ciceksepetiUrl: 'ciceksepeti.com',
    sahibindenUrl: 'sahibinden.com',
    hepsiemlakUrl: 'hepsiemlak.com',
    gittigidiyorUrl: 'gittigidiyor.com',
    n11Url: 'n11.com',
    amazonTrUrl: 'amazon.com.tr',
    amazonUrl: 'amazon.com.tr',
    getirUrl: 'getir.com',
    yemeksepetiUrl: 'yemeksepeti.com',
    arabamUrl: 'arabam.com',
    letgoUrl: 'letgo.com',
    pttAvmUrl: 'pttavm.com',
    whatsappBusinessUrl: 'wa.me',
    websiteUrl: '',
    website: '',
    videoUrl: 'youtube.com'
};

/**
 * URL'den sadece path kısmını çıkarır (domain olmadan)
 * @param {string} url - Tam URL veya path
 * @param {string} fieldName - URL alan adı (linkedinUrl, twitterUrl, vb.)
 * @returns {string} Sadece path kısmı (örn: "in/username" veya "magaza/123")
 */
export const extractPathOnly = (url, fieldName) => {
    if (!url || typeof url !== 'string') {
        return '';
    }

    let cleanUrl = url.trim();
    if (!cleanUrl) {
        return '';
    }

    // http:// veya https:// kaldır
    cleanUrl = cleanUrl.replace(/^https?:\/\//i, '');

    const domain = URL_DOMAINS[fieldName];
    if (!domain) {
        // Domain mapping yoksa, ilk / sonrasını al
        const parts = cleanUrl.split('/');
        return parts.length > 1 ? parts.slice(1).join('/') : cleanUrl;
    }

    // Domain'i kaldır, sadece path'i al
    const domainPattern = new RegExp(`^${domain.replace('.', '\\.')}/?`, 'i');
    cleanUrl = cleanUrl.replace(domainPattern, '');

    return cleanUrl;
};

/**
 * Path'i tam URL'ye çevirir
 * @param {string} path - Sadece path kısmı (örn: "in/username")
 * @param {string} fieldName - URL alan adı
 * @returns {string} Tam URL (https:// ile başlar)
 */
export const pathToFullUrl = (path, fieldName) => {
    if (!path || typeof path !== 'string') {
        return '';
    }

    const cleanPath = path.trim();
    if (!cleanPath) {
        return '';
    }

    const domain = URL_DOMAINS[fieldName];
    if (!domain) {
        // Domain mapping yoksa, path zaten tam URL olabilir
        if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
            return cleanPath;
        }
        return `https://${cleanPath}`;
    }

    // Domain + path birleştir
    const fullPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `https://${domain}${fullPath}`;
};

/**
 * URL'den http:// veya https:// prefix'ini kaldırır (sadece domain ve path kalır)
 * @param {string} url - Temizlenecek URL
 * @returns {string} Temizlenmiş URL (http/https olmadan) veya boş string
 */
export const removeUrlPrefix = (url) => {
    if (!url || typeof url !== 'string') {
        return '';
    }
    return url.replace(/^https?:\/\//i, '').trim();
};

/**
 * URL'yi normalize eder: http:// veya https:// varsa kaldırır, sonra https:// ekler
 * Kullanıcıdan sadece domain ve path kısmını alır (örn: sahibinden.com/ilan/123)
 * @param {string} url - Normalize edilecek URL
 * @returns {string} Normalize edilmiş URL (https:// ile başlar) veya boş string
 */
export const normalizeUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return '';
    }

    // Boşlukları temizle
    let cleanUrl = url.trim();
    
    if (!cleanUrl) {
        return '';
    }

    // Eğer zaten http:// veya https:// ile başlıyorsa, bunları kaldır
    cleanUrl = cleanUrl.replace(/^https?:\/\//i, '');
    
    // Eğer sadece boşluk kaldıysa boş string döndür
    if (!cleanUrl.trim()) {
        return '';
    }

    // https:// ekle
    return `https://${cleanUrl}`;
};

/**
 * Form verilerindeki tüm URL alanlarını normalize eder (path'leri tam URL'ye çevirir)
 * @param {object} formData - Form verisi
 * @returns {object} URL alanları normalize edilmiş form verisi
 */
export const normalizeUrlFields = (formData) => {
    const urlFields = [
        'website',
        'websiteUrl',
        'linkedinUrl',
        'twitterUrl',
        'instagramUrl',
        'whatsappUrl',
        'facebookUrl',
        'telegramUrl',
        'youtubeUrl',
        'skypeUrl',
        'wechatUrl',
        'snapchatUrl',
        'pinterestUrl',
        'tiktokUrl',
        'trendyolUrl',
        'hepsiburadaUrl',
        'ciceksepeti',
        'ciceksepetiUrl',
        'sahibindenUrl',
        'hepsiemlakUrl',
        'gittigidiyorUrl',
        'n11Url',
        'amazonTrUrl',
        'amazonUrl',
        'getirUrl',
        'yemeksepetiUrl',
        'arabamUrl',
        'letgoUrl',
        'pttAvmUrl',
        'whatsappBusinessUrl',
        'videoUrl'
    ];

    const normalized = { ...formData };

    urlFields.forEach(field => {
        if (normalized[field]) {
            // Eğer zaten tam URL ise olduğu gibi kullan, değilse path'i tam URL'ye çevir
            const value = normalized[field];
            if (value.startsWith('http://') || value.startsWith('https://')) {
                // Zaten tam URL, normalize et (http -> https)
                normalized[field] = normalizeUrl(value);
            } else {
                // Path ise, tam URL'ye çevir
                normalized[field] = pathToFullUrl(value, field);
            }
        }
    });

    return normalized;
};

