import React, { useState, useEffect, useCallback } from 'react';
import {
    getMyCompanyCards,
    createMyCompanyCard,
    getMyCompanyUsersForSelection
} from '../../services/corporateService';
import { useNotification } from '../../context/NotificationContext'; // Bildirimler için

// MUI Imports (AdminUserListPage.jsx'ten benzerlerini alabiliriz)
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
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const initialFormData = {
    userId: '',
    name: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    status: true,
    customSlug: ''
    // userId şimdilik formda olmayacak, backend'de null veya isteğe bağlı olarak yönetilebilir
};

function CorporateCardsPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // const [pagination, setPagination] = useState({ page: 1, limit: 10, totalCount: 0, totalPages: 1 });
    const { showNotification } = useNotification();

    const [companyUserList, setCompanyUserList] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Modal state'leri
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    // const [isEditMode, setIsEditMode] = useState(false); // Şimdilik sadece ekleme
    // const [selectedCard, setSelectedCard] = useState(null);

    const fetchCompanyCards = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getMyCompanyCards(); 
            if (response && Array.isArray(response.data)) {
                setCards(response.data);
            } else {
                console.error("Beklenmeyen API yanıt formatı (CorporateCards):", response);
                setCards([]);
                setError('Kart verileri alınamadı (format hatası).');
                showNotification('Kart verileri alınamadı (format hatası).', 'error');
            }
        } catch (err) {
            console.error("Şirket kartları getirilirken hata (CorporatePage):", err);
            const errorMsg = err.message || 'Şirket kartları yüklenemedi.';
            setError(errorMsg);
            showNotification(errorMsg, 'error');
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    const fetchCompanyUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const response = await getMyCompanyUsersForSelection();
            // response.data beklenen format { data: [{id, name, email}, ...] } veya direkt array
            if (response && Array.isArray(response.data)) {
                setCompanyUserList(response.data);
            } else if (response && Array.isArray(response)) { // Eğer API direkt array dönerse
                 setCompanyUserList(response);
            } else {
                setCompanyUserList([]);
                showNotification('Şirket kullanıcı listesi formatı hatalı.', 'warning');
            }
        } catch (err) {
            showNotification(err.message || 'Şirket kullanıcıları yüklenemedi.', 'error');
            setCompanyUserList([]);
        } finally {
            setLoadingUsers(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchCompanyCards();
        fetchCompanyUsers(); // Sayfa yüklendiğinde kullanıcıları da çek
    }, [fetchCompanyCards, fetchCompanyUsers]);

    const handleOpenModal = () => {
        setFormData(initialFormData);
        setFormError('');
        setError('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormError('');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newFormData = { ...formData };
        newFormData[name] = type === 'checkbox' || type === 'switch' ? checked : value;

        if (name === 'userId') {
            const selectedUser = companyUserList.find(user => user.id === value);
            if (selectedUser) {
                const isNameFromOtherUser = companyUserList.some(u => u.name === newFormData.name && u.id !== selectedUser.id);
                if (!newFormData.name || isNameFromOtherUser) {
                    newFormData.name = selectedUser.name;
                }
                newFormData.email = selectedUser.email;
                newFormData.title = '';
            } else {
                // Kullanıcı seçimi kaldırıldı. Opsiyonel: newFormData.email ve newFormData.title'ı sıfırla.
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

        if (dataToSend.userId) { 
            // Backend, userId varsa e-postayı kullanıcıdan alacak ve ünvanı null yapacak.
            // Frontend'den gönderilen email ve title'ı silerek backend'in işini kolaylaştıralım.
            delete dataToSend.email; 
            delete dataToSend.title;
        } else {
            // Kullanıcı seçilmediyse, email opsiyonel, title formdan olduğu gibi gider.
        }
        dataToSend.userId = dataToSend.userId ? parseInt(dataToSend.userId, 10) : null;

        try {
            const newCard = await createMyCompanyCard(dataToSend);
            setCards(prevCards => [newCard, ...prevCards]);
            showNotification('Kart başarıyla oluşturuldu.', 'success');
            handleCloseModal();
        } catch (err) {
            console.error("Kart oluşturma hatası (CorporatePage):", err);
            const errorMsg = err.message || 'Kart oluşturulamadı.';
            setFormError(errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading && cards.length === 0) { // Sadece ilk yüklemede tam ekran loading
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">Şirket Kartvizitlerim</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal} disabled={loading || loadingUsers}>
                    Yeni Kart Ekle
                </Button>
            </Box>

            {loading && cards.length > 0 && <CircularProgress sx={{mb: 2}}/>}{/* Liste varken yükleniyorsa küçük spinner */}
            {error && !modalOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {cards.length === 0 && !error && !loading && (
                <Typography sx={{ textAlign: 'center', mt: 3 }}>
                    Şirketinize ait henüz bir kartvizit bulunmamaktadır.
                </Typography>
            )}

            {cards.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="şirket kartları tablosu">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Kart Adı</TableCell>
                                <TableCell>İsim (Kullanıcı)</TableCell>
                                <TableCell>Email (Kullanıcı)</TableCell>
                                <TableCell>Durum</TableCell>
                                <TableCell>Oluşturulma Tarihi</TableCell>
                                {/* <TableCell align="right">İşlemler</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards.map((card) => (
                                <TableRow
                                    key={card.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{card.id}</TableCell>
                                    <TableCell>{card.name || card.cardName}</TableCell>
                                    <TableCell>{card.userName || 'N/A'}</TableCell>
                                    <TableCell>{card.userEmail || 'N/A'}</TableCell>
                                    <TableCell>{card.status ? 'Aktif' : 'Pasif'}</TableCell>
                                    <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                                    {/* <TableCell align="right">İşlemler...</TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Kart Ekleme/Düzenleme Modalı */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Yeni Şirket Kartı Oluştur</DialogTitle>
                <DialogContent>
                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

                    <FormControl fullWidth margin="dense" disabled={loadingUsers || formLoading}>
                        <InputLabel id="company-user-select-label">Bağlı Kullanıcı (İsteğe Bağlı)</InputLabel>
                        <Select
                            labelId="company-user-select-label"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            label="Bağlı Kullanıcı (İsteğe Bağlı)"
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">
                                <em>Yok (Şirkete Ait Kart)</em>
                            </MenuItem>
                            {companyUserList.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField autoFocus margin="dense" id="name" name="name" label="Kart Adı/Sahibi" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleInputChange} required disabled={formLoading} />
                    
                    <TextField 
                        margin="dense" 
                        id="title" 
                        name="title" 
                        label="Ünvan" 
                        type="text" 
                        fullWidth 
                        variant="outlined" 
                        value={formData.userId ? '' : formData.title}
                        onChange={handleInputChange} 
                        disabled={!!formData.userId || formLoading}
                        placeholder={formData.userId ? 'Kullanıcıya bağlı (Ünvan kullanılmaz)' : ''}
                    />

                    <TextField 
                        margin="dense" 
                        id="email" 
                        name="email" 
                        label="E-posta (Kart için)" 
                        type="email" 
                        fullWidth 
                        variant="outlined" 
                        value={formData.email}
                        onChange={handleInputChange} 
                        disabled={!!formData.userId || formLoading}
                        InputLabelProps={formData.userId ? { shrink: true } : {}}
                    />

                    <TextField margin="dense" id="phone" name="phone" label="Telefon (Kart için)" type="tel" fullWidth variant="outlined" value={formData.phone} onChange={handleInputChange} disabled={formLoading} />
                    <TextField margin="dense" id="website" name="website" label="Web Sitesi" type="url" fullWidth variant="outlined" value={formData.website} onChange={handleInputChange} disabled={formLoading} />
                    <TextField margin="dense" id="address" name="address" label="Adres" type="text" fullWidth multiline rows={3} variant="outlined" value={formData.address} onChange={handleInputChange} disabled={formLoading} />
                    <TextField margin="dense" id="customSlug" name="customSlug" label="Özel URL (örn: benim-kartim)" type="text" fullWidth variant="outlined" value={formData.customSlug} onChange={handleInputChange} disabled={formLoading} helperText="Sadece harf, rakam ve tire (-) kullanın."/>
                    <FormControlLabel
                        control={<Switch checked={formData.status} onChange={handleInputChange} name="status" disabled={formLoading} />}
                        label="Kart Aktif mi?"
                        sx={{ mt: 1 }}
                    />
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

export default CorporateCardsPage; 