import React, { useEffect } from 'react';
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
    Divider,
    Link,
    IconButton,
    Stack,
    Paper,
    Chip
} from '@mui/material';
import analyticsService, { trackClick } from '../services/analyticsService';

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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import HomeIcon from '@mui/icons-material/Home';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
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

// Default tema (şu anki)
export const DefaultTheme = ({ cardData }) => {
    // Kart görüntülenmesini kaydet
    useEffect(() => {
        if (cardData?.id) {
            analyticsService.recordCardView(cardData.id);
        }
    }, [cardData?.id]);

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
              cardData.getirUrl || cardData.yemeksepetiUrl) && (
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
                        </List>
                    </CardContent>
                </>
            )}

            {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
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
                                    sx={{ color: '#E1306C' }}
                                    onClick={() => handleLinkClick('instagram')}
                                >
                                    <InstagramIcon />
                                </IconButton>
                            )}
                        </Stack>
                    </CardContent>
                </>
            )}

            <Divider />
            <CardContent sx={{ py: '8px !important', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    {cardData.cardName}
                </Typography>
            </CardContent>
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

                    {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
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

// Minimalist Tema
export const MinimalistTheme = ({ cardData }) => {
    return (
        <Box sx={{ maxWidth: 400, width: '100%', mt: 2, p: 4, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                {cardData.profileImageUrl && (
                    <Avatar
                        alt={cardData.name || 'Profil'}
                        src={cardData.profileImageUrl}
                        sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2
                        }}
                    />
                )}
                <Typography variant="h6" component="div" sx={{ fontWeight: 400, mb: 0.5 }}>
                    {cardData.name || 'İsim Belirtilmemiş'}
                </Typography>
                {cardData.title && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {cardData.title}
                    </Typography>
                )}
                {cardData.company && (
                    <Typography variant="body2" color="text.secondary">
                        {cardData.company}
                    </Typography>
                )}
            </Box>

            {cardData.bio && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {cardData.bio}
                    </Typography>
                </Box>
            )}

            <Stack spacing={1.5}>
                {cardData.phone && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                        {cardData.phone}
                    </Typography>
                )}
                {cardData.email && (
                    <Link href={`mailto:${cardData.email}`} sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2">{cardData.email}</Typography>
                    </Link>
                )}
                {cardData.website && (
                    <Link href={cardData.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <LanguageIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2">{cardData.website}</Typography>
                    </Link>
                )}
                {cardData.address && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                        {cardData.address}
                    </Typography>
                )}
            </Stack>

            {/* Banka Hesapları */}
            {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccountBalanceIcon sx={{ mr: 1, fontSize: '1rem' }} /> Banka Hesapları
                    </Typography>
                    <Stack spacing={1.5}>
                        {cardData.bankAccounts.map((account, index) => {
                            const bankLogo = getBankLogo(account.bankName);
                            return (
                                <Box key={index}>
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'medium', mb: 0.5 }}>
                                        {bankLogo ? (
                                            <Box
                                                component="img"
                                                src={bankLogo}
                                                alt={account.bankName}
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    objectFit: 'contain',
                                                    mr: 1
                                                }}
                                            />
                                        ) : (
                                            <AccountBalanceIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                                        )}
                                        {account.bankName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3, fontSize: '0.875rem' }}>
                                        {formatIban(account.iban)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3, fontSize: '0.875rem' }}>
                                        {account.accountName}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            )}

            {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        {cardData.linkedinUrl && (
                            <IconButton component="a" href={cardData.linkedinUrl} target="_blank" rel="noopener noreferrer" size="small">
                                <LinkedInIcon />
                            </IconButton>
                        )}
                        {cardData.twitterUrl && (
                            <IconButton component="a" href={cardData.twitterUrl} target="_blank" rel="noopener noreferrer" size="small">
                                <TwitterIcon />
                            </IconButton>
                        )}
                        {cardData.instagramUrl && (
                            <IconButton component="a" href={cardData.instagramUrl} target="_blank" rel="noopener noreferrer" size="small">
                                <InstagramIcon />
                            </IconButton>
                        )}
                    </Stack>
                </Box>
            )}

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.200', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    {cardData.cardName}
                </Typography>
            </Box>
        </Box>
    );
};

