import React, { FC } from 'react';
import { useAuthContext } from '@features/auth/AuthContextProvider';
import { LocaleSwitcher } from '@features/locale/components/LocaleSwitcher/LocaleSwitcher';

// MUI
import { Stack, Box, AppBar, Toolbar, Grid, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';

export const Page: FC = ({ children }) => {
  const { token, logOut } = useAuthContext();
  const { t } = useTranslation();

  return (
    <Box>
      <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-end" flex="1 0 auto">
            <LocaleSwitcher />
            {token && (
              <IconButton color="inherit" onClick={logOut} aria-label={`${t('logout')}`}>
                <LogoutIcon />
              </IconButton>
            )}
          </Stack>
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
