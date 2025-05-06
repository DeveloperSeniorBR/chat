import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Chat from './components/Chat';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Chat />
    </ThemeProvider>
  );
}

export default App;
