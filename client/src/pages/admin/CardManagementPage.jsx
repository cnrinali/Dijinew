import React, { useState, useEffect, useCallback } from 'react';
import { getCards, deleteCard, getCompanies, createCard, updateCard } from '../../services/adminService'; // getCompanies eklendi
import { useNotification } from '../../context/NotificationContext';

// MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select'; // Şirket seçimi için
import MenuItem from '@mui/material/MenuItem'; // Şirket seçimi için
import InputLabel from '@mui/material/InputLabel'; // Şirket seçimi için
import FormControl from '@mui/material/FormControl'; // Şirket seçimi için
import Avatar from '@mui/material/Avatar'; // QR Kodu göstermek için
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode'; // QR Kodu ikonu

function CardManagementPage() {
    const [cards, setCards] = useState([]);
    const [companies, setCompanies] = useState([]); // Şirket listesi state'i
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false); // QR Kod modalı için state
    const [selectedCard, setSelectedCard] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialFormData = {
        companyId: '', // Başlangıçta boş
        name: '',
        title: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        status: true,
    };
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);

    const { showNotification } = useNotification();

    // Şirketleri Yükle
    const fetchCompaniesList = useCallback(async () => {
        try {
            const companyData = await getCompanies();
            if (Array.isArray(companyData)) {
                setCompanies(companyData);
            } else {
                 console.error('Şirket listesi alınamadı, beklenen format dizi değil:', companyData);
                 setCompanies([]);
            }
        } catch (err) {
            console.error("Şirket listesi getirilirken hata:", err);
            showNotification(err.response?.data?.message || 'Şirket listesi yüklenemedi.', 'error');
            setCompanies([]);
        }
    }, [showNotification]);

    // Kartları Yükle
    const fetchCards = useCallback(async () => {
        setLoading(true);
        try {
            const cardData = await getCards();
            if (Array.isArray(cardData)) {
                setCards(cardData);
            } else {
                console.error('Beklenmeyen API yanıt formatı (Cards):', cardData);
                setCards([]);
                showNotification('Kart verileri alınamadı (format hatası).', 'error');
            }
        } catch (err) {
            console.error("Kartlar getirilirken hata:", err);
            showNotification(err.response?.data?.message || 'Kartlar yüklenemedi.', 'error');
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        fetchCompaniesList(); // Şirketleri yükle
        fetchCards(); // Kartları yükle
    }, [fetchCompaniesList, fetchCards]);

    const handleOpenModal = (card = null) => {
        if (card) {
            setSelectedCard(card);
            setFormData({
                companyId: card.companyId || '',
                name: card.name || '',
                title: card.title || '',
                email: card.email || '',
                phone: card.phone || '',
                website: card.website || '',
                address: card.address || '',
                status: card.status !== undefined ? !!card.status : true,
            });
            setIsEditMode(true);
        } else {
            setSelectedCard(null);
            setFormData(initialFormData);
            setIsEditMode(false);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCard(null);
    };

    const handleOpenQrModal = (card) => {
        setSelectedCard(card);
        setQrModalOpen(true);
    };

    const handleCloseQrModal = () => {
        setQrModalOpen(false);
        setSelectedCard(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' || type === 'switch' ? checked : value }));
    };

    // Form Gönderimi (Ekleme/Güncelleme)
    const handleFormSubmit = async () => {
        // Basit frontend validasyon (Şirket ve isim zorunlu)
        if (!formData.companyId || !formData.name) {
            showNotification('Lütfen Şirket ve Ad Soyad alanlarını doldurun.', 'warning');
            return;
        }

        setFormLoading(true);
        try {
            if (isEditMode && selectedCard) {
                // Güncelleme
                await updateCard(selectedCard.id, formData); 
                showNotification('Kart başarıyla güncellendi.', 'success');
            } else {
                // Oluşturma
                await createCard(formData); 
                showNotification('Kart başarıyla oluşturuldu.', 'success');
            }
            handleCloseModal(); // Modalı kapat
            fetchCards(); // Listeyi yenile
        } catch (err) {
            console.error("Kart form submit hatası:", err);
            showNotification(err.response?.data?.message || 'İşlem başarısız oldu.', 'error');
            // Hata durumunda modal açık kalabilir, kullanıcı tekrar deneyebilir.
        } finally {
            setFormLoading(false);
        }
        // Bu log ve modal kapatma işlemi try içine taşındı
        // console.log("Form Data Submitted:", formData); 
        // handleCloseModal();
    };

    // Silme Butonuna Tıklama
    const handleDeleteClick = (card) => {
        setSelectedCard(card);
        setDeleteConfirmOpen(true);
    };

    // Silme Onay Modalı Kapatma
    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setSelectedCard(null);
    };

    // Silme İşlemini Onaylama
    const handleConfirmDelete = async () => {
        if (!selectedCard) return;
        setFormLoading(true);
        try {
            await deleteCard(selectedCard.id);
            showNotification('Kart başarıyla silindi.', 'success');
            handleCloseDeleteConfirm();
            fetchCards(); // Listeyi yenile
        } catch (err) {
             console.error("Kart silme hatası:", err);
             showNotification(err.response?.data?.message || 'Kart silinemedi.', 'error');
        } finally {
             setFormLoading(false);
        }
    };

    // DataGrid Kolonları
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 }, 
        { 
            field: 'qrCodeData', 
            headerName: 'QR', 
            width: 80, 
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                params.value ? (
                    <Tooltip title="QR Kodu Göster">
                        <IconButton size="small" onClick={() => handleOpenQrModal(params.row)}>
                           <QrCodeIcon />
                        </IconButton>
                    </Tooltip>
                ) : null
            )
        },
        { field: 'name', headerName: 'Ad Soyad', width: 200 },
        { field: 'title', headerName: 'Ünvan', width: 180 },
        { field: 'companyName', headerName: 'Şirket', width: 180 }, // Şirket adı eklendi
        {
             field: 'status',
             headerName: 'Durum',
             width: 90,
             type: 'boolean',
             renderCell: (params) => (params.value ? 'Aktif' : 'Pasif') 
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Telefon', width: 150 },
        { field: 'website', headerName: 'Web Sitesi', width: 180 },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 120,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Düzenle">
                        <IconButton size="small" onClick={() => handleOpenModal(params.row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                        <IconButton size="small" onClick={() => handleDeleteClick(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Paper sx={{ p: 3, height: '80vh', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h1">Kartvizit Yönetimi</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Yeni Kart Ekle
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                 <DataGrid
                    rows={cards}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    disableRowSelectionOnClick
                    autoHeight={false}
                />
            )}

            {/* Ekleme/Düzenleme Modalı */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditMode ? 'Kartı Düzenle' : 'Yeni Kart Oluştur'}</DialogTitle>
                <DialogContent>
                    {/* Şirket Seçimi */}
                    <FormControl fullWidth margin="dense" required disabled={formLoading}>
                         <InputLabel id="company-select-label">Şirket</InputLabel>
                         <Select
                            labelId="company-select-label"
                            id="companyId"
                            name="companyId"
                            value={formData.companyId}
                            label="Şirket"
                            onChange={handleInputChange}
                        >
                            <MenuItem value="" disabled><em>Şirket Seçiniz</em></MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField autoFocus margin="dense" id="name" name="name" label="Ad Soyad" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleInputChange} required disabled={formLoading} />
                    <TextField margin="dense" id="title" name="title" label="Ünvan" type="text" fullWidth variant="outlined" value={formData.title} onChange={handleInputChange} disabled={formLoading} />
                    <TextField margin="dense" id="email" name="email" label="Email" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleInputChange} disabled={formLoading} />
                    <TextField margin="dense" id="phone" name="phone" label="Telefon" type="tel" fullWidth variant="outlined" value={formData.phone} onChange={handleInputChange} disabled={formLoading} />
                    <TextField margin="dense" id="website" name="website" label="Web Sitesi" type="url" fullWidth variant="outlined" value={formData.website} onChange={handleInputChange} disabled={formLoading} />
                    <TextField margin="dense" id="address" name="address" label="Adres" type="text" fullWidth variant="outlined" multiline rows={3} value={formData.address} onChange={handleInputChange} disabled={formLoading} />
                    <FormControlLabel
                        control={<Switch checked={formData.status} onChange={handleInputChange} name="status" disabled={formLoading} />}
                        label={formData.status ? "Aktif" : "Pasif"}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseModal} disabled={formLoading}>İptal</Button>
                    <Button onClick={handleFormSubmit} variant="contained" disabled={formLoading}>
                        {formLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Güncelle' : 'Oluştur')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Silme Onay Modalı */}
            <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
                <DialogTitle>Kartı Silmeyi Onayla</DialogTitle>
                <DialogContent>
                    <Typography>
                        '{selectedCard?.name}' isimli kartı silmek istediğinizden emin misiniz?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDeleteConfirm} disabled={formLoading}>İptal</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus disabled={formLoading}>
                        {formLoading ? <CircularProgress size={24} /> : 'Sil'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* QR Kod Gösterme Modalı */}
             <Dialog open={qrModalOpen} onClose={handleCloseQrModal}>
                 <DialogTitle>Kartvizit QR Kodu ({selectedCard?.name})</DialogTitle>
                 <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    {selectedCard?.qrCodeData ? (
                        <img src={selectedCard.qrCodeData} alt={`QR Code for ${selectedCard.name}`} style={{ width: '250px', height: '250px' }} />
                    ) : (
                        <Typography>QR Kodu bulunamadı.</Typography>
                    )}
                 </DialogContent>
                 <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseQrModal}>Kapat</Button>
                 </DialogActions>
             </Dialog>

        </Paper>
    );
}

export default CardManagementPage; 