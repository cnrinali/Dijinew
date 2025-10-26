import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { getPublicCard } from '../services/cardService';

export default function QrCardPage() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Sayfa başlığını ayarla
    document.title = 'Yeni Nesil Kartvizit Dijinew';
    
    const fetchCard = async () => {
      try {
        const data = await getPublicCard(slug);
        setCard(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Kartvizit bilgileri alınamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [slug]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!card) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Kartvizit bulunamadı.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {card.name}
          </Typography>
          {card.title && (
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {card.title}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          {card.email && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                E-posta
              </Typography>
              <Typography variant="body1">{card.email}</Typography>
            </Box>
          )}

          {card.phone && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Telefon
              </Typography>
              <Typography variant="body1">{card.phone}</Typography>
            </Box>
          )}

          {card.company && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Şirket
              </Typography>
              <Typography variant="body1">{card.company}</Typography>
            </Box>
          )}

          {card.address && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Adres
              </Typography>
              <Typography variant="body1">{card.address}</Typography>
            </Box>
          )}

          {card.website && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Website
              </Typography>
              <Typography variant="body1">
                <a href={card.website} target="_blank" rel="noopener noreferrer">
                  {card.website}
                </a>
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
} 