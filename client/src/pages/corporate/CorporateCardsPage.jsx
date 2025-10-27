import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getCorporateCards,
    getCorporateUsers,
    exportCompanyCardsToExcel,
    importCompanyCardsFromExcel
} from '../../services/corporateService';
import { useNotification } from '../../context/NotificationContext';
import wizardService from '../../services/wizardService';
import EmailWizardModal from '../../components/EmailWizardModal';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Tooltip,
    Avatar,
    LinearProgress,
    Stack,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    QrCode as QrCodeIcon,
    CardMembership as CardMembershipIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    ContentCopy as ContentCopyIcon,
    FileDownload as FileDownloadIcon,
    UploadFile as UploadFileIcon
} from '@mui/icons-material';

// Form data removed - now using /cards/new page

function CorporateCardsPage() {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [companyUsers, setCompanyUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const { showNotification } = useNotification();

    // Email Wizard Modal states
    const [emailWizardOpen, setEmailWizardOpen] = useState(false);

    // Excel Import Modal states
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importErrors, setImportErrors] = useState([]);
    const fileInputRef = useRef(null);

    // QR Code Modal states
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const fetchCards = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getCorporateCards();
            const cardsData = response?.success ? response.data : [];
            setCards(cardsData);
        } catch (err) {
            console.error("Şirket kartları getirilirken hata:", err);
            const errorMsg = err.message || 'Şirket kartları yüklenemedi.';
            setError(errorMsg);
            showNotification(errorMsg, 'error');
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const response = await getCorporateUsers({ brief: true });
            const usersData = response?.success ? response.data : [];
            setCompanyUsers(usersData);
        } catch (err) {
            console.error("Şirket kullanıcıları getirilirken hata:", err);
            showNotification(err.message || 'Şirket kullanıcıları yüklenemedi.', 'error');
            setCompanyUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchCards();
        fetchUsers();
    }, [fetchCards, fetchUsers]);

    // Sihirbaz Token Oluştur ve Linki Kopyala
    const handleCreateWizardLink = async () => {
        try {
            const response = await wizardService.createWizardToken('corporate', 7);
            const wizardUrl = response.data.wizardUrl;
            
            // Linki panoya kopyala
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
            
            showNotification(`Sihirbaz linki oluşturuldu ve kopyalandı! Link 7 gün süreyle geçerli.`, 'success');
        } catch (error) {
            console.error('Sihirbaz linki oluşturma hatası:', error);
            showNotification(error.response?.data?.message || 'Sihirbaz linki oluşturulamadı.', 'error');
        }
    };

    // Excel Export Fonksiyonu
    const handleExportExcel = async () => {
        try {
            await exportCompanyCardsToExcel();
            showNotification('Excel dosyası başarıyla indirildi!', 'success');
        } catch (error) {
            console.error('Excel export hatası:', error);
            showNotification(error.message || 'Excel dosyası indirilemedi.', 'error');
        }
    };

    // Excel Import Modal Fonksiyonları
    const handleOpenImportModal = () => {
        setSelectedFile(null);
        setImportErrors([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        setImportModalOpen(true);
    };

    const handleCloseImportModal = () => {
        setImportModalOpen(false);
    };

    // Kartvizit silme fonksiyonu
    const handleDeleteCard = async (card) => {
        if (window.confirm(`${card.name} kartvizitini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user?.token;
                
                // Corporate kullanıcıları için özel endpoint kullan
                const endpoint = user?.role === 'corporate' ? `/api/corporate/cards/${card.id}` : `/api/cards/${card.id}`;
                
                const response = await fetch(endpoint, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    showNotification('Kartvizit başarıyla silindi.', 'success');
                    fetchCards(); // Listeyi yenile
                } else {
                    const errorData = await response.json();
                    showNotification(errorData.message || 'Kartvizit silinemedi.', 'error');
                }
            } catch (err) {
                console.error('Kartvizit silinirken hata:', err);
                showNotification('Kartvizit silinirken bir hata oluştu.', 'error');
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
            setImportErrors([]);
        } else {
            setSelectedFile(null);
            showNotification('Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) seçin.', 'error');
        }
    };

    const handleImportSubmit = async () => {
        if (!selectedFile) {
            showNotification('Lütfen içeri aktarılacak Excel dosyasını seçin.', 'warning');
            return;
        }

        setImportLoading(true);
        setImportErrors([]);

        try {
            const result = await importCompanyCardsFromExcel(selectedFile);
            showNotification(result.message, 'success');
            setImportModalOpen(false);
            fetchCards(); // Kartları yeniden yükle
        } catch (error) {
            console.error('Excel import hatası:', error);
            showNotification(error.message || 'Excel dosyası yüklenemedi.', 'error');
        } finally {
            setImportLoading(false);
        }
    };

    // Modal functions removed - now navigating to /cards/new

    const getStatusChip = (isActive) => (
        <Chip
            label={isActive ? 'Aktif' : 'Pasif'}
            color={isActive ? 'success' : 'default'}
            size="small"
            variant="outlined"
        />
    );

    return (
        <Box sx={{ p: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #F4C734 0%, #000000 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <CardMembershipIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ 
                                    fontWeight: 700, 
                                    color: 'text.primary', 
                                    mb: 0.5,
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                }}>
                                    KURUMSAL KARTVİZİTLER
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}>
                                    Şirket kartvizitlerini yönetin ve düzenleyin
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Excel'e Aktar">
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={handleExportExcel}
                                    disabled={loading || cards.length === 0}
                                    sx={{ 
                                        backgroundColor: 'background.paper',
                                        color: 'text.primary',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'action.disabledBackground',
                                            color: 'action.disabled',
                                        }
                                    }}
                                >
                                    Excel'e Aktar
                                </Button>
                            </Tooltip>
                            <Tooltip title="Excel'den İçeri Aktar">
                                <Button
                                    variant="outlined"
                                    startIcon={<UploadFileIcon />}
                                    onClick={handleOpenImportModal}
                                    disabled={loading}
                                    sx={{ 
                                        backgroundColor: 'background.paper',
                                        color: 'text.primary',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'action.disabledBackground',
                                            color: 'action.disabled',
                                        }
                                    }}
                                >
                                    Excel'den İçeri Aktar
                                </Button>
                            </Tooltip>
                            <Tooltip title="Yenile">
                                <IconButton 
                                    onClick={fetchCards}
                                    disabled={loading}
                                    sx={{ 
                                        backgroundColor: 'background.paper',
                                        color: 'text.primary',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'action.disabledBackground',
                                            color: 'action.disabled',
                                        }
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
            </Box>
                    </Box>
                </Box>


                {/* Cards Table */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'background.paper',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {loading && <LinearProgress />}
                    
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Kartvizit Listesi
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Tüm şirket kartvizitlerinizi bu listede bulabilirsiniz
                </Typography>
                    </Box>

                    {error ? (
                        <Box sx={{ p: 3 }}>
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        </Box>
                    ) : cards.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <CardMembershipIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                                Henüz kartvizit yok
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                İlk kartvizitinizi oluşturmak için yukarıdaki butonları kullanın
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                        <TableHead>
                                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Kartvizit</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Kişi</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>İletişim</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>İstatistikler</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards.map((card) => (
                                        <TableRow key={card.id} sx={{ '&:hover': { backgroundColor: 'grey.50' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: 'primary.main',
                                                            fontSize: '1rem',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {card.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {card.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            {card.title || 'Ünvan belirtilmemiş'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {card.userName || 'Kullanıcı atanmamış'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        {card.userEmail || ''}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    {card.email && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="caption">{card.email}</Typography>
                                                        </Box>
                                                    )}
                                                    {card.phone && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="caption">{card.phone}</Typography>
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusChip(card.isActive)}
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {card.viewCount || 0} görüntülenme
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Son: {card.lastViewed ? new Date(card.lastViewed).toLocaleDateString('tr-TR') : 'Henüz görüntülenmedi'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="Görüntüle">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => window.open(`/card/${card.customSlug || card.permanentSlug}`, '_blank')}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="QR Kod">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedCard(card);
                                                                setQrModalOpen(true);
                                                            }}
                                                            sx={{ color: 'info.main' }}
                                                        >
                                                            <QrCodeIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Düzenle">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => navigate(`/cards/edit/${card.id}`)}
                                                            sx={{ color: 'warning.main' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Sil">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteCard(card)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
                </Paper>

                {/* Modal removed - now navigating to /cards/new */}

                {/* Email Wizard Modal */}
                <EmailWizardModal 
                    open={emailWizardOpen} 
                    onClose={() => setEmailWizardOpen(false)}
                    wizardType="corporate"
                />

                {/* QR Code Modal */}
                <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>QR Kod - {selectedCard?.name}</DialogTitle>
                    <DialogContent>
                        {selectedCard && (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    {selectedCard.name}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                                    QR kod ile kartvizitinizi paylaşın
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mb: 3,
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    backgroundColor: 'background.paper'
                                }}>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/card/${selectedCard.customSlug || selectedCard.permanentSlug}`}
                                        alt="QR Code"
                                        style={{ maxWidth: '200px', height: 'auto' }}
                                    />
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    QR kod tarayarak kartvizite erişebilirsiniz
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setQrModalOpen(false)}>Kapat</Button>
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                const qrUrl = `${window.location.origin}/qr/${selectedCard?.customSlug || selectedCard?.permanentSlug}`;
                                navigator.clipboard.writeText(qrUrl);
                                showNotification('Kartvizit linki panoya kopyalandı!', 'success');
                            }}
                        >
                            Linki Kopyala
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Excel Import Modal */}
                <Dialog open={importModalOpen} onClose={handleCloseImportModal} maxWidth="sm" fullWidth>
                    <DialogTitle>Excel'den Kartvizit İçeri Aktar</DialogTitle>
                    <DialogContent>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Excel dosyasında aşağıdaki sütunlar bulunmalıdır:
                            <br />• Kart Adı/Sahibi (zorunlu)
                            <br />• Ünvan
                            <br />• Email
                            <br />• Telefon
                            <br />• Web Sitesi
                            <br />• Adres
                            <br />• Durum (Aktif/Pasif)
                            <br />• Özel URL Slug
                        </Alert>
                        
                        <Box sx={{ mt: 2 }}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadFileIcon />}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Excel Dosyası Seç
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </Button>
                            
                            {selectedFile && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Seçilen dosya: {selectedFile.name}
                                </Alert>
                            )}
                            
                            {importErrors.length > 0 && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Hatalar:
                                    </Typography>
                                    {importErrors.map((error, index) => (
                                        <Typography key={index} variant="body2">
                                            • {error}
                                        </Typography>
                                    ))}
                                </Alert>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseImportModal} disabled={importLoading}>
                            İptal
                        </Button>
                        <Button 
                            onClick={handleImportSubmit} 
                            variant="contained" 
                            disabled={!selectedFile || importLoading}
                            startIcon={importLoading ? <CircularProgress size={20} /> : null}
                        >
                            {importLoading ? 'İçeri Aktarılıyor...' : 'İçeri Aktar'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default CorporateCardsPage; 