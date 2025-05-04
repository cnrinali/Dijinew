import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Typography, Box, CircularProgress, Alert,
    Select, MenuItem, FormControl,
    TextField,
    TablePagination,
    IconButton,
    Tooltip,
    InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import * as adminService from '../../services/adminService';
import EditUserModal from '../../components/admin/EditUserModal';

// Debounce fonksiyonu (basit implementasyon)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function AdminUserListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [processStates, setProcessStates] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    // Sayfalama state'leri
    const [page, setPage] = useState(0); // MUI page 0-tabanlıdır
    const [rowsPerPage, setRowsPerPage] = useState(10); // Varsayılan limit
    const [totalCount, setTotalCount] = useState(0); // Toplam kayıt sayısı
    // Edit Modal state'leri
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Düzenlenecek kullanıcı verisi
    const [roleFilter, setRoleFilter] = useState(''); // Rol filtresi state ('' = Tümü)

    // fetchUsers fonksiyonunu useCallback ile sarmallayalım
    const fetchUsers = useCallback(async (currentSearchTerm, currentPage, currentRowsPerPage, currentRoleFilter) => {
        setLoading(true);
        setError('');
        try {
            // page'i 1-tabanlı API'ye göndermek için +1 yap
            const response = await adminService.getAllUsers(currentSearchTerm, currentPage + 1, currentRowsPerPage, currentRoleFilter);
            setUsers(response.data); // Gelen veriyi ayarla
            setTotalCount(response.totalCount || 0); // Toplam sayıyı ayarla
        } catch (err) {
            setError(err.response?.data?.message || 'Kullanıcılar getirilirken bir hata oluştu.');
            console.error("Admin User List Error:", err);
            setUsers([]); // Hata durumunda listeyi boşalt
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []); // useCallback bağımlılık dizisi boş

    // Arama terimi, sayfa veya limit değiştiğinde veriyi yeniden çekmek için useEffect
    useEffect(() => {
        // Veriyi doğrudan çek, debounce handleSearchChange içinde yönetilecek
        fetchUsers(searchTerm, page, rowsPerPage, roleFilter);
    }, [searchTerm, page, rowsPerPage, roleFilter, fetchUsers]); // Bağımlılıklar doğru

    // setCardProcessing helper fonksiyonu (yeniden adlandırıldı)
    const setUserProcessing = (userId, isProcessing) => {
        setProcessStates(prev => ({ ...prev, [userId]: isProcessing }));
    };

    const handleDeleteUser = async (userId) => {
         if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
             setUserProcessing(userId, true);
             setError('');
             setSuccessMessage('');
             try {
                 const data = await adminService.deleteUser(userId);
                 // Silme sonrası veriyi yeniden çekmek daha doğru olur
                 fetchUsers(searchTerm, page, rowsPerPage, roleFilter); 
                 setSuccessMessage(data.message || 'Kullanıcı başarıyla silindi.');
                 setTimeout(() => setSuccessMessage(''), 3000);
             } catch (err) {
                 setError(err.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu.');
                 console.error("Admin Delete User Error:", err);
                 setUserProcessing(userId, false); // Hata durumunda işlem bitir
             }
         }
    };

    const handleRoleChange = async (userId, newRole) => {
        setUserProcessing(userId, true);
        try {
            setError('');
            setSuccessMessage('');
            const data = await adminService.updateUserRole(userId, newRole);
            // Rol değişince tüm listeyi yeniden çekmek yerine sadece o kullanıcıyı güncellemek daha verimli
            setUsers(prevUsers => 
                prevUsers.map(u => u.id === userId ? { ...u, role: data.user.role } : u)
            );
            setSuccessMessage(data.message || 'Kullanıcı rolü başarıyla güncellendi.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Rol güncellenirken bir hata oluştu.');
            console.error("Admin Update Role Error:", err);
            setTimeout(() => setError(''), 3000);
        } finally {
            setUserProcessing(userId, false);
        }
    };

    // Arama input'u değiştiğinde state'i güncelle (ve sayfayı sıfırla)
    // Debounce işlemi burada yönetilecek
    const handleSearchChange = useCallback(debounce((event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Arama yapıldığında ilk sayfaya dön
    }, 500), []); // Debounce fonksiyonunu useCallback ile sarmalla

    // Sayfa değiştirme event handler
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Sayfa başına satır sayısı değiştirme event handler
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Limit değiştiğinde ilk sayfaya dön
    };

    // Rol filtresi değişim handler'ı
    const handleRoleFilterChange = (event) => {
        setRoleFilter(event.target.value);
        setPage(0); // Filtre değişince ilk sayfaya dön
    };

    // Edit Modal Handler'ları
    const handleOpenEditModal = (user) => {
        setSelectedUser(user); // Düzenlenecek kullanıcıyı ayarla
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedUser(null); // Seçili kullanıcıyı temizle
    };

    // Modal'dan başarılı güncelleme sonrası çalışacak fonksiyon
    const handleUpdateSuccess = (updatedUser) => {
        setUsers(prevUsers => 
            prevUsers.map(u => u.id === updatedUser.id ? { ...u, name: updatedUser.name, email: updatedUser.email } : u)
        );
        setSuccessMessage('Kullanıcı bilgileri başarıyla güncellendi.');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleCloseEditModal(); // Modalı kapat
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Yönetici Paneli - Kullanıcılar
            </Typography>
            
            {/* Filtreleme ve Arama Alanı */} 
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                 {/* Rol Filtresi */} 
                 <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="role-filter-label">Role Göre Filtrele</InputLabel>
                    <Select
                        labelId="role-filter-label"
                        id="role-filter"
                        value={roleFilter}
                        label="Role Göre Filtrele"
                        onChange={handleRoleFilterChange}
                        disabled={loading}
                    >
                        <MenuItem value=""><em>Tümü</em></MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </Select>
                </FormControl>
                {/* Arama Kutusu */} 
                 <TextField
                    label="Kullanıcı Ara (İsim/Email)"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '300px' }}
                    disabled={loading}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>} 
            
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper} sx={{ maxHeight: 640 }}> {/* Yüksekliği sınırlayabiliriz */} 
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                         <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>İsim</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Kayıt Tarihi</TableCell>
                                <TableCell align="right">İşlemler</TableCell>
                             </TableRow>
                        </TableHead>
                        <TableBody>
                             {loading ? (
                                 <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                             ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        {searchTerm || roleFilter ? 'Filtre kriterlerine uygun kullanıcı bulunamadı.' : 'Kullanıcı bulunamadı.'} 
                                    </TableCell>
                                </TableRow>
                             ) : (
                                users.map((user) => (
                                    <TableRow
                                        hover // Satır üzerine gelince vurgu
                                        role="checkbox" // Erişilebilirlik
                                        tabIndex={-1} // Erişilebilirlik
                                        key={user.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                         <TableCell>
                                            <FormControl size="small" sx={{ minWidth: 80 }}>
                                                <Select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={processStates[user.id]} 
                                                >
                                                    <MenuItem value="user">User</MenuItem>
                                                    <MenuItem value="admin">Admin</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                             {/* Düzenle Butonu */} 
                                            <Tooltip title="Düzenle">
                                                 <span> {/* Disabled iken Tooltip için span */} 
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => handleOpenEditModal(user)} 
                                                        disabled={processStates[user.id]} // İşlemdeyse devre dışı
                                                        sx={{ mr: 0.5 }} // Diğer butondan biraz ayır
                                                    >
                                                        <EditIcon fontSize="inherit" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                             {/* Silme Butonu */} 
                                            <Tooltip title="Sil">
                                                 <span> {/* Disabled iken Tooltip için span */} 
                                                    <Button 
                                                        variant="contained" 
                                                        color="error" 
                                                        size="small" 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={processStates[user.id]}
                                                        sx={{ mr: processStates[user.id] ? 1 : 0 }}
                                                    >
                                                        Sil
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                            {processStates[user.id] && <CircularProgress size={16} sx={{ verticalAlign: 'middle', ml: 1 }} />}
                                        </TableCell>
                                    </TableRow>
                                ))
                             )}
                        </TableBody>
                    </Table>
                </TableContainer>
                 {/* Sayfalama Bileşeni */} 
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]} // Sayfa başına satır seçenekleri
                    component="div"
                    count={totalCount} // Toplam kayıt sayısı
                    rowsPerPage={rowsPerPage} // Sayfa başına mevcut satır sayısı
                    page={page} // Mevcut sayfa (0-tabanlı)
                    onPageChange={handleChangePage} // Sayfa değiştirme handler'ı
                    onRowsPerPageChange={handleChangeRowsPerPage} // Limit değiştirme handler'ı
                    labelRowsPerPage="Sayfa başına satır:"
                    // Diğer dil seçenekleri eklenebilir (labelDisplayedRows vs.)
                />
            </Paper>

             {/* Kullanıcı Düzenleme Modalı */} 
            {selectedUser && (
                <EditUserModal
                    open={editModalOpen}
                    onClose={handleCloseEditModal}
                    user={selectedUser}
                    onUpdateSuccess={handleUpdateSuccess} // Başarı callback'i
                />
            )}
        </Box>
    );
}

export default AdminUserListPage; 