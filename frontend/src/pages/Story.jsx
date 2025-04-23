import React, { useState, useRef } from 'react';
import { Box, Container, Alert } from '@mui/material';
import { useLanguage } from '../utils/LanguageContext';
import { generateStory, continueStory } from '../utils/storyGeneration';
import { downloadStoryAsPDF, downloadImage as downloadImageUtil } from '../components/image_story/storyUtils';

// Component imports
import StoryHeader from '../components/image_story/StoryHeader';
import StoryPreferencesSection from '../components/image_story/StoryPreferencesSection';
import StorySection from '../components/image_story/StorySection';

const Story = () => {
  const { t } = useLanguage();
  const [age, setAge] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [favGenres, setFavGenres] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [useCulturalContext, setUseCulturalContext] = useState(true);
  const [useMythology, setUseMythology] = useState(false);
  const [specialNeeds, setSpecialNeeds] = useState([]);
  const [story, setStory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState({});
  const [userInput, setUserInput] = useState('');
  const [storyHistory, setStoryHistory] = useState([]);
  const [isContinuing, setIsContinuing] = useState(false);
  const storyRef = useRef(null);

  const handleGenerateStory = async () => {
    setIsLoading(true);
    setError(null);
    setUserInput('');
    setStoryHistory([]);
    
    try {
      const storyData = {
        characters: [{
          name: characterName,
          description: t('a character in the story'),
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
        useMythology,
        specialNeeds
      };

      const generated = await generateStory(storyData);
      setStory(generated);
      
      // Store generated images
      if (generated[0]?.images) {
        setGeneratedImages(generated[0].images);
      }
      
      // Add the initial story to history
      setStoryHistory([{
        role: 'assistant',
        content: generated[0].content
      }]);
    } catch (err) {
      setError(err.message || t('Failed to generate story. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueStory = async () => {
    if (!userInput.trim() || !story.length) return;
    
    setIsContinuing(true);
    setError(null);
    
    try {
      // Add user input to history
      const updatedHistory = [
        ...storyHistory,
        { role: 'user', content: userInput }
      ];
      
      // Continue the story
      const continued = await continueStory({
        prompt: userInput,
        story_length: 2,
        theme: selectedGenre,
        history: updatedHistory,
        language: selectedLanguage,
        useCulturalContext,
        useMythology
      });
      
      // Add the continuation as a new section
      const newSection = {
        title: `Chapter ${story.length + 1}`,
        content: continued.content,
        images: continued.images || {}
      };
      
      // Update story with the new section
      setStory([...story, newSection]);
      
      // Update history
      setStoryHistory([
        ...updatedHistory,
        { role: 'assistant', content: continued.content }
      ]);
      
      // Clear user input
      setUserInput('');
    } catch (err) {
      setError(err.message || t('Failed to continue the story. Please try again.'));
    } finally {
      setIsContinuing(false);
    }
  };

  // Wrapper for the PDF download function
  const handleDownloadStoryAsPDF = () => {
    downloadStoryAsPDF(storyRef, story);
  };

  // Wrapper for the image download function
  const handleDownloadImage = (part, sectionIndex) => {
    downloadImageUtil(part, sectionIndex, story);
  };

  return (
    <Box component="main">
      {/* Header with gradient background */}
      <StoryHeader />

      <Container maxWidth="lg">
        {/* Preferences Panel */}
        <StoryPreferencesSection 
          age={age}
          setAge={setAge}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          favGenres={favGenres}
          setFavGenres={setFavGenres}
          characterName={characterName}
          setCharacterName={setCharacterName}
          useCulturalContext={useCulturalContext}
          setUseCulturalContext={setUseCulturalContext}
          useMythology={useMythology}
          setUseMythology={setUseMythology}
          specialNeeds={specialNeeds}
          setSpecialNeeds={setSpecialNeeds}
          handleGenerateStory={handleGenerateStory}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: '1.5rem' }  
            }}
          >
            {error}
          </Alert>
        )}

        {/* Generated Story Sections */}
        <Box 
          sx={{ mt: 4 }} 
          ref={storyRef}
          aria-live="polite"
        >
          {story.map((section, sectionIndex) => (
            <StorySection 
              key={sectionIndex}
              section={section}
              sectionIndex={sectionIndex}
              totalSections={story.length}
              downloadStoryAsPDF={handleDownloadStoryAsPDF}
              downloadImage={handleDownloadImage}
              userInput={userInput}
              setUserInput={setUserInput}
              handleContinueStory={handleContinueStory}
              isContinuing={isContinuing}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Story;