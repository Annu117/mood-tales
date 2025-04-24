import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import ScreenReaderAnnouncer from './utils/ScreenReaderAnnouncer';
import ScreenReaderDemo from './components/accessibility/ScreenReaderDemo';

// Import your existing components
import Home from './pages/Home';
import Story from './pages/Story';
import Storytelling from './pages/Storytelling';
import Draw from './pages/Draw';
import ImageStory from './pages/ImageStory';
import Settings from './pages/Settings';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScreenReaderAnnouncer />
      <Router>
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/storytelling" element={<Storytelling />} />
          <Route path="/draw" element={<Draw />} />
          <Route path="/image-story" element={<ImageStory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          
          {/* Accessibility Demo Route */}
          <Route path="/accessibility-demo" element={<ScreenReaderDemo />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 