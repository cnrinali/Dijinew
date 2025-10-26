import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const ThemeToggle = ({ size = 'medium', sx = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Açık Tema' : 'Koyu Tema'}>
      <IconButton
        onClick={toggleTheme}
        size={size}
        sx={{
          color: '#000000', // Siyah renk - sarı arka planda görünür
          '&:hover': {
            color: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Hafif siyah arka plan
          },
          ...sx
        }}
      >
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
