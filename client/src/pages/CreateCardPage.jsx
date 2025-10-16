import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cardService from '../services/cardService';
import { getCorporateUsers } from '../services/corporateService';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext.jsx';
import { API_ENDPOINTS } from '../config/api.js';
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
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
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
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';

function CreateCardPage() {
    const [formData, setFormData] = useState({
        cardName: 'Kartvizitim',
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
        logoImage: null,
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        github: '',
        bankAccounts: [],
        selectedUserId: null // Kurumsal kullanıcı seçimi için
    });
    const [loading, setLoading] = useState(false);
    const [profileImageLoading, setProfileImageLoading] = useState(false);
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [companyUsers, setCompanyUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    // Gizli file inputlarına erişmek için ref'ler
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // Banka hesap bilgileri state'leri
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankDialogOpen, setBankDialogOpen] = useState(false);
    const [editingBankAccount, setEditingBankAccount] = useState(null);
    const [bankFormData, setBankFormData] = useState({
        bankName: '',
        iban: '',
        accountName: ''
    });

    // Kullanıcı bilgilerini ve şirket kullanıcılarını yükle
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
            // Kurumsal kullanıcı ise şirket bilgisini otomatik doldur
            if (user.role === 'corporate' && user.companyName) {
                setFormData(prev => ({
                    ...prev,
                    company: user.companyName
                }));
            }
            
            // Kurumsal kullanıcı ise şirket kullanıcılarını yükle
            if (user.role === 'corporate') {
                loadCompanyUsers();
            }
        }
    }, []);

    const loadCompanyUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await getCorporateUsers();
            if (response.success && response.data) {
                setCompanyUsers(response.data);
            }
        } catch (error) {
            console.error('Şirket kullanıcıları yüklenirken hata:', error);
            showNotification('Şirket kullanıcıları yüklenemedi', 'error');
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const onChange = async (e) => {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            const name = e.target.name;
            
            if (!file) {
                setFormData((prevState) => ({ ...prevState, [name]: null }));
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
                
            } catch (error) {
                console.error('Dosya işleme hatası:', error);
                showNotification('Dosya işlenirken hata oluştu. Lütfen başka bir dosya seçin.', 'error');
            }
        } else {
            setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
        }
    };

    // Kullanıcı seçimi değiştiğinde
    const handleUserSelect = (event, selectedUser) => {
        if (selectedUser) {
            setFormData(prev => ({
                ...prev,
                selectedUserId: selectedUser.id,
                name: selectedUser.name || '',
                email: selectedUser.email || '',
                phone: selectedUser.phone || ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                selectedUserId: null,
                name: '',
                email: '',
                phone: ''
            }));
        }
    };

    // Dosya yükleme işlemi
    const uploadFileHandler = async (file, fieldName) => {
        const fileFormData = new FormData();
        fileFormData.append('image', file);

        if (fieldName === 'profileImageUrl') setProfileImageLoading(true);
        if (fieldName === 'coverImageUrl') setCoverImageLoading(true);
        setUploadError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post(API_ENDPOINTS.UPLOAD, fileFormData, config);

            setFormData((prevState) => ({
                ...prevState,
                [fieldName]: data.filePath,
            }));

        } catch (err) {
            console.error('Dosya yükleme hatası:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Dosya yüklenemedi';
            setUploadError(errorMsg);
        } finally {
            if (fieldName === 'profileImageUrl') setProfileImageLoading(false);
            if (fieldName === 'coverImageUrl') setCoverImageLoading(false);
        }
    };

    // Dosya seçildiğinde tetiklenir
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fieldName = e.target.name;
        if (file) {
            uploadFileHandler(file, fieldName);
        }
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

    const handleBankFormSubmit = () => {
        if (!bankFormData.bankName || !bankFormData.iban || !bankFormData.accountName) {
            showNotification('Lütfen tüm banka bilgilerini doldurun.', 'error');
            return;
        }

        if (!validateTurkishIban(bankFormData.iban)) {
            showNotification('Geçersiz IBAN numarası.', 'error');
            return;
        }

        if (editingBankAccount) {
            setBankAccounts(prev => prev.map(acc => 
                acc === editingBankAccount ? bankFormData : acc
            ));
        } else {
            setBankAccounts(prev => [...prev, bankFormData]);
        }

        handleBankDialogClose();
    };

    const handleDeleteBankAccount = (account) => {
        setBankAccounts(prev => prev.filter(acc => acc !== account));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'selectedUserId' && formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });

        // Seçilen kullanıcı ID'sini ekle
        if (formData.selectedUserId) {
            data.append('userId', formData.selectedUserId);
        }

        // Banka hesaplarını ekle
        if (bankAccounts.length > 0) {
            data.append('bankAccounts', JSON.stringify(bankAccounts));
        }

        try {
            const response = await cardService.createCard(data);
            showNotification('Kart başarıyla oluşturuldu!', 'success');
            navigate(`/cards/edit/${response.data.card.id}`);
        } catch (error) {
            let errorMsg = 'Kart oluşturulurken bir hata oluştu.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
                if (errorMsg.toLowerCase().includes('slug already exists')) {
                    errorMsg = 'Girdiğiniz özel URL zaten kullanılıyor.';
                }
                if (errorMsg.includes('Bireysel kullanıcılar sadece bir kartvizit oluşturabilir')) {
                    errorMsg = 'Bireysel kullanıcılar sadece bir kartvizit oluşturabilir. Mevcut kartınızı düzenleyebilirsiniz.';
                }
            }
            showNotification(errorMsg, 'error');
            console.error("Kart oluşturma hatası:", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Modern Header */}
            <Box sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                p: 4,
                mb: 4,
                color: 'white',
                textAlign: 'center'
            }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Yeni Kartvizit Oluştur
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {currentUser?.role === 'corporate' 
                        ? 'Şirketiniz için profesyonel kartvizit oluşturun'
                        : 'Kişisel kartvizitinizi oluşturun'
                    }
                </Typography>
            </Box>

            <Paper sx={{ 
                p: { xs: 2, md: 4 }, 
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                {uploadError && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                        {`Dosya yükleme hatası: ${uploadError}`}
                    </Alert>
                )}

                {/* Kurumsal kullanıcı için kullanıcı seçimi */}
                {currentUser?.role === 'corporate' && (
                    <Card sx={{ mb: 3, borderRadius: 2, border: '2px solid #e3f2fd' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Kullanıcı Seçimi
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Kart oluşturmak istediğiniz kullanıcıyı seçin. Boş bırakırsanız genel şirket kartı oluşturulur.
                            </Typography>
                            <Autocomplete
                                options={companyUsers}
                                getOptionLabel={(option) => `${option.name} (${option.email})`}
                                loading={loadingUsers}
                                onChange={handleUserSelect}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Kullanıcı Seç (İsteğe Bağlı)"
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <>
                                                    {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                            {option.name?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1">{option.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {option.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Tab Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="Kart oluşturma sekmeleri"
                        sx={{
                            '& .MuiTab-root': {
                                fontWeight: 'bold',
                                fontSize: '1rem'
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
                        <Grid container spacing={3}>
                            {/* Profil ve Kapak Fotoğrafı */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Görsel Ayarları
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                Profil Fotoğrafı
                                            </Typography>
                                            <Avatar
                                                src={formData.profileImageUrl || '/placeholder-avatar.png'}
                                                sx={{ 
                                                    width: 120, 
                                                    height: 120, 
                                                    mb: 2, 
                                                    border: '4px solid white',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                }}
                                            />
                                            <input
                                                type="file"
                                                name="profileImageUrl"
                                                ref={profileInputRef}
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={() => profileInputRef.current.click()}
                                                disabled={profileImageLoading || loading}
                                                startIcon={profileImageLoading ? <CircularProgress size={20} /> : null}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                {profileImageLoading ? 'Yükleniyor...' : (formData.profileImageUrl ? 'Değiştir' : 'Profil Resmi Seç')}
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                Kapak Fotoğrafı
                                            </Typography>
                                            <CardMedia
                                                component="img"
                                                image={formData.coverImageUrl || '/placeholder-cover.png'}
                                                alt="Kapak Fotoğrafı Önizlemesi"
                                                sx={{ 
                                                    width: '100%', 
                                                    height: 120, 
                                                    objectFit: 'cover', 
                                                    mb: 2, 
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                }}
                                            />
                                            <input
                                                type="file"
                                                name="coverImageUrl"
                                                ref={coverInputRef}
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={() => coverInputRef.current.click()}
                                                disabled={coverImageLoading || loading}
                                                startIcon={coverImageLoading ? <CircularProgress size={20} /> : null}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                {coverImageLoading ? 'Yükleniyor...' : (formData.coverImageUrl ? 'Kapak Fotoğrafını Değiştir' : 'Kapak Fotoğrafı Seç')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            {/* Temel Bilgiler */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Temel Bilgiler
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                name="cardName"
                                                required
                                                fullWidth
                                                id="cardName"
                                                label="Kartvizit Adı"
                                                value={formData.cardName}
                                                onChange={onChange}
                                                disabled={loading}
                                                autoFocus
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading || currentUser?.role === 'corporate'}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                helperText={currentUser?.role === 'corporate' ? 'Şirket bilgisi otomatik dolduruldu' : ''}
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
                                                disabled={loading}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            {/* Ek Bilgiler */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Ek Bilgiler
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                name="website"
                                                fullWidth
                                                id="website"
                                                label="Web Sitesi"
                                                type="url"
                                                value={formData.website}
                                                onChange={onChange}
                                                disabled={loading}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                name="customSlug"
                                                fullWidth
                                                id="customSlug"
                                                label="Özel URL"
                                                value={formData.customSlug}
                                                onChange={onChange}
                                                disabled={loading}
                                                helperText="Boş bırakırsanız otomatik oluşturulur. Sadece küçük harf, rakam ve tire kullanın."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth disabled={loading}>
                                                <InputLabel id="theme-select-label">Tema</InputLabel>
                                                <Select
                                                    labelId="theme-select-label"
                                                    id="theme-select"
                                                    value={formData.theme}
                                                    label="Tema"
                                                    name="theme"
                                                    onChange={onChange}
                                                    sx={{ borderRadius: 2 }}
                                                >
                                                    <MenuItem value="light">Varsayılan (Açık)</MenuItem>
                                                    <MenuItem value="modern">Modern</MenuItem>
                                                    <MenuItem value="minimalist">Minimalist</MenuItem>
                                                    <MenuItem value="icongrid">İkon Grid</MenuItem>
                                                    <MenuItem value="business">İş</MenuItem>
                                                    <MenuItem value="creative">Yaratıcı</MenuItem>
                                                    <MenuItem value="carousel">🎡 3D Carousel (Dönen İkonlar)</MenuItem>
                                                    <MenuItem value="dark">Koyu</MenuItem>
                                                    <MenuItem value="darkmodern">Koyu Modern</MenuItem>
                                                    <MenuItem value="blue">Mavi</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            {/* Sosyal Medya */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Sosyal Medya (İsteğe Bağlı)
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                name="linkedinUrl"
                                                fullWidth
                                                id="linkedinUrl"
                                                label="LinkedIn Profil URL"
                                                value={formData.linkedinUrl}
                                                onChange={onChange}
                                                disabled={loading}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LinkedInIcon color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                name="twitterUrl"
                                                fullWidth
                                                id="twitterUrl"
                                                label="Twitter (X) Profil URL"
                                                value={formData.twitterUrl}
                                                onChange={onChange}
                                                disabled={loading}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <TwitterIcon color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                name="instagramUrl"
                                                fullWidth
                                                id="instagramUrl"
                                                label="Instagram Profil URL"
                                                value={formData.instagramUrl}
                                                onChange={onChange}
                                                disabled={loading}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <InstagramIcon color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            {/* Pazaryeri Alanları */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        🛒 Pazaryeri Linkleri (İsteğe Bağlı)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Türkiye'deki popüler pazaryerlerindeki mağaza linklerinizi ekleyebilirsiniz
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                name="trendyolUrl"
                                                fullWidth
                                                id="trendyolUrl"
                                                label="Trendyol Mağaza URL"
                                                value={formData.trendyolUrl}
                                                onChange={onChange}
                                                disabled={loading}
                                                placeholder="https://www.trendyol.com/magaza/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.hepsiburada.com/magaza/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.ciceksepeti.com/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.sahibinden.com/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.hepsiemlak.com/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.gittigidiyor.com/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.n11.com/magaza/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.amazon.com.tr/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://getir.com/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                disabled={loading}
                                                placeholder="https://www.yemeksepeti.com/..."
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <RestaurantIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            {/* Tema Önizleme */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                        Kartvizit Önizleme
                                    </Typography>
                                    <ThemePreview formData={formData} />
                                </Card>
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    px: 6,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Kartvizit Oluştur'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Tab 1: Banka Hesapları */}
                {tabValue === 1 && (
                    <Box sx={{ mt: 1 }}>
                        <Card sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                Banka Hesap Bilgileri
                            </Typography>
                            
                            {bankAccounts.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <AccountBalanceIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Henüz banka hesabı eklenmedi
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Kartvizitinizde gösterilecek banka hesap bilgilerini ekleyebilirsiniz
                                    </Typography>
                                </Box>
                            ) : (
                                <List sx={{ mb: 2 }}>
                                    {bankAccounts.map((account, index) => (
                                        <ListItem 
                                            key={index}
                                            sx={{ 
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 2,
                                                mb: 1,
                                                '&:hover': { bgcolor: 'grey.50' }
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <AccountBalanceIcon color="primary" />
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                            {account.bankName}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>Hesap Sahibi:</strong> {account.accountName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            <strong>IBAN:</strong> {account.iban}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="edit"
                                                    onClick={() => handleBankDialogOpen(account)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleDeleteBankAccount(account)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                            
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleBankDialogOpen()}
                                sx={{ 
                                    mt: 2,
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                Banka Hesabı Ekle
                            </Button>
                            
                            {bankAccounts.length > 0 && (
                                <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={onSubmit}
                                        disabled={loading}
                                        sx={{ 
                                            px: 6,
                                            py: 1.5,
                                            borderRadius: 3,
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                            }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Kartvizit Oluştur'}
                                    </Button>
                                </Box>
                            )}
                        </Card>
                    </Box>
                )}

                {/* Banka Hesabı Ekleme/Düzenleme Modalı */}
                <Dialog 
                    open={bankDialogOpen} 
                    onClose={handleBankDialogClose} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: 3 }
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {editingBankAccount ? 'Banka Hesabını Düzenle' : 'Yeni Banka Hesabı Ekle'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Banka</InputLabel>
                                <Select
                                    value={bankFormData.bankName}
                                    onChange={handleBankFormChange}
                                    name="bankName"
                                    label="Banka"
                                    sx={{ borderRadius: 2 }}
                                >
                                    {TURKISH_BANKS.map((bank) => (
                                        <MenuItem key={bank.code} value={bank.name}>
                                            {bank.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="IBAN"
                                name="iban"
                                value={bankFormData.iban}
                                onChange={handleBankFormChange}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountBalanceIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Hesap Sahibi"
                                name="accountName"
                                value={bankFormData.accountName}
                                onChange={handleBankFormChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button 
                            onClick={handleBankDialogClose}
                            sx={{ borderRadius: 2 }}
                        >
                            İptal
                        </Button>
                        <Button 
                            onClick={handleBankFormSubmit} 
                            variant="contained"
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            {editingBankAccount ? 'Güncelle' : 'Ekle'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}

export default CreateCardPage; 