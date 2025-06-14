import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import { AuthProvider, useAuth } from './context/AuthContext';
import modernTheme from './theme/modernTheme';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminCompanyListPage from './pages/admin/CompanyManagementPage';
import CardManagementPage from './pages/admin/CardManagementPage';
import AdminCardCreatePage from './pages/admin/AdminCardCreatePage';
import AdminLayout from './components/admin/AdminLayout';
import UserProfilePage from './pages/ProfilePage';
import CorporateDashboardPage from './pages/corporate/CorporateDashboardPage';
import { NotificationProvider } from './context/NotificationContext.jsx';
import QrCardPage from './pages/QrCardPage';
import CardListPage from './pages/CardListPage';
import PublicCardViewPage from './pages/PublicCardViewPage';
import CreateCardPage from './pages/CreateCardPage';
import EditCardPage from './pages/EditCardPage';

const navItems = [
  { label: 'Ana Sayfa', path: '/home', public: true },
  { label: 'Giriş Yap', path: '/login', public: true, hideWhenLoggedIn: true },
  { label: 'Kayıt Ol', path: '/register', public: true, hideWhenLoggedIn: true },
  { label: 'Profilim', path: '/profile', roles: ['user', 'admin', 'corporate'] },
  { label: 'Dijital Kartım', path: '/cards', roles: ['user'] },
  { label: 'Admin Panel', path: '/admin/dashboard', roles: ['admin'] },
  { label: 'Kurumsal Panel', path: '/corporate/dashboard', roles: ['corporate'] },
];

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const location = useLocation();

  if (loading) {
    return null;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || 
                      (location.pathname === '/profile' && user?.role === 'admin');

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
      <Routes>
        {/* Public card view without navbar */}
        <Route path="/card/:slug" element={<PublicCardViewPage />} />
        <Route path="/qr/:slug" element={<QrCardPage />} />
        
        {/* All other routes with navbar */}
        <Route path="*" element={
          <>
            {!isAdminRoute && (
              <AppBar position="static">
              <Container maxWidth="xl">
                <Toolbar disableGutters>
                  <Box
                    component={RouterLink}
                    to="/"
                    sx={{
                      mr: 2,
                      display: { xs: 'none', md: 'flex' },
                      alignItems: 'center',
                      textDecoration: 'none',
                      gap: 1,
                    }}
                  >
                    <BusinessIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontFamily: 'Inter, sans-serif',
                        background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      DijiCard
                    </Typography>
                  </Box>

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
                        '& .MuiPaper-root': {
                          borderRadius: 2,
                          mt: 1,
                          border: '1px solid',
                          borderColor: 'grey.200',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        },
                        '& .MuiMenuItem-root': {
                          py: 1.5,
                          px: 3,
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: 'text.secondary',
                          '&:hover': {
                            backgroundColor: 'primary.50',
                            color: 'primary.main',
                          },
                        },
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
                  <Box
                    component={RouterLink}
                    to="/"
                    sx={{
                      mr: 2,
                      display: { xs: 'flex', md: 'none' },
                      flexGrow: 1,
                      alignItems: 'center',
                      textDecoration: 'none',
                      gap: 1,
                    }}
                  >
                    <BusinessIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontFamily: 'Inter, sans-serif',
                        background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      DijiCard
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    {filteredNavItems.map((item) => (
                      <Button
                        key={item.label}
                        component={RouterLink}
                        to={item.path}
                        onClick={handleCloseNavMenu}
                        sx={{ 
                          mx: 1,
                          px: 2,
                          py: 1,
                          color: 'text.secondary',
                          textTransform: 'none',
                          fontWeight: 500,
                          borderRadius: 2,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'primary.50',
                            color: 'primary.main',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>

                  {user && (
                    <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                      <Button 
                        onClick={logout}
                        variant="outlined"
                        sx={{ 
                          ml: 2,
                          borderColor: 'error.main',
                          color: 'error.main',
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: 'error.dark',
                            backgroundColor: 'error.50',
                            color: 'error.dark',
                          },
                        }}
                      >
                        Çıkış Yap
                      </Button> 
                    </Box>
                  )}
              </Toolbar>
              </Container>
            </AppBar>
            )}

            <Container component="main" maxWidth={false} sx={{ py: 0, px: isAdminRoute ? 0 : 3, minHeight: isAdminRoute ? '100vh' : 'calc(100vh - 64px)' }}>
              <Routes>
                <Route path="/" element={
                  user ? (
                    user.role === 'admin' ? (
                      <Navigate to="/admin/dashboard" replace />
                    ) : user.role === 'corporate' && user.companyId ? (
                      <Navigate to="/corporate/dashboard" replace />
                    ) : user.role === 'user' ? (
                      <Navigate to="/cards" replace />
                    ) : (
                      <HomePage />
                    )
                  ) : (
                    <HomePage />
                  )
                } /> 
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={
                  user ? (
                    user.role === 'admin' ? (
                      <AdminLayout><UserProfilePage /></AdminLayout>
                    ) : (
                      <UserProfilePage />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminLayout><AdminDashboardPage /></AdminLayout> : <Navigate to="/login" />} />
                <Route path="/admin/users" element={user && user.role === 'admin' ? <AdminLayout><AdminUserListPage /></AdminLayout> : <Navigate to="/login" />} />
                <Route path="/admin/companies" element={user && user.role === 'admin' ? <AdminLayout><AdminCompanyListPage /></AdminLayout> : <Navigate to="/login" />} />
                <Route path="/admin/cards" element={user && user.role === 'admin' ? <AdminLayout><CardManagementPage /></AdminLayout> : <Navigate to="/login" />} />
                <Route path="/admin/cards/new" element={user && user.role === 'admin' ? <AdminLayout><AdminCardCreatePage /></AdminLayout> : <Navigate to="/login" />} />

                {/* Corporate Routes */}
                <Route path="/corporate/dashboard" element={user && user.role === 'corporate' && user.companyId ? <CorporateDashboardPage /> : <Navigate to="/login" />} />

                {/* User Routes */}
                <Route path="/cards" element={user && user.role === 'user' ? <CardListPage /> : <Navigate to="/login" />} />
                <Route path="/cards/new" element={user && (user.role === 'user' || user.role === 'corporate' || user.role === 'admin') ? <CreateCardPage /> : <Navigate to="/login" />} />
                <Route path="/cards/edit/:id" element={user && (user.role === 'user' || user.role === 'corporate' || user.role === 'admin') ? <EditCardPage /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
          </>
        } />
      </Routes>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
