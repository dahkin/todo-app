import React, { FC, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { Page } from '../Page/Page';
import { AdminPage } from '../AdminPage/AdminPage';
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
          <AdminPage>
            <LoginContainer />
          </AdminPage>
        </Route>
        <PrivateRoute path="/">
          <AdminPage>
            <TaskList />
          </AdminPage>
        </PrivateRoute>
        {/*<Route path="/article/:id">*/}
        {/*  <Page>*/}
        {/*    <ArticleItem />*/}
        {/*  </Page>*/}
        {/*</Route>*/}
        {/*<Route path="/:categoryId">*/}
        {/*  <Page>*/}
        {/*    <Articles />*/}
        {/*  </Page>*/}
        {/*</Route>*/}
        {/*<Route path="/">*/}
        {/*  <Page>*/}
        {/*    <Articles />*/}
        {/*  </Page>*/}
        {/*</Route>*/}
      </Switch>
    </ThemeProvider>
  );
};
