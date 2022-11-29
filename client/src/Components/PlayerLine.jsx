import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function LinearDeterminate({ songsPlayingTime, currentTime }) {
  const currentProgress = currentTime / songsPlayingTime * 100;
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={currentProgress} />
    </Box>
  );
}