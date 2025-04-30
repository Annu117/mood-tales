import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { useLanguage } from '../utils/LanguageContext';
import TranslatedText from './common/TranslatedText';

const StoryDisplay = ({ story, characterImage, analysis }) => {
  const { t } = useLanguage();

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {characterImage && (
            <Box sx={{ mb: 2 }}>
              <img 
                src={characterImage} 
                alt={t("Your character")} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 300, 
                  borderRadius: 8,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          )}
          
          {analysis && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                <TranslatedText text="Drawing Analysis" />
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  <TranslatedText text="Description" />
                </Typography>
                <Typography variant="body2">
                  {analysis.description}
                </Typography>
              </Box>
              
              {analysis.features && analysis.features.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    <TranslatedText text="Features" />
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysis.features.map((feature, index) => (
                      <Chip 
                        key={index}
                        label={feature}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {analysis.colors && analysis.colors.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    <TranslatedText text="Colors" />
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysis.colors.map((color, index) => (
                      <Chip 
                        key={index}
                        label={color}
                        size="small"
                        style={{ backgroundColor: color, color: 'white' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {analysis.emotion && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    <TranslatedText text="Emotion" />
                  </Typography>
                  <Chip 
                    label={analysis.emotion}
                    color="secondary"
                    size="small"
                  />
                </Box>
              )}
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            <TranslatedText text="Your Story" />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            {story}
          </Typography>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined">{t('Read Again')}</Button>
        <Button variant="contained">{t('Create New Story')}</Button>
      </Box>
    </Paper>
  );
};

export default StoryDisplay;
