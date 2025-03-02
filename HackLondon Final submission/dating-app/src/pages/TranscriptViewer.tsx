import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { getMatches, Match } from '../services/api.ts';
import { placeholderPersonality } from '../utils/placeholderPersonality.ts';
import { getDemoMatches, getDemoTranscript } from '../utils/fakeDemoData.ts';

const TranscriptViewer: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<Match | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  
  // Check if this is the placeholder match
  const isPlaceholder = matchId === 'placeholder';
  const matchIdNum = isPlaceholder ? 999 : parseInt(matchId || '0', 10);
  
  // Hardcoded user ID for the demo - in a real app, this would come from auth context or state
  const userId = 1;

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        if (isPlaceholder) {
          // Get the compatibility score from localStorage
          const compatibilityScore = parseInt(localStorage.getItem('placeholderCompatibilityScore') || '85', 10);
          
          // Create a placeholder match
          setMatch({
            id: 999,
            matchUserId: 999,
            name: placeholderPersonality.name,
            age: placeholderPersonality.age,
            interests: placeholderPersonality.interests.join(', '),
            profilePicture: '',
            compatibilityScore: compatibilityScore,
            conversationTranscript: localStorage.getItem('placeholderTranscript') || ''
          });
          
          setTranscript(localStorage.getItem('placeholderTranscript') || '');
        } else {
          // First try to find the match in demo data
          const demoMatches = getDemoMatches();
          const demoMatch = demoMatches.find(m => m.id === matchIdNum || m.matchUserId === matchIdNum);
          
          if (demoMatch) {
            setMatch(demoMatch);
            
            // Get the full transcript from localStorage
            const demoTranscript = getDemoTranscript(matchIdNum);
            setTranscript(demoTranscript || demoMatch.conversationTranscript);
          } else {
            // If not found in demo data, try the API
            try {
              const response = await getMatches(userId);
              const matchData = response.matches.find(
                m => m.matchUserId === matchIdNum
              );
              
              if (matchData) {
                setMatch(matchData);
                setTranscript(matchData.conversationTranscript);
              } else {
                // Provide mock data if no match found
                const mockTranscript = `
                  User 1: Given the choice of anyone in the world, whom would you want as a dinner guest?
                  User 2: I would love to have dinner with Marie Curie. Her pioneering work in radioactivity and being the first person to win Nobel Prizes in two different scientific fields is so inspiring.
                  User 1: That's a great choice! I'd choose Leonardo da Vinci, to learn about his diverse interests in art, science, and innovation.
                  
                  User 2: Would you like to be famous? In what way?
                  User 1: I'd like to be known for creating something that positively impacts people's lives, like an innovation in healthcare or education, but not celebrity-level famous.
                  User 2: I feel similarly. I'd prefer recognition in my field for meaningful contributions rather than general fame.
                  
                  User 1: Before making a telephone call, do you ever rehearse what you are going to say? Why?
                  User 2: Yes, especially for important calls. I like to organize my thoughts to make sure I communicate clearly and don't forget anything important.
                  User 1: I do the same thing! I often jot down bullet points for business calls, but for personal calls I'm more spontaneous.
                  
                  User 2: What would constitute a "perfect" day for you?
                  User 1: A perfect day for me would start with a quiet morning coffee and reading, followed by a hike in nature, spending time with close friends for lunch, and ending with a cozy evening watching a thought-provoking movie or reading a good book.
                  User 2: That sounds lovely. My perfect day would involve waking up without an alarm, having breakfast on a sunny terrace, exploring a new city or natural location, trying local cuisine, and ending with live music.
                `;
                
                setMatch({
                  id: matchIdNum,
                  matchUserId: matchIdNum,
                  name: 'Sample Match',
                  age: 30,
                  interests: 'Reading, Travel, Music',
                  profilePicture: '',
                  compatibilityScore: 85,
                  conversationTranscript: mockTranscript
                });
                
                setTranscript(mockTranscript);
              }
            } catch (error) {
              console.error('Error fetching match from API:', error);
              setMatch({
                id: matchIdNum, 
                matchUserId: matchIdNum,
                name: 'Match #' + matchIdNum,
                age: 28,
                interests: 'Conversations, Connections, Shared Values',
                profilePicture: '',
                compatibilityScore: 80,
                conversationTranscript: 'Conversation data not found.'
              });
              setTranscript('Conversation data not found.');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching match:', error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [userId, matchId, isPlaceholder, matchIdNum]);

  const handleBackToMatches = () => {
    navigate('/matches');
  };

  // Format the transcript for better readability
  const formatTranscript = (transcript: string) => {
    if (!transcript) return [];
    
    const lines = transcript.trim().split('\n');
    const formattedLines: { user: 'user1' | 'user2', text: string, question?: boolean }[] = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      if (trimmedLine.startsWith('User 1:')) {
        const text = trimmedLine.substring('User 1:'.length).trim();
        formattedLines.push({
          user: 'user1',
          text,
          question: text.endsWith('?')
        });
      } else if (trimmedLine.startsWith('User 2:')) {
        const text = trimmedLine.substring('User 2:'.length).trim();
        formattedLines.push({
          user: 'user2', 
          text,
          question: text.endsWith('?')
        });
      }
    });
    
    return formattedLines;
  };

  // Generate a transcript analysis
  const generateAnalysis = (match: Match) => {
    return (
      <>
        <Typography variant="body1">
          The conversation between you and {match.name} reveals a {match.compatibilityScore > 85 ? 'highly ' : ''}compatible
          dynamic with thoughtful exchanges. You both share similar values around 
          {match.compatibilityScore > 90 ? ' authentic connections, personal growth, and creative expression' : 
           match.compatibilityScore > 80 ? ' meaningful relationships and intellectual curiosity' : 
           ' interesting perspectives and mutual respect'}.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Based on the conversation transcript, the compatibility score of {Math.round(match.compatibilityScore)}% 
          reflects {match.compatibilityScore > 90 ? 'an exceptional' : 
                   match.compatibilityScore > 80 ? 'a strong' : 
                   'a promising'} potential for a meaningful connection.
        </Typography>
      </>
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToMatches}
          sx={{ mb: 3 }}
        >
          Back to Matches
        </Button>

        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Full Conversation Transcript
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : match ? (
          <>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={match.profilePicture} 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2, 
                      bgcolor: isPlaceholder ? 'secondary.main' : 'primary.main' 
                    }}
                  >
                    {match.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h5">
                      {match.name}, {match.age}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {match.interests}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FavoriteIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Compatibility Score: {Math.round(match.compatibilityScore)}%
                  </Typography>
                </Box>
                
                {isPlaceholder && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      This is an AI-simulated conversation between your digital persona and {placeholderPersonality.name},
                      based on your answers to the 36 Questions to Fall in Love.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Typography variant="h6" sx={{ mb: 2 }}>
              36 Questions Conversation:
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 4, maxHeight: '60vh', overflow: 'auto' }}>
              {formatTranscript(transcript).map((line, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        mr: 1,
                        bgcolor: line.user === 'user1' ? 'primary.main' : 'secondary.main'
                      }}
                    >
                      {line.user === 'user1' ? 'You' : match.name[0]}
                    </Avatar>
                    <Typography variant="subtitle2">
                      {line.user === 'user1' ? 'You' : match.name}
                    </Typography>
                    {line.question && (
                      <Chip 
                        label="Question" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ pl: 5 }}>
                    {line.text}
                  </Typography>
                </Box>
              ))}
              
              {formatTranscript(transcript).length === 0 && (
                <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  No conversation transcript available.
                </Typography>
              )}
            </Paper>
            
            <Card sx={{ mb: 4, p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SentimentVerySatisfiedIcon color="primary" sx={{ mr: 1 }} />
                  AI Analysis
                </Typography>
                <Divider sx={{ my: 2 }} />
                {generateAnalysis(match)}
              </CardContent>
            </Card>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBackToMatches}
              >
                Back to Matches
              </Button>
            </Box>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Conversation not found.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleBackToMatches}
              sx={{ mt: 2 }}
            >
              Back to Matches
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TranscriptViewer; 