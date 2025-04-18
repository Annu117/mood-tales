// components/Navbar.jsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Navbar = () => {
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
              StoryPals
            </Typography>
          </Box>
          <Button 
            sx={{ color: 'text.primary' }} 
            component={RouterLink} 
            to="/"
          >
            Home
          </Button>
          <Button 
            sx={{ color: 'text.primary' }} 
            component={RouterLink} 
            to="/create"
          >
            Create a Story
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
