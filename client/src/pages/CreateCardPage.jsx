import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

function CreateCardPage() {
    const [formData, setFormData] = useState({
        // Form alanları (card.controller.js'deki createCard ile uyumlu olmalı)
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
        // Yeni sosyal medya alanları
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
    });
    const [loading, setLoading] = useState(false);
    const [profileImageLoading, setProfileImageLoading] = useState(false);
    const [coverImageLoading, setCoverImageLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    // Gizli file inputlarına erişmek için ref'ler
    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const onChange = (e) => {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            setFormData((prevState) => ({ ...prevState, [e.target.name]: file })); // State'e dosyayı ata

            // Dosya seçildi, form state'ini güncelle
        } else {
            setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
        }
    };

    // Dosya yükleme işlemi
    const uploadFileHandler = async (file, fieldName) => {
        const fileFormData = new FormData(); // İsim çakışmasını önlemek için farklı isim
        fileFormData.append('image', file); // Backend 'image' adını bekliyor

        // İlgili loading state'ini ayarla
        if (fieldName === 'profileImageUrl') setProfileImageLoading(true);
        if (fieldName === 'coverImageUrl') setCoverImageLoading(true);
        setUploadError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Yükleme endpoint'i korumalıysa token eklenmeli
                },
            };

            const { data } = await axios.post('/api/upload', fileFormData, config);

            // Gelen dosya yolunu state'e kaydet
            setFormData((prevState) => ({
                ...prevState,
                [fieldName]: data.filePath, // Backend'den gelen path
            }));

        } catch (err) {
            console.error('Dosya yükleme hatası:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Dosya yüklenemedi';
            setUploadError(errorMsg);
        } finally {
            // İlgili loading state'ini kapat
            if (fieldName === 'profileImageUrl') setProfileImageLoading(false);
            if (fieldName === 'coverImageUrl') setCoverImageLoading(false);
        }
    };

    // Dosya seçildiğinde tetiklenir
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fieldName = e.target.name; // Input'un name'inden field adını al
        if (file) {
            uploadFileHandler(file, fieldName);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadError('');

        // FormData'ya tüm alanları ekleyelim
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') { // null veya boş olmayanları ekle
                 data.append(key, formData[key]);
            }
        });

        try {
            const response = await cardService.createCard(data);
            showNotification('Kart başarıyla oluşturuldu!', 'success');
            navigate(`/cards/edit/${response.data.card.id}`);
        } catch (error) {
            let errorMsg = 'Kart oluşturulurken bir hata oluştu.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
                // Özel slug hatasını daha anlaşılır yapalım
                if (errorMsg.toLowerCase().includes('slug already exists')) {
                    errorMsg = 'Girdiğiniz özel URL zaten kullanılıyor.';
                }
                // Bireysel kullanıcı kart limiti hatası
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
        // Container formu ortalar ve genişliği sınırlar
        <Container component="main" maxWidth="md"> 
             <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4 }}> { /* İçerik etrafına padding ve arkaplan */}
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Yeni Kartvizit Oluştur
                </Typography>
                {/* Yükleme Hata Mesajı */}
                {uploadError && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {`Dosya yükleme hatası: ${uploadError}`}
                    </Alert>
                )}

                <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}> { /* Form elemanları için Grid */} 
                        {/* Dosya Yükleme Alanları */}
                        <Grid xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" gutterBottom>Profil Fotoğrafı</Typography>
                            <Avatar
                                src={formData.profileImageUrl || '/placeholder-avatar.png'} // Eğer URL varsa göster, yoksa placeholder
                                sx={{ width: 150, height: 150, mb: 2 }}
                            />
                            {/* Gizli Dosya Inputu */}
                            <input
                                type="file"
                                name="profileImageUrl" // Backend'e gönderilecek field adı
                                ref={profileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="image/*" // Sadece resim dosyaları
                            />
                            {/* Dosya Seçme Butonu */}
                            <Button
                                variant="outlined"
                                onClick={() => profileInputRef.current.click()} // Gizli input'u tetikle
                                disabled={profileImageLoading || loading}
                                startIcon={profileImageLoading ? <CircularProgress size={20} /> : null}
                            >
                                {profileImageLoading ? 'Yükleniyor...' : 'Profil Fotoğrafı Seç'}
                            </Button>
                        </Grid>
                        <Grid xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" gutterBottom>Kapak Fotoğrafı</Typography>
                            <CardMedia
                                component="img"
                                image={formData.coverImageUrl || '/placeholder-cover.png'} // Eğer URL varsa göster, yoksa placeholder
                                alt="Kapak Fotoğrafı Önizlemesi"
                                sx={{ width: '100%', height: 150, objectFit: 'cover', mb: 2, borderRadius: 1 }} // Yükseklik sabit, genişlik 100%
                            />
                            {/* Gizli Dosya Inputu */}
                            <input
                                type="file"
                                name="coverImageUrl" // Backend'e gönderilecek field adı
                                ref={coverInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />
                             {/* Dosya Seçme Butonu */}
                            <Button
                                variant="outlined"
                                onClick={() => coverInputRef.current.click()} // Gizli input'u tetikle
                                disabled={coverImageLoading || loading}
                                startIcon={coverImageLoading ? <CircularProgress size={20} /> : null}
                            >
                                {coverImageLoading ? 'Yükleniyor...' : 'Kapak Fotoğrafı Seç'}
                            </Button>
                        </Grid>

                        {/* Diğer Form Alanları */}
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
                                multiline // Çok satırlı metin alanı
                                rows={3} // Yüksekliği
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
                                label="Özel URL (isteğe bağlı)"
                                value={formData.customSlug}
                                onChange={onChange}
                                disabled={loading}
                                helperText="Sadece küçük harf, rakam ve tire kullanın (örn: caner-inali). Benzersiz olmalı."
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

                        {/* Sosyal Medya Linkleri */} 
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
                        disabled={loading || profileImageLoading || coverImageLoading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Kartviziti Oluştur'}
                    </Button>
                </Box>
             </Paper>
        </Container>
    );
}

export default CreateCardPage; 