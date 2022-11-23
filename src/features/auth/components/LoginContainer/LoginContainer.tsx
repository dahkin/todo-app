import React, { FC, Reducer, useReducer, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { validateEmail } from './utils';
import { useAuthContext } from '../../AuthContextProvider';
import { LOGIN_MUTATION } from '../../queries';
import { LoginForm, TLoginField } from '@components/LoginForm/LoginForm';

// MUI
import { Typography, Stack, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

type TLoginFormFieldState = Omit<TLoginField, 'onChange'>;

type Action = { type: 'change' | 'error'; value: string };

function reducer(state: TLoginFormFieldState, action: Action): TLoginFormFieldState {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        error: false,
        helper: '',
        value: action.value,
      };
    case 'error':
      return {
        ...state,
        error: true,
        helper: action.value,
      };
    default:
      throw new Error();
  }
}

export const LoginContainer: FC = () => {
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation();

  const [emailState, dispatchEmail] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'email',
    value: '',
  });

  const [passwordState, dispatchPassword] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'password',
    value: '',
  });

  const { token, logIn } = useAuthContext();

  const [auth] = useMutation(LOGIN_MUTATION, {
    variables: {
      identifier: emailState.value, //'test@freshcells.de'
      password: passwordState.value, //'KTKwXm2grV4wHzW'
    },
    onCompleted: ({ login }) => {
      setIsLoading(false);
      logIn && logIn(login.jwt);
    },
    onError: ({ graphQLErrors, networkError }) => {
      setIsLoading(false);

      if (networkError) {
        setAuthError('network_error');
      }

      if (graphQLErrors)
        graphQLErrors.forEach(({ message, extensions }) => {
          switch (extensions.code) {
            case 'INTERNAL_SERVER_ERROR':
              setAuthError('server_error');
              break;
            default:
              setAuthError(message);
          }
        });
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    let valid = true;

    // Check email
    if (emailState.value.length === 0) {
      dispatchEmail({
        type: 'error',
        value: 'email_required_error',
      });
      valid = false;
    } else if (!validateEmail(emailState.value)) {
      dispatchEmail({
        type: 'error',
        value: 'email_validation_error',
      });
      valid = false;
    }

    // Check password
    if (passwordState.value.length === 0) {
      dispatchPassword({
        type: 'error',
        value: 'password_required_error',
      });
      valid = false;
    }

    if (valid) {
      auth();
    } else {
      setIsLoading(false);
    }
  };

  return token ? (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  ) : (
    <Stack direction="column" spacing={4}>
      <Typography variant="h1" align="center">
        {t('signin')}
      </Typography>
      {authError && <Alert severity="error">{t(authError)}</Alert>}
      <LoginForm
        email={{
          ...emailState,
          onChange: (e) => dispatchEmail({ type: 'change', value: e.target.value }),
        }}
        password={{
          ...passwordState,
          onChange: (e) => dispatchPassword({ type: 'change', value: e.target.value }),
        }}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Stack>
  );
};
