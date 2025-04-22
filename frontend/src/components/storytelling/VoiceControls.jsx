import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Tooltip, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';

const VoiceControls = ({ storyHistory = [], language = 'en' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  // Language code mapping for both gTTS and browser speech synthesis
  const languageCodes = {
    'en': { gtts: 'en', browser: 'en-US' },      // English
    'es': { gtts: 'es', browser: 'es-ES' },      // Spanish
    'fr': { gtts: 'fr', browser: 'fr-FR' },      // French
    'hi': { gtts: 'hi', browser: 'hi-IN' },      // Hindi
    'zh': { gtts: 'zh', browser: 'zh-CN' },      // Chinese
    'ar': { gtts: 'ar', browser: 'ar-SA' },      // Arabic
    'de': { gtts: 'de', browser: 'de-DE' },      // German
    'ja': { gtts: 'ja', browser: 'ja-JP' },      // Japanese
    'ru': { gtts: 'ru', browser: 'ru-RU' },      // Russian
    'pt': { gtts: 'pt', browser: 'pt-BR' },      // Portuguese
    'bn': { gtts: 'bn', browser: 'bn-BD' },      // Bengali
    'ur': { gtts: 'ur', browser: 'ur-PK' },      // Urdu
    'te': { gtts: 'te', browser: 'te-IN' },      // Telugu
    'ta': { gtts: 'ta', browser: 'ta-IN' },      // Tamil
    'mr': { gtts: 'mr', browser: 'mr-IN' },      // Marathi
    'ko': { gtts: 'ko', browser: 'ko-KR' }       // Korean
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl]);

  const generateAudio = async () => {
    if (!storyHistory || storyHistory.length === 0) {
      setError('No story history available to play');
      return null;
    }

    const storyText = storyHistory
      .filter(entry => entry && entry.type === 'ai')
      .map(entry => entry.content)
      .join(' ');

    if (!storyText.trim()) {
      setError('No story content available to play');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const langCode = languageCodes[language]?.gtts || 'en';
      console.log('Using language code:', langCode);

      const response = await fetch('http://localhost:5000/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: storyText,
          language: langCode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Received empty audio file');
      }

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      return url;
    } catch (error) {
      console.error('Error generating audio:', error);
      setError(`Failed to generate audio: ${error.message}. Try using browser's built-in voice.`);
      setUseFallback(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const playWithBrowserVoice = () => {
    if (!storyHistory || storyHistory.length === 0) return;

    const storyText = storyHistory
      .filter(entry => entry && entry.type === 'ai')
      .map(entry => entry.content)
      .join(' ');

    if (!storyText.trim()) return;

    const langCode = languageCodes[language]?.browser || 'en-US';
    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.lang = langCode;

    // Try to find a voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === langCode) || 
                 voices.find(v => v.lang.startsWith(language)) ||
                 voices.find(v => v.lang.startsWith('en'));
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPlaying(false);
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const playStory = async () => {
    if (isLoading) return;

    if (isPlaying && !isPaused) {
      if (useFallback) {
        window.speechSynthesis.pause();
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      if (useFallback) {
        window.speechSynthesis.resume();
      } else {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Error resuming audio:', error);
          setError('Failed to resume audio. Please try again.');
          return;
        }
      }
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    if (!useFallback) {
      if (!audioUrl) {
        const url = await generateAudio();
        if (!url) return;
      }

      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsPaused(false);
        } catch (error) {
          console.error('Error playing audio:', error);
          setError('Failed to play audio. Switching to browser voice...');
          setUseFallback(true);
          playWithBrowserVoice();
        }
      }
    } else {
      playWithBrowserVoice();
    }
  };

  const stopStory = () => {
    if (useFallback) {
      window.speechSynthesis.cancel();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const switchToBrowserVoice = () => {
    stopStory();
    setUseFallback(true);
    setAudioUrl(null);
    playWithBrowserVoice();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={isPlaying ? "Pause" : "Play"}>
          <IconButton 
            onClick={playStory}
            color="primary"
            aria-label={isPlaying ? "Pause story" : "Play story"}
            disabled={!storyHistory || storyHistory.length === 0 || isLoading}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Stop">
          <IconButton 
            onClick={stopStory}
            color="primary"
            aria-label="Stop story"
            disabled={!isPlaying && !isPaused}
          >
            <StopIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {error && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography color="error" variant="caption" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
          {!useFallback && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={switchToBrowserVoice}
            >
              Use Browser Voice
            </Button>
          )}
        </Box>
      )}
      <audio
        ref={audioRef}
        src={audioUrl || ''}
        onEnded={() => {
          setIsPlaying(false);
          setIsPaused(false);
        }}
        onError={(e) => {
          console.error('Audio error:', e);
          setError('Error playing audio. Switching to browser voice...');
          setUseFallback(true);
          playWithBrowserVoice();
        }}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default VoiceControls; 