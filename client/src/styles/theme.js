import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4A6741', // Earthy green
      light: '#6B8C5F',
      dark: '#2C3E28',
    },
    secondary: {
      main: '#8BA888', // Sage green
      light: '#A9BFA6',
      dark: '#6B7C69',
    },
    background: {
      default: '#FDFBF7', // Soft white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E28',
      secondary: '#4A6741',
    },
    success: {
      main: '#6B8C5F', // Growth green
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Comfortaa", sans-serif',
    h1: {
      fontFamily: '"Comfortaa", cursive',
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontFamily: '"Comfortaa", cursive',
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: '"Comfortaa", cursive',
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
}); 