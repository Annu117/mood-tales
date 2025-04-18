import React from 'react';
import {
  Paper, Typography, TextField, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import { LocalLibrary } from '@mui/icons-material';
import LANGUAGES from '../utils/languageOptions';
import GENRES from '../utils/genreOptions';

const PreferencesPanel = ({
  age, setAge, selectedLanguage, setSelectedLanguage,
  selectedGenre, setSelectedGenre, useCulturalContext, setUseCulturalContext,
  useMythology, setUseMythology, favGenres, setFavGenres, characterName, setCharacterName
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocalLibrary sx={{ mr: 1 }} /> User Preferences
      </Typography>
      <TextField
        fullWidth label="Age" variant="outlined"
        value={age} onChange={(e) => setAge(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Language</InputLabel>
        <Select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
          {Object.keys(LANGUAGES).map((lang) => (
            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Genre</InputLabel>
        <Select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {GENRES.map((genre) => (
            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth label="Favorite Genres" variant="outlined"
        value={favGenres} onChange={(e) => setFavGenres(e.target.value)} sx={{ mb: 2 }}
      />
      <TextField
        fullWidth label="Character Name" variant="outlined"
        value={characterName} onChange={(e) => setCharacterName(e.target.value)} sx={{ mb: 2 }}
      />
      <FormControlLabel
        control={<Switch checked={useCulturalContext} onChange={() => setUseCulturalContext(!useCulturalContext)} />}
        label="Use Cultural Context"
      />
      <FormControlLabel
        control={<Switch checked={useMythology} onChange={() => setUseMythology(!useMythology)} />}
        label="Use Mythology"
      />
    </Paper>
  );
};

export default PreferencesPanel;
