/**
 * Merkezi URL Yönetimi
 * Tüm URL'ler bu dosyadan yönetilir
 */

// Backend API URL'ini al
const getBackendApiUrl = () => {
    // 1. Environment variable'dan al (en yüksek öncelik)
    if (process.env.BACKEND_API_URL) {
        console.log('🔗 Using BACKEND_API_URL from environment:', process.env.BACKEND_API_URL);
        return process.env.BACKEND_API_URL;
    }

    // 2. Development ortamı kontrolü
    if (process.env.NODE_ENV === 'development') {
        console.log('🔗 Using development backend URL: http://localhost:5001');
        return 'http://localhost:5001';
    }

    // 3. Production ortamı tespiti
    if (process.env.NODE_ENV === 'production') {
        console.log('🔗 Using production backend URL: https://dijinew-api.vercel.app');
        return 'https://dijinew-api.vercel.app';
    }

    // 4. Fallback - varsayılan production URL
    console.log('🔗 Using fallback backend URL: https://dijinew-api.vercel.app');
    return 'https://dijinew-api.vercel.app';
};

// Frontend URL'ini al
const getClientBaseUrl = (req = null) => {
    // 1. Environment variable'dan al (en yüksek öncelik)
    if (process.env.CLIENT_URL) {
        console.log('🔗 Using CLIENT_URL from environment:', process.env.CLIENT_URL);
        return process.env.CLIENT_URL;
    }

    // 2. Development ortamı kontrolü
    if (process.env.NODE_ENV === 'development' || 
        (req && req.get('host')?.includes('localhost'))) {
        console.log('🔗 Using development URL: http://localhost:5173');
        return 'http://localhost:5173';
    }

    // 3. Production ortamı tespiti
    if (process.env.NODE_ENV === 'production' || 
        (req && (
            req.get('host')?.includes('vercel.app') ||
            req.get('origin')?.includes('dijinew.vercel.app') ||
            req.get('referer')?.includes('dijinew.vercel.app')
        ))) {
        console.log('🔗 Using production URL: https://dijinew.vercel.app');
        return 'https://dijinew.vercel.app';
    }

    // 4. Fallback - varsayılan production URL
    console.log('🔗 Using fallback URL: https://dijinew.vercel.app');
    return 'https://dijinew.vercel.app';
};

const getWizardUrl = (cardSlug, token, req = null) => {
    const baseUrl = getClientBaseUrl(req);
    return `${baseUrl}/wizard/${cardSlug}?token=${token}`;
};

const getCardUrl = (cardSlug, req = null) => {
    const baseUrl = getClientBaseUrl(req);
    return `${baseUrl}/card/${cardSlug}`;
};

const getQRUrl = (cardSlug, req = null) => {
    const baseUrl = getClientBaseUrl(req);
    return `${baseUrl}/qr/${cardSlug}`;
};

module.exports = {
    getBackendApiUrl,
    getClientBaseUrl,
    getWizardUrl,
    getCardUrl,
    getQRUrl
};
