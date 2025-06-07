import React, { useState, useEffect, useCallback } from 'react';
import {
    getMyCompanyUsersForSelection, // Şirket kullanıcılarını listelemek için
    createMyCompanyUser // Şirkete yeni kullanıcı eklemek için
} from '../../services/corporateService';
import { useNotification } from '../../context/NotificationContext';

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';

const initialFormData = { name: '', email: '', password: '', role: 'user' }; // companyId yok, rol varsayılan 'user'

function CorporateUserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);
    // const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // Şimdilik silme yok
    // const [selectedUser, setSelectedUser] = useState(null); // Şimdilik düzenleme/silme yok
    // const [isEditMode, setIsEditMode] = useState(false); // Şimdilik düzenleme yok

    const { showNotification } = useNotification();

    const fetchMyCompanyUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const userList = await getMyCompanyUsersForSelection(); 
            if (Array.isArray(userList)) {
                 setUsers(userList); 
            } else {
                 console.error("Beklenmeyen API yanıt formatı (Şirket Kullanıcıları):", userList);
                 setUsers([]); 
                 setError('Şirket kullanıcı verileri alınamadı (format hatası).');
                 showNotification('Şirket kullanıcı verileri alınamadı (format hatası).', 'error');
            }
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
        fetchMyCompanyUsers();
    }, [fetchMyCompanyUsers]);

    const handleOpenModal = () => {
        setError(''); // Form açılırken genel sayfa hatasını değil, formun kendi hatasını kullanacağız
        setFormData(initialFormData);
        // setIsEditMode(false); // Sadece ekleme modu
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormData(initialFormData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async () => {
        setFormLoading(true);
        setError(''); // Modal içindeki hata için ayrı state kullanılabilir veya bu temizlenebilir

        if (!formData.name || !formData.email || !formData.password) {
            showNotification('İsim, e-posta ve şifre alanları zorunludur.', 'warning');
            setFormLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            showNotification('Şifre en az 6 karakter olmalıdır.', 'warning');
            setFormLoading(false);
            return;
        }
        if (formData.role !== 'user') { // Ekstra güvenlik, normalde dropdown'da sadece 'user' olmalı
             showNotification('Sadece \'user\' rolünde kullanıcı oluşturabilirsiniz.', 'error');
             setFormLoading(false);
             return;
        }

        try {
            // companyId backend tarafından otomatik eklenecek
            const newUser = await createMyCompanyUser(formData);
            setUsers(prevUsers => [newUser, ...prevUsers]); // Listenin başına ekle
            showNotification('Kullanıcı başarıyla şirket bünyesine eklendi.', 'success');
            handleCloseModal(); 
        } catch (err) {
            console.error("Şirket kullanıcısı oluşturma hatası:", err);
            const errorMsg = err.message || 'Kullanıcı oluşturulamadı.';
            setError(errorMsg); // Bu hatayı modal içinde göstermek daha iyi olabilir
            showNotification(errorMsg, 'error'); 
        } finally {
            setFormLoading(false);
        }
    };

    if (loading && users.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">Şirket Kullanıcı Yönetimi</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    disabled={loading}
                >
                    Yeni Kullanıcı Ekle
                </Button>
            </Box>
            
            {error && !modalOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {users.length === 0 && !loading && !error && (
                <Typography sx={{ textAlign: 'center', mt: 3 }}>
                    Şirketinize kayıtlı başka kullanıcı bulunmamaktadır.
                </Typography>
            )}

            {users.length > 0 && (
                 <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="şirket kullanıcıları tablosu">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>İsim</TableCell>
                                <TableCell>E-posta</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Kayıt Tarihi</TableCell>
                                {/* <TableCell align="right">İşlemler</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    {/* <TableCell align="right">Düzenle/Sil Butonları</TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Kullanıcı Ekleme Modalı */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Yeni Şirket Kullanıcısı Ekle</DialogTitle>
                <DialogContent>
                    {/* Modal içi hata gösterimi için ayrı bir state kullanılabilir: formError */}
                    {/* {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>} */} 
                    <TextField autoFocus margin="dense" id="name" name="name" label="İsim Soyisim" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleInputChange} required disabled={formLoading} sx={{mb:2}} />
                    <TextField margin="dense" id="email" name="email" label="E-posta Adresi" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleInputChange} required disabled={formLoading} sx={{mb:2}} />
                    <TextField margin="dense" id="password" name="password" label="Şifre" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleInputChange} required disabled={formLoading} sx={{mb:2}} />
                    <FormControl fullWidth margin="dense" disabled={formLoading}>
                        <InputLabel id="role-select-label">Rol</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="role"
                            name="role"
                            value={formData.role} // Varsayılan 'user'
                            label="Rol"
                            onChange={handleInputChange}
                            // disabled // Sadece 'user' olduğu için disable edilebilir veya sadece o seçenek sunulur
                        >
                            <MenuItem value="user">User</MenuItem>
                            {/* Kurumsal kullanıcı admin veya başka corporate ekleyemez */}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseModal} disabled={formLoading}>İptal</Button>
                    <Button onClick={handleFormSubmit} variant="contained" disabled={formLoading}>
                        {formLoading ? <CircularProgress size={24} /> : 'Oluştur'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CorporateUserManagementPage; 