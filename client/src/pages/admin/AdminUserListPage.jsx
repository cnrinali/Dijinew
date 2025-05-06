import React, { useState, useEffect, useCallback } from 'react';
import { 
    getUsers, 
    deleteUser, 
    getCompanies,
    createUserAdmin,
    updateUserAdmin
} from '../../services/adminService';
import { Link as RouterLink } from 'react-router-dom'; // Detay sayfasına link için (opsiyonel)
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
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
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

// Icon Imports
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

function AdminUserListPage() {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialFormData = { name: '', email: '', password: '', role: 'user', companyId: '' };
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);

    const { showNotification } = useNotification();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const userList = await getUsers(); 
            if (Array.isArray(userList)) {
                 setUsers(userList); 
            } else {
                 console.error("Beklenmeyen API yanıt formatı (Users):", userList);
                 setUsers([]); 
                 setError('Kullanıcı verileri alınamadı (format hatası).');
                 showNotification('Kullanıcı verileri alınamadı (format hatası).', 'error');
            }
        } catch (err) {
            console.error("Kullanıcıları getirirken hata (Admin):", err);
            const errorMsg = err.response?.data?.message || 'Kullanıcılar yüklenemedi.';
            setError(errorMsg);
            showNotification(errorMsg, 'error');
            setUsers([]); 
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    const fetchCompaniesList = useCallback(async () => {
        try {
            const companyData = await getCompanies();
            if (Array.isArray(companyData)) {
                setCompanies(companyData);
            } else {
                 console.error('Şirket listesi alınamadı:', companyData);
                 setCompanies([]);
            }
        } catch (err) {
            console.error("Şirket listesi getirilirken hata:", err);
            showNotification(err.response?.data?.message || 'Şirket listesi yüklenemedi.', 'error');
            setCompanies([]);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchUsers();
        fetchCompaniesList();
    }, [fetchUsers, fetchCompaniesList]);

    const handleOpenModal = (user = null) => {
        setError('');
        if (user) {
            setSelectedUser(user);
            setFormData({
                 name: user.name || '',
                 email: user.email || '',
                 password: '',
                 role: user.role || 'user',
                 companyId: user.companyId || ''
            });
            setIsEditMode(true);
        } else {
            setSelectedUser(null);
            setFormData(initialFormData);
            setIsEditMode(false);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
        setFormData(initialFormData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async () => {
        setFormLoading(true);
        setError('');

        const userData = { ...formData };
        if (userData.companyId === '') {
            userData.companyId = null;
        }
        if (isEditMode && !userData.password) {
            delete userData.password;
        }

        try {
            if (isEditMode && selectedUser) {
                const updatedUser = await updateUserAdmin(selectedUser.id, userData);
                setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.user.id ? updatedUser.user : u));
                showNotification('Kullanıcı başarıyla güncellendi.', 'success');
            } else {
                const newUser = await createUserAdmin(userData);
                setUsers(prevUsers => [...prevUsers, newUser]);
                showNotification('Kullanıcı başarıyla oluşturuldu.', 'success');
            }
            handleCloseModal(); 
        } catch (err) {
            console.error("Kullanıcı form submit hatası:", err);
            const errorMsg = err.response?.data?.message || 'İşlem başarısız oldu.';
            setError(errorMsg);
            showNotification(errorMsg, 'error'); 
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        setFormLoading(true);
        setError('');
        try {
            await deleteUser(selectedUser.id);
            setUsers(users.filter(user => user.id !== selectedUser.id));
            showNotification('Kullanıcı başarıyla silindi.', 'success');
            handleCloseDeleteConfirm();
        } catch (err) {
            console.error("Kullanıcı silinirken hata (Admin):", err);
            const errorMsg = err.response?.data?.message || 'Kullanıcı silinemedi.';
            setError(errorMsg);
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
                <Typography variant="h4" component="h1">Kullanıcı Yönetimi</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Yeni Kullanıcı Ekle
                </Button>
            </Box>
            
            {error && !modalOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>İsim</TableCell>
                            <TableCell>E-posta</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Şirket</TableCell>
                            <TableCell>Kayıt Tarihi</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
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
                                <TableCell>{user.companyName || 'Bireysel'}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                     <Tooltip title="Düzenle">
                                        <IconButton 
                                            aria-label="edit" 
                                            size="small" 
                                            onClick={() => handleOpenModal(user)}
                                        >
                                             <EditIcon fontSize="inherit"/> 
                                         </IconButton>
                                     </Tooltip>
                                     <Tooltip title="Sil">
                                         <IconButton 
                                            aria-label="delete" 
                                            onClick={() => handleDeleteClick(user)} 
                                            color="error" 
                                            size="small"
                                        >
                                             <DeleteIcon fontSize="inherit"/> 
                                         </IconButton>
                                     </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditMode ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Oluştur'}</DialogTitle>
                <DialogContent>
                    {error && modalOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField autoFocus margin="dense" id="name" name="name" label="İsim Soyisim" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleInputChange} required disabled={formLoading} />
                    <TextField margin="dense" id="email" name="email" label="E-posta" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleInputChange} required disabled={formLoading} />
                    {!isEditMode && (
                         <TextField margin="dense" id="password" name="password" label="Şifre" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleInputChange} required disabled={formLoading} />
                    )}
                    <FormControl fullWidth margin="dense" required disabled={formLoading}>
                         <InputLabel id="role-select-label">Rol</InputLabel>
                         <Select
                            labelId="role-select-label"
                            id="role"
                            name="role"
                            value={formData.role}
                            label="Rol"
                            onChange={handleInputChange}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" disabled={formLoading}>
                         <InputLabel id="company-select-label">Şirket (Opsiyonel)</InputLabel>
                         <Select
                            labelId="company-select-label"
                            id="companyId"
                            name="companyId"
                            value={formData.companyId}
                            label="Şirket (Opsiyonel)"
                            onChange={handleInputChange}
                        >
                            <MenuItem value=""><em>Bireysel (Şirket Yok)</em></MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name} (ID: {company.id})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseModal} disabled={formLoading}>İptal</Button>
                    <Button onClick={handleFormSubmit} variant="contained" disabled={formLoading}>
                        {formLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Güncelle' : 'Oluştur')}
                    </Button>
                </DialogActions>
            </Dialog>

             <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
                <DialogTitle>Kullanıcıyı Silmeyi Onayla</DialogTitle>
                <DialogContent>
                    <Typography>
                        '{selectedUser?.name}' ({selectedUser?.email}) isimli kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button onClick={handleCloseDeleteConfirm} disabled={formLoading}>İptal</Button>
                  <Button onClick={handleDelete} color="error" variant="contained" autoFocus disabled={formLoading}>
                    {formLoading ? <CircularProgress size={24} /> : 'Sil'}
                  </Button>
                </DialogActions>
              </Dialog>

        </Box>
    );
}

export default AdminUserListPage; 