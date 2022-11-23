import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { TAuthContext } from './types';

type TProps = {
  children: React.ReactNode;
};

export const authContext = createContext<TAuthContext>({
  user: null,
  setUser: () => void 0,
});

export const useAuthContext = (): TAuthContext => {
  return useContext<TAuthContext>(authContext);
};

export const AuthContextProvider: FC<TProps> = (props) => {
  const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  // if (!auth) {
  //   return;
  // }
  // auth.setPersistence(browserLocalPersistence);
  // auth.languageCode = 'ru';
  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     setUser(user);
  //     setIsAuthenticated(true);
  //   } else {
  //     setUser(null);
  //     setIsAuthenticated(false);
  //   }
  // });
  // }, [auth]);

  // const processLogin = (loginPromise: Promise<UserCredential>) => {
  //   setUser(null);
  //   setIsAuthenticated(null);
  //   return loginPromise
  //     .then((result) => {
  //       // log success auth
  //       return result;
  //     })
  //     .catch((error) => {
  //       // log auth errors
  //       throw error;
  //     });
  // };

  // const login = (email: string, password: string) => {
  //   return null;
  //   // return processLogin(signInWithEmailAndPassword(auth, email, password));
  // };

  // const logOut = () => {
  //   // signOut(auth);
  //   setIsAuthenticated(false);
  // };

  return (
    <authContext.Provider
      value={{
        setUser,
        user,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};
