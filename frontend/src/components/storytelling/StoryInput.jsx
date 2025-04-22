import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';
import { useLanguage } from '../../utils/LanguageContext';

const DrawingExplanation = ({ explanation, onClose }) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('Drawing Analysis')}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <SendIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {explanation.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.aspect}
                      </Typography>
                      <Chip 
                        label={item.confidence} 
                        size="small"
                        color={item.confidence === 'high' ? 'success' : 'warning'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body1" paragraph>
                        {item.text}
                      </Typography>
                      {item.details && (
                        <List dense>
                          {item.details.map((detail, idx) => (
                            <ListItem key={idx}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2">
                                      {detail.label}
                                    </Typography>
                                    <Chip 
                                      label={detail.score} 
                                      size="small"
                                      color="info"
                                    />
                                  </Box>
                                }
                                secondary={detail.explanation}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < explanation.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StoryInput = ({ 
  userInput, 
  setUserInput, 
  isLoading, 
  continueStory, 
  handleKeyPress,
  onShowDrawing,
  drawingAnalysis 
}) => {
  const { t } = useLanguage();
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'flex-start',
        position: 'relative'
      }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('What happens next?')}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1,
          height: '100%'
        }}>
          <Tooltip title={t('Draw something')}>
            <IconButton
              onClick={onShowDrawing}
              disabled={isLoading}
              sx={{
                backgroundColor: 'secondary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey.300',
                },
              }}
            >
              <BrushIcon />
            </IconButton>
          </Tooltip>
          {drawingAnalysis && (
            <Tooltip title={t('View drawing analysis')}>
              <IconButton
                onClick={() => setShowExplanation(true)}
                sx={{
                  backgroundColor: 'info.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'info.dark',
                  },
                }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={continueStory}
            disabled={isLoading || !userInput.trim()}
            endIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              minWidth: '48px',
              height: '48px',
              borderRadius: '50%',
              padding: 0,
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {!isLoading && <SendIcon />}
          </Button>
        </Box>
      </Box>
      {drawingAnalysis && showExplanation && (
        <DrawingExplanation 
          explanation={drawingAnalysis.explanation} 
          onClose={() => setShowExplanation(false)} 
        />
      )}
    </>
  );
};

export default StoryInput;
