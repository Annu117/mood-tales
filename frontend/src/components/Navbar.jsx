
// components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <AutoStoriesIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography 
              variant="h5" 
              component={RouterLink} 
              to="/"
              sx={{ 
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'white'
              }}
            >
              StoryPals
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/create"
          >
            Create Story
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;