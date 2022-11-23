import React, { FC, useEffect, useState } from 'react';

// MUI
import { Stack, Button, Typography, TextField, InputAdornment } from '@mui/material';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Loader } from '../Loader/Loader';

import { gql, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useToken } from '../../features/auth/useToken';
import { GET_USER } from '../../features/auth/queries';
import { useAuthContext } from '../../features/auth/AuthContextProvider';

export const TaskList: FC = () => {
  const { token, clearAuthData } = useToken();
  const { user, setUser } = useAuthContext();

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      id: user,
    },
  });

  if (loading) return <Loader loading />;
  if (error) return <div>{`Error! ${error.message}`}</div>;

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        <AccountCircleIcon fontSize="large" />
        <Typography variant="h4">User</Typography>
      </Stack>
      <Stack direction="column" spacing={2}>
        <TextField
          fullWidth
          label="First Name"
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
          label="Last Name"
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
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={() => {
              clearAuthData();
              setUser(null);
              // navigate.push(`/login`);
            }}
            startIcon={<LogoutOutlinedIcon />}
          >
            Log out
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
