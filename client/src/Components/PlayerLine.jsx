import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { borderRadius } from '@mui/system';
export default function LinearDeterminate({ songsPlayingTime, currentTime }) {
  const currentProgress = currentTime / songsPlayingTime * 100;
  return (
    <Box sx={{
      width: '100%'
    }}>
      <LinearProgress color="secondary" variant="determinate" value={currentProgress} sx={{
        marginTop: '200px',
        height: '20px',
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        color: 'black'
      }}>
        </LinearProgress>
    </Box>
  );
}
