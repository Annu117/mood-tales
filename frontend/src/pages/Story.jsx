import React, { useState } from 'react';
import PreferencesPanel from '../components/PreferencesPanel';
import { generateStoryT } from '../utils/storyGeneration';

const Story = () => {
  const [age, setAge] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [favGenres, setFavGenres] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [useCulturalContext, setUseCulturalContext] = useState(true);
  const [useMythology, setUseMythology] = useState(false);
  const [story, setStory] = useState([]);

  const handleGenerateStoryT = async () => {
    const storyData = {
      characters: [{
        name: characterName,
        description: `a curious child aged ${age}`,
        features: { colorDescription: 'bright and cheerful colors' }
      }],
      scenes: [{
        id: 'scene1',
        label: selectedGenre,
        keywords: favGenres.split(',').map(g => g.trim()),
        features: { colorDescription: 'magical and colorful landscape' }
      }]
    };

    const generated = await generateStoryT(storyData);
    setStory(generated);
  };

  return (
    <div style={{ padding: 20 }}>
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
      <button onClick={handleGenerateStoryT} style={{ marginTop: 20 }}>Generate Story</button>
      <div style={{ marginTop: 30 }}>
        {story.map((section, index) => (
          <div key={index}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Story;
