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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');

    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);

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

    // Filter function
    const applyFilters = useCallback(() => {
        let filtered = companies;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(company => 
                company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                company.address?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== '') {
            filtered = filtered.filter(company => company.status === (statusFilter === 'active'));
        }

        // Size filter (based on user limit)
        if (sizeFilter) {
            switch (sizeFilter) {
                case 'small':
                    filtered = filtered.filter(company => company.userLimit <= 10);
                    break;
                case 'medium':
                    filtered = filtered.filter(company => company.userLimit > 10 && company.userLimit <= 50);
                    break;
                case 'large':
                    filtered = filtered.filter(company => company.userLimit > 50);
                    break;
                default:
                    break;
            }
        }

        setFilteredCompanies(filtered);
    }, [companies, searchQuery, statusFilter, sizeFilter]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setSizeFilter('');
    };

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
                        <BusinessIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Şirket Yönetimi
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Şirketleri görüntüleyin ve yönetin
                        </Typography>
                    </Box>
                <Button
                    variant="contained"
                        color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                        sx={{ minWidth: 200 }}
                >
                    Yeni Şirket Ekle
                </Button>
            </Box>
            </Box>

            {/* Filter Section */}
            <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', background: 'background.paper' }}>
                <Box 
                    sx={{ 
                        p: 2, 
                        backgroundColor: 'background.paper',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: filterOpen ? '1px solid' : 'none',
                        borderColor: 'grey.200'
                    }}
                    onClick={() => setFilterOpen(!filterOpen)}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterListIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Filtreler
                        </Typography>
                        <Chip 
                            label={`${filteredCompanies.length} şirket`}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                    {filterOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                
                <Collapse in={filterOpen}>
                    <CardContent sx={{ pt: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Şirket adı veya adres ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Durum</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        label="Durum"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">Tümü</MenuItem>
                                        <MenuItem value="active">Aktif</MenuItem>
                                        <MenuItem value="inactive">Pasif</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Boyut</InputLabel>
                                    <Select
                                        value={sizeFilter}
                                        onChange={(e) => setSizeFilter(e.target.value)}
                                        label="Boyut"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">Tümü</MenuItem>
                                        <MenuItem value="small">Küçük (≤10)</MenuItem>
                                        <MenuItem value="medium">Orta (11-50)</MenuItem>
                                        <MenuItem value="large">Büyük (&gt;50)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={clearFilters}
                                    startIcon={<ClearIcon />}
                                    sx={{ borderRadius: 2 }}
                                    size="small"
                                >
                                    Filtreleri Temizle
                                </Button>
                            </Grid>
                        </Grid>
                        

                    </CardContent>
                </Collapse>
            </Card>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="şirket tablosu">
                        <TableHead sx={{ backgroundColor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Şirket Adı</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Telefon</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Limitler</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>İletişim</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company) => (
                                    <TableRow
                                        key={company.id}
                                        sx={{ 
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { backgroundColor: 'grey.50' }
                                        }}
                                    >
                                        <TableCell component="th" scope="row">{company.id}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {company.name}
                                                </Typography>
                                                {company.address && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                                        {company.address.length > 50 ? `${company.address.substring(0, 50)}...` : company.address}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={company.status ? 'Aktif' : 'Pasif'}
                                                color={company.status ? 'success' : 'default'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {company.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                    👥 {company.userLimit} kullanıcı
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                    🃏 {company.cardLimit} kart
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                {company.website && (
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                                        🌐 {company.website.length > 25 ? `${company.website.substring(0, 25)}...` : company.website}
                                                    </Typography>
                                                )}
                                                {!company.website && !company.phone && (
                                                    <Typography variant="body2" color="text.secondary">-</Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Düzenle">
                                                <IconButton 
                                                    aria-label="edit" 
                                                    size="small" 
                                                    onClick={() => handleOpenModal(company)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Sil">
                                                <IconButton 
                                                    aria-label="delete" 
                                                    onClick={() => handleDeleteClick(company)} 
                                                    color="error" 
                                                    size="small"
                                                >
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Henüz şirket bulunmuyor. Yeni şirket eklemek için yukarıdaki butonu kullanın.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
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
        </Box>
    );
}

export default CompanyManagementPage; 