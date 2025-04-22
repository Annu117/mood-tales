import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  AutoStories as AutoStoriesIcon,
  EmojiObjects as EmojiObjectsIcon,
  Translate as TranslateIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { useLanguage } from '../../utils/LanguageContext';

const StoryExplanation = ({ explanation, onClose }) => {
  const { t } = useLanguage();

  const renderCreativeProcess = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PsychologyIcon color="primary" />
        {t('Creative Process')}
      </Typography>
      <Stepper orientation="vertical">
        {explanation.creative_process.steps.map((step, index) => (
          <Step key={index} active={true}>
            <StepLabel>{step.step}</StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {step.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {step.details}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );

  const renderStoryElements = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoStoriesIcon color="primary" />
        {t('Story Elements')}
      </Typography>
      <List>
        {explanation.story_elements.elements.map((element, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {element.element}
                    </Typography>
                    <Chip
                      label={element.description}
                      size="small"
                      color="info"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {Array.isArray(element.details) ? (
                      <List dense>
                        {element.details.map((detail, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon>
                              <EmojiObjectsIcon fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText primary={detail} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2">{element.details}</Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < explanation.story_elements.elements.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  const renderEducationalValue = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon color="primary" />
        {t('Educational Value')}
      </Typography>
      <List>
        {explanation.educational_value.aspects.map((aspect, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {aspect.aspect}
                    </Typography>
                    <Chip
                      label={aspect.description}
                      size="small"
                      color="success"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {Array.isArray(aspect.details) ? (
                      <List dense>
                        {aspect.details.map((detail, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon>
                              <PaletteIcon fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText primary={detail} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2">{aspect.details}</Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < explanation.educational_value.aspects.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TranslateIcon color="primary" />
        {t('Story Generation Analysis')}
      </DialogTitle>
      <DialogContent dividers>
        <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.default' }}>
          {renderCreativeProcess()}
          {renderStoryElements()}
          {renderEducationalValue()}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoryExplanation; 