import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

// Token'ı localStorage'dan al ve header'a ekle
const getAuthConfig = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        };
    }
    return {}; // Token yoksa boş config döndür
};

const analyticsService = {
    // Kart görüntülenmesini kaydet
    recordCardView: async (cardId, additionalData = {}) => {
        try {
            console.log(`recordCardView çağrılıyor - cardId: ${cardId}`);
            const response = await axios.post(`${API_BASE_URL}/api/analytics/view/${cardId}`, {
                ...additionalData,
                timestamp: new Date().toISOString()
            });
            console.log('View kaydedildi:', response.data);
            return response.data;
        } catch (error) {
            console.error('Görüntülenme kaydedilemedi:', error);
            console.error('Hata detayı:', error.response?.data);
            // Hata durumunda sessizce devam et (analytics kritik değil)
            return null;
        }
    },

    // Link tıklamasını kaydet
    recordCardClick: async (cardId, clickType, clickTarget, additionalData = {}) => {
        try {
            console.log(`🚀 recordCardClick çağrılıyor - cardId: ${cardId}, clickType: ${clickType}, clickTarget: ${clickTarget}`);
            console.log(`🚀 API URL: ${API_BASE_URL}/api/analytics/click/${cardId}`);
            const response = await axios.post(`${API_BASE_URL}/api/analytics/click/${cardId}`, {
                clickType,
                clickTarget,
                ...additionalData,
                timestamp: new Date().toISOString()
            });
            console.log('🚀 Click kaydedildi:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Tıklama kaydedilemedi:', error);
            console.error('❌ Hata detayı:', error.response?.data);
            console.error('❌ Status:', error.response?.status);
            console.error('❌ Full error:', error);
            // Hata durumunda sessizce devam et (analytics kritik değil)
            return null;
        }
    },

    // Kart istatistiklerini getir
    getCardStats: async (cardId, period = 30) => {
        try {
            const config = getAuthConfig();
            if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
            const response = await axios.get(`${API_BASE_URL}/api/analytics/card/${cardId}?period=${period}`, config);
            return response.data;
        } catch (error) {
            console.error('Kart istatistikleri getirilemedi:', error);
            throw error;
        }
    },

    // Kullanıcı istatistiklerini getir
    getUserStats: async (userId, period = 30) => {
        try {
            const config = getAuthConfig();
            if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
            const response = await axios.get(`${API_BASE_URL}/api/analytics/user/${userId}?period=${period}`, config);
            return response.data;
        } catch (error) {
            console.error('Kullanıcı istatistikleri getirilemedi:', error);
            throw error;
        }
    },

    // Admin istatistiklerini getir
    getAdminStats: async (period = 30) => {
        try {
            const config = getAuthConfig();
            if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
            const response = await axios.get(`${API_BASE_URL}/api/analytics/admin?period=${period}`, config);
            return response.data;
        } catch (error) {
            console.error('Admin istatistikleri getirilemedi:', error);
            throw error;
        }
    }
};

// Click type ve target'ları belirlemek için yardımcı fonksiyonlar
export const getClickType = (linkType) => {
    const typeMap = {
        'phone': 'phone',
        'email': 'email',
        'website': 'website',
        'address': 'address',
        'linkedin': 'social',
        'twitter': 'social',
        'instagram': 'social',
        'facebook': 'social',
        'trendyol': 'marketplace',
        'hepsiburada': 'marketplace',
        'ciceksepeti': 'marketplace',
        'sahibinden': 'marketplace',
        'hepsiemlak': 'marketplace',
        'n11': 'marketplace',
        'amazon': 'marketplace',
        'gittigidiyor': 'marketplace',
        'getir': 'marketplace',
        'yemeksepeti': 'marketplace'
    };
    
    return typeMap[linkType] || 'other';
};

export const trackClick = async (cardId, linkType) => {
    console.log(`🔥 trackClick çağrıldı - cardId: ${cardId}, linkType: ${linkType}`);
    const clickType = getClickType(linkType);
    console.log(`🔥 Mapped clickType: ${clickType}`);
    console.log(`🔥 analyticsService.recordCardClick çağrılıyor...`);
    await analyticsService.recordCardClick(cardId, clickType, linkType);
};

export default analyticsService; 