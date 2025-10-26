import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

// MUI imports
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import {
    CreditCard as CardIcon,
    Share as ShareIcon,
    QrCode as QrCodeIcon,
    TrendingUp as TrendingIcon,
    Speed as SpeedIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

function HomePage() {
    const { isLoggedIn, user } = useAuth();
    const { isDarkMode } = useTheme();

    const features = [
        {
            icon: <CardIcon sx={{ fontSize: 40 }} />,
            title: 'Dijital Kartvizit',
            description: 'Modern ve profesyonel dijital kartvizitler oluşturun'
        },
        {
            icon: <QrCodeIcon sx={{ fontSize: 40 }} />,
            title: 'QR Kod',
            description: 'QR kod ile anında bilgilerinizi paylaşın'
        },
        {
            icon: <ShareIcon sx={{ fontSize: 40 }} />,
            title: 'Kolay Paylaşım',
            description: 'Tek tıkla sosyal medyada paylaşın'
        },
        {
            icon: <TrendingIcon sx={{ fontSize: 40 }} />,
            title: 'Analitik',
            description: 'Kartvizit görüntüleme istatistiklerini takip edin'
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40 }} />,
            title: 'Hızlı & Kolay',
            description: 'Dakikalar içinde kartvizitinizi oluşturun'
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: 'Güvenli',
            description: 'Verileriniz güvenli bir şekilde saklanır'
        }
    ];

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 8
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <img 
                                src={isDarkMode ? "/img/dijinew_logo_light.png" : "/img/dijinew_logo_dark.png"} 
                                alt="Dijinew Logo" 
                                style={{ 
                                    height: '80px', 
                                    width: 'auto'
                                }} 
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{ 
                                mb: 3, 
                                fontWeight: 400,
                                color: 'white'
                            }}
                        >
                            Dijinew Creative Agency
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ 
                                mb: 4, 
                                maxWidth: 500, 
                                mx: 'auto',
                                color: 'white'
                            }}
                        >
                            {isLoggedIn
                                ? `Hoş geldiniz, ${user?.name || 'Kullanıcı'}!`
                                : 'Profesyonel dijital kartvizitinizi oluşturun ve paylaşın.'}
                        </Typography>
                        {isLoggedIn ? (
                            <Button
                                component={RouterLink}
                                to="/cards"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'grey.100' }
                                }}
                            >
                                Kartvizitlerim
                            </Button>
                        ) : (
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: 'grey.100' }
                                }}
                            >
                                Giriş Yap
                            </Button>
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default HomePage; 