// İkon Grid Tema (ekran görüntüsündeki gibi)
export const IconGridTheme = ({ cardData }) => {
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
                        <Box sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: 2, backgroundColor: 'grey.100', minWidth: 80 }}>
                            <BusinessIcon sx={{ fontSize: 28, color: 'grey.600', mb: 0.5 }} />
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
                    {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
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

                {/* Alt Bilgi */}
                <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="caption" color="text.secondary">
                        {cardData.cardName}
                    </Typography>
                </Box>
            </Paper>
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

                    {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
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

                        {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
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
                            <ListItemIcon><EmailIcon sx={{ color: '#2196F3' }} /></ListItemIcon>
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

            {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
                <>
                    <Divider variant="middle" sx={{ backgroundColor: '#333' }} />
                    <CardContent sx={{ py: 1, textAlign: 'center', backgroundColor: '#1a1a1a' }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                            {cardData.linkedinUrl && (
                                <IconButton component="a" href={cardData.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" sx={{ color: '#0077B5' }}>
                                    <LinkedInIcon />
                                </IconButton>
                            )}
                            {cardData.twitterUrl && (
                                <IconButton component="a" href={cardData.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" sx={{ color: '#1DA1F2' }}>
                                    <TwitterIcon />
                                </IconButton>
                            )}
                            {cardData.instagramUrl && (
                                <IconButton component="a" href={cardData.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" sx={{ color: '#E1306C' }}>
                                    <InstagramIcon />
                                </IconButton>
                            )}
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

// Mavi Tema
export const BlueTheme = ({ cardData }) => {
    return (
        <Card sx={{ maxWidth: 500, width: '100%', mt: 2, backgroundColor: '#f0f8ff', border: '2px solid #2196F3' }}>
            {cardData.coverImageUrl && (
                <CardMedia
                    component="img"
                    height="160"
                    image={cardData.coverImageUrl}
                    alt="Kapak Fotoğrafı"
                    sx={{ objectFit: 'cover', filter: 'hue-rotate(220deg) saturate(1.2)' }}
                />
            )}
            <CardContent sx={{ textAlign: 'center', position: 'relative', pt: cardData.profileImageUrl ? 6 : 2, backgroundColor: '#f0f8ff' }}>
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
                            border: '3px solid #2196F3',
                            bgcolor: 'blue.100'
                        }}
                    />
                )}
                <Typography gutterBottom variant="h5" component="div" sx={{ mt: cardData.profileImageUrl ? 2 : 0, color: '#1976D2' }}>
                    {cardData.name || 'İsim Belirtilmemiş'}
                </Typography>
                {cardData.title && (
                    <Typography variant="body1" sx={{ color: '#1565C0' }}>
                        {cardData.title}
                    </Typography>
                )}
                {cardData.company && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5, color: '#1976D2' }}>
                        <BusinessIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        {cardData.company}
                    </Typography>
                )}
            </CardContent>

            {cardData.bio && (
                <>
                    <Divider sx={{ backgroundColor: '#2196F3' }} />
                    <CardContent sx={{ textAlign: 'left', backgroundColor: '#f0f8ff' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#1976D2' }}>
                            <InfoIcon sx={{ mr: 1 }} /> Hakkında
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1565C0' }}>
                            {cardData.bio}
                        </Typography>
                    </CardContent>
                </>
            )}

            <Divider sx={{ backgroundColor: '#2196F3' }} />

            <CardContent sx={{ pt: 1, pb: 1, backgroundColor: '#f0f8ff' }}>
                <List dense>
                    {cardData.phone && (
                        <ListItem>
                            <ListItemIcon><PhoneIcon sx={{ color: '#2196F3' }} /></ListItemIcon>
                            <ListItemText primary={cardData.phone} sx={{ color: '#1976D2' }} />
                        </ListItem>
                    )}
                    {cardData.email && (
                        <ListItem component={Link} href={`mailto:${cardData.email}`} sx={{ textDecoration: 'none' }}>
                            <ListItemIcon><EmailIcon sx={{ color: '#2196F3' }} /></ListItemIcon>
                            <ListItemText primary={cardData.email} sx={{ color: '#1976D2' }} />
                        </ListItem>
                    )}
                    {cardData.website && (
                        <ListItem component={Link} href={cardData.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none' }}>
                            <ListItemIcon><LanguageIcon sx={{ color: '#2196F3' }} /></ListItemIcon>
                            <ListItemText primary={cardData.website} sx={{ color: '#1976D2' }} />
                        </ListItem>
                    )}
                    {cardData.address && (
                        <ListItem>
                            <ListItemIcon><LocationOnIcon sx={{ color: '#2196F3' }} /></ListItemIcon>
                            <ListItemText primary={cardData.address} sx={{ color: '#1976D2' }} />
                        </ListItem>
                    )}
                </List>
            </CardContent>

            {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                <>
                    <Divider sx={{ backgroundColor: '#2196F3' }} />
                    <CardContent sx={{ pt: 1, pb: 1, backgroundColor: '#f0f8ff' }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#1976D2', mb: 1 }}>
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
                                                <AccountBalanceIcon sx={{ color: '#2196F3' }} fontSize="small" />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={account.bankName}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" sx={{ color: '#1565C0' }}>
                                                    {formatIban(account.iban)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#1565C0' }}>
                                                    {account.accountName}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ color: '#1976D2' }}
                                    />
                                </ListItem>
                                );
                            })}
                        </List>
                    </CardContent>
                </>
            )}

            {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
                <>
                    <Divider variant="middle" sx={{ backgroundColor: '#2196F3' }} />
                    <CardContent sx={{ py: 1, textAlign: 'center', backgroundColor: '#f0f8ff' }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                            {cardData.linkedinUrl && (
                                <IconButton component="a" href={cardData.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" sx={{ color: '#0077B5', backgroundColor: 'white', '&:hover': { backgroundColor: '#e3f2fd' } }}>
                                    <LinkedInIcon />
                                </IconButton>
                            )}
                            {cardData.twitterUrl && (
                                <IconButton component="a" href={cardData.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" sx={{ color: '#1DA1F2', backgroundColor: 'white', '&:hover': { backgroundColor: '#e3f2fd' } }}>
                                    <TwitterIcon />
                                </IconButton>
                            )}
                            {cardData.instagramUrl && (
                                <IconButton component="a" href={cardData.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" sx={{ color: '#E1306C', backgroundColor: 'white', '&:hover': { backgroundColor: '#e3f2fd' } }}>
                                    <InstagramIcon />
                                </IconButton>
                            )}
                        </Stack>
                    </CardContent>
                </>
            )}

            <Divider sx={{ backgroundColor: '#2196F3' }} />
            <CardContent sx={{ py: '8px !important', textAlign: 'center', backgroundColor: '#f0f8ff' }}>
                <Typography variant="caption" sx={{ color: '#1565C0' }}>
                    {cardData.cardName}
                </Typography>
            </CardContent>
        </Card>
    );
};

// Dark Modern Tema
export const DarkModernTheme = ({ cardData }) => {
    return (
        <Box sx={{ maxWidth: 500, width: '100%', mt: 2 }}>
            {/* Üst Bölüm - Profil Fotoğrafı ve Temel Bilgiler */}
            <Paper 
                sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
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
            <Paper sx={{ borderRadius: '0 0 20px 20px', overflow: 'hidden', backgroundColor: '#1a1a1a', color: 'white' }}>
                {cardData.bio && (
                    <CardContent sx={{ pt: 2, pb: 1, backgroundColor: '#1a1a1a' }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#b0b0b0', textAlign: 'center' }}>
                            {cardData.bio}
                        </Typography>
                    </CardContent>
                )}

                <CardContent sx={{ pt: 1, backgroundColor: '#1a1a1a' }}>
                    <Stack spacing={2}>
                        {cardData.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PhoneIcon sx={{ color: '#4CAF50' }} />
                                <Typography variant="body2" sx={{ color: 'white' }}>{cardData.phone}</Typography>
                            </Box>
                        )}
                        {cardData.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <EmailIcon sx={{ color: '#2196F3' }} />
                                <Link href={`mailto:${cardData.email}`} sx={{ textDecoration: 'none', color: 'white' }}>
                                    <Typography variant="body2">{cardData.email}</Typography>
                                </Link>
                            </Box>
                        )}
                        {cardData.website && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LanguageIcon sx={{ color: '#FF9800' }} />
                                <Link href={cardData.website} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: 'white' }}>
                                    <Typography variant="body2">{cardData.website}</Typography>
                                </Link>
                            </Box>
                        )}
                        {cardData.address && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LocationOnIcon sx={{ color: '#F44336' }} />
                                <Typography variant="body2" sx={{ color: 'white' }}>{cardData.address}</Typography>
                            </Box>
                        )}

                        {/* Banka Hesapları */}
                        {cardData.bankAccounts && cardData.bankAccounts.length > 0 && (
                            <>
                                {cardData.bankAccounts.map((account, index) => {
                                    const bankLogo = getBankLogo(account.bankName);
                                    return (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                                                <AccountBalanceIcon sx={{ color: '#FFD700' }} />
                                            )}
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                                                    {account.bankName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.875rem' }}>
                                                    {formatIban(account.iban)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.875rem' }}>
                                                    {account.accountName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </>
                        )}
                    </Stack>
                </CardContent>

                {(cardData.linkedinUrl || cardData.twitterUrl || cardData.instagramUrl) && (
                    <CardContent sx={{ pt: 1, pb: 2, textAlign: 'center', backgroundColor: '#1a1a1a' }}>
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
                    </CardContent>
                )}

                <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#1a1a1a', borderTop: '1px solid #333' }}>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                        {cardData.cardName}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

// Tema seçici fonksiyonu
export const getThemeComponent = (theme) => {
    switch (theme) {
        case 'modern':
            return ModernTheme;
        case 'minimalist':
            return MinimalistTheme;
        case 'icongrid':
            return IconGridTheme;
        case 'business':
            return BusinessTheme;
        case 'creative':
            return CreativeTheme;
        case 'dark':
            return DarkTheme;
        case 'blue':
            return BlueTheme;
        case 'darkmodern':
            return DarkModernTheme;
        case 'light':
        default:
            return DefaultTheme;
    }
}; 