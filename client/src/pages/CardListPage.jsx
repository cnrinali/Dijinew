import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import cardService from '../services/cardService';
import { QRCodeSVG } from 'qrcode.react'; // QR Kod kütüphanesi
import { useAuth } from '../context/AuthContext.jsx'; // Auth context'i ekledik

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List'; // Geri geldi
import ListItem from '@mui/material/ListItem'; // Geri geldi
import ListItemText from '@mui/material/ListItemText'; // Geri geldi
import ListItemAvatar from '@mui/material/ListItemAvatar'; // Avatar eklendi
import Avatar from '@mui/material/Avatar'; // Avatar eklendi
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider'; // Geri geldi
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch'; // Switch import edildi
import Tooltip from '@mui/material/Tooltip'; // Tooltip eklendi
import FormControlLabel from '@mui/material/FormControlLabel'; // FormControlLabel eklendi
// import Card from '@mui/material/Card'; // Kaldırıldı
// import CardContent from '@mui/material/CardContent'; // Kaldırıldı
// import CardActions from '@mui/material/CardActions'; // Kaldırıldı

// Icon Imports
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article'; // Genel kart ikonu
import QrCode2Icon from '@mui/icons-material/QrCode2'; // QR Kod ikonu
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'; // QR kod ikonu

// QR Kod Modal Bileşeni
import QrCodeModal from '../components/QrCodeModal';

function CardListPage() {
    console.log('CardListPage: Bileşen render ediliyor.');
    const { user } = useAuth(); // Auth context'ten user bilgisini al

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processStates, setProcessStates] = useState({}); // Kart bazlı işlem durumları (silme, durum değiştirme)

    // QR Kod Modal State'leri
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedQrUrl, setSelectedQrUrl] = useState('');

    const fetchCards = async () => {
        console.log('CardListPage: fetchCards fonksiyonu çağrıldı.');
        setLoading(true);
        setError('');
        try {
            const data = await cardService.getCards();
            setCards(data);
        } catch (err) {
            console.error("Kartvizitler getirilirken hata:", err);
            setError('Kartvizitler yüklenemedi. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('CardListPage: useEffect hook çalıştı.');
        fetchCards();
    }, []);

    const setCardProcessing = (cardId, isProcessing) => {
        setProcessStates(prev => ({ ...prev, [cardId]: isProcessing }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kartviziti silmek istediğinizden emin misiniz?')) {
            return;
        }
        setError('');
        setCardProcessing(id, true);
        try {
            await cardService.deleteCard(id);
            setCards(cards.filter(card => card.id !== id));
        } catch (err) {
            console.error("Kartvizit silinirken hata:", err);
            const errorMsg = err.response?.data?.message || 'Kartvizit silinemedi.';
            setError(errorMsg);
        } finally {
            setCardProcessing(id, false);
        }
    };

    const handleToggleStatus = async (cardId, currentStatus) => {
        const newStatus = !currentStatus;
        console.log('Toggle Status - CardId:', cardId, 'Current:', currentStatus, 'New:', newStatus);
        setError('');
        setCardProcessing(cardId, true);
        try {
            const result = await cardService.toggleCardStatus(cardId, newStatus);
            console.log('Toggle Status Response:', result);
            // State'i güncelle
            setCards(prevCards =>
                prevCards.map(c => c.id === cardId ? { ...c, isActive: result.card.isActive } : c)
            );
            console.log('State updated - New isActive:', result.card.isActive);
        } catch (err) {
            console.error("Kart durumu değiştirilirken hata:", err);
            const errorMsg = err.response?.data?.message || 'Kart durumu değiştirilemedi.';
            setError(errorMsg);
             // Hata durumunda değişikliği geri al (opsiyonel)
            setCards(prevCards =>
                prevCards.map(c => c.id === cardId ? { ...c, isActive: currentStatus } : c)
            );
        } finally {
            setCardProcessing(cardId, false);
        }
    };

    // QR Kod Modal açma fonksiyonu
    const handleOpenQrModal = (card) => {
        // Tam URL'i oluştur (örn: https://app.dijinew.com/card/slug-veya-id)
        const publicUrl = `${window.location.origin}/card/${card.customSlug || card.id}`;
        setSelectedQrUrl(publicUrl);
        setQrModalOpen(true);
    };

    // QR Kod Modal kapatma fonksiyonu
    const handleCloseQrModal = () => {
        setQrModalOpen(false);
        setSelectedQrUrl(''); // URL'i temizle
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Grid item>
                    <Typography variant="h4" component="h1">
                        Kartvizitlerim
                    </Typography>
                </Grid>
                <Grid item>
                    {/* Sadece admin ve corporate kullanıcılar kart oluşturabilir */}
                    {user && (user.role === 'admin' || user.role === 'corporate') && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            component={RouterLink}
                            to="/cards/new"
                        >
                            Yeni Kart Oluştur
                        </Button>
                    )}
                </Grid>
            </Grid>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {cards.length === 0 && !loading ? (
                <Typography sx={{ textAlign: 'center', mt: 5 }}>
                    Henüz hiç kartvizit oluşturmadınız.
                </Typography>
            ) : (
                <Paper elevation={2}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {cards.map((card, index) => (
                            <React.Fragment key={card.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt={card.cardName} src={card.profileImageUrl || undefined}>
                                            {!card.profileImageUrl && <ArticleIcon />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={card.cardName}
                                        secondary={
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {card.name || 'İsim Yok'} - {card.title || 'Unvan Yok'}
                                            </Typography>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Tooltip title={card.isActive ? 'Kart Aktif' : 'Kart Pasif'}>
                                             <FormControlLabel
                                                 control={
                                                     <Switch
                                                         checked={card.isActive}
                                                         onChange={() => handleToggleStatus(card.id, card.isActive)}
                                                         disabled={processStates[card.id]} // İşlem sırasındaysa devre dışı bırak
                                                         color="success" // Aktifken yeşil göster
                                                     />
                                                 }
                                                 label={processStates[card.id] ? <CircularProgress size={20} /> : (card.isActive ? 'Aktif' : 'Pasif')}
                                                 labelPlacement="start"
                                                 sx={{ mr: 1 }} // Sağa biraz boşluk
                                             />
                                        </Tooltip>
                                        <Tooltip title="Görüntüle">
                                             {/* customSlug varsa onu, yoksa id'yi kullan */}
                                            <IconButton edge="end" aria-label="view" component={RouterLink} to={`/card/${card.customSlug || card.id}`} target="_blank">
                                                 <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="QR Kod">
                                            <IconButton edge="end" aria-label="qr-code" onClick={() => handleOpenQrModal(card)} disabled={!card.isActive}>
                                                <QrCodeScannerIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Düzenle">
                                            <IconButton edge="end" aria-label="edit" component={RouterLink} to={`/cards/edit/${card.id}`} disabled={processStates[card.id]}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Sil">
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(card.id)} disabled={processStates[card.id]}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {processStates[card.id] && <CircularProgress size={20} sx={{ ml: 1 }} />}
                                    </Box>
                                </ListItem>
                                {index < cards.length - 1 && <Divider variant="inset" component="li" />}
                           </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}

            {/* QR Kod Modal */}
            <QrCodeModal
                open={qrModalOpen}
                onClose={handleCloseQrModal}
                url={selectedQrUrl}
            />
        </Box>
    );
}

export default CardListPage;
