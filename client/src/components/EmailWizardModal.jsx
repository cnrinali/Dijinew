import React, { useState, Fragment } from 'react';
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
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider
} from '@mui/material';
import {
    Email as EmailIcon,
    Link as LinkIcon,
    ContentCopy as ContentCopyIcon,
    QrCode as QrCodeIcon,
    Download as DownloadIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import simpleWizardService from '../services/simpleWizardService';
import { useNotification } from '../context/NotificationContext';
import { QRCodeSVG } from 'qrcode.react';
import JSZip from 'jszip';

export default function EmailWizardModal({ open, onClose, wizardType = 'admin' }) {
    const [email, setEmail] = useState('');
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [wizardCreated, setWizardCreated] = useState(false);
    const [wizardUrls, setWizardUrls] = useState([]);
    const { showNotification } = useNotification();

    const handleCreateWizard = async () => {
        try {
            setLoading(true);
            const urls = [];
            
            // Belirtilen sayıda sihirbaz linki oluştur
            for (let i = 0; i < count; i++) {
                        const response = await simpleWizardService.createSimpleWizard(email);
                        console.log('🧙‍♂️ Wizard creation response:', response);
                
                if (response.success) {
                    // Hem ID hem slug ile kart URL'si oluştur (permanentSlug öncelikli)
                    const cardId = response.data.cardId;
                    const cardSlug = response.data.cardSlug; // customSlug (değişebilir)
                    const permanentSlug = response.data.permanentSlug; // permanent UUID (asla değişmez)
                    
                    // Primary: Permanent UUID slug ile URL (kalıcı ve hiç değişmez)
                    const cardUrlByPermanentSlug = permanentSlug ? `${window.location.origin}/card/${permanentSlug}` : null;
                    // Secondary: Custom slug ile URL (kullanıcı değiştirebilir)
                    const cardUrlBySlug = cardSlug ? `${window.location.origin}/card/${cardSlug}` : null;
                    // Fallback: ID ile URL 
                    const cardUrlById = `${window.location.origin}/card/${cardId}`;
                    
                    urls.push({
                        id: i + 1,
                        url: response.data.wizardUrl,
                        email: email || `Kişi ${i + 1}`,
                        // QR kod için permanent UUID slug kullan (kalıcı ve hiç değişmez)
                        qrValue: cardUrlByPermanentSlug || cardUrlById,
                        cardId: cardId,
                        cardSlug: cardSlug,
                        permanentSlug: permanentSlug,
                        cardUrl: cardUrlByPermanentSlug || cardUrlById,
                        cardUrlBySlug: cardUrlBySlug,
                        cardUrlById: cardUrlById
                    });
                }
            }
            
            if (urls.length > 0) {
                setWizardUrls(urls);
                setWizardCreated(true);
                showNotification(`${urls.length} adet sihirbaz linki başarıyla oluşturuldu!`, 'success');
            }
        } catch (error) {
            console.error('Sihirbaz oluşturma hatası:', error);
            showNotification(error.response?.data?.message || 'Sihirbaz oluşturulamadı.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = async (url) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                // Fallback for older browsers or non-HTTPS
                const textArea = document.createElement('textarea');
                textArea.value = url;
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
        } catch {
            showNotification('Link kopyalanamadı.', 'error');
        }
    };

    const handleCopyAllLinks = async () => {
        try {
            const allUrls = wizardUrls.map((item, index) => {
                let text = `${index + 1}. ${item.email}:\n🔗 Sihirbaz: ${item.url}`;
                if (item.cardUrl) {
                    text += `\n🌐 Kart (UUID): ${item.cardUrl}`;
                    if (item.cardUrlById && item.cardUrlById !== item.cardUrl) {
                        text += `\n📊 Kart (ID): ${item.cardUrlById}`;
                    }
                    text += `\n📱 QR Kod → UUID linke yönlendirir`;
                }
                return text;
            }).join('\n\n');
            
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(allUrls);
            } else {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = allUrls;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            showNotification('Tüm linkler kopyalandı!', 'success');
        } catch {
            showNotification('Linkler kopyalanamadı.', 'error');
        }
    };

    // Tek QR kod indirme
    const handleDownloadQR = async (item) => {
        try {
            if (!item.qrValue && !item.url) return;
            
            // SVG'yi canvas'a çevir ve PNG olarak indir
            const svg = document.querySelector(`#qr-${item.id}`);
            if (!svg) return;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const data = new XMLSerializer().serializeToString(svg);
            const DOMURL = window.URL || window.webkitURL || window;
            
            const img = new Image();
            const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
            const url = DOMURL.createObjectURL(svgBlob);
            
            img.onload = function () {
                // Daha büyük boyut (512x512)
                canvas.width = 512;
                canvas.height = 512;
                ctx.drawImage(img, 0, 0, 512, 512);
                DOMURL.revokeObjectURL(url);
                
                const imgURI = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                
                // Daha anlaşılır dosya adı: cardId-permanentSlug-email.png
                const cleanEmail = item.email.replace(/[^a-zA-Z0-9]/g, '-');
                const cardSlug = item.permanentSlug || item.cardSlug || 'unknown';
                const fileName = `qr-card-${item.cardId}-${cardSlug.substring(0, 8)}-${cleanEmail}.png`;
                
                link.download = fileName;
                link.href = imgURI;
                link.click();
            };
            
            img.src = url;
            showNotification('QR kod indirildi!', 'success');
        } catch {
            showNotification('QR kod indirilemedi.', 'error');
        }
    };

    // Tüm QR kodları zip olarak indirme
    const handleDownloadAllQRs = async () => {
        try {
            const zip = new JSZip();
            
            for (const item of wizardUrls) {
                if (item.qrValue || item.url) {
                    const svg = document.querySelector(`#qr-${item.id}`);
                    if (svg) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const data = new XMLSerializer().serializeToString(svg);
                        const DOMURL = window.URL || window.webkitURL || window;
                        
                        const img = new Image();
                        const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
                        const url = DOMURL.createObjectURL(svgBlob);
                        
                        await new Promise((resolve) => {
                            img.onload = function () {
                                // Daha büyük boyut (512x512)
                                canvas.width = 512;
                                canvas.height = 512;
                                ctx.drawImage(img, 0, 0, 512, 512);
                                DOMURL.revokeObjectURL(url);
                                
                                canvas.toBlob((blob) => {
                                    // Daha anlaşılır dosya adı: cardId-permanentSlug-email.png
                                    const cleanEmail = item.email.replace(/[^a-zA-Z0-9]/g, '-');
                                    const cardSlug = item.permanentSlug || item.cardSlug || 'unknown';
                                    const fileName = `qr-card-${item.cardId}-${cardSlug.substring(0, 8)}-${cleanEmail}.png`;
                                    zip.file(fileName, blob);
                                    resolve();
                                }, 'image/png');
                            };
                            img.src = url;
                        });
                    }
                }
            }
            
            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            
            // Daha anlaşılır ZIP dosya adı
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
            link.download = `dijinew-qr-kodlari-${wizardUrls.length}adet-${timestamp}.zip`;
            link.click();
            
            showNotification('Tüm QR kodlar ZIP olarak indirildi!', 'success');
        } catch {
            showNotification('QR kodlar indirilemedi.', 'error');
        }
    };

    const handleClose = () => {
        // Modal'ı sıfırla
        setEmail('');
        setCount(1);
        setWizardCreated(false);
        setWizardUrls([]);
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
                                ? 'Çalışanlarınız için kartvizit oluşturma sihirbazları oluşturun. Email adresi ve adet sayısını belirleyin.'
                                : 'Kullanıcılar için kartvizit oluşturma sihirbazları oluşturun. Email adresi ve adet sayısını belirleyin.'
                            }
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
                            
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Adet</InputLabel>
                                <Select
                                    value={count}
                                    label="Adet"
                                    onChange={(e) => setCount(e.target.value)}
                                >
                                    {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                                        <MenuItem key={num} value={num}>{num}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        
                        {email.length > 0 && !isValidEmail(email) && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                Geçerli bir email adresi giriniz.
                            </Alert>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {wizardUrls.length} adet sihirbaz linki başarıyla oluşturuldu! Bu linkleri paylaşarak kartvizit oluşturma işlemlerini başlatabilirsiniz.
                            {email && (
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                    📧 Linkler ayrıca {email} adresine de gönderildi.
                                </Typography>
                            )}
                        </Alert>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Oluşturulan sihirbaz linkleri ve QR kodları:
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {wizardUrls.length > 1 && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<ContentCopyIcon />}
                                        onClick={handleCopyAllLinks}
                                    >
                                        Linkleri Kopyala
                                    </Button>
                                )}
                                
                                {wizardUrls.length > 0 && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DownloadIcon />}
                                        onClick={handleDownloadAllQRs}
                                    >
                                        QR Kodları İndir
                                    </Button>
                                )}
                            </Box>
                        </Box>
                        
                        <List sx={{ 
                            bgcolor: 'grey.50', 
                            borderRadius: 1, 
                            border: '1px solid',
                            borderColor: 'grey.300',
                            mb: 2,
                            maxHeight: 300,
                            overflow: 'auto'
                        }}>
                            {wizardUrls.map((item, index) => (
                                <Fragment key={item.id}>
                                    <ListItem sx={{ flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', py: 2 }}>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', gap: 2 }}>
                                            {/* Sol taraf - Bilgiler */}
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    {item.id}. {item.email}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        wordBreak: 'break-all',
                                                        fontFamily: 'monospace',
                                                        color: 'text.secondary',
                                                        display: 'block'
                                                    }}
                                                >
                                                    🔗 Sihirbaz: {item.url}
                                                </Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        wordBreak: 'break-all',
                                                        fontFamily: 'monospace',
                                                        color: 'primary.main',
                                                        display: 'block',
                                                        mt: 0.5
                                                    }}
                                                >
                                                    🌐 Kart (UUID): {item.cardUrl}
                                                </Typography>
                                                {item.cardUrlById && item.cardUrlById !== item.cardUrl && (
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            wordBreak: 'break-all',
                                                            fontFamily: 'monospace',
                                                            color: 'text.secondary',
                                                            display: 'block',
                                                            mt: 0.5,
                                                            fontSize: '0.65rem'
                                                        }}
                                                    >
                                                        📊 Kart (ID): {item.cardUrlById}
                                                    </Typography>
                                                )}
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: 'secondary.main',
                                                        display: 'block',
                                                        mt: 0.5
                                                    }}
                                                >
                                                    📱 QR → UUID ile kalıcı kart linki
                                                </Typography>
                                            </Box>
                                            
                                            {/* Orta - QR Kod Görseli */}
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                bgcolor: 'white',
                                                p: 1.5,
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'grey.300',
                                                minWidth: 140
                                            }}>
                                                <QRCodeSVG 
                                                    id={`qr-${item.id}`}
                                                    value={item.qrValue || item.url}
                                                    size={120}
                                                    includeMargin={true}
                                                    level="M"
                                                />
                                                <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'center' }}>
                                                    QR Kod
                                                </Typography>
                                            </Box>
                                            
                                            {/* Sağ taraf - Butonlar */}
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1 }}>
                                                <IconButton 
                                                    onClick={() => handleCopyLink(item.url)}
                                                    size="small"
                                                    color="primary"
                                                    title="Sihirbaz Linkini Kopyala"
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                                <IconButton 
                                                    onClick={() => handleCopyLink(item.cardUrl)}
                                                    size="small"
                                                    color="info"
                                                    title="Kart UUID Linkini Kopyala"
                                                >
                                                    <QrCodeIcon />
                                                </IconButton>
                                                <IconButton 
                                                    onClick={() => handleDownloadQR(item)}
                                                    size="small"
                                                    color="success"
                                                    title="QR Kodu İndir (UUID Link)"
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    {index < wizardUrls.length - 1 && <Divider />}
                                </Fragment>
                            ))}
                        </List>
                        
                        <Alert severity="info">
                            <Typography variant="caption">
                                ⚠️ Bu linkler 30 gün boyunca geçerlidir ve tek kullanımlıktır.
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
                        {loading ? `${count} Sihirbaz Oluşturuluyor...` : `${count} Adet Sihirbaz Oluştur`}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
