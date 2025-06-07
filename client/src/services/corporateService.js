import axios from 'axios';

// Axios instance'ı veya temel URL'yi merkezi bir yerden almak daha iyi olabilir.
// Şimdilik doğrudan kullanalım.
const API_BASE_URL = '/api'; // vite.config.js dosyasındaki proxy ayarına göre

const getAuthConfig = () => {
    const storedUserData = localStorage.getItem('user'); 
    if (storedUserData) {
        try {
            const userData = JSON.parse(storedUserData);
            if (userData && userData.token) {
                return {
                    headers: {
                        Authorization: `Bearer ${userData.token}`,
                    },
                };
            }
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            // Hatalı veri varsa temizleyebilir veya logout tetiklenebilir
            localStorage.removeItem('user'); 
        }
    }
    return {};
};

// @desc    Get cards for the logged-in corporate user's company
// @route   GET /api/corporate/cards
export const getMyCompanyCards = async (params = {}) => {
    // params: { search, isActive, page, limit } gibi filtreleme/sayfalama parametreleri olabilir
    try {
        const config = getAuthConfig();
        const response = await axios.get(`${API_BASE_URL}/corporate/cards`, {
            ...config,
            params, //örn: /api/corporate/cards?search=abc&page=2
        });
        return response.data; // Genellikle { data: [], totalCount: N, ... } formatında döner
    } catch (error) {
        console.error('Error fetching company cards (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kartları getirilemedi.');
    }
};

// @desc    Create a new card for the logged-in corporate user's company
// @route   POST /api/corporate/cards
export const createMyCompanyCard = async (cardData) => {
    try {
        const config = getAuthConfig();
        const response = await axios.post(`${API_BASE_URL}/corporate/cards`, cardData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating company card (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kartı oluşturulamadı.');
    }
};

// @desc    Get users for the logged-in corporate user's company (for selection)
// @route   GET /api/corporate/users?brief=true (Varsayım)
// @access  Private/Corporate
export const getMyCompanyUsersForSelection = async () => {
    try {
        const config = getAuthConfig();
        // Backend'de bu endpoint'in sadece id, name, email gibi temel bilgileri dönmesi idealdir.
        // companyId filtrelemesi backend'de otomatik olarak req.user.companyId ile yapılmalı.
        const response = await axios.get(`${API_BASE_URL}/corporate/users`, { 
            ...config,
            // params: { brief: true } // Eğer backend destekliyorsa sadece temel alanları istemek için
        });
        return response.data; // Genellikle { data: [{id, name, email}, ...], ... } formatında döner
    } catch (error) {
        console.error('Error fetching company users (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kullanıcıları getirilemedi.');
    }
};

// @desc    Create a new user for the logged-in corporate user's company
// @route   POST /api/corporate/users
// @access  Private/Corporate
export const createMyCompanyUser = async (userData) => {
    // userData: { name, email, password, role ('user') }
    try {
        const config = getAuthConfig();
        const response = await axios.post(`${API_BASE_URL}/corporate/users`, userData, config);
        return response.data; // Yeni oluşturulan kullanıcıyı döndürür
    } catch (error) {
        console.error('Error creating company user (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kullanıcısı oluşturulamadı.');
    }
};

// Gelecekteki diğer kurumsal servis fonksiyonları buraya eklenebilir
// export const addCardToMyCompany = async (cardData) => { ... }; 