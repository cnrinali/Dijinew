import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

const API_URL = API_ENDPOINTS.USERS; // https://api.dijinew.com/api/users

// Axios instance oluştur (isteğe bağlı, ama token yönetimi için faydalı olabilir)
// Şimdilik basit axios kullanıyoruz, token AuthContext'ten alınmalı veya interceptor ile eklenmeli.

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

// Kullanıcı profilini getir
const getUserProfile = async () => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.get(API_URL + '/profile', config);
    return response.data;
};

// Kullanıcı profilini güncelle (isim, e-posta)
const updateUserProfile = async (userData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    config.headers['Content-Type'] = 'application/json';
    const response = await axios.put(API_URL + '/profile', userData, config);
    return response.data;
};

// Kullanıcı şifresini değiştir
const changePassword = async (passwordData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    config.headers['Content-Type'] = 'application/json';
    // passwordData objesi { currentPassword, newPassword } içermeli
    const response = await axios.put(API_URL + '/change-password', passwordData, config);
    return response.data; // Genellikle sadece başarı mesajı döner { message: '...' }
};

// Kullanıcının banka hesaplarını getir
const getUserBankAccounts = async () => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.get(API_URL + '/bank-accounts', config);
    return response.data;
};

// Yeni banka hesabı ekle
const addUserBankAccount = async (bankData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.post(API_URL + '/bank-accounts', bankData, config);
    return response.data;
};

// Banka hesabını güncelle
const updateUserBankAccount = async (accountId, bankData) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.put(API_URL + `/bank-accounts/${accountId}`, bankData, config);
    return response.data;
};

// Banka hesabını sil
const deleteUserBankAccount = async (accountId) => {
    const config = getAuthConfig();
    if (!config.headers) throw new Error("Yetkilendirme token'ı bulunamadı");
    const response = await axios.delete(API_URL + `/bank-accounts/${accountId}`, config);
    return response.data;
};

const userService = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserBankAccounts,
    addUserBankAccount,
    updateUserBankAccount,
    deleteUserBankAccount,
};

export default userService; 