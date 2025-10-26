import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, Card, CardContent, List, ListItem, ListItemText, Chip, IconButton, Tooltip, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../../context/AuthContext';
import RecentActivitiesWidget from '../../components/common/RecentActivitiesWidget';
import ThemeToggle from '../../components/ThemeToggle';
import { getCorporateCards, getCorporateUsers } from '../../services/corporateService';

export default function CorporateDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCards: 0,
    totalEmployees: 0,
    activeCards: 0,
    totalViews: 0,
  });

  const [loading, setLoading] = useState(false);

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
    <Box sx={{ p: 2 }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px' }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Genel Bakış
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Şirketinizin dijital kartvizit durumu ve istatistikleri
              </Typography>
            </Box>
            
            <Tooltip title="Verileri Yenile">
              <IconButton 
                onClick={fetchDashboardData}
                disabled={loading}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: 'background.paper',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                p: 3
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                Genel Bakış
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Şirketinizin dijital kartvizit durumu ve istatistikleri
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {stats.totalCards}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Toplam Kartvizit
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                      {stats.activeCards}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Aktif Kartlar
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main', mb: 1 }}>
                      {stats.totalEmployees}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Şirket Çalışanları
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mb: 1 }}>
                      {stats.totalViews}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Toplam Görüntülenme
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: 'background.paper',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                p: 3
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                Şirket Özeti
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Toplam Kartvizit
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.totalCards}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Aktif Kartlar
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.activeCards}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Şirket Çalışanları
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.totalEmployees}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Toplam Görüntülenme
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.totalViews}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Activities */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <RecentActivitiesWidget title="Son Şirket Aktiviteleri" maxItems={5} />
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', width: '100%' }}>
              {/* Hızlı İşlemler */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'background.paper',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                }}
              >
                <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Hızlı İşlemler
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Sık kullanılan işlemler
                  </Typography>
                </Box>
                <Box sx={{ p: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: 'background.paper',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            borderColor: 'primary.200',
                          },
                        }}
                        onClick={() => window.location.href = '/cards/new'}
                      >
                        <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: 'background.paper',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            borderColor: 'secondary.200',
                          },
                        }}
                        onClick={() => window.location.href = '/corporate/users'}
                      >
                        <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: 'background.paper',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            borderColor: 'info.200',
                          },
                        }}
                        onClick={() => window.location.href = '/analytics'}
                      >
                        <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              backgroundColor: 'info.50',
                              color: 'info.main',
                            }}
                          >
                            <VisibilityIcon />
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              İstatistikler
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Analiz ve raporlar
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>

              {/* Şirket Özeti */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: 'background.paper',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                }}
              >
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: 'info.main',
                        color: 'white',
                      }}
                    >
                      <BusinessIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Şirket Özeti
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Genel performans bilgileri
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Toplam Kartvizit
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {stats.totalCards}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Aktif Çalışan
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {stats.totalEmployees}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Bu Ay Görüntülenme
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {stats.totalViews}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Hoş Geldiniz Mesajı */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'primary.200',
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                }}
              >
                <Box sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ color: 'primary.dark', mb: 1, fontWeight: 600 }}>
                    Hoş Geldiniz! 👋
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.dark', opacity: 0.8, mb: 2 }}>
                    Kurumsal paneline hoş geldiniz. Şirketinizin dijital kartvizit yönetimini buradan yapabilirsiniz.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                      Kurumsal Hesap Aktif
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 