import React, { FC } from 'react';
// MUI
import { Box, Stack, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

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
  passwordRepeat: TLoginField;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
};

export const SignupForm: FC<TProps> = ({ className, email, password, passwordRepeat, onSubmit, isLoading }) => {
  return (
    <Box className={className}>
      <form onSubmit={onSubmit} method="POST">
        <Stack direction="column" spacing={2}>
          <TextField
            fullWidth
            label={email.name}
            variant="outlined"
            name={email.name}
            value={email.value}
            onChange={email.onChange}
            error={!!email.error}
            helperText={email.helper}
            autoComplete="email"
          />
          <TextField
            fullWidth
            type="password"
            label={password.name}
            variant="outlined"
            name={password.name}
            value={password.value}
            onChange={password.onChange}
            error={!!password.error}
            helperText={password.helper}
            autoComplete="current-password"
          />
          <TextField
            fullWidth
            type="password"
            label={passwordRepeat.name}
            variant="outlined"
            name={passwordRepeat.name}
            value={passwordRepeat.value}
            onChange={passwordRepeat.onChange}
            error={!!passwordRepeat.error}
            helperText={passwordRepeat.helper}
            autoComplete="current-password"
          />
          <LoadingButton loading={isLoading} type="submit" variant="contained" color="primary" size="large">
            Создать аккаунт
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  );
};
