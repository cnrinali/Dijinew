import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Container, Paper, Chip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CorporateCardsPage from './CorporateCardsPage';
import CorporateUserManagementPage from './CorporateUserManagementPage';
import { useAuth } from '../../context/AuthContext'; // AuthContext'i import edelim

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`corporate-tabpanel-${index}`}
      aria-labelledby={`corporate-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `corporate-tab-${index}`,
    'aria-controls': `corporate-tabpanel-${index}`,
  };
}

export default function CorporateDashboardPage() {
  const [value, setValue] = useState(0);
  const { user } = useAuth(); // Kullanıcı bilgilerini alalım

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Kurumsal kullanıcı değilse veya companyId yoksa bu sayfayı gösterme
  if (user?.role !== 'corporate' || !user?.companyId) {
    return (
      <Container>
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #37474F 0%, #62727B 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BusinessIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Kurumsal Panel
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Şirket kartvizitleri ve kullanıcı yönetimi
              </Typography>
            </Box>
          </Box>
          
          <Chip 
            icon={<BusinessIcon />}
            label="Kurumsal Hesap"
            variant="filled"
            color="secondary"
            size="small"
          />
        </Box>

        {/* Modern Tabs */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: 'grey.50',
            px: 2
          }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="corporate panel tabs"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab 
                icon={<CardMembershipIcon />}
                iconPosition="start"
                label="Kartvizitlerim" 
                {...a11yProps(0)} 
              />
              <Tab 
                icon={<PeopleIcon />}
                iconPosition="start"
                label="Şirket Kullanıcıları" 
                {...a11yProps(1)} 
              />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 4, backgroundColor: 'white' }}>
            <TabPanel value={value} index={0}>
              <CorporateCardsPage />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CorporateUserManagementPage />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 