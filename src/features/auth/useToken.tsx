import { useState } from 'react';

const AUTH_TOKEN = 'auth-token';

export const useToken = (): {
  setToken: (arg: string) => void;
  clearAuthData: () => void;
  token: string | null;
} => {
  const getToken = (): string | null => localStorage.getItem(AUTH_TOKEN);

  const [token, setToken] = useState<string | null>(getToken());

  const saveToken = (token: string) => {
    localStorage.setItem(AUTH_TOKEN, token);
    setToken(token);
  };

  const clearAuthData = () => {
    localStorage.removeItem(AUTH_TOKEN);
    setToken(null);
  };

  return {
    setToken: saveToken,
    token,
    clearAuthData,
  };
};
