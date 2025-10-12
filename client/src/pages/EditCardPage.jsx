import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cardService from '../services/cardService';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';
import { useNotification } from '../context/NotificationContext.jsx';
import ThemePreview from '../components/ThemePreview';
import { TURKISH_BANKS, formatIban, validateTurkishIban } from '../constants/turkishBanks';
import { optimizeImageForUpload } from '../utils/imageCompression.jsx';

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function EditCardPage() {
    const [formData, setFormData] = useState({
        cardName: '',
        name: '',
        title: '',
        company: '',
        bio: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        profileImageUrl: '',
        coverImageUrl: '',
        customSlug: '',
        theme: 'light',
        isActive: true,
        linkedinUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        // Pazaryeri alanları
        trendyolUrl: '',
        hepsiburadaUrl: '',
        ciceksepeti: '',
        sahibindenUrl: '',
        hepsiemlakUrl: '',
        gittigidiyorUrl: '',
        n11Url: '',
        amazonTrUrl: '',
        getirUrl: '',
        yemeksepetiUrl: '',
        profileImage: null,
        coverImage: null,
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    
    // Banka hesap bilgileri state'leri
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
    const [bankDialogOpen, setBankDialogOpen] = useState(false);
    const [editingBankAccount, setEditingBankAccount] = useState(null);
    const [bankFormData, setBankFormData] = useState({
        bankName: '',
        iban: '',
        accountName: ''
    });
    const [bankFormLoading, setBankFormLoading] = useState(false);
    
    const { id: cardId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // Kart bilgilerini çekmek için useEffect
    useEffect(() => {
        const fetchCardData = async () => {
            setPageLoading(true);
            try {
                const card = await cardService.getCardById(cardId); 
                setFormData({
                    cardName: card.cardName || '',
                    name: card.name || '',
                    title: card.title || '',
                    company: card.company || '',
                    bio: card.bio || '',
                    phone: card.phone || '',
                    email: card.email || '',
                    website: card.website || '',
                    address: card.address || '',
                    isActive: card.isActive ?? true, 
                    profileImageUrl: card.profileImageUrl || '',
                    coverImageUrl: card.coverImageUrl || '', 
                    customSlug: card.customSlug || '',
                    theme: card.theme || 'light',
                    linkedinUrl: card.linkedinUrl || '',
                    twitterUrl: card.twitterUrl || '',
                    instagramUrl: card.instagramUrl || '',
                    // Pazaryeri alanları
                    trendyolUrl: card.trendyolUrl || '',
                    hepsiburadaUrl: card.hepsiburadaUrl || '',
                    ciceksepeti: card.ciceksepeti || '',
                    sahibindenUrl: card.sahibindenUrl || '',
                    hepsiemlakUrl: card.hepsiemlakUrl || '',
                    gittigidiyorUrl: card.gittigidiyorUrl || '',
                    n11Url: card.n11Url || '',
                    amazonTrUrl: card.amazonTrUrl || '',
                    getirUrl: card.getirUrl || '',
                    yemeksepetiUrl: card.yemeksepetiUrl || '',
                    profileImage: null, 
                    coverImage: null,
                });
                // Önizlemeleri ayarla
                if (card.profileImageUrl) setProfilePreview(card.profileImageUrl);
                else setProfilePreview(null); 
                if (card.coverImageUrl) setCoverPreview(card.coverImageUrl);
                else setCoverPreview(null);
                
            } catch (err) { // Hata durumları (404, 500 vb.) buraya düşecek
                console.error("Kart bilgisi getirilirken hata:", err);
                // API'den gelen hata mesajını kullan (örn: "Kartvizit bulunamadı")
                showNotification(err.response?.data?.message || err.message || 'Kart bilgileri yüklenemedi.', 'error');
                navigate('/cards'); 
            } finally {
                setPageLoading(false);
            }
        };

        const fetchBankAccounts = async () => {
            if (cardId) {
                setBankAccountsLoading(true);
                try {
                    const accounts = await cardService.getCardBankAccounts(cardId);
                    setBankAccounts(accounts);
                } catch (err) {
                    console.error("Banka hesapları getirilirken hata:", err);
                } finally {
                    setBankAccountsLoading(false);
                }
            }
        };

        if (cardId) {
            fetchCardData();
            fetchBankAccounts();
        } else {
            showNotification('Kart ID bulunamadı.', 'error');
            setPageLoading(false);
            navigate('/cards');
        }
    }, [cardId, navigate, showNotification]);

    const onChange = async (e) => {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            const name = e.target.name;
            
            if (!file) {
                if (name === 'profileImage') setProfilePreview(formData.profileImageUrl || null);
                else if (name === 'coverImage') setCoverPreview(formData.coverImageUrl || null);
                return;
            }
            
            try {
                // Dosya boyutu kontrolü ve sıkıştırma
                const originalSizeInMB = file.size / (1024 * 1024);
                console.log(`Orijinal dosya boyutu: ${originalSizeInMB.toFixed(2)}MB`);
                
                let optimizedFile = file;
                
                // Eğer dosya 10MB'dan büyükse sıkıştır
                if (originalSizeInMB > 10) {
                    showNotification('Dosya sıkıştırılıyor, lütfen bekleyin...', 'info');
                    
                    optimizedFile = await optimizeImageForUpload(file, 10);
                    
                    const optimizedSizeInMB = optimizedFile.size / (1024 * 1024);
                    const compressionRatio = ((originalSizeInMB - optimizedSizeInMB) / originalSizeInMB * 100).toFixed(1);
                    
                    showNotification(
                        `Dosya sıkıştırıldı: ${originalSizeInMB.toFixed(1)}MB → ${optimizedSizeInMB.toFixed(1)}MB (${compressionRatio}% azaltıldı)`, 
                        'success'
                    );
                }
                
                setFormData((prevState) => ({ ...prevState, [name]: optimizedFile }));

                const reader = new FileReader();
                reader.onloadend = () => {
                    if (name === 'profileImage') setProfilePreview(reader.result);
                    else if (name === 'coverImage') setCoverPreview(reader.result);
                };
                reader.readAsDataURL(optimizedFile);
                
            } catch (error) {
                console.error('Dosya işleme hatası:', error);
                showNotification('Dosya işlenirken hata oluştu. Lütfen başka bir dosya seçin.', 'error');
            }
        } else {
            const { name, value, type, checked } = e.target;
            setFormData((prevState) => ({
                ...prevState,
                [name]: type === 'switch' ? checked : value,
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const uploadPromises = [];
        let profileImagePath = formData.profileImageUrl;
        let coverImagePath = formData.coverImageUrl;
        
        if (formData.profileImage instanceof File) {
            const profileFormData = new FormData();
            profileFormData.append('image', formData.profileImage);
            uploadPromises.push(
                axios.post(API_ENDPOINTS.UPLOAD, profileFormData, { headers: { 'Content-Type': 'multipart/form-data' } })
                     .then(res => { profileImagePath = res.data.filePath; })
                     .catch(err => { 
                         console.error("Profil resmi yükleme hatası:", err);
                         throw new Error(`Profil resmi yüklenemedi: ${err.response?.data?.message || err.message}`);
                     })
            );
        }
        if (formData.coverImage instanceof File) {
            const coverFormData = new FormData();
            coverFormData.append('image', formData.coverImage);
            uploadPromises.push(
                axios.post(API_ENDPOINTS.UPLOAD, coverFormData, { headers: { 'Content-Type': 'multipart/form-data' } })
                     .then(res => { coverImagePath = res.data.filePath; })
                     .catch(err => { 
                         console.error("Kapak resmi yükleme hatası:", err);
                         throw new Error(`Kapak resmi yüklenemedi: ${err.response?.data?.message || err.message}`);
                     })
            );
        }

        try {
            await Promise.all(uploadPromises);

            const updateData = { ...formData };
            delete updateData.profileImage;
            delete updateData.coverImage;
            updateData.profileImageUrl = profileImagePath;
            updateData.coverImageUrl = coverImagePath;

            console.log('[EditCardPage] Güncelleme için gönderilen data:', updateData);

            await cardService.updateCard(cardId, updateData);
            showNotification('Kart başarıyla güncellendi!', 'success');
            navigate('/cards');

        } catch (err) {
             console.error('Kart güncelleme/yükleme hatası:', err);
             let errorMsg = 'Kart güncellenirken bir hata oluştu.';

             if (err.message.startsWith('Profil resmi yüklenemedi') || err.message.startsWith('Kapak resmi yüklenemedi')) {
                 errorMsg = err.message;
             } else if (err.response?.data?.message) {
                 errorMsg = err.response.data.message;
                 if (errorMsg.toLowerCase().includes('slug already exists')) {
                     errorMsg = 'Girdiğiniz özel URL zaten başka bir kart tarafından kullanılıyor.';
                 } else if (errorMsg.toLowerCase().includes('file too large')) {
                     errorMsg = 'Dosya boyutu çok büyük. Lütfen 10MB\'dan küçük bir dosya seçin.';
                 } else if (errorMsg.toLowerCase().includes('desteklenmeyen dosya türü')) {
                     errorMsg = 'Desteklenmeyen dosya türü. Lütfen sadece resim dosyaları (JPG, PNG, GIF) yükleyin.';
                 }
             } else if (axios.isCancel(err)) { 
                 errorMsg = 'İşlem iptal edildi.';
             } else if (err.message.includes('Network Error')) {
                 errorMsg = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
             } else if (err.code === 'ECONNREFUSED') {
                 errorMsg = 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.';
             }

            showNotification(errorMsg, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
                <CircularProgress />
            </Container>
        );
    }

    // Banka hesap yönetimi fonksiyonları
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleBankDialogOpen = (account = null) => {
        setEditingBankAccount(account);
        setBankFormData(account ? {
            bankName: account.bankName,
            iban: formatIban(account.iban),
            accountName: account.accountName
        } : {
            bankName: '',
            iban: '',
            accountName: ''
        });
        setBankDialogOpen(true);
    };

    const handleBankDialogClose = () => {
        setBankDialogOpen(false);
        setEditingBankAccount(null);
        setBankFormData({ bankName: '', iban: '', accountName: '' });
    };

    const handleBankFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'iban') {
            const formattedIban = formatIban(value);
            setBankFormData(prev => ({ ...prev, [name]: formattedIban }));
        } else {
            setBankFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBankSave = async () => {
        const validation = validateTurkishIban(bankFormData.iban);
        if (!validation.isValid) {
            showNotification(validation.message, 'error');
            return;
        }

        if (!bankFormData.bankName || !bankFormData.accountName) {
            showNotification('Lütfen tüm alanları doldurun.', 'error');
            return;
        }

        setBankFormLoading(true);
        try {
            if (editingBankAccount) {
                await cardService.updateCardBankAccount(cardId, editingBankAccount.id, bankFormData);
                showNotification('Banka hesabı başarıyla güncellendi.', 'success');
            } else {
                await cardService.addCardBankAccount(cardId, bankFormData);
                showNotification('Banka hesabı başarıyla eklendi.', 'success');
            }
            
            // Banka hesaplarını yeniden çek
            const accounts = await cardService.getCardBankAccounts(cardId);
            setBankAccounts(accounts);
            handleBankDialogClose();
        } catch (err) {
            console.error('Banka hesabı kaydetme hatası:', err);
            showNotification(err.response?.data?.message || 'Banka hesabı kaydedilirken hata oluştu.', 'error');
        } finally {
            setBankFormLoading(false);
        }
    };

    const handleBankDelete = async (accountId) => {
        if (window.confirm('Bu banka hesabını silmek istediğinizden emin misiniz?')) {
            try {
                await cardService.deleteCardBankAccount(cardId, accountId);
                showNotification('Banka hesabı başarıyla silindi.', 'success');
                
                // Banka hesaplarını yeniden çek
                const accounts = await cardService.getCardBankAccounts(cardId);
                setBankAccounts(accounts);
            } catch (err) {
                console.error('Banka hesabı silme hatası:', err);
                showNotification(err.response?.data?.message || 'Banka hesabı silinirken hata oluştu.', 'error');
            }
        }
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ px: { xs: 0.5, sm: 1, md: 2 } }}>
             <Paper sx={{ 
               p: { xs: 1.5, sm: 2.5, md: 4 }, 
               mt: { xs: 1, sm: 2, md: 3 }, 
               mb: { xs: 1, sm: 2, md: 3 }, 
               boxShadow: { xs: 1, sm: 2, md: 3 },
               mx: { xs: 0.5, sm: 0 }
             }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
                    <Typography 
                      component="h1" 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}
                    >
                        Kartviziti Düzenle
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                        Dijital kartvizitinizin bilgilerini güncelleyin ve yönetin
                    </Typography>
                </Box>
                
                {/* Tab Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 2, sm: 3, md: 4 } }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange} 
                      aria-label="Kart düzenleme sekmeleri"
                      variant="fullWidth"
                      sx={{
                        '& .MuiTab-root': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          minHeight: { xs: 40, sm: 44 },
                          px: { xs: 1, sm: 2 }
                        }
                      }}
                    >
                        <Tab label="Kart Bilgileri" />
                        <Tab label="Banka Hesapları" />
                    </Tabs>
                </Box>

                {/* Tab 0: Kart Bilgileri */}
                {tabValue === 0 && (
                    <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
                        <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Paper sx={{ 
                              p: { xs: 1.5, sm: 2 }, 
                              backgroundColor: 'background.paper', 
                              border: '1px solid', 
                              borderColor: 'divider' 
                            }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  justifyContent: 'space-between', 
                                  alignItems: { xs: 'flex-start', sm: 'center' },
                                  gap: { xs: 2, sm: 0 }
                                }}>
                                    <Box>
                                        <Typography 
                                          variant="subtitle1" 
                                          sx={{ 
                                            fontWeight: 600,
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                          }}
                                        >
                                            Kart Durumu
                                        </Typography>
                                        <Typography 
                                          variant="body2" 
                                          color="text.secondary"
                                          sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            display: { xs: 'none', sm: 'block' }
                                          }}
                                        >
                                            Kartınızın aktif/pasif durumunu yönetin
                                        </Typography>
                                    </Box>
                                    <FormControlLabel
                                        control={<Switch checked={formData.isActive} onChange={onChange} name="isActive" />}
                                        label="Kart Aktif" 
                                        labelPlacement="start"
                                        disabled={formLoading}
                                        sx={{
                                          '& .MuiFormControlLabel-label': {
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                          }
                                        }}
                                    />
                                    </Box>
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                Görsel Yönetimi
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ 
                              p: { xs: 2, sm: 3 }, 
                              textAlign: 'center', 
                              border: '1px solid', 
                              borderColor: 'divider',
                              backgroundColor: 'background.paper' 
                            }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Profil Fotoğrafı
                                </Typography>
                                <Avatar 
                                    src={profilePreview || '/placeholder-avatar.png'} 
                                    sx={{ 
                                        width: { xs: 100, sm: 120 }, 
                                        height: { xs: 100, sm: 120 }, 
                                        mb: 2, 
                                        border: '2px solid', 
                                        borderColor: 'grey.300',
                                        mx: 'auto'
                                    }} 
                                />
                                <input type="file" name="profileImage" ref={profileInputRef} onChange={onChange} style={{ display: 'none' }} accept="image/*" />
                                <Button 
                                    variant="outlined" 
                                    onClick={() => profileInputRef.current.click()} 
                                    disabled={formLoading}
                                    sx={{ mb: 1, width: { xs: '100%', sm: 'auto' } }}
                                >
                                    {formData.profileImageUrl || profilePreview ? 'Değiştir' : 'Profil Resmi Seç'}
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Maksimum 10MB. Büyük dosyalar otomatik sıkıştırılır.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ 
                              p: { xs: 2, sm: 3 }, 
                              textAlign: 'center', 
                              border: '1px solid', 
                              borderColor: 'divider',
                              backgroundColor: 'background.paper' 
                            }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Kapak Fotoğrafı
                                </Typography>
                                <CardMedia
                                    component="img"
                                    image={coverPreview || '/placeholder-cover.png'}
                                    alt="Kapak Fotoğrafı Önizlemesi"
                                    sx={{ 
                                        width: '100%', 
                                        height: { xs: 100, sm: 120 }, 
                                        objectFit: 'cover', 
                                        mb: 2, 
                                        borderRadius: 1, 
                                        border: '2px solid', 
                                        borderColor: 'grey.300'
                                    }}
                                />
                                <input
                                    type="file"
                                    name="coverImage"
                                    ref={coverInputRef}
                                    onChange={onChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => coverInputRef.current.click()}
                                    disabled={formLoading}
                                    sx={{ mb: 1, width: { xs: '100%', sm: 'auto' } }}
                                >
                                    {formData.coverImageUrl || coverPreview ? 'Kapak Fotoğrafını Değiştir' : 'Kapak Fotoğrafı Seç'}
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Maksimum 10MB. Büyük dosyalar otomatik sıkıştırılır.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                Temel Bilgiler
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="cardName"
                                required
                                fullWidth
                                id="cardName"
                                label="Kartvizit Adı"
                                value={formData.cardName}
                                onChange={onChange}
                                disabled={formLoading}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                fullWidth
                                id="name"
                                label="İsim Soyisim"
                                value={formData.name}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="title"
                                fullWidth
                                id="title"
                                label="Ünvan"
                                value={formData.title}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="company"
                                fullWidth
                                id="company"
                                label="Şirket"
                                value={formData.company}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="phone"
                                fullWidth
                                id="phone"
                                label="Telefon"
                                type="tel"
                                value={formData.phone}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                fullWidth
                                id="email"
                                label="E-posta"
                                type="email"
                                value={formData.email}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="website"
                                fullWidth
                                id="website"
                                label="Web Sitesi"
                                type="url"
                                value={formData.website}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="address"
                                fullWidth
                                id="address"
                                label="Adres"
                                multiline
                                rows={3}
                                value={formData.address}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="bio"
                                fullWidth
                                id="bio"
                                label="Biyografi"
                                multiline
                                rows={4}
                                value={formData.bio}
                                onChange={onChange}
                                disabled={formLoading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                Gelişmiş Ayarlar
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="customSlug"
                                fullWidth
                                id="customSlug"
                                label="Özel URL"
                                value={formData.customSlug}
                                onChange={onChange}
                                disabled={formLoading}
                                helperText="Boş bırakırsanız veya değiştirmezseniz mevcut kalır. Sadece küçük harf, rakam ve tire kullanın."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth disabled={formLoading}>
                                <InputLabel id="theme-select-label">Tema</InputLabel>
                                <Select
                                    labelId="theme-select-label"
                                    id="theme-select"
                                    value={formData.theme}
                                    label="Tema"
                                    name="theme"
                                    onChange={onChange}
                                >
                                    <MenuItem value="light">Varsayılan (Açık)</MenuItem>
                                    <MenuItem value="modern">Modern</MenuItem>
                                    <MenuItem value="minimalist">Minimalist</MenuItem>
                                    <MenuItem value="icongrid">İkon Grid</MenuItem>
                                    <MenuItem value="business">İş</MenuItem>
                                    <MenuItem value="creative">Yaratıcı</MenuItem>
                                    <MenuItem value="dark">Koyu</MenuItem>
                                    <MenuItem value="darkmodern">Koyu Modern</MenuItem>
                                    <MenuItem value="blue">Mavi</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                Sosyal Medya Bağlantıları
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Sosyal medya profillerinizi ekleyerek kartınızı daha etkili hale getirin
                            </Typography>
                        </Grid>
                         <Grid item xs={12} sm={6} md={4}>
                             <TextField
                                name="linkedinUrl"
                                fullWidth
                                id="linkedinUrl"
                                label="LinkedIn Profil URL"
                                value={formData.linkedinUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LinkedInIcon />
                                        </InputAdornment>
                                    ),
                                }}
                             />
                         </Grid>
                         <Grid item xs={12} sm={6} md={4}>
                             <TextField
                                name="twitterUrl"
                                fullWidth
                                id="twitterUrl"
                                label="Twitter (X) Profil URL"
                                value={formData.twitterUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TwitterIcon />
                                        </InputAdornment>
                                    ),
                                }}
                             />
                         </Grid>
                         <Grid item xs={12} sm={6} md={4}>
                             <TextField
                                name="instagramUrl"
                                fullWidth
                                id="instagramUrl"
                                label="Instagram Profil URL"
                                value={formData.instagramUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <InstagramIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Pazaryeri Alanları */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                E-ticaret Platformları
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Türkiye'deki popüler e-ticaret platformlarındaki mağaza linklerinizi ekleyebilirsiniz
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="trendyolUrl"
                                fullWidth
                                id="trendyolUrl"
                                label="Trendyol Mağaza URL"
                                value={formData.trendyolUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.trendyol.com/magaza/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img 
                                                src="/img/ikon/trendyol.png" 
                                                alt="Trendyol" 
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="hepsiburadaUrl"
                                fullWidth
                                id="hepsiburadaUrl"
                                label="Hepsiburada Mağaza URL"
                                value={formData.hepsiburadaUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.hepsiburada.com/magaza/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img 
                                                src="/img/ikon/hepsiburada.png" 
                                                alt="Hepsiburada" 
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="ciceksepeti"
                                fullWidth
                                id="ciceksepeti"
                                label="Çiçeksepeti Mağaza URL"
                                value={formData.ciceksepeti}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.ciceksepeti.com/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img 
                                                src="/img/ikon/ciceksepeti.png" 
                                                alt="Çiçeksepeti" 
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="sahibindenUrl"
                                fullWidth
                                id="sahibindenUrl"
                                label="Sahibinden Profil URL"
                                value={formData.sahibindenUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.sahibinden.com/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img 
                                                src="/img/ikon/sahibinden.png" 
                                                alt="Sahibinden" 
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="hepsiemlakUrl"
                                fullWidth
                                id="hepsiemlakUrl"
                                label="Hepsiemlak Profil URL"
                                value={formData.hepsiemlakUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.hepsiemlak.com/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img 
                                                src="/img/ikon/hepsiemlak.png" 
                                                alt="Hepsiemlak" 
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="gittigidiyorUrl"
                                fullWidth
                                id="gittigidiyorUrl"
                                label="GittiGidiyor Mağaza URL"
                                value={formData.gittigidiyorUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.gittigidiyor.com/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <StorefrontIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="n11Url"
                                fullWidth
                                id="n11Url"
                                label="N11 Mağaza URL"
                                value={formData.n11Url}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.n11.com/magaza/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img 
                                                src="/img/ikon/n11.png" 
                                                alt="N11" 
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="amazonTrUrl"
                                fullWidth
                                id="amazonTrUrl"
                                label="Amazon Türkiye Mağaza URL"
                                value={formData.amazonTrUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.amazon.com.tr/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img 
                                                src="/img/ikon/amazon.png" 
                                                alt="Amazon" 
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="getirUrl"
                                fullWidth
                                id="getirUrl"
                                label="Getir Mağaza URL"
                                value={formData.getirUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://getir.com/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DeliveryDiningIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="yemeksepetiUrl"
                                fullWidth
                                id="yemeksepetiUrl"
                                label="Yemeksepeti Restoran URL"
                                value={formData.yemeksepetiUrl}
                                onChange={onChange}
                                disabled={formLoading}
                                placeholder="https://www.yemeksepeti.com/..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <RestaurantIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Tema Önizlemesi */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                Tema Önizlemesi
                            </Typography>
                            <ThemePreview formData={formData} />
                        </Grid>

                        </Grid>
                        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={formLoading || pageLoading}
                            sx={{ 
                                py: { xs: 1.5, sm: 2 },
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontWeight: 600
                            }}
                        >
                            {formLoading ? <CircularProgress size={24} /> : 'Değişiklikleri Kaydet'}
                        </Button>
                        </Box>
                    </Box>
                )}

                {/* Tab 1: Banka Hesapları */}
                {tabValue === 1 && (
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Banka Hesapları
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Kartınızda görünecek banka hesap bilgilerinizi yönetin
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleBankDialogOpen()}
                                disabled={bankAccountsLoading}
                                sx={{ fontWeight: 500 }}
                            >
                                Hesap Ekle
                            </Button>
                        </Box>

                        {bankAccountsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : bankAccounts.length === 0 ? (
                            <Paper sx={{ 
                              p: 4, 
                              textAlign: 'center', 
                              border: '2px dashed', 
                              borderColor: 'divider',
                              backgroundColor: 'background.paper'
                            }}>
                                <AccountBalanceIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                                    Henüz banka hesabı eklenmemiş
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Kartvizitinizde gösterilecek banka hesap bilgilerini ekleyebilirsiniz
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleBankDialogOpen()}
                                    sx={{ fontWeight: 500 }}
                                >
                                    İlk Hesabı Ekle
                                </Button>
                            </Paper>
                        ) : (
                            <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
                                {bankAccounts.map((account) => (
                                    <ListItem 
                                        key={account.id} 
                                        sx={{ 
                                            p: 3, 
                                            mb: 2, 
                                            border: '1px solid', 
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            backgroundColor: 'background.paper',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: 1
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <AccountBalanceIcon color="primary" />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {account.bankName}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                        <strong>IBAN:</strong> {formatIban(account.iban)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Hesap Sahibi:</strong> {account.accountName}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="düzenle"
                                                onClick={() => handleBankDialogOpen(account)}
                                                sx={{ mr: 1, color: 'primary.main' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="sil"
                                                onClick={() => handleBankDelete(account.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                )}

                {/* Banka Hesabı Ekleme/Düzenleme Modalı */}
                <Dialog open={bankDialogOpen} onClose={handleBankDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ pb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {editingBankAccount ? 'Banka Hesabını Düzenle' : 'Yeni Banka Hesabı Ekle'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {editingBankAccount ? 'Banka hesap bilgilerini güncelleyin' : 'Kartınızda görünecek banka hesap bilgilerini ekleyin'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Banka</InputLabel>
                                    <Select
                                        name="bankName"
                                        value={bankFormData.bankName}
                                        onChange={handleBankFormChange}
                                        label="Banka"
                                        disabled={bankFormLoading}
                                    >
                                        {TURKISH_BANKS.map((bank) => (
                                            <MenuItem key={bank.name} value={bank.name}>
                                                {bank.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="iban"
                                    label="IBAN"
                                    value={bankFormData.iban}
                                    onChange={handleBankFormChange}
                                    fullWidth
                                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                                    disabled={bankFormLoading}
                                    helperText="IBAN numaranızı boşluklarla veya boşluksuz girebilirsiniz"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="accountName"
                                    label="Hesap Sahibi Adı"
                                    value={bankFormData.accountName}
                                    onChange={handleBankFormChange}
                                    fullWidth
                                    disabled={bankFormLoading}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button 
                            onClick={handleBankDialogClose} 
                            disabled={bankFormLoading}
                            sx={{ fontWeight: 500 }}
                        >
                            İptal
                        </Button>
                        <Button 
                            onClick={handleBankSave} 
                            variant="contained" 
                            disabled={bankFormLoading}
                            sx={{ fontWeight: 500 }}
                        >
                            {bankFormLoading ? <CircularProgress size={20} /> : 'Kaydet'}
                        </Button>
                    </DialogActions>
                </Dialog>
             </Paper>
        </Container>
    );
}

export default EditCardPage; 