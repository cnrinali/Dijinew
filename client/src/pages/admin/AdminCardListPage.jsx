import React, { useState, useEffect } from 'react';
import { getCards, deleteCard } from '../../services/adminService';
import { Link as RouterLink } from 'react-router-dom'; 

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
import Link from '@mui/material/Link'; // Link göstermek için

// Icon Imports
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Görüntüleme ikonu

function AdminCardListPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCards = async () => {
        setLoading(true);
        setError('');
        try {
            // getCards fonksiyonu doğrudan diziyi döndürüyor
            const cardList = await getCards(); 
            // Yanıtın doğrudan dizi olup olmadığını kontrol et
            if (Array.isArray(cardList)) {
                 setCards(cardList); // Diziyi doğrudan state'e ata
                 // Eski kontrol: response.data kontrol ediliyordu
            // } else if (response && Array.isArray(response.data)) {
            //      setCards(response.data); 
            } else {
                 console.error("Beklenmeyen API yanıt formatı (Cards):", cardList);
                 setCards([]); 
                 setError('Kartvizit verileri alınamadı (format hatası).');
            }
        } catch (err) {
            console.error("Tüm kartları getirirken hata (Admin):", err);
            setError(err.response?.data?.message || 'Kartvizitler yüklenemedi.');
            setCards([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kartviziti silmek istediğinizden emin misiniz?')) {
            return;
        }
        setError('');
        try {
            await deleteCard(id);
            setCards(cards.filter(card => card.id !== id));
            // Başarı mesajı gösterilebilir
        } catch (err) {
            console.error("Kart silinirken hata (Admin):", err);
            setError(err.response?.data?.message || 'Kartvizit silinemedi.');
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
                Kartvizit Yönetimi
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Kart Adı</TableCell>
                            <TableCell>Kullanıcı Adı</TableCell>
                            <TableCell>Kullanıcı Email</TableCell>
                            <TableCell>Özel URL</TableCell>
                            <TableCell>Aktif</TableCell>
                            <TableCell>Oluşturulma</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cards.map((card) => (
                            <TableRow
                                key={card.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{card.id}</TableCell>
                                <TableCell>{card.cardName}</TableCell>
                                <TableCell>{card.userName}</TableCell>
                                <TableCell>{card.userEmail}</TableCell>
                                <TableCell>{card.customSlug || '-'}</TableCell>
                                <TableCell>{card.isActive ? 'Evet' : 'Hayır'}</TableCell>
                                <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                     <Tooltip title="Görüntüle">
                                         <IconButton 
                                            aria-label="view" 
                                            component={RouterLink}
                                            to={`/card/${card.customSlug || card.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            size="small"
                                        >
                                             <VisibilityIcon fontSize="inherit"/> 
                                         </IconButton>
                                     </Tooltip>
                                     <Tooltip title="Sil">
                                         <IconButton 
                                            aria-label="delete" 
                                            onClick={() => handleDelete(card.id)} 
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
        </Box>
    );
}

export default AdminCardListPage; 