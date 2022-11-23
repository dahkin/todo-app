import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#74c1b9',
      contrastText: '#354251',
    },
    secondary: {
      main: '#ff6368',
      contrastText: '#354251',
    },
    text: {
      primary: '#354251',
      secondary: '#445567',
      disabled: '#54687d',
    },
    warning: {
      main: '#e5c97a',
      contrastText: '#354251',
    },
    success: {
      main: '#73BC6F',
      contrastText: '#354251',
    },
    info: {
      main: '#9FB4E2',
      contrastText: '#354251',
    },
    error: {
      main: '#D03744',
    },
    divider: '#e1e5f1',
  },
  typography: {
    h1: {
      fontSize: '2rem',
    },
    h2: {
      fontSize: '1.5em',
    },
    h3: {
      fontSize: '1.3rem',
    },
  },
  components: {
    // Name of the component
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#ccd6e1',
        },
        root: {
          background: '#fff',
        },
      },
    },
  },
});
