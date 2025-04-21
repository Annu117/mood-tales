import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const StorySegment = ({ entry, isUser }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: isUser ? 'rgba(78, 125, 233, 0.1)' : 'rgba(255, 109, 0, 0.08)',
        maxWidth: '85%',
        ml: isUser ? 'auto' : 0,
        mr: isUser ? 0 : 'auto',
        border: isUser ? '1px solid rgba(78, 125, 233, 0.2)' : '1px solid rgba(255, 109, 0, 0.2)',
        position: 'relative',
        '&:focus-within': {
          outline: '2px solid rgba(78, 125, 233, 0.5)',
        },
      }}
      role={isUser ? "note" : "article"}
      aria-label={isUser ? "Your message" : "Story continuation"}
      tabIndex={0}
    >
      <Typography variant="body1">
        {entry.content}
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          bottom: -8,
          [isUser ? 'right' : 'left']: 12,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: isUser ? '0 0 10px 10px' : '0 10px 10px 0',
          borderColor: isUser 
            ? 'transparent transparent rgba(78, 125, 233, 0.2) transparent'
            : 'transparent rgba(255, 109, 0, 0.2) transparent transparent',
        }}
        aria-hidden="true"
      />
    </Paper>
  );
};

export default StorySegment;