import { LoginForm, TLoginField } from '@components/LoginForm/LoginForm';
import React, { FC, Reducer, useEffect, useReducer, useState } from 'react';
import { Typography, Stack, Alert } from '@mui/material';

import { validateEmail } from './utils';
import { Redirect, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useAuthContext } from '../AuthContextProvider';
import { useToken } from '../useToken';
import { LOGIN_MUTATION } from '../queries';
import jwt from 'jwt-decode';
import { TToken } from '../types';

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
  const history = useHistory();

  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailState, dispatchEmail] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'Email',
    value: '',
  });

  const [passwordState, dispatchPassword] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'Password',
    value: '',
  });

  const { setUser } = useAuthContext();
  const { token, setToken } = useToken();

  useEffect(() => {
    if (token) {
      const user = jwt(token) as TToken;
      console.log(user);
      setUser(user);
    }
  }, [token]);

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      identifier: emailState.value, //email.value,  'test@freshcells.de'
      password: passwordState.value, //password.value, 'KTKwXm2grV4wHzW'
    },
    onCompleted: ({ login }) => {
      setIsLoading(false);
      setToken(login.jwt);
      history.push('/');
    },
    onError: ({ graphQLErrors, networkError }) => {
      setIsLoading(false);

      if (networkError) {
        setAuthError('Please check your connection and try one more time');
      }

      if (graphQLErrors)
        graphQLErrors.forEach(({ message, extensions }) => {
          switch (extensions.code) {
            case 'INTERNAL_SERVER_ERROR':
              setAuthError('Please check your credentials and try one more time');
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
    if (emailState.value.length === 0) {
      dispatchEmail({
        type: 'error',
        value: 'Email is required',
      });
      valid = false;
    } else if (!validateEmail(emailState.value)) {
      dispatchEmail({
        type: 'error',
        value: 'Please enter correct email',
      });
      valid = false;
    }

    if (passwordState.value.length === 0) {
      dispatchPassword({
        type: 'error',
        value: 'Password  is required',
      });
      valid = false;
    }

    if (valid) {
      login();
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
      <Typography variant="h4" align="center">
        Sign in
      </Typography>
      {authError && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {authError}
        </Alert>
      )}
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
