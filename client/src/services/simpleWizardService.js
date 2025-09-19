import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

const SIMPLE_WIZARD_API_URL = API_ENDPOINTS.SIMPLE_WIZARD;

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

// Basit sihirbaz oluştur (Admin/Corporate için)
const createSimpleWizard = async (email) => {
    const config = getAuthConfig();
    const response = await axios.post(`${SIMPLE_WIZARD_API_URL}/create`, {
        email
    }, config);
    return response.data;
};

// Token ile kart bilgilerini getir (Herkese açık)
const getCardByToken = async (token) => {
    const response = await axios.get(`${SIMPLE_WIZARD_API_URL}/card/${token}`);
    return response.data;
};

// Token ile kart bilgilerini güncelle (Herkese açık)
const updateCardByToken = async (token, cardData) => {
    const response = await axios.put(`${SIMPLE_WIZARD_API_URL}/card/${token}`, cardData);
    return response.data;
};

// Kullanıcının sihirbazlarını listele (Admin/Corporate için)
const getUserSimpleWizards = async () => {
    const config = getAuthConfig();
    const response = await axios.get(`${SIMPLE_WIZARD_API_URL}/my-wizards`, config);
    return response.data;
};

const simpleWizardService = {
    createSimpleWizard,
    getCardByToken,
    updateCardByToken,
    getUserSimpleWizards
};

export default simpleWizardService;
