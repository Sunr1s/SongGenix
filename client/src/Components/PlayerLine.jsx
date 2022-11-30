import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

<<<<<<< Updated upstream
export default function LinearDeterminate({ songsPlayingTime, currentTime }) {
  const currentProgress = currentTime / songsPlayingTime * 100;
=======
export default function LinearDeterminate() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = 20;
        return Math.min(oldProgress + diff);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

>>>>>>> Stashed changes
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={currentProgress} />
    </Box>
  );
}