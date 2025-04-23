import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress, Alert, Card, CardMedia, CardContent, Grid } from '@mui/material';
import PreferencesPanel from '../components/PreferencesPanel';
import { generateStory } from '../utils/storyGeneration';
import { useLanguage } from '../utils/LanguageContext';

const Story = () => {
  const { t } = useLanguage();
  const [age, setAge] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [favGenres, setFavGenres] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [useCulturalContext, setUseCulturalContext] = useState(true);
  const [useMythology, setUseMythology] = useState(false);
  const [story, setStory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState({});

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storyData = {
        characters: [{
          name: characterName,
          description: `${t('a curious child aged')} ${age}`,
          features: { colorDescription: t('bright and cheerful colors') }
        }],
        scenes: [{
          id: 'scene1',
          label: selectedGenre,
          keywords: favGenres.split(',').map(g => g.trim()),
          features: { colorDescription: t('magical and colorful landscape') }
        }],
        age,
        selectedLanguage,
        selectedGenre,
        favGenres,
        characterName,
        useCulturalContext,
        useMythology
      };

      const generated = await generateStory(storyData);
      setStory(generated);
      
      // Store generated images
      const newImages = {};
      generated.forEach((section, index) => {
        if (section.image) {
          newImages[index] = section.image;
        }
      });
      setGeneratedImages(newImages);
    } catch (err) {
      setError(err.message || t('Failed to generate story. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
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
      
      <Button 
        variant="contained" 
        onClick={handleGenerateStory} 
        disabled={isLoading}
        sx={{ mt: 3 }}
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

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        {story.map((section, index) => (
          <Card key={index} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              {generatedImages[index] && (
                <Grid item xs={3}>
                  <CardMedia
                    component="img"
                    image={`data:image/jpeg;base64,${generatedImages[index]}`}
                    alt={`Story illustration ${index + 1}`}
                    sx={{ 
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={generatedImages[index] ? 9 : 12}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {section.title}
                  </Typography>
                  <Typography variant="body1">
                    {section.content}
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Story;
