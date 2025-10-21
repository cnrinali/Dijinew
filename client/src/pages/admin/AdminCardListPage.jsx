import React, { useState, useEffect } from 'react';
import { getCards, deleteCard, exportCardsToExcel, importCardsFromExcel, generateBulkQRCodes, generateSingleQRCode } from '../../services/adminService';
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
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import CardMembershipIcon from '@mui/icons-material/CardMembership';

// Icon Imports
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QrCodeIcon from '@mui/icons-material/QrCode';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import QrCode2Icon from '@mui/icons-material/QrCode2';

function AdminCardListPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCards = async () => {
        setLoading(true);
        setError('');
        try {
            const cardList = await getCards(); 
            if (Array.isArray(cardList)) {
                setCards(cardList);
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
        } catch (err) {
            console.error("Kart silinirken hata (Admin):", err);
            setError(err.response?.data?.message || 'Kartvizit silinemedi.');
        }
    };

    const handleExportExcel = async () => {
        try {
            await exportCardsToExcel();
        } catch (err) {
            console.error("Excel export hatası:", err);
            setError(err.response?.data?.message || 'Excel dışa aktarma hatası.');
        }
    };

    const handleImportExcel = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            await importCardsFromExcel(formData);
            fetchCards(); // Listeyi yenile
        } catch (err) {
            console.error("Excel import hatası:", err);
            setError(err.response?.data?.message || 'Excel içe aktarma hatası.');
        }
    };

    const handleBulkQRDownload = async () => {
        try {
            await generateBulkQRCodes();
        } catch (err) {
            console.error("Toplu QR kod indirme hatası:", err);
            setError(err.response?.data?.message || 'QR kod indirme hatası.');
        }
    };

    const handleSingleQRDownload = async (cardId) => {
        try {
            await generateSingleQRCode(cardId);
        } catch (err) {
            console.error("Tek QR kod indirme hatası:", err);
            setError(err.response?.data?.message || err.message || 'QR kod indirme hatası.');
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
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #F4C734 0%, #000000 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CardMembershipIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Kartvizit Yönetimi
                </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Tüm kartvizitleri görüntüleyin ve yönetin
                        </Typography>
                    </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/admin/cards/new"
                        sx={{ minWidth: 200 }}
                >
                    Yeni Kartvizit Ekle
                </Button>
                </Box>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportExcel}
                >
                    Excel'e Aktar
                </Button>
                
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<FileUploadIcon />}
                >
                    Excel'den İçe Aktar
                    <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={handleImportExcel}
                    />
                </Button>

                <Button
                    variant="contained"
                    startIcon={<QrCode2Icon />}
                    onClick={handleBulkQRDownload}
                >
                    Toplu QR İndir
                </Button>
            </Stack>

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
                                <TableCell>{card.name}</TableCell>
                                <TableCell>{card.userName}</TableCell>
                                <TableCell>{card.userEmail}</TableCell>
                                <TableCell>{card.customSlug || '-'}</TableCell>
                                <TableCell>{card.status ? 'Evet' : 'Hayır'}</TableCell>
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
                                    <Tooltip title="QR Kod İndir">
                                        <IconButton 
                                            aria-label="download-qr" 
                                            onClick={() => handleSingleQRDownload(card.id)}
                                            size="small"
                                        >
                                            <QrCodeIcon fontSize="inherit"/> 
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