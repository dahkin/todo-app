import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './common.css';
import { initializeAPI } from './api';
import { App } from './Components/App/App';
import { AuthContextProvider } from './features/auth/AuthContextProvider';

const firebaseApp = initializeAPI();

ReactDOM.render(
  <AuthContextProvider firebaseApp={firebaseApp}>
    <Router>
      <App />
    </Router>
  </AuthContextProvider>,
  document.getElementById('root')
);
