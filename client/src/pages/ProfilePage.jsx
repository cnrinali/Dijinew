import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext.jsx'; // Auth context'i import et
import { useNotification } from '../context/NotificationContext.jsx'; // Eklendi
import LanguageSelector from '../components/LanguageSelector'; // Dil seçici

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs'; // Tabs import edildi
import Tab from '@mui/material/Tab'; // Tab import edildi

function ProfilePage() {
    const { updateAuthUser } = useAuth(); // Context'teki kullanıcıyı güncellemek için (updateUserContext -> updateAuthUser)
    const { showNotification } = useNotification(); // Eklendi
    
    const [profileData, setProfileData] = useState({ name: '', email: '', language: 'tr' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [tabIndex, setTabIndex] = useState(0); // Aktif sekme state'i
    
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Profil bilgilerini çek
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await userService.getUserProfile();
                setProfileData({ 
                    name: data.name, 
                    email: data.email,
                    language: data.language || 'tr' 
                });
            } catch (err) {
                console.error("Profil bilgisi getirilirken hata:", err);
                showNotification(err.response?.data?.message || 'Profil bilgileri yüklenemedi.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [showNotification]);

    // Profil formu için input değişikliği
    const onProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // Şifre formu için input değişikliği
    const onPasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // Sekme değişikliği handler
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    // Profil güncelleme submit
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const updatedUser = await userService.updateUserProfile(profileData);
            setProfileData({ 
                name: updatedUser.name, 
                email: updatedUser.email,
                language: updatedUser.language || 'tr'
            });
            // Sadece güncellenen alanları context'e gönder
            updateAuthUser({ 
                name: updatedUser.name, 
                email: updatedUser.email,
                language: updatedUser.language 
            }); 
            showNotification('Profil bilgileri başarıyla güncellendi.', 'success');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Profil güncellenemedi.';
            showNotification(errorMsg, 'error');
        } finally {
            setUpdateLoading(false);
        }
    };

    // Şifre değiştirme submit
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            showNotification('Yeni şifreler eşleşmiyor.', 'error');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            showNotification('Yeni şifre en az 6 karakter olmalıdır.', 'error');
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            showNotification(response.message || 'Şifre başarıyla değiştirildi.', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Şifre değiştirilemedi.';
            showNotification(errorMsg, 'error');
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                 <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                 </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
             <Paper sx={{ 
                p: { xs: 2, md: 4 }, 
                borderRadius: 3, 
                border: '1px solid',
                borderColor: 'divider',
                background: 'background.paper',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <Typography 
                    component="h1" 
                    variant="h4" 
                    align="center" 
                    gutterBottom 
                    sx={{ 
                        mb: 4,
                        fontWeight: 700,
                        color: 'text.primary'
                    }}
                >
                    Profilim
                </Typography>

                {/* Sekmeler */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={tabIndex} 
                        onChange={handleTabChange} 
                        aria-label="Profil ayarları sekmeleri" 
                        centered
                        sx={{
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                minHeight: 48,
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                height: 3,
                                backgroundColor: 'primary.main'
                            }
                        }}
                    >
                        <Tab label="Bilgilerim" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
                        <Tab label="Şifre İşlemleri" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
                    </Tabs>
                </Box>

                {/* Bilgileri Güncelle Formu (Sekme 0) */}
                <Box
                    role="tabpanel"
                    hidden={tabIndex !== 0}
                    id="profile-tabpanel-0"
                    aria-labelledby="profile-tab-0"
                >
                    {tabIndex === 0 && (
                        <Box component="form" onSubmit={handleProfileSubmit} sx={{ mt: 1 }}>
                             {/* <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Bilgileri Güncelle</Typography> -> Sekme başlığı yeterli */} 
                             <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="name"
                                        label="İsim Soyisim"
                                        name="name"
                                        value={profileData.name}
                                        onChange={onProfileChange}
                                        disabled={updateLoading}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="E-posta Adresi"
                                        name="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={onProfileChange}
                                        disabled={updateLoading}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <LanguageSelector
                                        value={profileData.language}
                                        onChange={(newLang) => setProfileData({ ...profileData, language: newLang })}
                                        disabled={updateLoading}
                                        label="Dil / Language"
                                        showFlag={true}
                                        size="medium"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    py: 1.5,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.15)',
                                    }
                                }} 
                                disabled={updateLoading}
                            >
                                {updateLoading ? <CircularProgress size={24} /> : 'Bilgileri Kaydet'}
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Şifre Değiştirme Formu (Sekme 1) */}
                <Box
                    role="tabpanel"
                    hidden={tabIndex !== 1}
                    id="profile-tabpanel-1"
                    aria-labelledby="profile-tab-1"
                >
                    {tabIndex === 1 && (
                         <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 1 }}>
                            {/* <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Şifreyi Değiştir</Typography> -> Sekme başlığı yeterli */}
                            <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="currentPassword"
                                        label="Mevcut Şifre"
                                        type="password"
                                        id="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={onPasswordChange}
                                        disabled={passwordLoading}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="newPassword"
                                        label="Yeni Şifre"
                                        type="password"
                                        id="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={onPasswordChange}
                                        disabled={passwordLoading}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmNewPassword"
                                        label="Yeni Şifre (Tekrar)"
                                        type="password"
                                        id="confirmNewPassword"
                                        value={passwordData.confirmNewPassword}
                                        onChange={onPasswordChange}
                                        disabled={passwordLoading}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary" 
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    py: 1.5,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.15)',
                                    }
                                }} 
                                disabled={passwordLoading}
                            >
                                {passwordLoading ? <CircularProgress size={24} /> : 'Şifreyi Değiştir'}
                            </Button>
                         </Box>
                    )}
                 </Box>
                 
                 {/* Divider kaldırıldı */}
            </Paper>
        </Container>
    );
}

export default ProfilePage; 