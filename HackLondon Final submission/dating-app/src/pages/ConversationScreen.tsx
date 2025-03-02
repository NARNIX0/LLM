import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ChatIcon from '@mui/icons-material/Chat';
import { simulateConversation } from '../services/api.ts';
import { placeholderPersonality, generatePlaceholderConversation } from '../utils/placeholderPersonality.ts';

interface ConversationMessage {
  sender: 'user1' | 'user2';
  text: string;
}

const ConversationScreen: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(true);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [messageCount, setMessageCount] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<string>('');
  
  // Determine if this is a placeholder match
  const isPlaceholder = matchId === 'placeholder';
  
  // Hardcoded user IDs for demo - in a real app, these would come from state/context or parameters
  const user1Id = 1; // Current user
  const user2Id = parseInt(matchId || '2', 10); // Match user

  // Simulate typing effect for the conversation
  const simulateTypingEffect = (fullTranscript: string) => {
    // Split the transcript into lines
    const lines = fullTranscript.trim().split('\n');
    let currentMessageIndex = 0;
    
    // Create a new array of messages from the transcript
    const newMessages: ConversationMessage[] = [];
    
    // Process each line to determine if it's user1 or user2 speaking
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Skip empty lines
      
      if (trimmedLine.startsWith('User 1:')) {
        newMessages.push({
          sender: 'user1',
          text: trimmedLine.substring('User 1:'.length).trim()
        });
      } else if (trimmedLine.startsWith('User 2:')) {
        newMessages.push({
          sender: 'user2',
          text: trimmedLine.substring('User 2:'.length).trim()
        });
      }
    });
    
    // Function to add messages one by one with a delay
    const addMessageWithDelay = () => {
      if (currentMessageIndex < newMessages.length) {
        setMessages(prev => [...prev, newMessages[currentMessageIndex]]);
        setMessageCount(currentMessageIndex + 1);
        currentMessageIndex++;
        
        // Show assessment after 100 messages (50 exchanges)
        if (currentMessageIndex >= 100) {
          setSimulating(false);
          assessConversation();
        } else {
          setTimeout(addMessageWithDelay, 1000); // 1 second between messages (accelerated for demo)
        }
      } else {
        setSimulating(false); // Finished simulating
        if (currentMessageIndex >= 100) {
          assessConversation();
        }
      }
    };
    
    // Start adding messages
    addMessageWithDelay();
  };

  // Function to assess conversation and generate compatibility report
  const assessConversation = () => {
    setShowResult(true);
    
    // Save conversation completion to localStorage
    localStorage.setItem('conversationCompleted', 'true');
    if (compatibilityScore) {
      localStorage.setItem('placeholderCompatibilityScore', compatibilityScore.toString());
    }
    
    // Generate an AI assessment of the conversation
    const assessmentTexts = [
      `The conversation between you and ${placeholderPersonality.name} shows a strong mutual interest in understanding each other's perspectives. There's a natural flow in how you both respond to the questions, suggesting good conversational chemistry.`,
      
      `I noticed several points of compatibility around values related to ${placeholderPersonality.values[0]} and ${placeholderPersonality.values[2]}. Your communication styles complement each other well, with both of you sharing thoughtful, reflective responses.`,
      
      `Based on the conversation transcript, you both appear to share similar views on important life questions, particularly regarding relationships and personal growth. This suggests a foundation for meaningful connection.`,
      
      `The compatibility score of ${compatibilityScore}% reflects the alignment in your perspectives, communication patterns, and values revealed through the 36 Questions conversation simulation.`
    ];
    
    setAssessmentResult(assessmentTexts.join('\n\n'));
  };

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (isPlaceholder) {
          // Use the placeholder personality for simulation
          // In a real app, you'd use the user's actual answers from the database
          const userAnswers = Array(25).fill("That's an interesting question. I'd have to think about it, but my initial reaction is that I value authentic connections and learning from different perspectives.");
          
          const placeholderResult = generatePlaceholderConversation(userAnswers);
          setCompatibilityScore(placeholderResult.compatibilityScore);
          setTranscript(placeholderResult.transcript);
          
          // Save transcript to localStorage for the TranscriptViewer
          localStorage.setItem('placeholderTranscript', placeholderResult.transcript);
          
          simulateTypingEffect(placeholderResult.transcript);
        } else {
          // Use the API for regular matches
          const response = await simulateConversation(user1Id, user2Id);
          setCompatibilityScore(response.compatibilityScore);
          setTranscript(response.transcript);
          simulateTypingEffect(response.transcript);
        }
      } catch (error) {
        console.error('Error simulating conversation:', error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [user1Id, user2Id, isPlaceholder]);

  const handleBackToMatches = () => {
    navigate('/matches');
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
          AI Conversation Simulation
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 50, height: 50, bgcolor: 'primary.main', mr: 2 }}>
                        You
                      </Avatar>
                      <Typography variant="h6">You</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Typography variant="h6">{isPlaceholder ? placeholderPersonality.name : `Match #${matchId}`}</Typography>
                      <Avatar sx={{ width: 50, height: 50, bgcolor: 'secondary.main', ml: 2 }}>
                        {isPlaceholder ? placeholderPersonality.name.charAt(0) : 'M'}
                      </Avatar>
                    </Box>
                  </Grid>
                </Grid>
                
                {isPlaceholder && (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      About {placeholderPersonality.name}:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            Age: {placeholderPersonality.age}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" gutterBottom fontWeight="medium">
                            Interests:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {placeholderPersonality.interests.map((interest, index) => (
                              <Chip 
                                key={index}
                                label={interest}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" gutterBottom fontWeight="medium">
                            Personality traits:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {placeholderPersonality.traits.map((trait, index) => (
                              <Chip 
                                key={index}
                                label={trait}
                                size="small"
                                color="secondary"
                                variant="outlined"
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                            {placeholderPersonality.backgroundStory}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {compatibilityScore !== null && !simulating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                    <FavoriteIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h5">
                      Compatibility Score: {Math.round(compatibilityScore)}%
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
            
            {simulating && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography variant="body1">
                  Conversation in progress... ({messageCount}/100 messages)
                </Typography>
              </Box>
            )}

            <Paper elevation={3} sx={{ p: 3, maxHeight: '60vh', overflow: 'auto' }} className="conversation-container">
              {messages.map((message, index) => (
                <Box 
                  key={index}
                  className={`chat-bubble chat-bubble-${message.sender}`}
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user1' ? 'primary.light' : 'secondary.light',
                    color: message.sender === 'user1' ? 'primary.contrastText' : 'secondary.contrastText',
                    alignSelf: message.sender === 'user1' ? 'flex-start' : 'flex-end',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {message.sender === 'user1' ? 'You' : placeholderPersonality.name}
                  </Typography>
                  <Typography variant="body1">
                    {message.text}
                  </Typography>
                </Box>
              ))}
              
              {messages.length === 0 && !loading && (
                <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  No messages yet. The conversation will appear here.
                </Typography>
              )}
            </Paper>

            {showResult && (
              <Card sx={{ mt: 4, mb: 4, p: 2 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon color="primary" sx={{ mr: 1 }} />
                    Compatibility Assessment
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {assessmentResult}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {!simulating && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleBackToMatches}
                  startIcon={<FavoriteIcon />}
                >
                  View All Matches
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default ConversationScreen; 