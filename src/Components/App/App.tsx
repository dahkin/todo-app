import React, { FC, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { Page } from '../Page/Page';
import { TaskList } from '../TaskList/TaskList';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { LoginContainer } from '../../features/auth/login/LoginContainer';

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const AUTH_TOKEN = 'auth-token';

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
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/login">
            <Page>
              <LoginContainer />
            </Page>
          </Route>
          <PrivateRoute path="/">
            <Page>
              <TaskList />
            </Page>
          </PrivateRoute>
        </Switch>
      </ThemeProvider>
    </ApolloProvider>
  );
};
