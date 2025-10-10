import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

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
  throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
};

// Admin servisleri için dosya hiyerarşisi ve fonksiyon yapısı güzel düzenlenmiş
// Bu service'i refactor ederken dikkatli olmak gerekiyor.

// Excel export için FormData'yı response type ile kullanmak gerekiyor.
// File download için özel header'lar eklenecek.

const API_URL = API_ENDPOINTS.ADMIN; // https://api.dijinew.com/api/admin

// Admin stats endpoint'i
export const getAdminStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
        }
    };

// User management
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

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

// Excel ve QR Kod İşlemleri
const exportCardsToExcel = async () => {
    const response = await axios.get(`${API_URL}/cards/export`, {
        ...getAuthConfig(),
        responseType: 'blob'
    });
    
    // Dosyayı indir
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kartvizitler.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
};

const importCardsFromExcel = async (formData) => {
    const response = await axios.post(`${API_URL}/cards/import`, formData, {
        ...getAuthConfig(),
        headers: {
            ...getAuthConfig().headers,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const generateBulkQRCodes = async () => {
    const response = await axios.get(`${API_URL}/cards/qr-codes`, {
        ...getAuthConfig(),
        responseType: 'blob'
    });
    
    // ZIP dosyasını indir
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'qr-codes.zip');
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// Tek QR kod indirme fonksiyonu
const generateSingleQRCode = async (cardId) => {
    const response = await axios.get(`${API_URL}/cards/${cardId}/qr`, {
        ...getAuthConfig(),
        responseType: 'blob'
    });
    
    // QR kod dosyasını indir
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Content-Disposition header'ından dosya adını al
    const contentDisposition = response.headers['content-disposition'];
    let filename = `qr-code-${cardId}.png`;
    
    if (contentDisposition) {
        console.log('Content-Disposition header:', contentDisposition);
        
        // filename= veya filename*= formatlarını kontrol et
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
            console.log('Extracted filename:', filename);
        }
    } else {
        console.log('Content-Disposition header bulunamadı');
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log(`QR kod indirildi: ${filename}`);
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
    exportCardsToExcel,
    importCardsFromExcel,
    generateBulkQRCodes,
    generateSingleQRCode
};