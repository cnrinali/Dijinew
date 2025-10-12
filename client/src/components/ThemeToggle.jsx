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
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main',
            backgroundColor: 'primary.50',
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
