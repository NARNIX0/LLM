import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnalyticsIcon from '@mui/icons-material/Analytics';

// Define the two personas for display purposes
const personalities = [
  {
    name: "Alex",
    color: "#3f51b5",
    description: "Thoughtful, philosophical, enjoys deep conversations"
  },
  {
    name: "Jordan",
    color: "#f50057", 
    description: "Energetic, adventurous, loves sharing experiences"
  }
];

// Simple conversation starters
const STARTERS = [
  "What gives life meaning?",
  "Where would you travel if you could go anywhere?",
  "Is technology bringing people closer or pushing them apart?",
  "What's a book that changed your view of the world?",
  "What's something you've changed your mind about recently?"
];

// Add a development mode flag
const DEV_MODE = true; // Set to false when backend is ready

// Add this interface above your component
interface Message {
  id: number;
  speaker: number;
  text: string;
}

// Add this interface with your other interfaces
interface AnalysisResult {
  chemistry: string;
  connectionPoints: string[];
  potentialIssues: string[];
  overallAssessment: string;
}

const AIChatSimulation = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  // Add auto-advance feature
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Backend API URL
  const BACKEND_URL = "http://localhost:8000";

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add a message to the UI
  const addMessage = (speakerIndex, text) => {
    const newMessage = {
      id: Date.now(),
      speaker: speakerIndex,
      text: text
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Get random starter
  const getStarter = () => {
    return STARTERS[Math.floor(Math.random() * STARTERS.length)];
  };

  // Start a new conversation using CrewAI backend
  const startConversation = async () => {
    setMessages([]);
    setError(null);
    setIsRunning(true);
    setIsLoading(true);
    setExchangeCount(0);
    setAnalysisResult(null);
    
    // Choose a random starter from Alex
    const starter = getStarter();
    console.log("Starting with:", starter);
    
    // Add the starter message from Alex
    addMessage(0, starter);
    
    if (DEV_MODE) {
      // Development mode - use pre-written responses
      console.log("Running in development mode with fallback responses");
      
      // Add loading indicator for Jordan
      addMessage(1, "...");
      
      // Simulate network delay
      setTimeout(() => {
        // Remove loading indicator
        setMessages(prev => prev.filter(m => m.text !== "..."));
        
        // Add Jordan's fallback response based on the starter
        const jordanResponses = {
          "What gives life meaning?": "Life is all about adventures and pushing boundaries! I find meaning in collecting amazing experiences - like when I went skydiving and felt completely alive. It's about creating stories worth telling!",
          "Where would you travel if you could go anywhere?": "New Zealand, without a doubt! The opportunity to bungee jump, hike volcanoes, and kayak through those incredible landscapes would be the ultimate adventure!",
          "Is technology bringing people closer or pushing them apart?": "Technology is amazing for bringing people together! I've made friends all over the world through social media, and we've actually met up during my travels. It's expanded my world!",
          "What's a book that changed your view of the world?": "\"Into the Wild\" completely changed me! After reading it, I took my first solo hiking trip - it taught me about freedom and challenging social expectations in a way I'd never considered.",
          "What's something you've changed your mind about recently?": "I used to think extreme sports were just about adrenaline, but after taking up rock climbing, I realized they're about mindfulness and being completely present in the moment!"
        };
        
        const jordanResponse = jordanResponses[starter] || jordanResponses["What gives life meaning?"];
        addMessage(1, jordanResponse);
        
        // Add loading indicator for Alex's response
        setTimeout(() => {
          // Add Alex's fallback response
          const alexResponses = {
            "What gives life meaning?": "Your enthusiasm for active experiences is fascinating. I tend to find meaning in moments of deep connection and understanding. Perhaps meaning emerges from both action and reflection - the experiences we collect and how we integrate them into our understanding of ourselves.",
            "Where would you travel if you could go anywhere?": "Your passion for adventure is compelling. I'd choose Kyoto, Japan, especially during autumn. The intersection of ancient temples, philosophical traditions, and natural beauty creates a setting for both reflection and cultural appreciation.",
            "Is technology bringing people closer or pushing them apart?": "That's a positive perspective. I see it as more nuanced - technology connects us across distances but can sometimes create a sense of isolation. The quality of these connections depends on how mindfully we use these tools.",
            "What's a book that changed your view of the world?": "That's fascinating how it inspired direct action. For me, Viktor Frankl's \"Man's Search for Meaning\" profoundly affected my understanding of human resilience and how we find purpose even in suffering.",
            "What's something you've changed your mind about recently?": "That's a profound insight about mindfulness. Similarly, I've reconsidered my view on daily routines. I used to think spontaneity was essential for creativity, but I've found that thoughtful rituals create the mental space needed for deeper thinking."
          };
          
          const alexResponse = alexResponses[starter] || alexResponses["What gives life meaning?"];
          addMessage(0, alexResponse);
          
          setExchangeCount(1);
          setIsLoading(false);
          
          // Auto-continue after a delay if auto-advance is enabled
          if (autoAdvance) {
            setTimeout(() => {
              if (isRunning) {
                continueConversation();
              }
            }, 2000); // 2 second delay before next exchange
          }
        }, 1500);
      }, 1500);
    } else {
      try {
        // Add loading indicators
        addMessage(1, "...");
        
        console.log("Connecting to backend at:", BACKEND_URL);
        
        // Call the backend with timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(`${BACKEND_URL}/generate-conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            starter: starter,
            messages: []
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Backend error (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Backend response:", data);
        
        // Remove loading indicator
        setMessages(prev => prev.filter(m => m.text !== "..."));
        
        // Add Jordan's response
        addMessage(1, data.jordan_message);
        
        // Add Alex's next response
        addMessage(0, data.alex_message);
        
        // Increment exchange count
        setExchangeCount(1);
        
        // Set up for continuing the conversation
        setIsLoading(false);
        
        // Auto-continue after a delay if auto-advance is enabled
        if (autoAdvance) {
          setTimeout(() => {
            if (isRunning) {
              continueConversation();
            }
          }, 2000); // 2 second delay before next exchange
        }
        
      } catch (err) {
        console.error("Error starting conversation:", err);
        
        // Provide more helpful error message based on error type
        if (err.name === 'AbortError') {
          setError("Connection timeout - the backend server is taking too long to respond");
        } else if (err.message.includes("Failed to fetch")) {
          setError("Could not connect to the backend server. Please ensure the Python server is running at " + BACKEND_URL);
        } else {
          setError(`Error: ${err.message}`);
        }
        
        // Remove loading indicator
        setMessages(prev => prev.filter(m => m.text !== "..."));
        
        // Add fallback responses if backend fails
        addMessage(1, "That's a fascinating question! I went hiking in Nepal last year and spent a lot of time thinking about this exact topic. I found that what gives my life meaning is the collection of experiences and connections I make along the way.");
        
        setIsLoading(false);
        setIsRunning(false);
        
        // Auto-continue after a delay if auto-advance is enabled
        if (autoAdvance) {
          setTimeout(() => {
            if (isRunning) {
              continueConversation();
            }
          }, 2000);
        }
      }
    }
  };
  
  // Continue the conversation
  const continueConversation = async () => {
    if (!isRunning || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Add loading indicators for the next exchange
      addMessage(1, "...");
      
      // Format messages for the backend
      const formattedMessages = messages.map(msg => ({
        speaker: personalities[msg.speaker].name,
        text: msg.text
      }));
      
      // Call the backend to continue the conversation
      const response = await fetch(`${BACKEND_URL}/generate-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          starter: messages[0].text, // Original starter
          messages: formattedMessages
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Backend response:", data);
      
      // Remove loading indicator
      setMessages(prev => prev.filter(m => m.text !== "..."));
      
      // Add Jordan's response
      addMessage(1, data.jordan_message);
      
      // Add Alex's next response
      addMessage(0, data.alex_message);
      
      // Increment exchange count
      setExchangeCount(prev => prev + 1);
      
      setIsLoading(false);
      
      // Auto-continue after a delay if auto-advance is enabled
      if (autoAdvance) {
        setTimeout(() => {
          if (isRunning) {
            continueConversation();
          }
        }, 2000); // 2 second delay before next exchange
      }
      
    } catch (err) {
      console.error("Error continuing conversation:", err);
      setError(`Error: ${err.message}`);
      
      // Remove loading indicator
      setMessages(prev => prev.filter(m => m.text !== "..."));
      
      // Add fallback responses if backend fails
      const jordanFallbacks = [
        "That's amazing! I had a similar experience while traveling through Southeast Asia. The perspective you gain from immersing yourself in different cultures is invaluable.",
        "I totally get what you mean! Life is all about these moments of discovery and connection. Last month I tried rock climbing for the first time, and it was such a powerful metaphor for overcoming challenges.",
        "Yes! That reminds me of this incredible sunset I witnessed on a hike in New Zealand. Sometimes the most profound insights come when we're pushing our boundaries in nature."
      ];
      
      const alexFallbacks = [
        "That's an interesting perspective. I've been reading about how our experiences shape our worldview in several philosophical texts. The interplay between action and reflection seems crucial to developing wisdom.",
        "I appreciate your enthusiasm for direct experience. There's something to be said for balancing that with contemplative practices. I find that journaling helps me process and find deeper meaning in everyday interactions.",
        "The connection between physical experience and mental insight is fascinating. Philosophers like Merleau-Ponty wrote extensively about embodied cognition - how our physical experiences shape our understanding of the world."
      ];
      
      addMessage(1, jordanFallbacks[Math.floor(Math.random() * jordanFallbacks.length)]);
      addMessage(0, alexFallbacks[Math.floor(Math.random() * alexFallbacks.length)]);
      
      setExchangeCount(prev => prev + 1);
      setIsLoading(false);
      
      // Auto-continue after a delay if auto-advance is enabled
      if (autoAdvance) {
        setTimeout(() => {
          if (isRunning) {
            continueConversation();
          }
        }, 2000);
      }
    }
  };
  
  // Stop the conversation
  const stopConversation = () => {
    setIsRunning(false);
  };

  // Add a toggle for auto-advance
  const toggleAutoAdvance = () => {
    setAutoAdvance(prev => !prev);
  };

  // New function to analyze the conversation
  const analyzeConversation = async () => {
    if (messages.length < 4) {
      setError("Need more conversation before analysis can be performed");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      if (DEV_MODE) {
        // Simulate API call in dev mode
        setTimeout(() => {
          const sampleAnalysis = {
            chemistry: "Alex and Jordan show good conversational chemistry with a complementary dynamic. Alex brings thoughtful reflection while Jordan adds energy and real-world experiences.",
            connectionPoints: [
              "Both value personal growth through different approaches",
              "Shared interest in meaningful experiences",
              "Complementary perspectives that could lead to balanced discussions",
              "Both appear to listen and respond thoughtfully to each other"
            ],
            potentialIssues: [
              "Different approaches to finding meaning (reflection vs. action)",
              "Jordan's high-energy approach might sometimes overwhelm Alex's contemplative nature",
              "Alex might want deeper philosophical discussions than Jordan is comfortable with"
            ],
            overallAssessment: "This pairing shows promising compatibility with an interesting balance of thoughtfulness and adventure. Their different approaches to life could either complement each other well or become points of friction depending on how flexible both parties are."
          };
          
          setAnalysisResult(sampleAnalysis);
          setIsAnalyzing(false);
        }, 1500);
      } else {
        // Format messages for the backend
        const formattedMessages = messages.map(msg => ({
          speaker: personalities[msg.speaker].name,
          text: msg.text
        }));
        
        // Call the backend to analyze
        const response = await fetch(`${BACKEND_URL}/analyze-conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: formattedMessages
          })
        });
        
        if (!response.ok) {
          throw new Error(`Backend error (${response.status})`);
        }
        
        const data = await response.json();
        setAnalysisResult(data);
        setIsAnalyzing(false);
      }
    } catch (err) {
      console.error("Error analyzing conversation:", err);
      setError(`Analysis error: ${err.message}`);
      setIsAnalyzing(false);
      
      // Fallback analysis if API fails
      setAnalysisResult({
        chemistry: "Based on the limited conversation, Alex and Jordan appear to have complementary communication styles that could work well together.",
        connectionPoints: [
          "Different perspectives that could lead to growth",
          "Both engage with each other's ideas respectfully"
        ],
        potentialIssues: [
          "Different energy levels and approaches to life",
          "May have different priorities in what they value"
        ],
        overallAssessment: "This match shows potential but would benefit from more conversation to truly assess compatibility."
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back
        </Button>
        
        <Typography variant="h4" gutterBottom textAlign="center">
          AI Conversation Simulation
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={startConversation}
            disabled={isRunning && isLoading}
          >
            Start New Conversation
          </Button>
          
          {isRunning && !isLoading && (
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={continueConversation}
            >
              Continue Conversation
            </Button>
          )}
          
          {isRunning && (
            <Button 
              variant="outlined" 
              color="error"
              onClick={stopConversation}
            >
              Stop
            </Button>
          )}
          
          {/* Add auto-advance toggle */}
          <Button
            variant="outlined"
            color={autoAdvance ? "success" : "inherit"}
            onClick={toggleAutoAdvance}
          >
            Auto-Advance: {autoAdvance ? "ON" : "OFF"}
          </Button>
        </Box>
        
        {/* Exchange counter */}
        {exchangeCount > 0 && (
          <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
            Conversation exchanges: {exchangeCount}
          </Typography>
        )}
        
        {/* Chat display */}
        <Paper 
          elevation={3} 
          sx={{ 
            height: '60vh', 
            p: 2, 
            mb: 2, 
            overflowY: 'auto',
            bgcolor: '#f5f5f5' 
          }}
        >
          {messages.map((message) => (
            <Box 
              key={message.id}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: message.speaker === 0 ? 'flex-start' : 'flex-end',
                mb: 2
              }}
            >
              <Box 
                sx={{ 
                  maxWidth: '80%', 
                  bgcolor: personalities[message.speaker].color,
                  color: 'white',
                  p: 2, 
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5 }}>
                  {personalities[message.speaker].name}
                </Typography>
                
                <Typography variant="body1">
                  {message.text === "..." ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : message.text}
                </Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>
        
        {/* Analysis button - make it more prominent and appear after any messages */}
        {messages.length > 0 && !analysisResult && !isAnalyzing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Button
              variant="contained"
              color="info"
              size="large"
              startIcon={<AnalyticsIcon />}
              onClick={analyzeConversation}
              sx={{ 
                py: 1.5, 
                px: 3, 
                fontWeight: 'bold',
                boxShadow: 3,
                fontSize: '1.1rem'
              }}
            >
              Analyze Dating Compatibility
            </Button>
          </Box>
        )}
        
        {/* Analysis results */}
        {isAnalyzing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={30} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Analyzing conversation...
            </Typography>
          </Box>
        )}
        
        {analysisResult && (
          <Card sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Conversation Analysis
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Chemistry:</strong> {analysisResult.chemistry}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle1" gutterBottom color="success.main">
                Connection Points:
              </Typography>
              <ul>
                {analysisResult.connectionPoints.map((point, index) => (
                  <li key={`connection-${index}`}>
                    <Typography variant="body2">{point}</Typography>
                  </li>
                ))}
              </ul>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle1" gutterBottom color="error.main">
                Potential Issues:
              </Typography>
              <ul>
                {analysisResult.potentialIssues.map((issue, index) => (
                  <li key={`issue-${index}`}>
                    <Typography variant="body2">{issue}</Typography>
                  </li>
                ))}
              </ul>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
                Overall Assessment:
              </Typography>
              <Typography variant="body2" paragraph>
                {analysisResult.overallAssessment}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => setAnalysisResult(null)}
                >
                  Hide Analysis
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
        
        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {personalities.map((person, index) => (
            <Typography key={index} variant="body2" sx={{ color: person.color }}>
              {person.name}: {messages.filter(m => m.speaker === index && m.text !== "...").length} messages
            </Typography>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default AIChatSimulation;