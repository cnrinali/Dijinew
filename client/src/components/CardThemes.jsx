import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Link,
    IconButton,
    Stack,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Snackbar,
    Alert,
    Grid,
    CircularProgress
} from '@mui/material';
import analyticsService, { trackClick } from '../services/analyticsService';
import { QRCodeSVG } from 'qrcode.react';

// Icon Imports
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
// Yeni sosyal medya icon'ları
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ChatIcon from '@mui/icons-material/Chat';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShareIcon from '@mui/icons-material/Share';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import HomeIcon from '@mui/icons-material/Home';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import { formatIban, getBankLogo } from '../constants/turkishBanks';

// Pazaryeri ikonları ve isimleri
const getMarketplaceIcon = (marketplace) => {
    switch (marketplace) {
        case 'trendyol': return <StorefrontIcon />;
        case 'hepsiburada': return <ShoppingCartIcon />;
        case 'ciceksepeti': return <LocalFloristIcon />;
        case 'sahibinden': return <HomeIcon />;
        case 'hepsiemlak': return <HomeIcon />;
        case 'gittigidiyor': return <StorefrontIcon />;
        case 'n11': return <ShoppingCartIcon />;
        case 'amazonTr': return <ShoppingCartIcon />;
        case 'getir': return <DeliveryDiningIcon />;
        case 'yemeksepeti': return <RestaurantIcon />;
        default: return <StorefrontIcon />;
    }
};

const getMarketplaceName = (marketplace) => {
    switch (marketplace) {
        case 'trendyol': return 'Trendyol';
        case 'hepsiburada': return 'Hepsiburada';
        case 'ciceksepeti': return 'Çiçeksepeti';
        case 'sahibinden': return 'Sahibinden';
        case 'hepsiemlak': return 'Hepsiemlak';
        case 'gittigidiyor': return 'GittiGidiyor';
        case 'n11': return 'N11';
        case 'amazonTr': return 'Amazon TR';
        case 'getir': return 'Getir';
        case 'yemeksepeti': return 'Yemeksepeti';
        default: return marketplace;
    }
};

const getVideoEmbedUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return '';
    }

    const trimmedUrl = url.trim();

    if (trimmedUrl.includes('youtube.com/watch')) {
        const videoId = trimmedUrl.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } else if (trimmedUrl.includes('youtu.be/')) {
        const videoId = trimmedUrl.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } else if (trimmedUrl.includes('youtube.com/shorts')) {
        const videoId = trimmedUrl.split('shorts/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } else if (trimmedUrl.includes('vimeo.com/')) {
        const videoId = trimmedUrl.split('vimeo.com/')[1]?.split('?')[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }

    return trimmedUrl;
};

// Ortak QR kod ve paylaş fonksiyonları
const useCardActions = (cardData) => {
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [shareSnackbarOpen, setShareSnackbarOpen] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    const cardUrl = `${window.location.origin}/card/${cardData?.customSlug || cardData?.id}`;

    const handleQrClick = () => {
        if (cardData?.id) {
            trackClick(cardData.id, 'qr_code');
        }
        setQrModalOpen(true);
    };

    const handleShareClick = async () => {
        if (cardData?.id) {
            trackClick(cardData.id, 'share');
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: cardData?.name || 'Kartvizit',
                    text: `${cardData?.name || 'Kartvizit'} - ${cardData?.title || ''}`,
                    url: cardUrl
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(cardUrl);
            setShareSnackbarOpen(true);
        } catch (error) {
            console.error('Panoya kopyalama hatası:', error);
        }
    };

    const QrModal = () => (
        <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Kartvizit QR Kodu
                <IconButton onClick={() => setQrModalOpen(false)} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <QRCodeSVG value={cardUrl} size={256} includeMargin={true} />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button variant="outlined" onClick={() => setQrModalOpen(false)}>
                    Kapat
                </Button>
            </DialogActions>
        </Dialog>
    );

    const ShareSnackbar = () => (
        <Snackbar
            open={shareSnackbarOpen}
            autoHideDuration={3000}
            onClose={() => setShareSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => setShareSnackbarOpen(false)} severity="success">
                Link panoya kopyalandı!
            </Alert>
        </Snackbar>
    );

    const handleVideoClick = () => {
        if (cardData?.videoUrl) {
            setVideoModalOpen(true);
        }
    };

    const VideoModal = () => {
        return (
            <Dialog 
                open={videoModalOpen} 
                onClose={() => setVideoModalOpen(false)} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Tanıtım Videosu
                    <IconButton onClick={() => setVideoModalOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
                        {cardData?.videoUrl ? (
                            <iframe
                                src={getVideoEmbedUrl(cardData.videoUrl)}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: '8px' }}
                            />
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                backgroundColor: '#f5f5f5',
                                color: '#666'
                            }}>
                                <Typography variant="body1">
                                    Video URL bulunamadı
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant="outlined" onClick={() => setVideoModalOpen(false)}>
                        Kapat
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return {
        handleQrClick,
        handleShareClick,
        handleVideoClick,
        QrModal,
        ShareSnackbar,
        VideoModal,
        cardUrl
    };
};

// Default tema (şu anki)
export const DefaultTheme = ({ cardData }) => {
    const { handleQrClick, handleShareClick, handleVideoClick, QrModal, ShareSnackbar, VideoModal } = useCardActions(cardData);
    
    // Döküman modal state'i
    const [documentsModalOpen, setDocumentsModalOpen] = useState(false);

    // Kart görüntülenmesini kaydet
    useEffect(() => {
        if (cardData?.id) {
            analyticsService.recordCardView(cardData.id);
        }
    }, [cardData?.id]);

    useEffect(() => {
        setShowInlineVideo(false);
    }, [embedUrl]);

    // Link tıklama handler'ı
    const handleLinkClick = (linkType) => {
        console.log(`DefaultTheme - handleLinkClick çağrıldı: linkType=${linkType}, cardId=${cardData?.id}`);
        if (cardData?.id) {
            console.log(`DefaultTheme - trackClick çağrılıyor...`);
            trackClick(cardData.id, linkType);
        } else {
            console.log(`DefaultTheme - cardData.id bulunamadı:`, cardData);
        }
    };


    return (
        <Card sx={{ maxWidth: 500, width: '100%', mt: 2 }}>
            {cardData.coverImageUrl && (
                <CardMedia
                    component="img"
                    height="160"
                    image={cardData.coverImageUrl}
                    alt="Kapak Fotoğrafı"
                    sx={{ objectFit: 'cover' }}
                />
            )}
            <CardContent sx={{ textAlign: 'center', position: 'relative', pt: cardData.profileImageUrl ? 6 : 2 }}>
                {cardData.profileImageUrl && (
                    <Avatar
                        alt={cardData.name || 'Profil'}
                        src={cardData.profileImageUrl}
                        sx={{
                            width: 100,
                            height: 100,
                            position: 'absolute',
                            top: -50,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '3px solid white',
                            bgcolor: 'grey.300'
                        }}
                    />
                )}
                <Typography gutterBottom variant="h5" component="div" sx={{ mt: cardData.profileImageUrl ? 2 : 0 }}>
                    {cardData.name || 'İsim Belirtilmemiş'}
                </Typography>
                {cardData.title && (
                    <Typography variant="body1" color="text.secondary">
                        {cardData.title}
                    </Typography>
                )}
                {cardData.company && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                        <BusinessIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        {cardData.company}
                    </Typography>
                )}
            </CardContent>

            {cardData.bio && (
                <>
                    <Divider />
                    <CardContent sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <InfoIcon sx={{ mr: 1 }} /> Hakkında
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {cardData.bio}
                        </Typography>
                    </CardContent>
                </>
            )}

            <Divider />

            <CardContent sx={{ pt: 1, pb: 1 }}>
                <List dense>
                    {cardData.phone && (
                        <ListItem 
                            component={Link} 
                            href={`tel:${cardData.phone}`}
                            onClick={() => handleLinkClick('phone')}
                        >
                            <ListItemIcon><PhoneIcon /></ListItemIcon>
                            <ListItemText primary={cardData.phone} />
                        </ListItem>
                    )}
                    {cardData.email && (
                        <ListItem 
                            component={Link} 
                            href={`mailto:${cardData.email}`}
                            onClick={() => handleLinkClick('email')}
                        >
                            <ListItemIcon><EmailIcon /></ListItemIcon>
                            <ListItemText primary={cardData.email} />
                        </ListItem>
                    )}
                    {cardData.website && (
                        <ListItem 
                            component={Link} 
                            href={cardData.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => handleLinkClick('website')}
                        >
                            <ListItemIcon><LanguageIcon /></ListItemIcon>
                            <ListItemText primary={cardData.website} />
                        </ListItem>
                    )}
                    {cardData.address && (
                        <ListItem>
                            <ListItemIcon><LocationOnIcon /></ListItemIcon>
                            <ListItemText primary={cardData.address} />
                        </ListItem>
                    )}
                </List>
            </CardContent>

            {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                <>
                    <Divider />
                    <CardContent sx={{ pt: 1, pb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccountBalanceIcon sx={{ mr: 1 }} /> Banka Hesapları
                        </Typography>
                        <List dense>
                            {cardData.bankAccounts.map((account, index) => {
                                const bankLogo = getBankLogo(account.bankName);
                                return (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemIcon>
                                            {bankLogo ? (
                                                <Box
                                                    component="img"
                                                    src={bankLogo}
                                                    alt={account.bankName}
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            ) : (
                                                <AccountBalanceIcon fontSize="small" />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={account.bankName}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatIban(account.iban)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {account.accountName}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </CardContent>
                </>
            )}

            {/* Pazaryeri Linkleri */}
            {(cardData.trendyolUrl || cardData.hepsiburadaUrl || cardData.ciceksepeti || cardData.sahibindenUrl || 
              cardData.hepsiemlakUrl || cardData.gittigidiyorUrl || cardData.n11Url || cardData.amazonTrUrl || 
              cardData.getirUrl || cardData.yemeksepetiUrl || cardData.arabamUrl || cardData.letgoUrl || 
              cardData.pttAvmUrl || cardData.ciceksepetiUrl || cardData.websiteUrl || cardData.whatsappBusinessUrl) && (
                <>
                    <Divider />
                    <CardContent sx={{ pt: 1, pb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StorefrontIcon sx={{ mr: 1 }} /> Pazaryeri Linkleri
                        </Typography>
                        <List dense>
                            {cardData.trendyolUrl && (
                                <ListItem 
                                    component={Link} 
                                    href={cardData.trendyolUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => handleLinkClick('trendyol')}
                                >
                                    <ListItemIcon>
                                        <img 
                                            src="/img/ikon/trendyol.png" 
                                            alt="Trendyol" 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('trendyol')} />
                                </ListItem>
                            )}
                            {cardData.hepsiburadaUrl && (
                                <ListItem component={Link} href={cardData.hepsiburadaUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>
                                        <img 
                                            src="/img/ikon/hepsiburada.png" 
                                            alt="Hepsiburada" 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('hepsiburada')} />
                                </ListItem>
                            )}
                            {cardData.ciceksepeti && (
                                <ListItem component={Link} href={cardData.ciceksepeti} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>
                                        <img 
                                            src="/img/ikon/ciceksepeti.png" 
                                            alt="Çiçeksepeti" 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('ciceksepeti')} />
                                </ListItem>
                            )}
                            {cardData.sahibindenUrl && (
                                <ListItem component={Link} href={cardData.sahibindenUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>
                                        <img 
                                            src="/img/ikon/sahibinden.png" 
                                            alt="Sahibinden" 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('sahibinden')} />
                                </ListItem>
                            )}
                            {cardData.hepsiemlakUrl && (
                                <ListItem component={Link} href={cardData.hepsiemlakUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>
                                        <img 
                                            src="/img/ikon/hepsiemlak.png" 
                                            alt="Hepsiemlak" 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('hepsiemlak')} />
                                </ListItem>
                            )}
                            {cardData.gittigidiyorUrl && (
                                <ListItem component={Link} href={cardData.gittigidiyorUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>{getMarketplaceIcon('gittigidiyor')}</ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('gittigidiyor')} />
                                </ListItem>
                            )}
                            {cardData.n11Url && (
                                <ListItem component={Link} href={cardData.n11Url} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>
                                        <img 
                                            src="/img/ikon/n11.png" 
                                            alt="N11" 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('n11')} />
                                </ListItem>
                            )}
                            {cardData.amazonTrUrl && (
                                <ListItem component={Link} href={cardData.amazonTrUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>
                                        <img 
                                            src="/img/ikon/amazon.png" 
                                            alt="Amazon" 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('amazonTr')} />
                                </ListItem>
                            )}
                            {cardData.getirUrl && (
                                <ListItem component={Link} href={cardData.getirUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>{getMarketplaceIcon('getir')}</ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('getir')} />
                                </ListItem>
                            )}
                            {cardData.yemeksepetiUrl && (
                                <ListItem component={Link} href={cardData.yemeksepetiUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>{getMarketplaceIcon('yemeksepeti')}</ListItemIcon>
                                    <ListItemText primary={getMarketplaceName('yemeksepeti')} />
                                </ListItem>
                            )}
                            {cardData.arabamUrl && (
                                <ListItem component={Link} href={cardData.arabamUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon><BusinessIcon /></ListItemIcon>
                                    <ListItemText primary="Arabam" />
                                </ListItem>
                            )}
                            {cardData.letgoUrl && (
                                <ListItem component={Link} href={cardData.letgoUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon><StoreIcon /></ListItemIcon>
                                    <ListItemText primary="Letgo" />
                                </ListItem>
                            )}
                            {cardData.pttAvmUrl && (
                                <ListItem component={Link} href={cardData.pttAvmUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon><StoreIcon /></ListItemIcon>
                                    <ListItemText primary="PTT AVM" />
                                </ListItem>
                            )}
                            {cardData.ciceksepetiUrl && (
                                <ListItem component={Link} href={cardData.ciceksepetiUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon><LocalFloristIcon /></ListItemIcon>
                                    <ListItemText primary="Çiçek Sepeti" />
                                </ListItem>
                            )}
                            {cardData.websiteUrl && (
                                <ListItem component={Link} href={cardData.websiteUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon><LanguageIcon /></ListItemIcon>
                                    <ListItemText primary="Web Sitesi" />
                                </ListItem>
                            )}
                            {cardData.whatsappBusinessUrl && (
                                <ListItem component={Link} href={cardData.whatsappBusinessUrl} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon><WhatsAppIcon /></ListItemIcon>
                                    <ListItemText primary="WhatsApp Business" />
                                </ListItem>
                            )}
                        </List>
                    </CardContent>
                </>
            )}

            {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl || 
              cardData.whatsappUrl || cardData.facebookUrl || cardData.telegramUrl || 
              cardData.youtubeUrl || cardData.skypeUrl || cardData.wechatUrl || 
              cardData.snapchatUrl || cardData.pinterestUrl || cardData.tiktokUrl) && (
                <>
                    <Divider variant="middle" />
                    <CardContent sx={{ py: 1, textAlign: 'center' }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                            {cardData.linkedinUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.linkedinUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="LinkedIn" 
                                    color="primary"
                                    onClick={() => handleLinkClick('linkedin')}
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            )}
                            {cardData.twitterUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.twitterUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Twitter" 
                                    color="info"
                                    onClick={() => handleLinkClick('twitter')}
                                >
                                    <TwitterIcon />
                                </IconButton>
                            )}
                            {cardData.instagramUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.instagramUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Instagram" 
                                    sx={{ color: '#F4C734' }}
                                    onClick={() => handleLinkClick('instagram')}
                                >
                                    <InstagramIcon />
                                </IconButton>
                            )}
                            {cardData.whatsappUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.whatsappUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="WhatsApp" 
                                    sx={{ color: '#25D366' }}
                                    onClick={() => handleLinkClick('whatsapp')}
                                >
                                    <WhatsAppIcon />
                                </IconButton>
                            )}
                            {cardData.facebookUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.facebookUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Facebook" 
                                    sx={{ color: '#1877F2' }}
                                    onClick={() => handleLinkClick('facebook')}
                                >
                                    <FacebookIcon />
                                </IconButton>
                            )}
                            {cardData.telegramUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.telegramUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Telegram" 
                                    sx={{ color: '#0088CC' }}
                                    onClick={() => handleLinkClick('telegram')}
                                >
                                    <TelegramIcon />
                                </IconButton>
                            )}
                            {cardData.youtubeUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.youtubeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="YouTube" 
                                    sx={{ color: '#FF0000' }}
                                    onClick={() => handleLinkClick('youtube')}
                                >
                                    <YouTubeIcon />
                                </IconButton>
                            )}
                            {cardData.skypeUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.skypeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Skype" 
                                    sx={{ color: '#00AFF0' }}
                                    onClick={() => handleLinkClick('skype')}
                                >
                                    <VideoCallIcon />
                                </IconButton>
                            )}
                            {cardData.wechatUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.wechatUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="WeChat" 
                                    sx={{ color: '#07C160' }}
                                    onClick={() => handleLinkClick('wechat')}
                                >
                                    <ChatIcon />
                                </IconButton>
                            )}
                            {cardData.snapchatUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.snapchatUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Snapchat" 
                                    sx={{ color: '#FFFC00' }}
                                    onClick={() => handleLinkClick('snapchat')}
                                >
                                    <CameraAltIcon />
                                </IconButton>
                            )}
                            {cardData.pinterestUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.pinterestUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="Pinterest" 
                                    sx={{ color: '#E60023' }}
                                    onClick={() => handleLinkClick('pinterest')}
                                >
                                    <ShareIcon />
                                </IconButton>
                            )}
                            {cardData.tiktokUrl && (
                                <IconButton 
                                    component="a" 
                                    href={cardData.tiktokUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    aria-label="TikTok" 
                                    sx={{ color: '#000000' }}
                                    onClick={() => handleLinkClick('tiktok')}
                                >
                                    <MusicNoteIcon />
                                </IconButton>
                            )}
                        </Stack>
                    </CardContent>
                </>
            )}

            <Divider />
            
            {/* QR Kod ve Paylaş Butonları */}
            <CardContent sx={{ py: 2, textAlign: 'center' }}>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                    <IconButton
                        onClick={handleQrClick}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        <QrCodeIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleShareClick}
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                            },
                        }}
                    >
                        <ShareIcon />
                    </IconButton>
                    {cardData?.videoUrl && (
                        <IconButton
                            onClick={handleVideoClick}
                            sx={{
                                backgroundColor: 'error.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'error.dark',
                                },
                            }}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    )}
                </Stack>
                
                {/* Dökümanlar - Tek İkon */}
                {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <IconButton
                            onClick={() => setDocumentsModalOpen(true)}
                            sx={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#b71c1c',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)'
                            }}
                        >
                            <DescriptionIcon sx={{ fontSize: 28 }} />
                        </IconButton>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                            {cardData.documents.length} Döküman
                        </Typography>
                    </Box>
                )}
                
                <Typography variant="caption" color="text.secondary">
                    {cardData.cardName}
                </Typography>
            </CardContent>
            
            <QrModal />
            <ShareSnackbar />
            <VideoModal />
            
            {/* Dökümanlar Modal */}
            <Dialog 
                open={documentsModalOpen} 
                onClose={() => setDocumentsModalOpen(false)}
                maxWidth="sm"
                fullWidth
                aria-labelledby="documents-modal-title"
                aria-describedby="documents-modal-description"
            >
                <DialogTitle id="documents-modal-title" sx={{ textAlign: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <DescriptionIcon sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Dökümanlar ({cardData.documents?.length || 0})
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent id="documents-modal-description">
                    <List>
                        {cardData.documents?.map((document, index) => {
                            return (
                            <ListItem 
                                key={index}
                                onClick={() => {
                                    try {
                                        // PDF'i yeni sekmede aç
                                        if (document.url) {
                                            console.log('Döküman URL açılıyor:', document.url);
                                            window.open(document.url, '_blank');
                                        } else {
                                            console.warn('Döküman URL\'i bulunamadı:', document);
                                            alert(`"${document.name}" dökümanı için URL bulunamadı. Lütfen dökümanı tekrar ekleyin.`);
                                        }
                                    } catch (error) {
                                        console.error('PDF açma hatası:', error);
                                        alert('PDF açılamadı. Lütfen URL\'yi kontrol edin.');
                                    }
                                    setDocumentsModalOpen(false);
                                }}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <DescriptionIcon sx={{ color: '#d32f2f' }} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={document.name}
                                    secondary={document.type || 'Döküman'}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton 
                                        edge="end" 
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            try {
                                                // PDF'i indir
                                                if (document.url) {
                                                    const a = document.createElement('a');
                                                    a.href = document.url;
                                                    a.download = document.name;
                                                    a.click();
                                                } else {
                                                    console.warn('İndirilecek URL bulunamadı:', document);
                                                    alert(`"${document.name}" dökümanı için URL bulunamadı. Lütfen dökümanı tekrar ekleyin.`);
                                                }
                                            } catch (error) {
                                                console.error('PDF indirme hatası:', error);
                                                alert('PDF indirilemedi. Lütfen URL\'yi kontrol edin.');
                                            }
                                        }}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDocumentsModalOpen(false)}>
                        Kapat
                    </Button>
                </DialogActions>
            </Dialog>
            
        </Card>
    );
};

// Modern Tema (ekran görüntüsündeki gibi)
export const ModernTheme = ({ cardData }) => {
    return (
        <Box sx={{ maxWidth: 500, width: '100%', mt: 2 }}>
            {/* Üst Bölüm - Profil Fotoğrafı ve Temel Bilgiler */}
            <Paper 
                sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '20px 20px 0 0'
                }}
            >
                <Avatar
                    alt={cardData.name || 'Profil'}
                    src={cardData.profileImageUrl}
                    sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid white'
                    }}
                />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {cardData.name || 'İsim Belirtilmemiş'}
                </Typography>
                {cardData.title && (
                    <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                        {cardData.title}
                    </Typography>
                )}
                {cardData.company && (
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {cardData.company}
                    </Typography>
                )}
            </Paper>

            {/* Alt Bölüm - İletişim Bilgileri */}
            <Paper sx={{ borderRadius: '0 0 20px 20px', overflow: 'hidden' }}>
                {cardData.bio && (
                    <CardContent sx={{ backgroundColor: 'grey.50' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            {cardData.bio}
                        </Typography>
                    </CardContent>
                )}

                <CardContent>
                    <Stack spacing={2}>
                        {cardData.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="body2">{cardData.phone}</Typography>
                            </Box>
                        )}
                        {cardData.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Link href={`mailto:${cardData.email}`} sx={{ textDecoration: 'none' }}>
                                    <Typography variant="body2">{cardData.email}</Typography>
                                </Link>
                            </Box>
                        )}
                        {cardData.website && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LanguageIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Link href={cardData.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none' }}>
                                    <Typography variant="body2">{cardData.website}</Typography>
                                </Link>
                            </Box>
                        )}
                        {cardData.address && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="body2">{cardData.address}</Typography>
                            </Box>
                        )}
                    </Stack>

                    {/* Banka Hesapları */}
                    {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 'bold' }}>
                                <AccountBalanceIcon sx={{ mr: 1 }} /> Banka Hesapları
                            </Typography>
                            <Stack spacing={1.5}>
                                {cardData.bankAccounts.map((account, index) => {
                                    const bankLogo = getBankLogo(account.bankName);
                                    return (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            {bankLogo ? (
                                                <Box
                                                    component="img"
                                                    src={bankLogo}
                                                    alt={account.bankName}
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        objectFit: 'contain',
                                                        mr: 2,
                                                        mt: 0.5
                                                    }}
                                                />
                                            ) : (
                                                <AccountBalanceIcon sx={{ mr: 2, mt: 0.5, color: 'primary.main', fontSize: '1.2rem' }} />
                                            )}
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                                                    {account.bankName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                                    {formatIban(account.iban)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                                    {account.accountName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </>
                    )}

                    {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl || 
              cardData.whatsappUrl || cardData.facebookUrl || cardData.telegramUrl || 
              cardData.youtubeUrl || cardData.skypeUrl || cardData.wechatUrl || 
              cardData.snapchatUrl || cardData.pinterestUrl || cardData.tiktokUrl) && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" spacing={1} justifyContent="center">
                                {cardData.linkedinUrl && (
                                    <IconButton component="a" href={cardData.linkedinUrl} target="_blank" rel="noopener noreferrer" sx={{ backgroundColor: '#0077B5', color: 'white', '&:hover': { backgroundColor: '#005885' } }}>
                                        <LinkedInIcon />
                                    </IconButton>
                                )}
                                {cardData.twitterUrl && (
                                    <IconButton component="a" href={cardData.twitterUrl} target="_blank" rel="noopener noreferrer" sx={{ backgroundColor: '#1DA1F2', color: 'white', '&:hover': { backgroundColor: '#0d8bd9' } }}>
                                        <TwitterIcon />
                                    </IconButton>
                                )}
                                {cardData.instagramUrl && (
                                    <IconButton component="a" href={cardData.instagramUrl} target="_blank" rel="noopener noreferrer" sx={{ backgroundColor: '#E1306C', color: 'white', '&:hover': { backgroundColor: '#c12958' } }}>
                                        <InstagramIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        </>
                    )}
                    
                    {/* Dökümanlar */}
                    {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 'bold' }}>
                                <DescriptionIcon sx={{ mr: 1 }} /> Dökümanlar
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {cardData.documents.map((document, index) => (
                                    <Box 
                                        key={index}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            p: 1,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 1,
                                            border: '1px solid #e0e0e0',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                borderColor: '#1976d2'
                                            }
                                        }}
                                        onClick={() => {
                                            if (document.url) {
                                                window.open(document.url, '_blank');
                                            }
                                        }}
                                    >
                                        <DescriptionIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {document.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </>
                    )}
                </CardContent>

                <CardContent sx={{ py: 1, textAlign: 'center', backgroundColor: 'grey.100' }}>
                    <Typography variant="caption" color="text.secondary">
                        {cardData.cardName}
                    </Typography>
                </CardContent>
            </Paper>
        </Box>
    );
};

