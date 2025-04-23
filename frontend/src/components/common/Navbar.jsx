import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { TranslatedText } from './TranslatedText';

export const Navbar = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <TranslatedText text="StoryPals" />
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            onClick={() => changeLanguage('en')}
            disabled={language === 'en'}
          >
            English
          </Button>
          <Button 
            color="inherit" 
            onClick={() => changeLanguage('hi')}
            disabled={language === 'hi'}
          >
            हिंदी
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 