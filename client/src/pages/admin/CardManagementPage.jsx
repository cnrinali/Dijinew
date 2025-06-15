import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCards, deleteCard, getCompanies, getUsers, createCard, updateCard } from '../../services/adminService'; // getCompanies eklendi
import { useNotification } from '../../context/NotificationContext';
// QR Kod Modal komponentini import et
import QrCodeModal from '../../components/QrCodeModal';
import * as XLSX from 'xlsx'; // xlsx kütüphanesini import et
import JSZip from 'jszip'; // JSZip kütüphanesini import et
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeIcon from '@mui/icons-material/QrCode'; // QR Kodu ikonu
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // Excel ikonu için
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Import ikonu
import Alert from '@mui/material/Alert';

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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';

function CardManagementPage() {
    console.log('CardManagementPage component loaded with filters!'); // Debug log
    const [cards, setCards] = useState([]);
    const [companies, setCompanies] = useState([]); // Şirket listesi state'i
    const [users, setUsers] = useState([]); // Kullanıcı listesi state'i
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [qrModalOpen, setQrModalOpen] = useState(false); // QR Kod modalı için state
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedQrUrl, setSelectedQrUrl] = useState(''); // QR Modal için URL state'i
    const [isEditMode, setIsEditMode] = useState(false);
    const apiRef = useGridApiRef();
    const initialFormData = {
        companyId: '',
        userId: '',
        name: '',
        title: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        status: true,
        customSlug: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(''); // Form içi hata mesajı
    const [zipLoading, setZipLoading] = useState(false); // QR ZIP indirme için yükleme durumu

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [filteredCards, setFilteredCards] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);

    const { showNotification } = useNotification();

    // Import için State'ler
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedImportCompanyId, setSelectedImportCompanyId] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importErrors, setImportErrors] = useState([]);
    const fileInputRef = useRef(null); // Dosya inputuna erişim için ref

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

    // Kullanıcıları Yükle
    const fetchUsersList = useCallback(async () => {
        try {
            const userData = await getUsers(); // getUsers artık diziyi dönmeli
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            console.error("Kullanıcı listesi getirilirken hata:", err);
            showNotification(err.response?.data?.message || 'Kullanıcı listesi yüklenemedi.', 'error');
            setUsers([]);
        }
    }, [showNotification]);

    // Kartları Yükle
    const fetchCards = useCallback(async () => {
        setLoading(true);
        try {
            const cardData = await getCards(); // API artık companyName ve userName/userEmail de dönmeli
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
        fetchUsersList(); // Kullanıcıları yükle
        fetchCards(); // Kartları yükle
    }, [fetchCompaniesList, fetchUsersList, fetchCards]);

    // Filter function
    const applyFilters = useCallback(() => {
        let filtered = cards;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(card => 
                card.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== '') {
            filtered = filtered.filter(card => card.status === (statusFilter === 'active'));
        }

        // Company filter
        if (companyFilter) {
            if (companyFilter === 'null') {
                filtered = filtered.filter(card => !card.companyId || card.companyId === null);
            } else {
                filtered = filtered.filter(card => card.companyId?.toString() === companyFilter);
            }
        }

        // User filter
        if (userFilter) {
            if (userFilter === 'null') {
                filtered = filtered.filter(card => !card.userId || card.userId === null);
            } else {
                filtered = filtered.filter(card => card.userId?.toString() === userFilter);
            }
        }

        // Date range filter
        if (dateFromFilter) {
            filtered = filtered.filter(card => {
                const cardDate = new Date(card.createdAt);
                const fromDate = new Date(dateFromFilter);
                return cardDate >= fromDate;
            });
        }

        if (dateToFilter) {
            filtered = filtered.filter(card => {
                const cardDate = new Date(card.createdAt);
                const toDate = new Date(dateToFilter);
                toDate.setHours(23, 59, 59, 999); // End of day
                return cardDate <= toDate;
            });
        }

        setFilteredCards(filtered);
    }, [cards, searchQuery, statusFilter, companyFilter, userFilter, dateFromFilter, dateToFilter]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setCompanyFilter('');
        setUserFilter('');
        setDateFromFilter('');
        setDateToFilter('');
    };

    const handleOpenModal = (card = null) => {
        setFormError(''); // Hataları temizle
        if (card) {
            setSelectedCard(card);
            setFormData({
                companyId: card.companyId || '',
                userId: card.userId || '',
                name: card.name || '',
                title: card.title || '',
                email: card.email || '',
                phone: card.phone || '',
                website: card.website || '',
                address: card.address || '',
                status: card.status !== undefined ? !!card.status : true,
                customSlug: card.customSlug || ''
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
        setFormData(initialFormData);
        setFormError('');
    };

    // QR Modal Açma Fonksiyonunu Güncelle
    const handleOpenQrModal = (card) => {
        if (!card) return;
        // Tam public URL'yi oluştur
        const publicUrl = `${window.location.origin}/card/${card.customSlug || card.id}`;
        setSelectedQrUrl(publicUrl); // State'i güncelle
        setSelectedCard(card); // Seçili kartı da tutalım (opsiyonel, modal başlığı için vs.)
        setQrModalOpen(true);
    };

    const handleCloseQrModal = () => {
        setQrModalOpen(false);
        setSelectedQrUrl(''); // URL'i temizle
        setSelectedCard(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let processedValue = type === 'checkbox' || type === 'switch' ? checked : value;

        // Şirket seçimi değiştiğinde, eğer bireysele geçildiyse kullanıcıyı sıfırlama (opsiyonel)
        // if (name === 'companyId' && processedValue === '') {
        //     setFormData(prev => ({ ...prev, companyId: '', userId: '' }));
        // } else {
             setFormData(prev => ({ ...prev, [name]: processedValue }));
        // }
    };

    // Form Gönderimi (Ekleme/Güncelleme)
    const handleFormSubmit = async () => {
        setFormLoading(true);
        setFormError('');

        // --- Validasyon --- 
        if (!formData.name) {
            setFormError('Kart adı zorunludur.');
            setFormLoading(false);
            return;
        }
        const companyIdSelected = formData.companyId && formData.companyId !== '';
        const userIdSelected = formData.userId && formData.userId !== '';

        if (!companyIdSelected && !userIdSelected) {
            setFormError('Lütfen bir Şirket veya bir Kullanıcı seçin.');
            setFormLoading(false);
            return;
        }
        if (!companyIdSelected && userIdSelected) {
             // Bireysel kart: Kullanıcı zorunlu (zaten kontrol edildi)
        }
         if (companyIdSelected && !userIdSelected) {
             // Kurumsal kart: Kullanıcı opsiyonel (Sorun yok)
        }
        // --- Validasyon Bitti ---

        const cardData = {
            ...formData,
            companyId: companyIdSelected ? parseInt(formData.companyId, 10) : null,
            userId: userIdSelected ? parseInt(formData.userId, 10) : null,
        };

        try {
            let resultCard;
            if (isEditMode && selectedCard) {
                resultCard = await updateCard(selectedCard.id, cardData);
                console.log('Backend updateCard yanıtı (resultCard):', resultCard);
                setCards(prevCards => prevCards.map(c => c.id === resultCard.id ? resultCard : c));
                showNotification('Kart başarıyla güncellendi.', 'success');
            } else {
                resultCard = await createCard(cardData);
                console.log('Backend createCard yanıtı (resultCard):', resultCard);
                setCards(prevCards => [resultCard, ...prevCards]); 
                showNotification('Kart başarıyla oluşturuldu.', 'success');
            }
            handleCloseModal();
        } catch (err) {
            console.error("Kart form submit hatası:", err);
            const errorMsg = err.response?.data?.message || 'İşlem başarısız oldu.';
            setFormError(errorMsg);
            showNotification(errorMsg, 'error');
        } finally {
            setFormLoading(false);
        }
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
            setCards(prevCards => prevCards.filter(c => c.id !== selectedCard.id));
            showNotification('Kart başarıyla silindi.', 'success');
            handleCloseDeleteConfirm();
        } catch (err) {
             console.error("Kart silme hatası:", err);
             showNotification(err.response?.data?.message || 'Kart silinemedi.', 'error');
        } finally {
             setFormLoading(false);
        }
    };

    // Excel'e Aktarma Fonksiyonu (Geçici olarak sadece görünür satırları alacak şekilde basitleştirildi)
    const handleExportExcel = () => {
        const visibleRows = apiRef.current?.getVisibleRowModels ? Array.from(apiRef.current.getVisibleRowModels().values()) : cards;

        if (visibleRows.length === 0) {
            showNotification("Dışa aktarılacak veri bulunamadı.", "warning");
            return;
        }

        // Excel için veriyi hazırla
        const excelData = visibleRows.map(card => ({
            'ID': card.id,
            'Kart Adı/Sahibi': card.name,
            'Özel URL Slug': card.customSlug || '-',
            'Kart URL': `${window.location.origin}/card/${card.customSlug || card.id}`,
            'Ünvan': card.title || '-',
            'Şirket Adı': card.companyName || '-',
            'Kullanıcı Adı': card.userName || '-',
            'Kullanıcı Email': card.userEmail || '-',
            'Durum': card.status ? 'Aktif' : 'Pasif',
            'Email': card.email || '-',
            'Telefon': card.phone || '-',
            'Web Sitesi': card.website || '-',
            'Adres': card.address || '-',
            'Oluşturulma Tarihi': new Date(card.createdAt).toLocaleString(),
            'Güncellenme Tarihi': new Date(card.updatedAt).toLocaleString(),
            'QR Kod Data URL': card.qrCodeData || '-' 
        }));

        // Çalışma sayfası oluştur
        const ws = XLSX.utils.json_to_sheet(excelData);
        // Çalışma kitabı oluştur ve sayfayı ekle
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Kartvizitler");

        // Dosyayı indir
        XLSX.writeFile(wb, "kartvizit_listesi.xlsx");
    };

    // --- Import Fonksiyonları ---\
    const handleOpenImportModal = () => {
        setSelectedImportCompanyId('');
        setSelectedFile(null);
        setImportErrors([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Önceki dosya seçimini temizle
        }
        setImportModalOpen(true);
    };

    const handleCloseImportModal = () => {
        setImportModalOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
            setImportErrors([]); // Yeni dosya seçildiğinde hataları temizle
        } else {
            setSelectedFile(null);
            showNotification('Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) seçin.', 'error');
        }
    };

    const handleImportSubmit = async () => {
        if (!selectedImportCompanyId) {
            showNotification('Lütfen kartların ekleneceği şirketi seçin.', 'warning');
            return;
        }
        if (!selectedFile) {
            showNotification('Lütfen içeri aktarılacak Excel dosyasını seçin.', 'warning');
            return;
        }

        setImportLoading(true);
        setImportErrors([]);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (!jsonData || jsonData.length === 0) {
                    showNotification('Excel dosyası boş veya okunamadı.', 'error');
                    setImportLoading(false);
                    return;
                }

                let successCount = 0;
                const errors = [];

                const normalizeHeader = (header) => String(header).toLowerCase().replace(/\s+/g, '');
                
                // Beklenen başlıkları tanımla (küçük harf, boşluksuz)
                const expectedHeaders = {
                    name: ['kartadı/sahibiadı', 'kartadı', 'ad', 'name'],
                    title: ['ünvan', 'title'],
                    email: ['email', 'eposta'],
                    phone: ['telefon', 'phone', 'tel'],
                    website: ['website', 'websitesi'],
                    address: ['adres', 'address'],
                    customSlug: ['özelurl', 'customslug', 'slug'],
                    status: ['durum', 'status', 'aktif']
                };

                const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
                const actualHeaders = headerRow.map(h => normalizeHeader(String(h)));
                
                console.log("Okunan Ham Başlıklar:", headerRow);
                console.log("Normalize Edilmiş Başlıklar:", actualHeaders);

                const nameHeaderFound = Object.keys(expectedHeaders.name).some(key => actualHeaders.includes(expectedHeaders.name[key]));
                if (!nameHeaderFound) {
                    errors.push({ row: 'Başlık Satırı', error: `Excel dosyasında zorunlu '${expectedHeaders.name.join(' veya ')}' sütunu bulunamadı.` });
                }

                for (let i = 0; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    const rowIndex = i + 2; // Excel satır numarası (1-başlıklı, veri 2'den başlar)
                    
                    // Normalize edilmiş başlıkları kullanarak veriyi al
                    const getRowValue = (possibleHeaders) => {
                        for (const possibleHeader of possibleHeaders) {
                             const headerIndex = actualHeaders.indexOf(possibleHeader);
                             if (headerIndex !== -1) {
                                 const originalHeader = headerRow[headerIndex]; // Orijinal başlığı al
                                 return row[originalHeader]; // Orijinal başlıkla veriyi oku
                             }
                        }
                        return undefined; // Eşleşen başlık yoksa
                    };

                    const cardName = getRowValue(expectedHeaders.name);

                    if (!cardName) {
                        errors.push({ row: rowIndex, error: `Bu satırda zorunlu 'Kart Adı/Sahibi Adı' bilgisi eksik.` });
                        continue; // Bu satırı atla
                    }

                    const cardTitle = getRowValue(expectedHeaders.title);
                    const cardEmail = getRowValue(expectedHeaders.email);
                    const cardPhone = getRowValue(expectedHeaders.phone);
                    const cardWebsite = getRowValue(expectedHeaders.website);
                    const cardAddress = getRowValue(expectedHeaders.address);
                    const cardCustomSlug = getRowValue(expectedHeaders.customSlug);
                    const statusValue = getRowValue(expectedHeaders.status);
                    // Durumu boolean yap (örn: 'Aktif', 1, true -> true; diğerleri -> false)
                    const cardStatus = statusValue ? ['aktif', 'active', 'true', '1', 1].includes(String(statusValue).toLowerCase()) : true; // Varsayılan aktif

                    const cardData = {
                        companyId: parseInt(selectedImportCompanyId, 10),
                        userId: null, // Şimdilik kullanıcı atanmıyor, isteğe bağlı eklenebilir
                        name: String(cardName), // Stringe çevir
                        title: cardTitle ? String(cardTitle) : '',
                        email: cardEmail ? String(cardEmail) : '',
                        phone: cardPhone ? String(cardPhone) : '',
                        website: cardWebsite ? String(cardWebsite) : '',
                        address: cardAddress ? String(cardAddress) : '',
                        customSlug: cardCustomSlug ? String(cardCustomSlug) : null,
                        status: cardStatus,
                    };

                    try {
                        await createCard(cardData);
                        successCount++;
                    } catch (err) {
                        const errorMsg = err.response?.data?.message || err.message || 'Bilinmeyen API hatası';
                        errors.push({ row: rowIndex, name: cardData.name, error: errorMsg });
                    }
                }

                setImportErrors(errors); // Hataları state'e ata
                
                let summaryMessage = `${successCount} kart başarıyla içe aktarıldı.`;
                 if (errors.length > 0) {
                    summaryMessage += ` ${errors.length} satırda hata oluştu. Detaylar için hata listesine bakın.`;
                    showNotification(summaryMessage, 'warning');
                 } else {
                     showNotification(summaryMessage, 'success');
                     handleCloseImportModal(); // Hata yoksa modalı kapat
                 }
               
                fetchCards(); // Kart listesini yenile

            } catch (error) {
                console.error("Excel dosyası okunurken/işlenirken hata:", error);
                showNotification(`Excel dosyası işlenirken bir hata oluştu: ${error.message}`, 'error');
                setImportErrors([{row: 'Genel', error: `Dosya işleme hatası: ${error.message}`}]);
            } finally {
                setImportLoading(false);
            }
        };

        reader.onerror = (error) => {
            console.error("Dosya okuma hatası:", error);
            showNotification('Dosya okunurken bir hata oluştu.', 'error');
            setImportLoading(false);
        };

        reader.readAsBinaryString(selectedFile);
    };
    // --- Import Fonksiyonları Bitti ---\

    // QR Kodlarını Toplu İndirme Fonksiyonu
    const handleDownloadAllQrs = async () => {
        if (!cards || cards.length === 0) {
            showNotification("İndirilecek QR kod bulunamadı.", "warning");
            return;
        }

        setZipLoading(true);
        const zip = new JSZip();

        for (const card of cards) {
            if (card.qrCodeData && typeof card.qrCodeData === 'string' && card.qrCodeData.startsWith('data:image/png;base64,')) {
                const base64Data = card.qrCodeData.split(',')[1];
                
                let fileName = 'qr_code.png';
                if (card.userName && String(card.userName).trim() !== '') {
                    fileName = `${String(card.userName).replace(/[^a-zA-Z0-9_.-]/g, '_')}.png`;
                } else if (card.name && String(card.name).trim() !== '') {
                    // Kullanıcı adı yoksa kart adını kullan, geçersiz karakterleri değiştir
                    fileName = `${String(card.name).replace(/[^a-zA-Z0-9_.-]/g, '_')}.png`;
                } else {
                    fileName = `kart_qr_${card.id}.png`;
                }

                // Aynı isimde dosya varsa sonuna bir sayaç ekleyerek benzersiz yap
                let counter = 1;
                let originalFileName = fileName.substring(0, fileName.lastIndexOf('.'));
                let extension = fileName.substring(fileName.lastIndexOf('.'));
                while (zip.file(fileName)) {
                    fileName = `${originalFileName}_${counter}${extension}`;
                    counter++;
                }

                zip.file(fileName, base64Data, { base64: true });
            } else {
                console.warn(`Kart ID ${card.id} için geçerli QR kod datası bulunamadı, atlanıyor.`);
            }
        }

        try {
            if (Object.keys(zip.files).length === 0) {
                showNotification("İndirilecek geçerli QR kodu bulunamadı.", "warning");
                setZipLoading(false);
                return;
            }
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'kartvizit_qr_kodlari.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            showNotification('Tüm QR kodlar başarıyla zip olarak indirildi!', 'success');
        } catch (error) {
            console.error("QR ZIP oluşturma/indirme hatası:", error);
            showNotification('QR kodları indirilirken bir hata oluştu.', 'error');
        } finally {
            setZipLoading(false);
        }
    };

    // DataGrid Kolonları
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 }, 
        { 
            field: 'qrCodeData', // Bu alan artık doğrudan kullanılmıyor ama sütun kalabilir
            headerName: 'QR', 
            width: 60, 
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                // QR kod ikonu her zaman gösterilebilir (QR backend'de üretiliyor varsayımı)
                <Tooltip title="QR Kodu Göster/İndir">
                    <IconButton size="small" onClick={() => handleOpenQrModal(params.row)}> 
                        <QrCodeIcon />
                    </IconButton>
                </Tooltip>
            )
        },
        { field: 'name', headerName: 'Kart Adı/Sahibi', width: 200 },
        { field: 'customSlug', headerName: 'Özel URL', width: 150, renderCell: (params) => params.value || '-' },
        { field: 'title', headerName: 'Ünvan', width: 150 },
        { field: 'companyName', headerName: 'Şirket', width: 180, renderCell: (params) => params.value || '-' }, 
        { field: 'userName', headerName: 'Kullanıcı', width: 180, renderCell: (params) => params.value || '-' },
        {
             field: 'status',
             headerName: 'Durum',
             width: 90,
             type: 'boolean',
             renderCell: (params) => (params.value ? 'Aktif' : 'Pasif') 
        },
        { field: 'email', headerName: 'Email', width: 180 },
        { field: 'phone', headerName: 'Telefon', width: 130 },
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
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                            🃏 Kartvizit Yönetimi
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Tüm kartvizitleri görüntüleyin ve yönetin
                        </Typography>
                    </Box>
                <Box>
                     <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExportExcel}
                        sx={{ mr: 1 }}
                        disabled={loading || cards.length === 0}
                     >
                         Excel'e Aktar (Görünür)
                     </Button>
                     <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleDownloadAllQrs}
                        sx={{ mr: 1 }}
                        disabled={loading || zipLoading || cards.length === 0}
                     >
                        {zipLoading ? <CircularProgress size={20} color="inherit" sx={{mr:1}} /> : null}
                        Toplu QR İndir
                     </Button>
                     <Button
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        onClick={handleOpenImportModal}
                        sx={{ ml: 1, mr: 1 }}
                        disabled={loading}
                     >
                         Excel'den İçeri Aktar
                     </Button>
                     <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                        disabled={loading}
                     >
                        Yeni Kart Ekle
                    </Button>
                </Box>
                </Box>
            </Box>

            {/* Filter Section */}
            <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                <Box 
                    sx={{ 
                        p: 2, 
                        backgroundColor: 'grey.50',
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
                            label={`${filteredCards.length} kart`}
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
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="İsim, email, telefon veya ünvan ara..."
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
                                    <InputLabel>Şirket</InputLabel>
                                    <Select
                                        value={companyFilter}
                                        onChange={(e) => setCompanyFilter(e.target.value)}
                                        label="Şirket"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">Tümü</MenuItem>
                                        <MenuItem value="null">Bireysel Kartlar</MenuItem>
                                        {companies.map(company => (
                                            <MenuItem key={company.id} value={company.id.toString()}>
                                                {company.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Kullanıcı</InputLabel>
                                    <Select
                                        value={userFilter}
                                        onChange={(e) => setUserFilter(e.target.value)}
                                        label="Kullanıcı"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="">Tümü</MenuItem>
                                        <MenuItem value="null">Kullanıcısız Kartlar</MenuItem>
                                        {users.map(user => (
                                            <MenuItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
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
                        
                        {/* Date Range Filters */}
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                📅 Oluşturulma Tarihi Aralığı
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        label="Başlangıç Tarihi"
                                        value={dateFromFilter}
                                        onChange={(e) => setDateFromFilter(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        label="Bitiş Tarihi"
                                        value={dateToFilter}
                                        onChange={(e) => setDateToFilter(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Collapse>
            </Card>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                 <DataGrid
                        rows={filteredCards}
                    columns={columns}
                    apiRef={apiRef} 
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                        sx={{ border: 'none' }}
                />
                </Paper>
            )}

            {/* Ekleme/Düzenleme Modalı */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditMode ? 'Kartı Düzenle' : 'Yeni Kart Oluştur'}</DialogTitle>
                <DialogContent>
                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

                    <TextField autoFocus margin="dense" id="name" name="name" label="Kart Adı / Sahibi Adı" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleInputChange} required disabled={formLoading} />
                    
                    {/* Şirket Seçimi */}
                    <FormControl fullWidth margin="dense" disabled={formLoading}>
                         <InputLabel id="company-select-label">Şirket (Kurumsal Kart İçin)</InputLabel>
                         <Select
                            labelId="company-select-label"
                            id="companyId"
                            name="companyId"
                            value={formData.companyId}
                            label="Şirket (Kurumsal Kart İçin)"
                            onChange={handleInputChange}
                        >
                            <MenuItem value=""><em>Bireysel Kart (Şirket Yok)</em></MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Kullanıcı Seçimi */}
                     <FormControl fullWidth margin="dense" disabled={formLoading} required={!formData.companyId} > {/* Şirket seçili değilse zorunlu */} 
                         <InputLabel id="user-select-label">Kullanıcı {formData.companyId ? '(Opsiyonel)' : '(Zorunlu)'}</InputLabel>
                         <Select
                            labelId="user-select-label"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            label={`Kullanıcı ${formData.companyId ? '(Opsiyonel)' : '(Zorunlu)'}`}
                            onChange={handleInputChange}
                        >
                            <MenuItem value=""><em>Kullanıcı Seç / Yok</em></MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Özel URL Alanı Eklendi */}
                    <TextField 
                        margin="dense" 
                        id="customSlug" 
                        name="customSlug" 
                        label="Özel URL (Opsiyonel)" 
                        helperText="Sadece harf, rakam ve tire kullanın (örn: caner-inali). Boş bırakırsanız ID kullanılır."
                        type="text" 
                        fullWidth 
                        variant="outlined" 
                        value={formData.customSlug}
                        onChange={handleInputChange} 
                        disabled={formLoading} 
                    />

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

            {/* Yeni QrCodeModal Komponentini Kullan */}
            <QrCodeModal
                open={qrModalOpen}
                onClose={handleCloseQrModal}
                url={selectedQrUrl} // Dinamik olarak oluşturulan URL
                // title={selectedCard ? `Kartvizit QR Kodu (${selectedCard.name})` : 'Kartvizit QR Kodu'} // İsteğe bağlı: Başlık ekleyebiliriz
            />

            {/* İçeri Aktarma Modalı */}
            <Dialog open={importModalOpen} onClose={handleCloseImportModal} maxWidth="sm" fullWidth>
                <DialogTitle>Excel'den Kartları İçe Aktar</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense" required disabled={importLoading}>
                        <InputLabel id="import-company-select-label">Kartların Ekleneceği Şirket</InputLabel>
                        <Select
                            labelId="import-company-select-label"
                            id="importCompanyId"
                            name="importCompanyId"
                            value={selectedImportCompanyId}
                            label="Kartların Ekleneceği Şirket"
                            onChange={(e) => setSelectedImportCompanyId(e.target.value)}
                        >
                            <MenuItem value="" disabled><em>Şirket Seçin...</em></MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Button
                            variant="outlined"
                            component="label" // Input'u gizleyip butonu tetikleyici yapar
                            fullWidth
                            disabled={importLoading}
                            startIcon={<UploadFileIcon />}
                        >
                            Excel Dosyası Seç (.xlsx, .xls)
                            <input 
                                type="file" 
                                hidden 
                                accept=".xlsx, .xls" 
                                onChange={handleFileChange} 
                                ref={fileInputRef} 
                            />
                        </Button>
                        {selectedFile && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Seçilen dosya: {selectedFile.name}
                            </Typography>
                        )}
                    </Box>

                    {/* Hata Listesi */}
                    {importErrors.length > 0 && (
                        <Box sx={{ maxHeight: 150, overflowY: 'auto', border: '1px solid red', p: 1, mt: 2 }}>
                            <Typography color="error" variant="subtitle2">İçe Aktarma Hataları:</Typography>
                            <List dense disablePadding>
                                {importErrors.map((err, index) => (
                                    <ListItem key={index} disableGutters dense>
                                        <ListItemText 
                                            primary={`Satır ${err.row}${err.name ? ' (' + err.name + ')' : ''}: ${err.error}`}
                                            primaryTypographyProps={{ variant: 'caption', color: 'error' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseImportModal} disabled={importLoading}>İptal</Button>
                    <Button 
                        onClick={handleImportSubmit} 
                        variant="contained" 
                        disabled={!selectedImportCompanyId || !selectedFile || importLoading}
                        startIcon={importLoading ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
                    >
                        {importLoading ? 'İçe Aktarılıyor...' : 'Kartları İçe Aktar'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default CardManagementPage; 