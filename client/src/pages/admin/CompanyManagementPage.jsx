import React, { useState, useEffect, useCallback } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../services/adminService';
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
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CompanyManagementPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const initialFormData = { name: '', userLimit: 1, cardLimit: 1, status: true, phone: '', website: '', address: '' };
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);

    const { showNotification } = useNotification();

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
             const response = await getCompanies();
             // Yanıtı ve türünü kontrol et - YENİ LOGLAR
             console.log('Returned from getCompanies:', response);
             console.log('Typeof response:', typeof response, 'Is Array?', Array.isArray(response));
             // Yanıtı ve türünü kontrol et - BU LOGLARI ŞİMDİLİK KALDIRIYORUZ
             // console.log('API Response (fetchCompanies):', response);
             // console.log('API Response Type:', typeof response, 'Is Array?', Array.isArray(response));

             // Yanıtın doğrudan bir dizi olup olmadığını kontrol et
             if (Array.isArray(response)) {
                  setCompanies(response); // Yanıt dizisini doğrudan state'e ata
             } else if (response && Array.isArray(response.data)) {
                 // Eski formatı da destekle (güvenlik için)
                 setCompanies(response.data);
             }
              else {
                  console.error("Beklenmeyen API yanıt formatı (Companies):", response);
                  setCompanies([]); // Hata durumunda boş dizi ata
                  showNotification('Şirket verileri alınamadı (format hatası).', 'error');
             }
        } catch (err) {
            console.error("Şirketler getirilirken hata:", err);
            showNotification(err.response?.data?.message || 'Şirketler yüklenemedi.', 'error');
            setCompanies([]); // Hata durumunda boş dizi ata
        } finally {
            setLoading(false);
        }
    }, [showNotification]); // Tekrar showNotification bağımlılığını ekledik

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const handleOpenModal = (company = null) => {
        if (company) {
            setSelectedCompany(company);
            setFormData({
                 name: company.name || '',
                 userLimit: company.userLimit || 0,
                 cardLimit: company.cardLimit || 0,
                 status: company.status !== undefined ? !!company.status : true,
                 phone: company.phone || '',
                 website: company.website || '',
                 address: company.address || ''
            });
            setIsEditMode(true);
        } else {
            setSelectedCompany(null);
            setFormData(initialFormData);
            setIsEditMode(false);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCompany(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const isLimitField = name === 'userLimit' || name === 'cardLimit';
        let processedValue;

        if (type === 'checkbox' || type === 'switch') {
            processedValue = checked;
        } else if (isLimitField) {
            processedValue = parseInt(value, 10);
             if (isNaN(processedValue) || processedValue < 0) {
                return; // Geçersiz girişi engelle
            }
        } else {
            processedValue = value;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleFormSubmit = async () => {
        setFormLoading(true);
        try {
            if (isEditMode && selectedCompany) {
                await updateCompany(selectedCompany.id, formData);
                showNotification('Şirket başarıyla güncellendi.', 'success');
            } else {
                await createCompany(formData);
                showNotification('Şirket başarıyla oluşturuldu.', 'success');
            }
            handleCloseModal();
            fetchCompanies(); // Listeyi yenile
        } catch (err) {
            console.error("Form submit hatası:", err);
            showNotification(err.response?.data?.message || 'İşlem başarısız oldu.', 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (company) => {
        setSelectedCompany(company);
        setDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setSelectedCompany(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCompany) return;
        setFormLoading(true); // Silme işlemi için de loading kullanalım
        try {
            await deleteCompany(selectedCompany.id);
            showNotification('Şirket başarıyla silindi.', 'success');
            handleCloseDeleteConfirm();
            fetchCompanies(); // Listeyi yenile
        } catch (err) {
             console.error("Şirket silme hatası:", err);
             showNotification(err.response?.data?.message || 'Şirket silinemedi.', 'error');
        } finally {
             setFormLoading(false);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Şirket Adı', width: 200 },
        {
             field: 'status',
             headerName: 'Durum',
             width: 100,
             type: 'boolean',
             renderCell: (params) => (params.value ? 'Aktif' : 'Pasif') 
        },
        { field: 'phone', headerName: 'Telefon', width: 150 },
        { field: 'website', headerName: 'Web Sitesi', width: 200 },
        { field: 'address', headerName: 'Adres', flex: 1, minWidth: 200 },
        { field: 'userLimit', headerName: 'Kullanıcı Lim.', type: 'number', width: 110, align: 'center', headerAlign: 'center' },
        { field: 'cardLimit', headerName: 'Kart Lim.', type: 'number', width: 90, align: 'center', headerAlign: 'center' },
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
                <Typography variant="h5" component="h1">Şirket Yönetimi</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Yeni Şirket Ekle
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <DataGrid
                    rows={companies}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    slots={{ toolbar: GridToolbar }} // Filtreleme, export vb. için toolbar
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true, // Hızlı arama kutusu
                      },
                    }}
                    disableRowSelectionOnClick
                    autoHeight={false} // Paper'ın yüksekliğini kullan
                />
            )}

            {/* Ekleme/Düzenleme Modalı */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditMode ? 'Şirketi Düzenle' : 'Yeni Şirket Oluştur'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Şirket Adı"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={formLoading}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.status}
                                onChange={handleInputChange}
                                name="status"
                                disabled={formLoading}
                            />
                        }
                        label={formData.status ? "Aktif" : "Pasif"}
                        sx={{ mt: 1, mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        id="userLimit"
                        name="userLimit"
                        label="Kullanıcı Limiti"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.userLimit}
                        onChange={handleInputChange}
                        required
                        InputProps={{ inputProps: { min: 0 } }} 
                        disabled={formLoading}
                    />
                     <TextField
                        margin="dense"
                        id="cardLimit"
                        name="cardLimit"
                        label="Kartvizit Limiti"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.cardLimit}
                        onChange={handleInputChange}
                        required
                        InputProps={{ inputProps: { min: 0 } }} 
                        disabled={formLoading}
                    />
                    <TextField
                        margin="dense"
                        id="phone"
                        name="phone"
                        label="Telefon"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={formLoading}
                    />
                     <TextField
                        margin="dense"
                        id="website"
                        name="website"
                        label="Web Sitesi"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={formData.website}
                        onChange={handleInputChange}
                        disabled={formLoading}
                    />
                     <TextField
                        margin="dense"
                        id="address"
                        name="address"
                        label="Adres"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={formLoading}
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
             <Dialog
                open={deleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Şirketi Silmeyi Onayla"}
                </DialogTitle>
                <DialogContent>
                  <Typography id="alert-dialog-description">
                    '{selectedCompany?.name}' isimli şirketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve şirkete bağlı kullanıcılar/kartvizitler varsa sorunlara yol açabilir.
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button onClick={handleCloseDeleteConfirm} disabled={formLoading}>İptal</Button>
                  <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus disabled={formLoading}>
                    {formLoading ? <CircularProgress size={24} /> : 'Sil'}
                  </Button>
                </DialogActions>
              </Dialog>
        </Paper>
    );
}

export default CompanyManagementPage; 