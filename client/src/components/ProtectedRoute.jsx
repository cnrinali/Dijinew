import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // AuthContext'in yolu doğru varsayıldı

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // Auth durumu yüklenirken bekleme durumu gösterilebilir
    return <div>Yükleniyor...</div>; 
  }

  if (!isLoggedIn) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    // `replace` prop'u tarayıcı geçmişinde gereksiz bir giriş oluşturmaz
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı giriş yapmışsa istenen bileşeni (children) göster
  console.log('ProtectedRoute: Kullanıcı giriş yapmış, children render ediliyor.');
  return children;
}

export default ProtectedRoute; 