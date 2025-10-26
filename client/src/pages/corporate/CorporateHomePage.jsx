import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  IconButton,
  useTheme
} from '@mui/material';
import ThemeToggle from '../../components/ThemeToggle';
import {
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Landscape as ProductIcon,
  Slideshow as SliderIcon,
  HeadsetMic as SupportIcon,
  ShoppingCart as MarketplaceIcon,
  BarChart as CompanyIcon,
  Description as DocumentIcon,
  Share as PlatformIcon,
  Videocam as VideoIcon,
  Assessment as ReportIcon,
  Chat as SocialIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const CorporateHomePage = () => {
  const theme = useTheme();

  const menuItems = [
    {
      title: "KARTVİZİTLER",
      icon: <CreditCardIcon />,
      path: "/corporate/cards",
      description: "Kurumsal kartvizitlerinizi yönetin",
      color: "#F4C734"
    },
    {
      title: "KULLANICILAR",
      icon: <PeopleIcon />,
      path: "/corporate/users",
      description: "Şirket kullanıcılarınızı yönetin",
      color: "#F4C734"
    },
    {
      title: "GENEL BAKIŞ",
      icon: <AnalyticsIcon />,
      path: "/corporate/dashboard",
      description: "Dashboard ve istatistiklerinizi görün",
      color: "#000000"
    },
    {
      title: "AKTİVİTELER",
      icon: <HistoryIcon />,
      path: "/corporate/activities",
      description: "Sistem aktivitelerini görüntüleyin",
      color: "#F4C734"
    },
    {
      title: "İSTATİSTİKLER",
      icon: <ReportIcon />,
      path: "/analytics",
      description: "Detaylı analiz raporlarınız",
      color: "#000000"
    },
    // Geçici olarak gizlendi - dil desteği için gelecek versiyonlarda eklenecek
    // {
    //   title: "AYARLAR",
    //   icon: <SettingsIcon />,
    //   path: "/profile",
    //   description: "Hesap ve sistem ayarlarınız",
    //   color: "#F4C734"
    // },
    {
      title: "GÜVENLİK",
      icon: <SecurityIcon />,
      path: "/profile",
      description: "Güvenlik ve şifre ayarları",
      color: "#000000"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">

        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            color: 'text.primary', 
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
          }}>
            Kurumsal Yönetim Paneli
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: '600px',
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.125rem' }
          }}>
            Şirketinizin dijital kartvizitlerini ve kullanıcılarını yönetin
          </Typography>
        </Box>

        {/* Menu Grid */}
        <Grid container spacing={4} justifyContent="center">
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
              <Card 
                sx={{ 
                  height: '280px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '2px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  backgroundColor: 'background.paper',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    borderColor: item.color,
                    '& .icon-container': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 8px 24px ${item.color}40`
                    },
                    '& .card-overlay': {
                      opacity: 1
                    }
                  }
                }}
                onClick={() => window.location.href = item.path}
              >
                {/* Overlay */}
                <Box 
                  className="card-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${item.color}26 0%, ${item.color}14 100%)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                
                <CardContent sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Box 
                    className="icon-container"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}CC 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      boxShadow: `0 4px 12px ${item.color}30`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {React.cloneElement(item.icon, { 
                      sx: { fontSize: 28, color: 'white' } 
                    })}
                  </Box>
                  
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 2,
                    fontSize: '1.25rem',
                    lineHeight: 1.3
                  }}>
                    {item.title}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    fontWeight: 400
                  }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CorporateHomePage;
