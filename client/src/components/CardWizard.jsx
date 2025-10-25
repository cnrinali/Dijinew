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
    CircularProgress,
    Checkbox,
    FormControlLabel
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
import { TURKISH_BANKS, formatIban, validateTurkishIban } from '../constants/turkishBanks';
import ThemePreview from './ThemePreview';
import { KVKK_TEXTS } from '../constants/kvkkTexts';

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
    const { login, isAuthenticated } = useAuth();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);

    // Kart yükleme state'leri
    const [cardLoading, setCardLoading] = useState(true);
    const [cardLoaded, setCardLoaded] = useState(false);
    
    // Kullanıcı kayıt durumu kontrolü
    const [userRegistered, setUserRegistered] = useState(false);

    // Sihirbazın hangi tipte olduğunu belirle (admin, corporate, user)
    const wizardType = searchParams.get('type') || 'user';

    // Form verileri
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: wizardType === 'corporate' ? 'corporate' : 'user',
        companyName: wizardType === 'corporate' ? '' : undefined
    });

    // KVKK onayları
    const [kvkkConsents, setKvkkConsents] = useState({
        privacyPolicy: false,
        dataProcessing: false,
        marketingConsent: false
    });

    // KVKK Modal state
    const [kvkkModalOpen, setKvkkModalOpen] = useState(false);
    const [activeKvkkType, setActiveKvkkType] = useState(null);
    const [kvkkScrolledToBottom, setKvkkScrolledToBottom] = useState(false);

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

    // KVKK Modal handlers
    const handleKvkkClick = (type) => {
        setActiveKvkkType(type);
        setKvkkScrolledToBottom(false);
        setKvkkModalOpen(true);
    };

    const handleKvkkScroll = (e) => {
        const element = e.target;
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
        if (isAtBottom && !kvkkScrolledToBottom) {
            setKvkkScrolledToBottom(true);
        }
    };

    const handleKvkkAccept = () => {
        if (!kvkkScrolledToBottom) {
            showNotification('Lütfen metni sonuna kadar okuyun.', 'warning');
            return;
        }
        
        setKvkkConsents(prev => ({
            ...prev,
            [activeKvkkType]: true
        }));
        setKvkkModalOpen(false);
        setActiveKvkkType(null);
        setKvkkScrolledToBottom(false);
    };

    const handleKvkkReject = () => {
        setKvkkConsents(prev => ({
            ...prev,
            [activeKvkkType]: false
        }));
        setKvkkModalOpen(false);
        setActiveKvkkType(null);
        setKvkkScrolledToBottom(false);
    };

    // Kart bilgilerini yükle (Herkese açık sihirbaz için)
    useEffect(() => {
        const loadCardData = async () => {
            if (!cardSlug) {
                showNotification('Geçersiz sihirbaz linki. Kart ID bulunamadı.', 'error');
                setCardLoading(false);
                setCardLoaded(false);
                return;
            }

            try {
                setCardLoading(true);
                
                // Kart bilgilerini cardSlug ile yükle (token gerektirmez)
                const apiBaseUrl = window.location.hostname === 'localhost' 
                    ? 'http://localhost:5001' 
                    : 'https://api.dijinew.com';
                const response = await fetch(`${apiBaseUrl}/api/public/${cardSlug}`);
                const data = await response.json();
                
                if (data && data.id) {
                    setCardLoaded(true);
                    
                    // Kart bilgilerini form'a yükle
                    setCardData(prev => ({
                        ...prev,
                        cardName: data.cardName || 'Kartvizitim',
                        name: data.name || '',
                        title: data.title || '',
                        company: data.company || '',
                        bio: data.bio || '',
                        phone: data.phone || '',
                        email: data.email || '',
                        website: data.website || '',
                        address: data.address || '',
                        theme: data.theme || 'light',
                        linkedinUrl: data.linkedinUrl || '',
                        twitterUrl: data.twitterUrl || '',
                        instagramUrl: data.instagramUrl || '',
                        trendyolUrl: data.trendyolUrl || '',
                        hepsiburadaUrl: data.hepsiburadaUrl || ''
                    }));
                    
                    showNotification('Sihirbaz hazır. Kart bilgilerinizi girebilirsiniz.', 'success');
                } else {
                    setCardLoaded(false);
                    showNotification('Kart bulunamadı veya erişim izni yok.', 'error');
                }
            } catch (error) {
                console.error('Kart yükleme hatası:', error);
                setCardLoaded(false);
                showNotification('Kart bilgileri yüklenirken hata oluştu.', 'error');
            } finally {
                setCardLoading(false);
            }
        };

        loadCardData();
    }, [cardSlug, showNotification]);

    // Kartın sahipliğini güncelle (cardSlug ile)
    const updateCardOwnership = useCallback(async (cardSlug, newUserId) => {
        try {
            const apiBaseUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:5001' 
                : 'https://api.dijinew.com';
            const response = await fetch(`${apiBaseUrl}/api/cards/slug/${cardSlug}/ownership`, {
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
                            await updateCardOwnership(cardSlug, loginResult.id);
                        }
                        
                        // Kart sahipliği güncellendi
                        
                        // Kullanıcı bilgilerini kart verilerine aktar
                        setCardData(prev => ({
                            ...prev,
                            name: userData.name,
                            email: userData.email,
                            company: userData.companyName || prev.company
                        }));
                        
                        // Kullanıcı başarıyla kaydoldu olarak işaretle
                        setUserRegistered(true);
                        
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
                                    await updateCardOwnership(cardSlug, authLoginResult.id);
                                }
                                
                                // Kart sahipliği güncellendi
                                
                                // Kullanıcı bilgilerini kart verilerine aktar
                                setCardData(prev => ({
                                    ...prev,
                                    name: userData.name,
                                    email: userData.email,
                                    company: userData.companyName || prev.company
                                }));
                                
                                // Kullanıcı başarıyla giriş yaptı olarak işaretle
                                setUserRegistered(true);
                                
                                showNotification('Giriş başarılı! Kart bilgilerinizi düzenleyebilirsiniz.', 'success');
                                return true;
                                
                            } catch (authLoginErr) {
                                console.error('UseAuth login hatası:', authLoginErr);
                                showNotification('Giriş bilgileri doğru ama oturum açma hatası oluştu.', 'error');
                                return false;
                            }
                        }
                    } catch {
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
            const apiBaseUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:5001' 
                : 'https://api.dijinew.com';
            const response = await fetch(`${apiBaseUrl}/api/cards/slug/${cardSlug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalCardData)
            });
            
            const data = await response.json();
            
            if (data.success) {
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
            // Eğer kullanıcı zaten kayıt olmuşsa veya giriş yapmışsa kayıt işlemini atla
            if (userRegistered || isAuthenticated) {
                // Kullanıcı zaten kayıt olmuş veya giriş yapmış, bir sonraki adıma geç
                console.log('Kullanıcı zaten kayıt olmuş/giriş yapmış, kayıt atlanıyor');
            } else {
                // KVKK onayları kontrolü
                if (!kvkkConsents.privacyPolicy || !kvkkConsents.dataProcessing) {
                    showNotification('Devam etmek için zorunlu onayları kabul etmelisiniz.', 'error');
                    return;
                }
                
                // İlk adımda kullanıcı kaydı yap
                const success = await handleUserRegistration();
                if (!success) return;
            }
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
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1a1a1a',
                                mb: 1.5,
                                textAlign: 'center'
                            }}
                        >
                            {userRegistered ? '✅ Kayıt Tamamlandı!' : 'Hoş Geldiniz! Önce üyelik oluşturalım'}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#666',
                                mb: 2.5,
                                textAlign: 'center',
                                fontSize: '0.95rem'
                            }}
                        >
                            {userRegistered 
                                ? 'Kayıt işleminiz başarıyla tamamlandı. Devam etmek için İleri butonuna tıklayın.' 
                                : 'Dijital kartvizitinizi oluşturmak için birkaç bilgiye ihtiyacımız var'
                            }
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Ad Soyad"
                                    value={userData.name}
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    disabled={userRegistered}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
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
                                    disabled={userRegistered}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
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
                                        disabled={userRegistered}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
                                        }}
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
                                    disabled={userRegistered}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
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
                                    disabled={userRegistered}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            
                            {/* KVKK Onayları */}
                            <Grid item xs={12}>
                                <Box 
                                    sx={{ 
                                        mt: 2, 
                                        p: 3, 
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 2,
                                        border: '2px solid #e0e0e0'
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            mb: 2, 
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Kişisel Verilerin Korunması (KVKK)
                                    </Typography>
                                    
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={kvkkConsents.privacyPolicy}
                                                onChange={() => handleKvkkClick('privacyPolicy')}
                                                disabled={userRegistered}
                                                sx={{
                                                    color: '#1976d2',
                                                    '&.Mui-checked': {
                                                        color: '#1976d2',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ fontSize: '0.95rem' }}>
                                                <span style={{ color: '#d32f2f', fontWeight: 600 }}>*</span>{' '}
                                                <strong>Gizlilik Politikası</strong> ve <strong>Kullanım Koşullarını</strong> okudum, kabul ediyorum.
                                            </Typography>
                                        }
                                        sx={{ mb: 1.5 }}
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={kvkkConsents.dataProcessing}
                                                onChange={() => handleKvkkClick('dataProcessing')}
                                                disabled={userRegistered}
                                                sx={{
                                                    color: '#1976d2',
                                                    '&.Mui-checked': {
                                                        color: '#1976d2',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ fontSize: '0.95rem' }}>
                                                <span style={{ color: '#d32f2f', fontWeight: 600 }}>*</span>{' '}
                                                Kişisel verilerimin, <strong>KVKK Aydınlatma Metni</strong> kapsamında işlenmesine ve saklanmasına onay veriyorum.
                                            </Typography>
                                        }
                                        sx={{ mb: 1.5 }}
                                    />
                                    
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={kvkkConsents.marketingConsent}
                                                onChange={(e) => setKvkkConsents(prev => ({ 
                                                    ...prev, 
                                                    marketingConsent: e.target.checked 
                                                }))}
                                                disabled={userRegistered}
                                                sx={{
                                                    color: '#1976d2',
                                                    '&.Mui-checked': {
                                                        color: '#1976d2',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ fontSize: '0.95rem' }}>
                                                Kampanya, duyuru ve tanıtım amaçlı <strong>ticari elektronik iletiler</strong> almak istiyorum.
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1a1a1a',
                                mb: 1.5,
                                textAlign: 'center'
                            }}
                        >
                            Kişisel Bilgileriniz
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#666',
                                mb: 2.5,
                                textAlign: 'center',
                                fontSize: '0.95rem'
                            }}
                        >
                            Kartvizitinizde görünecek bilgilerinizi girin
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Kart Adı"
                                    value={cardData.cardName}
                                    onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ad Soyad"
                                    value={cardData.name}
                                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ünvan/Pozisyon"
                                    value={cardData.title}
                                    onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Şirket"
                                    value={cardData.company}
                                    onChange={(e) => setCardData(prev => ({ ...prev, company: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
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
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1a1a1a',
                                mb: 1.5,
                                textAlign: 'center'
                            }}
                        >
                            İletişim Bilgileri
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#666',
                                mb: 2.5,
                                textAlign: 'center',
                                fontSize: '0.95rem'
                            }}
                        >
                            İletişim bilgilerinizi ekleyin
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefon"
                                    value={cardData.phone}
                                    onChange={(e) => setCardData(prev => ({ ...prev, phone: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="E-posta"
                                    value={cardData.email}
                                    onChange={(e) => setCardData(prev => ({ ...prev, email: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    value={cardData.website}
                                    onChange={(e) => setCardData(prev => ({ ...prev, website: e.target.value }))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
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
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 3:
                return (
                    <Box>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1a1a1a',
                                mb: 1.5,
                                textAlign: 'center'
                            }}
                        >
                            Sosyal Medya
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#666',
                                mb: 2.5,
                                textAlign: 'center',
                                fontSize: '0.95rem'
                            }}
                        >
                            Sosyal medya hesaplarınızı ve pazaryeri linklerinizi ekleyin
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="LinkedIn URL"
                                    value={cardData.linkedinUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LinkedInIcon color="primary" /></InputAdornment>
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Twitter URL"
                                    value={cardData.twitterUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><TwitterIcon color="primary" /></InputAdornment>
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instagram URL"
                                    value={cardData.instagramUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><InstagramIcon color="primary" /></InputAdornment>
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Trendyol URL"
                                    value={cardData.trendyolUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, trendyolUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><StorefrontIcon color="primary" /></InputAdornment>
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 4:
                return (
                    <Box>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1a1a1a',
                                mb: 1.5,
                                textAlign: 'center'
                            }}
                        >
                            Banka Hesapları
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#666',
                                mb: 2.5,
                                textAlign: 'center',
                                fontSize: '0.95rem'
                            }}
                        >
                            Banka hesap bilgilerinizi ekleyin (opsiyonel)
                        </Typography>
                        
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{ fontSize: '1.5rem' }} />}
                                onClick={() => handleBankDialogOpen()}
                                size="large"
                                sx={{
                                    px: { xs: 4, sm: 6 },
                                    py: 2,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    fontWeight: 600,
                                    minWidth: { xs: '100%', sm: '300px' },
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Banka Hesabı Ekle
                            </Button>
                        </Box>

                        <List sx={{ 
                            backgroundColor: 'grey.50',
                            borderRadius: 2,
                            p: bankAccounts.length > 0 ? 2 : 0
                        }}>
                            {bankAccounts.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Henüz banka hesabı eklenmedi
                                    </Typography>
                                </Box>
                            ) : (
                                bankAccounts.map((account, index) => (
                                    <ListItem 
                                        key={index}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: 2,
                                            mb: 1,
                                            '&:last-child': { mb: 0 }
                                        }}
                                    >
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                            <AccountBalanceIcon />
                                        </Avatar>
                                        <ListItemText
                                            primary={account.bankName}
                                            secondary={`${account.accountName} - ${account.iban}`}
                                            primaryTypographyProps={{
                                                fontWeight: 600
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton 
                                                onClick={() => handleBankDialogOpen(account)}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                onClick={() => {
                                                    const newAccounts = bankAccounts.filter((_, i) => i !== index);
                                                    setBankAccounts(newAccounts);
                                                    setCardData(prev => ({ ...prev, bankAccounts: newAccounts }));
                                                }}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Box>
                );

            case 5:
                return (
                    <Box>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#1a1a1a',
                                mb: 1.5,
                                textAlign: 'center'
                            }}
                        >
                            Tema Seçimi
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#666',
                                mb: 2.5,
                                textAlign: 'center',
                                fontSize: '0.95rem'
                            }}
                        >
                            Kartvizitiniz için bir tema seçin
                        </Typography>
                        
                        <FormControl 
                            fullWidth 
                            sx={{ 
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                    '& fieldset': {
                                        borderColor: '#d0d0d0',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                        borderWidth: 2,
                                    },
                                },
                                '& .MuiSelect-select': {
                                    color: '#1a1a1a',
                                },
                                '& .MuiInputLabel-root': {
                                    fontWeight: 500,
                                    color: '#666',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                },
                            }}
                        >
                            <InputLabel>Tema</InputLabel>
                            <Select
                                value={cardData.theme}
                                onChange={(e) => setCardData(prev => ({ ...prev, theme: e.target.value }))}
                                label="Tema"
                            >
                                <MenuItem value="light">Klasik Tema</MenuItem>
                                <MenuItem value="modern">Modern Tema</MenuItem>
                                <MenuItem value="icongrid">İkon Grid Tema</MenuItem>
                                <MenuItem value="business">İş Teması</MenuItem>
                                <MenuItem value="creative">Yaratıcı Tema</MenuItem>
                                <MenuItem value="carousel">3D Carousel Tema</MenuItem>
                                <MenuItem value="ovalcarousel">Oval Carousel Tema</MenuItem>
                                <MenuItem value="dark">Koyu Tema</MenuItem>
                            </Select>
                        </FormControl>

                        <Box 
                            sx={{ 
                                mt: 3,
                                p: 2,
                                backgroundColor: 'grey.50',
                                borderRadius: 3,
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                gutterBottom
                                sx={{
                                    fontWeight: 600,
                                    mb: 3,
                                    textAlign: 'center'
                                }}
                            >
                                Önizleme
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <ThemePreview 
                                    formData={cardData}
                                    theme={cardData.theme}
                                />
                            </Box>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    // Kart yükleniyor ise loading göster
    if (cardLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="h6">
                        Sihirbaz hazırlanıyor...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    // Kart yüklenemedi ise hata göster
    if (!cardLoaded) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Geçersiz Sihirbaz Linki
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Bu link geçersiz veya kart bulunamadı.
                    </Typography>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Ana Sayfaya Dön
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                display: 'flex',
                alignItems: 'center',
                py: { xs: 1.5, md: 2 },
                px: 2
            }}
        >
            <Container maxWidth="lg" sx={{ maxWidth: '1000px !important' }}>
                <Paper 
                    elevation={8}
                    sx={{ 
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'white',
                        mx: 'auto'
                    }}
                >
                    {/* Başlık Bölümü */}
                    <Box 
                        sx={{ 
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            p: { xs: 2, md: 2.5 },
                            textAlign: 'center',
                            color: 'white'
                        }}
                    >
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 700,
                                mb: 1.5,
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }}
                        >
                            Kartvizit Sihirbazı
                        </Typography>
                        <Chip 
                            label={wizardType === 'corporate' ? 'Kurumsal' : wizardType === 'admin' ? 'Admin' : 'Bireysel'}
                            sx={{ 
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                px: 2.5,
                                py: 2,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}
                        />
                    </Box>

                    {/* Ana İçerik */}
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        {/* Progress Bar */}
                        <Box sx={{ mb: 2.5 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                mb: 1.5,
                                flexWrap: 'wrap',
                                gap: 1
                            }}>
                                {steps.map((label, index) => (
                                    <Box 
                                        key={label}
                                        sx={{ 
                                            flex: 1,
                                            minWidth: { xs: 'calc(50% - 8px)', sm: 'auto' },
                                            textAlign: 'center',
                                            position: 'relative'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto',
                                                mb: 0.75,
                                                background: index <= activeStep 
                                                    ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                                                    : '#e0e0e0',
                                                color: index <= activeStep ? 'white' : '#999',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                boxShadow: index === activeStep 
                                                    ? '0 4px 12px rgba(25, 118, 210, 0.4)'
                                                    : 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                fontWeight: index === activeStep ? 700 : 500,
                                                color: index === activeStep ? '#1976d2' : '#666',
                                                display: 'block',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box 
                                sx={{ 
                                    height: 6, 
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        height: '100%',
                                        width: `${((activeStep + 1) / steps.length) * 100}%`,
                                        background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                                        transition: 'width 0.3s ease',
                                        borderRadius: 4
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Form İçeriği */}
                        <Box 
                            sx={{ 
                                minHeight: 320,
                                backgroundColor: 'white',
                                borderRadius: 3,
                                p: { xs: 2, md: 3 },
                                mb: 1.5,
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                        >
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Navigasyon Butonları */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' },
                            width: '100%'
                        }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                variant="outlined"
                                size="large"
                                sx={{
                                    flex: { xs: 1, sm: '0 1 35%' },
                                    minWidth: { xs: '100%', sm: '200px' },
                                    px: { xs: 4, sm: 5 },
                                    py: 2,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        borderWidth: 2,
                                        backgroundColor: '#f5f7ff',
                                        borderColor: '#1565c0',
                                        color: '#1565c0',
                                    },
                                    '&:disabled': {
                                        borderColor: '#e0e0e0',
                                        color: '#999',
                                        backgroundColor: '#f5f5f5',
                                    }
                                }}
                            >
                                ← Geri
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={loading}
                                size="large"
                                sx={{
                                    flex: { xs: 1, sm: '0 1 35%' },
                                    minWidth: { xs: '100%', sm: '200px' },
                                    px: { xs: 4, sm: 5 },
                                    py: 2,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:disabled': {
                                        background: '#cccccc',
                                        color: '#666',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {loading && <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />}
                                {activeStep === steps.length - 1 ? '✓ Kartı Oluştur' : 'İleri →'}
                            </Button>
                        </Box>
                    </Box>

                {/* Banka Hesabı Dialog */}
                <Dialog 
                    open={bankDialogOpen} 
                    onClose={() => setBankDialogOpen(false)} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                        }
                    }}
                >
                    <DialogTitle 
                        sx={{ 
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            color: 'white',
                            py: 3,
                            fontWeight: 600
                        }}
                    >
                        {editingBankAccount ? 'Banka Hesabını Düzenle' : 'Banka Hesabı Ekle'}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl 
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                >
                                    <InputLabel>Banka</InputLabel>
                                    <Select
                                        value={bankFormData.bankName}
                                        onChange={(e) => setBankFormData(prev => ({ ...prev, bankName: e.target.value }))}
                                        label="Banka"
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            '& fieldset': {
                                                borderColor: '#d0d0d0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#1976d2',
                                                borderWidth: 2,
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500,
                                            color: '#666',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#1976d2',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button 
                            onClick={() => setBankDialogOpen(false)}
                            variant="outlined"
                            size="large"
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderWidth: 2,
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                minWidth: { xs: '100%', sm: '140px' },
                                '&:hover': {
                                    borderWidth: 2,
                                    backgroundColor: '#f5f7ff',
                                }
                            }}
                        >
                            İptal
                        </Button>
                        <Button 
                            variant="contained"
                            size="large"
                            onClick={handleBankFormSubmit}
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minWidth: { xs: '100%', sm: '140px' },
                                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
                                }
                            }}
                        >
                            {editingBankAccount ? 'Güncelle' : 'Ekle'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* KVKK Modal */}
                <Dialog 
                    open={kvkkModalOpen} 
                    onClose={() => {
                        setKvkkModalOpen(false);
                        setActiveKvkkType(null);
                        setKvkkScrolledToBottom(false);
                    }} 
                    maxWidth="md" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            maxHeight: '90vh',
                            backgroundColor: '#ffffff'
                        }
                    }}
                >
                    <DialogTitle 
                        sx={{ 
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            color: 'white',
                            py: 3,
                            px: 4,
                            fontWeight: 600,
                            fontSize: '1.5rem'
                        }}
                    >
                        {activeKvkkType && KVKK_TEXTS[activeKvkkType]?.title}
                    </DialogTitle>
                    <DialogContent 
                        onScroll={handleKvkkScroll}
                        sx={{ 
                            mt: 3,
                            px: 4,
                            py: 3,
                            backgroundColor: '#fafafa',
                            maxHeight: '60vh',
                            overflowY: 'auto'
                        }}
                    >
                        <Typography 
                            component="pre" 
                            sx={{ 
                                whiteSpace: 'pre-wrap',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontSize: '1rem',
                                lineHeight: 1.8,
                                color: '#1a1a1a',
                                backgroundColor: 'white',
                                padding: 3,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                margin: 0
                            }}
                        >
                            {activeKvkkType && KVKK_TEXTS[activeKvkkType]?.content}
                        </Typography>
                        
                        {!kvkkScrolledToBottom && (
                            <Box 
                                sx={{ 
                                    position: 'sticky',
                                    bottom: -24,
                                    left: 0,
                                    right: 0,
                                    py: 3,
                                    textAlign: 'center',
                                    background: 'linear-gradient(to top, rgba(250, 250, 250, 1) 60%, rgba(250, 250, 250, 0))',
                                    pointerEvents: 'none',
                                    mt: -8
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: '#1976d2',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        display: 'inline-block',
                                        px: 3,
                                        py: 1.5,
                                        backgroundColor: 'white',
                                        borderRadius: 3,
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                        pointerEvents: 'auto',
                                        border: '2px solid #1976d2'
                                    }}
                                >
                                    ↓ Lütfen metni sonuna kadar okuyun ↓
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' }, backgroundColor: '#fafafa' }}>
                        <Button 
                            onClick={handleKvkkReject}
                            variant="outlined"
                            size="large"
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderWidth: 2,
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                                minWidth: { xs: '100%', sm: '160px' },
                                backgroundColor: 'white',
                                '&:hover': {
                                    borderWidth: 2,
                                    backgroundColor: '#ffebee',
                                    borderColor: '#c62828',
                                    color: '#c62828',
                                }
                            }}
                        >
                            Reddet
                        </Button>
                        <Button 
                            variant="contained"
                            size="large"
                            onClick={handleKvkkAccept}
                            disabled={!kvkkScrolledToBottom}
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minWidth: { xs: '100%', sm: '200px' },
                                background: kvkkScrolledToBottom 
                                    ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                                    : '#cccccc',
                                color: 'white',
                                boxShadow: kvkkScrolledToBottom 
                                    ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                                    : 'none',
                                '&:hover': {
                                    background: kvkkScrolledToBottom 
                                        ? 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                                        : '#cccccc',
                                    boxShadow: kvkkScrolledToBottom 
                                        ? '0 6px 20px rgba(102, 126, 234, 0.6)'
                                        : 'none',
                                },
                                '&:disabled': {
                                    background: '#cccccc',
                                    color: '#999',
                                }
                            }}
                        >
                            {kvkkScrolledToBottom ? 'Okudum, Kabul Ediyorum ✓' : 'Lütfen Okuyun'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
        </Box>
    );
} 
