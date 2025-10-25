import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography 
} from '@mui/material';
import { LANGUAGE_LIST, getLanguageByCode } from '../constants/languages';

/**
 * Language Selector Component
 * @param {Object} props
 * @param {string} props.value - Current selected language code
 * @param {Function} props.onChange - Callback function when language changes
 * @param {boolean} props.disabled - Disable the selector
 * @param {string} props.label - Label for the selector
 * @param {boolean} props.showFlag - Show flag emoji
 * @param {string} props.size - Size of the select component
 */
const LanguageSelector = ({ 
  value = 'tr', 
  onChange, 
  disabled = false,
  label = 'Dil / Language',
  showFlag = true,
  size = 'medium'
}) => {
  
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <FormControl fullWidth size={size} disabled={disabled}>
      <InputLabel id="language-selector-label">{label}</InputLabel>
      <Select
        labelId="language-selector-label"
        id="language-selector"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {LANGUAGE_LIST.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {showFlag && <span style={{ fontSize: '1.2em' }}>{lang.flag}</span>}
              <Typography variant="body1">
                {lang.nativeName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                ({lang.code.toUpperCase()})
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
