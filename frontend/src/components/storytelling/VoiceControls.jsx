import React, { useState, useEffect } from 'react';
import { IconButton, Box, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

const VoiceControls = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    if (text) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      newUtterance.onpause = () => setIsPaused(true);
      newUtterance.onresume = () => setIsPaused(false);
      setUtterance(newUtterance);
    }
  }, [text]);

  const handlePlay = () => {
    if (utterance) {
      if (isPaused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (utterance && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title={isPaused ? "Resume" : "Play"}>
        <IconButton
          onClick={handlePlay}
          color="primary"
          disabled={!text || (isPlaying && !isPaused)}
          aria-label={isPaused ? "Resume reading" : "Start reading"}
        >
          <PlayArrowIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Pause">
        <IconButton
          onClick={handlePause}
          color="primary"
          disabled={!isPlaying || isPaused}
          aria-label="Pause reading"
        >
          <PauseIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Stop">
        <IconButton
          onClick={handleStop}
          color="primary"
          disabled={!isPlaying}
          aria-label="Stop reading"
        >
          <StopIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default VoiceControls; 