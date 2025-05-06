import axios from 'axios';

// Helper to get auth config
const getAuthConfig = () => {
    let token = null;
    try {
        const storedUserData = localStorage.getItem('user'); // Anahtarı 'user' olarak değiştir
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            token = userData?.token; // userData içindeki token alanını al
        }
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem('user'); // Hatalı veriyi temizle
    }

    console.log('Token from parsed user data:', token);
    return {
        headers: {
            // Token yoksa bile Authorization başlığını göndermemek daha doğru olabilir,
            // ancak şimdilik null token ile gönderelim, backend zaten reddedecektir.
            Authorization: `Bearer ${token}`
        }
    };
};

const API_URL = '/api/admin'; // Base URL for admin API

// --- Dashboard --- 
// Get Dashboard Stats (TODO: Backend'de /stats endpoint'inin olduğundan emin olun)
const getDashboardStats = async () => {
    console.warn("getDashboardStats fonksiyonu çağrıldı ama implementasyonu eksik olabilir.");
    // Örnek API çağrısı:
    const response = await axios.get(`${API_URL}/stats`, getAuthConfig());
    return response.data; 
    // return { totalUsers: 0, totalCards: 0, activeCards: 0 }; // Şimdilik simüle edelim
};

// --- User Management --- 
// Kullanıcıları Listele
const getUsers = async () => { 
    // console.warn("getUsers fonksiyonu çağrıldı ama implementasyonu eksik olabilir."); // Uyarıyı kaldırabiliriz
    // Gerçek API çağrısı:
    const response = await axios.get(`${API_URL}/users`, getAuthConfig());
    return response.data; // Backend'den gelen veriyi döndür
    // return []; // Kaldırıldı
};

// Kullanıcı Sil 
const deleteUser = async (id) => {
    // console.warn(`deleteUser(${id}) fonksiyonu çağrıldı ama implementasyonu eksik olabilir.`); // Uyarıyı kaldırabiliriz
    const response = await axios.delete(`${API_URL}/users/${id}`, getAuthConfig());
    return response.data; 
};

// Yeni Kullanıcı Oluştur (Admin)
const createUserAdmin = async (userData) => {
    // userData = { name, email, password, role, companyId? }
    const response = await axios.post(`${API_URL}/users`, userData, getAuthConfig());
    return response.data; // Yeni oluşturulan kullanıcıyı döndürür
};

// Kullanıcı Güncelle (Admin)
const updateUserAdmin = async (id, userData) => {
    // userData = { name, email, role?, companyId? }
    // Şifre bu endpoint ile güncellenmez
    const response = await axios.put(`${API_URL}/users/${id}`, userData, getAuthConfig());
    return response.data; // Güncellenmiş kullanıcıyı döndürür
};

// --- Şirket Yönetimi ---

// Şirketleri Listele
const getCompanies = async () => {
    const response = await axios.get(`${API_URL}/companies`, getAuthConfig());
    return response.data;
};

// Şirket Detayı Getir
const getCompanyById = async (id) => {
    const response = await axios.get(`${API_URL}/companies/${id}`, getAuthConfig());
    return response.data;
};

// Şirket Oluştur
const createCompany = async (companyData) => {
    const response = await axios.post(`${API_URL}/companies`, companyData, getAuthConfig());
    return response.data;
};

// Şirket Güncelle
const updateCompany = async (id, companyData) => {
    const response = await axios.put(`${API_URL}/companies/${id}`, companyData, getAuthConfig());
    return response.data;
};

// Şirket Sil
const deleteCompany = async (id) => {
    const response = await axios.delete(`${API_URL}/companies/${id}`, getAuthConfig());
    return response.data;
};

// --- Kart Yönetimi ---

// Kartları Listele (şirkete göre filtreleme opsiyonel)
const getCards = async (companyId = null) => {
    const url = companyId
        ? `${API_URL}/companies/${companyId}/cards`
        : `${API_URL}/cards`;
    const response = await axios.get(url, getAuthConfig());
    return response.data;
};

// Kart Oluştur
const createCard = async (cardData) => {
    const response = await axios.post(`${API_URL}/cards`, cardData, getAuthConfig());
    return response.data;
};

// Kart Güncelle
const updateCard = async (id, cardData) => {
    const response = await axios.put(`${API_URL}/cards/${id}`, cardData, getAuthConfig());
    return response.data;
};

// Kart Sil
const deleteCard = async (id) => {
    const response = await axios.delete(`${API_URL}/cards/${id}`, getAuthConfig());
    return response.data;
};

// --- Diğer Admin İşlemleri Buraya Eklenebilir ---


export {
    // Şirketler
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    // Kartlar
    getCards,
    createCard,
    updateCard,
    deleteCard,
    // Kullanıcılar
    getUsers, 
    deleteUser,
    createUserAdmin,
    updateUserAdmin,
    // Diğerleri
    getDashboardStats,
};