import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import authService from '../services/authService';
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
import LockResetIcon from '@mui/icons-material/LockReset'; // İkon
import CircularProgress from '@mui/material/CircularProgress';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const onChange = (e) => {
        setEmail(e.target.value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }
        
        setLoading(true);

        try {
            const response = await authService.forgotPassword({ email });
            showNotification(response.message || 'Sıfırlama bağlantısı gönderildi (eğer e-posta kayıtlıysa).', 'success'); 
            setEmail(''); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Bir hata oluştu';
            showNotification(`İstek gönderilemedi: ${errorMsg}`, 'error');
            console.error('Şifre sıfırlama isteği hatası:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
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
                <Avatar sx={{ m: 1, bgcolor: 'warning.main' }}> { /* Uyarı rengi */} 
                    <LockResetIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Şifremi Unuttum
                </Typography>
                 <Typography variant="body2" align="center" sx={{ mt: 1, mb: 2 }}>
                    Kayıtlı e-posta adresinizi girin. Size şifrenizi sıfırlamanız için bir bağlantı göndereceğiz (eğer e-posta kayıtlıysa).
                 </Typography>
                <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Adresi"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={onChange}
                        disabled={loading}
                        type="email"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sıfırlama Bağlantısı Gönder'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Giriş sayfasına dön
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default ForgotPasswordPage; 