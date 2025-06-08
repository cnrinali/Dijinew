import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getThemeComponent } from './CardThemes';

const ThemePreview = ({ formData }) => {
    // Önizleme için sample data oluştur
    const previewData = {
        ...formData,
        // Eğer bazı alanlar boşsa örnek veriler ekle
        name: formData.name || 'Harun Aydemir',
        title: formData.title || 'CEO',
        company: formData.company || 'Örnek Şirket',
        phone: formData.phone || '+90 555 123 45 67',
        email: formData.email || 'harun@ornek.com',
        website: formData.website || 'https://orneksirket.com',
        bio: formData.bio || 'Dijital kartvizit ve teknoloji konularında uzman.',
        profileImageUrl: formData.profileImageUrl || 'https://via.placeholder.com/100x100?text=H',
        coverImageUrl: formData.coverImageUrl,
        linkedinUrl: formData.linkedinUrl || 'https://linkedin.com/in/harunaydemir',
        twitterUrl: formData.twitterUrl,
        instagramUrl: formData.instagramUrl,
        cardName: formData.cardName || 'Kartvizitim'
    };

    const ThemeComponent = getThemeComponent(formData.theme);

    return (
        <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
                Tema Önizlemesi
            </Typography>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                minHeight: '400px',
                '& > *': {
                    transform: 'scale(0.8)',
                    transformOrigin: 'top center'
                }
            }}>
                <ThemeComponent cardData={previewData} />
            </Box>
        </Paper>
    );
};

export default ThemePreview; 