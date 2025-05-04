import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from '../context/NotificationContext.jsx';

// MUI Imports
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import KeyIcon from '@mui/icons-material/Key'; // Şifre ikonu
import CircularProgress from '@mui/material/CircularProgress';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { resetToken } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    useEffect(() => {
        let timer;
        if (isSuccess) {
            timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [isSuccess, navigate]);

    const onChange = (e) => {
        if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else if (e.target.name === 'password2') {
            setPassword2(e.target.value);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            showNotification('Yeni şifreler eşleşmiyor!', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Yeni şifre en az 6 karakter olmalıdır.', 'error');
            return;
        }

        if (!resetToken) {
            showNotification('Geçersiz veya eksik şifre sıfırlama anahtarı.', 'error');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.resetPassword({ resetToken, password });
            showNotification((response.message || 'Şifre başarıyla güncellendi.') + ' Giriş sayfasına yönlendiriliyorsunuz...', 'success');
            setPassword('');
            setPassword2('');
            setIsSuccess(true);

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Bir hata oluştu';
            showNotification(`Şifre güncellenemedi: ${errorMsg}`, 'error');
            console.error('Şifre güncelleme hatası:', err.response?.data || err);
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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <KeyIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Yeni Şifre Belirle
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Yeni Şifre"
                        type="password"
                        id="password"
                        autoFocus
                        value={password}
                        onChange={onChange}
                        disabled={loading || isSuccess}
                    />
                     <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Yeni Şifre (Tekrar)"
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={onChange}
                        disabled={loading || isSuccess}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading || isSuccess}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Şifreyi Güncelle'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default ResetPasswordPage; 