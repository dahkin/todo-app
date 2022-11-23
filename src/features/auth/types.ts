import { Dispatch, SetStateAction } from 'react';

export type TToken = {
  exp: number;
  iat: number;
  id: number;
};

export type TAuthContext = {
  tokenJWT: TToken | null;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  logIn: (token: string, email?: string) => void;
  logOut: () => void;
};
