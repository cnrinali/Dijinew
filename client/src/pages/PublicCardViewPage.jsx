import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import cardService from '../services/cardService';

// MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link'; // MUI Link for external links
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// Icon Imports
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business'; // Company için
import InfoIcon from '@mui/icons-material/Info'; // Bio için
// Yeni sosyal medya ikonları
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import IconButton from '@mui/material/IconButton'; // IconButton eklendi
import Stack from '@mui/material/Stack'; // Stack eklendi

function PublicCardViewPage() {
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { slug } = useParams();
    console.log('Slug or ID:', slug);

    useEffect(() => {
        const fetchPublicCard = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await cardService.getPublicCard(slug);
                console.log('[PublicCardViewPage] Gelen Kart Verisi:', data);
                setCardData(data);
            } catch (err) {
                console.error("Herkese açık kartvizit getirilirken hata:", err);
                const errorMsg = err.response?.data?.message || 'Kartvizit yüklenemedi.';
                setError(errorMsg); // Hata mesajını API'den veya varsayılan olarak ayarla
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPublicCard();
        } else {
            setError('Kartvizit kimliği veya özel URL belirtilmemiş.');
            setLoading(false);
        }
    }, [slug]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        // 404 durumunda daha kullanıcı dostu bir mesaj gösterilebilir
        const message = error.toLowerCase().includes('bulunamadı') || error.toLowerCase().includes('not found')
            ? 'Aradığınız kartvizit bulunamadı veya aktif değil.'
            : `Hata: ${error}`;
        return <Alert severity="error" sx={{ m: 2 }}>{message}</Alert>;
    }

    if (!cardData) {
        // Genellikle error state'i bu durumu yakalar ama ek kontrol
        return <Alert severity="warning" sx={{ m: 2 }}>Kartvizit bilgileri alınamadı.</Alert>;
    }

    // Kart Görünümü
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 1, sm: 2, md: 3 } }}>
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
                                top: -50, // Avatarı yukarı taşı
                                left: '50%',
                                transform: 'translateX(-50%)',
                                border: '3px solid white',
                                bgcolor: 'grey.300' // Resim yoksa veya yüklenmezse
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
                            <Typography variant="subtitle2" gutterBottom sx={{ display:'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ mr: 1 }} /> Hakkında
                            </Typography>
                             <Typography variant="body2" color="text.secondary">
                                 {cardData.bio}
                             </Typography>
                         </CardContent>
                     </>
                 )}

                 <Divider />

                 <CardContent sx={{ pt: 1, pb: 1 }}> {/* Alt padding'i biraz azalttık */} 
                     <List dense> 
                         {cardData.phone && (
                             <ListItem>
                                 <ListItemIcon><PhoneIcon /></ListItemIcon>
                                 <ListItemText primary={cardData.phone} />
                             </ListItem>
                         )}
                         {cardData.email && (
                             <ListItem
                                 component={Link} // MUI Link kullan
                                 href={`mailto:${cardData.email}`}
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

                {/* Sosyal Medya Linkleri */} 
                {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
                    <>
                        <Divider variant="middle" /> {/* İkonlar öncesi ayırıcı */} 
                         <CardContent sx={{ py: 1, textAlign: 'center' }}> {/* Padding ayarı */} 
                             <Stack direction="row" spacing={1} justifyContent="center">
                                 {cardData.linkedinUrl && (
                                     <IconButton 
                                        component="a" 
                                        href={cardData.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                        color="primary" // Renk belirle
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
                                        color="info" // Farklı renk
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
                                        sx={{ color: '#E1306C' }} // Özel Instagram rengi
                                    >
                                         <InstagramIcon />
                                     </IconButton>
                                 )}
                             </Stack>
                         </CardContent>
                    </>
                )}

                {/* Kart Adı (Alt Bilgi Olarak) */}
                <Divider />
                <CardContent sx={{ py: '8px !important', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                       {cardData.cardName}
                    </Typography>
                </CardContent>

            </Card>
        </Box>
    );
}

// Eski stil objesi kaldırıldı
// const styles = { ... };

export default PublicCardViewPage; 