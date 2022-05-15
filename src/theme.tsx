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
    divider: '#ccd6e1',
  },
  typography: {
    h1: {
      fontSize: '3.2rem',
    },
    fontSize: 16,
    h2: {
      fontSize: '2.7rem',
    },
    h3: {
      fontSize: '2rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.3rem',
    },
    h6: {
      fontSize: '1rem',
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
          '&(:not(.Mui-error):hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#74c1b9',
          },
        },
        input: {
          fontSize: '1rem',
        },
      },
    },
  },
});
