import React from 'react';
import { Box, Paper } from '@mui/material';

// You can replace this with any canvas or image upload component
const DrawingTool = () => {
  return (
    <Paper elevation={3} sx={{ height: 400, p: 2 }}>
      <Box
        sx={{
          height: '100%',
          backgroundColor: '#fff',
          border: '2px dashed #ccc',
          borderRadius: 2,
        }}
      >
        {/* Drawing canvas / upload tool goes here */}
        Drawing canvas will be here.
      </Box>
    </Paper>
  );
};

export default DrawingTool;
