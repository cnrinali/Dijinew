import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import LanguageSelector from '../../components/LanguageSelector';
import axios from 'axios';

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import BusinessIcon from '@mui/icons-material/Business';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

function CorporateSettingsPage() {
    const { user, token, updateAuthUser } = useAuth();
    const { showNotification } = useNotification();
    
    const [companyData, setCompanyData] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('tr');
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    // Şirket bilgilerini çek
    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!user?.companyId) {
                showNotification('Şirket bilgisi bulunamadı', 'error');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/corporate/company`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                setCompanyData(response.data);
                setSelectedLanguage(response.data.language || 'tr');
            } catch (err) {
                console.error('Şirket bilgileri yüklenirken hata:', err);
                showNotification(
                    err.response?.data?.message || 'Şirket bilgileri yüklenemedi', 
                    'error'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [user?.companyId, token, showNotification]);

    // Dil güncelleme
    const handleLanguageUpdate = async () => {
        if (!companyData) return;

        setUpdateLoading(true);
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/corporate/company/language`,
                {
                    language: selectedLanguage
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCompanyData(response.data);
            updateAuthUser({ language: selectedLanguage });
            showNotification('Dil ayarı başarıyla güncellendi', 'success');
        } catch (err) {
            console.error('Dil güncellenirken hata:', err);
            showNotification(
                err.response?.data?.message || 'Dil güncellenemedi', 
                'error'
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '60vh' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!companyData) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Şirket bilgileri bulunamadı
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 4, 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                Kurumsal Ayarlar
            </Typography>

            <Grid container spacing={3}>
                {/* Şirket Bilgileri Kartı */}
                <Grid item xs={12} md={6}>
                    <Paper 
                        sx={{ 
                            p: 3, 
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Şirket Bilgileri
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Şirket Adı
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {companyData.name}
                                </Typography>
                            </Box>
                            {companyData.phone && (
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Telefon
                                    </Typography>
                                    <Typography variant="body1">
                                        {companyData.phone}
                                    </Typography>
                                </Box>
                            )}
                            {companyData.website && (
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Website
                                    </Typography>
                                    <Typography variant="body1">
                                        {companyData.website}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Limitler Kartı */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Kullanım Limitleri
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                                    <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                        {companyData.userLimit}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Kullanıcı Limiti
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.50', borderRadius: 2 }}>
                                    <CreditCardIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                        {companyData.cardLimit}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Kart Limiti
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Dil Ayarları Kartı */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <LanguageIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Dil Ayarları
                            </Typography>
                        </Box>
                        
                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Şirketiniz için varsayılan dili seçin. Bu ayar, yeni oluşturulan kullanıcılar 
                            ve kartvizitler için geçerli olacaktır.
                        </Typography>

                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <LanguageSelector
                                    value={selectedLanguage}
                                    onChange={setSelectedLanguage}
                                    disabled={updateLoading}
                                    label="Şirket Dili"
                                    showFlag={true}
                                    size="medium"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleLanguageUpdate}
                                    disabled={updateLoading || selectedLanguage === companyData.language}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.15)',
                                        }
                                    }}
                                >
                                    {updateLoading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Güncelle'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>

                        {selectedLanguage !== companyData.language && (
                            <Box 
                                sx={{ 
                                    mt: 2, 
                                    p: 2, 
                                    bgcolor: 'warning.50', 
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'warning.200'
                                }}
                            >
                                <Typography variant="body2" color="warning.dark">
                                    ⚠️ Dil değişikliği henüz kaydedilmedi. Değişiklikleri kaydetmek için 
                                    "Güncelle" butonuna tıklayın.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CorporateSettingsPage;
