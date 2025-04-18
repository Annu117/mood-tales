// pages/Home.jsx
import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Paper,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          py: 8,
          borderRadius: { xs: 0, md: '0 0 48px 48px' }
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" gutterBottom>
                Create Amazing Stories with Your Drawings!
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Draw your own characters and watch them come to life in magical stories created just for you!
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={RouterLink}
                to="/create"
                startIcon={<CreateIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Start Drawing
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src="/api/placeholder/500/400"
                alt="Kids drawing characters"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* How it Works Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Three simple steps to create your own magical story
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <CreateIcon 
                color="primary" 
                sx={{ fontSize: 60, mb: 2 }} 
              />
              <Typography variant="h5" gutterBottom>
                Draw Your Character
              </Typography>
              <Typography variant="body1">
                Use our drawing tools to create your own unique character with colors and features you like.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <EmojiEmotionsIcon 
                color="primary" 
                sx={{ fontSize: 60, mb: 2 }} 
              />
              <Typography variant="h5" gutterBottom>
                AI Recognizes Emotions
              </Typography>
              <Typography variant="body1">
                Our AI will analyze your drawing and understand the emotions and features of your character.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <MenuBookIcon 
                color="primary" 
                sx={{ fontSize: 60, mb: 2 }} 
              />
              <Typography variant="h5" gutterBottom>
                Read Your Story
              </Typography>
              <Typography variant="body1">
                Enjoy a personalized story featuring your character with emotions that match your drawing.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/create"
          >
            Create Your Story Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;