import axios from 'axios';

const API_URL = '/api/cards'; // Vite proxy ayarı ile çalışacak

// Axios instance oluşturup default header eklemek daha temiz olabilir,
// ama şimdilik her istekte token'ı manuel ekleyelim.

// Helper function to get token from localStorage
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

// Helper function to create auth headers
const createAuthHeaders = () => {
    const token = getToken();
    if (!token) {
        console.error("Token bulunamadı, istek gönderilemiyor.");
        return {}; // Veya hata fırlat
    }
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

// Get all cards for the user
const getCards = async () => {
    const config = createAuthHeaders();
    if (!config.headers) return []; // Token yoksa boş dizi dön
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Create a new card
const createCard = async (cardData) => {
    const config = createAuthHeaders();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.post(API_URL, cardData, config);
    return response.data;
};

// Get a single card by ID
const getCardById = async (id) => {
    const config = createAuthHeaders();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

// Update a card
const updateCard = async (id, cardData) => {
    const config = createAuthHeaders();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.put(`${API_URL}/${id}`, cardData, config);
    return response.data;
};

// Delete a card
const deleteCard = async (id) => {
    const config = createAuthHeaders();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

// Yeni fonksiyon: Herkese açık kartvizit bilgisini getir
export const getPublicCard = async (slugOrId) => {
    // Bu istek için token GEREKMEZ
    const response = await axios.get(`/api/public/${slugOrId}`);
    return response.data;
};

// Toggle card active status
const toggleCardStatus = async (cardId, isActive) => {
    const config = createAuthHeaders();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const body = { isActive }; // Gönderilecek veri
    const response = await axios.patch(`${API_URL}/${cardId}/status`, body, config);
    return response.data; // Başarı mesajı ve güncellenmiş kart durumu döner
};

const cardService = {
    getCards,
    createCard,
    getCardById,
    updateCard,
    deleteCard,
    toggleCardStatus,
    getPublicCard
};

export default cardService;
