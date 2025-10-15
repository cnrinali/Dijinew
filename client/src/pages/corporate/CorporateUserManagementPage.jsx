import React, { useState, useEffect, useCallback } from 'react';
import {
    getCorporateUsers,
    createCompanyUser
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
    Grid,
    Card,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CardContent,
    Tooltip,
    Avatar,
    LinearProgress,
    Stack,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Business as BusinessIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AdminPanelSettings as AdminIcon,
    AccountCircle as UserIcon,
    CorporateFare as CorporateIcon
} from '@mui/icons-material';

const initialFormData = { 
    name: '', 
    email: '', 
    password: '', 
    role: 'user' 
};

function CorporateUserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const { showNotification } = useNotification();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getCorporateUsers();
            const usersData = response?.data?.success ? response.data.data : [];
            setUsers(usersData);
        } catch (err) {
            console.error("Şirket kullanıcıları getirilirken hata:", err);
            const errorMsg = err.message || 'Şirket kullanıcıları yüklenemedi.';
            setError(errorMsg);
            showNotification(errorMsg, 'error');
            setUsers([]); 
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = () => {
        setFormData(initialFormData);
        setFormError('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormData(initialFormData);
        setFormError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async () => {
        setFormLoading(true);
        setFormError('');

        if (!formData.name || !formData.email || !formData.password) {
            setFormError('İsim, e-posta ve şifre alanları zorunludur.');
            setFormLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setFormError('Şifre en az 6 karakter olmalıdır.');
            setFormLoading(false);
            return;
        }

        if (formData.role !== 'user' && formData.role !== 'corporate') {
            setFormError('Sadece \'user\' veya \'corporate\' rolünde kullanıcı oluşturabilirsiniz.');
             setFormLoading(false);
             return;
        }

        try {
            const response = await createCompanyUser(formData);
            if (response?.data?.success) {
                const emailSent = response?.data?.emailSent;
                const successMsg = emailSent 
                    ? 'Kullanıcı başarıyla eklendi ve giriş bilgileri email ile gönderildi.' 
                    : 'Kullanıcı başarıyla eklendi.';
                showNotification(successMsg, 'success');
                fetchUsers(); // Kullanıcıları yeniden yükle
                handleCloseModal(); 
            }
        } catch (err) {
            console.error("Şirket kullanıcısı oluşturma hatası:", err);
            let errorMsg = err.message || 'Kullanıcı oluşturulamadı.';
            
            // Kullanıcı dostu hata mesajları
            if (errorMsg.includes('limitine ulaşıldı')) {
                errorMsg = '⚠️ ' + errorMsg + '\n\nŞirket kullanıcı limitini artırmak için yöneticinizle iletişime geçin.';
            } else if (errorMsg.includes('zaten kullanılıyor')) {
                errorMsg = '⚠️ Bu e-posta adresi sistemde kayıtlı. Lütfen farklı bir e-posta adresi kullanın.';
            }
            
            setFormError(errorMsg);
            showNotification(errorMsg, 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const getRoleChip = (role) => {
        const roleConfig = {
            admin: { label: 'Admin', color: 'error', icon: <AdminIcon sx={{ fontSize: 14 }} /> },
            corporate: { label: 'Kurumsal', color: 'secondary', icon: <BusinessIcon sx={{ fontSize: 14 }} /> },
            user: { label: 'Kullanıcı', color: 'primary', icon: <UserIcon sx={{ fontSize: 14 }} /> }
        };

        const config = roleConfig[role] || roleConfig.user;
        
        return (
            <Chip
                icon={config.icon}
                label={config.label}
                color={config.color}
                size="small"
                variant="outlined"
            />
        );
    };

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
                                    background: 'linear-gradient(135deg, #37474F 0%, #62727B 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ 
                                    fontWeight: 700, 
                                    color: 'text.primary', 
                                    mb: 0.5,
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                }}>
                                    KURUMSAL KULLANICILAR
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}>
                                    Şirket çalışanlarını yönetin ve yeni kullanıcı ekleyin
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Yenile">
                                <IconButton 
                                    onClick={fetchUsers}
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
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.5,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    background: 'linear-gradient(135deg, #37474F 0%, #62727B 100%)',
                                }}
                >
                                Yeni Kullanıcı
                            </Button>
                        </Box>
                    </Box>
                </Box>


                {/* Users Table */}
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
                            Kullanıcı Listesi
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Şirketinize kayıtlı tüm kullanıcıları bu listede bulabilirsiniz
                        </Typography>
            </Box>
            
                    {error ? (
                        <Box sx={{ p: 3 }}>
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        </Box>
                    ) : users.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <PersonIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                                Henüz kullanıcı yok
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                İlk kullanıcınızı oluşturmak için "Yeni Kullanıcı" butonuna tıklayın
                </Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                                Yeni Kullanıcı Oluştur
                            </Button>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                        <TableHead>
                                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Kullanıcı</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>İletişim</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Kayıt Tarihi</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                        <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'grey.50' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: user.role === 'admin' ? 'error.main' : 
                                                                           user.role === 'corporate' ? 'secondary.main' : 'primary.main',
                                                            fontSize: '1rem',
                                                            fontWeight: 600
                                                        }}
                                >
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {user.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            ID: {user.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="body2">{user.email}</Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {getRoleChip(user.role)}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {new Date(user.createdAt).toLocaleTimeString('tr-TR', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="Düzenle">
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: 'warning.main' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Sil">
                                                        <IconButton
                                                            size="small"
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

                {/* Create User Modal */}
                <Dialog
                    open={modalOpen}
                    onClose={handleCloseModal}
                    maxWidth="sm"
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
                                    backgroundColor: 'secondary.50',
                                    color: 'secondary.main'
                                }}
                            >
                                <AddIcon />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Yeni Kullanıcı Oluştur
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Şirketinize yeni çalışan ekleyin
                                </Typography>
                            </Box>
                        </Box>
                    </DialogTitle>
                    
                    <Divider />
                    
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="İsim Soyisim *"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    disabled={formLoading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="E-posta Adresi *"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={formLoading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Şifre *"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    disabled={formLoading}
                                    helperText="En az 6 karakter olmalıdır"
                                />
                            </Grid>

                            <Box>
                                <FormControl fullWidth disabled={formLoading}>
                                    <InputLabel id="role-select-label">Rol *</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        id="role-select"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        label="Rol *"
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 300,
                                                    mt: 1
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="user">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <UserIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Kullanıcı
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                                        Standart şirket çalışanı
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="corporate">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <CorporateIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        Kurumsal Yönetici
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                                        Şirket yönetim yetkisi
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
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
                            sx={{ 
                                borderRadius: 2, 
                                textTransform: 'none', 
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #37474F 0%, #62727B 100%)',
                            }}
                        >
                            {formLoading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
                    </Button>
                </DialogActions>
            </Dialog>
            </Container>
        </Box>
    );
}

export default CorporateUserManagementPage; 