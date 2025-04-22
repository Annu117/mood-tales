import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  useTheme,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CreateIcon from '@mui/icons-material/Create';
import { useLanguage } from '../utils/LanguageContext';

const Home = () => {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <Box component="main">
      {/* Skip to main content link for keyboard navigation */}
      <Link
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          '&:focus': {
            left: '20px',
            top: '20px',
            width: 'auto',
            height: 'auto',
            padding: '10px',
            background: 'white',
            zIndex: 9999,
            textDecoration: 'none',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          },
        }}
      >
        {t('Skip to main content')}
      </Link>

      {/* Hero Section */}
      <Box
        component="section"
        aria-labelledby="hero-title"
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
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ fontWeight: 700 }}
                id="hero-title"
              >
                {t('Meet StoryPals: Your Interactive Storyteller')}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                {t('Tell your mood, draw your characters, and let AI spin magical stories for you!')}
              </Typography>
 
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/story"
                  aria-label={t('Start with preferences')}
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
                    '&:focus-visible': {
                      outline: '3px solid #ffffff80',
                    },
                  }}
                >
                  {t('Start with Preferences')}
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/create"
                  startIcon={<CreateIcon />}
                  aria-label={t('Create a Story')}
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
                    '&:focus-visible': {
                      outline: '3px solid #ff6d0080',
                    },
                  }}
                >
                  {t('Create a Story')}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/api/placeholder/500/400"
                alt={t('Kid interacting with AI storytelling app')}
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
      <Container 
        maxWidth="lg" 
        sx={{ py: 10 }}
        id="main-content"
        component="section"
        aria-labelledby="how-it-works-title"
      >
        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight="bold" 
          gutterBottom
          id="how-it-works-title" 
        >
          {t('How StoryPals Works')}
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {t('Just 3 simple steps to create your own emotion-based story!')}
        </Typography>

        <Grid container spacing={6}>
          {[
            {
              icon: <PsychologyIcon sx={{ fontSize: 60 }} aria-hidden="true" />,
              title: t('Share Your Mood'),
              text: t('Choose how you\'re feeling today – happy, sad, excited, or more!'),
            },
            {
              icon: <CreateIcon sx={{ fontSize: 60 }} aria-hidden="true" />,
              title: t('Draw or Describe a Character'),
              text: t('Use drawing tools or describe your character in words.'),
            },
            {
              icon: <AutoStoriesIcon sx={{ fontSize: 60 }} aria-hidden="true" />,
              title: t('Get Your Personalized Story'),
              text: t('AI combines your mood and character to generate a magical tale.'),
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
                  height: '100%',
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
            aria-label={t('Start your story adventure')}
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
              '&:focus-visible': {
                outline: '3px solid #ff6d0080',
              },
            }}
          >
            {t('Start Your Story Adventure')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;