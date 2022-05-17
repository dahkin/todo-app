import { Redirect, Route, RouteProps } from 'react-router-dom';
import React, { FC } from 'react';
import { useAuthContext } from '../../features/auth/AuthContextProvider';
import { Loader } from '../Loader/Loader';

type TProps = {
  children: React.ReactNode;
} & RouteProps;

export const PrivateRoute: FC<TProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated === null) {
    return <Loader loading />;
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
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
