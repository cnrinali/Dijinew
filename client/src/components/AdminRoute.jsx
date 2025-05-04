import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const AdminRoute = ({ children }) => {
    const { isLoggedIn, user, loading } = useAuth();

    if (loading) {
        // AuthContext yüklenirken bekle
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isLoggedIn) {
        // Giriş yapılmamışsa login sayfasına yönlendir
        console.log('AdminRoute: Kullanıcı giriş yapmamış, /login sayfasına yönlendiriliyor.');
        return <Navigate to="/login" replace />;
    }

    // Kullanıcı bilgisi var mı ve rolü admin mi kontrol et
    if (!user || user.role !== 'admin') {
        // Giriş yapılmış ama admin değilse veya kullanıcı bilgisi eksikse
        console.log('AdminRoute: Kullanıcı admin değil veya bilgi eksik.', user);
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Bu sayfaya erişim yetkiniz bulunmamaktadır.
                </Alert>
            </Box>
        );
        // Veya ana sayfaya yönlendir:
        // return <Navigate to="/" replace />;
    }

    // Giriş yapılmış ve admin ise, children (korunan sayfa) render edilir
    console.log('AdminRoute: Kullanıcı admin, children render ediliyor.', user);
    // children prop'u varsa onu kullan, yoksa Outlet'i render et (nested route'lar için)
    return children ? children : <Outlet />; 
};

export default AdminRoute; 