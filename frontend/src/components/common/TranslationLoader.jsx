import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

export const TranslationLoader = ({ children }) => {
  const { isLoading } = useLanguage();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100px',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Translating...
        </Typography>
      </Box>
    );
  }

  return children;
}; 