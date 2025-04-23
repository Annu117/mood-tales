import React from 'react';
import { Box, TextField, Button, Typography, CircularProgress, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useLanguage } from '../../utils/LanguageContext';
import VoiceInput from '../storytelling/VoiceInput';

const StoryContinuation = ({ userInput, setUserInput, handleContinueStory, isContinuing }) => {
  const theme = useTheme();
  const { t, language } = useLanguage();

  const handleVoiceInput = (text) => {
    setUserInput(text);
  };

  return (
    <Box 
      sx={{ 
        mt: 6,
        pt: 3,
        borderTop: `1px solid ${theme.palette.divider}` 
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        color="primary" 
        fontWeight="bold"
        id="continue-story-heading"
      >
        {t('Continue the Story')}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 3 }}
      >
        {t('What happens next? Add your ideas to continue the story.')}
      </Typography>
      
      <Box 
        sx={{ display: 'flex', gap: 2 }}
        component="form"
        role="form"
        aria-labelledby="continue-story-heading"
        onSubmit={(e) => {
          e.preventDefault();
          if (userInput.trim() && !isContinuing) {
            handleContinueStory();
          }
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('Type your idea here...')}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isContinuing}
          aria-label={t('Your continuation idea')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '999px',
              pr: 1,
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <VoiceInput 
            onInputReceived={handleVoiceInput} 
            disabled={isContinuing}
            language={language}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            endIcon={<SendIcon />}
            onClick={handleContinueStory}
            disabled={!userInput.trim() || isContinuing}
            aria-label={t('Submit your continuation idea')}
            sx={{
              borderRadius: '999px',
              px: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            {isContinuing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('Continue')
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StoryContinuation;