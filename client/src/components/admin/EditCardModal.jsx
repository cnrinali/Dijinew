import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as adminService from '../../services/adminService'; // Admin servisi
import { useNotification } from '../../context/NotificationContext.jsx'; // Eklendi

// MUI Imports
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
    CircularProgress, /* Alert, */ Box, Switch, FormControlLabel, Grid, // Alert kaldırıldı
    InputAdornment // İkonlar için
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

// Bu modal, mevcut Create/Edit sayfalarına çok benzeyecek.

function EditCardModal({ open, onClose, card, onUpdateSuccess }) {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(''); // Kaldırıldı
    const { showNotification } = useNotification(); // Eklendi

    // Kart verisi değiştiğinde veya modal açıldığında formu doldur
    useEffect(() => {
        if (card) {
            setFormData({
                cardName: card.cardName || '',
                profileImageUrl: card.profileImageUrl || '',
                coverImageUrl: card.coverImageUrl || '',
                name: card.name || '',
                title: card.title || '',
                company: card.company || '',
                bio: card.bio || '',
                phone: card.phone || '',
                email: card.email || '',
                website: card.website || '',
                address: card.address || '',
                theme: card.theme || 'light', // Varsayılan 'light' olabilir
                customSlug: card.customSlug || '',
                isActive: card.isActive ?? true, 
                linkedinUrl: card.linkedinUrl || '',
                twitterUrl: card.twitterUrl || '',
                instagramUrl: card.instagramUrl || '',
            });
            // setError(''); // Kaldırıldı
        } else {
            setFormData({}); 
        }
    }, [card]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        // Switch için özel kontrol (Boolean olması için)
        const newValue = type === 'switch' ? checked : value; 
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        // setError(''); // Kaldırıldı

        try {
             const dataToSend = {
                 ...formData,
                 isActive: Boolean(formData.isActive) 
             };
            console.log("Gönderilen Kart Verisi (Admin):", dataToSend);
            const result = await adminService.updateAnyCard(card.id, dataToSend);
            console.log("Kart Güncelleme Yanıtı (Admin):", result);
            showNotification('Kart bilgileri başarıyla güncellendi.', 'success'); // Başarı bildirimi
            onUpdateSuccess(result.card); // Parent'ı bilgilendir
            // onClose(); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Kart güncellenirken bir hata oluştu.';
            // setError(errorMsg); // Değiştirildi
            showNotification(errorMsg, 'error'); // Hata bildirimi
            console.error("Admin Edit Card Error:", err.response || err);
        } finally {
            setLoading(false);
        }
    };

    if (!open || !card) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Kartvizit Düzenle (ID: {card.id} - Sahip: {card.userName || 'Bilinmiyor'})</DialogTitle> {/* userName eklendi (varsa) */}
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {/* {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} // Kaldırıldı */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="cardName" label="Kart Adı" fullWidth value={formData.cardName || ''} onChange={handleChange} disabled={loading} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <FormControlLabel
                                control={<Switch checked={Boolean(formData.isActive)} onChange={handleChange} name="isActive" disabled={loading} />} // Boolean'a çevir
                                label="Aktif/Pasif"
                                sx={{ mt: 1 }}
                             />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="name" label="İsim Soyisim" fullWidth value={formData.name || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="title" label="Unvan" fullWidth value={formData.title || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="company" label="Şirket" fullWidth value={formData.company || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                         <Grid item xs={12}>
                            <TextField margin="dense" name="bio" label="Hakkında" fullWidth multiline rows={3} value={formData.bio || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="phone" label="Telefon" fullWidth value={formData.phone || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="email" label="E-posta" type="email" fullWidth value={formData.email || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="website" label="Web Sitesi" fullWidth value={formData.website || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="address" label="Adres" fullWidth value={formData.address || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="profileImageUrl" label="Profil Resmi URL" fullWidth value={formData.profileImageUrl || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="coverImageUrl" label="Kapak Resmi URL" fullWidth value={formData.coverImageUrl || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField margin="dense" name="customSlug" label="Özel URL (örn: benim-kartim)" helperText="Sadece harf, rakam ve tire. Boş bırakılabilir." fullWidth value={formData.customSlug || ''} onChange={handleChange} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                             <TextField margin="dense" name="theme" label="Tema (şimdilik metin)" fullWidth value={formData.theme || ''} onChange={handleChange} disabled={loading} />
                         </Grid>
                         <Grid item xs={12} sm={4}>
                             <TextField
                                margin="dense" name="linkedinUrl" label="LinkedIn URL" fullWidth value={formData.linkedinUrl || ''} onChange={handleChange} disabled={loading}
                                InputProps={{ startAdornment: <InputAdornment position="start"><LinkedInIcon /></InputAdornment> }}
                            />
                         </Grid>
                          <Grid item xs={12} sm={4}>
                             <TextField
                                margin="dense" name="twitterUrl" label="Twitter URL" fullWidth value={formData.twitterUrl || ''} onChange={handleChange} disabled={loading}
                                InputProps={{ startAdornment: <InputAdornment position="start"><TwitterIcon /></InputAdornment> }}
                            />
                         </Grid>
                          <Grid item xs={12} sm={4}>
                             <TextField
                                margin="dense" name="instagramUrl" label="Instagram URL" fullWidth value={formData.instagramUrl || ''} onChange={handleChange} disabled={loading}
                                InputProps={{ startAdornment: <InputAdornment position="start"><InstagramIcon /></InputAdornment> }}
                            />
                         </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={loading}>İptal</Button>
                    <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

EditCardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  card: PropTypes.object, 
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default EditCardModal; 