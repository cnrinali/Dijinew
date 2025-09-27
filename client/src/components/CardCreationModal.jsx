import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import {
    AutoFixHigh as WizardIcon,
    Build as ManualIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const CardCreationModal = ({ open, onClose, onSelectMethod }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        Kartvizit Oluşturma Yöntemi Seçin
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 2 }}>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', textAlign: 'center' }}>
                    Kartvizitinizi nasıl oluşturmak istiyorsunuz?
                </Typography>
                
                <Grid container spacing={3}>
                    {/* Sihirbaz Seçeneği */}
                    <Grid item xs={12} md={6}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                height: '100%',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                            onClick={() => onSelectMethod('wizard')}
                        >
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3
                                    }}
                                >
                                    <WizardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                </Box>
                                
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Sihirbaz ile Oluştur
                                </Typography>
                                
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                    Adım adım rehberlik ile kolay ve hızlı kartvizit oluşturma. 
                                    Yeni başlayanlar için idealdir.
                                </Typography>
                                
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="caption" sx={{ 
                                        color: 'success.main', 
                                        fontWeight: 'medium',
                                        backgroundColor: 'success.50',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}>
                                        ⭐ Önerilen
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Manuel Seçeneği */}
                    <Grid item xs={12} md={6}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                height: '100%',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'secondary.main',
                                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.15)',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                            onClick={() => onSelectMethod('manual')}
                        >
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        backgroundColor: 'secondary.50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3
                                    }}
                                >
                                    <ManualIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                                </Box>
                                
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Manuel Oluştur
                                </Typography>
                                
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                    Tüm seçeneklere erişim ile detaylı kartvizit oluşturma. 
                                    Deneyimli kullanıcılar için idealdir.
                                </Typography>
                                
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="caption" sx={{ 
                                        color: 'secondary.main', 
                                        fontWeight: 'medium',
                                        backgroundColor: 'secondary.50',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}>
                                        🎛️ Gelişmiş
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button onClick={onClose} variant="outlined" size="large">
                    İptal
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CardCreationModal;
