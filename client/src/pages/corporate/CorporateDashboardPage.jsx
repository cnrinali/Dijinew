import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Container } from '@mui/material';
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
        <Box sx={{ p: 3 }}>
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="corporate panel tabs">
            <Tab label="Kartvizitlerim" {...a11yProps(0)} />
            <Tab label="Şirket Kullanıcıları" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <CorporateCardsPage />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CorporateUserManagementPage />
        </TabPanel>
      </Box>
    </Container>
  );
} 