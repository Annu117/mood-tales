// components/CharacterGallery.jsx (Optional component for later expansion)
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const CharacterGallery = ({ characters, onSelectCharacter }) => {
  if (!characters || characters.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No characters found. Start by drawing a new character!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Character Gallery
      </Typography>
      <Grid container spacing={2}>
        {characters.map((character, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 3
                }
              }}
              onClick={() => onSelectCharacter(character)}
            >
              <Box
                sx={{
                  height: 120,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 1
                }}
              >
                <img 
                  src={character.image} 
                  alt={character.name} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Typography 
                variant="subtitle1" 
                align="center"
                sx={{ fontWeight: 'medium' }}
              >
                {character.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CharacterGallery;