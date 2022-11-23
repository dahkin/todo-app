import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { App } from './Components/App/App';
import { AuthContextProvider } from './features/auth/AuthContextProvider';

ReactDOM.render(
  <AuthContextProvider>
    <Router>
      <App />
    </Router>
  </AuthContextProvider>,
  document.getElementById('root')
);
