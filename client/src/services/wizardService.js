import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

const WIZARD_API_URL = API_ENDPOINTS.WIZARD;

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

// Wizard token oluştur (Admin/Corporate için)
const createWizardToken = async (type, expiryDays = 7) => {
    const config = getAuthConfig();
    const response = await axios.post(`${WIZARD_API_URL}/create`, {
        type,
        expiryDays
    }, config);
    return response.data;
};

// Token doğrula (Herkese açık)
const validateWizardToken = async (token) => {
    const response = await axios.get(`${WIZARD_API_URL}/validate/${token}`);
    return response.data;
};

// Token'ı kullanıldı olarak işaretle
const markTokenAsUsed = async (token) => {
    // Kullanıcı giriş yapmış olabilir, o yüzden auth header göndermeye çalış
    let config = {};
    try {
        config = getAuthConfig();
    } catch {
        // Kullanıcı giriş yapmamış olabilir, sorun değil
    }
    
    const response = await axios.put(`${WIZARD_API_URL}/use/${token}`, {}, config);
    return response.data;
};

// Kullanıcının token'larını listele (Admin/Corporate için)
const getUserWizardTokens = async () => {
    const config = getAuthConfig();
    const response = await axios.get(`${WIZARD_API_URL}/my-tokens`, config);
    return response.data;
};

const wizardService = {
    createWizardToken,
    validateWizardToken,
    markTokenAsUsed,
    getUserWizardTokens
};

export default wizardService; 