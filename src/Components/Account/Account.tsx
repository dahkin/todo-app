import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import { Loader } from '../Loader/Loader';
import { GET_USER } from '@features/auth/queries';
import { useAuthContext } from '@features/auth/AuthContextProvider';

// MUI
import { Stack, Button, Typography, TextField, InputAdornment } from '@mui/material';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export const Account: FC = () => {
  const { tokenJWT, logOut } = useAuthContext();

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      id: tokenJWT && tokenJWT.id,
    },
  });

  const { t } = useTranslation();

  if (loading) return <Loader loading />;
  if (error) return <div>{`Error! ${error.message}`}</div>;

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        <AccountCircleOutlinedIcon fontSize="large" />
        <Typography variant="h1">{t('account_title')}</Typography>
      </Stack>
      <Stack direction="column" spacing={2}>
        <TextField
          fullWidth
          label={t('firstname')}
          variant="outlined"
          name="first-name"
          defaultValue={data.user.firstName}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <BadgeOutlined fontSize="small" color="disabled" />
              </InputAdornment>
            ),
            className: 'test',
          }}
        />
        <TextField
          fullWidth
          label={t('lastname')}
          variant="outlined"
          name="last-name"
          defaultValue={data.user.lastName}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <BadgeOutlined fontSize="small" color="disabled" />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" justifyContent="flex-end">
          <Button type="button" variant="contained" color="error" onClick={logOut} startIcon={<LogoutOutlinedIcon />}>
            {t('logout')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
