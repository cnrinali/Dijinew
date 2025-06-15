import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, Card, CardContent, List, ListItem, ListItemText, Chip, IconButton, Tooltip } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../../context/AuthContext';
import ModernStatCard from '../../components/ModernStatCard';
import RecentActivitiesWidget from '../../components/common/RecentActivitiesWidget';
import { getCorporateCards, getCorporateUsers } from '../../services/corporateService';

export default function CorporateDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCards: 0,
    totalEmployees: 0,
    activeCards: 0,
    totalViews: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Kartvizitleri al
      const cardsResponse = await getCorporateCards();
      const cards = cardsResponse?.data?.success ? cardsResponse.data.data : [];
      
      // Kullanıcıları al
      const usersResponse = await getCorporateUsers({ brief: true });
      const employees = usersResponse?.data?.success ? usersResponse.data.data : [];

      // İstatistikleri hesapla
      const activeCards = cards.filter(card => card.isActive).length;
      const totalViews = cards.reduce((sum, card) => sum + (card.viewCount || 0), 0);

      setStats({
        totalCards: cards.length,
        totalEmployees: employees.length,
        activeCards,
        totalViews,
      });


    } catch (error) {
      console.error('Dashboard verileri alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    <Box sx={{ p: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #37474F 0%, #62727B 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                <BusinessIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  Kurumsal Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Şirket kartvizitleri ve çalışan yönetimi özeti
                </Typography>
              </Box>
            </Box>
            
            <Tooltip title="Verileri Yenile">
              <IconButton 
                onClick={fetchDashboardData}
                disabled={loading}
                sx={{ 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Chip 
            icon={<BusinessIcon />}
            label="Kurumsal Hesap"
            variant="filled"
            color="secondary"
            size="medium"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <ModernStatCard
              title="Toplam Kartvizit"
              value={stats.totalCards}
              icon={<CardMembershipIcon />}
              color="primary"
              trend={stats.totalCards > 0 ? 'up' : null}
              trendValue={stats.totalCards > 0 ? `+${stats.totalCards}` : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ModernStatCard
              title="Aktif Kartvizitler"
              value={stats.activeCards}
              icon={<TrendingUpIcon />}
              color="success"
              progress={stats.totalCards > 0 ? Math.round((stats.activeCards / stats.totalCards) * 100) : 0}
              subtitle={`${stats.totalCards} kartvizit içinde`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ModernStatCard
              title="Şirket Çalışanları"
              value={stats.totalEmployees}
              icon={<PeopleIcon />}
              color="secondary"
              trend={stats.totalEmployees > 0 ? 'up' : null}
              trendValue={stats.totalEmployees > 0 ? `${stats.totalEmployees} kişi` : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ModernStatCard
              title="Toplam Görüntülenme"
              value={stats.totalViews}
              icon={<VisibilityIcon />}
              color="info"
              trend="up"
              trendValue={`${stats.totalViews} görüntülenme`}
            />
          </Grid>
        </Grid>

        {/* Recent Activities */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <RecentActivitiesWidget title="Son Şirket Aktiviteleri" maxItems={5} />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                height: '100%',
                background: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.100' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Hızlı İşlemler
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Sık kullanılan işlemler
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-2px)',
                          borderColor: 'primary.200',
                        },
                      }}
                      onClick={() => window.location.href = '/cards/new'}
                    >
                      <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: 'primary.50',
                            color: 'primary.main',
                          }}
                        >
                          <CardMembershipIcon />
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Yeni Kartvizit
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Kartvizit oluştur
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-2px)',
                          borderColor: 'secondary.200',
                        },
                      }}
                      onClick={() => window.location.href = '/corporate/users'}
                    >
                      <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: 'secondary.50',
                            color: 'secondary.main',
                          }}
                        >
                          <PeopleIcon />
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Kullanıcı Yönetimi
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Çalışanları yönet
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 