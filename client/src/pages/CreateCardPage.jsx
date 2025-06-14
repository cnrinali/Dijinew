import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import cardService from '../services/cardService';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext.jsx';
import { API_ENDPOINTS } from '../config/api.js';
import ThemePreview from '../components/ThemePreview';
import { TURKISH_BANKS, formatIban, validateTurkishIban } from '../constants/turkishBanks';

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
        profileImage: null,
        logoImage: null,
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        github: '',
        bankAccounts: []
    });
    const [loading, setLoading] = useState(false);
    const [profileImageLoading, setProfileImageLoading] = useState(false);
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [tabValue, setTabValue] = useState(0);
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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const onChange = (e) => {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            setFormData((prevState) => ({ ...prevState, [e.target.name]: file }));
        } else {
            setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
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
            if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });

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
        <Container component="main" maxWidth="md">
            <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4, mb: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Yeni Kartvizit Oluştur
                </Typography>
                
                {uploadError && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {`Dosya yükleme hatası: ${uploadError}`}
                    </Alert>
                )}

                {/* Tab Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Kart oluşturma sekmeleri">
                        <Tab label="Kart Bilgileri" />
                        <Tab label="Banka Hesapları" />
                    </Tabs>
                </Box>

                {/* Tab 0: Kart Bilgileri */}
                {tabValue === 0 && (
                    <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6" gutterBottom>Profil Fotoğrafı</Typography>
                                <Avatar
                                    src={formData.profileImageUrl || '/placeholder-avatar.png'}
                                    sx={{ width: 150, height: 150, mb: 2, border: '1px solid lightgrey' }}
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
                                    startIcon={profileImageLoading ? <CircularProgress size={20} /> : null}
                                >
                                    {profileImageLoading ? 'Yükleniyor...' : (formData.profileImageUrl ? 'Değiştir' : 'Profil Resmi Seç')}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { xs: 2, sm: 0 } }}>
                                <Typography variant="h6" gutterBottom>Kapak Fotoğrafı</Typography>
                                <CardMedia
                                    component="img"
                                    image={formData.coverImageUrl || '/placeholder-cover.png'}
                                    alt="Kapak Fotoğrafı Önizlemesi"
                                    sx={{ width: '100%', height: 150, objectFit: 'cover', mb: 2, borderRadius: 1, border: '1px solid lightgrey' }}
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
                                    startIcon={coverImageLoading ? <CircularProgress size={20} /> : null}
                                >
                                    {coverImageLoading ? 'Yükleniyor...' : (formData.coverImageUrl ? 'Kapak Fotoğrafını Değiştir' : 'Kapak Fotoğrafı Seç')}
                                </Button>
                            </Grid>

                            <Grid xs={12} sm={6}>
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
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    fullWidth
                                    id="name"
                                    label="İsim Soyisim"
                                    value={formData.name}
                                    onChange={onChange}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="title"
                                    fullWidth
                                    id="title"
                                    label="Ünvan"
                                    value={formData.title}
                                    onChange={onChange}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="company"
                                    fullWidth
                                    id="company"
                                    label="Şirket"
                                    value={formData.company}
                                    onChange={onChange}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="phone"
                                    fullWidth
                                    id="phone"
                                    label="Telefon"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={onChange}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="email"
                                    fullWidth
                                    id="email"
                                    label="E-posta"
                                    type="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    name="website"
                                    fullWidth
                                    id="website"
                                    label="Web Sitesi"
                                    type="url"
                                    value={formData.website}
                                    onChange={onChange}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid xs={12}>
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
                                />
                            </Grid>
                            <Grid xs={12}>
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
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="customSlug"
                                    fullWidth
                                    id="customSlug"
                                    label="Özel URL"
                                    value={formData.customSlug}
                                    onChange={onChange}
                                    disabled={loading}
                                    helperText="Boş bırakırsanız otomatik oluşturulur. Sadece küçük harf, rakam ve tire kullanın."
                                />
                            </Grid>
                            <Grid xs={12} sm={6}>
                                <FormControl fullWidth disabled={loading}>
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
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Sosyal Medya (isteğe bağlı)</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
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
                                    disabled={loading}
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
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <InstagramIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <ThemePreview formData={formData} />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Kartvizit Oluştur'}
                        </Button>
                    </Box>
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
                                onClick={onSubmit}
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
        </Container>
    );
}

export default CreateCardPage; 