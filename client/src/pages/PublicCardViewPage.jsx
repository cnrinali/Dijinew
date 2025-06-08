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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        // 404 durumunda daha kullanıcı dostu bir mesaj gösterilebilir
        const message = error.toLowerCase().includes('bulunamadı') || error.toLowerCase().includes('not found')
            ? 'Aradığınız kartvizit bulunamadı veya aktif değil.'
            : `Hata: ${error}`;
        return <Alert severity="error" sx={{ m: 2 }}>{message}</Alert>;
    }

    if (!cardData) {
        // Genellikle error state'i bu durumu yakalar ama ek kontrol
        return <Alert severity="warning" sx={{ m: 2 }}>Kartvizit bilgileri alınamadı.</Alert>;
    }

    // Tema bileşenini seç ve render et
    const ThemeComponent = getThemeComponent(cardData.theme);
    
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 1, sm: 2, md: 3 } }}>
            <ThemeComponent cardData={cardData} />
        </Box>
    );
}

// Eski stil objesi kaldırıldı
// const styles = { ... };

export default PublicCardViewPage; 