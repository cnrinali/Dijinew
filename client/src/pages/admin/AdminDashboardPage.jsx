import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUI Imports
import { 
    Box, 
    Typography, 
    Grid, 
    CircularProgress, 
    Alert, 
    Paper,
    Button,
    Divider,
    Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';

// Components
import ModernStatCard from '../../components/ModernStatCard';
import RecentActivitiesWidget from '../../components/common/RecentActivitiesWidget';

// Admin Servisi - Named import kullanalım
import { getDashboardStats } from '../../services/adminService';

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                // Çağrıyı doğrudan yapalım
                const data = await getDashboardStats(); 
                setStats(data);
            } catch (err) {
                setError(err.response?.data?.message || 'İstatistikler getirilirken bir hata oluştu.');
                console.error("Admin Stats Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
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
                            Genel Bakış
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Sistem genel bakış ve istatistikler
                        </Typography>
                    </Box>
                </Box>
                
                <Chip 
                    icon={<TrendingUpIcon />}
                    label="Son 24 saat içindeki veriler"
                    variant="outlined"
                    color="primary"
                    size="small"
                />
            </Box>

            {loading ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    minHeight: '400px'
                }}>
                    <CircularProgress size={60} />
                </Box>
            ) : error ? (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        '& .MuiAlert-message': { fontSize: '1rem' }
                    }}
                >
                    {error}
                </Alert>
            ) : stats ? (
                <>
                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} lg={3}>
                            <ModernStatCard 
                                title="Toplam Kullanıcı"
                                value={stats.totalUsers}
                                icon={<PeopleIcon />}
                                color="primary"
                                trend="up"
                                trendValue="+12%"
                                subtitle="Aktif kullanıcı sayısı"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <ModernStatCard 
                                title="Toplam Kartvizit"
                                value={stats.totalCards}
                                icon={<CardMembershipIcon />}
                                color="info"
                                trend="up"
                                trendValue="+8%"
                                subtitle="Oluşturulan tüm kartlar"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <ModernStatCard 
                                title="Aktif Kartvizit"
                                value={stats.activeCards}
                                icon={<CheckCircleOutlineIcon />}
                                color="success"
                                trend="up"
                                trendValue="+5%"
                                subtitle="Yayında olan kartlar"
                                progress={stats.activeCards ? Math.round((stats.activeCards / stats.totalCards) * 100) : 0}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <ModernStatCard 
                                title="Sistem Durumu"
                                value="Çevrimiçi"
                                icon={<TrendingUpIcon />}
                                color="success"
                                subtitle="Tüm sistemler çalışıyor"
                                progress={98}
                            />
                        </Grid>
                    </Grid>

                    {/* Recent Activities and Welcome */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <RecentActivitiesWidget title="Son Sistem Aktiviteleri" maxItems={8} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    background: 'white',
                                    height: 'fit-content'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <SettingsIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        Sistem Bilgileri
                                    </Typography>
                                </Box>
                                
                                <Divider sx={{ mb: 3 }} />
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                                        <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                                            Hoş Geldiniz! 👋
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Admin paneline hoş geldiniz. Sol menüden istediğiniz bölüme ulaşabilirsiniz.
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ p: 3, backgroundColor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                                        <Typography variant="h6" sx={{ color: 'success.dark', mb: 1 }}>
                                            Sistem Durumu: Aktif ✅
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'success.dark' }}>
                                            Tüm sistemler normal çalışıyor.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 4, 
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        textAlign: 'center'
                    }}
                >
                    <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                        İstatistik verisi bulunamadı.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

export default AdminDashboardPage; 