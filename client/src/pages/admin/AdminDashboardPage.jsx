import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// MUI Imports
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CircularProgress, 
    Alert, 
    Paper,
    Button,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Admin Servisi
import * as adminService from '../../services/adminService';

// Basit bir istatistik kartı bileşeni
function StatCard({ title, value, icon, color = 'primary' }) {
    return (
        <Card component={Paper} elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Box sx={{ mr: 2, color: `${color}.main` }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="h6" component="div">
                    {value}
                </Typography>
                <Typography color="text.secondary">
                    {title}
                </Typography>
            </Box>
        </Card>
    );
}

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await adminService.getDashboardStats();
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
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Yönetim Paneli - Genel Bakış
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            ) : stats ? (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatCard 
                            title="Toplam Kullanıcı"
                            value={stats.totalUsers}
                            icon={<PeopleIcon fontSize="large" />}
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                         <StatCard 
                            title="Toplam Kartvizit"
                            value={stats.totalCards}
                            icon={<CardMembershipIcon fontSize="large" />}
                            color="secondary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                         <StatCard 
                            title="Aktif Kartvizit"
                            value={stats.activeCards}
                            icon={<CheckCircleOutlineIcon fontSize="large" />}
                            color="success"
                        />
                    </Grid>
                </Grid>
            ) : (
                 <Typography sx={{ mt: 2 }}>İstatistik verisi bulunamadı.</Typography>
            )}

            <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>Hızlı Erişim</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap'}}>
                    <Button variant="outlined" component={RouterLink} to="/admin/users">Kullanıcıları Yönet</Button>
                    <Button variant="outlined" component={RouterLink} to="/admin/cards">Kartvizitleri Yönet</Button>
                </Box>
            </Paper>

        </Box>
    );
}

export default AdminDashboardPage; 