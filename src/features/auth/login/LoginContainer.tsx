import { LoginForm, TLoginField } from '@components/LoginForm/LoginForm';
import React, { FC, Reducer, useEffect, useReducer, useState } from 'react';
import { Divider, Link, Typography, ButtonGroup, Button, Stack, Alert, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

import { validateEmail } from './utils';
import { ALLOWED_OAUTH_PROVIDERS, useAuthContext } from '../AuthContextProvider';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { ProviderId } from 'firebase/auth';
import { TLoginWithEmailAndPasswordResult, TCreateUser } from '../types';
import { SignupForm } from '@components/SignupForm/SignupForm';

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

const getOAuthProviderInfo = (provider: string) => {
  switch (provider) {
    case ProviderId.GITHUB:
      return {
        icon: <GitHubIcon fontSize="inherit" />,
        text: 'Зайти через GitHub',
      };
    default:
      return {
        icon: <GoogleIcon fontSize="inherit" />,
        text: 'Зайти через Google',
      };
  }
};

export const LoginContainer: FC = () => {
  const history = useHistory();
  const { state: locationState, pathname: locationPathname } = useLocation<{ from: string }>();
  const { loginWithEmailAndPassword, loginWithOauthPopup, createUser } = useAuthContext();
  const [authError, setAuthError] = useState('');
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailState, dispatchEmail] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'Email',
    value: '',
  });

  const [passwordState, dispatchPassword] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'Пароль',
    value: '',
  });

  const [passwordRepeatState, dispatchPasswordRepeat] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'Подтвердить пароль',
    value: '',
  });

  const mapAuthCodeToMessage = (error: { code: string; message: string }) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    switch (errorCode) {
      case 'auth/wrong-password':
        return 'Неправильный пароль';

      case 'auth/user-not-found':
        return 'Такой аккаунт не найден';

      case 'auth/email-already-in-use':
        return 'Аккаунт с таким email уже зарегистрирован';

      case 'auth/account-exists-with-different-credential':
        return 'Такой аккаунт уже зарегистрирован';

      default:
        return errorMessage;
    }
  };

  const processLogin = (loginPromise: Promise<TLoginWithEmailAndPasswordResult | TCreateUser>) => {
    return loginPromise
      .then(() => {
        setIsLoading(false);
        history.push(locationState?.from || '/');
      })
      .catch((error) => {
        setAuthError((error && mapAuthCodeToMessage(error)) || 'error');
        setIsLoading(false);
      });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    let valid = true;
    if (!validateEmail(emailState.value)) {
      dispatchEmail({
        type: 'error',
        value: 'Введите корректный email',
      });
      valid = false;
    }

    if (passwordState.value.length <= 6) {
      dispatchPassword({
        type: 'error',
        value: 'Длинна пароля меньше 6-ти символов',
      });
      valid = false;
    }

    if (valid) {
      processLogin(loginWithEmailAndPassword(emailState.value, passwordState.value));
    } else {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let valid = true;
    if (!validateEmail(emailState.value)) {
      dispatchEmail({
        type: 'error',
        value: 'Введите корректный email',
      });
      valid = false;
    }

    if (passwordState.value.length <= 6) {
      dispatchPassword({
        type: 'error',
        value: 'Длинна пароля меньше 6-ти символов',
      });
      valid = false;
    }

    if (passwordRepeatState.value !== passwordState.value) {
      dispatchPasswordRepeat({
        type: 'error',
        value: 'Пароли не совпадают',
      });
      valid = false;
    }

    if (valid) {
      processLogin(createUser(emailState.value, passwordState.value));
    } else {
      setIsLoading(false);
    }
  };

  const onOauthLogin = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const dataset = (e.target as HTMLElement)?.closest<HTMLLinkElement>('[data-provider]')?.dataset;
    if (dataset?.provider) {
      processLogin(loginWithOauthPopup(dataset?.provider));
    }
  };

  const cleanUp = () => {
    setAuthError('');
    dispatchEmail({ type: 'change', value: '' });
    dispatchPassword({ type: 'change', value: '' });
    dispatchPasswordRepeat({ type: 'change', value: '' });
  };

  useEffect(() => {
    if (locationPathname === '/signup') {
      setIsSignup(true);
      cleanUp();
    } else {
      setIsSignup(false);
      cleanUp();
    }
  }, [locationPathname]);

  return (
    <Stack direction="column" alignItems="center" spacing={4}>
      <Typography variant="h4">{isSignup ? 'Новый аккаунт' : 'Вход'}</Typography>
      {authError && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {authError}
        </Alert>
      )}
      <Box sx={{ width: '100%' }}>
        {isSignup ? (
          <SignupForm
            email={{
              ...emailState,
              onChange: (e) => dispatchEmail({ type: 'change', value: e.target.value }),
            }}
            password={{
              ...passwordState,
              onChange: (e) => dispatchPassword({ type: 'change', value: e.target.value }),
            }}
            passwordRepeat={{
              ...passwordRepeatState,
              onChange: (e) => dispatchPasswordRepeat({ type: 'change', value: e.target.value }),
            }}
            onSubmit={onSignupSubmit}
            isLoading={isLoading}
          />
        ) : (
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
        )}
      </Box>
      {!isSignup ? (
        <Link component={NavLink} to="/signup">
          Создать аккаунт
        </Link>
      ) : (
        <Link component={NavLink} to="/login">
          Войти
        </Link>
      )}
      <Divider flexItem />
      <ButtonGroup sx={{ width: '100%' }}>
        {Object.keys(ALLOWED_OAUTH_PROVIDERS).map((item) => {
          return (
            <Button
              key={item}
              size="small"
              data-provider={item}
              onClick={onOauthLogin}
              startIcon={getOAuthProviderInfo(item).icon}
              sx={{ flex: '1 0 0' }}
            >
              {getOAuthProviderInfo(item).text}
            </Button>
          );
        })}
      </ButtonGroup>
    </Stack>
  );
};
