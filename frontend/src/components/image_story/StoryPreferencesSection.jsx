import React, { useState } from 'react';
import { Box, Button, CircularProgress, Paper, Typography, useTheme, FormGroup, FormControlLabel, Checkbox, TextField, IconButton, Chip } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useLanguage } from '../../utils/LanguageContext';
import PreferencesPanel from '../PreferencesPanel';

const SPECIAL_NEEDS_OPTIONS = [
  { id: 'dyslexia', label: 'Dyslexia' },
  { id: 'adhd', label: 'ADHD' },
  { id: 'autism', label: 'Autism' },
  { id: 'visual_impairment', label: 'Visual Impairment' },
  { id: 'hearing_impairment', label: 'Hearing Impairment' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'cognitive_delay', label: 'Cognitive Delay' }
];

const StoryPreferencesSection = ({ 
  age, setAge,
  selectedLanguage, setSelectedLanguage,
  selectedGenre, setSelectedGenre,
  favGenres, setFavGenres,
  characterName, setCharacterName,
  useCulturalContext, setUseCulturalContext,
  useMythology, setUseMythology,
  specialNeeds,
  setSpecialNeeds,
  handleGenerateStory,
  isLoading
}) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [customNeed, setCustomNeed] = useState('');

  const handleSpecialNeedsChange = (needId) => {
    setSpecialNeeds(prev => {
      if (prev.includes(needId)) {
        return prev.filter(id => id !== needId);
      } else {
        return [...prev, needId];
      }
    });
  };

  const handleAddCustomNeed = () => {
    if (customNeed.trim()) {
      setSpecialNeeds(prev => [...prev, `custom_${customNeed.trim()}`]);
      setCustomNeed('');
    }
  };

  const handleRemoveCustomNeed = (needId) => {
    setSpecialNeeds(prev => prev.filter(id => id !== needId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomNeed();
    }
  };

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

        {/* Special Needs Section */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            {t('Special Needs Accommodations (Optional)')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('Select any special needs to customize the story format and content:')}
          </Typography>
          
          {/* Predefined Special Needs */}
          <FormGroup sx={{ mb: 3 }}>
            {SPECIAL_NEEDS_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={specialNeeds.includes(option.id)}
                    onChange={() => handleSpecialNeedsChange(option.id)}
                    disabled={isLoading}
                  />
                }
                label={t(option.label)}
              />
            ))}
          </FormGroup>

          {/* Custom Special Needs Input */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              {t('Add Custom Special Need')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                size="small"
                value={customNeed}
                onChange={(e) => setCustomNeed(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('Enter custom special need or scenario')}
                disabled={isLoading}
                sx={{ mb: 2 }}
              />
              <IconButton 
                onClick={handleAddCustomNeed}
                disabled={!customNeed.trim() || isLoading}
                color="primary"
                sx={{ mt: 0.5 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Display Custom Special Needs */}
          {specialNeeds.filter(need => need.startsWith('custom_')).length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                {t('Custom Special Needs:')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {specialNeeds
                  .filter(need => need.startsWith('custom_'))
                  .map((need) => (
                    <Chip
                      key={need}
                      label={need.replace('custom_', '')}
                      onDelete={() => handleRemoveCustomNeed(need)}
                      disabled={isLoading}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
              </Box>
            </Box>
          )}
        </Box>
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