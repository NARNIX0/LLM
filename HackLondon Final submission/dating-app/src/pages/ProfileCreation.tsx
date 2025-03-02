import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
  Avatar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { questions } from '../utils/questions.ts';
import { createProfile, saveQuestionAnswer } from '../services/api.ts';
import { getUserProfile } from '../utils/userProfile.ts';

const ProfileCreation: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    age: '',
    interests: '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  // Check if in edit mode when component mounts
  useEffect(() => {
    const editMode = localStorage.getItem('editingProfile') === 'true';
    setIsEditMode(editMode);
    
    if (editMode) {
      // Load existing profile data
      const userProfile = getUserProfile();
      setProfileForm({
        name: userProfile.name,
        age: userProfile.age.toString(),
        interests: userProfile.interests.join(', '),
      });
      
      if (userProfile.profilePicture) {
        setProfilePicturePreview(userProfile.profilePicture);
      }
      
      // Set user ID from localStorage
      const storedUserId = localStorage.getItem('currentUserId');
      if (storedUserId) {
        setUserId(parseInt(storedUserId));
      }
      
      // Load answers
      setUserAnswers(userProfile.answers || []);
      
      // Mark all questions as completed
      const completedIndices = userProfile.answers.map((_, index) => index);
      setCompletedQuestions(completedIndices);
      
      // If we have answers, set the current question to the first one and show its answer
      if (userProfile.answers.length > 0) {
        setCurrentQuestionIndex(0);
        setCurrentAnswer(userProfile.answers[0] || '');
      }
    }
    
    // Clear edit mode flag
    localStorage.removeItem('editingProfile');
  }, []);

  // When question index changes in edit mode, load the saved answer
  useEffect(() => {
    if (isEditMode && userAnswers.length > currentQuestionIndex) {
      setCurrentAnswer(userAnswers[currentQuestionIndex] || '');
    }
  }, [currentQuestionIndex, isEditMode, userAnswers]);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  // Handle profile picture upload
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  // Handle submitting basic profile info
  const handleProfileSubmit = async () => {
    setLoading(true);
    try {
      // If in edit mode, just advance to questions
      if (isEditMode) {
        setActiveStep(1);
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('age', profileForm.age);
      formData.append('interests', profileForm.interests);
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await createProfile(formData);
      setUserId(response.id);
      setActiveStep(1);
    } catch (error) {
      console.error('Error creating profile:', error);
      // Handle error (show message to user)
    } finally {
      setLoading(false);
    }
  };

  // Handle answer to current question
  const handleAnswerSubmit = async () => {
    if (!userId && !isEditMode) return;
    
    setLoading(true);
    try {
      // In edit mode, update the userAnswers array
      if (isEditMode) {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = currentAnswer;
        setUserAnswers(updatedAnswers);
        
        // Update in localStorage
        const userProfile = getUserProfile();
        userProfile.answers[currentQuestionIndex] = currentAnswer;
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('userAnswers', JSON.stringify(userProfile.answers));
      } else {
        // Not in edit mode, save to API
        await saveQuestionAnswer({
          userId: userId || 1,
          questionNumber: currentQuestionIndex + 1,
          answer: currentAnswer
        });
      }

      // Track completed questions
      if (!completedQuestions.includes(currentQuestionIndex)) {
        setCompletedQuestions([...completedQuestions, currentQuestionIndex]);
      }
      
      // Reset answer and move to next question
      setCurrentAnswer('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions completed
        setActiveStep(2);
        setTimeout(() => {
          navigate('/loading');
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress for the questions
  const questionProgress = Math.round((completedQuestions.length / questions.length) * 100);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          {isEditMode ? "Your Profile" : "Create Your Profile"}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Basic Info</StepLabel>
          </Step>
          <Step>
            <StepLabel>36 Questions</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 && (
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {isEditMode ? "Your Information" : "Tell us about yourself"}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  fullWidth
                />
                
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={profileForm.age}
                  onChange={handleProfileChange}
                  required
                  fullWidth
                />
                
                <TextField
                  label="Interests (comma separated)"
                  name="interests"
                  value={profileForm.interests}
                  onChange={handleProfileChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Reading, hiking, cooking, etc."
                  helperText="Help us match you with compatible people by sharing your interests"
                />

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Profile Picture
                  </Typography>
                  
                  {profilePicturePreview ? (
                    <Avatar 
                      src={profilePicturePreview} 
                      sx={{ width: 150, height: 150, mb: 2 }}
                    />
                  ) : (
                    <Avatar 
                      sx={{ width: 150, height: 150, mb: 2, bgcolor: 'grey.300' }}
                    />
                  )}
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePictureChange}
                    />
                  </Button>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleProfileSubmit}
                  disabled={!profileForm.name || !profileForm.age || loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Continue to Questions'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {activeStep === 1 && (
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Progress: {questionProgress}%
                </Typography>
              </Box>

              <Box sx={{ py: 2 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {questions[currentQuestionIndex]}
                </Typography>
                
                <TextField
                  label="Your Answer"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Type your answer here..."
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  {currentQuestionIndex > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                      startIcon={<NavigateBeforeIcon />}
                    >
                      Previous
                    </Button>
                  )}
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleAnswerSubmit}
                    disabled={!currentAnswer || loading}
                    sx={{ ml: 'auto' }}
                  >
                    {loading ? <CircularProgress size={24} /> : (
                      currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'
                    )}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {activeStep === 2 && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <CardContent>
              <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                {isEditMode ? "Profile Updated!" : "Profile Creation Complete!"}
              </Typography>
              <Typography variant="body1">
                {isEditMode 
                  ? "Your profile has been updated. Your matches will now reflect your current answers."
                  : "Thank you for answering all questions. We're now using these to find your matches!"}
              </Typography>
              
              {isEditMode ? (
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 4 }}
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              ) : (
                <CircularProgress sx={{ mt: 4 }} />
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default ProfileCreation; 