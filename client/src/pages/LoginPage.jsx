import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';

// MUI Imports
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Stack,
    CircularProgress,
    Link
} from '@mui/material';
import {
    Login as LoginIcon,
    CreditCard as CardIcon
} from '@mui/icons-material';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { showNotification } = useNotification();

    const { email, password } = formData;

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.message, 'success');
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate, showNotification]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }
        if (!password) {
            showNotification('Lütfen şifrenizi girin.', 'error');
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Bir hata oluştu';
            if (errorMsg.toLowerCase().includes('invalid credentials') || errorMsg.toLowerCase().includes('geçersiz')) {
                showNotification('E-posta veya şifre hatalı.', 'error');
            } else {
                showNotification(`Giriş başarısız: ${errorMsg}`, 'error');
            }
            console.error('Giriş hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f5f5f5'
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <CardIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            Dijinew
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Dijital Kartvizit Platformu
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={onSubmit} noValidate>
                        <Stack spacing={2}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="E-posta Adresi"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={onChange}
                                disabled={loading}
                            />
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Şifre"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={onChange}
                                disabled={loading}
                            />
                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                sx={{ mt: 2, py: 1.5 }}
                            >
                                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Link
                                    component={RouterLink}
                                    to="/forgot-password"
                                    variant="body2"
                                >
                                    Şifremi Unuttum
                                </Link>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default LoginPage; 