// İkon Grid Tema (ekran görüntüsündeki gibi)
export const IconGridTheme = ({ cardData }) => {
    const { handleQrClick, handleShareClick, QrModal, ShareSnackbar } = useCardActions(cardData);

    // Kart görüntülenmesini kaydet
    useEffect(() => {
        if (cardData?.id) {
            analyticsService.recordCardView(cardData.id);
        }
    }, [cardData?.id]);

    // Link tıklama handler'ı
    const handleLinkClick = (linkType) => {
        console.log(`IconGridTheme - handleLinkClick çağrıldı: linkType=${linkType}, cardId=${cardData?.id}`);
        if (cardData?.id) {
            console.log(`IconGridTheme - trackClick çağrılıyor...`);
            trackClick(cardData.id, linkType);
        } else {
            console.log(`IconGridTheme - cardData.id bulunamadı:`, cardData);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, width: '100%', mt: 2 }}>
            {/* Üst Kısım - Profil */}
            <Paper sx={{ textAlign: 'center', p: 3, borderRadius: 3, mb: 2 }}>
                <Avatar
                    alt={cardData.name || 'Profil'}
                    src={cardData.profileImageUrl}
                    sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        border: '3px solid #f0f0f0'
                    }}
                />
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {cardData.name || 'İsim Belirtilmemiş'}
                </Typography>
                {cardData.title && (
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 500 }}>
                        {cardData.title}
                    </Typography>
                )}
                {cardData.company && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {cardData.company}
                    </Typography>
                )}
            </Paper>

            {/* İkon Grid */}
            <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Stack spacing={2}>
                    {/* İlk Satır */}
                    <Stack direction="row" spacing={1} justifyContent="space-around">
                        {cardData.phone && (
                            <Box 
                                component={Link} 
                                href={`tel:${cardData.phone}`}
                                onClick={() => handleLinkClick('phone')}
                                sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'green.50', minWidth: 80, textDecoration: 'none' }}
                            >
                                <PhoneIcon sx={{ fontSize: 28, color: 'green.main', mb: 0.5 }} />
                                <Typography variant="caption" display="block">TELEFON</Typography>
                            </Box>
                        )}
                        {cardData.email && (
                            <Box 
                                component={Link} 
                                href={`mailto:${cardData.email}`}
                                onClick={() => handleLinkClick('email')}
                                sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'blue.50', minWidth: 80, textDecoration: 'none' }}
                            >
                                <EmailIcon sx={{ fontSize: 28, color: 'blue.main', mb: 0.5 }} />
                                <Typography variant="caption" display="block">E-POSTA</Typography>
                            </Box>
                        )}
                        {cardData.address && (
                            <Box sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'red.50', minWidth: 80 }}>
                                <LocationOnIcon sx={{ fontSize: 28, color: 'red.main', mb: 0.5 }} />
                                <Typography variant="caption" display="block">KONUM</Typography>
                            </Box>
                        )}
                    </Stack>

                    {/* İkinci Satır */}
                    <Stack direction="row" spacing={1} justifyContent="space-around">
                        {cardData.website && (
                            <Box 
                                component={Link} 
                                href={cardData.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={() => handleLinkClick('website')}
                                sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'purple.50', minWidth: 80, textDecoration: 'none' }}
                            >
                                <LanguageIcon sx={{ fontSize: 28, color: 'purple.main', mb: 0.5 }} />
                                <Typography variant="caption" display="block">WEB SİTESİ</Typography>
                            </Box>
                        )}
                        {cardData.bio && (
                            <Box sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'orange.50', minWidth: 80 }}>
                                <InfoIcon sx={{ fontSize: 28, color: 'orange.main', mb: 0.5 }} />
                                <Typography variant="caption" display="block">HAKKIMDA</Typography>
                            </Box>
                        )}
                        <Box 
                            onClick={handleQrClick}
                            sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'primary.50', minWidth: 80 }}
                        >
                            <QrCodeIcon sx={{ fontSize: 28, color: 'primary.main', mb: 0.5 }} />
                            <Typography variant="caption" display="block">QR KOD</Typography>
                        </Box>
                        <Box 
                            onClick={handleShareClick}
                            sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'secondary.50', minWidth: 80 }}
                        >
                            <ShareIcon sx={{ fontSize: 28, color: 'secondary.main', mb: 0.5 }} />
                            <Typography variant="caption" display="block">PAYLAŞ</Typography>
                        </Box>
                    </Stack>

                    {/* Banka Hesapları Satırı */}
                    {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                        <Stack direction="row" spacing={1} justifyContent="flex-start" sx={{ flexWrap: 'wrap', gap: 1 }}>
                            {cardData.bankAccounts.map((account, index) => {
                                const bankLogo = getBankLogo(account.bankName);
                                return (
                                    <Box 
                                        key={index}
                                        sx={{ 
                                            textAlign: 'center', 
                                            cursor: 'pointer', 
                                            p: 1, 
                                            borderRadius: 2, 
                                            backgroundColor: 'indigo.50', 
                                            minWidth: 120,
                                            border: '1px solid',
                                            borderColor: 'indigo.200'
                                        }}
                                    >
                                        {bankLogo ? (
                                            <Box
                                                component="img"
                                                src={bankLogo}
                                                alt={account.bankName}
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    objectFit: 'contain',
                                                    mb: 0.5
                                                }}
                                            />
                                        ) : (
                                            <AccountBalanceIcon sx={{ fontSize: 28, color: 'indigo.main', mb: 0.5 }} />
                                        )}
                                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                                            {account.bankName.toUpperCase().substring(0, 10)}
                                        </Typography>
                                        <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                                            {formatIban(account.iban).substring(0, 15)}...
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}

                    {/* Sosyal Medya Satırı */}
                    {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl || 
              cardData.whatsappUrl || cardData.facebookUrl || cardData.telegramUrl || 
              cardData.youtubeUrl || cardData.skypeUrl || cardData.wechatUrl || 
              cardData.snapchatUrl || cardData.pinterestUrl || cardData.tiktokUrl) && (
                        <Stack direction="row" spacing={1} justifyContent="space-around">
                            {cardData.linkedinUrl && (
                                <Box 
                                    component={Link} 
                                    href={cardData.linkedinUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => handleLinkClick('linkedin')}
                                    sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: '#0077B5', color: 'white', minWidth: 80, textDecoration: 'none' }}
                                >
                                    <LinkedInIcon sx={{ fontSize: 28, mb: 0.5 }} />
                                    <Typography variant="caption" display="block">LINKEDIN</Typography>
                                </Box>
                            )}
                            {cardData.instagramUrl && (
                                <Box 
                                    component={Link} 
                                    href={cardData.instagramUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => handleLinkClick('instagram')}
                                    sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: '#E1306C', color: 'white', minWidth: 80, textDecoration: 'none' }}
                                >
                                    <InstagramIcon sx={{ fontSize: 28, mb: 0.5 }} />
                                    <Typography variant="caption" display="block">INSTAGRAM</Typography>
                                </Box>
                            )}
                            {cardData.twitterUrl && (
                                <Box 
                                    component={Link} 
                                    href={cardData.twitterUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={() => handleLinkClick('twitter')}
                                    sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: '#1DA1F2', color: 'white', minWidth: 80, textDecoration: 'none' }}
                                >
                                    <TwitterIcon sx={{ fontSize: 28, mb: 0.5 }} />
                                    <Typography variant="caption" display="block">TWITTER</Typography>
                                </Box>
                            )}
                        </Stack>
                    )}
                </Stack>

                {/* Dökümanlar Satırı */}
                {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                    <Stack direction="row" spacing={1} justifyContent="flex-start" sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {console.log('[CardThemes] Rendering documents:', cardData.documents)}
                        {cardData.documents.map((document, index) => (
                            <Box 
                                key={index}
                                onClick={() => {
                                    if (document.url) {
                                        window.open(document.url, '_blank');
                                    }
                                }}
                                sx={{ 
                                    textAlign: 'center', 
                                    cursor: 'pointer', 
                                    p: 1, 
                                    borderRadius: 2, 
                                    backgroundColor: 'grey.50', 
                                    minWidth: 120,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    '&:hover': {
                                        backgroundColor: 'grey.100',
                                        borderColor: 'primary.main'
                                    }
                                }}
                            >
                                <DescriptionIcon sx={{ fontSize: 28, color: 'grey.main', mb: 0.5 }} />
                                <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                                    {document.name.length > 15 ? document.name.substring(0, 15) + '...' : document.name}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                                    DÖKÜMAN
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                )}

                {/* Alt Bilgi */}
                <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="caption" color="text.secondary">
                        {cardData.cardName}
                    </Typography>
                </Box>
            </Paper>
            
            <QrModal />
            <ShareSnackbar />
        </Box>
    );
};

