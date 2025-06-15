import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    IconButton,
    Tooltip,
    Alert
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    CreditCard as CardIcon,
    Settings as SystemIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const CorporateActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    
    // Filters
    const [filters, setFilters] = useState({
        actionType: '',
        targetType: ''
    });

    const actionTypeOptions = [
        { value: '', label: 'Tüm İşlemler' },
        { value: 'create', label: 'Oluşturma' },
        { value: 'update', label: 'Güncelleme' },
        { value: 'delete', label: 'Silme' },
        { value: 'view', label: 'Görüntüleme' },
        { value: 'login', label: 'Giriş' },
        { value: 'logout', label: 'Çıkış' }
    ];

    const targetTypeOptions = [
        { value: '', label: 'Tüm Hedefler' },
        { value: 'user', label: 'Kullanıcı' },
        { value: 'card', label: 'Kartvizit' },
        { value: 'company', label: 'Şirket' },
        { value: 'system', label: 'Sistem' }
    ];

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user?.token;
            
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });

            // Add filters to params
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            const response = await axios.get(
                `${API_BASE_URL}/api/activities/corporate?${params}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setActivities(response.data.data);
                setTotalPages(response.data.totalPages);
                setTotalCount(response.data.totalCount);
            }
        } catch (error) {
            console.error('Aktiviteler yüklenirken hata:', error);
            setError('Aktiviteler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [page, filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setPage(1); // Reset to first page when filtering
    };

    const getActionTypeColor = (actionType) => {
        const colors = {
            create: 'success',
            update: 'info',
            delete: 'error',
            view: 'default',
            login: 'primary',
            logout: 'secondary'
        };
        return colors[actionType] || 'default';
    };

    const getTargetIcon = (targetType) => {
        const icons = {
            user: <PersonIcon />,
            card: <CardIcon />,
            company: <BusinessIcon />,
            system: <SystemIcon />
        };
        return icons[targetType] || <SystemIcon />;
    };



    if (loading && activities.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Aktiviteler yükleniyor...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Şirket Aktiviteleri
                </Typography>
                <Tooltip title="Yenile">
                    <IconButton onClick={fetchActivities} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Stats */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Toplam {totalCount} aktivite
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Şirketinize ait tüm kullanıcı aktiviteleri
                    </Typography>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <FilterIcon sx={{ mr: 1 }} />
                        Filtreler
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>İşlem Türü</InputLabel>
                                <Select
                                    value={filters.actionType}
                                    label="İşlem Türü"
                                    onChange={(e) => handleFilterChange('actionType', e.target.value)}
                                >
                                    {actionTypeOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Hedef Türü</InputLabel>
                                <Select
                                    value={filters.targetType}
                                    label="Hedef Türü"
                                    onChange={(e) => handleFilterChange('targetType', e.target.value)}
                                >
                                    {targetTypeOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Activities Table */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Kullanıcı</TableCell>
                                    <TableCell>İşlem</TableCell>
                                    <TableCell>Hedef</TableCell>
                                    <TableCell>Açıklama</TableCell>
                                    <TableCell>Tarih</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities.map((activity) => (
                                    <TableRow key={activity.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                                                    {activity.userName?.charAt(0) || 'U'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {activity.userName || 'Bilinmeyen'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {activity.userEmail}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={activity.actionType}
                                                color={getActionTypeColor(activity.actionType)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {getTargetIcon(activity.targetType)}
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body2">
                                                        {activity.targetType}
                                                    </Typography>
                                                    {activity.targetName && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {activity.targetName}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {activity.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {format(new Date(activity.createdAt), 'dd MMM yyyy HH:mm', { locale: tr })}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {activities.length === 0 && !loading && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                Henüz aktivite bulunmuyor
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Şirketinizde henüz herhangi bir aktivite gerçekleşmemiş
                            </Typography>
                        </Box>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(event, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default CorporateActivitiesPage; 