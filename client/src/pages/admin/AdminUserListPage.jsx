import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/adminService';
import { Link as RouterLink } from 'react-router-dom'; // Detay sayfasına link için (opsiyonel)
// import { useNotification } from '../../context/NotificationContext';

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

// Icon Imports
import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit'; // Opsiyonel: Kullanıcı düzenleme

function AdminUserListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            // getAllUsers yanıtı { data: userArray, totalCount: ... } şeklinde
            const response = await getUsers(); 
            if (response && Array.isArray(response.data)) {
                 setUsers(response.data); // Sadece data dizisini state'e ata
                 // TODO: Sayfalama bilgisi (response.totalCount vb.) kullanılabilir
            } else {
                 console.error("Beklenmeyen API yanıt formatı:", response);
                 setUsers([]); // Hata durumunda boş dizi ata
                 setError('Kullanıcı verileri alınamadı (format hatası).');
            }
        } catch (err) {
            console.error("Kullanıcıları getirirken hata (Admin):", err);
            setError(err.response?.data?.message || 'Kullanıcılar yüklenemedi.');
            setUsers([]); // Hata durumunda boş dizi ata
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem kullanıcının tüm kartvizitlerini de silebilir!')) {
            return;
        }
        setError('');
        try {
            await deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
            // Başarı mesajı gösterilebilir (örn: Snackbar ile)
        } catch (err) {
            console.error("Kullanıcı silinirken hata (Admin):", err);
            setError(err.response?.data?.message || 'Kullanıcı silinemedi.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Kullanıcı Yönetimi
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>İsim</TableCell>
                            <TableCell>E-posta</TableCell>
                            <TableCell>Rol</TableCell>
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
                                <TableCell component="th" scope="row">
                                    {user.id}
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                     {/* Opsiyonel: Düzenleme butonu eklenebilir */}
                                     {/* <Tooltip title="Düzenle">
                                        <IconButton 
                                            aria-label="edit" 
                                            size="small" 
                                            // component={RouterLink} 
                                            // to={`/admin/users/edit/${user.id}`}
                                        >
                                             <EditIcon fontSize="inherit"/> 
                                         </IconButton>
                                     </Tooltip> */}
                                     <Tooltip title="Sil">
                                         {/* Adminin kendi hesabını silme butonu disable edilebilir */}
                                         <IconButton 
                                            aria-label="delete" 
                                            onClick={() => handleDelete(user.id)} 
                                            color="error" 
                                            size="small"
                                            // disabled={loggedInAdminId === user.id} // Kendi hesabını silmeyi engelle
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
        </Box>
    );
}

export default AdminUserListPage; 