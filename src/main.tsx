import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Toaster } from 'sonner';

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Toaster richColors position="top-center" expand={true} duration={2000} />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
