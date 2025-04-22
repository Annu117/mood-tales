import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
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

  const handleGenerateStory = async () => {
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
      }]
    };

    const generated = await generateStory(storyData);
    setStory(generated);
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
        sx={{ mt: 3 }}
      >
        {t('Generate Story')}
      </Button>
      <Box sx={{ mt: 4 }}>
        {story.map((section, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body1">
              {section.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Story;
