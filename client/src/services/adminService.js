import axios from 'axios'; // Doğrudan paketi import et

const API_URL = '/api/admin'; // Temel admin API yolu

// Token'ı almak için helper (userService.js'deki gibi)
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

// Tüm kullanıcıları getir (opsiyonel arama, rol filtresi ve sayfalama ile)
const getAllUsers = async (searchTerm = '', page = 1, limit = 10, role = '') => {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { page, limit }
    };
    if (searchTerm) {
        config.params.search = searchTerm;
    }
    if (role) {
        config.params.role = role;
    }
    console.log("getAllUsers Request Config:", config);
    const response = await axios.get(API_URL + '/users', config);
    console.log("getAllUsers Response:", response.data);
    return response.data;
};

// Bir kullanıcıyı sil
const deleteUser = async (userId) => {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
    };
    const response = await axios.delete(`${API_URL}/users/${userId}`, config);
    return response.data; // Başarı mesajı ve id döner
};

// Tüm kartları getir (opsiyonel arama, durum filtresi ve sayfalama ile)
const getAllCards = async (searchTerm = '', page = 1, limit = 10, isActive = null) => {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { page, limit }
    };
    if (searchTerm) {
        config.params.search = searchTerm;
    }
    if (isActive !== null) {
        config.params.isActive = isActive;
    }
    console.log("getAllCards Request Config:", config);
    const response = await axios.get(API_URL + '/cards', config);
    console.log("getAllCards Response:", response.data);
    return response.data;
};

// Bir kartı sil
const deleteCard = async (cardId) => {
     const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
    };
    const response = await axios.delete(`${API_URL}/cards/${cardId}`, config);
    return response.data; // Başarı mesajı ve id döner
};

// Update user role (Admin)
const updateUserRole = async (userId, newRole) => {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
    };
    const body = { role: newRole };
    const response = await axios.put(`${API_URL}/users/${userId}/role`, body, config);
    return response.data;
};

// Update any user's profile (Admin)
const updateAnyUserProfile = async (userId, userData) => {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
    };
    // userData objesinin sadece name ve email içermesi beklenir
    const body = { name: userData.name, email: userData.email }; 
    const response = await axios.put(`${API_URL}/users/${userId}`, body, config);
    return response.data; // Başarı mesajı ve güncellenmiş kullanıcı bilgisi döner
};

// Update any card (Admin)
const updateAnyCard = async (cardId, cardData) => {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
    };
    // cardData objesinin tüm kart alanlarını içermesi beklenir
    const response = await axios.put(`${API_URL}/cards/${cardId}`, cardData, config);
    return response.data; // Başarı mesajı ve güncellenmiş kart bilgisi döner
};

// Get Dashboard Stats (Admin)
const getDashboardStats = async () => {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
    };
    const response = await axios.get(`${API_URL}/stats`, config);
    return response.data; // { totalUsers: number, totalCards: number, activeCards: number } dönecek
};

const adminService = {
    getAllUsers,
    deleteUser,
    getAllCards,
    deleteCard,
    updateUserRole,
    updateAnyUserProfile,
    updateAnyCard,
    getDashboardStats
};

export default adminService; 