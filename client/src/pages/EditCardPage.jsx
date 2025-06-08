import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cardService from '../services/cardService';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext.jsx';
import ThemePreview from '../components/ThemePreview';

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
        profileImage: null,
        coverImage: null,
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    
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

        if (cardId) {
            fetchCardData();
        } else {
            showNotification('Kart ID bulunamadı.', 'error');
            setPageLoading(false);
            navigate('/cards');
        }
    }, [cardId, navigate, showNotification]);

    const onChange = (e) => {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            const name = e.target.name;
            setFormData((prevState) => ({ ...prevState, [name]: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                if (name === 'profileImage') setProfilePreview(reader.result);
                else if (name === 'coverImage') setCoverPreview(reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            } else {
                if (name === 'profileImage') setProfilePreview(formData.profileImageUrl || null);
                else if (name === 'coverImage') setCoverPreview(formData.coverImageUrl || null);
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
                axios.post('/api/upload', profileFormData, { headers: { 'Content-Type': 'multipart/form-data' } })
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
                axios.post('/api/upload', coverFormData, { headers: { 'Content-Type': 'multipart/form-data' } })
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
                 }
             } else if (axios.isCancel(err)) { 
                 errorMsg = 'İşlem iptal edildi.';
             } else if (err.message.includes('Network Error')) {
                 errorMsg = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
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

    return (
        <Container component="main" maxWidth="md">
             <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4, mb: 4 }}>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Kartviziti Düzenle
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid xs={12} sx={{ textAlign: 'right' }}>
                             <FormControlLabel
                                control={<Switch checked={formData.isActive} onChange={onChange} name="isActive" />}
                                label="Kart Aktif" 
                                labelPlacement="start"
                                disabled={formLoading}
                                sx={{ mb: 1 }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" gutterBottom>Profil Fotoğrafı</Typography>
                            <Avatar src={profilePreview || '/placeholder-avatar.png'} sx={{ width: 150, height: 150, mb: 2, border: '1px solid lightgrey' }} />
                            <input type="file" name="profileImage" ref={profileInputRef} onChange={onChange} style={{ display: 'none' }} accept="image/*" />
                            <Button variant="outlined" onClick={() => profileInputRef.current.click()} disabled={formLoading}>
                                {formData.profileImageUrl || profilePreview ? 'Değiştir' : 'Profil Resmi Seç'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { xs: 2, sm: 0 } }}>
                            <Typography variant="h6" gutterBottom>Kapak Fotoğrafı</Typography>
                            <CardMedia
                                component="img"
                                image={coverPreview || '/placeholder-cover.png'}
                                alt="Kapak Fotoğrafı Önizlemesi"
                                sx={{ width: '100%', height: 150, objectFit: 'cover', mb: 2, borderRadius: 1, border: '1px solid lightgrey' }}
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
                            >
                                {formData.coverImageUrl || coverPreview ? 'Kapak Fotoğrafını Değiştir' : 'Kapak Fotoğrafı Seç'}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
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
                                disabled={formLoading}
                                helperText="Boş bırakırsanız veya değiştirmezseniz mevcut kalır. Sadece küçük harf, rakam ve tire kullanın."
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
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

                        {/* Tema Önizlemesi */}
                        <Grid xs={12}>
                            <ThemePreview formData={formData} />
                        </Grid>

                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={formLoading || pageLoading}
                    >
                        {formLoading ? <CircularProgress size={24} /> : 'Değişiklikleri Kaydet'}
                    </Button>
                </Box>
             </Paper>
        </Container>
    );
}

export default EditCardPage; 