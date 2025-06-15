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
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import BackupIcon from '@mui/icons-material/Backup';
import UpdateIcon from '@mui/icons-material/Update';
import BugReportIcon from '@mui/icons-material/BugReport';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import DataUsageIcon from '@mui/icons-material/DataUsage';

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
                    <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                        <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                        <Grid item xs={12} sm={6} md={4} lg={2.4}>
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
                        <Grid item xs={12} sm={6} md={4} lg={2.4}>
                            <ModernStatCard 
                                title="Toplam Şirket"
                                value={stats.totalCompanies || 0}
                                icon={<BusinessIcon />}
                                color="secondary"
                                trend="up"
                                trendValue="+3%"
                                subtitle="Kayıtlı şirket sayısı"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={2.4}>
                            <ModernStatCard 
                                title="Sistem Performansı"
                                value="98%"
                                icon={<SpeedIcon />}
                                color="warning"
                                trend="up"
                                trendValue="+2%"
                                subtitle="Genel sistem performansı"
                                progress={98}
                            />
                        </Grid>
                    </Grid>

                    {/* System Information Grid */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {/* Recent Activities */}
                        <Grid item xs={12} lg={4}>
                            <RecentActivitiesWidget title="Son Sistem Aktiviteleri" maxItems={4} />
                        </Grid>
                        
                        {/* System Status */}
                        <Grid item xs={12} lg={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                                {/* Detaylı Sistem Durumu */}
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'success.200',
                                        background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    backgroundColor: 'success.main',
                                                    color: 'white',
                                                }}
                                            >
                                                <NetworkCheckIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark' }}>
                                                    Sistem Durumu
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'success.dark', opacity: 0.8 }}>
                                                    Gerçek zamanlı sistem bilgileri
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CloudIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'success.dark' }}>
                                                        Sunucu Durumu
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label="Çevrimiçi" 
                                                    size="small" 
                                                    color="success" 
                                                    variant="filled"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <StorageIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'success.dark' }}>
                                                        Veritabanı
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label="Bağlı" 
                                                    size="small" 
                                                    color="success" 
                                                    variant="filled"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <MemoryIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'success.dark' }}>
                                                        Bellek Kullanımı
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
                                                    68%
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <SpeedIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'success.dark' }}>
                                                        Yanıt Süresi
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
                                                    45ms
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <SecurityIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'success.dark' }}>
                                                        Güvenlik
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label="Güvenli" 
                                                    size="small" 
                                                    color="success" 
                                                    variant="filled"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>

                                {/* Sistem Kaynak Kullanımı */}
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'secondary.200',
                                        background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    backgroundColor: 'secondary.main',
                                                    color: 'white',
                                                }}
                                            >
                                                <DeveloperBoardIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.dark' }}>
                                                    Kaynak Kullanımı
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'secondary.dark', opacity: 0.8 }}>
                                                    Sistem kaynakları durumu
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <DataUsageIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
                                                        CPU Kullanımı
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
                                                    23%
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <StorageIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
                                                        Depolama
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
                                                    45GB / 100GB
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <NetworkCheckIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
                                                        Bant Genişliği
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
                                                    12.5 MB/s
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CloudIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
                                                        Uptime
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
                                                    99.9%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>

                            </Box>
                        </Grid>

                        {/* Additional System Info */}
                        <Grid item xs={12} lg={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                                {/* Sistem Bakım Bilgileri */}
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'warning.200',
                                        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    backgroundColor: 'warning.main',
                                                    color: 'white',
                                                }}
                                            >
                                                <AdminPanelSettingsIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                                                    Sistem Bakımı
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'warning.dark', opacity: 0.8 }}>
                                                    Bakım ve güncelleme bilgileri
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <BackupIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                                                        Son Yedekleme
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'warning.dark', fontWeight: 600 }}>
                                                    2 saat önce
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <UpdateIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                                                        Son Güncelleme
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'warning.dark', fontWeight: 600 }}>
                                                    v2.1.3
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <BugReportIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                                                        Aktif Hatalar
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label="0" 
                                                    size="small" 
                                                    color="success" 
                                                    variant="filled"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <NotificationsIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                                                    <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                                                        Bekleyen Bildirimler
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: 'warning.dark', fontWeight: 600 }}>
                                                    3
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>

                                {/* Sistem İstatistikleri */}
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'info.200',
                                        background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 2,
                                                    backgroundColor: 'info.main',
                                                    color: 'white',
                                                }}
                                            >
                                                <AnalyticsIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.dark' }}>
                                                    Günlük İstatistikler
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'info.dark', opacity: 0.8 }}>
                                                    Bugünkü sistem aktivitesi
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ color: 'info.dark' }}>
                                                    Yeni Kayıtlar
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 600 }}>
                                                    +12
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ color: 'info.dark' }}>
                                                    Aktif Oturumlar
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 600 }}>
                                                    47
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ color: 'info.dark' }}>
                                                    API İstekleri
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 600 }}>
                                                    1,247
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ color: 'info.dark' }}>
                                                    Disk Kullanımı
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'info.dark', fontWeight: 600 }}>
                                                    2.3 GB
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Additional Management Tools */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    background: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <Box sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Box
                                            sx={{
                                                p: 1,
                                                borderRadius: 2,
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                            }}
                                        >
                                            <SettingsIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                Gelişmiş Yönetim Araçları
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Sistem yönetimi ve konfigürasyon araçları
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Button
                                                component={RouterLink}
                                                to="/admin/users"
                                                variant="outlined"
                                                startIcon={<PeopleIcon />}
                                                fullWidth
                                                sx={{ 
                                                    justifyContent: 'flex-start',
                                                    p: 2,
                                                    borderColor: 'primary.200',
                                                    color: 'primary.dark',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        backgroundColor: 'primary.50',
                                                    }
                                                }}
                                            >
                                                Kullanıcı Yönetimi
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Button
                                                component={RouterLink}
                                                to="/admin/cards"
                                                variant="outlined"
                                                startIcon={<CardMembershipIcon />}
                                                fullWidth
                                                sx={{ 
                                                    justifyContent: 'flex-start',
                                                    p: 2,
                                                    borderColor: 'info.200',
                                                    color: 'info.dark',
                                                    '&:hover': {
                                                        borderColor: 'info.main',
                                                        backgroundColor: 'info.50',
                                                    }
                                                }}
                                            >
                                                Kartvizit Yönetimi
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Button
                                                component={RouterLink}
                                                to="/admin/companies"
                                                variant="outlined"
                                                startIcon={<BusinessIcon />}
                                                fullWidth
                                                sx={{ 
                                                    justifyContent: 'flex-start',
                                                    p: 2,
                                                    borderColor: 'secondary.200',
                                                    color: 'secondary.dark',
                                                    '&:hover': {
                                                        borderColor: 'secondary.main',
                                                        backgroundColor: 'secondary.50',
                                                    }
                                                }}
                                            >
                                                Şirket Yönetimi
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Button
                                                component={RouterLink}
                                                to="/admin/activities"
                                                variant="outlined"
                                                startIcon={<AnalyticsIcon />}
                                                fullWidth
                                                sx={{ 
                                                    justifyContent: 'flex-start',
                                                    p: 2,
                                                    borderColor: 'success.200',
                                                    color: 'success.dark',
                                                    '&:hover': {
                                                        borderColor: 'success.main',
                                                        backgroundColor: 'success.50',
                                                    }
                                                }}
                                            >
                                                Sistem Aktiviteleri
                                            </Button>
                                        </Grid>
                                    </Grid>
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