import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    InputAdornment,
    Avatar,
    Tabs,
    Tab,
    CircularProgress
} from '@mui/material';
import {
    AccountBalance as AccountBalanceIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LinkedIn as LinkedInIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    Storefront as StorefrontIcon
} from '@mui/icons-material';
import authService from '../services/authService';
import cardService from '../services/cardService';
import wizardService from '../services/wizardService';
import { TURKISH_BANKS, formatIban, validateTurkishIban } from '../constants/turkishBanks';
import ThemePreview from './ThemePreview';

const steps = [
    'Kullanıcı Bilgileri',
    'Kişisel Bilgiler',
    'İletişim Bilgileri',
    'Sosyal Medya',
    'Banka Hesapları',
    'Tema Seçimi'
];

export default function CardWizard() {
    const [activeStep, setActiveStep] = useState(0);
    const [searchParams] = useSearchParams();
    const { cardSlug } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);

    // Token doğrulama state'leri
    const [tokenValidating, setTokenValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [tokenData, setTokenData] = useState(null);

    // Sihirbazın hangi tipte olduğunu belirle (admin, corporate, user)
    const wizardType = searchParams.get('type') || 'user';
    const token = searchParams.get('token');

    // Form verileri
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: wizardType === 'corporate' ? 'corporate' : 'user',
        companyName: wizardType === 'corporate' ? '' : undefined
    });

    const [cardData, setCardData] = useState({
        cardName: 'Kartvizitim',
        name: '',
        title: '',
        company: '',
        bio: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        theme: 'light',
        linkedinUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        trendyolUrl: '',
        hepsiburadaUrl: '',
        bankAccounts: []
    });

    // Banka hesap yönetimi
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankDialogOpen, setBankDialogOpen] = useState(false);
    const [editingBankAccount, setEditingBankAccount] = useState(null);
    const [bankFormData, setBankFormData] = useState({
        bankName: '',
        iban: '',
        accountName: ''
    });

    // Token doğrulama useEffect (Simple Wizard için)
    useEffect(() => {
        const validateToken = async () => {
            if (!token || !cardSlug) {
                // Token veya cardSlug yok - hatalı link
                showNotification('Geçersiz sihirbaz linki. Token veya kart ID bulunamadı.', 'error');
                setTokenValidating(false);
                setTokenValid(false);
                return;
            }

            try {
                setTokenValidating(true);
                // Simple wizard API'sini kullan - Merkezi config
                const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001'}/api/simple-wizard/validate/${token}`);
                const data = await response.json();
                
                if (data.success) {
                    setTokenValid(true);
                    setTokenData(data.data);
                    
                    // Token ile kart bilgilerini yükle
                    await loadCardData(token);
                    
                    showNotification('Sihirbaz linki geçerli. Kart bilgilerinizi girebilirsiniz.', 'success');
                } else {
                    setTokenValid(false);
                    showNotification(data.message || 'Token doğrulanamadı.', 'error');
                }
            } catch (error) {
                console.error('Token doğrulama hatası:', error);
                setTokenValid(false);
                showNotification('Token doğrulanırken hata oluştu.', 'error');
            } finally {
                setTokenValidating(false);
            }
        };

        validateToken();
    }, [token, cardSlug, showNotification]);

    // Kartın sahipliğini güncelle
    const updateCardOwnership = useCallback(async (token, newUserId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001'}/api/simple-wizard/update-ownership/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newUserId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('Kart sahipliği güncellendi:', newUserId);
            } else {
                console.warn('Kart sahipliği güncellenemedi:', data.message);
            }
        } catch (error) {
            console.error('Kart sahipliği güncelleme hatası:', error);
        }
    }, []);

    // Token ile kart verilerini yükle
    const loadCardData = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001'}/api/simple-wizard/card/${token}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                const card = data.data;
                setCardData(prev => ({
                    ...prev,
                    name: card.name || card.cardName || prev.name,
                    email: card.email || prev.email,
                    phone: card.phone || prev.phone,
                    website: card.website || prev.website,
                    address: card.address || prev.address,
                    bio: card.bio || prev.bio,
                    company: card.company || prev.company,
                    title: card.title || prev.title,
                    theme: card.theme || prev.theme
                }));
                console.log('Kart verileri yüklendi:', card);
            }
        } catch (error) {
            console.error('Kart verileri yüklenirken hata:', error);
        }
    };



    // Email kontrolü ve kullanıcı kaydı/girişi
    const handleUserRegistration = async () => {
        if (userData.password !== userData.confirmPassword) {
            showNotification('Şifreler eşleşmiyor', 'error');
            return false;
        }

        try {
            setLoading(true);
            
            // Önce email ile kullanıcının var olup olmadığını kontrol et (sunucu tarafında)
            try {
                // Register dene - eğer email zaten varsa hata alırız
                const registrationData = {
                    ...userData,
                    role: 'user' // Wizard'dan gelen kullanıcılar individual user olacak
                };
                const response = await authService.register(registrationData);
                
                if (response.success || response.token) {
                    // Kayıt başarılı - otomatik giriş yap
                    console.log('Register başarılı, login yapılıyor...', response);
                    
                    try {
                        const loginResult = await login(userData.email, userData.password);
                        console.log('Login sonucu:', loginResult);
                        
                        // Kartın sahipliğini yeni kullanıcıya aktar
                        if (loginResult && loginResult.id) {
                            await updateCardOwnership(token, loginResult.id);
                        }
                        
                        // Kullanıcı bilgilerini kart verilerine aktar
                        setCardData(prev => ({
                            ...prev,
                            name: userData.name,
                            email: userData.email,
                            company: userData.companyName || prev.company
                        }));
                        
                        showNotification('Üyelik başarıyla oluşturuldu ve giriş yapıldı!', 'success');
                        return true;
                        
                    } catch (loginErr) {
                        console.error('Login hatası:', loginErr);
                        showNotification('Kayıt başarılı ama giriş yapılamadı. Lütfen manuel giriş yapın.', 'warning');
                        return false;
                    }
                }
                
            } catch (registerError) {
                // Kayıt başarısız - muhtemelen email zaten var
                if (registerError.message && registerError.message.includes('zaten kullanımda')) {
                    // Email zaten var - login dene
                    try {
                        const loginResponse = await authService.login({
                            email: userData.email,
                            password: userData.password
                        });
                        
                        if (loginResponse.success || loginResponse.token) {
                            // Login başarılı - useAuth login'i çağır
                            console.log('AuthService login başarılı, useAuth login yapılıyor...', loginResponse);
                            
                            try {
                                const authLoginResult = await login(userData.email, userData.password);
                                console.log('UseAuth login sonucu:', authLoginResult);
                                
                                // Kartın sahipliğini mevcut kullanıcıya aktar
                                if (authLoginResult && authLoginResult.id) {
                                    await updateCardOwnership(token, authLoginResult.id);
                                }
                                
                                // Kullanıcı bilgilerini kart verilerine aktar
                                setCardData(prev => ({
                                    ...prev,
                                    name: userData.name,
                                    email: userData.email,
                                    company: userData.companyName || prev.company
                                }));
                                
                                showNotification('Giriş başarılı! Kart bilgilerinizi düzenleyebilirsiniz.', 'success');
                                return true;
                                
                            } catch (authLoginErr) {
                                console.error('UseAuth login hatası:', authLoginErr);
                                showNotification('Giriş bilgileri doğru ama oturum açma hatası oluştu.', 'error');
                                return false;
                            }
                        }
                    } catch (loginError) {
                        throw new Error('Email zaten kayıtlı ama şifre yanlış. Lütfen şifrenizi kontrol edin.');
                    }
                } else {
                    // Diğer register hatası
                    throw registerError;
                }
            }
        } catch (error) {
            if (error.message && error.message.includes('zaten kullanımda')) {
                showNotification('Bu email zaten kayıtlı. Lütfen şifrenizi kontrol edin veya şifre sıfırlama kullanın.', 'warning');
            } else {
                showNotification(error.message || 'İşlem sırasında hata oluştu', 'error');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Final kart güncelleme (Simple wizard ile)
    const handleFinalSubmit = async () => {
        try {
            setLoading(true);
            
            const finalCardData = {
                ...cardData,
                bankAccounts: bankAccounts,
                isActive: true // Kartı aktif hale getir
            };

            // Simple wizard API ile kartı güncelle
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001'}/api/simple-wizard/card/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalCardData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Token'ı kullanıldı olarak işaretle
                try {
                    const markUsedResponse = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001'}/api/simple-wizard/use/${token}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    const markData = await markUsedResponse.json();
                    console.log('Token kullanıldı olarak işaretlendi:', markData);
                } catch (tokenError) {
                    console.warn('Token kullanıldı olarak işaretlenirken hata:', tokenError);
                    // Bu hata kartvizit oluşturulmasını engellemez
                }
                
                showNotification('Kartvizit başarıyla tamamlandı ve aktifleştirildi!', 'success');
                // Kullanıcı giriş yapmış olduğundan uygun yere yönlendir
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    if (user.role === 'admin') {
                        navigate('/admin/cards');
                    } else if (user.role === 'corporate') {
                        navigate('/corporate/cards');
                    } else {
                        navigate('/cards');
                    }
                } else {
                    navigate('/cards');
                }
            }
        } catch (error) {
            showNotification(error.message || 'Kartvizit tamamlanırken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Step ilerletme
    const handleNext = async () => {
        if (activeStep === 0) {
            // İlk adımda kullanıcı kaydı yap
            const success = await handleUserRegistration();
            if (!success) return;
        }

        if (activeStep === steps.length - 1) {
            // Son adımda kartı kaydet
            await handleFinalSubmit();
        } else {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    // Banka hesap yönetimi
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

    const handleBankFormSubmit = () => {
        if (!bankFormData.bankName || !bankFormData.iban || !bankFormData.accountName) {
            showNotification('Lütfen tüm alanları doldurun', 'error');
            return;
        }

        if (!validateTurkishIban(bankFormData.iban)) {
            showNotification('Geçersiz IBAN formatı', 'error');
            return;
        }

        const newAccount = { ...bankFormData };
        
        if (editingBankAccount) {
            const updatedAccounts = bankAccounts.map(account => 
                account === editingBankAccount ? newAccount : account
            );
            setBankAccounts(updatedAccounts);
            setCardData(prev => ({ ...prev, bankAccounts: updatedAccounts }));
        } else {
            const newAccounts = [...bankAccounts, newAccount];
            setBankAccounts(newAccounts);
            setCardData(prev => ({ ...prev, bankAccounts: newAccounts }));
        }

        setBankDialogOpen(false);
        showNotification(editingBankAccount ? 'Banka hesabı güncellendi' : 'Banka hesabı eklendi', 'success');
    };

    // Step içerikleri
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Hoş Geldiniz! Önce üyelik oluşturalım
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Ad Soyad"
                                    value={userData.name}
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="E-posta"
                                    value={userData.email}
                                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </Grid>
                            {wizardType === 'corporate' && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Şirket Adı"
                                        value={userData.companyName}
                                        onChange={(e) => setUserData(prev => ({ ...prev, companyName: e.target.value }))}
                                        required
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Şifre"
                                    value={userData.password}
                                    onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Şifre Tekrar"
                                    value={userData.confirmPassword}
                                    onChange={(e) => setUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Kişisel Bilgileriniz
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Kart Adı"
                                    value={cardData.cardName}
                                    onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ad Soyad"
                                    value={cardData.name}
                                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ünvan/Pozisyon"
                                    value={cardData.title}
                                    onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Şirket"
                                    value={cardData.company}
                                    onChange={(e) => setCardData(prev => ({ ...prev, company: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Hakkımda"
                                    value={cardData.bio}
                                    onChange={(e) => setCardData(prev => ({ ...prev, bio: e.target.value }))}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            İletişim Bilgileri
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefon"
                                    value={cardData.phone}
                                    onChange={(e) => setCardData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="E-posta"
                                    value={cardData.email}
                                    onChange={(e) => setCardData(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    value={cardData.website}
                                    onChange={(e) => setCardData(prev => ({ ...prev, website: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Adres"
                                    value={cardData.address}
                                    onChange={(e) => setCardData(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 3:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Sosyal Medya ve Pazaryeri Linkleri
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="LinkedIn URL"
                                    value={cardData.linkedinUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LinkedInIcon /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Twitter URL"
                                    value={cardData.twitterUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><TwitterIcon /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instagram URL"
                                    value={cardData.instagramUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><InstagramIcon /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Trendyol URL"
                                    value={cardData.trendyolUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, trendyolUrl: e.target.value }))}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><StorefrontIcon /></InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 4:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Banka Hesap Bilgileri
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => handleBankDialogOpen()}
                            >
                                Banka Hesabı Ekle
                            </Button>
                        </Box>

                        <List>
                            {bankAccounts.map((account, index) => (
                                <ListItem key={index}>
                                    <Avatar sx={{ mr: 2 }}>
                                        <AccountBalanceIcon />
                                    </Avatar>
                                    <ListItemText
                                        primary={account.bankName}
                                        secondary={`${account.accountName} - ${account.iban}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => handleBankDialogOpen(account)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => {
                                            const newAccounts = bankAccounts.filter((_, i) => i !== index);
                                            setBankAccounts(newAccounts);
                                            setCardData(prev => ({ ...prev, bankAccounts: newAccounts }));
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                );

            case 5:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Tema Seçimi
                        </Typography>
                        
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Tema</InputLabel>
                            <Select
                                value={cardData.theme}
                                onChange={(e) => setCardData(prev => ({ ...prev, theme: e.target.value }))}
                            >
                                <MenuItem value="light">Açık Tema</MenuItem>
                                <MenuItem value="dark">Koyu Tema</MenuItem>
                                <MenuItem value="gradient">Gradyan Tema</MenuItem>
                                <MenuItem value="minimal">Minimal Tema</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Tema Önizlemesi
                            </Typography>
                            <ThemePreview 
                                formData={cardData}
                                theme={cardData.theme}
                            />
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    // Token doğrulanıyor ise loading göster
    if (tokenValidating) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6">
                        Sihirbaz linki doğrulanıyor...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    // Token geçersiz ise hata göster
    if (!tokenValid) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Geçersiz Sihirbaz Linki
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Bu link geçersiz, süresi dolmuş veya daha önce kullanılmış olabilir.
                    </Typography>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Ana Sayfaya Dön
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Kartvizit Sihirbazı
                    <Chip 
                        label={tokenData?.type === 'corporate' ? 'Kurumsal' : tokenData?.type === 'admin' ? 'Admin' : 'Bireysel'}
                        color="primary"
                        sx={{ ml: 2 }}
                    />
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {renderStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Geri
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={loading}
                    >
                        {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                        {activeStep === steps.length - 1 ? 'Kartı Oluştur' : 'İleri'}
                    </Button>
                </Box>

                {/* Banka Hesabı Dialog */}
                <Dialog open={bankDialogOpen} onClose={() => setBankDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingBankAccount ? 'Banka Hesabını Düzenle' : 'Banka Hesabı Ekle'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Banka</InputLabel>
                                    <Select
                                        value={bankFormData.bankName}
                                        onChange={(e) => setBankFormData(prev => ({ ...prev, bankName: e.target.value }))}
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
                                    fullWidth
                                    label="Hesap Sahibi"
                                    value={bankFormData.accountName}
                                    onChange={(e) => setBankFormData(prev => ({ ...prev, accountName: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="IBAN"
                                    value={bankFormData.iban}
                                    onChange={(e) => setBankFormData(prev => ({ 
                                        ...prev, 
                                        iban: formatIban(e.target.value) 
                                    }))}
                                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setBankDialogOpen(false)}>İptal</Button>
                        <Button variant="contained" onClick={handleBankFormSubmit}>
                            {editingBankAccount ? 'Güncelle' : 'Ekle'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
} 