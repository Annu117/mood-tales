import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import CreateStory from './pages/CreateStory';
import ReadStory from './pages/ReadStory';
import Navbar from './components/Navbar';

// Create a colorful theme suitable for kids
const theme = createTheme({
  palette: {
    primary: {
      main: '#4e7de9',
    },
    secondary: {
      main: '#ff6d00',
    },
    background: {
      default: '#f5f7ff',
    },
  },
  typography: {
    fontFamily: '"Comic Neue", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
        },
        containedPrimary: {
          boxShadow: '0 4px 8px rgba(78, 125, 233, 0.3)',
        },
        containedSecondary: {
          boxShadow: '0 4px 8px rgba(255, 109, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateStory />} />
          <Route path="/read/:storyId" element={<ReadStory />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;