import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useLanguage } from '../../utils/LanguageContext';

const StoryHeader = () => {
  const { t } = useLanguage();

  return (
    <Box
      component="section"
      sx={{
        background: 'linear-gradient(135deg, #4e7de9 0%, #ff6d00 100%)',
        color: 'white',
        py: { xs: 6, md: 8 },
        px: 2,
        borderRadius: { xs: 0, md: '0 0 48px 48px' },
        mb: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ fontWeight: 700 }}
            >
              {t('Create Your Magical Story')}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
              {t('Set your preferences and let our AI create a personalized tale just for you!')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
            <AutoStoriesIcon 
              sx={{ fontSize: { xs: 100, md: 150 }, opacity: 0.9 }} 
              aria-hidden="true"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StoryHeader;