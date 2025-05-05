import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Bu bileşen, belirli rollere sahip kullanıcıların erişebileceği route'ları korur.
// Eğer kullanıcı giriş yapmamışsa veya rolü uygun değilse login sayfasına yönlendirir.
// children yerine <Outlet /> kullanmak, iç içe route yapısını destekler.

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) {
        // AuthContext hala kullanıcıyı kontrol ediyorsa bekleme göster
        // veya null dönerek App.jsx'deki genel yüklenme durumuna bırak
        return <div>Yükleniyor...</div>; // Veya <CircularProgress />
    }

    if (!isLoggedIn) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        console.log('ProtectedRoute: Kullanıcı giriş yapmamış, /login yönlendiriliyor.');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Kullanıcının rolü izin verilenler arasında değilse
        console.log(`ProtectedRoute: Yetkisiz rol (${user?.role}), /unauthorized veya / adresine yönlendiriliyor.`);
        // Yetkisiz sayfasına veya ana sayfaya yönlendir
        return <Navigate to="/unauthorized" replace />; // veya to="/"
    }

    // Kullanıcı giriş yapmış ve rolü uygunsa, route'un içeriğini göster
    return <Outlet />; // Outlet, Route içindeki child elementleri render eder
};

export default ProtectedRoute; 