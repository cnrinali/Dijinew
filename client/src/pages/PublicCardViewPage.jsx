import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import cardService from '../services/cardService';
import { getThemeComponent } from '../components/CardThemes';

// MUI Imports
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

function PublicCardViewPage() {
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { slug } = useParams();
    console.log('Slug or ID:', slug);

    // Tema uyumlu arka plan renklerini belirle
    const getBackgroundStyle = (theme) => {
        switch (theme) {
            case 'dark':
            case 'darkmodern':
                return {
                    background: '#0a0a0a',
                    minHeight: '100vh',
                    color: 'white'
                };
            case 'blue':
                return {
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    minHeight: '100vh'
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
            case 'minimalist':
                return {
                    background: '#fefefe',
                    minHeight: '100vh'
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
        const fetchPublicCard = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await cardService.getPublicCard(slug);
                console.log('[PublicCardViewPage] Gelen Kart Verisi:', data);
                setCardData(data);
            } catch (err) {
                console.error("Herkese açık kartvizit getirilirken hata:", err);
                const errorMsg = err.response?.data?.message || 'Kartvizit yüklenemedi.';
                setError(errorMsg); // Hata mesajını API'den veya varsayılan olarak ayarla
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPublicCard();
        } else {
            setError('Kartvizit kimliği veya özel URL belirtilmemiş.');
            setLoading(false);
        }
    }, [slug]);

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
        // 404 durumunda daha kullanıcı dostu bir mesaj gösterilebilir
        const message = error.toLowerCase().includes('bulunamadı') || error.toLowerCase().includes('not found')
            ? 'Aradığınız kartvizit bulunamadı veya aktif değil.'
            : `Hata: ${error}`;
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}>
                <Alert severity="error">{message}</Alert>
            </Box>
        );
    }

    if (!cardData) {
        // Genellikle error state'i bu durumu yakalar ama ek kontrol
        return (
            <Box sx={{ 
                minHeight: '100vh',
                background: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2
            }}>
                <Alert severity="warning">Kartvizit bilgileri alınamadı.</Alert>
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

// Eski stil objesi kaldırıldı
// const styles = { ... };

export default PublicCardViewPage; 