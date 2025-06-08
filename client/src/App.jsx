import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminCompanyListPage from './pages/admin/CompanyManagementPage';
import AdminCardListPage from './pages/admin/AdminCardListPage';
import AdminCardCreatePage from './pages/admin/AdminCardCreatePage';
import UserProfilePage from './pages/ProfilePage';
import CorporateDashboardPage from './pages/corporate/CorporateDashboardPage';
import { NotificationProvider } from './context/NotificationContext.jsx';
import QrCardPage from './pages/QrCardPage';
import CardListPage from './pages/CardListPage';
import PublicCardViewPage from './pages/PublicCardViewPage';
import CreateCardPage from './pages/CreateCardPage';
import EditCardPage from './pages/EditCardPage';

const navItems = [
  { label: 'Ana Sayfa', path: '/', public: true },
  { label: 'Giriş Yap', path: '/login', public: true, hideWhenLoggedIn: true },
  { label: 'Kayıt Ol', path: '/register', public: true, hideWhenLoggedIn: true },
  { label: 'Profilim', path: '/profile', roles: ['user', 'admin', 'corporate'] }, 
  { label: 'Admin Panel', path: '/admin/dashboard', roles: ['admin'] },
  { label: 'Kurumsal Panel', path: '/corporate/dashboard', roles: ['corporate'] },
];

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  if (loading) {
    return null;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.public) {
      return !(item.hideWhenLoggedIn && user);
    }
    if (user && item.roles && item.roles.includes(user.role)) {
      if (item.label === 'Kurumsal Panel' && user.role === 'corporate' && !user.companyId && user.role !== 'admin' && user.role !== 'user') {
        return false;
      }
      return true;
    }
    return false;
  });

  return (
    <NotificationProvider>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
          </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {filteredNavItems.map((item) => (
                  <MenuItem key={item.label} onClick={handleCloseNavMenu} component={RouterLink} to={item.path}>
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
                {user && (
                   <MenuItem onClick={() => { logout(); handleCloseNavMenu(); }}>
                     <Typography textAlign="center">Çıkış Yap</Typography>
                   </MenuItem>
                 )}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {filteredNavItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {user && (
              <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" onClick={logout}>Çıkış Yap</Button> 
              </Box>
          )}
        </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" sx={{ mt: 2, mb: 2 }}>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={user ? <UserProfilePage /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={user && user.role === 'admin' ? <AdminUserListPage /> : <Navigate to="/login" />} />
          <Route path="/admin/companies" element={user && user.role === 'admin' ? <AdminCompanyListPage /> : <Navigate to="/login" />} />
          <Route path="/admin/cards" element={user && user.role === 'admin' ? <AdminCardListPage /> : <Navigate to="/login" />} />
          <Route path="/admin/cards/new" element={user && user.role === 'admin' ? <AdminCardCreatePage /> : <Navigate to="/login" />} />

          {/* Corporate Routes */}
          <Route path="/corporate/dashboard" element={user && user.role === 'corporate' && user.companyId ? <CorporateDashboardPage /> : <Navigate to="/login" />} />

          {/* User Routes */}
          <Route path="/cards" element={user && user.role === 'user' ? <CardListPage /> : <Navigate to="/login" />} />
          <Route path="/cards/new" element={user && (user.role === 'user' || user.role === 'corporate' || user.role === 'admin') ? <CreateCardPage /> : <Navigate to="/login" />} />
          <Route path="/cards/edit/:id" element={user && (user.role === 'user' || user.role === 'corporate' || user.role === 'admin') ? <EditCardPage /> : <Navigate to="/login" />} />

          {/* QR Card Route */}
          <Route path="/qr/:slug" element={<QrCardPage />} />
          <Route path="/card/:slug" element={<PublicCardViewPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
