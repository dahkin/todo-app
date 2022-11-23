import { Dispatch, SetStateAction } from 'react';

export type TLoginResult = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type TToken = {
  exp: Date;
  iat: Date;
  id: number;
};

export type TAuthContext = {
  user: TToken | null;
  setUser: Dispatch<SetStateAction<TToken | null>>;
  // login?: (email: string, password: string) => Promise<TLoginResult>;
  // logOut: () => void;
  // auth?: any;
};
