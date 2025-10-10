import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

const API_URL = API_ENDPOINTS.CARDS; // https://api.dijinew.com/api/cards

// Axios instance oluşturup default header eklemek daha temiz olabilir,
// ama şimdilik her istekte token'ı manuel ekleyeceğiz

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

// Get all cards for the user
const getCards = async () => {
    const config = getAuthConfig();
    if (!config.headers) return []; // Token yoksa boş dizi dön
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Create a new card
const createCard = async (cardData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.post(API_URL, cardData, config);
    return response.data;
};

// Get a single card by ID
const getCardById = async (id) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

// Update a card
const updateCard = async (id, cardData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.put(`${API_URL}/${id}`, cardData, config);
    return response.data;
};

// Delete a card
const deleteCard = async (id) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

// Yeni fonksiyon: Herkese açık kartvizit bilgisini getir
export const getPublicCard = async (slugOrId) => {
    // Bu istek için token GEREKMEZ
    const response = await axios.get(`${API_ENDPOINTS.PUBLIC}/${slugOrId}`);
    return response.data;
};

// Toggle card active status
const toggleCardStatus = async (cardId, isActive) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const body = { isActive }; // Gönderilecek veri
    const response = await axios.patch(`${API_URL}/${cardId}/status`, body, config);
    return response.data; // Başarı mesajı ve güncellenmiş kart durumu döner
};

// Banka hesap bilgileri fonksiyonları

// Get card bank accounts
const getCardBankAccounts = async (cardId) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.get(`${API_URL}/${cardId}/bank-accounts`, config);
    return response.data;
};

// Add card bank account
const addCardBankAccount = async (cardId, bankData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.post(`${API_URL}/${cardId}/bank-accounts`, bankData, config);
    return response.data;
};

// Update card bank account
const updateCardBankAccount = async (cardId, accountId, bankData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.put(`${API_URL}/${cardId}/bank-accounts/${accountId}`, bankData, config);
    return response.data;
};

// Delete card bank account
const deleteCardBankAccount = async (cardId, accountId) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.delete(`${API_URL}/${cardId}/bank-accounts/${accountId}`, config);
    return response.data;
};

const cardService = {
    getCards,
    createCard,
    getCardById,
    updateCard,
    deleteCard,
    toggleCardStatus,
    getPublicCard,
    getCardBankAccounts,
    addCardBankAccount,
    updateCardBankAccount,
    deleteCardBankAccount
};

export default cardService;
