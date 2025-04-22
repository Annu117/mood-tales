// components/Navbar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage, languages } from '../utils/LanguageContext';

const Navbar = () => {
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang) => {
    setCurrentLanguage(lang);
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
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageClose}
          >
            {Object.entries(languages).map(([code, name]) => (
              <MenuItem
                key={code}
                selected={currentLanguage === code}
                onClick={() => handleLanguageSelect(code)}
              >
                {name}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
