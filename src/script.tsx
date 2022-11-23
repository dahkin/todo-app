import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from '@components/App/App';
import { Error } from '@components/Error/Error';
import { AuthContextProvider } from '@features/auth/AuthContextProvider';
import { initI18n } from '@features/locale/utils';
import { theme } from './theme';

// MUI
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

class ErrorBoundary extends React.Component<any, { error?: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: false,
    };
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  render() {
    return this.state.error ? <Error /> : this.props.children;
  }
}

initI18n(() => {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthContextProvider>
          <Router>
            <App />
          </Router>
        </AuthContextProvider>
      </ErrorBoundary>
    </ThemeProvider>,
    document.getElementById('root')
  );
});
