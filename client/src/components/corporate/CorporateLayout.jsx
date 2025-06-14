import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, Chip, Avatar, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 280;

const menuItems = [
  {
    id: 'dashboard',
    label: 'Genel Bakış',
    icon: <DashboardIcon />,
    path: '/corporate/dashboard',
    description: 'Dashboard ve istatistikler'
  },
  {
    id: 'cards',
    label: 'Kartvizitlerim',
    icon: <CardMembershipIcon />,
    path: '/corporate/cards',
    description: 'Şirket kartvizitlerini yönet'
  },
  {
    id: 'users',
    label: 'Şirket Kullanıcıları',
    icon: <PeopleIcon />,
    path: '/corporate/users',
    description: 'Şirket çalışanlarını yönet'
  },
  {
    id: 'create-card',
    label: 'Yeni Kartvizit',
    icon: <AddIcon />,
    path: '/cards/new',
    description: 'Yeni kartvizit oluştur'
  },
];

function CorporateLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getActiveItem = () => {
    const currentPath = location.pathname;
    if (currentPath === '/corporate/dashboard') return 'dashboard';
    if (currentPath.includes('/corporate/cards') || currentPath === '/corporate/dashboard') return 'cards';
    if (currentPath.includes('/corporate/users')) return 'users';
    if (currentPath === '/cards/new') return 'create-card';
    return 'dashboard';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, backgroundColor: 'secondary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BusinessIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              Kurumsal Panel
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
              Şirket Yönetimi
            </Typography>
          </Box>
        </Box>
        <Chip 
          label="Corporate"
          size="small"
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.75rem'
          }}
        />
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = getActiveItem() === item.id;
            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  py: 1.5,
                  backgroundColor: isActive ? 'secondary.50' : 'transparent',
                  border: isActive ? '1px solid' : '1px solid transparent',
                  borderColor: isActive ? 'secondary.200' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'secondary.100' : 'grey.50',
                    borderColor: isActive ? 'secondary.300' : 'grey.200',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'secondary.main' : 'text.secondary',
                    minWidth: 40,
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'secondary.main' : 'text.primary',
                    fontSize: '0.95rem',
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.8rem',
                    color: 'text.secondary',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 3, backgroundColor: 'grey.50', borderTop: '1px solid', borderColor: 'grey.200' }}>
        {user && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{ 
                  width: 40, 
                  height: 40,
                  backgroundColor: 'secondary.main',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'Corporate User'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<AccountCircleIcon />}
                onClick={() => navigate('/profile')}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  py: 0.5,
                  borderColor: 'grey.300',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    backgroundColor: 'secondary.50',
                  },
                }}
              >
                Profil
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<ExitToAppIcon />}
                onClick={logout}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  py: 0.5,
                  borderColor: 'error.main',
                  color: 'error.main',
                  '&:hover': {
                    borderColor: 'error.dark',
                    backgroundColor: 'error.50',
                    color: 'error.dark',
                  },
                }}
              >
                Çıkış
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ ml: 2, fontWeight: 600 }}>
              Kurumsal Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'white',
              borderRight: '1px solid',
              borderColor: 'grey.200',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'white',
              borderRight: '1px solid',
              borderColor: 'grey.200',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'grey.50',
          minHeight: '100vh',
          ml: isMobile ? 0 : 0,
          mt: isMobile ? 8 : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default CorporateLayout; 