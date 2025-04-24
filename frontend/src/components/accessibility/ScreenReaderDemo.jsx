import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Alert,
  Paper,
  useTheme
} from '@mui/material';
import { useScreenReaderAnnouncement } from '../../utils/ScreenReaderAnnouncer';
import { useLanguage } from '../../utils/LanguageContext';

const ScreenReaderDemo = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const { announce } = useScreenReaderAnnouncement();
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Example 1: Basic announcement
  const handleBasicAnnouncement = () => {
    announce(t('This is a basic announcement for screen readers'));
  };

  // Example 2: Form submission with announcement
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError(t('Please enter some text'));
      announce(t('Error: Please enter some text'), 'assertive');
      return;
    }
    
    setMessage(input);
    announce(t('Message submitted successfully: ') + input);
    setInput('');
  };

  // Example 3: Loading state announcement
  const handleLoadingDemo = () => {
    announce(t('Loading demo content, please wait...'));
    // Simulate loading
    setTimeout(() => {
      announce(t('Demo content loaded successfully'));
    }, 2000);
  };

  // Example 4: Error handling with announcement
  const handleErrorDemo = () => {
    setError(t('This is a simulated error'));
    announce(t('Error occurred: This is a simulated error'), 'assertive');
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        maxWidth: 600, 
        mx: 'auto', 
        mt: 4,
        borderRadius: 2
      }}
      role="region"
      aria-label={t('Screen Reader Demo')}
    >
      <Typography variant="h5" gutterBottom>
        {t('Screen Reader Announcements Demo')}
      </Typography>

      {/* Example 1: Basic Announcement */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleBasicAnnouncement}
          sx={{ mb: 1 }}
          aria-label={t('Trigger basic announcement')}
        >
          {t('Basic Announcement')}
        </Button>
        <Typography variant="body2" color="text.secondary">
          {t('Click to hear a basic screen reader announcement')}
        </Typography>
      </Box>

      {/* Example 2: Form with Announcement */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label={t('Enter a message')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mb: 2 }}
          aria-label={t('Message input field')}
        />
        <Button 
          type="submit" 
          variant="contained"
          aria-label={t('Submit message')}
        >
          {t('Submit')}
        </Button>
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>

      {/* Example 3: Loading State */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleLoadingDemo}
          sx={{ mb: 1 }}
          aria-label={t('Trigger loading demo')}
        >
          {t('Loading Demo')}
        </Button>
        <Typography variant="body2" color="text.secondary">
          {t('Click to hear loading state announcements')}
        </Typography>
      </Box>

      {/* Example 4: Error Handling */}
      <Box>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleErrorDemo}
          sx={{ mb: 1 }}
          aria-label={t('Trigger error demo')}
        >
          {t('Error Demo')}
        </Button>
        <Typography variant="body2" color="text.secondary">
          {t('Click to hear error announcements')}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default ScreenReaderDemo; 