import { createTheme } from '@mui/material/styles';

const BRAND_YELLOW = 'rgba(244, 199, 52, 1)';
const BRAND_YELLOW_LIGHT = '#FFE38A';
const BRAND_YELLOW_DARK = '#C99506';
const BRAND_BLACK = '#000000';
const BRAND_BLACK_LIGHT = '#121212';
const BRAND_BLACK_DARK = '#050505';
const BRAND_WHITE = '#FFFFFF';

const sharedTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '1.875rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    letterSpacing: '0.01em',
  },
};

const sharedShape = {
  borderRadius: 10,
};

const sharedShadows = [
  'none',
  '0 1px 2px rgba(0,0,0,0.14)',
  '0 2px 4px rgba(0,0,0,0.16)',
  '0 4px 8px rgba(0,0,0,0.18)',
  '0 6px 12px rgba(0,0,0,0.2)',
  '0 8px 16px rgba(0,0,0,0.22)',
  ...Array(19).fill('0 10px 20px rgba(0,0,0,0.24)'),
];

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: BRAND_YELLOW,
      light: BRAND_YELLOW_LIGHT,
      dark: BRAND_YELLOW_DARK,
      contrastText: BRAND_BLACK,
    },
    secondary: {
      main: BRAND_BLACK,
      light: BRAND_BLACK_LIGHT,
      dark: BRAND_BLACK_DARK,
      contrastText: BRAND_YELLOW,
    },
    background: {
      default: '#FDF7DB',
      paper: BRAND_WHITE,
    },
    text: {
      primary: BRAND_BLACK,
      secondary: '#3C3620',
    },
    warning: {
      main: BRAND_YELLOW_DARK,
    },
    error: {
      main: '#E53935',
    },
    success: {
      main: '#2E7D32',
    },
    grey: {
      50: '#FFF9E6',
      100: '#F6E6A8',
      200: '#E3CD70',
      300: '#BFA24F',
      400: '#8F7836',
      500: '#5E5123',
      600: '#403814',
      700: '#2B270E',
      800: '#1A1909',
      900: '#0C0C05',
    },
  },
  typography: {
    ...sharedTypography,
    h1: { ...sharedTypography.h1, color: BRAND_BLACK },
    h2: { ...sharedTypography.h2, color: BRAND_BLACK },
    h3: { ...sharedTypography.h3, color: BRAND_BLACK },
    h4: { ...sharedTypography.h4, color: BRAND_BLACK },
    h5: { ...sharedTypography.h5, color: BRAND_BLACK },
    h6: { ...sharedTypography.h6, color: BRAND_BLACK },
    body1: { ...sharedTypography.body1, color: '#3C3620' },
    body2: { ...sharedTypography.body2, color: '#5C5230' },
  },
  shape: sharedShape,
  shadows: sharedShadows,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BRAND_YELLOW,
          color: BRAND_BLACK,
          borderBottom: `1px solid ${BRAND_BLACK}14`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 22px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.18)',
          },
        },
        containedPrimary: {
          backgroundColor: BRAND_YELLOW,
          color: BRAND_BLACK,
          '&:hover': {
            backgroundColor: BRAND_YELLOW_DARK,
          },
        },
        containedSecondary: {
          backgroundColor: BRAND_BLACK,
          color: BRAND_YELLOW,
          '&:hover': {
            backgroundColor: BRAND_BLACK_LIGHT,
          },
        },
        outlinedPrimary: {
          borderColor: `${BRAND_BLACK}66`,
          color: BRAND_BLACK,
          '&:hover': {
            borderColor: BRAND_BLACK,
            backgroundColor: `${BRAND_YELLOW}22`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${BRAND_BLACK}14`,
          boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          backgroundColor: `${BRAND_YELLOW}33`,
          color: BRAND_BLACK,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          backgroundColor: BRAND_YELLOW,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: '#5C5230',
          '&.Mui-selected': {
            color: BRAND_BLACK,
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: BRAND_YELLOW,
      light: BRAND_YELLOW_LIGHT,
      dark: BRAND_YELLOW_DARK,
      contrastText: BRAND_BLACK,
    },
    secondary: {
      main: BRAND_BLACK,
      light: BRAND_BLACK_LIGHT,
      dark: BRAND_BLACK_DARK,
      contrastText: BRAND_YELLOW,
    },
    background: {
      default: BRAND_BLACK_DARK,
      paper: BRAND_BLACK_LIGHT,
    },
    text: {
      primary: '#F8F4DC',
      secondary: '#D6C472',
    },
    warning: {
      main: BRAND_YELLOW,
    },
    error: {
      main: '#FF7961',
    },
    success: {
      main: '#5AD66F',
    },
    grey: {
      50: '#1B1B1B',
      100: '#232323',
      200: '#2E2E2E',
      300: '#3C3C3C',
      400: '#555555',
      500: '#6E6E6E',
      600: '#8A8A8A',
      700: '#A7A7A7',
      800: '#C3C3C3',
      900: '#E0E0E0',
    },
  },
  typography: {
    ...sharedTypography,
    h1: { ...sharedTypography.h1, color: '#F8F4DC' },
    h2: { ...sharedTypography.h2, color: '#F8F4DC' },
    h3: { ...sharedTypography.h3, color: '#F8F4DC' },
    h4: { ...sharedTypography.h4, color: '#F8F4DC' },
    h5: { ...sharedTypography.h5, color: '#F8F4DC' },
    h6: { ...sharedTypography.h6, color: '#F8F4DC' },
    body1: { ...sharedTypography.body1, color: '#D6C472' },
    body2: { ...sharedTypography.body2, color: '#B8A555' },
  },
  shape: sharedShape,
  shadows: sharedShadows,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BRAND_YELLOW,
          color: BRAND_BLACK,
          borderBottom: `1px solid ${BRAND_BLACK}33`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 22px',
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: BRAND_YELLOW,
          color: BRAND_BLACK,
          '&:hover': {
            backgroundColor: BRAND_YELLOW_DARK,
          },
        },
        containedSecondary: {
          backgroundColor: BRAND_BLACK,
          color: BRAND_YELLOW,
          '&:hover': {
            backgroundColor: BRAND_BLACK_LIGHT,
          },
        },
        outlinedPrimary: {
          borderColor: `${BRAND_YELLOW}99`,
          color: BRAND_YELLOW,
          '&:hover': {
            borderColor: BRAND_YELLOW,
            backgroundColor: `${BRAND_YELLOW}14`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${BRAND_YELLOW}22`,
          backgroundColor: BRAND_BLACK_LIGHT,
          boxShadow: '0 12px 24px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          backgroundColor: BRAND_YELLOW,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: '#A7A7A7',
          '&.Mui-selected': {
            color: BRAND_YELLOW,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          backgroundColor: `${BRAND_YELLOW}26`,
          color: BRAND_YELLOW,
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
export default lightTheme;
