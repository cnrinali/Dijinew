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
    Delete as DeleteIcon,
    QrCode as QrIcon,
    Logout as LogoutIcon,
    PowerSettingsNew as PowerSettingsNewIcon,
    BarChart as BarChartIcon,
    Person as PersonIcon
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

    // Sil fonksiyonu
    const handleDelete = async () => {
        if (userCards.length === 0) {
            alert('Silinecek kart bulunamadı.');
            return;
        }

        const firstCard = userCards[0];
        if (window.confirm(`"${firstCard.name}" kartını silmek istediğinizden emin misiniz?`)) {
            try {
                await cardService.deleteCard(firstCard.id);
                alert('Kart başarıyla silindi!');
                // Kartları yeniden yükle
                const cards = await cardService.getCards();
                setUserCards(cards);
            } catch (error) {
                console.error('Kart silinirken hata:', error);
                alert('Kart silinirken bir hata oluştu.');
            }
        }
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

    // QR Kod Modal kapatma fonksiyonu
    const handleCloseQrModal = () => {
        setQrModalOpen(false);
        setSelectedQrUrl('');
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
            color: isDarkMode ? 'white' : theme.palette.text.primary
        }}>
            {/* Main Content */}
            <Box sx={{ 
                p: { xs: 2, sm: 4 },
                maxWidth: '1200px',
                mx: 'auto'
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
                            onClick={() => navigate('/cards')}
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
                                    Kartları görüntüle
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
                            onClick={handleDelete}
                            sx={cardStyle(false)}
                        >
                            <Box sx={iconContainerStyle()}>
                                <DeleteIcon sx={{ 
                                    fontSize: { xs: 30, sm: 40 }, 
                                    color: isDarkMode ? 'white' : theme.palette.text.primary 
                                }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={textStyle()}>
                                    Sil
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Kartı sil
                                </Typography>
                            </Box>
                        </Card>
                        
                        <Card
                            onClick={() => {
                                alert('Kart aktif/pasif etme özelliği yakında eklenecek!');
                            }}
                            sx={cardStyle(true)}
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
                                    Aktif/Pasif Et
                                </Typography>
                                <Typography variant="body2" sx={subtitleStyle()}>
                                    Kartı aktif/pasif et
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