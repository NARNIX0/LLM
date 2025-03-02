import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// Import pages
import LandingPage from './pages/LandingPage.tsx';
import ProfileCreation from './pages/ProfileCreation.tsx';
import ConversationScreen from './pages/ConversationScreen.tsx';
import MatchesScreen from './pages/MatchesScreen.tsx';
import TranscriptViewer from './pages/TranscriptViewer.tsx';
import LoadingScreen from './pages/LoadingScreen.tsx';

// Import components
import Navigation from './components/Navigation.tsx';
import BackgroundDecoration from './components/BackgroundDecoration.tsx';

// Import utilities
import { isDemoDataPopulated, populateDemoData } from './utils/fakeDemoData.ts';
import { initializeUserProfile, isUserProfileInitialized } from './utils/userProfile.ts';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff4081', // Pink color for the dating app
    },
    secondary: {
      main: '#3f51b5', // Indigo as secondary color
    },
    background: {
      default: 'rgba(245, 245, 245, 0.6)', // Make default background semi-transparent
      paper: 'rgba(255, 255, 255, 0.7)', // Make paper elements semi-transparent
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
});

// Component to initialize the app state
const AppInitializer: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize user profile with pre-populated data
    if (!isUserProfileInitialized()) {
      initializeUserProfile();
    }
    
    // Check if we should auto-populate the demo data
    const autoPopulateDemoData = () => {
      // If this is the first visit to the app, populate demo data
      // but only if we're on the landing page
      if (window.location.pathname === '/' && !isDemoDataPopulated()) {
        // Populate demo data but don't auto-navigate
        // Let the user click the "View Demo Matches" button
        populateDemoData();
      }
    };
    
    autoPopulateDemoData();
  }, [navigate]);
  
  return null; // This component doesn't render anything
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppInitializer />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: 'transparent' // Ensure the main container is transparent
        }}>
          {/* Background decoration - render FIRST so it's behind everything */}
          <BackgroundDecoration />
          
          {/* Navigation and content - with appropriate z-index to be ABOVE the background */}
          <Navigation />
          <Box sx={{ 
            flex: 1, 
            position: 'relative', 
            zIndex: 1, // Ensure content is above background decorations
            '& .MuiPaper-root': { // Target all Paper components for transparency
              backgroundColor: 'rgba(255, 255, 255, 0.7) !important'
            },
            '& .MuiCard-root': { // Target all Card components for transparency
              backgroundColor: 'rgba(255, 255, 255, 0.7) !important'
            }
          }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/create-profile" element={<ProfileCreation />} />
              <Route path="/conversation/:matchId" element={<ConversationScreen />} />
              <Route path="/matches" element={<MatchesScreen />} />
              <Route path="/transcript/:matchId" element={<TranscriptViewer />} />
              <Route path="/loading" element={<LoadingScreen />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 