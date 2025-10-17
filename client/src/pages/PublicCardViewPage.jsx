import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import cardService from '../services/cardService';
import simpleWizardService from '../services/simpleWizardService';
import { getThemeComponent } from '../components/CardThemes';

// MUI Imports
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';

function PublicCardViewPage() {
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    
    // Edit mode kontrolü
    const isEditMode = searchParams.get('edit') === '1';
    const token = searchParams.get('token');
    const [editModeValid, setEditModeValid] = useState(false);
    const [editModeLoading, setEditModeLoading] = useState(false);
    
    console.log('Slug or ID:', slug);
    console.log('Edit mode:', isEditMode, 'Token:', token);

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
        const fetchCardData = async () => {
            setLoading(true);
            setError('');
            try {
                let data;
                
                // Edit mode ise token ile veri al
                if (isEditMode && token) {
                    setEditModeLoading(true);
                    try {
                        const tokenResponse = await simpleWizardService.getCardByToken(token);
                        if (tokenResponse.success) {
                            data = tokenResponse.data;
                            setEditModeValid(true);
                            console.log('[PublicCardViewPage] Token ile alınan kart verisi:', data);
                        } else {
                            throw new Error(tokenResponse.message || 'Token geçersiz');
                        }
                    } catch (tokenErr) {
                        console.error('Token ile kart getirme hatası:', tokenErr);
                        setError(tokenErr.response?.data?.message || 'Geçersiz veya süresi dolmuş link.');
                        setEditModeValid(false);
                        return;
                    } finally {
                        setEditModeLoading(false);
                    }
                } else {
                    // Normal public view
                    data = await cardService.getPublicCard(slug);
                    console.log('[PublicCardViewPage] Public kart verisi:', data);
                }
                
                setCardData(data);
            } catch (err) {
                console.error("Kartvizit getirilirken hata:", err);
                const errorMsg = err.response?.data?.message || 'Kartvizit yüklenemedi.';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCardData();
        } else {
            setError('Kartvizit kimliği veya özel URL belirtilmemiş.');
            setLoading(false);
        }
    }, [slug, isEditMode, token]);

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
