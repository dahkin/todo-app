import React, { FC, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { Page } from '../Page/Page';
import { TaskList } from '../TaskList/TaskList';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { LoginContainer } from '../../features/auth/login/LoginContainer';

export const App: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/login">
          <Page>
            <LoginContainer />
          </Page>
        </Route>
        <Route path="/signup">
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
  );
};
