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
        <Container component="main" maxWidth="md">
            <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4, mb: 4 }}>
                <Typography variant="h5" component="h1" align="center" gutterBottom>
                    Yeni Kartvizit Oluştur
                </Typography>

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
                                    required
                                    name="cardName"
                                    label="Kartvizit Adı"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    label="İsim Soyisim"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="title"
                                    label="Ünvan"
                                    value={formData.title}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="company"
                                    label="Şirket"
                                    value={formData.company}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="phone"
                                    label="Telefon"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="email"
                                    label="E-posta"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    name="website"
                                    label="Website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    name="address"
                                    label="Adres"
                                    value={formData.address}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    name="bio"
                                    label="Biyografi"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    name="customSlug"
                                    label="Özel URL"
                                    value={formData.customSlug}
                                    onChange={handleChange}
                                    fullWidth
                                    helperText="Boş bırakılırsa otomatik oluşturulur"
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="theme-select-label">Tema</InputLabel>
                                    <Select
                                        labelId="theme-select-label"
                                        id="theme-select"
                                        value={formData.theme}
                                        label="Tema"
                                        name="theme"
                                        onChange={handleChange}
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

                            <Grid xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Şirket</InputLabel>
                                    <Select
                                        name="companyId"
                                        value={formData.companyId}
                                        onChange={handleChange}
                                        label="Şirket"
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

                            <Grid xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Kullanıcı</InputLabel>
                                    <Select
                                        name="userId"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        label="Kullanıcı"
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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

                            <Grid xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.status}
                                            onChange={handleChange}
                                            name="status"
                                        />
                                    }
                                    label="Kartvizit Aktif mi?"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <ThemePreview formData={formData} />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Kartvizit Oluştur'}
                        </Button>
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
        </Container>
    );
}

export default AdminCardCreatePage; 