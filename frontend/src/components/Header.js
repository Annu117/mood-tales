// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Header = () => {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BrushIcon sx={{ mr: 1 }} />
            <AutoStoriesIcon sx={{ mr: 1 }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Story Creator
            </Typography>
          </Box>
          <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
            Draw, Create, Imagine!
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;