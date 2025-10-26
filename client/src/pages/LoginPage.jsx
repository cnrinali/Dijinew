import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

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
    const { isDarkMode } = useTheme();

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
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                position: 'relative'
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: '#1a1a1a',
                        border: '2px solid #FFD700',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <img 
                                src="/img/dijinew_logo_light.png" 
                                alt="Dijinew Logo" 
                                style={{ 
                                    height: '60px', 
                                    width: 'auto',
                                    filter: 'brightness(0) invert(1)'
                                }} 
                            />
                        </Box>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: '#FFD700',
                                fontWeight: 500,
                                fontSize: '1.1rem'
                            }}
                        >
                            Dijinew Creative Agency
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#2a2a2a',
                                        '& fieldset': {
                                            borderColor: '#FFD700',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFA500',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#FFD700',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#ffffff',
                                    }
                                }}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#2a2a2a',
                                        '& fieldset': {
                                            borderColor: '#FFD700',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#FFA500',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#FFD700',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#FFD700',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#ffffff',
                                    }
                                }}
                            />
                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                sx={{ 
                                    mt: 2, 
                                    py: 1.5,
                                    backgroundColor: '#FFD700',
                                    color: '#1a1a1a',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        backgroundColor: '#FFA500',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Link
                                    component={RouterLink}
                                    to="/forgot-password"
                                    variant="body2"
                                    sx={{
                                        color: '#FFD700',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        '&:hover': {
                                            color: '#FFA500',
                                            textDecoration: 'underline'
                                        }
                                    }}
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