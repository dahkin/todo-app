import React, { FC, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import { Page } from '@components/Page/Page';
import { Account } from '@components/Account/Account';
import { PrivateRoute } from '@components/PrivateRoute/PrivateRoute';
import { LoginContainer } from '@features/auth/components/LoginContainer/LoginContainer';
import { AUTH_TOKEN } from '@features/auth/constants';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = createHttpLink({
  uri: 'https://cms.trial-task.k8s.ext.fcse.io/graphql',
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const App: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ApolloProvider client={client}>
      <Switch>
        <Route path="/login">
          <Page>
            <LoginContainer />
          </Page>
        </Route>
        <PrivateRoute path="/">
          <Page>
            <Account />
          </Page>
        </PrivateRoute>
      </Switch>
    </ApolloProvider>
  );
};
