import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  LinearProgress,
  Stack,
  Avatar
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Creating your AI twin...');
  const [dots, setDots] = useState('');

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          // Navigate to conversation screen with a placeholder matchId
          setTimeout(() => {
            navigate('/conversation/placeholder');
          }, 1500);
          return 100;
        }
        
        const newProgress = prevProgress + 1;
        
        // Update status text based on progress
        if (newProgress === 25) {
          setStatusText('Finding potential matches...');
        } else if (newProgress === 50) {
          setStatusText('Starting conversations...');
        } else if (newProgress === 75) {
          setStatusText('Analyzing compatibility...');
        }
        
        return newProgress;
      });
    }, 150); // Total time: ~15 seconds

    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  // Animate dots
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return '';
        return prevDots + '.';
      });
    }, 400);

    return () => clearInterval(dotTimer);
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        py: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: '80vh',
        justifyContent: 'center'
      }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          AI Matching in Progress
        </Typography>

        <Paper elevation={3} sx={{ width: '100%', p: 4, mt: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CircularProgress size={80} color="primary" />
          </Box>
          
          <Typography variant="h6" textAlign="center" sx={{ mb: 3 }}>
            {statusText}{dots}
          </Typography>
          
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
          
          <Typography variant="body2" textAlign="center" color="text.secondary">
            {Math.round(progress)}% Complete
          </Typography>

          <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <b>What's happening?</b> Your AI twin is having conversations with potential matches 
              using the famous 36 Questions to Fall in Love.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>You</Avatar>
                <FavoriteIcon color="error" />
                <Avatar sx={{ bgcolor: 'secondary.main' }}>?</Avatar>
              </Stack>
            </Box>
            
            <Typography variant="body2" color="text.secondary" textAlign="center">
              This may take a minute while our AI analyzes conversation patterns and calculates compatibility.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoadingScreen; 