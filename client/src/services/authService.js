import axios from 'axios';

const API_URL = '/api/auth/'; // Vite proxy ayarı ile bu çalışacak (sonra ayarlanacak)
// veya const API_URL = 'http://localhost:5001/api/auth/'; // Tam URL

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    // Not: Başarılı kayıttan sonra token'ı local storage'a kaydetmek yaygındır
    if (response.data && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
    // Gerekirse backend'e de logout isteği atılabilir
    // await axios.post(API_URL + 'logout');
};

// Forgot password request
const forgotPassword = async (emailData) => {
    // emailData = { email: 'user@example.com' }
    const response = await axios.post(API_URL + 'forgot', emailData);
    return response.data; // Sadece mesaj dönecek: { message: '...' }
};

// Reset password
const resetPassword = async (resetData) => {
    // resetData = { password: 'newPassword123' }
    // resetToken URL'den alınacak
    const { resetToken, password } = resetData;
    const response = await axios.put(API_URL + 'reset/' + resetToken, { password });
    return response.data; // { message: 'Şifreniz başarıyla güncellendi.' }
};

// TODO: Forgot password ve Reset password servis fonksiyonları eklenebilir

const authService = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
};

export default authService; 