import React, { useState, useRef } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Card, 
  CardMedia, 
  CardContent, 
  Grid, 
  Paper, 
  IconButton, 
  Tooltip,
  TextField,
  Divider
} from '@mui/material';
import PreferencesPanel from '../components/PreferencesPanel';
import { generateStory, continueStory } from '../utils/storyGeneration';
import { useLanguage } from '../utils/LanguageContext';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';

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

  const downloadStoryAsPDF = async () => {
    if (!storyRef.current || story.length === 0) return;
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Create the HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${story[0].title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
            }
            h1, h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            .images {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .image {
              width: 30%;
              text-align: center;
            }
            .image img {
              max-width: 100%;
              height: auto;
            }
            .content {
              margin-top: 20px;
            }
            .chapter {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
              .images {
                page-break-inside: avoid;
              }
              .content {
                page-break-inside: auto;
              }
            }
          </style>
        </head>
        <body>
          <h1>${story[0].title}</h1>
          
          ${story.map((section, index) => `
            <div class="chapter">
              ${index > 0 ? `<h2>${section.title}</h2>` : ''}
              
              ${section.images && Object.keys(section.images).length > 0 ? `
                <div class="images">
                  ${Object.entries(section.images).map(([part, image]) => `
                    <div class="image">
                      <img src="data:image/jpeg;base64,${image}" alt="${part} of the story" />
                      <p>${part.charAt(0).toUpperCase() + part.slice(1)}</p>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              <div class="content">
                ${section.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
              </div>
            </div>
          `).join('')}
        </body>
        </html>
      `;
      
      // Write the HTML content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for images to load
      setTimeout(() => {
        // Print the window
        printWindow.print();
        // Close the window after printing
        printWindow.close();
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadImage = (part, sectionIndex) => {
    const section = story[sectionIndex];
    if (!section || !section.images || !section.images[part]) return;
    
    try {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${section.images[part]}`;
      link.download = `story_chapter${sectionIndex + 1}_${part}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
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

      <Box sx={{ mt: 4 }} ref={storyRef}>
        {story.map((section, sectionIndex) => (
          <Card key={sectionIndex} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {section.title}
                </Typography>
                
                {sectionIndex === 0 && Object.keys(generatedImages).length > 0 && (
                  <Tooltip title="Download as PDF">
                    <IconButton onClick={downloadStoryAsPDF} color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              
              {/* Story Images */}
              {section.images && Object.keys(section.images).length > 0 && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {['beginning', 'middle', 'end'].map((part) => (
                    <Grid item xs={4} key={part}>
                      <Paper elevation={2} sx={{ p: 1, height: '100%', position: 'relative' }}>
                        {section.images[part] && (
                          <>
                            <CardMedia
                              component="img"
                              image={`data:image/jpeg;base64,${section.images[part]}`}
                              alt={`Story illustration - ${part}`}
                              sx={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                            <Tooltip title="Download Image">
                              <IconButton 
                                onClick={() => downloadImage(part, sectionIndex)}
                                sx={{ 
                                  position: 'absolute', 
                                  top: 5, 
                                  right: 5, 
                                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                  }
                                }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Typography variant="body1">
                {section.content}
              </Typography>
              
              {/* Interactive Story Continuation */}
              {sectionIndex === story.length - 1 && (
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('Continue the Story')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('What happens next? Add your ideas to continue the story.')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder={t('Type your idea here...')}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      disabled={isContinuing}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleContinueStory();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleContinueStory}
                      disabled={!userInput.trim() || isContinuing}
                    >
                      {isContinuing ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t('Continue')
                      )}
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Story;
