import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { TAuthContext, TToken } from './types';
import { AUTH_TOKEN } from './constants';

export const authContext = createContext<TAuthContext>({
  token: null,
  setToken: () => void 0,
  tokenJWT: null,
  logIn: () => void 0,
  logOut: () => void 0,
});

export const useAuthContext = (): TAuthContext => {
  return useContext<TAuthContext>(authContext);
};

export const AuthContextProvider: FC = (props) => {
  const getToken = (): string | null => localStorage.getItem(AUTH_TOKEN);

  const [token, setToken] = useState<string | null>(getToken());
  const [tokenJWT, setTokenJWT] = useState<TToken | null>(null);

  // Store parsed token value
  useEffect(() => {
    if (token) {
      const parsedToken = jwt(token) as TToken;

      // Check token expiration date
      if (parsedToken.exp * 1000 >= Date.now()) {
        setTokenJWT(jwt(token));
      } else {
        logOut();
      }
    } else {
      setTokenJWT(null);
    }
  }, [token]);

  const logIn = (token: string) => {
    localStorage.setItem(AUTH_TOKEN, token);
    setToken(token);
  };

  const logOut = () => {
    localStorage.removeItem(AUTH_TOKEN);
    setToken(null);
  };

  return (
    <authContext.Provider
      value={{
        token,
        setToken,
        tokenJWT,
        logIn,
        logOut,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};
