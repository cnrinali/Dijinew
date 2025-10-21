import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { lightTheme, darkTheme } from './theme/modernTheme';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminCompanyListPage from './pages/admin/CompanyManagementPage';
import CardManagementPage from './pages/admin/CardManagementPage';
import AdminCardCreatePage from './pages/admin/AdminCardCreatePage';
import AdminActivitiesPage from './components/admin/AdminActivitiesPage';
import AdminLayout from './components/admin/AdminLayout';
import CorporateLayout from './components/corporate/CorporateLayout';
import UserLayout from './components/user/UserLayout';
import CorporateActivitiesPage from './components/corporate/CorporateActivitiesPage';
import UserProfilePage from './pages/ProfilePage';
import CorporateDashboardPage from './pages/corporate/CorporateDashboardPage';
import CorporateHomePage from './pages/corporate/CorporateHomePage';
import CorporateCardsPage from './pages/corporate/CorporateCardsPage';
import CorporateUserManagementPage from './pages/corporate/CorporateUserManagementPage';
import { NotificationProvider } from './context/NotificationContext.jsx';
import ThemeToggle from './components/ThemeToggle';
import QrCardPage from './pages/QrCardPage';
import CardListPage from './pages/CardListPage';
import PublicCardViewPage from './pages/PublicCardViewPage';
import CreateCardPage from './pages/CreateCardPage';
import EditCardPage from './pages/EditCardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CardWizard from './components/CardWizard';
import CardCreationChoicePage from './pages/CardCreationChoicePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MyDigitalCardPage from './pages/MyDigitalCardPage';

const navItems = [
  { label: 'Dijital Kartım', path: '/cards', roles: ['user'] },
  { label: 'Kurumsal Panel', path: '/corporate/dashboard', roles: ['corporate'] },
];

