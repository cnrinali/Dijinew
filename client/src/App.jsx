import React from 'react';
import {
  Routes,
  Route,
  Link as RouterLink,
  Navigate
} from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// MUI Bileşenleri
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Sayfalar
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import CardListPage from './pages/CardListPage';
import CreateCardPage from './pages/CreateCardPage';
import EditCardPage from './pages/EditCardPage';
import PublicCardViewPage from './pages/PublicCardViewPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
// Admin sayfaları ve rota koruması
import AdminRoute from './components/AdminRoute'; 
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminCardListPage from './pages/admin/AdminCardListPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  const { isLoggedIn, logout, loading, user } = useAuth(); 

  if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dijinew
          </Typography>

          <Button color="inherit" component={RouterLink} to="/">Ana Sayfa</Button>
          {isLoggedIn && <Button color="inherit" component={RouterLink} to="/cards">Kartvizitlerim</Button>}
          {isLoggedIn && <Button color="inherit" component={RouterLink} to="/profile">Profilim</Button>}
          {/* Yönetim Paneli Linki (Sadece Admin) */} 
          {isLoggedIn && user?.role === 'admin' && (
            <Button color="inherit" component={RouterLink} to="/admin">Yönetim Paneli</Button>
          )}
          
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Giriş Yap</Button>
              <Button color="inherit" component={RouterLink} to="/register">Kayıt Ol</Button>
            </>
          ) : (
            <Button color="inherit" onClick={logout}>Çıkış Yap</Button> 
          )}
        </Toolbar>
      </AppBar>

      <Container 
        component="main" 
        maxWidth={false}
        disableGutters
        sx={{ 
          flexGrow: 1,
          padding: { xs: 1, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
          <Route path="/" element={<HomePage />} /> 
          
          <Route path="/card/:slugOrId" element={<PublicCardViewPage />} />

          <Route 
            path="/cards" 
            element={
              <ProtectedRoute>
                <CardListPage />
              </ProtectedRoute>
            }
          />
           <Route 
            path="/cards/create"
            element={
              <ProtectedRoute>
                <CreateCardPage />
              </ProtectedRoute>
            }
          />
           <Route 
            path="/cards/edit/:id"
            element={
              <ProtectedRoute>
                <EditCardPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile" 
            element={ 
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Yönetici Rotaları */} 
          <Route 
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
           <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <AdminUserListPage />
              </AdminRoute>
            }
          />
           <Route 
            path="/admin/cards" 
            element={
              <AdminRoute>
                <AdminCardListPage />
              </AdminRoute>
            }
          />
          {/* Gelecekte diğer admin rotaları buraya eklenebilir */}

        </Routes>
      </Container>
    </Box>
  );
}

export default App;
