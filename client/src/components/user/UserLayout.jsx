import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    useTheme,
    useMediaQuery,
    Typography,
    AppBar,
    Toolbar,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    CreditCard as CardIcon,
    BarChart as BarChartIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';

const drawerWidth = 280;

const menuItems = [
    {
        id: 'cards',
        label: 'Dijital Kartlarım',
        icon: <CardIcon />,
        path: '/cards',
        description: 'Kartvizitlerimi yönet'
    },
    {
        id: 'analytics',
        label: 'İstatistikler',
        icon: <BarChartIcon />,
        path: '/analytics',
        description: 'Analiz ve istatistikler'
    },
    {
        id: 'profile',
        label: 'Profilim',
        icon: <PersonIcon />,
        path: '/profile',
        description: 'Hesap ayarları'
    }
];

function UserLayout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleProfileMenuClose();
    };

    const getActiveItem = () => {
        const currentPath = location.pathname;
        if (currentPath.includes('/cards')) return 'cards';
        if (currentPath === '/analytics') return 'analytics';
        if (currentPath === '/profile') return 'profile';
        return 'cards';
    };

    const drawer = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.default'
        }}>
            {/* Logo Section */}
            <Box
                sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    minHeight: 64
                }}
            >
                <BusinessIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: 'text.primary'
                    }}
                >
                    Dijinew
                </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ py: 1, px: 2, flex: 1 }}>
                <List sx={{ height: '100%', overflow: 'hidden' }}>
                    {menuItems.map((item) => {
                        const isActive = getActiveItem() === item.id;
                        return (
                            <ListItemButton
                                key={item.id}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                sx={{
                                    mb: 1.5,
                                    py: 1.5,
                                    px: 2,
                                    borderRadius: 2,
                                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 36,
                                        color: isActive ? 'white' : 'text.secondary',
                                        '& svg': {
                                            fontSize: 18
                                        }
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                        fontWeight: isActive ? 600 : 500
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile Menu Button */}
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'fixed',
                        top: 16,
                        left: 16,
                        zIndex: 1201,
                        backgroundColor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* Drawer for Mobile */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        backgroundColor: 'background.default',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Drawer for Desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'background.default',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)'
                    },
                }}
                open
            >
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Top Header Bar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        backgroundColor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'flex-end', gap: 2, minHeight: { xs: 56, sm: 64 } }}>
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Profile Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                sx={{
                                    p: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        backgroundColor: 'primary.main',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        border: '2px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleProfileMenuClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5,
                                        minWidth: 200,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                                    }
                                }}
                            >
                                <Box sx={{ px: 2, py: 1.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {user?.name || 'Kullanıcı'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {user?.email || ''}
                                    </Typography>
                                </Box>
                                <Divider />
                                <MenuItem
                                    onClick={() => {
                                        navigate('/profile');
                                        handleProfileMenuClose();
                                    }}
                                    sx={{ py: 1.5, gap: 1.5 }}
                                >
                                    <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="body2">Profilim</Typography>
                                </MenuItem>
                                <Divider />
                                <MenuItem
                                    onClick={handleLogout}
                                    sx={{ py: 1.5, gap: 1.5, color: 'error.main' }}
                                >
                                    <LogoutIcon sx={{ fontSize: 20 }} />
                                    <Typography variant="body2">Çıkış Yap</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box sx={{ flexGrow: 1, pt: { xs: 0, md: 0 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default UserLayout;

