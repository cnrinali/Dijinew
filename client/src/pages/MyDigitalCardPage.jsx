import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import cardService from '../services/cardService';
import { getThemeComponent } from '../components/CardThemes';

// MUI Imports
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

function MyDigitalCardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Sayfa başlığını ayarla
    useEffect(() => {
        document.title = 'Yeni Nesil Kartvizit Dijinew';
    }, []);

    // Tema uyumlu arka plan renklerini belirle
    const getBackgroundStyle = (theme) => {
        switch (theme) {
            case 'dark':
                return {
                    background: '#0a0a0a',
                    minHeight: '100vh',
                    color: 'white'
                };
            case 'modern':
                return {
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    minHeight: '100vh'
                };
            case 'creative':
                return {
                    background: 'linear-gradient(45deg, #FFF9E6, #F0F8FF, #F5F0FF)',
                    minHeight: '100vh'
                };
            case 'business':
                return {
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    minHeight: '100vh'
                };
            case 'icongrid':
                return {
                    background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
                    minHeight: '100vh'
                };
            case 'ovalcarousel':
                return {
                    background: 'linear-gradient(145deg, #0f172a 0%, #1f2937 50%, #0b1120 100%)',
                    minHeight: '100vh',
                    color: 'white'
                };
            case 'light':
            default:
                return {
                    background: '#f5f5f5',
                    minHeight: '100vh'
                };
        }
    };

    useEffect(() => {
        const fetchUserCards = async () => {
            if (!user) {
                setError('Giriş yapmanız gerekiyor.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const cards = await cardService.getCards();
                if (cards && cards.length > 0) {
                    // İlk aktif kartı al veya ilk kartı al
                    const activeCard = cards.find(card => card.isActive) || cards[0];
                    setCardData(activeCard);
                } else {
                    setError('Henüz hiç kartvizit oluşturmadınız.');
                }
            } catch (err) {
                console.error("Kartvizit getirilirken hata:", err);
                const errorMsg = err.response?.data?.message || 'Kartvizit yüklenemedi.';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchUserCards();
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                background: '#f5f5f5'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}>
                <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/cards')}
                        sx={{ mt: 2 }}
                    >
                        Kartlarım
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (!cardData) {
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}>
                <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>Kartvizit bilgileri alınamadı.</Alert>
                    <Button 
                        variant="contained" 
                        onClick={() => navigate('/cards')}
                        sx={{ mt: 2 }}
                    >
                        Kartlarım
                    </Button>
                </Paper>
            </Box>
        );
    }

    // Tema bileşenini seç ve render et
    const ThemeComponent = getThemeComponent(cardData.theme);
    const backgroundStyle = getBackgroundStyle(cardData.theme);
    
    return (
        <Box sx={{ 
            ...backgroundStyle,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: { xs: 2, sm: 3, md: 4 },
            boxSizing: 'border-box'
        }}>
            <ThemeComponent cardData={cardData} />
        </Box>
    );
}

export default MyDigitalCardPage;
