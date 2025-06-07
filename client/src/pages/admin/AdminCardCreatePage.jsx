import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCard } from '../../services/adminService';
import { getUsers } from '../../services/adminService';
import { getCompanies } from '../../services/adminService';

// MUI Imports
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress
} from '@mui/material';

function AdminCardCreatePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        status: true,
        customSlug: '',
        userId: '',
        companyId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, companiesData] = await Promise.all([
                    getUsers(),
                    getCompanies()
                ]);
                setUsers(usersData);
                setCompanies(companiesData);
            } catch (err) {
                console.error("Veri yükleme hatası:", err);
                setError('Kullanıcı ve şirket verileri yüklenemedi.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'status' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createCard(formData);
            navigate('/admin/cards');
        } catch (err) {
            console.error("Kartvizit oluşturma hatası:", err);
            setError(err.response?.data?.message || 'Kartvizit oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Yeni Kartvizit Oluştur
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <TextField
                            required
                            name="name"
                            label="Kart Adı"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            name="title"
                            label="Ünvan"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            name="email"
                            label="E-posta"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            name="phone"
                            label="Telefon"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            name="website"
                            label="Website"
                            value={formData.website}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            name="address"
                            label="Adres"
                            value={formData.address}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            name="customSlug"
                            label="Özel URL"
                            value={formData.customSlug}
                            onChange={handleChange}
                            fullWidth
                            helperText="Boş bırakılırsa otomatik oluşturulur"
                        />

                        <FormControl fullWidth>
                            <InputLabel>Şirket</InputLabel>
                            <Select
                                name="companyId"
                                value={formData.companyId}
                                onChange={handleChange}
                                label="Şirket"
                            >
                                <MenuItem value="">Şirket Seçin</MenuItem>
                                {companies.map(company => (
                                    <MenuItem key={company.id} value={company.id}>
                                        {company.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Kullanıcı</InputLabel>
                            <Select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                label="Kullanıcı"
                            >
                                <MenuItem value="">Kullanıcı Seçin</MenuItem>
                                {users.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.status}
                                    onChange={handleChange}
                                    name="status"
                                />
                            }
                            label="Aktif"
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/admin/cards')}
                                disabled={loading}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Oluştur'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default AdminCardCreatePage; 