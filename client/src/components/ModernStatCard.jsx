import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const ModernStatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  trend = null,
  trendValue = null,
  progress = null,
  subtitle = null
}) => {
  const getGradientColor = (color) => {
    const gradients = {
      primary: 'linear-gradient(135deg, #1565C0 0%, #2196F3 100%)',
      secondary: 'linear-gradient(135deg, #37474F 0%, #62727B 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    };
    return gradients[color] || gradients.primary;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? (
      <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
    ) : (
      <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
    );
  };

  const getTrendColor = () => {
    return trend === 'up' ? 'success.main' : 'error.main';
  };

  return (
    <Card
      sx={{
        height: '100%',
        background: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: getGradientColor(color),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {React.cloneElement(icon, { fontSize: 'small' })}
          </Box>
          
          {trend && trendValue && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getTrendIcon()}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getTrendColor(),
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 700,
              mb: 0.5,
              fontSize: '1.5rem'
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              mb: subtitle ? 1 : 0,
              fontSize: '0.85rem'
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                mb: progress !== null ? 2 : 0
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Progress Bar */}
          {progress !== null && (
            <Box sx={{ mt: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  İlerleme
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.75rem' }}>
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: getGradientColor(color),
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ModernStatCard; 