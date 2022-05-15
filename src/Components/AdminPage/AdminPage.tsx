import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import { useAuthContext } from '../../features/auth/AuthContextProvider';

export const AdminPage: FC = ({ children }) => {
  const { isAuthenticated, logOut, user } = useAuthContext();
  const history = useHistory();
  const onLogOut = () => {
    logOut();
    history.push('/login');
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Туду-лист
          </Typography>
          {isAuthenticated === true && (
            <Stack spacing={2} direction="row" alignItems="center">
              <Typography variant="subtitle2" color="inherit">
                {user.email}
              </Typography>
              <IconButton color="inherit" onClick={onLogOut}>
                <LogoutIcon />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={5}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
