import React, { useState, useEffect, useCallback } from 'react';
import {
    getCorporateCards,
    createCompanyCard,
    getCorporateUsers
} from '../../services/corporateService';
import { useNotification } from '../../context/NotificationContext';
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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
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
    Business as BusinessIcon
} from '@mui/icons-material';

const initialFormData = {
    userId: '',
    name: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    isActive: true,
    customSlug: ''
};

function CorporateCardsPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [companyUsers, setCompanyUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const { showNotification } = useNotification();

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchCards = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getCorporateCards();
            const cardsData = response?.data?.success ? response.data.data : [];
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
            const usersData = response?.data?.success ? response.data.data : [];
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

    const handleOpenModal = () => {
        setFormData(initialFormData);
        setFormError('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormError('');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newFormData = { ...formData };
        newFormData[name] = type === 'checkbox' || name === 'isActive' ? checked : value;

        if (name === 'userId' && value) {
            const selectedUser = companyUsers.find(user => user.id === parseInt(value));
            if (selectedUser) {
                newFormData.name = selectedUser.name || '';
                newFormData.email = selectedUser.email || '';
            }
        }

        setFormData(newFormData);
    };

    const handleFormSubmit = async () => {
        setFormLoading(true);
        setFormError('');

        if (!formData.name) {
            setFormError('Kart adı zorunludur.');
            setFormLoading(false);
            return;
        }

        let dataToSend = { ...formData };
        dataToSend.userId = dataToSend.userId ? parseInt(dataToSend.userId, 10) : null;

        try {
            const response = await createCompanyCard(dataToSend);
            if (response?.data?.success) {
                showNotification('Kart başarıyla oluşturuldu.', 'success');
                fetchCards(); // Kartları yeniden yükle
                handleCloseModal();
            }
        } catch (err) {
            console.error("Kart oluşturma hatası:", err);
            const errorMsg = err.message || 'Kart oluşturulamadı.';
            setFormError(errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

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
                                    background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
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
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                                    Kartvizitlerim
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Şirket kartvizitlerini yönetin ve düzenleyin
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Yenile">
                                <IconButton 
                                    onClick={fetchCards}
                                    disabled={loading}
                                    sx={{ 
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'grey.50',
                                        },
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenModal}
                                disabled={loading || loadingUsers}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.5,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                Yeni Kartvizit
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)', color: 'white' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                            {cards.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Toplam Kartvizit
                                        </Typography>
                                    </Box>
                                    <CardMembershipIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', color: 'white' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                            {cards.filter(card => card.isActive).length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Aktif Kartlar
                                        </Typography>
                                    </Box>
                                    <VisibilityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #37474F 0%, #62727B 100%)', color: 'white' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                            {companyUsers.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Şirket Çalışanları
                                        </Typography>
                                    </Box>
                                    <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', color: 'white' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                            {cards.reduce((total, card) => total + (card.viewCount || 0), 0)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Toplam Görüntülenme
                                        </Typography>
                                    </Box>
                                    <QrCodeIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Cards Table */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        background: 'white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {loading && <LinearProgress />}
                    
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.100' }}>
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
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                İlk kartvizitinizi oluşturmak için "Yeni Kartvizit" butonuna tıklayın
                            </Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                                Yeni Kartvizit Oluştur
                            </Button>
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
                                                            onClick={() => window.open(`/qr/${card.slug}`, '_blank')}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="QR Kod">
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: 'info.main' }}
                                                        >
                                                            <QrCodeIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Düzenle">
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: 'warning.main' }}
                                                        >
                                                            <EditIcon fontSize="small" />
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

                {/* Create Card Modal */}
                <Dialog
                    open={modalOpen}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }
                    }}
                >
                    <DialogTitle sx={{ pb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 2,
                                    backgroundColor: 'primary.50',
                                    color: 'primary.main'
                                }}
                            >
                                <AddIcon />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Yeni Kartvizit Oluştur
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Şirket çalışanları için yeni kartvizit oluşturun
                                </Typography>
                            </Box>
                        </Box>
                    </DialogTitle>
                    
                    <Divider />
                    
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Çalışan Seç (Opsiyonel)</InputLabel>
                                    <Select
                                        name="userId"
                                        value={formData.userId}
                                        onChange={handleInputChange}
                                        label="Çalışan Seç (Opsiyonel)"
                                    >
                                        <MenuItem value="">
                                            <em>Çalışan seçilmedi</em>
                                        </MenuItem>
                                        {companyUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2">{user.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            {user.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Kartvizit Adı *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ünvan"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="E-posta"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Telefon"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Web Sitesi"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Adres"
                                    name="address"
                                    multiline
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                        />
                                    }
                                    label="Kartvizit aktif durumda"
                                />
                            </Grid>
                        </Grid>

                        {formError && (
                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                {formError}
                            </Typography>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ p: 3, pt: 2 }}>
                        <Button
                            onClick={handleCloseModal}
                            variant="outlined"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleFormSubmit}
                            variant="contained"
                            disabled={formLoading}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            {formLoading ? 'Oluşturuluyor...' : 'Kartvizit Oluştur'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default CorporateCardsPage; 