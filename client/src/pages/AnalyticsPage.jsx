import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Paper,
    Divider
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    TouchApp as TouchAppIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Language as LanguageIcon,
    Share as ShareIcon,
    Storefront as StorefrontIcon,
    AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import analyticsService from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';

const AnalyticsPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState(30);
    const [userStats, setUserStats] = useState([]);
    const [selectedCard, setSelectedCard] = useState('');
    const [cardStats, setCardStats] = useState(null);

    useEffect(() => {
        fetchUserStats();
    }, [period]);

    useEffect(() => {
        if (selectedCard) {
            fetchCardStats(selectedCard);
        }
    }, [selectedCard, period]);

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            console.log('Kullanıcı ID:', user.id);
            console.log('Period:', period);
            console.log('API çağrısı yapılıyor...');
            const stats = await analyticsService.getUserStats(user.id, period);
            console.log('Gelen istatistikler:', stats);
            console.log('İstatistik sayısı:', stats.length);
            setUserStats(stats);
            
            // İlk kartı otomatik seç
            if (stats.length > 0 && !selectedCard) {
                setSelectedCard(stats[0].cardId);
                console.log('Seçilen kart ID:', stats[0].cardId);
            } else if (stats.length === 0) {
                console.log('Hiç kart bulunamadı!');
            }
        } catch (err) {
            setError('İstatistikler yüklenirken hata oluştu');
            console.error('İstatistik hatası:', err);
            console.error('Hata detayı:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchCardStats = async (cardId) => {
        try {
            const stats = await analyticsService.getCardStats(cardId, period);
            setCardStats(stats);
        } catch (err) {
            setError('Kart istatistikleri yüklenirken hata oluştu');
            console.error(err);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'phone': return <PhoneIcon />;
            case 'email': return <EmailIcon />;
            case 'website': return <LanguageIcon />;
            case 'social': return <ShareIcon />;
            case 'marketplace': return <StorefrontIcon />;
            case 'bank': return <AccountBalanceIcon />;
            default: return <TouchAppIcon />;
        }
    };

    const getCategoryName = (category) => {
        switch (category) {
            case 'phone': return 'Telefon';
            case 'email': return 'E-posta';
            case 'website': return 'Web Sitesi';
            case 'social': return 'Sosyal Medya';
            case 'marketplace': return 'Pazaryeri';
            case 'bank': return 'Banka';
            case 'address': return 'Adres';
            default: return category;
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                📊 İstatistikler
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Kontroller */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel>Zaman Aralığı</InputLabel>
                        <Select
                            value={period}
                            label="Zaman Aralığı"
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <MenuItem value={1}>Bugün (Son 24 Saat)</MenuItem>
                            <MenuItem value={7}>Son 7 Gün</MenuItem>
                            <MenuItem value={14}>Son 14 Gün</MenuItem>
                            <MenuItem value={30}>Son 30 Gün</MenuItem>
                            <MenuItem value={60}>Son 2 Ay</MenuItem>
                            <MenuItem value={90}>Son 3 Ay</MenuItem>
                            <MenuItem value={180}>Son 6 Ay</MenuItem>
                            <MenuItem value={365}>Son 1 Yıl</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* Kart Seçin alanını sadece admin ve corporate kullanıcılar için göster */}
                {(user?.role === 'admin' || user?.role === 'corporate') && (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>Kart Seçin</InputLabel>
                            <Select
                                value={selectedCard}
                                label="Kart Seçin"
                                onChange={(e) => setSelectedCard(e.target.value)}
                            >
                                {userStats.map((card) => (
                                    <MenuItem key={card.cardId} value={card.cardId}>
                                        {card.cardName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
            </Grid>

            {/* Genel Özet Kartları */}
            {userStats.length > 0 ? (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {userStats.map((card) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.cardId}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer',
                                    border: selectedCard === card.cardId ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                    '&:hover': { boxShadow: 3 }
                                }}
                                onClick={() => setSelectedCard(card.cardId)}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {card.cardName}
                                    </Typography>
                                    {/* Admin için kullanıcı bilgisi göster */}
                                    {user?.role === 'admin' && card.userName && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            👤 {card.userName} ({card.userEmail})
                                        </Typography>
                                    )}
                                    <Grid container spacing={2}>
                                        <Grid size={4}>
                                            <Box textAlign="center">
                                                <VisibilityIcon color="primary" />
                                                <Typography variant="h6">{card.totalViews}</Typography>
                                                <Typography variant="caption">Görüntülenme</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={4}>
                                            <Box textAlign="center">
                                                <TouchAppIcon color="secondary" />
                                                <Typography variant="h6">{card.totalClicks}</Typography>
                                                <Typography variant="caption">Tıklama</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={4}>
                                            <Box textAlign="center">
                                                <PeopleIcon color="success" />
                                                <Typography variant="h6">{card.uniqueVisitors}</Typography>
                                                <Typography variant="caption">Ziyaretçi</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity="info" sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        {user?.role === 'admin' ? 'Henüz hiç kart bulunmuyor' : 'Henüz kartınız bulunmuyor'}
                    </Typography>
                    <Typography>
                        {user?.role === 'admin' 
                            ? 'Sistemde henüz hiç dijital kartvizit oluşturulmamış.' 
                            : 'İstatistikleri görüntülemek için önce bir dijital kartvizit oluşturmanız gerekiyor.'
                        }
                    </Typography>
                </Alert>
            )}

            {/* Detaylı İstatistikler */}
            {cardStats && (
                <>
                    {/* Genel Metrikler */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <VisibilityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                <Typography variant="h4">{cardStats.general.totalViews}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Toplam Görüntülenme
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <TouchAppIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                                <Typography variant="h4">{cardStats.general.totalClicks}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Toplam Tıklama
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                <Typography variant="h4">{cardStats.general.uniqueVisitors}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Benzersiz Ziyaretçi
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                <Typography variant="h4">{cardStats.general.activeDays}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Aktif Gün
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Kategori Bazlı Tıklamalar */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Kategori Bazlı Tıklamalar
                                    </Typography>
                                    {cardStats.categories.length > 0 ? (
                                        <List>
                                            {cardStats.categories.map((cat, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {getCategoryIcon(cat.clickType)}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={getCategoryName(cat.clickType)}
                                                            secondary={`${cat.clickCount} tıklama`}
                                                        />
                                                        <Chip 
                                                            label={cat.clickCount} 
                                                            size="small" 
                                                            color="primary" 
                                                        />
                                                    </ListItem>
                                                    {index < cardStats.categories.length - 1 && <Divider />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                                            Henüz tıklama verisi yok
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Detaylı Tıklama Listesi */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Detaylı Tıklama İstatistikleri
                                    </Typography>
                                    <List>
                                        {cardStats.detailed.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem>
                                                    <ListItemIcon>
                                                        {getCategoryIcon(item.clickType)}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={item.clickTarget}
                                                        secondary={`${getCategoryName(item.clickType)} - ${item.clickCount} tıklama`}
                                                    />
                                                    <Chip 
                                                        label={item.clickCount} 
                                                        size="small" 
                                                        color="primary" 
                                                    />
                                                </ListItem>
                                                {index < cardStats.detailed.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                    {cardStats.detailed.length === 0 && (
                                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                                            Henüz detaylı tıklama verisi yok
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Günlük Trend */}
                        <Grid size={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Günlük Görüntülenme Trendi
                                    </Typography>
                                    {cardStats.dailyTrend.length > 0 ? (
                                        <Box sx={{ height: 300, mt: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Son {period} günde toplam {cardStats.general.totalViews} görüntülenme
                                            </Typography>
                                            <List sx={{ mt: 2 }}>
                                                {cardStats.dailyTrend.slice(0, 10).map((day, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText
                                                            primary={new Date(day.date).toLocaleDateString('tr-TR')}
                                                            secondary={`${day.views} görüntülenme`}
                                                        />
                                                        <Chip 
                                                            label={day.views} 
                                                            size="small" 
                                                            color="primary" 
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                                            Henüz günlük trend verisi yok
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default AnalyticsPage; 