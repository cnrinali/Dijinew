import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cardService from '../services/cardService';
import {
    Box,
    Typography,
    Card
} from '@mui/material';
import QrCodeModal from '../components/QrCodeModal';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from '../context/ThemeContext';
import {
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    QrCode as QrIcon,
    Logout as LogoutIcon,
    PowerSettingsNew as PowerSettingsNewIcon,
    BarChart as BarChartIcon,
    Person as PersonIcon,
    Share as ShareIcon
} from '@mui/icons-material';

function UserDashboardPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { isDarkMode } = useContext(ThemeContext);
    const { logout, user } = useAuth();
    const [userCards, setUserCards] = useState([]);
    const [cardsLoading, setCardsLoading] = useState(true);
    
    // QR Kod Modal State'leri
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedQrUrl, setSelectedQrUrl] = useState('');

    // Kullanıcının kartlarını yükle
    useEffect(() => {
        const fetchUserCards = async () => {
            setCardsLoading(true);
            try {
                const cards = await cardService.getCards();
                setUserCards(cards);
                console.log('UserDashboardPage: Kartlar yüklendi:', cards);
            } catch (error) {
                console.error('Kartlar yüklenirken hata:', error);
            } finally {
                setCardsLoading(false);
            }
        };

        if (user) {
            fetchUserCards();
        }
    }, [user]);

    // Düzenle fonksiyonu
    const handleEdit = () => {
        console.log('UserDashboardPage: handleEdit çağrıldı, userCards:', userCards, 'cardsLoading:', cardsLoading);
        
        if (cardsLoading) {
            alert('Kartlar yükleniyor, lütfen bekleyin...');
            return;
        }
        
        if (userCards.length === 0) {
            alert('Düzenlenecek kart bulunamadı. Önce bir kart oluşturun.');
            return;
        }
        
        // İlk kartı düzenleme sayfasına yönlendir
        const firstCard = userCards[0];
        console.log('UserDashboardPage: İlk kart:', firstCard);
        navigate(`/cards/edit/${firstCard.id}`);
    };

    // QR Kod Modal açma fonksiyonu
    const handleOpenQrModal = () => {
        if (userCards.length === 0) {
            alert('QR kodu gösterilecek kart bulunamadı.');
            return;
        }
        
        // İlk kartın QR kodunu göster
        const firstCard = userCards[0];
        const publicUrl = `${window.location.origin}/card/${firstCard.customSlug || firstCard.id}`;
        setSelectedQrUrl(publicUrl);
        setQrModalOpen(true);
    };

    // Aktif/Pasif toggle fonksiyonu
    const handleToggleStatus = async () => {
        if (userCards.length === 0) {
            alert('Durumu değiştirilecek kart bulunamadı.');
            return;
        }

        const firstCard = userCards[0];
        const newStatus = !firstCard.isActive;
        
        try {
            const result = await cardService.toggleCardStatus(firstCard.id, newStatus);
            alert(result.message);
            
            // Kartları yeniden yükle
            const cards = await cardService.getCards();
            setUserCards(cards);
        } catch (error) {
            console.error('Kart durumu değiştirilirken hata:', error);
            alert('Kart durumu değiştirilirken bir hata oluştu.');
        }
    };

    // QR Kod Modal kapatma fonksiyonu
    const handleCloseQrModal = () => {
        setQrModalOpen(false);
        setSelectedQrUrl('');
    };

    // Paylaş fonksiyonu
    const handleShare = async () => {
        if (userCards.length === 0) {
            alert('Paylaşılacak kart bulunamadı.');
            return;
        }

        const firstCard = userCards[0];
        const cardUrl = `${window.location.origin}/card/${firstCard.customSlug || firstCard.id}`;
        const shareData = {
            title: firstCard.name || 'Kartvizit',
            text: `${firstCard.name || 'Kartvizit'} - ${firstCard.title || ''}`,
            url: cardUrl
        };

        // Web Share API desteği varsa kullan
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                // Kullanıcı paylaşımı iptal ettiyse veya hata oluştuysa linki kopyala
                if (error.name !== 'AbortError') {
                    await copyToClipboard(cardUrl);
                }
            }
        } else {
            // Web Share API desteklenmiyorsa linki kopyala
            await copyToClipboard(cardUrl);
        }
    };

    // Linki panoya kopyalama fonksiyonu
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Link panoya kopyalandı!');
        } catch (error) {
            console.error('Panoya kopyalama hatası:', error);
            // Fallback: Eski yöntem
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert('Link panoya kopyalandı!');
            } catch (err) {
                alert('Link kopyalanamadı. Lütfen manuel olarak kopyalayın: ' + text);
            }
            document.body.removeChild(textArea);
        }
    };

    const cardStyle = (isSecondColumn = false) => ({
        width: '50%',
        height: { xs: 120, sm: 140 },
        backgroundColor: isDarkMode
            ? (isSecondColumn ? '#2a2a2a' : '#1a1a1a')
            : (isSecondColumn ? theme.palette.background.paper : theme.palette.background.paper),
        border: 'none',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        px: { xs: 2, sm: 4 },
        position: 'relative',
        '&:hover': {
            backgroundColor: isDarkMode
                ? (isSecondColumn ? '#3a3a3a' : '#2a2a2a')
                : (isSecondColumn ? theme.palette.grey[100] : theme.palette.grey[100]),
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)'
        },
        '&:active': {
            transform: 'translateY(-2px)'
        }
    });

    const iconContainerStyle = () => ({
        width: { xs: 60, sm: 80 },
        height: { xs: 60, sm: 80 },
        borderRadius: '50%',
        backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: { xs: 2, sm: 3 }
    });

    const textStyle = () => ({
        color: isDarkMode
            ? 'white'
            : theme.palette.text.primary,
        fontWeight: 700,
        fontSize: { xs: '1rem', sm: '1.25rem' },
        mb: 0.5
    });

    const subtitleStyle = () => ({
        color: isDarkMode
            ? 'rgba(255, 255, 255, 0.7)'
            : theme.palette.text.secondary,
        fontSize: { xs: '0.75rem', sm: '0.875rem' }
    });

            return (
                <Box sx={{
                    minHeight: '100vh',
                    backgroundColor: isDarkMode ? '#0a0a0a' : theme.palette.background.default,
                    color: isDarkMode ? 'white' : theme.palette.text.primary,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '300px',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Ctext x='10' y='35' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%23000000' opacity='0.05'%3Edijinew%3C/text%3E%3Ctext x='10' y='50' font-family='Arial, sans-serif' font-size='12' fill='%23000000' opacity='0.05'%3ECreative Agency%3C/text%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }
                }}>
            {/* Main Content */}
            <Box sx={{ 
                p: { xs: 2, sm: 4 },
                maxWidth: '1200px',
                mx: 'auto',
                position: 'relative',
                zIndex: 1
            }}>
                {/* 2 Column Grid Layout - 4 Rows (Vertical) */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: { xs: 2, sm: 1 },
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                    {/* Row 1 */}
                    <Box sx={{ display: 'flex', width: '100%', gap: { xs: 2, sm: 1 } }}>
                        <Card
                            onClick={logout}
                            sx={cardStyle(false)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <LogoutIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode 
                                        ? 'white' 
                                        : theme.palette.text.primary
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    Çıkış Yap
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Hesaptan çıkış yap
                                </Typography>
                            </Box>
                        </Card>
                        
                        <Card
                            onClick={() => {
                                if (userCards.length === 0) {
                                    alert('Görüntülenecek kart bulunamadı. Önce bir kart oluşturun.');
                                    return;
                                }
                                
                                // İlk kartın public URL'sine git
                                const firstCard = userCards[0];
                                const publicUrl = `/card/${firstCard.customSlug || firstCard.id}`;
                                window.open(publicUrl, '_blank');
                            }}
                            sx={cardStyle(true)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <VisibilityIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode ? 'white' : theme.palette.text.primary 
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    Görüntüle
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Kartviziti görüntüle
                                </Typography>
                            </Box>
                        </Card>
                    </Box>

                    {/* Row 2 */}
                    <Box sx={{ display: 'flex', width: '100%', gap: { xs: 2, sm: 1 } }}>
                        <Card
                            onClick={() => navigate('/analytics')}
                            sx={cardStyle(false)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <BarChartIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode 
                                        ? 'white' 
                                        : theme.palette.text.primary
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    İstatistikler
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Analiz ve raporlar
                                </Typography>
                            </Box>
                        </Card>
                        
                        <Card
                            onClick={() => navigate('/profile')}
                            sx={cardStyle(true)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <PersonIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode 
                                        ? 'white' 
                                        : theme.palette.text.primary
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    Profilim
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Hesap ayarları
                                </Typography>
                            </Box>
                        </Card>
                    </Box>

                    {/* Row 3 */}
                    <Box sx={{ display: 'flex', width: '100%', gap: { xs: 2, sm: 1 } }}>
                        <Card
                            onClick={handleEdit}
                            sx={cardStyle(false)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <EditIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode ? 'white' : theme.palette.text.primary 
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    Düzenle
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Kartı düzenle
                                </Typography>
                            </Box>
                        </Card>
                        
                        <Card
                            onClick={handleOpenQrModal}
                            sx={cardStyle(true)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <QrIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode ? 'white' : theme.palette.text.primary 
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    QR Kod
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    QR kod oluştur
                                </Typography>
                            </Box>
                        </Card>
                    </Box>

                    {/* Row 4 */}
                    <Box sx={{ display: 'flex', width: '100%', gap: { xs: 2, sm: 1 } }}>
                        <Card
                            onClick={handleToggleStatus}
                            sx={cardStyle(false)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <PowerSettingsNewIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode 
                                        ? 'white' 
                                        : theme.palette.text.primary
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    {userCards.length > 0 && userCards[0].isActive ? 'Pasif Yap' : 'Aktif Yap'}
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    {userCards.length > 0 && userCards[0].isActive ? 'Kartı pasif yap' : 'Kartı aktif yap'}
                                </Typography>
                            </Box>
                        </Card>
                        
                        <Card
                            onClick={handleShare}
                            sx={cardStyle(true)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <ShareIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode 
                                        ? 'white' 
                                        : theme.palette.text.primary
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    Paylaş
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Kartı paylaş
                                </Typography>
                            </Box>
                        </Card>
                    </Box>
                        </Box>
                    </Box>
                    
                    {/* QR Kod Modal */}
                    <QrCodeModal
                        open={qrModalOpen}
                        onClose={handleCloseQrModal}
                        url={selectedQrUrl}
                    />
                </Box>
            );
        }

        export default UserDashboardPage;