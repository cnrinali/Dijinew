import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// 1. Context Oluşturma
const AuthContext = createContext();

// 2. Provider Bileşeni
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Başlangıçta yüklenme durumu

    // Uygulama yüklendiğinde localStorage'dan kullanıcıyı kontrol et
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("localStorage okuma hatası:", error);
            localStorage.removeItem('user'); // Hatalı veriyi temizle
        }
        setLoading(false); // Yükleme tamamlandı
    }, []);

    // Login fonksiyonu
    const login = async (email, password) => {
        try {
            const userData = await authService.login({ email, password });
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData; // Başarı durumunda kullanıcı verisini dön
        } catch (error) {
            console.error("Context login hatası:", error);
            logout(); // Hata durumunda state'i temizle
            throw error; // Hatanın yukarı yayılmasını sağla (formda göstermek için)
        }
    };

    // Register fonksiyonu (kayıt sonrası otomatik login)
    const register = async (name, email, password) => {
        try {
            const userData = await authService.register({ name, email, password });
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Context register hatası:", error);
            logout();
            throw error;
        }
    };

    // Logout fonksiyonu
    const logout = () => {
        authService.logout(); // localStorage'ı temizler
        setUser(null);
    };

    // Kullanıcı bilgilerini context'te güncelle (profil güncelleme sonrası için)
    const updateAuthUser = (updatedData) => {
        setUser(prevUser => {
            if (!prevUser) return null; // Kullanıcı yoksa bir şey yapma

            // Mevcut kullanıcı verisini al, sadece güncellenen alanları değiştir
            const newUser = { ...prevUser, ...updatedData }; 

            // localStorage'ı da güncelle
            try {
                localStorage.setItem('user', JSON.stringify(newUser));
            } catch (error) {
                console.error("localStorage güncelleme hatası (updateAuthUser):", error);
                // Opsiyonel: Hata durumunda state'i geri al veya log tut
            }

            return newUser;
        });
    };

    // Context Değerleri
    const value = {
        user,
        isLoggedIn: !!user, // user null değilse true
        loading, // Yüklenme durumunu context'e ekle
        login,
        register,
        logout,
        updateAuthUser // Yeni fonksiyonu ekle
    };

    // Provider ile çocuk bileşenleri sar
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Custom Hook (Context'i kolayca kullanmak için)
export const useAuth = () => {
    return useContext(AuthContext);
}; 