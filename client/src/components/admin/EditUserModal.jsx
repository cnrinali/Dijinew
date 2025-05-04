import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNotification } from '../../context/NotificationContext.jsx';

// MUI Imports
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Admin Servisi
import * as adminService from '../../services/adminService';

function EditUserModal({ open, onClose, user, onUpdateSuccess }) {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        } else {
            setFormData({ name: '', email: '' });
        }
    }, [user]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.email) {
            showNotification('İsim ve e-posta boş bırakılamaz.', 'error');
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showNotification('Geçersiz e-posta formatı.', 'error');
            setLoading(false);
            return;
        }

        try {
            const result = await adminService.updateAnyUserProfile(user.id, formData);
            showNotification('Kullanıcı bilgileri başarıyla güncellendi.', 'success');
            onUpdateSuccess(result.user);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Kullanıcı güncellenirken bir hata oluştu.';
            showNotification(errorMsg, 'error');
            console.error("Admin Edit User Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!open || !user) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Kullanıcı Düzenle (ID: {user.id})</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}> 
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="İsim"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="E-posta"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={loading}>İptal</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

EditUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default EditUserModal; 