import React from 'react';
import { Box, Button, CircularProgress, Paper, Typography, useTheme } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useLanguage } from '../../utils/LanguageContext';
import PreferencesPanel from '../PreferencesPanel';

const StoryPreferencesSection = ({ 
  age, setAge,
  selectedLanguage, setSelectedLanguage,
  selectedGenre, setSelectedGenre,
  favGenres, setFavGenres,
  characterName, setCharacterName,
  useCulturalContext, setUseCulturalContext,
  useMythology, setUseMythology,
  handleGenerateStory,
  isLoading
}) => {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        p: 4, 
        mb: 5, 
        borderRadius: 4,
        background: 'linear-gradient(to right, #f9f9ff, #ffffff)'
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        fontWeight="bold" 
        color="primary"
        sx={{ mb: 3 }}
        id="preferences-title"
      >
        {t('Story Preferences')}
      </Typography>
      
      <div role="form" aria-labelledby="preferences-title">
        <PreferencesPanel
          age={age}
          setAge={setAge}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          useCulturalContext={useCulturalContext}
          setUseCulturalContext={setUseCulturalContext}
          useMythology={useMythology}
          setUseMythology={setUseMythology}
          favGenres={favGenres}
          setFavGenres={setFavGenres}
          characterName={characterName}
          setCharacterName={setCharacterName}
        />
      </div>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          onClick={handleGenerateStory} 
          disabled={isLoading}
          startIcon={<AutoStoriesIcon />}
          aria-label={isLoading ? t('Generating story, please wait') : t('Generate Story')}
          sx={{ 
            py: 1.5, 
            px: 5, 
            borderRadius: '999px',
            fontSize: '1.1rem',
            transition: 'transform 0.3s',
            boxShadow: theme.shadows[4],
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: theme.shadows[6],
            },
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              {t('Generating Story...')}
            </>
          ) : (
            t('Generate Story')
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default StoryPreferencesSection;