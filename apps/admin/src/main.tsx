import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';

import App from './App';

const rootEl = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootEl);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
