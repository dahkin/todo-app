import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  signOut,
  UserCredential,
  signInWithPopup,
  ProviderId,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { TAuthContext } from './types';
import { FirebaseApp } from 'firebase/app';

type TProps = {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
};

export const ALLOWED_OAUTH_PROVIDERS: Record<string, any> = {
  [ProviderId.GOOGLE]: new GoogleAuthProvider(),
  [ProviderId.GITHUB]: new GithubAuthProvider(),
};

export const authContext = createContext<TAuthContext>({
  isAuthenticated: null,
  loginWithEmailAndPassword: () => Promise.reject({}),
  loginWithOauthPopup: () => Promise.reject({}),
  logOut: () => void 0,
  createUser: () => Promise.reject({}),
});

export const useAuthContext = (): TAuthContext => {
  return useContext<TAuthContext>(authContext);
};

export const AuthContextProvider: FC<TProps> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<TAuthContext['isAuthenticated']>(null);
  const [user, setUser] = useState<any>(null);
  const [auth] = useState(getAuth(props.firebaseApp));

  useEffect(() => {
    if (!auth) {
      return;
    }
    auth.setPersistence(browserLocalPersistence);
    auth.languageCode = 'ru';

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, [auth]);

  const processLogin = (loginPromise: Promise<UserCredential>) => {
    setUser(null);
    setIsAuthenticated(null);
    return loginPromise
      .then((result) => {
        // log success auth
        return result;
      })
      .catch((error) => {
        // log auth errors
        throw error;
      });
  };

  const loginWithEmailAndPassword = (email: string, password: string) => {
    return processLogin(signInWithEmailAndPassword(auth, email, password));
  };

  const loginWithOauthPopup = (providerId: string) => {
    return processLogin(signInWithPopup(auth, ALLOWED_OAUTH_PROVIDERS[providerId]));
  };

  const createUser = (email: string, password: string) => {
    setUser(null);
    setIsAuthenticated(null);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  };

  const logOut = () => {
    signOut(auth);
    setIsAuthenticated(false);
  };

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        user,
        loginWithEmailAndPassword,
        loginWithOauthPopup,
        logOut,
        createUser,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};
