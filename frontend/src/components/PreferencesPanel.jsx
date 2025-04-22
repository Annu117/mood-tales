import React from 'react';
import {
  Paper, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import { LocalLibrary } from '@mui/icons-material';
import LANGUAGES from '../utils/languageOptions';
import GENRES from '../utils/genreOptions';
import { useLanguage } from '../utils/LanguageContext';

const PreferencesPanel = ({
  age, setAge, selectedLanguage, setSelectedLanguage,
  selectedGenre, setSelectedGenre, useCulturalContext, setUseCulturalContext,
  useMythology, setUseMythology, favGenres, setFavGenres, characterName, setCharacterName
}) => {
  const { t } = useLanguage();

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocalLibrary sx={{ mr: 1 }} /> {t('User Preferences')}
      </Typography>
      <TextField
        fullWidth 
        label={t('Age')} 
        variant="outlined"
        value={age} 
        onChange={(e) => setAge(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('Language')}</InputLabel>
        <Select 
          value={selectedLanguage} 
          onChange={(e) => setSelectedLanguage(e.target.value)}
          label={t('Language')}
        >
          {Object.keys(LANGUAGES).map((lang) => (
            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('Genre')}</InputLabel>
        <Select 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
          label={t('Genre')}
        >
          {GENRES.map((genre) => (
            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth 
        label={t('Favorite Genres')} 
        variant="outlined"
        value={favGenres} 
        onChange={(e) => setFavGenres(e.target.value)} 
        sx={{ mb: 2 }}
        helperText={t('Separate genres with commas')}
      />
      <TextField
        fullWidth 
        label={t('Character Name')} 
        variant="outlined"
        value={characterName} 
        onChange={(e) => setCharacterName(e.target.value)} 
        sx={{ mb: 2 }}
      />
      <FormControlLabel
        control={<Switch checked={useCulturalContext} onChange={() => setUseCulturalContext(!useCulturalContext)} />}
        label={t('Use Cultural Context')}
      />
      <FormControlLabel
        control={<Switch checked={useMythology} onChange={() => setUseMythology(!useMythology)} />}
        label={t('Use Mythology')}
      />
    </Paper>
  );
};

export default PreferencesPanel;
