import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

// Axios instance'ı veya temel URL'yi merkezi bir yerden almak daha iyi olabilir.
const API_BASE_URL = API_ENDPOINTS.CORPORATE; // https://api.dijinew.com/api/corporate

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

// @desc    Get cards for the logged-in corporate user's company
// @route   GET /api/corporate/cards
export const getMyCompanyCards = async (params = {}) => {
    // params: { search, isActive, page, limit } gibi filtreleme/sayfalama parametreleri olabilir
    try {
        const config = getAuthConfig();
        const response = await axios.get(`${API_BASE_URL}/cards`, {
            ...config,
            params, //örn: /api/corporate/cards?search=abc&page=2
        });
        return response.data; // Genellikle { data: [], totalCount: N, ... } formatında döner
    } catch (error) {
        console.error('Error fetching company cards (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kartları getirilemedi.');
    }
};

// Modern isim ile aynı fonksiyon
export const getCorporateCards = getMyCompanyCards;

// @desc    Create a new card for the logged-in corporate user's company
// @route   POST /api/corporate/cards
export const createMyCompanyCard = async (cardData) => {
    try {
        const config = getAuthConfig();
        const response = await axios.post(`${API_BASE_URL}/cards`, cardData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating company card (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kartı oluşturulamadı.');
    }
};

// Modern isim ile aynı fonksiyon
export const createCompanyCard = createMyCompanyCard;

// @desc    Get users for the logged-in corporate user's company (for selection)
// @route   GET /api/corporate/users?brief=true (Varsayım)
// @access  Private/Corporate
export const getMyCompanyUsersForSelection = async (params = {}) => {
    try {
        const config = getAuthConfig();
        // Backend'de bu endpoint'in sadece id, name, email gibi temel bilgileri dönmesi idealdir.
        // companyId filtrelemesi backend'de otomatik olarak req.user.companyId ile yapılmalı.
        const response = await axios.get(`${API_BASE_URL}/users`, { 
            ...config,
            params // Eğer backend destekliyorsa sadece temel alanları istemek için
        });
        return response.data; // Genellikle { data: [{id, name, email}, ...], ... } formatında döner
    } catch (error) {
        console.error('Error fetching company users (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kullanıcıları getirilemedi.');
    }
};

// Modern isim ile aynı fonksiyon
export const getCorporateUsers = getMyCompanyUsersForSelection;

// @desc    Create a new user for the logged-in corporate user's company
// @route   POST /api/corporate/users
// @access  Private/Corporate
export const createMyCompanyUser = async (userData) => {
    // userData: { name, email, password, role ('user') }
    try {
        const config = getAuthConfig();
        const response = await axios.post(`${API_BASE_URL}/users`, userData, config);
        return response.data; // Yeni oluşturulan kullanıcıyı döndürür
    } catch (error) {
        console.error('Error creating company user (corporateService):', error.response?.data || error.message);
        throw error.response?.data || new Error('Şirket kullanıcısı oluşturulamadı.');
    }
};

// Modern isim ile aynı fonksiyon
export const createCompanyUser = createMyCompanyUser;

// Gelecekteki diğer kurumsal servis fonksiyonları buraya eklenebilir
// export const addCardToMyCompany = async (cardData) => { ... }; 