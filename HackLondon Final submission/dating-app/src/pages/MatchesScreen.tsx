import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Rating
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import { getMatches, Match } from '../services/api.ts';
import { placeholderPersonality } from '../utils/placeholderPersonality.ts';
import { populateDemoData, isDemoDataPopulated, getDemoMatches } from '../utils/fakeDemoData.ts';
import { isUserProfileInitialized } from '../utils/userProfile.ts';

const MatchesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [isLiveReplay, setIsLiveReplay] = useState(false);
  const [replayMessages, setReplayMessages] = useState<string[]>([]);
  const [isReplayComplete, setIsReplayComplete] = useState(false);
  const [activeChatbot, setActiveChatbot] = useState<any>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  
  // Get user ID - if profile is initialized, use the stored ID
  const userId = localStorage.getItem('currentUserId') || '1';
  
  // Check if we should show the placeholder match from conversation
  useEffect(() => {
    const checkPlaceholderConversation = () => {
      // Check URL parameters or localStorage to see if a conversation was just completed
      const conversationCompleted = localStorage.getItem('conversationCompleted') === 'true';
      
      if (conversationCompleted) {
        setShowPlaceholder(true);
        // Reset the flag
        localStorage.removeItem('conversationCompleted');
      }
    };
    
    checkPlaceholderConversation();
  }, []);

  // Load matches data - from API or demo data
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // First, make sure we have demo data populated
        if (!isDemoDataPopulated()) {
          populateDemoData();
        }
        
        // Get all demo matches
        let allMatches = getDemoMatches();
        
        // If user profile is initialized, use their ID for API calls
        if (isUserProfileInitialized()) {
          try {
            const response = await getMatches(parseInt(userId));
            if (response.matches && response.matches.length > 0) {
              // In a real app, we might merge the API and demo data
              // For simplicity, we'll just append the API matches to our demo matches
              allMatches = [...allMatches, ...response.matches];
            }
          } catch (error) {
            console.error('Error fetching API matches:', error);
            // Continue with demo matches
          }
        }
        
        // If we have the placeholder conversation match (Alex), add it
        if (showPlaceholder) {
          // Get compatibility score from localStorage or use a default
          const compatibilityScore = parseInt(localStorage.getItem('placeholderCompatibilityScore') || '85', 10);
          
          const placeholderMatch: Match = {
            id: 999,
            matchUserId: 999,
            name: placeholderPersonality.name,
            age: placeholderPersonality.age,
            interests: placeholderPersonality.interests.join(', '),
            profilePicture: '',
            compatibilityScore: compatibilityScore,
            conversationTranscript: 'See the full transcript for details.'
          };
          
          // Add the placeholder at the beginning for emphasis
          allMatches = [placeholderMatch, ...allMatches];
        }
        
        setMatches(allMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        // If all else fails, use minimal demo data
        setMatches([
          {
            id: 101,
            matchUserId: 101,
            name: 'Jamie',
            age: 26,
            interests: 'Photography, Travel, Cooking',
            profilePicture: 'https://source.unsplash.com/random/400x400/?portrait',
            compatibilityScore: 88,
            conversationTranscript: 'This is a sample conversation transcript.'
          }
        ]);
      }
    };

    fetchMatches();
  }, [userId, showPlaceholder]);

  const handleViewConversation = (matchId: number) => {
    // For demo or placeholder matches, navigate to transcript
    handleViewTranscript(matchId);
  };

  const handleViewTranscript = (matchId: number) => {
    // If it's the placeholder match, use 'placeholder' as the ID
    if (matchId === 999) {
      navigate('/transcript/placeholder');
    } else {
      navigate(`/transcript/${matchId}`);
    }
  };

  // Function to render compatibility score as hearts
  const renderCompatibilityScore = (score: number) => {
    // Convert score to 0-5 range for Rating component
    const ratingScore = (score / 100) * 5;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
        <Rating 
          value={ratingScore} 
          readOnly 
          precision={0.5}
          icon={<FavoriteIcon fontSize="inherit" color="error" />}
          emptyIcon={<FavoriteIcon fontSize="inherit" />}
        />
        <Typography variant="h6" sx={{ ml: 1 }}>
          {Math.round(score)}%
        </Typography>
      </Box>
    );
  };

  // Function to handle live chat replay
  const handleLiveChatReplay = (match) => {
    setIsLiveReplay(true);
    setReplayMessages([]);
    setIsReplayComplete(false);
    setCurrentMatch(match);
    
    // Use either the active chatbot or create a message array from the match's transcript
    const currentMatch = match || activeChatbot;
    const allMessages = currentMatch?.conversationTranscript?.split('\n') || [];
    let messageIndex = 0;
    
    const displayNextMessage = () => {
      if (messageIndex < allMessages.length) {
        setReplayMessages(prev => [...prev, allMessages[messageIndex]]);
        messageIndex++;
        setTimeout(displayNextMessage, 1000); // 1 second delay between messages
      } else {
        setIsReplayComplete(true);
      }
    };
    
    displayNextMessage();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Your AI-Generated Matches
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom textAlign="center">
          Based on your answers to the 36 questions, our AI has found these compatible matches for you.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : matches.length > 0 ? (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {matches.map((match) => (
              <Grid item xs={12} md={6} lg={4} key={match.id}>
                <Card elevation={3} className="match-card" sx={{
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={match.profilePicture} 
                        sx={{ width: 120, height: 120, mb: 2, bgcolor: match.id === 999 ? 'secondary.main' : 'primary.main' }}
                      >
                        {match.name[0]}
                      </Avatar>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {match.name}, {match.age}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                        {match.interests.split(', ').slice(0, 3).map((interest, index) => (
                          <Chip
                            key={index}
                            label={interest}
                            size="small"
                            color={match.id === 999 ? "secondary" : "primary"}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      {renderCompatibilityScore(match.compatibilityScore)}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        startIcon={<ChatIcon />}
                        onClick={() => handleLiveChatReplay(match)}
                      >
                        Live Chat Replay
                      </Button>
                      
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<FavoriteIcon />}
                        onClick={() => handleViewTranscript(match.matchUserId)}
                      >
                        Full Transcript
                      </Button>
                    </Box>

                    {isLiveReplay && match.id === (currentMatch?.id || -1) && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          Live Chat Replay {!isReplayComplete && 
                            <Box component="span" sx={{ display: 'inline-block', ml: 1 }}>
                              <CircularProgress size={16} />
                            </Box>
                          }
                        </Typography>
                        
                        <Box sx={{ maxHeight: 300, overflowY: 'auto', pt: 1 }}>
                          {replayMessages.map((message, index) => (
                            <Typography 
                              key={index} 
                              variant="body2" 
                              sx={{ 
                                mb: 1, 
                                p: 1, 
                                bgcolor: index % 2 === 0 ? 'primary.light' : 'secondary.light',
                                borderRadius: 1,
                                color: index % 2 === 0 ? 'primary.contrastText' : 'secondary.contrastText' 
                              }}
                            >
                              {message}
                            </Typography>
                          ))}
                        </Box>
                        
                        {isReplayComplete && (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            sx={{ mt: 2 }}
                            onClick={() => setIsLiveReplay(false)}
                          >
                            Close Replay
                          </Button>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No matches found yet.
            </Typography>
            <Typography variant="body1">
              Complete your profile and answer the 36 questions to get matches.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<PersonIcon />}
              sx={{ mt: 2 }}
              onClick={() => navigate('/create-profile')}
            >
              Create Profile
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default MatchesScreen; 