import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Typography, Box, CircularProgress, Alert,
    Tooltip, IconButton,
    TextField,
    TablePagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import * as adminService from '../../services/adminService';
import EditCardModal from '../../components/admin/EditCardModal';

// Icon Imports
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

// Debounce fonksiyonu (AdminUserListPage'deki ile aynı)
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

function AdminCardListPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [processStates, setProcessStates] = useState({});
    const [searchTerm, setSearchTerm] = useState(''); // Arama state'i
    const [totalCount, setTotalCount] = useState(0);
    const [editCardModalOpen, setEditCardModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState(''); // Durum filtresi state ('' = Tümü)

    const fetchCards = useCallback(async (currentSearchTerm, currentPage, currentRowsPerPage, currentStatusFilter) => {
        setLoading(true);
        setError('');
        let isActiveValue = null;
        if (currentStatusFilter === 'true') isActiveValue = true;
        if (currentStatusFilter === 'false') isActiveValue = false;

        try {
            const response = await adminService.getAllCards(currentSearchTerm, currentPage + 1, currentRowsPerPage, isActiveValue);
            setCards(response.data);
            setTotalCount(response.totalCount || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Tüm kartlar getirilirken bir hata oluştu.');
            console.error("Admin Card List Error:", err);
            setCards([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCards(searchTerm, page, rowsPerPage, statusFilter);
    }, [searchTerm, page, rowsPerPage, statusFilter, fetchCards]);

    const setCardProcessing = (cardId, isProcessing) => {
        setProcessStates(prev => ({ ...prev, [cardId]: isProcessing }));
    };

    const handleDeleteCard = async (cardId) => {
         if (window.confirm('Bu kartviziti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
             setCardProcessing(cardId, true);
             setError('');
             setSuccessMessage('');
             try {
                 const data = await adminService.deleteCard(cardId);
                 fetchCards(searchTerm, page, rowsPerPage, statusFilter);
                 setSuccessMessage(data.message || 'Kartvizit başarıyla silindi.');
                 setTimeout(() => setSuccessMessage(''), 3000);
             } catch (err) {
                 setError(err.response?.data?.message || 'Kartvizit silinirken bir hata oluştu.');
                 console.error("Admin Delete Card Error:", err);
                 setCardProcessing(cardId, false); 
             } 
         }
    };

    const handleSearchChange = useCallback(debounce((event) => {
        setSearchTerm(event.target.value);
        setPage(0); 
    }, 500), []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value); // Değer '' (Tümü), 'true' veya 'false' olacak
        setPage(0); // Filtre değişince ilk sayfaya dön
    };

    const handleOpenEditCardModal = (card) => {
        setSelectedCard(card);
        setEditCardModalOpen(true);
    };

    const handleCloseEditCardModal = () => {
        setEditCardModalOpen(false);
        setSelectedCard(null);
    };

    const handleCardUpdateSuccess = (updatedCard) => {
        setCards(prevCards => 
            prevCards.map(c => c.id === updatedCard.id ? updatedCard : c)
        );
        setSuccessMessage('Kartvizit bilgileri başarıyla güncellendi.');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleCloseEditCardModal();
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Yönetici Paneli - Tüm Kartvizitler
            </Typography>

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                 <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="status-filter-label">Duruma Göre Filtrele</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={statusFilter}
                        label="Duruma Göre Filtrele"
                        onChange={handleStatusFilterChange}
                        disabled={loading}
                    >
                        <MenuItem value=""><em>Tümü</em></MenuItem>
                        <MenuItem value="true">Aktif</MenuItem>
                        <MenuItem value="false">Pasif</MenuItem>
                    </Select>
                </FormControl>
                 <TextField
                    label="Kart Ara (Kart Adı/Sahip Adı)"
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
            
             {loading && cards.length === 0 ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
             ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 640 }}>
                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Kart Adı</TableCell>
                                    <TableCell>Kullanıcı Adı</TableCell>
                                    <TableCell>Kullanıcı Email</TableCell>
                                    <TableCell>Durum</TableCell>
                                    <TableCell>Oluşturulma Tarihi</TableCell>
                                    <TableCell align="right">İşlemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                 {cards.length === 0 && !loading ? (
                                    <TableRow>
                                         <TableCell colSpan={7} align="center">
                                             {searchTerm || statusFilter ? 'Filtre kriterlerine uygun kartvizit bulunamadı.' : 'Kartvizit bulunamadı.'}
                                         </TableCell>
                                    </TableRow>
                                 ) : (
                                    cards.map((card) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={card.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                             <TableCell component="th" scope="row">{card.id}</TableCell>
                                             <TableCell>{card.cardName}</TableCell>
                                             <TableCell>{card.userName}</TableCell>
                                             <TableCell>{card.userEmail}</TableCell>
                                             <TableCell>
                                                 <Tooltip title={card.isActive ? 'Aktif' : 'Pasif'}>
                                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                         {card.isActive 
                                                             ? <CheckCircleIcon color="success" sx={{ mr: 0.5 }}/> 
                                                             : <CancelIcon color="error" sx={{ mr: 0.5 }}/>}
                                                         {card.isActive ? 'Aktif' : 'Pasif'}
                                                     </Box>
                                                 </Tooltip>
                                             </TableCell>
                                             <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Görüntüle (Herkese Açık)">
                                                    <span>
                                                        <IconButton 
                                                            size="small" 
                                                            component={RouterLink} 
                                                            to={`/card/${card.customSlug || card.id}`} 
                                                            target="_blank"
                                                            disabled={!card.isActive || processStates[card.id]}
                                                        >
                                                            <VisibilityIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Düzenle">
                                                     <span> 
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleOpenEditCardModal(card)} 
                                                            disabled={processStates[card.id]}
                                                            sx={{ mx: 0.5 }}
                                                        >
                                                            <EditIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Sil">
                                                     <span>
                                                        <IconButton 
                                                            size="small" 
                                                            color="error" 
                                                            onClick={() => handleDeleteCard(card.id)}
                                                            disabled={processStates[card.id]}
                                                        >
                                                            <DeleteIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                {processStates[card.id] && <CircularProgress size={16} sx={{ verticalAlign: 'middle', ml: 1 }} />} 
                                            </TableCell>
                                        </TableRow>
                                    ))
                                 )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Sayfa başına satır:"
                    />
                </Paper>
            )}

            {selectedCard && (
                <EditCardModal
                    open={editCardModalOpen}
                    onClose={handleCloseEditCardModal}
                    card={selectedCard}
                    onUpdateSuccess={handleCardUpdateSuccess}
                />
            )}
        </Box>
    );
}

export default AdminCardListPage; 