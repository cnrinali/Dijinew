import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

// MUI Imports
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'; // Kayıt ikonu
import CircularProgress from '@mui/material/CircularProgress';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showNotification } = useNotification();

    const { name, email, password, password2 } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Client-Side Doğrulamalar
        if (!name || !email || !password || !password2) {
            showNotification('Lütfen tüm alanları doldurun.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }
         if (password.length < 6) { // Minimum 6 karakter kontrolü
            showNotification('Şifre en az 6 karakter olmalıdır.', 'error');
            return;
        }
        if (password !== password2) {
            showNotification('Şifreler eşleşmiyor!', 'error');
            return; // setLoading(true) öncesi return
        }

        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/login', { state: { message: 'Kayıt başarılı! Lütfen giriş yapın.' } }); 
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Bir hata oluştu';
            // Backend'den gelen yaygın hataları yakala
            if (errorMsg.toLowerCase().includes('email already exists') || errorMsg.toLowerCase().includes('eposta zaten mevcut')) {
                 showNotification('Bu e-posta adresi zaten kayıtlı.', 'error');
            } else {
                 showNotification(`Kayıt başarısız: ${errorMsg}`, 'error');
            }
            console.error('Kayıt hatası:', error);
            setLoading(false); // Hata durumunda loading'i kapat
        } 
        // finally bloğu kaldırıldı, çünkü başarılı durumda navigate oluyor, 
        // hata durumunda ise catch içinde setLoading(false) çağrılıyor.
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}> { /* Farklı renk */} 
                    <AppRegistrationIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Kayıt Ol
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="İsim Soyisim"
                                autoFocus
                                value={name}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Adresi"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Şifre"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </Grid>
                         <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password2"
                                label="Şifre Tekrar"
                                type="password"
                                id="password2"
                                autoComplete="new-password"
                                value={password2}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Kayıt Ol'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Zaten hesabınız var mı? Giriş Yapın
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default RegisterPage; 