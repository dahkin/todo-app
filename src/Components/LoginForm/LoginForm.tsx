import React, { FC } from 'react';

// MUI
import { Box, Stack, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useTranslation } from 'react-i18next';

export type TLoginField = {
  name: string;
  error?: boolean;
  helper?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type TProps = {
  className?: string;
  email: TLoginField;
  password: TLoginField;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
};

export const LoginForm: FC<TProps> = ({ className, onSubmit, email, password, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Box className={className}>
      <form onSubmit={onSubmit}>
        <Stack direction="column" spacing={2}>
          <TextField
            fullWidth
            label={t(email.name)}
            variant="outlined"
            name={email.name}
            value={email.value}
            onChange={email.onChange}
            error={!!email.error}
            helperText={email.helper && t(email.helper)}
            autoComplete="email"
          />
          <TextField
            fullWidth
            type="password"
            label={t(password.name)}
            variant="outlined"
            name={password.name}
            value={password.value}
            onChange={password.onChange}
            error={!!password.error}
            helperText={password.helper && t(password.helper)}
            autoComplete="current-password"
          />
          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<LoginOutlinedIcon />}
            >
              {t('login')}
            </LoadingButton>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
