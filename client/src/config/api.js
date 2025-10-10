// API Base URL konfigürasyonu
const getApiBaseUrl = () => {
  // Öncelik: VITE_API_URL tanımlıysa onu kullan
  const envUrl = import.meta?.env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, '');
  }

  // Aksi halde moda göre varsayılana düş
  const isDevelopment = import.meta.env.MODE === 'development';
  if (isDevelopment) {
    return 'http://localhost:5001';
  }

  return 'https://api.dijinew.com';
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