function AppContent() {
  const { user, logout, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
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

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isAdminRoute = location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/corporate') ||
                      (location.pathname === '/profile' && user?.role === 'admin') ||
                      (location.pathname.startsWith('/cards/') && user?.role === 'corporate') ||
                      (location.pathname.startsWith('/cards/') && user?.role === 'admin');

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

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      <NotificationProvider>
        <Routes>
                        {/* Public card view without navbar */}
                <Route path="/card/:slug" element={<PublicCardViewPage />} />
                <Route path="/card/my-digital-card" element={<MyDigitalCardPage />} />
                <Route path="/qr/:slug" element={<QrCardPage />} />

                {/* Card Wizard - Public route for new users */}
                <Route path="/wizard/:cardSlug" element={<CardWizard />} />


        {/* All other routes with navbar */}
        <Route path="*" element={
          <>
                    {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/cards') && !(user?.role === 'user' && (location.pathname === '/profile' || location.pathname === '/analytics')) && (
                      <AppBar position="static" sx={{ boxShadow: 2 }}>
              <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
                  {!location.pathname.startsWith('/corporate') &&
                   !(user?.role === 'corporate' && location.pathname === '/analytics') && (
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
                          background: 'linear-gradient(135deg, #F4C734 0%, #B58505 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '1.25rem', sm: '1.5rem' }
                        }}
                      >
                        Dijinew
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleOpenNavMenu}
                      color="inherit"
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: 'primary.50'
                        }
                      }}
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
                          minWidth: 200
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
                      {!(user?.role === 'corporate' && location.pathname === '/analytics') &&
                       filteredNavItems.map((item) => (
                        <MenuItem key={item.label} onClick={handleCloseNavMenu} component={RouterLink} to={item.path}>
                          <Typography textAlign="center">{item.label}</Typography>
                        </MenuItem>
                      ))}
                      <MenuItem onClick={handleCloseNavMenu} sx={{ justifyContent: 'center', py: 1 }}>
                        <ThemeToggle size="small" />
                      </MenuItem>
                      {user && (
                         <MenuItem onClick={() => { logout(); handleCloseNavMenu(); }}>
                           <Typography textAlign="center">Çıkış Yap</Typography>
                         </MenuItem>
                       )}
                    </Menu>
                  </Box>
                  {!(user?.role === 'corporate' && location.pathname === '/analytics') && (
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
                          background: 'linear-gradient(135deg, #F4C734 0%, #B58505 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Dijinew
                      </Typography>
                    </Box>
                  )}
                  {!location.pathname.startsWith('/corporate') &&
                   !(user?.role === 'corporate' && location.pathname === '/analytics') && (
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
                      {filteredNavItems.map((item) => (
                        <Button
                          key={item.label}
                          component={RouterLink}
                          to={item.path}
                          onClick={handleCloseNavMenu}
                          sx={{
                            mx: 0.5,
                            px: 2,
                            py: 1,
                            color: 'text.secondary',
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 1,
                            transition: 'all 0.2s ease-in-out',
                            fontSize: '0.875rem',
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
                  )}

                  {user && (
                    <Box sx={{
                      flexGrow: location.pathname.startsWith('/corporate') || (user?.role === 'corporate' && location.pathname === '/analytics') ? 1 : 0,
                      display: { xs: 'none', md: 'flex' },
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: location.pathname.startsWith('/corporate') || (user?.role === 'corporate' && location.pathname === '/analytics') ? 'flex-end' : 'flex-start'
                    }}>
                      <ThemeToggle />

                      {/* User Profile Dropdown */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={handleOpenUserMenu}
                          sx={{
                            p: 0,
                            '&:hover': {
                              backgroundColor: 'transparent'
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: 'primary.main',
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </Avatar>
                        </IconButton>

                        <Menu
                          anchorEl={anchorElUser}
                          open={Boolean(anchorElUser)}
                          onClose={handleCloseUserMenu}
                          PaperProps={{
                            sx: {
                              mt: 1.5,
                              minWidth: 200,
                              borderRadius: 2,
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                              border: '1px solid',
                              borderColor: 'divider'
                            }
                          }}
                        >
                          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {user.name || 'Corporate User'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {user.email}
                            </Typography>
                          </Box>

                          <MenuItem
                            onClick={() => {
                              handleCloseUserMenu();
                              // Navigate to profile
                            }}
                            sx={{ py: 1.5, px: 2 }}
                          >
                            <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Profil
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              handleCloseUserMenu();
                              logout();
                            }}
                            sx={{
                              py: 1.5,
                              px: 2,
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.50'
                              }
                            }}
                          >
                            <ExitToAppIcon sx={{ mr: 1.5, fontSize: 20 }} />
                            Çıkış
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Box>
                  )}

                  {/* Mobile User Profile */}
                  {user && (
                    <Box sx={{
                      flexGrow: location.pathname.startsWith('/corporate') || (user?.role === 'corporate' && location.pathname === '/analytics') ? 1 : 0,
                      display: { xs: 'flex', md: 'none' },
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: location.pathname.startsWith('/corporate') || (user?.role === 'corporate' && location.pathname === '/analytics') ? 'flex-end' : 'flex-start'
                    }}>
                      <ThemeToggle />

                      <IconButton
                        onClick={handleOpenUserMenu}
                        sx={{
                          p: 0,
                          '&:hover': {
                            backgroundColor: 'transparent'
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            backgroundColor: 'primary.main',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </Avatar>
                      </IconButton>
                    </Box>
                  )}
              </Toolbar>
              </Container>
            </AppBar>
            )}

            <Container
              component="main"
              maxWidth={false}
              disableGutters
              sx={{
                py: 0,
                px: 0,
                minHeight: isAdminRoute ? '100vh' : 'auto'
              }}
            >
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
                      <Navigate to="/login" replace />
                    )
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
                <Route path="/profile" element={
                  user ? (
                    user.role === 'admin' ? (
                      <AdminLayout><UserProfilePage /></AdminLayout>
                    ) : user.role === 'corporate' ? (
                      <CorporateLayout><UserProfilePage /></CorporateLayout>
                    ) : (
                      <UserLayout><UserProfilePage /></UserLayout>
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
                <Route path="/admin/cards/new" element={user && user.role === 'admin' ? <AdminLayout><CardCreationChoicePage /></AdminLayout> : <Navigate to="/login" />} />
                <Route path="/admin/cards/new-manual" element={user && user.role === 'admin' ? <AdminLayout><CreateCardPage /></AdminLayout> : <Navigate to="/login" />} />
                <Route path="/admin/activities" element={user && user.role === 'admin' ? <AdminLayout><AdminActivitiesPage /></AdminLayout> : <Navigate to="/login" />} />

                {/* Corporate Routes */}
                <Route path="/corporate" element={user && user.role === 'corporate' && user.companyId ? <CorporateLayout><CorporateHomePage /></CorporateLayout> : <Navigate to="/login" />} />
                <Route path="/corporate/dashboard" element={user && user.role === 'corporate' && user.companyId ? <CorporateLayout><CorporateDashboardPage /></CorporateLayout> : <Navigate to="/login" />} />
                <Route path="/corporate/cards" element={user && user.role === 'corporate' && user.companyId ? <CorporateLayout><CorporateCardsPage /></CorporateLayout> : <Navigate to="/login" />} />
                <Route path="/corporate/users" element={user && user.role === 'corporate' && user.companyId ? <CorporateLayout><CorporateUserManagementPage /></CorporateLayout> : <Navigate to="/login" />} />
                <Route path="/corporate/activities" element={user && user.role === 'corporate' && user.companyId ? <CorporateLayout><CorporateActivitiesPage /></CorporateLayout> : <Navigate to="/login" />} />

                {/* User Routes */}
                <Route path="/cards" element={user && user.role === 'user' ? <UserLayout><CardListPage /></UserLayout> : <Navigate to="/login" />} />
                <Route path="/analytics" element={
                  user && (user.role === 'user' || user.role === 'corporate' || user.role === 'admin') ? (
                    user.role === 'corporate' ? (
                      <CorporateLayout><AnalyticsPage /></CorporateLayout>
                    ) : user.role === 'admin' ? (
                      <AdminLayout><AnalyticsPage /></AdminLayout>
                    ) : (
                      <UserLayout><AnalyticsPage /></UserLayout>
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                } />
                <Route path="/cards/new" element={
                  user && (user.role === 'corporate' || user.role === 'admin') ? (
                    user.role === 'corporate' ? (
                      <CorporateLayout><CardCreationChoicePage /></CorporateLayout>
                    ) : user.role === 'admin' ? (
                      <AdminLayout><CardCreationChoicePage /></AdminLayout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                } />
                <Route path="/cards/new-manual" element={
                  user && (user.role === 'corporate' || user.role === 'admin') ? (
                    user.role === 'corporate' ? (
                      <CorporateLayout><CreateCardPage /></CorporateLayout>
                    ) : user.role === 'admin' ? (
                      <AdminLayout><CreateCardPage /></AdminLayout>
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                } />
                <Route path="/cards/edit/:id" element={
                  user && (user.role === 'user' || user.role === 'corporate' || user.role === 'admin') ? (
                    user.role === 'corporate' ? (
                      <CorporateLayout><EditCardPage /></CorporateLayout>
                    ) : user.role === 'admin' ? (
                      <AdminLayout><EditCardPage /></AdminLayout>
                    ) : (
                      <UserLayout><EditCardPage /></UserLayout>
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Container>
          </>
        } />
        </Routes>
      </NotificationProvider>
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
