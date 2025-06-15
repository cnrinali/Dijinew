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
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';

const drawerWidth = 280;

const menuItems = [
  {
    id: 'dashboard',
    label: 'Genel Bakış',
    icon: <DashboardIcon />,
    path: '/admin/dashboard',
    description: 'Ana dashboard ve istatistikler'
  },
  {
    id: 'users',
    label: 'Kullanıcı Yönetimi',
    icon: <PeopleIcon />,
    path: '/admin/users',
    description: 'Kullanıcıları görüntüle ve yönet'
  },
  {
    id: 'cards',
    label: 'Kartvizit Yönetimi',
    icon: <CardMembershipIcon />,
    path: '/admin/cards',
    description: 'Tüm kartvizitleri yönet'
  },
  {
    id: 'companies',
    label: 'Şirket Yönetimi',
    icon: <BusinessIcon />,
    path: '/admin/companies',
    description: 'Şirketleri görüntüle ve yönet'
  },
  {
    id: 'create-card',
    label: 'Yeni Kartvizit',
    icon: <AddIcon />,
    path: '/admin/cards/new',
    description: 'Yeni kartvizit oluştur'
  },
  {
    id: 'activities',
    label: 'Sistem Aktiviteleri',
    icon: <HistoryIcon />,
    path: '/admin/activities',
    description: 'Tüm sistem aktivitelerini görüntüle'
  },
];

function AdminLayout({ children }) {
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
    return menuItems.find(item => 
      item.path === currentPath || 
      (item.id === 'dashboard' && currentPath === '/admin/dashboard')
    )?.id || 'dashboard';
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
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
            <SettingsIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              Admin Panel
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
              Sistem Yönetimi
            </Typography>
          </Box>
        </Box>
        <Chip 
          label="Administrator"
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
                  backgroundColor: isActive ? 'primary.50' : 'transparent',
                  border: isActive ? '1px solid' : '1px solid transparent',
                  borderColor: isActive ? 'primary.200' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.100' : 'grey.50',
                    borderColor: isActive ? 'primary.300' : 'grey.200',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
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
                    color: isActive ? 'primary.main' : 'text.primary',
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
                  backgroundColor: 'primary.main',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'Admin User'}
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
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    backgroundColor: 'primary.50',
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
            
            <Divider sx={{ my: 2 }} />
          </>
        )}
        
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          DijiCard Admin v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: '1px solid',
              borderColor: 'grey.200',
              boxShadow: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 8, lg: 0 }, // Account for mobile app bar
        }}
      >
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout; 