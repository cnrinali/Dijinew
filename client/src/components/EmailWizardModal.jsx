import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    InputAdornment,
    Alert
} from '@mui/material';
import {
    Email as EmailIcon,
    Link as LinkIcon,
    ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import simpleWizardService from '../services/simpleWizardService';
import { useNotification } from '../context/NotificationContext';

export default function EmailWizardModal({ open, onClose, wizardType = 'admin' }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [wizardCreated, setWizardCreated] = useState(false);
    const [wizardUrl, setWizardUrl] = useState('');
    const { showNotification } = useNotification();

    const handleCreateWizard = async () => {
        try {
            setLoading(true);
            const response = await simpleWizardService.createSimpleWizard(email);
            
            if (response.success) {
                setWizardUrl(response.data.wizardUrl);
                setWizardCreated(true);
                showNotification('Sihirbaz linki başarıyla oluşturuldu!', 'success');
            }
        } catch (error) {
            console.error('Sihirbaz oluşturma hatası:', error);
            showNotification(error.response?.data?.message || 'Sihirbaz oluşturulamadı.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(wizardUrl);
            } else {
                // Fallback for older browsers or non-HTTPS
                const textArea = document.createElement('textarea');
                textArea.value = wizardUrl;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            showNotification('Link kopyalandı!', 'success');
        } catch (error) {
            showNotification('Link kopyalanamadı.', 'error');
        }
    };

    const handleClose = () => {
        // Modal'ı sıfırla
        setEmail('');
        setWizardCreated(false);
        setWizardUrl('');
        setLoading(false);
        onClose();
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="primary" />
                    <Typography variant="h6">
                        {wizardCreated ? 'Sihirbaz Linki Oluşturuldu' : 'Sihirbaz Oluştur'}
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                {!wizardCreated ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            {wizardType === 'corporate' 
                                ? 'Çalışanınız için kartvizit oluşturma sihirbazı oluşturun. Email adresi isteğe bağlıdır.'
                                : 'Kullanıcı için kartvizit oluşturma sihirbazı oluşturun. Email adresi isteğe bağlıdır.'
                            }
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="Email Adresi (İsteğe Bağlı)"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@email.com"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                )
                            }}
                            helperText="Email adresi belirtilirse, kartvizit bu email ile ön tanımlı olacak"
                            error={email.length > 0 && !isValidEmail(email)}
                        />
                        
                        {email.length > 0 && !isValidEmail(email) && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                Geçerli bir email adresi giriniz.
                            </Alert>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Sihirbaz linki başarıyla oluşturuldu! Bu linki paylaşarak kartvizit oluşturma işlemini başlatabilirsiniz.
                            {email && (
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                    📧 Link ayrıca {email} adresine de gönderildi.
                                </Typography>
                            )}
                        </Alert>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Oluşturulan sihirbaz linki:
                        </Typography>
                        
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: 'grey.50', 
                            borderRadius: 1, 
                            border: '1px solid',
                            borderColor: 'grey.300',
                            mb: 2
                        }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    wordBreak: 'break-all',
                                    fontFamily: 'monospace'
                                }}
                            >
                                {wizardUrl}
                            </Typography>
                        </Box>
                        
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopyLink}
                            sx={{ mb: 2 }}
                        >
                            Linki Kopyala
                        </Button>
                        
                        <Alert severity="info">
                            <Typography variant="caption">
                                ⚠️ Bu link 30 gün boyunca geçerlidir ve tek kullanımlıktır.
                            </Typography>
                        </Alert>
                    </Box>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={handleClose}>
                    {wizardCreated ? 'Kapat' : 'İptal'}
                </Button>
                {!wizardCreated && (
                    <Button 
                        variant="contained" 
                        onClick={handleCreateWizard}
                        disabled={loading || (email.length > 0 && !isValidEmail(email))}
                        startIcon={loading ? <CircularProgress size={20} /> : <LinkIcon />}
                    >
                        {loading ? 'Oluşturuluyor...' : 'Sihirbaz Oluştur'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
