import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCard } from '../../services/adminService';
import { getUsers } from '../../services/adminService';
import { getCompanies } from '../../services/adminService';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import ThemePreview from '../../components/ThemePreview';
import { TURKISH_BANKS, formatIban, validateTurkishIban } from '../../constants/turkishBanks';

// MUI Imports
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress,
    Grid,
    Avatar,
    CardMedia,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Tabs,
    Tab,
    Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';

function AdminCardCreatePage() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [profileImageLoading, setProfileImageLoading] = useState(false);
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [tabValue, setTabValue] = useState(0);

    // Banka hesap bilgileri state'leri
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankDialogOpen, setBankDialogOpen] = useState(false);
    const [editingBankAccount, setEditingBankAccount] = useState(null);
    const [bankFormData, setBankFormData] = useState({
        bankName: '',
        iban: '',
        accountName: ''
    });

    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

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
        status: true,
        userId: '',
        companyId: '',
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
        bankAccounts: []
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, companiesData] = await Promise.all([
                    getUsers(),
                    getCompanies()
                ]);
                setUsers(usersData);
                setCompanies(companiesData);
            } catch (err) {
                console.error("Veri yükleme hatası:", err);
                setError('Kullanıcı ve şirket verileri yüklenemedi.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'status' ? checked : value
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    data.append(key, formData[key]);
                }
            });

            // Banka hesaplarını ekle
            if (bankAccounts.length > 0) {
                data.append('bankAccounts', JSON.stringify(bankAccounts));
            }

            await createCard(data);
            showNotification('Kartvizit başarıyla oluşturuldu!', 'success');
            navigate('/admin/cards');
        } catch (err) {
            console.error("Kartvizit oluşturma hatası:", err);
            setError(err.response?.data?.message || 'Kartvizit oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AddIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Yeni Kartvizit Oluştur
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Yeni bir dijital kartvizit oluşturun
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}

                {/* Tab Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Kart oluşturma sekmeleri">
                        <Tab label="Kart Bilgileri" />
                        <Tab label="Banka Hesapları" />
                    </Tabs>
                </Box>

                {/* Tab 0: Kart Bilgileri */}
                {tabValue === 0 && (
                    <form onSubmit={handleSubmit}>
                        {/* Fotoğraf Yükleme Bölümü */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                                📸 Görsel Yükleme
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ 
                                        border: '2px dashed', 
                                        borderColor: 'grey.300', 
                                        borderRadius: 3, 
                                        p: 3, 
                                        textAlign: 'center',
                                        backgroundColor: 'grey.50'
                                    }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                                            Profil Fotoğrafı
                                        </Typography>
                                        <Avatar
                                            src={formData.profileImageUrl || '/placeholder-avatar.png'}
                                            sx={{ 
                                                width: 120, 
                                                height: 120, 
                                                mx: 'auto', 
                                                mb: 2,
                                                border: '4px solid',
                                                borderColor: 'background.paper',
                                                boxShadow: 2
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
                                            variant="outlined"
                                            onClick={() => profileInputRef.current.click()}
                                            disabled={profileImageLoading || loading}
                                            startIcon={profileImageLoading ? <CircularProgress size={16} /> : <AddIcon />}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {profileImageLoading ? 'Yükleniyor...' : (formData.profileImageUrl ? 'Değiştir' : 'Profil Resmi Seç')}
                                        </Button>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ 
                                        border: '2px dashed', 
                                        borderColor: 'grey.300', 
                                        borderRadius: 3, 
                                        p: 3, 
                                        textAlign: 'center',
                                        backgroundColor: 'grey.50'
                                    }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
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
                                                boxShadow: 1
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
                                            variant="outlined"
                                            onClick={() => coverInputRef.current.click()}
                                            disabled={coverImageLoading || loading}
                                            startIcon={coverImageLoading ? <CircularProgress size={16} /> : <AddIcon />}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {coverImageLoading ? 'Yükleniyor...' : (formData.coverImageUrl ? 'Kapak Fotoğrafını Değiştir' : 'Kapak Fotoğrafı Seç')}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Temel Bilgiler */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                                👤 Temel Bilgiler
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        name="cardName"
                                        label="Kartvizit Adı"
                                        value={formData.cardName}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="name"
                                        label="İsim Soyisim"
                                        value={formData.name}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="title"
                                        label="Ünvan"
                                        value={formData.title}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="company"
                                        label="Şirket"
                                        value={formData.company}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="bio"
                                        label="Biyografi / Açıklama"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        placeholder="Kendinizi ve işinizi kısa bir şekilde tanıtın..."
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* İletişim Bilgileri */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                                📞 İletişim Bilgileri
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="phone"
                                        label="Telefon"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="email"
                                        label="E-posta"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="website"
                                        label="Website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        placeholder="https://www.example.com"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="address"
                                        label="Adres"
                                        value={formData.address}
                                        onChange={handleChange}
                                        multiline
                                        rows={2}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Sosyal Medya */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                                📱 Sosyal Medya (İsteğe Bağlı)
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="linkedinUrl"
                                        fullWidth
                                        label="LinkedIn Profil URL"
                                        value={formData.linkedinUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LinkedInIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="twitterUrl"
                                        fullWidth
                                        label="Twitter (X) Profil URL"
                                        value={formData.twitterUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TwitterIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="instagramUrl"
                                        fullWidth
                                        label="Instagram Profil URL"
                                        value={formData.instagramUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <InstagramIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Pazaryeri Alanları */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                                🛒 Pazaryeri Linkleri (İsteğe Bağlı)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Türkiye'deki popüler pazaryerlerindeki mağaza linklerini ekleyebilirsiniz
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        name="trendyolUrl"
                                        fullWidth
                                        label="Trendyol Mağaza URL"
                                        value={formData.trendyolUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="Hepsiburada Mağaza URL"
                                        value={formData.hepsiburadaUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="Çiçeksepeti Mağaza URL"
                                        value={formData.ciceksepeti}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="Sahibinden Profil URL"
                                        value={formData.sahibindenUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="Hepsiemlak Profil URL"
                                        value={formData.hepsiemlakUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="GittiGidiyor Mağaza URL"
                                        value={formData.gittigidiyorUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="N11 Mağaza URL"
                                        value={formData.n11Url}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="Amazon Türkiye Mağaza URL"
                                        value={formData.amazonTrUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="Getir Mağaza URL"
                                        value={formData.getirUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        label="Yemeksepeti Restoran URL"
                                        value={formData.yemeksepetiUrl}
                                        onChange={handleChange}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                            </Grid>
                        </Box>

                        {/* Konfigürasyon */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                                ⚙️ Konfigürasyon
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Şirket</InputLabel>
                                        <Select
                                            name="companyId"
                                            value={formData.companyId}
                                            onChange={handleChange}
                                            label="Şirket"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="">Şirket Seçin</MenuItem>
                                            {companies.map(company => (
                                                <MenuItem key={company.id} value={company.id}>
                                                    {company.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Kullanıcı</InputLabel>
                                        <Select
                                            name="userId"
                                            value={formData.userId}
                                            onChange={handleChange}
                                            label="Kullanıcı"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value="">Kullanıcı Seçin</MenuItem>
                                            {users.map(user => (
                                                <MenuItem key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="customSlug"
                                        label="Özel URL"
                                        value={formData.customSlug}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        helperText="Boş bırakılırsa otomatik oluşturulur"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Tema</InputLabel>
                                        <Select
                                            value={formData.theme}
                                            label="Tema"
                                            name="theme"
                                            onChange={handleChange}
                                            sx={{ borderRadius: 2 }}
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
                                    <Box sx={{ 
                                        p: 2, 
                                        backgroundColor: 'grey.50', 
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.status}
                                                    onChange={handleChange}
                                                    name="status"
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        Kartvizit Aktif mi?
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Kartvizit hemen yayınlansın mı?
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Tema Önizlemesi */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                                👁️ Tema Önizlemesi
                            </Typography>
                            <ThemePreview formData={formData} />
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/admin/cards')}
                                disabled={loading}
                                sx={{ minWidth: 120, borderRadius: 2 }}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                sx={{ minWidth: 150, borderRadius: 2 }}
                                size="large"
                            >
                                {loading ? <CircularProgress size={24} /> : 'Kartvizit Oluştur'}
                            </Button>
                        </Box>
                    </form>
                )}

                {/* Tab 1: Banka Hesapları */}
                {tabValue === 1 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Banka Hesap Bilgileri
                        </Typography>
                        <List>
                            {bankAccounts.map((account, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={account.bankName}
                                        secondary={`${account.accountName} - ${account.iban}`}
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
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => handleBankDialogOpen()}
                            sx={{ mt: 1 }}
                        >
                            Banka Hesabı Ekle
                        </Button>
                        {bankAccounts.length > 0 && (
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Kartvizit Oluştur'}
                            </Button>
                        )}
                    </Box>
                )}

                {/* Banka Hesabı Ekleme/Düzenleme Modalı */}
                <Dialog open={bankDialogOpen} onClose={handleBankDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingBankAccount ? 'Banka Hesabını Düzenle' : 'Yeni Banka Hesabı Ekle'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Banka</InputLabel>
                                <Select
                                    value={bankFormData.bankName}
                                    onChange={handleBankFormChange}
                                    name="bankName"
                                    label="Banka"
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
                                sx={{ mb: 2 }}
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
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleBankDialogClose}>İptal</Button>
                        <Button onClick={handleBankFormSubmit} variant="contained">
                            {editingBankAccount ? 'Güncelle' : 'Ekle'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}

export default AdminCardCreatePage; 