import { Redirect, Route, RouteProps } from 'react-router-dom';
import React, { FC } from 'react';
// import { useAuthContext } from '../../features/auth/AuthContextProvider';
import { Loader } from '../Loader/Loader';
import { useToken } from '../../features/auth/useToken';
import { useAuthContext } from '../../features/auth/AuthContextProvider';

type TProps = {
  children: React.ReactNode;
} & RouteProps;

export const PrivateRoute: FC<TProps> = ({ children, ...rest }) => {
  const { user } = useAuthContext();

  // if (isAuthenticated === null) {
  //   return <Loader loading />;
  // }

  // if (!token) return 'Loading...';
  // if (token === null) {
  //   return <Loader loading />;
  // }
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
