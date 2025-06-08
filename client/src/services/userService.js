import axios from 'axios';

const API_URL = '/api/users'; // Temel kullanıcı API yolu

// Axios instance oluştur (isteğe bağlı, ama token yönetimi için faydalı olabilir)
// Şimdilik basit axios kullanıyoruz, token AuthContext'ten alınmalı veya interceptor ile eklenmeli.

// Token'ı al
const getAuthHeaders = () => {
    return {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
        'Content-Type': 'application/json',
    };
};

// Kullanıcı profilini getir
const getUserProfile = async () => {
    const config = {
        headers: {
            // Token'ı local storage'dan veya AuthContext'ten al
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
        },
    };
    const response = await axios.get(API_URL + '/profile', config);
    return response.data;
};

// Kullanıcı profilini güncelle (isim, e-posta)
const updateUserProfile = async (userData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.put(API_URL + '/profile', userData, config);
    return response.data;
};

// Kullanıcı şifresini değiştir
const changePassword = async (passwordData) => {
     const config = {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
            'Content-Type': 'application/json',
        },
    };
    // passwordData objesi { currentPassword, newPassword } içermeli
    const response = await axios.put(API_URL + '/change-password', passwordData, config);
    return response.data; // Genellikle sadece başarı mesajı döner { message: '...' }
};

// Kullanıcının banka hesaplarını getir
const getUserBankAccounts = async () => {
    const config = {
        headers: getAuthHeaders(),
    };
    const response = await axios.get(API_URL + '/bank-accounts', config);
    return response.data;
};

// Yeni banka hesabı ekle
const addUserBankAccount = async (bankData) => {
    const config = {
        headers: getAuthHeaders(),
    };
    const response = await axios.post(API_URL + '/bank-accounts', bankData, config);
    return response.data;
};

// Banka hesabını güncelle
const updateUserBankAccount = async (accountId, bankData) => {
    const config = {
        headers: getAuthHeaders(),
    };
    const response = await axios.put(API_URL + `/bank-accounts/${accountId}`, bankData, config);
    return response.data;
};

// Banka hesabını sil
const deleteUserBankAccount = async (accountId) => {
    const config = {
        headers: getAuthHeaders(),
    };
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