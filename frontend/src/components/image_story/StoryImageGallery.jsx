import React from 'react';
import { Grid, Paper, CardMedia, Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useLanguage } from '../../utils/LanguageContext';

const StoryImageGallery = ({ images, sectionIndex, downloadImage }) => {
  const theme = useTheme();
  const { t } = useLanguage();
  
  if (!images || Object.keys(images).length === 0) {
    return null;
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }} aria-label={t('Story illustrations')}>
      {['beginning', 'middle', 'end'].map((part) => (
        images[part] && (
          <Grid item xs={12} md={4} key={part}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 1, 
                height: '100%', 
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardMedia
                component="img"
                image={`data:image/jpeg;base64,${images[part]}`}
                alt={`${t('Story illustration for the')} ${t(part)} ${t('of the story')}`}
                sx={{ 
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: 'white',
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {t(part)}
                </Typography>
                <Tooltip title={t("Download Image")}>
                  <IconButton 
                    onClick={() => downloadImage(part, sectionIndex)}
                    size="small"
                    aria-label={`${t('Download')} ${t(part)} ${t('illustration')}`}
                    sx={{ 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)'
                      }
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>
        )
      ))}
    </Grid>
  );
};

export default StoryImageGallery;