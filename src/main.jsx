import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerGsap } from '@animations';
import App from './App.jsx';
import './index.css';

registerGsap();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
