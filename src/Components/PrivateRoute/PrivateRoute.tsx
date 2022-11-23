import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuthContext } from '@features/auth/AuthContextProvider';

export const PrivateRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const { token } = useAuthContext();

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
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
