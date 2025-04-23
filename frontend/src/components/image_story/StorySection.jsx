import React from 'react';
import { Card, Box, Typography, IconButton, Tooltip, CardContent, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useLanguage } from '../../utils/LanguageContext';
import StoryImageGallery from './StoryImageGallery';
import StoryContinuation from './StoryContinuation';

const StorySection = ({
  section,
  sectionIndex,
  totalSections,
  downloadStoryAsPDF,
  downloadImage,
  userInput,
  setUserInput,
  handleContinueStory,
  isContinuing
}) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const isLastSection = sectionIndex === totalSections - 1;

  return (
    <Card 
      key={sectionIndex} 
      sx={{ 
        mb: 4, 
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
      elevation={3}
    >
      <Box 
        sx={{ 
          background: 'linear-gradient(45deg, #4e7de9 30%, #6d8ff0 90%)',
          py: 2,
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            sx={{ color: 'white', fontWeight: 'bold' }}
            id={`story-section-${sectionIndex}-title`}
          >
            {section.title}
          </Typography>
          
          {sectionIndex === 0 && section.images && Object.keys(section.images).length > 0 && (
            <Tooltip title={t("Download as PDF")}>
              <IconButton 
                onClick={downloadStoryAsPDF} 
                aria-label={t("Download story as PDF")}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <CardContent sx={{ p: 4 }}>
        {/* Story Images */}
        <StoryImageGallery 
          images={section.images} 
          sectionIndex={sectionIndex} 
          downloadImage={downloadImage} 
        />
        
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.8,
            fontSize: '1.05rem',
            whiteSpace: 'pre-line'
          }}
          aria-labelledby={`story-section-${sectionIndex}-title`}
        >
          {section.content}
        </Typography>
        
        {/* Interactive Story Continuation */}
        {isLastSection && (
          <StoryContinuation
            userInput={userInput}
            setUserInput={setUserInput}
            handleContinueStory={handleContinueStory}
            isContinuing={isContinuing}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StorySection;