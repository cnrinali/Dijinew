import React, { useState, useEffect } from 'react';
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
    RadioGroup,
    Radio,
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
    CloudUpload as CloudUploadIcon,
    LinkedIn as LinkedInIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    Storefront as StorefrontIcon,
    WhatsApp as WhatsAppIcon,
    Facebook as FacebookIcon,
    Telegram as TelegramIcon,
    YouTube as YouTubeIcon,
    VideoCall as SkypeIcon,
    Chat as WeChatIcon,
    CameraAlt as SnapchatIcon,
    Share as PinterestIcon,
    MusicNote as TikTokIcon,
    Home as HomeIcon,
    Business as BusinessIcon,
    ShoppingCart as ShoppingCartIcon,
    Store as StoreIcon,
    Language as LanguageIcon
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
    'Pazaryeri',
    'Banka Hesapları',
    'Tanıtım Videosu',
    'Dökümanlar',
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

    // Sayfa başlığını ayarla
    useEffect(() => {
        document.title = 'Dijinew Dijital Kartvizit Kullanıcı Sihirbazı';
    }, []);

    // Sihirbazın hangi tipte olduğunu belirle (admin, corporate, user)
    const wizardType = searchParams.get('type') || 'user';
    // const token = searchParams.get('token'); // Simple wizard token - handled in handleFinalSubmit

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
        // Yeni sosyal medya alanları
        whatsappUrl: '',
        facebookUrl: '',
        telegramUrl: '',
        youtubeUrl: '',
        skypeUrl: '',
        wechatUrl: '',
        snapchatUrl: '',
        pinterestUrl: '',
        tiktokUrl: '',
        // Yeni pazaryeri alanları
        sahibindenUrl: '',
        hepsiemlakUrl: '',
        arabamUrl: '',
        letgoUrl: '',
        n11Url: '',
        amazonUrl: '',
        pttAvmUrl: '',
        ciceksepetiUrl: '',
        websiteUrl: '',
        whatsappBusinessUrl: '',
        getirUrl: '',
        yemeksepetiUrl: '',
        videoUrl: '',
        documents: [],
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

    // Döküman yönetimi
    const [documents, setDocuments] = useState([]);
    const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);
    const [documentFormData, setDocumentFormData] = useState({
        name: '',
        url: '',
        description: '',
        type: 'url' // 'url' veya 'file'
    });
    
    // Dosya yükleme state
    const [selectedFile, setSelectedFile] = useState(null);

    // Dökümanları cardData'dan yükle
    useEffect(() => {
        if (cardData.documents && Array.isArray(cardData.documents)) {
            console.log('[CardWizard] Loading documents from cardData:', cardData.documents);
            setDocuments(cardData.documents);
        } else {
            console.log('[CardWizard] No documents in cardData, setting empty array');
            setDocuments([]);
        }
    }, [cardData.documents]);

    // useEffect to sync documents state with cardData
    useEffect(() => {
        if (documents.length > 0) {
            setCardData(prev => ({ ...prev, documents: documents }));
        }
    }, [documents]);

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
                        hepsiburadaUrl: data.hepsiburadaUrl || '',
                        // Yeni sosyal medya alanları
                        whatsappUrl: data.whatsappUrl || '',
                        facebookUrl: data.facebookUrl || '',
                        telegramUrl: data.telegramUrl || '',
                        youtubeUrl: data.youtubeUrl || '',
                        skypeUrl: data.skypeUrl || '',
                        wechatUrl: data.wechatUrl || '',
                        snapchatUrl: data.snapchatUrl || '',
                        pinterestUrl: data.pinterestUrl || '',
                        tiktokUrl: data.tiktokUrl || '',
                        // Yeni pazaryeri alanları
                        sahibindenUrl: data.sahibindenUrl || '',
                        hepsiemlakUrl: data.hepsiemlakUrl || '',
                        arabamUrl: data.arabamUrl || '',
                        letgoUrl: data.letgoUrl || '',
                        n11Url: data.n11Url || '',
                        amazonUrl: data.amazonUrl || '',
                        pttAvmUrl: data.pttAvmUrl || '',
                        ciceksepetiUrl: data.ciceksepetiUrl || '',
                        websiteUrl: data.websiteUrl || '',
                        whatsappBusinessUrl: data.whatsappBusinessUrl || ''
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

    // Kartın sahipliğini güncelle (cardSlug ile) - Currently unused
    // const updateCardOwnership = useCallback(async (cardSlug, newUserId) => {
    //     try {
    //         const apiBaseUrl = window.location.hostname === 'localhost' 
    //             ? 'http://localhost:5001' 
    //             : 'https://api.dijinew.com';
    //         
    //         // Token'ı localStorage'dan al
    //         const token = localStorage.getItem('token');
    //         
    //         if (!token) {
    //             console.warn('Token bulunamadı, kart sahipliği güncellenemedi');
    //             return;
    //         }
    //         
    //         const response = await fetch(`${apiBaseUrl}/api/cards/slug/${cardSlug}/ownership`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify({ newUserId })
    //         });
    //         
    //         const data = await response.json();
    //         
    //         if (data.success) {
    //             console.log('Kart sahipliği güncellendi:', newUserId);
    //         } else {
    //             console.warn('Kart sahipliği güncellenemedi:', data.message);
    //         }
    //     } catch (error) {
    //         console.error('Kart sahipliği güncelleme hatası:', error);
    //     }
    // }, []);




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
                            // Token'ı manuel olarak localStorage'a kaydet
                            if (loginResult.token) {
                                localStorage.setItem('token', loginResult.token);
                                console.log('Token manuel olarak kaydedildi:', loginResult.token);
                            }
                            
                            // Token'ı localStorage'a kaydet
                            console.log('Token kaydedildi, kart oluşturma işlemi devam ediyor...');
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
                                    // Token'ı manuel olarak localStorage'a kaydet
                                    if (authLoginResult.token) {
                                        localStorage.setItem('token', authLoginResult.token);
                                        console.log('Token manuel olarak kaydedildi:', authLoginResult.token);
                                    }
                                    
                                    // Token'ı localStorage'a kaydet
                                    console.log('Token kaydedildi, kart oluşturma işlemi devam ediyor...');
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
                documents: documents, // Dökümanları dahil et
                isActive: true, // Kartı aktif hale getir
                customSlug: crypto.randomUUID() // UUID oluştur
            };

            // Simple wizard API ile kartı güncelle
            const apiBaseUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:5001' 
                : 'https://api.dijinew.com';
            
            // Token'ı localStorage'dan al
            let token = localStorage.getItem('token');
            
            // Eğer token yoksa, kullanıcının giriş yapmış olup olmadığını kontrol et
            if (!token) {
                // Kullanıcı giriş yapmış mı kontrol et
                if (!isAuthenticated) {
                    showNotification('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', 'error');
                    navigate('/login');
                    return;
                }
                
                // Kullanıcı giriş yapmış ama token localStorage'da yok
                // Bu durumda kullanıcıyı login sayfasına yönlendirmek yerine
                // mevcut oturum bilgilerini kullanarak devam et
                showNotification('Oturum bilgileri güncelleniyor...', 'info');
                
                // Kullanıcı bilgilerini localStorage'dan al
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.token) {
                    token = user.token;
                    localStorage.setItem('token', token);
                } else {
                    showNotification('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', 'error');
                    navigate('/login');
                    return;
                }
            }
            
            // Mevcut kartı güncelle (PUT) - Simple Wizard token ile
            const simpleWizardToken = searchParams.get('token');
            
            if (simpleWizardToken) {
                // Simple Wizard token ile kartı güncelle
                const response = await fetch(`${apiBaseUrl}/api/simple-wizard/card/${simpleWizardToken}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalCardData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                    // Kart güncellendi, şimdi kullanıcı sahipliğini güncelle
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user && user.id) {
                        try {
                            const ownershipResponse = await fetch(`${apiBaseUrl}/api/simple-wizard/use/${simpleWizardToken}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ newUserId: user.id })
                            });
                            
                            const ownershipData = await ownershipResponse.json();
                            
                            if (ownershipData.success) {
                                showNotification('Kartvizit başarıyla güncellendi ve sahipliğinize geçti!', 'success');
                            } else {
                                showNotification('Kartvizit güncellendi ama sahiplik güncellenemedi: ' + (ownershipData.message || 'Bilinmeyen hata'), 'warning');
                            }
                        } catch (ownershipError) {
                            console.error('Sahiplik güncelleme hatası:', ownershipError);
                            showNotification('Kartvizit güncellendi ama sahiplik güncellenemedi', 'warning');
                        }
                    } else {
                        showNotification('Kartvizit güncellendi!', 'success');
                    }
                    
                    // Kullanıcı giriş yapmış olduğundan uygun yere yönlendir
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
                } else {
                    showNotification('Kartvizit güncellenemedi: ' + (data.message || 'Bilinmeyen hata'), 'error');
                }
            } else {
                // Fallback: JWT token ile kart oluştur
                const response = await fetch(`${apiBaseUrl}/api/cards`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(finalCardData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Kartvizit başarıyla oluşturuldu!', 'success');
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
                } else {
                    showNotification('Kartvizit oluşturulamadı: ' + (data.message || 'Bilinmeyen hata'), 'error');
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

    // Döküman yönetimi
    const handleDocumentDialogOpen = (document = null) => {
        setEditingDocument(document);
        setDocumentFormData(document ? { ...document, type: document.url ? 'url' : 'file' } : { name: '', url: '', description: '', type: 'url' });
        setSelectedFile(null);
        setDocumentDialogOpen(true);
    };

    const handleDocumentDialogClose = () => {
        setDocumentDialogOpen(false);
        setEditingDocument(null);
        setDocumentFormData({ name: '', url: '', description: '', type: 'url' });
        setSelectedFile(null);
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
                            <Grid container spacing={{ xs: 1, sm: 1.5 }} justifyContent="center">
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Ad Soyad"
                                    value={userData.name}
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    disabled={userRegistered}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="E-posta"
                                    value={userData.email}
                                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                    disabled={userRegistered}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            {wizardType === 'corporate' && (
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
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
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
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
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            
                            {/* KVKK Onayları */}
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box 
                                    sx={{ 
                                        mt: 2, 
                                        mb: 2,
                                        p: 2.5, 
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: 2,
                                        border: '2px solid #e0e0e0'
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            mb: 1.5, 
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            fontSize: '0.9rem'
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
                                            <Typography sx={{ fontSize: '0.8rem' }}>
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
                                            <Typography sx={{ fontSize: '0.8rem' }}>
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
                                            <Typography sx={{ fontSize: '0.8rem' }}>
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
                            <Grid container spacing={{ xs: 1, sm: 1.5 }} justifyContent="center">
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Kart Adı"
                                    value={cardData.cardName}
                                    onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
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
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
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
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Şirket"
                                    value={cardData.company}
                                    onChange={(e) => setCardData(prev => ({ ...prev, company: e.target.value }))}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Hakkımda"
                                    value={cardData.bio}
                                    onChange={(e) => setCardData(prev => ({ ...prev, bio: e.target.value }))}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
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
                            <Grid container spacing={{ xs: 1, sm: 1.5 }} justifyContent="center">
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Telefon"
                                    value={cardData.phone}
                                    onChange={(e) => setCardData(prev => ({ ...prev, phone: e.target.value }))}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
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
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    value={cardData.website}
                                    onChange={(e) => setCardData(prev => ({ ...prev, website: e.target.value }))}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Adres"
                                    value={cardData.address}
                                    onChange={(e) => setCardData(prev => ({ ...prev, address: e.target.value }))}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
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
                            Sosyal medya hesaplarınızı ekleyin
                        </Typography>
                            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                                {/* LinkedIn URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="LinkedIn URL"
                                    value={cardData.linkedinUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                            startAdornment: cardData.linkedinUrl ? (
                                                <InputAdornment position="start">
                                                    <LinkedInIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#0077B5'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                    }}
                                    size="large"
                                    sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>

                                {/* Twitter URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Twitter URL"
                                    value={cardData.twitterUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                            startAdornment: cardData.twitterUrl ? (
                                                <InputAdornment position="start">
                                                    <TwitterIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#1DA1F2'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                    }}
                                    size="large"
                                    sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>

                                {/* Instagram URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Instagram URL"
                                    value={cardData.instagramUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                            startAdornment: cardData.instagramUrl ? (
                                                <InputAdornment position="start">
                                                    <InstagramIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#E4405F'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                    }}
                                    size="large"
                                    sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* WhatsApp URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="WhatsApp URL"
                                        value={cardData.whatsappUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, whatsappUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.whatsappUrl ? (
                                                <InputAdornment position="start">
                                                    <WhatsAppIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#25D366'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>

                                {/* Facebook URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Facebook URL"
                                        value={cardData.facebookUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.facebookUrl ? (
                                                <InputAdornment position="start">
                                                    <FacebookIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#1877F2'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* YouTube URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="YouTube URL"
                                        value={cardData.youtubeUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.youtubeUrl ? (
                                                <InputAdornment position="start">
                                                    <YouTubeIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#FF0000'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* TikTok URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="TikTok URL"
                                        value={cardData.tiktokUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, tiktokUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.tiktokUrl ? (
                                                <InputAdornment position="start">
                                                    <TikTokIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#000000'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Telegram URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Telegram URL"
                                        value={cardData.telegramUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, telegramUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.telegramUrl ? (
                                                <InputAdornment position="start">
                                                    <TelegramIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#0088CC'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Pinterest URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Pinterest URL"
                                        value={cardData.pinterestUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, pinterestUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.pinterestUrl ? (
                                                <InputAdornment position="start">
                                                    <PinterestIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#E60023'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Skype URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Skype URL"
                                        value={cardData.skypeUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, skypeUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.skypeUrl ? (
                                                <InputAdornment position="start">
                                                    <SkypeIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#00AFF0'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* WeChat URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="WeChat URL"
                                        value={cardData.wechatUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, wechatUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.wechatUrl ? (
                                                <InputAdornment position="start">
                                                    <WeChatIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#07C160'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Snapchat URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Snapchat URL"
                                        value={cardData.snapchatUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, snapchatUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.snapchatUrl ? (
                                                <InputAdornment position="start">
                                                    <SnapchatIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#FFFC00'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
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
                            Pazaryeri
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
                            Pazaryeri hesaplarınızı ve web sitenizi ekleyin
                        </Typography>
                            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                                {/* Trendyol URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Trendyol URL"
                                    value={cardData.trendyolUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, trendyolUrl: e.target.value }))}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: cardData.trendyolUrl ? (
                                            <InputAdornment position="start">
                                                <img 
                                                    src="/img/ikon/trendyol.png" 
                                                    alt="Trendyol" 
                                                    style={{ 
                                                        width: '20px', 
                                                        height: '20px',
                                                        objectFit: 'contain'
                                                    }} 
                                                />
                                            </InputAdornment>
                                        ) : null
                                    }}
                                    size="large"
                                    sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* N11 URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="N11 URL"
                                        value={cardData.n11Url}
                                        onChange={(e) => setCardData(prev => ({ ...prev, n11Url: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.n11Url ? (
                                                <InputAdornment position="start">
                                                    <img 
                                                        src="/img/ikon/n11.png" 
                                                        alt="N11" 
                                                        style={{ 
                                                            width: '20px', 
                                                            height: '20px',
                                                            objectFit: 'contain'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Hepsiburada URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Hepsiburada URL"
                                        value={cardData.hepsiburadaUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, hepsiburadaUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.hepsiburadaUrl ? (
                                                <InputAdornment position="start">
                                                    <img 
                                                        src="/img/ikon/hepsiburada.png" 
                                                        alt="Hepsiburada" 
                                                        style={{ 
                                                            width: '20px', 
                                                            height: '20px',
                                                            objectFit: 'contain'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Web Site URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Web Site URL"
                                        value={cardData.websiteUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.websiteUrl ? (
                                                <InputAdornment position="start">
                                                    <LanguageIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#1976D2'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Sahibinden URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Sahibinden URL"
                                        value={cardData.sahibindenUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, sahibindenUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.sahibindenUrl ? (
                                                <InputAdornment position="start">
                                                    <HomeIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#FF6B35'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Amazon URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Amazon URL"
                                        value={cardData.amazonUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, amazonUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.amazonUrl ? (
                                                <InputAdornment position="start">
                                                    <img 
                                                        src="/img/ikon/amazon.png" 
                                                        alt="Amazon" 
                                                        style={{ 
                                                            width: '20px', 
                                                            height: '20px',
                                                            objectFit: 'contain'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Hepsiemlak URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Hepsiemlak URL"
                                        value={cardData.hepsiemlakUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, hepsiemlakUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.hepsiemlakUrl ? (
                                                <InputAdornment position="start">
                                                    <img 
                                                        src="/img/ikon/hepsiemlak.png" 
                                                        alt="Hepsiemlak" 
                                                        style={{ 
                                                            width: '20px', 
                                                            height: '20px',
                                                            objectFit: 'contain'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Arabam URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Arabam URL"
                                        value={cardData.arabamUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, arabamUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.arabamUrl ? (
                                                <InputAdornment position="start">
                                                    <BusinessIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#2196F3'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Letgo URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Letgo URL"
                                        value={cardData.letgoUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, letgoUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.letgoUrl ? (
                                                <InputAdornment position="start">
                                                    <StoreIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#FF5722'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* PTT AVM URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="PTT AVM URL"
                                        value={cardData.pttAvmUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, pttAvmUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.pttAvmUrl ? (
                                                <InputAdornment position="start">
                                                    <StoreIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#E91E63'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Çiçek Sepeti URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Çiçek Sepeti URL"
                                        value={cardData.ciceksepetiUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, ciceksepetiUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.ciceksepetiUrl ? (
                                                <InputAdornment position="start">
                                                    <img 
                                                        src="/img/ikon/ciceksepeti.png" 
                                                        alt="Çiçek Sepeti" 
                                                        style={{ 
                                                            width: '20px', 
                                                            height: '20px',
                                                            objectFit: 'contain'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* WhatsApp Business URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="WhatsApp Business URL"
                                        value={cardData.whatsappBusinessUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, whatsappBusinessUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.whatsappBusinessUrl ? (
                                                <InputAdornment position="start">
                                                    <WhatsAppIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#25D366'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Getir URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Getir URL"
                                        value={cardData.getirUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, getirUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.getirUrl ? (
                                                <InputAdornment position="start">
                                                    <StoreIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#00D4AA'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontWeight: 600,
                                                color: '#555',
                                                fontSize: { xs: '14px', sm: '16px' },
                                                transform: 'translate(14px, 18px) scale(1)',
                                                '&.Mui-focused': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                                '&.MuiFormLabel-filled': {
                                                    transform: 'translate(14px, -9px) scale(0.85)',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#FFD700',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Yemeksepeti URL */}
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <TextField
                                        fullWidth
                                        label="Yemeksepeti URL"
                                        value={cardData.yemeksepetiUrl}
                                        onChange={(e) => setCardData(prev => ({ ...prev, yemeksepetiUrl: e.target.value }))}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: cardData.yemeksepetiUrl ? (
                                                <InputAdornment position="start">
                                                    <StoreIcon 
                                                        color="primary" 
                                                        sx={{ 
                                                            fontSize: '1.2rem',
                                                            color: '#FF6900'
                                                        }} 
                                                    />
                                                </InputAdornment>
                                            ) : null
                                        }}
                                        size="large"
                                        sx={{
                                            maxWidth: { xs: '100%', sm: '100%' },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 3,
                                                backgroundColor: '#f8f9fa',
                                                minHeight: { xs: '56px', sm: '60px' },
                                                fontSize: { xs: '16px', sm: '18px' },
                                                '& fieldset': {
                                                    borderColor: '#e0e0e0',
                                                    borderWidth: 2,
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#FFD700',
                                                    borderWidth: 2,
                                                    boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                                },
                                                '& input': {
                                                    color: '#1a1a1a',
                                                    fontWeight: 500,
                                                    padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
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
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    color: '#1a1a1a',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                                        boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6)',
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

            case 6:
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
                            Tanıtım Videosu
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
                            Tanıtım videonuzun linkini ekleyin (YouTube, Vimeo, vb.)
                        </Typography>
                        
                        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Video URL"
                                    value={cardData.videoUrl}
                                    onChange={(e) => setCardData(prev => ({ ...prev, videoUrl: e.target.value }))}
                                    variant="outlined"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    InputProps={{
                                        startAdornment: cardData.videoUrl ? (
                                            <InputAdornment position="start">
                                                <img 
                                                    src="/img/ikon/youtube.png" 
                                                    alt="Video" 
                                                    style={{ 
                                                        width: '20px', 
                                                        height: '20px',
                                                        objectFit: 'contain'
                                                    }} 
                                                />
                                            </InputAdornment>
                                        ) : null
                                    }}
                                    size="large"
                                    sx={{
                                        maxWidth: { xs: '100%', sm: '600px' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 7:
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
                            Dökümanlar
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
                            Dökümanlarınızı yükleyin (PDF, Word, Excel, vb.)
                        </Typography>
                        
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{ fontSize: '1.5rem' }} />}
                                onClick={() => handleDocumentDialogOpen()}
                                size="large"
                                sx={{
                                    px: { xs: 4, sm: 6 },
                                    py: 2,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    fontWeight: 600,
                                    minWidth: { xs: '100%', sm: '300px' },
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    color: '#1a1a1a',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                                        boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Döküman Ekle
                            </Button>
                        </Box>

                        <List sx={{ 
                            backgroundColor: 'grey.50',
                            borderRadius: 2,
                            p: documents.length > 0 ? 2 : 0
                        }}>
                            {documents.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Henüz döküman eklenmedi
                                    </Typography>
                                </Box>
                            ) : (
                                documents.map((document, index) => (
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
                                            <BusinessIcon />
                                        </Avatar>
                                        <ListItemText
                                            primary={document.name}
                                            secondary={document.description}
                                            primaryTypographyProps={{
                                                fontWeight: 600
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton 
                                                onClick={() => handleDocumentDialogOpen(document)}
                                                sx={{ color: 'primary.main' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                onClick={() => {
                                                    const newDocuments = documents.filter((_, i) => i !== index);
                                                    setDocuments(newDocuments);
                                                    setCardData(prev => ({ ...prev, documents: newDocuments }));
                                                    
                                                    // CardWizard'da dökümanlar sadece state'te tutuluyor
                                                    // Final submit'te kaydedilecek
                                                    console.log('[CardWizard] Döküman state\'ten silindi, final submit\'te kaydedilecek');
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

            case 8:
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
                                    size="large"
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
                background: {
                    xs: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                    sm: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: { xs: 'flex-start', sm: 'center' },
                py: { xs: 0, sm: 2 },
                px: { xs: 0, sm: 2 },
                fontFamily: "'Poppins', 'Inter', sans-serif",
                position: 'relative',
                overflow: 'hidden',
                // CSS Animations
                '@keyframes pulse': {
                    '0%': {
                        boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)'
                    },
                    '70%': {
                        boxShadow: '0 0 0 10px rgba(255, 215, 0, 0)'
                    },
                    '100%': {
                        boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)'
                    }
                }
            }}
        >

            {/* Main Content */}
                <Box 
                    sx={{ 
                        width: '100%',
                        maxWidth: { xs: '100%', sm: '580px', md: '680px', lg: '750px' },
                        mx: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: { xs: '100vh', sm: 'auto' }
                    }}
                >
                <Paper 
                    elevation={0}
                    sx={{ 
                        borderRadius: { xs: 0, sm: 3, md: 4 },
                        overflow: 'visible',
                        background: { xs: 'transparent', sm: '#1a1a1a' },
                        border: { xs: 'none', sm: '2px solid #FFD700' },
                        boxShadow: { xs: 'none', sm: '0 8px 32px rgba(0,0,0,0.3)' },
                        width: '100%',
                        minHeight: { xs: '100vh', sm: 'auto' },
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Desktop Başlık Bölümü - Mobilde Gizli */}
                    <Box 
                        sx={{ 
                            display: { xs: 'none', sm: 'block' },
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            p: { sm: 2.5, md: 3 },
                            textAlign: 'center',
                            color: '#1a1a1a',
                            fontFamily: "'Poppins', sans-serif"
                        }}
                    >
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 800,
                                mb: 1.5,
                                fontSize: { sm: '1.5rem', md: '2rem' }
                            }}
                        >
                            Kartvizit Sihirbazı
                        </Typography>
                        <Chip 
                            label={wizardType === 'corporate' ? 'Kurumsal' : wizardType === 'admin' ? 'Admin' : 'Bireysel'}
                            sx={{ 
                                backgroundColor: '#1a1a1a',
                                color: '#FFD700',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                px: 2,
                                py: 0.5
                            }}
                        />
                    </Box>

                    {/* Ana İçerik */}
                    <Box sx={{ 
                        p: { xs: 1, sm: 1.5, md: 2 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'visible'
                    }}>
                        {/* Mobile-First Progress Bar - Compact & Corporate */}
                        <Box sx={{ 
                            mb: { xs: 2, sm: 2.5 },
                            px: { xs: 1, sm: 0 }
                        }}>
                            {/* Step Indicators - Mobile Optimized */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: { xs: 1.5, sm: 2 },
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    right: 0,
                                    height: 2,
                                    backgroundColor: '#e0e0e0',
                                    zIndex: 1
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    height: 2,
                                    width: `${((activeStep + 1) / steps.length) * 100}%`,
                                    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                                    transition: 'width 0.5s ease',
                                    zIndex: 2,
                                    borderRadius: 1
                                }
                            }}>
                                {steps.map((label, index) => (
                                    <Box 
                                        key={label}
                                        sx={{ 
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            position: 'relative',
                                            zIndex: 2,
                                            flex: 1,
                                            minWidth: { xs: '60px', sm: '80px' }
                                        }}
                                    >
                                        {/* Step Circle */}
                                        <Box
                                            sx={{
                                                width: { xs: 28, sm: 32 },
                                                height: { xs: 28, sm: 32 },
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto',
                                                mb: { xs: 0.5, sm: 0.75 },
                                                background: index <= activeStep 
                                                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                                    : '#f5f5f5',
                                                color: index <= activeStep ? '#1a1a1a' : '#999',
                                                fontWeight: 700,
                                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                boxShadow: index === activeStep 
                                                    ? '0 3px 10px rgba(255, 215, 0, 0.4)'
                                                    : '0 2px 4px rgba(0,0,0,0.1)',
                                                border: index <= activeStep 
                                                    ? '2px solid #FFD700'
                                                    : '2px solid #e0e0e0',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        >
                                            {index < activeStep ? '✓' : index + 1}
                                        </Box>
                                        
                                        {/* Step Label - Mobile Optimized */}
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.65rem' },
                                                fontWeight: index === activeStep ? 700 : 500,
                                                color: index === activeStep ? '#FFD700' : '#666',
                                                display: 'block',
                                                lineHeight: 1.1,
                                                fontFamily: "'Inter', sans-serif",
                                                textAlign: 'center',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.3px',
                                                maxWidth: { xs: '50px', sm: '70px' },
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                        
                                        {/* Active Step Indicator */}
                                        {index === activeStep && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: { xs: -6, sm: -8 },
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    width: { xs: 4, sm: 6 },
                                                    height: { xs: 4, sm: 6 },
                                                    borderRadius: '50%',
                                                    background: '#FFD700',
                                                    boxShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
                                                    animation: 'pulse 2s infinite'
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                            
                            
                            {/* Step Counter - Corporate Info */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mt: { xs: 1, sm: 1.5 },
                                px: { xs: 1, sm: 0 }
                            }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                        fontWeight: 600,
                                        color: '#666',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                >
                                    Adım {activeStep + 1} / {steps.length}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                        fontWeight: 500,
                                        color: '#999',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                >
                                    %{Math.round(((activeStep + 1) / steps.length) * 100)} Tamamlandı
                                </Typography>
                            </Box>
                        </Box>

                        {/* Form İçeriği - Smart Scroll Management */}
                        <Box 
                            sx={{ 
                                flex: 1,
                                backgroundColor: 'white',
                                borderRadius: { xs: 2, sm: 3 },
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                mb: { xs: 1, sm: 1.5 },
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                fontFamily: "'Inter', sans-serif",
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'auto',
                                minHeight: { xs: '280px', sm: '320px', md: '350px' },
                                maxHeight: { xs: 'calc(100vh - 200px)', sm: 'calc(100vh - 250px)', md: 'calc(100vh - 300px)' },
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: '3px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#c1c1c1',
                                    borderRadius: '3px',
                                    '&:hover': {
                                        backgroundColor: '#a8a8a8',
                                    }
                                }
                            }}
                        >
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Navigasyon Butonları */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            gap: { xs: 1.5, sm: 2 },
                            flexDirection: { xs: 'column', sm: 'row' },
                            width: '100%',
                            px: { xs: 0, sm: 1 }
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
                                    borderColor: '#FFD700',
                                    color: '#FFD700',
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        borderWidth: 2,
                                        backgroundColor: '#fff8e1',
                                        borderColor: '#FFA500',
                                        color: '#FFA500',
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
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    color: '#1a1a1a',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                                        boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6)',
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
                            color: '#1a1a1a',
                            py: 3,
                            fontWeight: 600
                        }}
                    >
                        {editingBankAccount ? 'Banka Hesabını Düzenle' : 'Banka Hesabı Ekle'}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3 }}>
                            <Grid container spacing={{ xs: 1, sm: 1.5 }} justifyContent="center">
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <FormControl 
                                    fullWidth
                                    size="large"
                                    sx={{
                                        mb: { xs: 2, sm: 3 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& .MuiSelect-select': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                                display: 'flex',
                                                alignItems: 'center',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                                color: '#FFD700',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                                color: '#FFD700',
                                            },
                                        },
                                        '& .MuiSelect-icon': {
                                            fontSize: { xs: '20px', sm: '24px' },
                                            color: '#FFD700',
                                        },
                                        '& .MuiSelect-select.MuiSelect-select': {
                                            '&:focus': {
                                                backgroundColor: 'transparent',
                                            },
                                        },
                                    }}
                                >
                                    <InputLabel>
                                        Banka
                                    </InputLabel>
                                    <Select
                                        value={bankFormData.bankName}
                                        onChange={(e) => setBankFormData(prev => ({ ...prev, bankName: e.target.value }))}
                                        label="Banka"
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 300,
                                                    borderRadius: 3,
                                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                                    '& .MuiMenuItem-root': {
                                                        fontSize: '16px',
                                                        fontWeight: 500,
                                                        padding: '12px 16px',
                                                        '&:hover': {
                                                            backgroundColor: '#fff8e1',
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: '#FFD700',
                                                            color: '#1a1a1a',
                                                            fontWeight: 600,
                                                        },
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {TURKISH_BANKS.map((bank) => (
                                            <MenuItem key={bank.name} value={bank.name}>
                                                {bank.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="Hesap Sahibi"
                                    value={bankFormData.accountName}
                                    onChange={(e) => setBankFormData(prev => ({ ...prev, accountName: e.target.value }))}
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <TextField
                                    fullWidth
                                    label="IBAN"
                                    value={bankFormData.iban}
                                    onChange={(e) => setBankFormData(prev => ({ 
                                        ...prev, 
                                        iban: formatIban(e.target.value) 
                                    }))}
                                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                                    size="large"
                                    sx={{
                                        mb: { xs: 1.5, sm: 2 },
                                        maxWidth: { xs: '100%', sm: '400px', md: '450px' },
                                        mx: 'auto',
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: '#f8f9fa',
                                            minHeight: { xs: '56px', sm: '60px' },
                                            fontSize: { xs: '16px', sm: '18px' },
                                            '& fieldset': {
                                                borderColor: '#e0e0e0',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.1)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#FFD700',
                                                borderWidth: 2,
                                                boxShadow: '0 0 0 3px rgba(255, 215, 0, 0.2)',
                                            },
                                            '& input': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 12px', sm: '20px 16px' },
                                            },
                                            '& textarea': {
                                                color: '#1a1a1a',
                                                fontWeight: 500,
                                                padding: { xs: '16px 14px', sm: '18px 16px' },
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 600,
                                            color: '#555',
                                            fontSize: { xs: '14px', sm: '16px' },
                                            transform: 'translate(14px, 18px) scale(1)',
                                            '&.Mui-focused': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                            '&.MuiFormLabel-filled': {
                                                transform: 'translate(14px, -9px) scale(0.85)',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#FFD700',
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
                                color: '#1a1a1a',
                                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                    boxShadow: '0 6px 16px rgba(255, 215, 0, 0.6)',
                                }
                            }}
                        >
                            {editingBankAccount ? 'Güncelle' : 'Ekle'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Döküman Dialog */}
                <Dialog 
                    open={documentDialogOpen} 
                    onClose={handleDocumentDialogClose}
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
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
                        {editingDocument ? 'Döküman Düzenle' : 'Döküman Ekle'}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3, px: 4, py: 3 }}>
                        <TextField
                            fullWidth
                            label="Döküman Adı"
                            value={documentFormData.name}
                            onChange={(e) => setDocumentFormData(prev => ({ ...prev, name: e.target.value }))}
                            variant="outlined"
                            placeholder="Örn: CV, Sertifika, Broşür"
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': {
                                    color: '#1a1a1a',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2'
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#e0e0e0'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2'
                                    },
                                    '& input': {
                                        color: '#1a1a1a',
                                        fontSize: '1rem'
                                    }
                                }
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Açıklama"
                            value={documentFormData.description}
                            onChange={(e) => setDocumentFormData(prev => ({ ...prev, description: e.target.value }))}
                            variant="outlined"
                            multiline
                            rows={3}
                            placeholder="Döküman hakkında kısa açıklama..."
                            sx={{ 
                                mb: 3,
                                '& .MuiInputLabel-root': {
                                    color: '#1a1a1a',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2'
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#e0e0e0'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2'
                                    },
                                    '& textarea': {
                                        color: '#1a1a1a',
                                        fontSize: '1rem'
                                    }
                                }
                            }}
                        />
                        
                        <Box sx={{ mb: 3 }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    mb: 2, 
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    fontSize: '1rem'
                                }}
                            >
                                Döküman Türü
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={documentFormData.type}
                                        onChange={(e) => setDocumentFormData(prev => ({ ...prev, type: e.target.value }))}
                                        row
                                    >
                                        <FormControlLabel 
                                            value="url" 
                                            control={<Radio />} 
                                            label="URL ile Ekle" 
                                        />
                                        <FormControlLabel 
                                            value="file" 
                                            control={<Radio />} 
                                            label="Dosya Yükle" 
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            {documentFormData.type === 'url' ? (
                                <Box>
                                    <TextField
                                        fullWidth
                                        label="PDF URL"
                                        placeholder="https://example.com/document.pdf"
                                        value={documentFormData.url || ''}
                                        onChange={(e) => setDocumentFormData(prev => ({ ...prev, url: e.target.value }))}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#fafafa',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }
                                        }}
                                    />
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            mt: 1, 
                                            color: '#666',
                                            fontSize: '0.85rem',
                                            display: 'block'
                                        }}
                                    >
                                        PDF dosyanızın URL adresini girin (Google Drive, Dropbox, vb.)
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                setDocumentFormData(prev => ({ 
                                                    ...prev, 
                                                    name: file.name.replace('.pdf', ''),
                                                    url: URL.createObjectURL(file)
                                                }));
                                            }
                                        }}
                                        style={{ display: 'none' }}
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<CloudUploadIcon />}
                                            sx={{
                                                width: '100%',
                                                py: 2,
                                                borderStyle: 'dashed',
                                                borderColor: '#1976d2',
                                                color: '#1976d2',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                    borderColor: '#1565c0'
                                                }
                                            }}
                                        >
                                            {selectedFile ? selectedFile.name : 'PDF Dosyası Seç'}
                                        </Button>
                                    </label>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            mt: 1, 
                                            color: '#666',
                                            fontSize: '0.85rem',
                                            display: 'block'
                                        }}
                                    >
                                        Sadece PDF dosyaları kabul edilir
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 4, pb: 3 }}>
                        <Button 
                            onClick={handleDocumentDialogClose}
                            variant="outlined"
                            sx={{ mr: 2 }}
                        >
                            İptal
                        </Button>
                        <Button 
                            onClick={async () => {
                                if (!documentFormData.name) {
                                    showNotification('Lütfen döküman adı girin', 'error');
                                    return;
                                }

                                let finalUrl = documentFormData.url;

                                // Eğer dosya yükleme seçildiyse
                                if (documentFormData.type === 'file' && selectedFile) {
                                    try {
                                        const formData = new FormData();
                                        formData.append('document', selectedFile);
                                        
                                        const response = await fetch('/api/upload/document', {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
                                            },
                                            body: formData
                                        });
                                        
                                        const data = await response.json();
                                        
                                        if (data.success) {
                                            finalUrl = data.url;
                                            console.log('[CardWizard] Dosya yüklendi:', data.url);
                                        } else {
                                            showNotification('Dosya yüklenemedi: ' + data.message, 'error');
                                            return;
                                        }
                                    } catch (error) {
                                        console.error('[CardWizard] Dosya yükleme hatası:', error);
                                        showNotification('Dosya yüklenemedi: ' + error.message, 'error');
                                        return;
                                    }
                                } else if (documentFormData.type === 'url') {
                                    // URL geçerliliğini kontrol et
                                    try {
                                        new URL(documentFormData.url);
                                    } catch {
                                        showNotification('Geçerli bir URL girin', 'error');
                                        return;
                                    }
                                } else {
                                    showNotification('Lütfen URL girin veya dosya seçin', 'error');
                                    return;
                                }

                                // Dökümanı kaydet
                                const newDocument = {
                                    name: documentFormData.name,
                                    description: documentFormData.description,
                                    type: 'application/pdf',
                                    size: selectedFile ? selectedFile.size : 0,
                                    url: finalUrl
                                };
                                
                                if (editingDocument) {
                                    const updatedDocuments = documents.map(doc => 
                                        doc === editingDocument ? newDocument : doc
                                    );
                                    setDocuments(updatedDocuments);
                                    setCardData(prev => ({ ...prev, documents: updatedDocuments }));
                                    
                                    // CardWizard'da dökümanlar sadece state'te tutuluyor
                                    // Final submit'te kaydedilecek
                                    console.log('[CardWizard] Döküman state\'te güncellendi, final submit\'te kaydedilecek');
                                } else {
                                    const newDocuments = [...documents, newDocument];
                                    setDocuments(newDocuments);
                                    setCardData(prev => ({ ...prev, documents: newDocuments }));
                                    console.log('[CardWizard] Yeni döküman eklendi:', newDocument);
                                    console.log('[CardWizard] Güncel documents:', newDocuments);
                                    
                                    // Veritabanına kaydet
                                    const saveData = { documents: newDocuments };
                                    console.log('[CardWizard] Kaydedilecek data:', saveData);
                                    console.log('[CardWizard] cardData.id:', cardData.id);
                                    
                                    // CardWizard'da dökümanlar sadece state'te tutuluyor
                                    // Final submit'te kaydedilecek
                                    console.log('[CardWizard] Döküman state\'e eklendi, final submit\'te kaydedilecek');
                                }
                                
                                setDocumentDialogOpen(false);
                                showNotification(editingDocument ? 'Döküman güncellendi' : 'Döküman eklendi', 'success');
                            }}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                                }
                            }}
                        >
                            {editingDocument ? 'Güncelle' : 'Ekle'}
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
                            color: '#1a1a1a',
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
                                color: '#1a1a1a',
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
            </Box>
        </Box>
    );
} 
