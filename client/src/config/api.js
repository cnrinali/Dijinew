// API Base URL konfigürasyonu - Merkezi URL Yönetimi
const getApiBaseUrl = () => {
  // 1. Environment variable'dan al (en yüksek öncelik)
  if (import.meta.env.VITE_BACKEND_API_URL) {
    console.log('🔗 Using VITE_BACKEND_API_URL from environment:', import.meta.env.VITE_BACKEND_API_URL);
    return import.meta.env.VITE_BACKEND_API_URL;
  }

  // 2. Development ortamı kontrolü
  const isDevelopment = import.meta.env.MODE === 'development';
  
  if (isDevelopment) {
    console.log('🔗 Using development backend URL: http://localhost:5001');
    return 'http://localhost:5001';
  } else {
    // 3. Production environment
    console.log('🔗 Using production backend URL: https://dijinew-api.vercel.app');
    return 'https://dijinew-api.vercel.app';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Endpoint'ler
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  USERS: `${API_BASE_URL}/api/users`,
  CARDS: `${API_BASE_URL}/api/cards`,
  ADMIN: `${API_BASE_URL}/api/admin`,
  CORPORATE: `${API_BASE_URL}/api/corporate`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  PUBLIC: `${API_BASE_URL}/api/public`,
  WIZARD: `${API_BASE_URL}/api/wizard`,
  SIMPLE_WIZARD: `${API_BASE_URL}/api/simple-wizard`
};

export default API_BASE_URL; 