import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function UserLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Anasayfa dışındaki sayfalarda geri butonu göster
    const showBackButton = location.pathname !== '/';

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            {/* Geri Butonu - Sadece anasayfa dışındaki sayfalarda */}
            {showBackButton && (
                <Box sx={{ 
                    position: 'fixed', 
                    top: 16, 
                    left: 16, 
                    zIndex: 1000,
                    backgroundColor: 'background.paper',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                    <Tooltip title="Anasayfaya Dön" arrow>
                        <IconButton
                            onClick={handleBackToHome}
                            sx={{
                                width: 44,
                                height: 44,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            <ArrowBackIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    position: 'relative'
                }}
            >
                {/* Page Content */}
                <Box sx={{ 
                    p: { xs: 2, sm: 3 },
                    // Geri butonu için sol margin ekle
                    ml: showBackButton ? { xs: 6, sm: 7 } : 0
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default UserLayout;

