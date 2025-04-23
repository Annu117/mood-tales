// components/Navbar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage, languages } from '../utils/LanguageContext';

const languageFlags = {
  en: '🇺🇸',
  hi: '🇮🇳',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  ja: '🇯🇵',
  zh: '🇨🇳'
};

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    handleLanguageClose();
  };

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1}
      sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AutoStoriesIcon sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
            <Typography 
              variant="h5" 
              component={RouterLink} 
              to="/"
              sx={{ 
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'primary.main'
              }}
            >
              {t('StoryPals')}
            </Typography>
          </Box>
          <Button 
            sx={{ color: 'text.primary' }} 
            component={RouterLink} 
            to="/"
          >
            {t('Home')}
          </Button>
          <Button 
            sx={{ color: 'text.primary' }} 
            component={RouterLink} 
            to="/create"
          >
            {t('Create a Story')}
          </Button>
          <Button 
            sx={{ color: 'text.primary' }} 
            component={RouterLink} 
            to="/storytelling"
          >
            {t('Interactive Story')}
          </Button>
          <IconButton
            onClick={handleLanguageClick}
            sx={{ ml: 2 }}
            aria-label="Select language"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon />
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {languageFlags[language]} {languages[language]}
              </Typography>
            </Box>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageClose}
            PaperProps={{
              sx: {
                maxHeight: 300,
                width: 200,
              },
            }}
          >
            {Object.entries(languages).map(([code, name]) => (
              <MenuItem
                key={code}
                selected={language === code}
                onClick={() => handleLanguageSelect(code)}
                sx={{ py: 1 }}
              >
                <ListItemIcon>
                  <Typography variant="body1">{languageFlags[code]}</Typography>
                </ListItemIcon>
                <ListItemText 
                  primary={name}
                  sx={{ 
                    '& .MuiTypography-root': {
                      fontWeight: language === code ? 'bold' : 'normal'
                    }
                  }}
                />
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
