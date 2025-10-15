import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// MUI imports
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

function HomePage() {
    const { isLoggedIn, user } = useAuth();

    return (
        <Paper 
            elevation={3} 
            sx={{
                padding: 4, 
                textAlign: 'center', 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%'
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom>
                Dijinew Dijital Kartvizit
            </Typography>
            
            {isLoggedIn ? (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Hoş geldiniz, {user?.name || 'Kullanıcı'}!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Kartvizitlerinizi yönetmeye başlayabilirsiniz.
                    </Typography>
                    <Button 
                        variant="contained" 
                        component={RouterLink} 
                        to="/cards"
                    >
                        Kartvizitlerim
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Modern dijital kartvizit çözümüne hoş geldiniz.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Başlamak için giriş yapın veya yeni bir hesap oluşturun.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" component={RouterLink} to="/login">
                            Giriş Yap
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Genel içerik veya özellik tanıtımları buraya eklenebilir */}
        </Paper>
    );
}

export default HomePage; 