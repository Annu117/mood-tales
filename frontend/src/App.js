import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {  Container, Grid } from '@mui/material';
import theme from './theme/theme';
import PreferencesPanel from './components/PreferencesPanel';
// import HomePage from './pages/HomePage';
import Home from './pages/Home';
import CreateStory from './pages/CreateStory';
import ReadStory from './pages/ReadStory';
import Navbar from './components/Navbar';
import DrawingPage from './pages/DrawingPage';
import Story from './pages/Story';


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
          <Route path="/draw" element={<DrawingPage />} /> {/* Subpart */}
          <Route path="*" element={<Home />} />
          <Route path= "/story" element={<Story />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;