// Business Tema
export const BusinessTheme = ({ cardData }) => {
    return (
        <Box sx={{ maxWidth: 450, width: '100%', mt: 2 }}>
            <Card sx={{ borderRadius: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                {/* Header */}
                <Box sx={{ backgroundColor: '#1e3a8a', color: 'white', p: 3, position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            alt={cardData.name}
                            src={cardData.profileImageUrl}
                            sx={{ width: 80, height: 80, border: '3px solid white' }}
                        />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {cardData.name || 'İsim Belirtilmemiş'}
                            </Typography>
                            {cardData.title && (
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    {cardData.title}
                                </Typography>
                            )}
                            {cardData.company && (
                                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                    {cardData.company}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Content */}
                <CardContent sx={{ p: 3 }}>
                    {cardData.bio && (
                        <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderLeft: '4px solid #1e3a8a' }}>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                {cardData.bio}
                            </Typography>
                        </Box>
                    )}

                    <Stack spacing={2}>
                        {cardData.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ backgroundColor: '#1e3a8a', p: 1, borderRadius: 1 }}>
                                    <PhoneIcon sx={{ color: 'white', fontSize: 20 }} />
                                </Box>
                                <Typography variant="body2">{cardData.phone}</Typography>
                            </Box>
                        )}
                        {cardData.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ backgroundColor: '#1e3a8a', p: 1, borderRadius: 1 }}>
                                    <EmailIcon sx={{ color: 'white', fontSize: 20 }} />
                                </Box>
                                <Link href={`mailto:${cardData.email}`} sx={{ textDecoration: 'none' }}>
                                    <Typography variant="body2">{cardData.email}</Typography>
                                </Link>
                            </Box>
                        )}
                        {cardData.website && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ backgroundColor: '#1e3a8a', p: 1, borderRadius: 1 }}>
                                    <LanguageIcon sx={{ color: 'white', fontSize: 20 }} />
                                </Box>
                                <Link href={cardData.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none' }}>
                                    <Typography variant="body2">{cardData.website}</Typography>
                                </Link>
                            </Box>
                        )}
                        {cardData.address && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ backgroundColor: '#1e3a8a', p: 1, borderRadius: 1 }}>
                                    <LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />
                                </Box>
                                <Typography variant="body2">{cardData.address}</Typography>
                            </Box>
                        )}

                        {/* Dökümanlar */}
                        {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                    Dökümanlar
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                    {cardData.documents.map((document, index) => (
                                        <Box 
                                            key={index}
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                p: 1,
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: 1,
                                                border: '1px solid #e0e0e0',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd',
                                                    borderColor: '#1976d2'
                                                }
                                            }}
                                            onClick={() => {
                                                // Döküman indirme veya görüntüleme
                                                if (document.url) {
                                                    window.open(document.url, '_blank');
                                                }
                                            }}
                                        >
                                            <DescriptionIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                                {document.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {/* Banka Hesapları */}
                        {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                            <>
                                {cardData.bankAccounts.map((account, index) => {
                                    const bankLogo = getBankLogo(account.bankName);
                                    return (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ backgroundColor: '#1e3a8a', p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {bankLogo ? (
                                                    <Box
                                                        component="img"
                                                        src={bankLogo}
                                                        alt={account.bankName}
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            objectFit: 'contain',
                                                            filter: 'brightness(0) invert(1)' // Beyaz yapmak için
                                                        }}
                                                    />
                                                ) : (
                                                    <AccountBalanceIcon sx={{ color: 'white', fontSize: 20 }} />
                                                )}
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                    {account.bankName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                                    {formatIban(account.iban)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                                    {account.accountName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </>
                        )}
                    </Stack>

                    {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl || 
              cardData.whatsappUrl || cardData.facebookUrl || cardData.telegramUrl || 
              cardData.youtubeUrl || cardData.skypeUrl || cardData.wechatUrl || 
              cardData.snapchatUrl || cardData.pinterestUrl || cardData.tiktokUrl) && (
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                            <Stack direction="row" spacing={1} justifyContent="center">
                                {cardData.linkedinUrl && (
                                    <IconButton component="a" href={cardData.linkedinUrl} target="_blank" rel="noopener noreferrer" sx={{ backgroundColor: '#0077B5', color: 'white', '&:hover': { backgroundColor: '#005885' } }}>
                                        <LinkedInIcon />
                                    </IconButton>
                                )}
                                {cardData.twitterUrl && (
                                    <IconButton component="a" href={cardData.twitterUrl} target="_blank" rel="noopener noreferrer" sx={{ backgroundColor: '#1DA1F2', color: 'white', '&:hover': { backgroundColor: '#0d8bd9' } }}>
                                        <TwitterIcon />
                                    </IconButton>
                                )}
                                {cardData.instagramUrl && (
                                    <IconButton component="a" href={cardData.instagramUrl} target="_blank" rel="noopener noreferrer" sx={{ backgroundColor: '#E1306C', color: 'white', '&:hover': { backgroundColor: '#c12958' } }}>
                                        <InstagramIcon />
                                    </IconButton>
                                )}
                            </Stack>
                        </Box>
                    )}
                    
                    {/* Dökümanlar */}
                    {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 'bold' }}>
                                <DescriptionIcon sx={{ mr: 1 }} /> Dökümanlar
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {cardData.documents.map((document, index) => (
                                    <Box 
                                        key={index}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            p: 1,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 1,
                                            border: '1px solid #e0e0e0',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                borderColor: '#1976d2'
                                            }
                                        }}
                                        onClick={() => {
                                            if (document.url) {
                                                window.open(document.url, '_blank');
                                            }
                                        }}
                                    >
                                        <DescriptionIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {document.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </>
                    )}

                    <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                        <Typography variant="caption" color="text.secondary">
                            {cardData.cardName}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

// Creative Tema
export const CreativeTheme = ({ cardData }) => {
    return (
        <Box sx={{ maxWidth: 400, width: '100%', mt: 2 }}>
            <Box sx={{ 
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
                backgroundSize: '300% 300%',
                animation: 'gradient 15s ease infinite',
                borderRadius: 4,
                p: 1,
                '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                }
            }}>
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    {/* Header */}
                    <Box sx={{ 
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
                        backdropFilter: 'blur(10px)',
                        p: 3,
                        textAlign: 'center'
                    }}>
                        <Avatar
                            alt={cardData.name}
                            src={cardData.profileImageUrl}
                            sx={{
                                width: 100,
                                height: 100,
                                mx: 'auto',
                                mb: 2,
                                border: '4px solid white',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3748', mb: 1 }}>
                            {cardData.name || 'İsim Belirtilmemiş'}
                        </Typography>
                        {cardData.title && (
                            <Chip 
                                label={cardData.title} 
                                sx={{ 
                                    backgroundColor: 'rgba(255,255,255,0.8)', 
                                    color: '#2d3748',
                                    fontWeight: 'bold',
                                    mb: 1
                                }} 
                            />
                        )}
                        {cardData.company && (
                            <Typography variant="body2" color="#4a5568">
                                {cardData.company}
                            </Typography>
                        )}
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3 }}>
                        {cardData.bio && (
                            <Box sx={{ 
                                mb: 3, 
                                p: 2, 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2,
                                color: 'white'
                            }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    "{cardData.bio}"
                                </Typography>
                            </Box>
                        )}

                        <Stack spacing={2}>
                            {cardData.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, backgroundColor: '#f7fafc' }}>
                                    <PhoneIcon sx={{ color: '#4299e1' }} />
                                    <Typography variant="body2">{cardData.phone}</Typography>
                                </Box>
                            )}
                            {cardData.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, backgroundColor: '#f7fafc' }}>
                                    <EmailIcon sx={{ color: '#48bb78' }} />
                                    <Link href={`mailto:${cardData.email}`} sx={{ textDecoration: 'none' }}>
                                        <Typography variant="body2">{cardData.email}</Typography>
                                    </Link>
                                </Box>
                            )}
                            {cardData.website && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, backgroundColor: '#f7fafc' }}>
                                    <LanguageIcon sx={{ color: '#ed8936' }} />
                                    <Link href={cardData.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none' }}>
                                        <Typography variant="body2">{cardData.website}</Typography>
                                    </Link>
                                </Box>
                            )}
                            {cardData.address && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, backgroundColor: '#f7fafc' }}>
                                    <LocationOnIcon sx={{ color: '#e53e3e' }} />
                                    <Typography variant="body2">{cardData.address}</Typography>
                                </Box>
                            )}

                            {/* Banka Hesapları */}
                            {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                                <>
                                    {cardData.bankAccounts.map((account, index) => {
                                        const bankLogo = getBankLogo(account.bankName);
                                        return (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, backgroundColor: '#f7fafc' }}>
                                                {bankLogo ? (
                                                    <Box
                                                        component="img"
                                                        src={bankLogo}
                                                        alt={account.bankName}
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                ) : (
                                                    <AccountBalanceIcon sx={{ color: '#805ad5' }} />
                                                )}
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {account.bankName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                                        {formatIban(account.iban)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                                        {account.accountName}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </>
                            )}
                        </Stack>

                        {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl || 
              cardData.whatsappUrl || cardData.facebookUrl || cardData.telegramUrl || 
              cardData.youtubeUrl || cardData.skypeUrl || cardData.wechatUrl || 
              cardData.snapchatUrl || cardData.pinterestUrl || cardData.tiktokUrl) && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    {cardData.linkedinUrl && (
                                        <IconButton 
                                            component="a" 
                                            href={cardData.linkedinUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            sx={{ 
                                                background: 'linear-gradient(45deg, #0077B5, #005885)',
                                                color: 'white',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        >
                                            <LinkedInIcon />
                                        </IconButton>
                                    )}
                                    {cardData.twitterUrl && (
                                        <IconButton 
                                            component="a" 
                                            href={cardData.twitterUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            sx={{ 
                                                background: 'linear-gradient(45deg, #1DA1F2, #0d8bd9)',
                                                color: 'white',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        >
                                            <TwitterIcon />
                                        </IconButton>
                                    )}
                                    {cardData.instagramUrl && (
                                        <IconButton 
                                            component="a" 
                                            href={cardData.instagramUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            sx={{ 
                                                background: 'linear-gradient(45deg, #E1306C, #c12958)',
                                                color: 'white',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                        >
                                            <InstagramIcon />
                                        </IconButton>
                                    )}
                                </Stack>
                            </Box>
                        )}
                        
                        {/* Dökümanlar */}
                        {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                    📄 Dökümanlar
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                    {cardData.documents.map((document, index) => (
                                        <Box 
                                            key={index}
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                p: 1,
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: 2,
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                cursor: 'pointer',
                                                backdropFilter: 'blur(10px)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    borderColor: 'rgba(255,255,255,0.4)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => {
                                                if (document.url) {
                                                    window.open(document.url, '_blank');
                                                }
                                            }}
                                        >
                                            <DescriptionIcon sx={{ color: '#4ECDC4', fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                                                {document.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <Box sx={{ textAlign: 'center', mt: 2, pt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                {cardData.cardName}
                            </Typography>
                        </Box>
                    </CardContent>
                </Paper>
            </Box>
        </Box>
    );
};

// Dark Tema
export const DarkTheme = ({ cardData }) => {
    return (
        <Card sx={{ maxWidth: 500, width: '100%', mt: 2, backgroundColor: '#1a1a1a', color: 'white' }}>
            {cardData.coverImageUrl && (
                <CardMedia
                    component="img"
                    height="160"
                    image={cardData.coverImageUrl}
                    alt="Kapak Fotoğrafı"
                    sx={{ objectFit: 'cover', filter: 'brightness(0.8)' }}
                />
            )}
            <CardContent sx={{ textAlign: 'center', position: 'relative', pt: cardData.profileImageUrl ? 6 : 2, backgroundColor: '#1a1a1a' }}>
                {cardData.profileImageUrl && (
                    <Avatar
                        alt={cardData.name || 'Profil'}
                        src={cardData.profileImageUrl}
                        sx={{
                            width: 100,
                            height: 100,
                            position: 'absolute',
                            top: -50,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '3px solid #333',
                            bgcolor: 'grey.700'
                        }}
                    />
                )}
                <Typography gutterBottom variant="h5" component="div" sx={{ mt: cardData.profileImageUrl ? 2 : 0, color: 'white' }}>
                    {cardData.name || 'İsim Belirtilmemiş'}
                </Typography>
                {cardData.title && (
                    <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                        {cardData.title}
                    </Typography>
                )}
                {cardData.company && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5, color: '#888' }}>
                        <BusinessIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        {cardData.company}
                    </Typography>
                )}
            </CardContent>

            {cardData.bio && (
                <>
                    <Divider sx={{ backgroundColor: '#333' }} />
                    <CardContent sx={{ textAlign: 'left', backgroundColor: '#1a1a1a' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                            <InfoIcon sx={{ mr: 1 }} /> Hakkında
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                            {cardData.bio}
                        </Typography>
                    </CardContent>
                </>
            )}

            <Divider sx={{ backgroundColor: '#333' }} />

            <CardContent sx={{ pt: 1, pb: 1, backgroundColor: '#1a1a1a' }}>
                <List dense>
                    {cardData.phone && (
                        <ListItem sx={{ color: 'white' }}>
                            <ListItemIcon><PhoneIcon sx={{ color: '#4CAF50' }} /></ListItemIcon>
                            <ListItemText primary={cardData.phone} sx={{ color: 'white' }} />
                        </ListItem>
                    )}
                    {cardData.email && (
                        <ListItem component={Link} href={`mailto:${cardData.email}`} sx={{ color: 'white', textDecoration: 'none' }}>
                            <ListItemIcon><EmailIcon sx={{ color: '#F4C734' }} /></ListItemIcon>
                            <ListItemText primary={cardData.email} sx={{ color: 'white' }} />
                        </ListItem>
                    )}
                    {cardData.website && (
                        <ListItem component={Link} href={cardData.website} target="_blank" rel="noopener noreferrer" sx={{ color: 'white', textDecoration: 'none' }}>
                            <ListItemIcon><LanguageIcon sx={{ color: '#FF9800' }} /></ListItemIcon>
                            <ListItemText primary={cardData.website} sx={{ color: 'white' }} />
                        </ListItem>
                    )}
                    {cardData.address && (
                        <ListItem sx={{ color: 'white' }}>
                            <ListItemIcon><LocationOnIcon sx={{ color: '#F44336' }} /></ListItemIcon>
                            <ListItemText primary={cardData.address} sx={{ color: 'white' }} />
                        </ListItem>
                    )}
                </List>
            </CardContent>

            {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                <>
                    <Divider sx={{ backgroundColor: '#333' }} />
                    <CardContent sx={{ pt: 1, pb: 1, backgroundColor: '#1a1a1a' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'white', mb: 1 }}>
                            <AccountBalanceIcon sx={{ mr: 1, color: '#FFD700' }} /> Banka Hesapları
                        </Typography>
                        <List dense>
                            {cardData.bankAccounts.map((account, index) => {
                                const bankLogo = getBankLogo(account.bankName);
                                return (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemIcon>
                                            {bankLogo ? (
                                                <Box
                                                    component="img"
                                                    src={bankLogo}
                                                    alt={account.bankName}
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        objectFit: 'contain',
                                                        filter: 'brightness(0) saturate(100%) invert(77%) sepia(98%) saturate(1042%) hue-rotate(4deg) brightness(105%) contrast(104%)' // Altın rengi filtre
                                                    }}
                                                />
                                            ) : (
                                                <AccountBalanceIcon sx={{ color: '#FFD700' }} fontSize="small" />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={account.bankName}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                                        {formatIban(account.iban)}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                                        {account.accountName}
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ color: 'white' }}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </CardContent>
                </>
            )}

            {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl || 
              cardData.whatsappUrl || cardData.facebookUrl || cardData.telegramUrl || 
              cardData.youtubeUrl || cardData.skypeUrl || cardData.wechatUrl || 
              cardData.snapchatUrl || cardData.pinterestUrl || cardData.tiktokUrl) && (
                <>
                    <Divider variant="middle" sx={{ backgroundColor: '#333' }} />
                    <CardContent sx={{ py: 1, textAlign: 'center', backgroundColor: '#1a1a1a' }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                            {cardData.linkedinUrl && (
                                <IconButton component="a" href={cardData.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" sx={{ color: '#000000' }}>
                                    <LinkedInIcon />
                                </IconButton>
                            )}
                            {cardData.twitterUrl && (
                                <IconButton component="a" href={cardData.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" sx={{ color: '#000000' }}>
                                    <TwitterIcon />
                                </IconButton>
                            )}
                            {cardData.instagramUrl && (
                                <IconButton component="a" href={cardData.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" sx={{ color: '#F4C734' }}>
                                    <InstagramIcon />
                                </IconButton>
                            )}
                        </Stack>
                    </CardContent>
                </>
            )}
            
            {/* Dökümanlar */}
            {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                <>
                    <Divider variant="middle" sx={{ backgroundColor: '#333' }} />
                    <CardContent sx={{ py: 2, backgroundColor: '#1a1a1a' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'white', textAlign: 'center' }}>
                            📄 Dökümanlar
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} justifyContent="center">
                            {cardData.documents.map((document, index) => (
                                <Box 
                                    key={index}
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        p: 1.5,
                                        backgroundColor: '#333',
                                        borderRadius: 2,
                                        border: '1px solid #555',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: '#444',
                                            borderColor: '#666',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                    onClick={() => {
                                        if (document.url) {
                                            window.open(document.url, '_blank');
                                        }
                                    }}
                                >
                                    <DescriptionIcon sx={{ color: '#4ECDC4', fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                                        {document.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </>
            )}

            <Divider sx={{ backgroundColor: '#333' }} />
            <CardContent sx={{ py: '8px !important', textAlign: 'center', backgroundColor: '#1a1a1a' }}>
                <Typography variant="caption" sx={{ color: '#888' }}>
                    {cardData.cardName}
                </Typography>
            </CardContent>
        </Card>
    );
};



// 3D Carousel Tema - Dönen ikonlar ile interaktif tasarım
export const CarouselTheme = ({ cardData }) => {
    const { handleQrClick, handleShareClick, QrModal, ShareSnackbar } = useCardActions(cardData);
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentRotation, setCurrentRotation] = useState(0);

    // Kart görüntülenmesini kaydet
    useEffect(() => {
        if (cardData?.id) {
            analyticsService.recordCardView(cardData.id);
        }
    }, [cardData?.id]);

    // Link tıklama handler'ı
    const handleLinkClick = (linkType) => {
        if (cardData?.id) {
            trackClick(cardData.id, linkType);
        }
    };

    // İkonlar ve linkleri
    const contactItems = [
        cardData.phone && {
            icon: <PhoneIcon sx={{ fontSize: 32 }} />,
            label: 'Telefon',
            color: '#F4C734',
            action: () => {
                handleLinkClick('phone');
                window.location.href = `tel:${cardData.phone}`;
            }
        },
        cardData.email && {
            icon: <EmailIcon sx={{ fontSize: 32 }} />,
            label: 'E-posta',
            color: '#F4C734',
            action: () => {
                handleLinkClick('email');
                window.location.href = `mailto:${cardData.email}`;
            }
        },
        cardData.website && {
            icon: <LanguageIcon sx={{ fontSize: 32 }} />,
            label: 'Web',
            color: '#000000',
            action: () => {
                handleLinkClick('website');
                window.open(cardData.website, '_blank');
            }
        },
        cardData.linkedinUrl && {
            icon: <LinkedInIcon sx={{ fontSize: 32 }} />,
            label: 'LinkedIn',
            color: '#000000',
            action: () => {
                handleLinkClick('linkedin');
                window.open(cardData.linkedinUrl, '_blank');
            }
        },
        cardData.instagramUrl && {
            icon: <InstagramIcon sx={{ fontSize: 32 }} />,
            label: 'Instagram',
            color: '#F4C734',
            action: () => {
                handleLinkClick('instagram');
                window.open(cardData.instagramUrl, '_blank');
            }
        },
        cardData.twitterUrl && {
            icon: <TwitterIcon sx={{ fontSize: 32 }} />,
            label: 'Twitter',
            color: '#000000',
            action: () => {
                handleLinkClick('twitter');
                window.open(cardData.twitterUrl, '_blank');
            }
        },
        cardData.address && {
            icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
            label: 'Konum',
            color: '#F4C734',
            action: null
        },
        {
            icon: <QrCodeIcon sx={{ fontSize: 32 }} />,
            label: 'QR Kod',
            color: '#F4C734',
            action: handleQrClick
        },
        {
            icon: <ShareIcon sx={{ fontSize: 32 }} />,
            label: 'Paylaş',
            color: '#000000',
            action: handleShareClick
        }
    ].filter(Boolean);

    // Touch/Mouse handlers
    const handleStart = (clientY) => {
        setIsDragging(true);
        setStartY(clientY);
        setCurrentRotation(rotation);
    };

    const handleMove = (clientY) => {
        if (!isDragging) return;
        const delta = clientY - startY;
        const newRotation = currentRotation + (delta * 0.5);
        setRotation(newRotation);
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    // Mouse events
    const handleMouseDown = (e) => handleStart(e.clientY);
    const handleMouseMove = (e) => handleMove(e.clientY);
    const handleMouseUp = () => handleEnd();

    // Touch events
    const handleTouchStart = (e) => handleStart(e.touches[0].clientY);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientY);
    const handleTouchEnd = () => handleEnd();

    return (
        <Box sx={{ maxWidth: 420, width: '100%', mt: 2 }}>
            <Paper 
                elevation={6}
                sx={{ 
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: '#1a1a1a', // Siyah arka plan
                }}
            >
                {/* Profil Bölümü - Kompakt */}
                <Box sx={{ 
                    backgroundColor: '#2d3748', // Koyu gri arka plan
                    pt: 2,
                    pb: 1.5,
                    textAlign: 'center',
                }}>
                    <Avatar
                        alt={cardData.name || 'Profil'}
                        src={cardData.profileImageUrl}
                        sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 1.5,
                            border: '3px solid #667eea',
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                        }}
                    />
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 700,
                            color: 'white', // Beyaz text
                            mb: 0.5,
                            fontSize: '1.1rem'
                        }}
                    >
                        {cardData.name || 'İsim Belirtilmemiş'}
                    </Typography>
                    {cardData.title && (
                        <Chip 
                            label={cardData.title}
                            size="small"
                            sx={{ 
                                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                                color: 'white',
                                fontWeight: 600,
                                mb: 0.5,
                                height: 24,
                                fontSize: '0.8rem'
                            }}
                        />
                    )}
                    {cardData.company && (
                        <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', fontSize: '0.85rem', color: '#cbd5e0' }}>
                            <BusinessIcon sx={{ fontSize: '0.9rem', mr: 0.5, verticalAlign: 'middle' }} />
                            {cardData.company}
                        </Typography>
                    )}
                </Box>

                {/* Bio - Kompakt */}
                {cardData.bio && (
                    <Box sx={{ 
                        backgroundColor: '#f7fafc',
                        p: 1.5,
                        borderTop: '1px solid #e2e8f0',
                        borderBottom: '1px solid #e2e8f0'
                    }}>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                textAlign: 'center',
                                fontStyle: 'italic',
                                color: '#4a5568',
                                display: 'block',
                                fontSize: '0.85rem'
                            }}
                        >
                            {cardData.bio}
                        </Typography>
                    </Box>
                )}

                {/* 3D Carousel Bölümü */}
                <Box 
                    sx={{ 
                        backgroundColor: 'white',
                        py: 2,
                        px: 2,
                        position: 'relative',
                        minHeight: '240px',
                        overflow: 'hidden',
                        userSelect: 'none',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        touchAction: 'pan-x'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* 3D Carousel Container */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '220px',
                            perspective: '1200px',
                            perspectiveOrigin: 'center center',
                        }}
                    >
                        {contactItems.map((item, index) => {
                            const totalItems = contactItems.length;
                            const anglePerItem = 360 / totalItems;
                            const angle = (index * anglePerItem + rotation) % 360;
                            const normalizedAngle = angle < 0 ? angle + 360 : angle;
                            
                            // Z pozisyonu hesaplama (dairesel yerleşim) - Çok yakın ikonlar
                            const radius = 85;
                            const y = Math.sin((normalizedAngle * Math.PI) / 180) * radius;
                            const z = Math.cos((normalizedAngle * Math.PI) / 180) * radius;
                            
                            // Ölçek ve opaklık hesaplama - Tümü görünür
                            const scale = 0.75 + (z / radius) * 0.25;
                            const opacity = 0.6 + (z / radius) * 0.4;
                            const zIndex = Math.round(50 + z);

                            return (
                                <Box
                                    key={index}
                                    onClick={item.action}
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        transform: `
                                            translate(-50%, calc(-50% + ${y}px))
                                            translateZ(${z}px)
                                            scale(${scale})
                                        `,
                                        transition: isDragging ? 'none' : 'all 0.3s ease',
                                        zIndex: zIndex,
                                        opacity: opacity,
                                        pointerEvents: opacity > 0.6 ? 'auto' : 'none',
                                        cursor: item.action ? 'pointer' : 'default',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: '50%',
                                            backgroundColor: item.color,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            boxShadow: `0 8px 32px ${item.color}40`,
                                            border: '3px solid white',
                                            '&:hover': item.action ? {
                                                transform: 'scale(1.1)',
                                                boxShadow: `0 12px 40px ${item.color}60`,
                                            } : {},
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {item.icon}
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                mt: 0.3,
                                                fontWeight: 700,
                                                fontSize: '0.65rem',
                                                textAlign: 'center',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Banka Hesapları */}
                {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                    <Box sx={{ backgroundColor: '#f7fafc', p: 2.5 }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: '#667eea',
                                fontWeight: 700,
                                mb: 2,
                            }}
                        >
                            <AccountBalanceIcon sx={{ mr: 1 }} /> Banka Hesapları
                        </Typography>
                        <Stack spacing={1.5}>
                            {cardData.bankAccounts.map((account, index) => {
                                const bankLogo = getBankLogo(account.bankName);
                                return (
                                    <Box 
                                        key={index}
                                        sx={{ 
                                            backgroundColor: 'white',
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            {bankLogo ? (
                                                <Box
                                                    component="img"
                                                    src={bankLogo}
                                                    alt={account.bankName}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            ) : (
                                                <AccountBalanceIcon sx={{ color: '#667eea', fontSize: '2rem' }} />
                                            )}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                                                    {account.bankName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#718096', display: 'block' }}>
                                                    {formatIban(account.iban)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#718096' }}>
                                                    {account.accountName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                )}
            </Paper>
            
            <QrModal />
            <ShareSnackbar />
        </Box>
    );
};

// Oval Carousel Tema - Sola yaslanan oval düzen
export const OvalCarouselTheme = ({ cardData }) => {
    const { handleQrClick, handleShareClick, QrModal, ShareSnackbar } = useCardActions(cardData);
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentRotation, setCurrentRotation] = useState(0);

    useEffect(() => {
        if (cardData?.id) {
            analyticsService.recordCardView(cardData.id);
        }
    }, [cardData?.id]);

    const handleLinkClick = (linkType) => {
        if (cardData?.id) {
            trackClick(cardData.id, linkType);
        }
    };

    const contactItems = [
        cardData.phone && {
            icon: <PhoneIcon sx={{ fontSize: 32 }} />,
            label: 'Telefon',
            color: '#F4C734',
            action: () => {
                handleLinkClick('phone');
                window.location.href = `tel:${cardData.phone}`;
            }
        },
        cardData.email && {
            icon: <EmailIcon sx={{ fontSize: 32 }} />,
            label: 'E-posta',
            color: '#F4C734',
            action: () => {
                handleLinkClick('email');
                window.location.href = `mailto:${cardData.email}`;
            }
        },
        cardData.website && {
            icon: <LanguageIcon sx={{ fontSize: 32 }} />,
            label: 'Web',
            color: '#000000',
            action: () => {
                handleLinkClick('website');
                window.open(cardData.website, '_blank');
            }
        },
        cardData.linkedinUrl && {
            icon: <LinkedInIcon sx={{ fontSize: 32 }} />,
            label: 'LinkedIn',
            color: '#000000',
            action: () => {
                handleLinkClick('linkedin');
                window.open(cardData.linkedinUrl, '_blank');
            }
        },
        cardData.instagramUrl && {
            icon: <InstagramIcon sx={{ fontSize: 32 }} />,
            label: 'Instagram',
            color: '#F4C734',
            action: () => {
                handleLinkClick('instagram');
                window.open(cardData.instagramUrl, '_blank');
            }
        },
        cardData.twitterUrl && {
            icon: <TwitterIcon sx={{ fontSize: 32 }} />,
            label: 'Twitter',
            color: '#000000',
            action: () => {
                handleLinkClick('twitter');
                window.open(cardData.twitterUrl, '_blank');
            }
        },
        cardData.address && {
            icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
            label: 'Konum',
            color: '#F4C734',
            action: null
        },
        {
            icon: <QrCodeIcon sx={{ fontSize: 32 }} />,
            label: 'QR Kod',
            color: '#F4C734',
            action: handleQrClick
        },
        {
            icon: <ShareIcon sx={{ fontSize: 32 }} />,
            label: 'Paylaş',
            color: '#000000',
            action: handleShareClick
        }
    ].filter(Boolean);

    const totalItems = contactItems.length;
    const radiusX = 60;
    const radiusY = 125;
    const leanOffset = -12;

    const positionedItems = totalItems
        ? contactItems.map((item, index) => {
            const anglePerItem = 360 / totalItems;
            const angle = (index * anglePerItem + rotation) % 360;
            const normalizedAngle = angle < 0 ? angle + 360 : angle;
            const radians = (normalizedAngle * Math.PI) / 180;

            const x = Math.cos(radians) * radiusX + leanOffset;
            const y = Math.sin(radians) * radiusY;
            const depthFactor = (Math.cos(radians) + 1) / 2;
            const scale = 0.65 + depthFactor * 0.3;
            const opacity = 0.35 + depthFactor * 0.6;
            const blur =
                depthFactor < 0.12 ? 'blur(1px)' :
                depthFactor < 0.25 ? 'blur(0.6px)' :
                'none';

            return {
                item,
                index,
                x,
                y,
                depthFactor,
                scale,
                opacity,
                blur
            };
        })
        : [];

    const sortedItems = positionedItems.slice().sort((a, b) => a.depthFactor - b.depthFactor);

    const handleStart = (clientY) => {
        setIsDragging(true);
        setStartY(clientY);
        setCurrentRotation(rotation);
    };

    const handleMove = (clientY) => {
        if (!isDragging) return;
        const delta = clientY - startY;
        const newRotation = currentRotation + (delta * 0.5);
        setRotation(newRotation);
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    const handleMouseDown = (e) => handleStart(e.clientY);
    const handleMouseMove = (e) => handleMove(e.clientY);
    const handleMouseUp = () => handleEnd();
    const handleTouchStart = (e) => handleStart(e.touches[0].clientY);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientY);
    const handleTouchEnd = () => handleEnd();

    return (
        <Box sx={{ maxWidth: 480, width: '100%', mt: 2, mx: 'auto' }}>
            <Paper
                elevation={6}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: '#0f172a',
                    position: 'relative'
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #1f2937 100%)',
                        pt: 3,
                        pb: 2,
                        textAlign: 'center'
                    }}
                >
                    <Avatar
                        alt={cardData.name || 'Profil'}
                        src={cardData.profileImageUrl}
                        sx={{
                            width: 90,
                            height: 90,
                            mx: 'auto',
                            mb: 1.5,
                            border: '3px solid rgba(255,255,255,0.25)',
                            boxShadow: '0 12px 30px rgba(15,23,42,0.55)'
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: 'white',
                            mb: 0.5,
                            letterSpacing: 0.4
                        }}
                    >
                        {cardData.name || 'İsim Belirtilmemiş'}
                    </Typography>
                    {cardData.title && (
                        <Chip
                            label={cardData.title}
                            size="small"
                            sx={{
                                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                fontWeight: 600,
                                mb: 0.5,
                                height: 24
                            }}
                        />
                    )}
                    {cardData.company && (
                        <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', color: 'rgba(255,255,255,0.7)' }}>
                            <BusinessIcon sx={{ fontSize: '0.95rem', mr: 0.5, verticalAlign: 'middle' }} />
                            {cardData.company}
                        </Typography>
                    )}
                </Box>

                {cardData.bio && (
                    <Box
                        sx={{
                            backgroundColor: '#111827',
                            p: 2,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: 'center',
                                fontStyle: 'italic',
                                color: 'rgba(226,232,240,0.78)',
                                letterSpacing: 0.2
                            }}
                        >
                            {cardData.bio}
                        </Typography>
                    </Box>
                )}

                <Box
                    sx={{
                        backgroundColor: '#ffffff',
                        py: 4,
                        px: { xs: 2.5, md: 4 },
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                        <Box
                            sx={{
                                position: 'relative',
                                width: { xs: 240, sm: 270 },
                                height: { xs: 280, sm: 300 },
                                transform: { xs: 'skewX(-6deg)', md: 'skewX(-8deg)' },
                                cursor: isDragging ? 'grabbing' : 'grab',
                                userSelect: 'none',
                                touchAction: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: { xs: 'auto', md: 0 }
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '78%',
                                    height: '78%',
                                    transform: { xs: 'skewX(6deg)', md: 'skewX(8deg)' }
                                }}
                            >
                                {sortedItems.map((data) => {
                                    const {
                                        item,
                                        index,
                                        x,
                                        y,
                                        depthFactor,
                                        scale,
                                        opacity,
                                        blur
                                    } = data;
                                    const offsetY = y * 0.92;
                                    const isPrimary = depthFactor > 0.8;

                                    return (
                                        <Box
                                            key={item.label ?? index}
                                            onClick={item.action}
                                            sx={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                transform: `
                                                    translate(-50%, -50%)
                                                    translate(${x}px, ${offsetY}px)
                                                    scale(${scale})
                                                `,
                                                transition: isDragging
                                                    ? 'none'
                                                    : 'transform 0.35s ease, opacity 0.35s ease, filter 0.35s ease',
                                                zIndex: Math.round(100 + depthFactor * 130),
                                                opacity,
                                                pointerEvents: depthFactor > 0.18 ? 'auto' : 'none',
                                                cursor: item.action ? 'pointer' : 'default',
                                                filter: blur
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 90,
                                                    height: 90,
                                                    borderRadius: '34px',
                                                    background: `linear-gradient(140deg, ${item.color}, ${item.color}f0)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    boxShadow: isPrimary
                                                        ? `0 26px 48px ${item.color}66`
                                                        : `0 14px 28px ${item.color}29`,
                                                    border: isPrimary
                                                        ? '3px solid rgba(255,255,255,0.85)'
                                                        : '2px solid rgba(255,255,255,0.18)',
                                                    transform: isPrimary ? 'rotate(-2deg)' : 'rotate(-4deg)',
                                                    transition: 'transform 0.35s ease, box-shadow 0.35s ease, border 0.35s ease',
                                                    '&:hover': item.action ? {
                                                        transform: 'rotate(-1deg) scale(1.05)',
                                                        boxShadow: `0 28px 52px ${item.color}70`
                                                    } : {}
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    mt: 1,
                                                    color: isPrimary ? 'rgba(26,32,44,0.9)' : 'rgba(26,32,44,0.55)',
                                                    fontWeight: isPrimary ? 700 : 500,
                                                    textAlign: 'center',
                                                    letterSpacing: 0.4
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                </Box>

                {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                    <Box sx={{ backgroundColor: '#0f172a', p: 2.5 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(226,232,240,0.85)',
                                fontWeight: 700,
                                mb: 2
                            }}
                        >
                            <AccountBalanceIcon sx={{ mr: 1 }} /> Banka Hesapları
                        </Typography>
                        <Stack spacing={1.5}>
                            {cardData.bankAccounts.map((account, index) => {
                                const bankLogo = getBankLogo(account.bankName);
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            background: 'linear-gradient(125deg, rgba(30,64,175,0.25), rgba(15,23,42,0.85))',
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid rgba(148,163,184,0.25)',
                                            boxShadow: '0 10px 25px rgba(15,23,42,0.4)'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            {bankLogo ? (
                                                <Box
                                                    component="img"
                                                    src={bankLogo}
                                                    alt={account.bankName}
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        objectFit: 'contain',
                                                        filter: 'drop-shadow(0 4px 8px rgba(15,23,42,0.4))'
                                                    }}
                                                />
                                            ) : (
                                                <AccountBalanceIcon sx={{ color: '#6366f1', fontSize: '2rem' }} />
                                            )}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                                                    {account.bankName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.7)', display: 'block' }}>
                                                    {formatIban(account.iban)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.7)' }}>
                                                    {account.accountName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                )}
                
                {/* Dökümanlar */}
                {cardData.documents && Array.isArray(cardData.documents) && cardData.documents.length > 0 && (
                    <Box sx={{ backgroundColor: '#f7fafc', p: 2.5 }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: '#667eea',
                                fontWeight: 700,
                                mb: 2,
                            }}
                        >
                            <DescriptionIcon sx={{ mr: 1 }} /> Dökümanlar
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} justifyContent="center">
                            {cardData.documents.map((document, index) => (
                                <Box 
                                    key={index}
                                    onClick={() => {
                                        if (document.url) {
                                            window.open(document.url, '_blank');
                                        }
                                    }}
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        p: 1.5,
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                        border: '2px solid #e2e8f0',
                                        cursor: 'pointer',
                                        minWidth: 120,
                                        '&:hover': {
                                            backgroundColor: '#f8fafc',
                                            borderColor: '#667eea',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <DescriptionIcon sx={{ color: '#667eea', fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#2d3748' }}>
                                        {document.name.length > 12 ? document.name.substring(0, 12) + '...' : document.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Paper>
            <QrModal />
            <ShareSnackbar />
        </Box>
    );
};

// Tema seçici fonksiyonu
// Kurumsal Dijital Tema - Resimdeki tasarıma göre
export const CorporateDigitalTheme = ({ cardData }) => {
    const { handleQrClick, handleShareClick, QrModal, ShareSnackbar, VideoModal } = useCardActions(cardData);

    // Kart görüntülenmesini kaydet
    useEffect(() => {
        if (cardData?.id) {
            analyticsService.recordCardView(cardData.id);
        }
    }, [cardData?.id]);

    // Link tıklama handler'ı
    const handleLinkClick = (linkType) => {
        console.log(`CorporateDigitalTheme - handleLinkClick çağrıldı: linkType=${linkType}, cardId=${cardData?.id}`);
        if (cardData?.id) {
            console.log(`CorporateDigitalTheme - trackClick çağrılıyor...`);
            trackClick(cardData.id, linkType);
        } else {
            console.log(`CorporateDigitalTheme - cardData.id bulunamadı:`, cardData);
        }
    };

    // Sosyal medya linklerini al
    const socialLinks = [
        { type: 'phone', icon: <PhoneIcon />, label: 'Ara', value: cardData.phone, color: '#4CAF50' },
        { type: 'whatsapp', icon: <WhatsAppIcon />, label: 'WhatsApp', value: cardData.whatsappUrl, color: '#25D366' },
        { type: 'email', icon: <EmailIcon />, label: 'E-posta', value: cardData.email, color: '#FF9800' },
        { type: 'website', icon: <LanguageIcon />, label: 'Web Sitesi', value: cardData.websiteUrl, color: '#2196F3' },
        { type: 'location', icon: <LocationOnIcon />, label: 'Konum', value: cardData.address, color: '#F44336' },
        { type: 'linkedin', icon: <LinkedInIcon />, label: 'LinkedIn', value: cardData.linkedinUrl, color: '#0077B5' },
        { type: 'instagram', icon: <InstagramIcon />, label: 'Instagram', value: cardData.instagramUrl, color: '#E4405F' },
        { type: 'twitter', icon: <TwitterIcon />, label: 'Twitter', value: cardData.twitterUrl, color: '#1DA1F2' },
        { type: 'facebook', icon: <FacebookIcon />, label: 'Facebook', value: cardData.facebookUrl, color: '#1877F2' },
        { type: 'youtube', icon: <YouTubeIcon />, label: 'YouTube', value: cardData.youtubeUrl, color: '#FF0000' },
        { type: 'telegram', icon: <TelegramIcon />, label: 'Telegram', value: cardData.telegramUrl, color: '#0088CC' }
    ].filter(link => link.value);

    // Ana ikonlar (büyük ikonlar)
    const mainIcons = socialLinks.slice(0, 5);

    return (
        <Box sx={{ 
            maxWidth: { xs: '100%', sm: 500 }, 
            width: '100%', 
            mt: 2,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            position: 'relative',
            mx: 'auto'
        }}>
            {/* Üst Kırmızı Bölüm - 2. görseldeki diyagonal kesim ve çizgili desen */}
            <Box sx={{
                background: '#DC2626',
                position: 'relative',
                minHeight: { xs: 200, sm: 220 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, sm: 3 },
                clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 8px,
                            rgba(0,0,0,0.1) 8px,
                            rgba(0,0,0,0.1) 16px
                        )
                    `,
                    opacity: 0.3
                }
            }}>
                {/* Sol Üst - İletişim Formu Balonu */}
                <Box sx={{
                    position: 'absolute',
                    top: { xs: 12, sm: 16 },
                    left: { xs: 12, sm: 16 },
                    backgroundColor: 'white',
                    borderRadius: 2,
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.8, sm: 1 },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 2
                }}>
                    <Typography variant="caption" sx={{ 
                        color: '#333',
                        fontWeight: 500,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}>
                        İletişim Formu
                    </Typography>
                </Box>

                {/* Sağ Üst - Küresel Bağlantı İkonu */}
                <Box sx={{
                    position: 'absolute',
                    top: { xs: 12, sm: 16 },
                    right: { xs: 12, sm: 16 },
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 2
                }}>
                    <BusinessIcon sx={{ 
                        color: '#DC2626',
                        fontSize: { xs: 18, sm: 20 }
                    }} />
                </Box>

                {/* Sağ Taraf - KURUMSAL TEMA Metni */}
                <Box sx={{
                    position: 'absolute',
                    right: { xs: 16, sm: 20 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    textAlign: 'right',
                    zIndex: 2
                }}>
                    <Typography variant="h4" sx={{ 
                        color: 'white', 
                        fontWeight: 700,
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        KURUMSAL TEMA
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        color: 'white', 
                        opacity: 0.9,
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        lineHeight: 1.3,
                        maxWidth: { xs: 120, sm: 150 },
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                        Firmanıza göre ikonlarınızı özelleştirebilirsiniz.
                    </Typography>
                </Box>

                {/* Profil Fotoğrafı */}
                {cardData.profileImageUrl && (
                    <Avatar
                        alt={cardData.name || 'Profil'}
                        src={cardData.profileImageUrl}
                        sx={{
                            width: { xs: 70, sm: 80 },
                            height: { xs: 70, sm: 80 },
                            border: '4px solid white',
                            mb: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    />
                )}

                {/* İsim ve Başlık */}
                <Typography variant="h5" sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    mb: 0.5,
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    fontSize: { xs: '1.3rem', sm: '1.5rem' }
                }}>
                    {cardData.name || 'İsim'}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                    color: 'white', 
                    opacity: 0.9,
                    textAlign: 'center',
                    mb: 2,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                    {cardData.title || 'Dijital Kartvizit'}
                </Typography>

                {/* Alt Kısım - Sayfalama Noktaları */}
                <Box sx={{
                    position: 'absolute',
                    bottom: { xs: 12, sm: 16 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    zIndex: 2
                }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((dot, index) => (
                        <Box
                            key={dot}
                            sx={{
                                width: { xs: 6, sm: 8 },
                                height: { xs: 6, sm: 8 },
                                borderRadius: '50%',
                                backgroundColor: index === 0 ? 'white' : 'rgba(255,255,255,0.4)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Alt Beyaz Bölüm */}
            <Box sx={{
                backgroundColor: 'white',
                p: { xs: 2, sm: 3 },
                minHeight: 300,
                position: 'relative'
            }}>
                {/* Ana İkonlar - Görseldeki yan yana düzen (kaymalı değil) */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: { xs: 0.8, sm: 1 },
                    mb: 3,
                    px: { xs: 1, sm: 0 },
                    flexWrap: 'wrap'
                }}>
                    {mainIcons.map((link) => (
                        <Box
                            key={link.type}
                            onClick={() => handleLinkClick(link.type)}
                            sx={{
                                width: { xs: 50, sm: 60 },
                                height: { xs: 50, sm: 60 },
                                borderRadius: { xs: 1.5, sm: 2 },
                                backgroundColor: link.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                                },
                                '& svg': {
                                    color: 'white',
                                    fontSize: { xs: 20, sm: 24 }
                                }
                            }}
                        >
                            {link.icon}
                        </Box>
                    ))}
                </Box>

                {/* Rehbere Ekle Metni */}
                <Typography variant="body2" sx={{ 
                    textAlign: 'center', 
                    color: '#333',
                    mb: 2,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                    Rehbere Ekle
                </Typography>

                {/* Görseldeki büyük ikonlar - Fan-out efekti ile geçiş */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 3,
                    px: { xs: 1, sm: 0 },
                    position: 'relative',
                    height: { xs: 80, sm: 90 }
                }}>
                    {[
                        { icon: <PhoneIcon />, color: '#4CAF50', label: 'Ara' },
                        { icon: <BusinessIcon />, color: '#2196F3', label: 'Kişi' },
                        { icon: <QrCodeIcon />, color: '#FF9800', label: 'QR' },
                        { icon: <QrCodeIcon />, color: '#F44336', label: 'QR' },
                        { icon: <FacebookIcon />, color: '#1DA1F2', label: 'Facebook' }
                    ].map((item, index) => {
                        // Ortadaki ikon (index 2) en önde, diğerleri geriye doğru kayıyor
                        const centerIndex = 2;
                        const distanceFromCenter = Math.abs(index - centerIndex);
                        const isCenter = index === centerIndex;
                        
                        return (
                            <Box
                                key={index}
                                sx={{
                                    width: { xs: 50, sm: 60 },
                                    height: { xs: 50, sm: 60 },
                                    borderRadius: { xs: 1.5, sm: 2 },
                                    backgroundColor: item.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    position: 'absolute',
                                    // Fan-out efekti: ortadaki en önde, diğerleri geriye doğru
                                    left: '50%',
                                    transform: `translateX(-50%) translateX(${(index - centerIndex) * 35}px) scale(${1 - distanceFromCenter * 0.1})`,
                                    zIndex: isCenter ? 10 : (10 - distanceFromCenter),
                                    '&:hover': {
                                        transform: `translateX(-50%) translateX(${(index - centerIndex) * 35}px) scale(${1.1 - distanceFromCenter * 0.1})`,
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                                        zIndex: 15
                                    },
                                    '& svg': {
                                        color: 'white',
                                        fontSize: { xs: 20, sm: 24 }
                                    }
                                }}
                            >
                                {item.icon}
                            </Box>
                        );
                    })}
                </Box>

                {/* Banka Bilgileri Butonu */}
                {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<AccountBalanceIcon />}
                            onClick={() => handleLinkClick('bank')}
                            sx={{
                                borderRadius: 2,
                                borderColor: '#ddd',
                                color: '#666',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                '&:hover': {
                                    borderColor: '#E53E3E',
                                    color: '#E53E3E',
                                    backgroundColor: 'rgba(229, 62, 62, 0.04)'
                                }
                            }}
                        >
                            Banka Bilgileri
                        </Button>
                    </Box>
                )}

                {/* Alt İkonlar Grid - Görseldeki 3x2 grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: { xs: 0.8, sm: 1 },
                    mt: 2
                }}>
                    {[
                        { icon: <StorefrontIcon />, label: 'Ürünler', color: '#FF5722' },
                        { icon: <PhoneIcon />, label: 'Özellikler', color: '#2196F3' },
                        { icon: <BusinessIcon />, label: 'Referanslarımız', color: '#4CAF50' },
                        { icon: <CameraAltIcon />, label: 'Temalar', color: '#9C27B0' },
                        { icon: <StoreIcon />, label: 'Bayilik', color: '#FF9800' },
                        { icon: <DescriptionIcon />, label: 'Kurumsal Takip', color: '#607D8B' }
                    ].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: { xs: 0.8, sm: 1 },
                                borderRadius: 1,
                                border: '2px solid #e0e0e0',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minHeight: { xs: 70, sm: 80 },
                                '&:hover': {
                                    borderColor: item.color,
                                    backgroundColor: `${item.color}08`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            <Box sx={{
                                width: { xs: 28, sm: 32 },
                                height: { xs: 28, sm: 32 },
                                borderRadius: 0.8,
                                backgroundColor: item.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 0.5,
                                '& svg': {
                                    color: 'white',
                                    fontSize: { xs: 14, sm: 16 }
                                }
                            }}>
                                {item.icon}
                            </Box>
                            <Typography variant="caption" sx={{ 
                                textAlign: 'center',
                                color: '#666',
                                fontWeight: 500,
                                fontSize: { xs: '0.6rem', sm: '0.65rem' },
                                lineHeight: 1.1
                            }}>
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* QR Kod ve Paylaşım - Görseldeki alt bar */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid #e0e0e0'
                }}>
                    <IconButton
                        onClick={handleQrClick}
                        sx={{
                            backgroundColor: '#f8f8f8',
                            width: { xs: 40, sm: 44 },
                            height: { xs: 40, sm: 44 },
                            '&:hover': {
                                backgroundColor: '#DC2626',
                                color: 'white',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <QrCodeIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                    </IconButton>
                    <IconButton
                        onClick={handleShareClick}
                        sx={{
                            backgroundColor: '#f8f8f8',
                            width: { xs: 40, sm: 44 },
                            height: { xs: 40, sm: 44 },
                            '&:hover': {
                                backgroundColor: '#DC2626',
                                color: 'white',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <ShareIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Modals */}
            <QrModal />
            <ShareSnackbar />
            <VideoModal />
        </Box>
    );
};

// Kurumsal Videolu Tema - Resimdeki tasarıma göre
export const CorporateVideoTheme = ({ cardData }) => {
    const { handleQrClick, handleShareClick, handleVideoClick, QrModal, ShareSnackbar, VideoModal } = useCardActions(cardData);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const displayName = (cardData?.name || cardData?.company || cardData?.cardName || 'Dijital Kart').trim();
    const displayTitle = cardData?.title ? cardData.title.trim() : '';
    const displayCompany = cardData?.company ? cardData.company.trim() : '';
    const displayBio = cardData?.bio ? cardData.bio.trim() : '';
    const displayInitial = displayName.charAt(0).toUpperCase();
    const videoUrl = cardData?.videoUrl ? cardData.videoUrl.trim() : '';
    const hasVideo = Boolean(videoUrl);
    const embedUrl = hasVideo ? getVideoEmbedUrl(videoUrl) : '';
    const inlineVideoSrc = embedUrl;

    // Kart görüntülenmesini kaydet
    useEffect(() => {
        if (cardData?.id) {
            analyticsService.recordCardView(cardData.id);
        }
    }, [cardData?.id]);

    // Kullanıcının kendi sosyal medya ikonları
    const contactIcons = [
        { icon: <PhoneIcon />, color: '#4CAF50', label: 'Telefon', type: 'phone', value: cardData.phone },
        { icon: <EmailIcon />, color: '#FF5722', label: 'E-posta', type: 'email', value: cardData.email },
        { icon: <WhatsAppIcon />, color: '#25D366', label: 'WhatsApp', type: 'whatsapp', value: cardData.whatsappUrl },
        { icon: <WhatsAppIcon />, color: '#128C7E', label: 'WhatsApp Business', type: 'whatsappBusiness', value: cardData.whatsappBusinessUrl },
        { icon: <LanguageIcon />, color: '#607D8B', label: 'Website', type: 'website', value: cardData.websiteUrl || cardData.website },
        { icon: <LocationOnIcon />, color: '#9C27B0', label: 'Konum', type: 'location', value: cardData.address },
        { icon: <VideoCallIcon />, color: '#FF7043', label: 'Video', type: 'video', value: hasVideo ? videoUrl : null }
    ];

    const socialIcons = [
        { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram', type: 'instagram', value: cardData.instagramUrl },
        { icon: <TwitterIcon />, color: '#1DA1F2', label: 'Twitter', type: 'twitter', value: cardData.twitterUrl },
        { icon: <LinkedInIcon />, color: '#0077B5', label: 'LinkedIn', type: 'linkedin', value: cardData.linkedinUrl },
        { icon: <FacebookIcon />, color: '#1877F2', label: 'Facebook', type: 'facebook', value: cardData.facebookUrl },
        { icon: <YouTubeIcon />, color: '#FF0000', label: 'YouTube', type: 'youtube', value: cardData.youtubeUrl },
        { icon: <TelegramIcon />, color: '#0088CC', label: 'Telegram', type: 'telegram', value: cardData.telegramUrl },
        { icon: <MusicNoteIcon />, color: '#000000', label: 'TikTok', type: 'tiktok', value: cardData.tiktokUrl },
        { icon: <CameraAltIcon />, color: '#FFFC00', label: 'Snapchat', type: 'snapchat', value: cardData.snapchatUrl },
        { icon: <LocalFloristIcon />, color: '#BD081C', label: 'Pinterest', type: 'pinterest', value: cardData.pinterestUrl },
        { icon: <ChatIcon />, color: '#00AFF0', label: 'Skype', type: 'skype', value: cardData.skypeUrl },
        { icon: <ChatIcon />, color: '#07C160', label: 'WeChat', type: 'wechat', value: cardData.wechatUrl }
    ];

    const marketplaceIcons = [
        { icon: <StorefrontIcon />, color: '#F27A1A', label: 'Trendyol', type: 'trendyol', value: cardData.trendyolUrl },
        { icon: <ShoppingCartIcon />, color: '#FF6F00', label: 'Hepsiburada', type: 'hepsiburada', value: cardData.hepsiburadaUrl },
        { icon: <LocalFloristIcon />, color: '#00B0FF', label: 'Çiçeksepeti', type: 'ciceksepeti', value: cardData.ciceksepetiUrl || cardData.ciceksepeti },
        { icon: <HomeIcon />, color: '#FFCD05', label: 'Sahibinden', type: 'sahibinden', value: cardData.sahibindenUrl },
        { icon: <HomeIcon />, color: '#00A699', label: 'Hepsiemlak', type: 'hepsiemlak', value: cardData.hepsiemlakUrl },
        { icon: <StoreIcon />, color: '#0056A6', label: 'GittiGidiyor', type: 'gittigidiyor', value: cardData.gittigidiyorUrl },
        { icon: <StoreIcon />, color: '#E10019', label: 'N11', type: 'n11', value: cardData.n11Url },
        { icon: <ShoppingCartIcon />, color: '#FF9900', label: 'Amazon', type: 'amazonTr', value: cardData.amazonTrUrl },
        { icon: <DeliveryDiningIcon />, color: '#5F3DC4', label: 'Getir', type: 'getir', value: cardData.getirUrl },
        { icon: <RestaurantIcon />, color: '#FF1744', label: 'Yemeksepeti', type: 'yemeksepeti', value: cardData.yemeksepetiUrl },
        { icon: <HomeIcon />, color: '#D32F2F', label: 'Arabam', type: 'arabam', value: cardData.arabamUrl },
        { icon: <StorefrontIcon />, color: '#FF3B30', label: 'Letgo', type: 'letgo', value: cardData.letgoUrl },
        { icon: <StoreIcon />, color: '#1E88E5', label: 'PTT AVM', type: 'pttAvm', value: cardData.pttAvmUrl }
    ];

    const userIcons = [
        ...contactIcons,
        ...socialIcons,
        ...marketplaceIcons,
        { icon: <QrCodeIcon />, color: '#795548', label: 'QR Kod', type: 'qr', value: 'qr' },
        { icon: <ShareIcon />, color: '#FF9800', label: 'Paylaş', type: 'share', value: 'share' }
    ].filter(item => item.value); // Sadece değeri olan ikonları göster

    // Eğer hiç ikon yoksa, varsayılan ikonları göster
    const finalUserIcons = userIcons.length > 0 ? userIcons : [
        { icon: <PhoneIcon />, color: '#4CAF50', label: 'Telefon', type: 'phone', value: 'phone' },
        { icon: <EmailIcon />, color: '#FF5722', label: 'E-posta', type: 'email', value: 'email' },
        { icon: <WhatsAppIcon />, color: '#25D366', label: 'WhatsApp', type: 'whatsapp', value: 'whatsapp' },
        { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram', type: 'instagram', value: 'instagram' },
        { icon: <TwitterIcon />, color: '#1DA1F2', label: 'Twitter', type: 'twitter', value: 'twitter' },
        { icon: <QrCodeIcon />, color: '#795548', label: 'QR Kod', type: 'qr', value: 'qr' },
        { icon: <ShareIcon />, color: '#FF9800', label: 'Paylaş', type: 'share', value: 'share' }
    ];

    const iconCount = finalUserIcons.length;
    const allIcons = finalUserIcons;
    const ICON_SPACING = 70;
    const MAX_DRAG_DISTANCE = ICON_SPACING * 2;

    // Sürükleme fonksiyonları
    const handleMouseDown = useCallback((e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    }, []);

    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        const clampedOffset = Math.max(Math.min(delta, MAX_DRAG_DISTANCE), -MAX_DRAG_DISTANCE);
        setDragOffset(clampedOffset);
    }, [isDragging, startX, MAX_DRAG_DISTANCE]);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;
        const delta = e.touches[0].clientX - startX;
        const clampedOffset = Math.max(Math.min(delta, MAX_DRAG_DISTANCE), -MAX_DRAG_DISTANCE);
        setDragOffset(clampedOffset);
    }, [isDragging, startX, MAX_DRAG_DISTANCE]);

    const completeDrag = useCallback(() => {
        if (!iconCount) {
            setDragOffset(0);
            return;
        }

        const step = Math.round(dragOffset / ICON_SPACING);
        if (step !== 0) {
            setActiveIndex((prev) => {
                const next = (prev - step) % iconCount;
                return next < 0 ? next + iconCount : next;
            });
        }
        setDragOffset(0);
    }, [dragOffset, iconCount, ICON_SPACING]);

    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        completeDrag();
    }, [isDragging, completeDrag]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        completeDrag();
    }, [isDragging, completeDrag]);

    const visibleOffsets = iconCount ? [-2, -1, 0, 1, 2] : [];
    const dragProgress = ICON_SPACING ? dragOffset / ICON_SPACING : 0;

    // Global event listener'ları ekle/kaldır
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);

    // Link tıklama fonksiyonu
    const trackClick = (cardId, linkType) => {
        if (cardId) {
            analyticsService.recordLinkClick(cardId, linkType);
        }
    };

    return (
        <Box sx={{ 
            maxWidth: { xs: '100%', sm: 500 }, 
            width: '100%', 
            mt: 2,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            position: 'relative',
            mx: 'auto',
            backgroundColor: 'white'
        }}>
            {/* Sarı Banner Bölümü */}
            <Box sx={{
                backgroundColor: hasVideo ? '#000' : '#FFD700',
                position: 'relative',
                minHeight: hasVideo ? 'auto' : { xs: 160, sm: 180 },
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                px: hasVideo ? 0 : { xs: 2, sm: 3 },
                py: hasVideo ? 0 : { xs: 2, sm: 3 }
            }}>
                {hasVideo ? (
                    <Box sx={{
                        position: 'relative',
                        width: '100%',
                        backgroundColor: '#000',
                        overflow: 'hidden',
                        borderRadius: 0,
                        aspectRatio: {
                            xs: '3 / 4'
                        },
                        '@supports not (aspect-ratio: 1)': {
                            '&::before': {
                                content: '""',
                                display: 'block',
                                paddingTop: '133.33%'
                            }
                        },
                        maxHeight: { xs: 320, sm: 380 }
                    }}>
                        <Box
                            component="iframe"
                            src={inlineVideoSrc}
                            title="card-inline-video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 0,
                                display: 'block'
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={handleVideoClick}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                backgroundColor: 'rgba(0,0,0,0.45)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' }
                            }}
                        >
                            <OpenInNewIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                            Video henüz eklenmedi
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555' }}>
                            Yönetim panelinden video bağlantısı ekleyin.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Logo ve Başlık Bölümü */}
            <Box sx={{
                backgroundColor: 'white',
                p: { xs: 2, sm: 3 },
                textAlign: 'center'
            }}>
                {cardData?.profileImageUrl ? (
                    <Avatar
                        alt={displayName}
                        src={cardData.profileImageUrl}
                        sx={{
                            width: { xs: 80, sm: 96 },
                            height: { xs: 80, sm: 96 },
                            mb: 2,
                            mx: 'auto',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                        }}
                    />
                ) : (
                    <Box sx={{
                        width: { xs: 72, sm: 80 },
                        height: { xs: 72, sm: 80 },
                        borderRadius: '50%',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: '#333',
                        fontWeight: 700,
                        fontSize: { xs: '1.6rem', sm: '1.8rem' }
                    }}>
                        {displayInitial}
                    </Box>
                )}
                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.6rem', sm: '2rem' },
                    color: '#333',
                    mb: displayTitle ? 0.5 : 2
                }}>
                    {displayName}
                </Typography>
                {displayTitle && (
                    <Typography variant="body1" sx={{
                        color: '#666',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        mb: displayCompany ? 0.5 : (displayBio ? 2 : 3)
                    }}>
                        {displayTitle}
                    </Typography>
                )}
                {displayCompany && displayCompany !== displayName && (
                    <Typography variant="body1" sx={{
                        color: '#999',
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        mb: displayBio ? 2 : 3
                    }}>
                        {displayCompany}
                    </Typography>
                )}
                {displayBio && (
                    <Typography variant="body2" sx={{
                        color: '#666',
                        mb: hasVideo ? 3 : 0,
                        maxWidth: 320,
                        mx: 'auto'
                    }}>
                        {displayBio}
                    </Typography>
                )}
                {hasVideo && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleVideoClick}
                        startIcon={<PlayArrowIcon />}
                        sx={{
                            borderRadius: 999,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 10px 20px rgba(255,0,0,0.25)'
                        }}
                    >
                        Tanıtım Videosu
                    </Button>
                )}
            </Box>

            {/* İkonlar Bölümü */}
            <Box sx={{
                backgroundColor: 'white',
                p: { xs: 2, sm: 3 },
                pb: { xs: 3, sm: 4 }
            }}>
                {/* Basit sürüklenebilir ikonlar */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 3,
                    position: 'relative',
                    height: { xs: 100, sm: 120 },
                    overflow: 'hidden',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 0.6, sm: 0.8 },
                            transform: 'translateX(0px)',
                            transition: isDragging ? 'none' : 'transform 0.3s ease',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                        {visibleOffsets.map((offset) => {
                            if (!iconCount) return null;

                            const normalizedIndex = ((activeIndex + offset) % iconCount + iconCount) % iconCount;
                            const item = allIcons[normalizedIndex];
                            const relativeOffset = offset + dragProgress;
                            const distanceFromCenter = Math.abs(relativeOffset);

                            let fontSize, zIndex, scale;
                            if (distanceFromCenter < 0.4) {
                                fontSize = { xs: 34, sm: 40 };
                                zIndex = 5;
                                scale = 1.35;
                            } else if (distanceFromCenter < 1.2) {
                                fontSize = { xs: 22, sm: 26 };
                                zIndex = 3;
                                scale = 0.9;
                            } else if (distanceFromCenter < 2.0) {
                                fontSize = { xs: 16, sm: 20 };
                                zIndex = 1;
                                scale = 0.75;
                            } else {
                                fontSize = { xs: 16, sm: 20 };
                                zIndex = 1;
                                scale = 0.85;
                            }

                            return (
                                <Box
                                    key={`${item.type || item.label || 'icon'}-${normalizedIndex}-${offset}`}
                                    sx={{
                                        width: { xs: 58, sm: 68 },
                                        height: { xs: 58, sm: 68 },
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        backgroundColor: item.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: isDragging ? 'none' : 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        flexShrink: 0,
                                        zIndex: zIndex,
                                        transform: `scale(${scale})`,
                                        transformOrigin: 'center',
                                        pointerEvents: 'auto',
                                        '&:hover': {
                                            transform: `scale(${scale * 1.05})`,
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                                            zIndex: 10
                                        },
                                        '& svg': {
                                            color: 'white',
                                            fontSize: fontSize
                                        }
                                    }}
                                    onClick={() => {
                                        if (item.type && cardData?.id) {
                                            trackClick(cardData.id, item.type);
                                        }
                                        // İkon tıklama işlemleri
                                        if (item.type === 'phone' && item.value) {
                                            window.open(`tel:${item.value}`);
                                        } else if (item.type === 'email' && item.value) {
                                            window.open(`mailto:${item.value}`);
                                        } else if (item.type === 'whatsapp' && item.value) {
                                            window.open(`https://wa.me/${item.value.replace(/[^0-9]/g, '')}`);
                                        } else if (item.type === 'whatsappBusiness' && item.value) {
                                            const sanitized = item.value.startsWith('http')
                                                ? item.value
                                                : `https://wa.me/${item.value.replace(/[^0-9]/g, '')}`;
                                            window.open(sanitized, '_blank');
                                        } else if (item.type === 'website' && item.value) {
                                            window.open(item.value, '_blank');
                                        } else if (item.type === 'location' && item.value) {
                                            window.open(`https://maps.google.com/?q=${encodeURIComponent(item.value)}`);
                                        } else if (item.type === 'video' && hasVideo) {
                                            handleVideoClick();
                                        } else if (item.type === 'qr') {
                                            handleQrClick();
                                        } else if (item.type === 'share') {
                                            handleShareClick();
                                        } else if (item.value) {
                                            if (typeof item.value === 'string' && item.value.startsWith('http')) {
                                                window.open(item.value, '_blank');
                                            } else if (typeof item.value === 'string') {
                                                window.location.href = item.value;
                                            }
                                        }
                                    }}
                                >
                                    {item.icon}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Alt butonlar */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 2
                }}>
                    <Box sx={{
                        flex: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        p: 1.5,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#e0e0e0'
                        }
                    }}>
                        <Typography variant="body2" sx={{ 
                            color: '#333',
                            fontWeight: 500,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                        }}>
                            Banka Bilgileri
                        </Typography>
                    </Box>
                    
                    <Box sx={{
                        flex: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        p: 1.5,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#e0e0e0'
                        }
                    }}>
                        <Typography variant="body2" sx={{ 
                            color: '#333',
                            fontWeight: 500,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                        }}>
                            Fatura Bilgileri
                        </Typography>
                    </Box>
                </Box>

                {/* Rehbere Ekle */}
                <Box sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                    p: 1.5,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: '#e0e0e0'
                    }
                }}>
                    <Typography variant="body2" sx={{ 
                        color: '#333',
                        fontWeight: 500,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' }
                    }}>
                        Rehbere Ekle
                    </Typography>
                </Box>
            </Box>

            {/* QR ve Paylaşım Butonları */}
            <Box sx={{
                position: 'absolute',
                top: 24,
                left: 24,
                display: 'flex',
                gap: 1,
                zIndex: 10
            }}>
                <IconButton
                    onClick={handleQrClick}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': { backgroundColor: 'white' }
                    }}
                >
                    <QrCodeIcon />
                </IconButton>
                <IconButton
                    onClick={handleShareClick}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': { backgroundColor: 'white' }
                    }}
                >
                    <ShareIcon />
                </IconButton>
            </Box>

            <QrModal />
            <ShareSnackbar />
            <VideoModal />
        </Box>
    );
};

export const getThemeComponent = (theme) => {
    switch (theme) {
        case 'modern':
            return ModernTheme;
        case 'icongrid':
            return IconGridTheme;
        case 'business':
            return BusinessTheme;
        case 'creative':
            return CreativeTheme;
        case 'dark':
            return DarkTheme;
        case 'carousel':
            return CarouselTheme;
        case 'ovalcarousel':
            return OvalCarouselTheme;
        case 'corporatedigital':
            return CorporateDigitalTheme;
        case 'corporatevideo':
            return CorporateVideoTheme;
        case 'light':
        default:
            return DefaultTheme;
    }
}; 
