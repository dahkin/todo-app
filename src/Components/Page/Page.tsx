import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContextProvider';
// Styles
import './Page.css';
// MUI
import { Box, Stack, AppBar, CssBaseline, Toolbar, Grid, Typography, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
// import { useToken } from '../../features/auth/useToken';

export const Page: FC = ({ children }) => {
  // const history = useHistory();
  // const onLogOut = () => {
  //   logOut();
  //   history.push('/login');
  // };

  const { user } = useAuthContext();

  return (
    <Box>
      <CssBaseline />
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flex: '1 0 auto', mr: 2 }}>
            Trial task
          </Typography>
          {user && (
            <Stack spacing={2} direction="row" alignItems="center" className="user-info">
              <Typography variant="subtitle2" color="inherit" className="user-info__email">
                {/*{user.email}*/}
              </Typography>
              {/*<IconButton color="inherit" onClick={onLogOut} aria-label="Log out">*/}
              {/*  <LogoutIcon />*/}
              {/*</IconButton>*/}
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: '1 0 auto', p: 3 }}>
        <Grid
          container
          justifyContent="center"
          sx={{
            margin: 'auto',
            maxWidth: 1600,
          }}
        >
          <Grid item xs={12} sm={8} md={6} lg={5}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
