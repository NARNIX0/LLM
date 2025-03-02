import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { populateDemoData } from '../utils/fakeDemoData.ts';
import { isUserProfileInitialized } from '../utils/userProfile.ts';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    // Check if user profile is already initialized
    setProfileExists(isUserProfileInitialized());
  }, []);

  const handleViewDemoMatches = () => {
    populateDemoData();
    navigate('/matches');
  };

  const handleViewYourMatches = () => {
    // Navigate to matches screen with user's pre-populated profile
    navigate('/matches');
  };

  const handleViewYourProfile = () => {
    // Navigate to profile creation page in edit mode
    localStorage.setItem('editingProfile', 'true');
    navigate('/create-profile');
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Find Your Perfect Match Through AI-Powered Conversations
        </Typography>
        
        <Typography variant="h6" component="p" color="text.secondary" sx={{ mb: 4, maxWidth: 800 }}>
          Our revolutionary app uses advanced AI to simulate conversations between 
          potential matches using the famous "36 Questions to Fall in Love" and rates your compatibility.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {profileExists ? (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={handleViewYourMatches}
                startIcon={<AccountCircleIcon />}
              >
                View Your Matches
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary" 
                size="large" 
                onClick={handleViewYourProfile}
                startIcon={<EditIcon />}
              >
                View Your Profile
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={() => navigate('/create-profile')}
              startIcon={<PersonIcon />}
            >
              Create Your Profile
            </Button>
          )}
          
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large" 
            onClick={handleViewDemoMatches}
            startIcon={<FavoriteIcon />}
          >
            View Demo Matches
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/ai-chat-simulation')}
            sx={{ mt: 2, mb: 4 }}
            startIcon={<ChatIcon />}
          >
            Watch AI Match Simulation
          </Button>
        </Box>
      </Box>
      
      {/* How It Works Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
          How It Works
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                Step 1: Create Your Profile
              </Typography>
              <Typography variant="body1">
                Upload a photo and answer the "36 Questions to Fall in Love" to create
                your digital persona that our AI will use to simulate conversations.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                Step 2: AI Conversations
              </Typography>
              <Typography variant="body1">
                Our advanced AI will simulate conversations between your digital persona
                and other users to assess compatibility and chemistry.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary">
                Step 3: View Your Matches
              </Typography>
              <Typography variant="body1">
                Browse through your potential matches, complete with compatibility scores
                and full conversation transcripts to find your perfect match.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Testimonials Section */}
      <Box sx={{ py: 6, bgcolor: 'rgba(245, 245, 245, 0.5)' }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Success Stories
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 8,
              },
            }}>
              <CardMedia
                component="img"
                height="240"
                image="https://e3.365dm.com/22/12/2048x1152/skynews-emancipation-will-smith_5983071.jpg"
                alt="Will Smith & Jada Pinkett Smith"
                sx={{ 
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>J</Avatar>
                <Typography variant="h6">Will Smith & Jada Pinkett Smith</Typography>
              </Box>
              <CardContent>
                <Typography variant="body1">
                  "The AI conversation simulator matched us with a 92% compatibility score.
                  After reading our transcript, I knew we had to meet. We've been inseparable
                  since our first date!"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 8,
              },
            }}>
              <CardMedia
                component="img"
                height="240"
                image="https://i.ibb.co/xqkXmc91/20250302-105431.png"
                alt="Ramen & Ansh"
                sx={{ 
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>T</Avatar>
                <Typography variant="h6">Ramen & Ansh</Typography>
              </Box>
              <CardContent>
                <Typography variant="body1">
                  "I was skeptical about AI matching at first, but the conversations it generated
                  were so accurate to how we actually communicate. Our 89% compatibility score
                  was spot on!"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 8,
              },
            }}>
              <CardMedia
                component="img"
                height="240"
                image="https://www.chosenevents.co.uk/_moorwoodart-artists-image.aspx?ID=35439"
                alt="King Charles & Camilla Parker-Bowles"
                sx={{ 
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>M</Avatar>
                <Typography variant="h6">King Charles & Camilla Parker-Bowles</Typography>
              </Box>
              <CardContent>
                <Typography variant="body1">
                  "Reading our simulated conversation felt like watching a movie about our relationship
                  before we even met! The 36 questions really helped the AI understand our values and
                  personalities."
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Footer */}
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 HackLondon 2025 Winners Long Lasting Matches. All rights reserved
        </Typography>
      </Box>
    </Container>
  );
};

export default LandingPage; 