import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CreateIcon from '@mui/icons-material/Create';
import Story from './Story';
const Home = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4e7de9 0%, #ff6d00 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          px: 2,
          borderRadius: { xs: 0, md: '0 0 48px 48px' },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Meet StoryPals: Your Emotion-Aware Storyteller
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                Tell your mood, draw your characters, and let AI spin magical stories for you!
              </Typography>
 

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
  <Button
    variant="outlined"
    color="inherit"
    size="large"
    component={RouterLink}
    to="/story"
    sx={{
      px: 4,
      py: 1.5,
      fontSize: '1.05rem',
      borderRadius: '999px',
      borderColor: 'white',
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
    }}
  >
    Start with Preferences
  </Button>

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
      fontSize: '1.1rem',
      borderRadius: '999px',
      boxShadow: theme.shadows[4],
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[6],
      },
    }}
  >
    Create a Story
  </Button>
</Box>

            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/api/placeholder/500/400"
                alt="Kid interacting with AI storytelling"
                sx={{
                  width: '100%',
                  borderRadius: 6,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How it Works */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
          How StoryPals Works
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Just 3 simple steps to create your own emotion-based story!
        </Typography>

        <Grid container spacing={6}>
          {[
            {
              icon: <PsychologyIcon sx={{ fontSize: 60 }} />,
              title: 'Share Your Mood',
              text: 'Choose how you’re feeling today – happy, sad, excited, or more!',
            },
            {
              icon: <CreateIcon sx={{ fontSize: 60 }} />,
              title: 'Draw or Describe a Character',
              text: 'Use drawing tools or describe your character in words.',
            },
            {
              icon: <AutoStoriesIcon sx={{ fontSize: 60 }} />,
              title: 'Get Your Personalized Story',
              text: 'AI combines your mood and character to generate a magical tale.',
            },
          ].map((step, i) => (
            <Grid key={i} item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Box color="primary.main" mb={2}>
                  {step.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/create"
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: '999px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Start Your Story Adventure
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
