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
  Chat as SocialIcon
} from '@mui/icons-material';

const CorporateHomePage = () => {
  const theme = useTheme();

  const menuItems = [
    {
      title: "DİJİTACO'LARINI LİSTELE",
      icon: <CreditCardIcon />,
      path: "/corporate/cards",
      description: "Kurumsal kartvizitlerinizi yönetin"
    },
    {
      title: "BANKA BİLGİLERİM",
      icon: <BankIcon />,
      path: "/corporate/bank",
      description: "Banka hesap bilgilerinizi düzenleyin"
    },
    {
      title: "ÜRÜN BİLGİLERİM",
      icon: <ProductIcon />,
      path: "/corporate/products",
      description: "Ürün kataloğunuzu yönetin"
    },
    {
      title: "SLİDER BİLGİLERİM",
      icon: <SliderIcon />,
      path: "/corporate/sliders",
      description: "Ana sayfa slider'larınızı düzenleyin"
    },
    {
      title: "DESTEK TALEBİ OLUŞTUR",
      icon: <SupportIcon />,
      path: "/corporate/support",
      description: "Teknik destek talebi oluşturun"
    },
    {
      title: "PAZARYERİ RAPORLARIM",
      icon: <MarketplaceIcon />,
      path: "/corporate/marketplace",
      description: "Pazaryeri performans raporlarınız"
    },
    {
      title: "FİRMA BİLGİLERİM",
      icon: <CompanyIcon />,
      path: "/corporate/company",
      description: "Şirket bilgilerinizi güncelleyin"
    },
    {
      title: "DÖKÜMAN BİLGİLERİM",
      icon: <DocumentIcon />,
      path: "/corporate/documents",
      description: "Kurumsal dökümanlarınızı yönetin"
    },
    {
      title: "PLATFORM BİLGİLERİM",
      icon: <PlatformIcon />,
      path: "/corporate/platform",
      description: "Platform ayarlarınızı düzenleyin"
    },
    {
      title: "TANITIM VİDEOM",
      icon: <VideoIcon />,
      path: "/corporate/video",
      description: "Kurumsal tanıtım videonuzu yükleyin"
    },
    {
      title: "RAPOR ÖZETİM",
      icon: <ReportIcon />,
      path: "/corporate/reports",
      description: "Detaylı performans raporlarınız"
    },
    {
      title: "SOSYAL AĞ RAPORLARIM",
      icon: <SocialIcon />,
      path: "/corporate/social",
      description: "Sosyal medya analiz raporlarınız"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">

        {/* Menu Grid */}
        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => window.location.href = item.path}
              >
                <CardContent sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    border: '2px solid',
                    borderColor: 'primary.dark'
                  }}>
                    {React.cloneElement(item.icon, { 
                      sx: { fontSize: 24, color: 'white' } 
                    })}
                  </Box>
                  
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                    fontSize: '0.9rem',
                    lineHeight: 1.3
                  }}>
                    {item.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                    lineHeight: 1.4
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
