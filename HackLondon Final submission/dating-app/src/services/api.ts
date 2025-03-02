import axios from 'axios';
import { generatePlaceholderConversation } from '../utils/placeholderPersonality.ts';
import { getUserProfile, getUserSystemPrompt } from '../utils/userProfile.ts';

const API_URL = 'http://localhost:3001/api';

// Define types
export interface User {
  id: number;
  name: string;
  age: number;
  interests: string;
  profilePicture?: string;
}

export interface QuestionAnswer {
  userId: number;
  questionNumber: number;
  answer: string;
}

export interface Match {
  id: number;
  compatibilityScore: number;
  matchUserId: number;
  name: string;
  age: number;
  interests: string;
  profilePicture?: string;
  conversationTranscript: string;
}

// API functions
export const createProfile = async (
  formData: FormData
): Promise<{id: number; message: string}> => {
  const response = await axios.post(`${API_URL}/create-profile`, formData);
  return response.data;
};

export const saveQuestionAnswer = async (
  data: QuestionAnswer
): Promise<{id: number; message: string}> => {
  // Store answers in localStorage for the placeholder conversation
  try {
    const currentAnswers = JSON.parse(localStorage.getItem('userAnswers') || '[]');
    currentAnswers[data.questionNumber - 1] = data.answer;
    localStorage.setItem('userAnswers', JSON.stringify(currentAnswers));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }

  const response = await axios.post(`${API_URL}/save-question-answer`, data);
  return response.data;
};

export const simulateConversation = async (
  user1Id: number,
  user2Id: number
): Promise<{matchId: number; compatibilityScore: number; transcript: string}> => {
  // If user2Id is 'placeholder', use the placeholder simulation
  if (user2Id === 'placeholder') {
    try {
      // Get user profile and generate system prompt
      const userProfile = getUserProfile();
      const systemPrompt = getUserSystemPrompt(userProfile);
      
      // Get user answers from localStorage or use profile answers if available
      const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '[]');
      const answersToUse = userAnswers.length > 0 ? userAnswers : userProfile.answers;
      
      // Pass the system prompt to the placeholder conversation generator
      const result = generatePlaceholderConversation(answersToUse, systemPrompt);
      
      return {
        matchId: 999, // Placeholder ID
        compatibilityScore: result.compatibilityScore,
        transcript: result.transcript
      };
    } catch (error) {
      console.error('Error in placeholder simulation:', error);
      throw error;
    }
  }
  
  // For regular matches, use the API
  const response = await axios.post(`${API_URL}/simulate-conversation`, {
    user1Id,
    user2Id
  });
  return response.data;
};

export const getMatches = async (userId: number): Promise<{matches: Match[]}> => {
  const response = await axios.get(`${API_URL}/matches/${userId}`);
  return response.data;
}; 