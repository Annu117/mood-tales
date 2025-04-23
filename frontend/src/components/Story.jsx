import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TranslatedText } from './common/TranslatedText';

export const Story = ({ story }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          <TranslatedText text={story.title} />
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <TranslatedText text="Created by" />: {story.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <TranslatedText text="Date" />: {new Date(story.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Typography variant="body1" paragraph>
          {story.content}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <TranslatedText text="Tags" />: {story.tags.join(', ')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}; 