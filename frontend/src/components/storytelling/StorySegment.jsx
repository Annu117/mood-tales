import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const StorySegment = ({ entry, isUser }) => {
  // Check if the content contains a drawing
  const hasDrawing = entry.content.includes('[Drawing:');
  const drawingMatch = entry.content.match(/\[Drawing: (.*?)\]/);
  const drawingDescription = drawingMatch ? drawingMatch[1] : null;
  const contentWithoutDrawing = entry.content.replace(/\[Drawing: .*?\]/, '').trim();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 3,
        width: '100%',
      }}
    >
      {/* User Input Section */}
      {isUser && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(78, 125, 233, 0.1)',
            maxWidth: '85%',
            ml: 'auto',
            border: '1px solid rgba(78, 125, 233, 0.2)',
            position: 'relative',
          }}
          role="note"
          aria-label="Your message"
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Your Input:
          </Typography>
          <Typography variant="body1">
            {contentWithoutDrawing}
          </Typography>
          {hasDrawing && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Drawing Description:
              </Typography>
              <Typography variant="body2">
                {drawingDescription}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* AI Response Section */}
      {!isUser && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 109, 0, 0.08)',
            maxWidth: '85%',
            mr: 'auto',
            border: '1px solid rgba(255, 109, 0, 0.2)',
            position: 'relative',
          }}
          role="article"
          aria-label="Story continuation"
        >
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            AI Response:
          </Typography>
          <Typography variant="body1">
            {contentWithoutDrawing}
          </Typography>
          {hasDrawing && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="secondary" gutterBottom>
                Drawing Prompt:
              </Typography>
              <Typography variant="body2">
                {drawingDescription}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default StorySegment;