// Utility to populate the app with fake matches and conversations for demo purposes
import { Match } from '../services/api.ts';
import { placeholderPersonality, generatePlaceholderConversation } from './placeholderPersonality.ts';

// Extended personality data for multiple matches
const demoPersonalities = [
  {
    id: 1001,
    name: "Alex",
    age: 27,
    profilePicture: "https://source.unsplash.com/random/400x400/?portrait,man",
    interests: "hiking, reading science fiction, cooking international cuisine, playing the guitar, traveling",
    personalityType: "thoughtful, intellectually curious, empathetic, slightly introverted, creative",
    compatibilityScore: 85,
    conversationHighlight: "We both shared a passion for exploring different cultures through food and travel"
  },
  {
    id: 1002,
    name: "Jamie",
    age: 26,
    profilePicture: "https://source.unsplash.com/random/400x400/?portrait,woman",
    interests: "yoga, digital art, indie music, sustainable fashion, psychology",
    personalityType: "creative, empathetic, socially conscious, introspective, witty",
    compatibilityScore: 92,
    conversationHighlight: "We had a deep discussion about how art influences social change"
  },
  {
    id: 1003,
    name: "Taylor",
    age: 29,
    profilePicture: "https://source.unsplash.com/random/400x400/?portrait,androgynous",
    interests: "rock climbing, philosophy, documentary filmmaking, vegetarian cooking, minimalism",
    personalityType: "adventurous, thoughtful, pragmatic, environmentally conscious, direct",
    compatibilityScore: 78,
    conversationHighlight: "We debated the ethics of minimalism versus material comfort in modern society"
  },
  {
    id: 1004,
    name: "Morgan",
    age: 31,
    profilePicture: "https://source.unsplash.com/random/400x400/?portrait,professional",
    interests: "entrepreneurship, sci-fi novels, tennis, wine tasting, architecture",
    personalityType: "ambitious, analytical, sophisticated, slightly competitive, witty",
    compatibilityScore: 81,
    conversationHighlight: "We connected over our shared vision of mixing creativity with structured planning"
  }
];

// Generate varied conversation transcripts
const generateVariedTranscript = (personalityIndex: number): string => {
  const baseConvo = generatePlaceholderConversation([]);
  const personalities = ["analytical and thoughtful", "warm and empathetic", "witty and playful", "deep and philosophical"];
  const topics = ["travel experiences", "creative pursuits", "life philosophies", "future ambitions"];
  
  // Add a personalized beginning and ending to the transcript
  let transcript = `User 1: Hi there! I'm excited to connect with you through AI Match!\n\n`;
  transcript += `User 2: Hello! I'm ${demoPersonalities[personalityIndex].name}. Looking forward to getting to know you better.\n\n`;
  transcript += `User 1: I noticed you're interested in ${demoPersonalities[personalityIndex].interests.split(',')[0]}. How did you get into that?\n\n`;
  transcript += `User 2: It started a few years ago when I was looking for something new in my life. ${demoPersonalities[personalityIndex].interests.split(',')[0]} really resonated with me because it combines challenge with creativity. What about you - what are your main interests?\n\n`;
  
  // Add the middle part of the conversation
  transcript += baseConvo.transcript;
  
  // Add a personalized ending
  transcript += `User 2: I've really enjoyed our conversation. Based on our exchanges, I think we have a ${demoPersonalities[personalityIndex].compatibilityScore}% compatibility rate - especially around ${topics[personalityIndex]}!\n\n`;
  transcript += `User 1: I agree! Your ${personalities[personalityIndex]} perspective has been refreshing. Would you be interested in continuing our conversation?\n\n`;
  transcript += `User 2: Absolutely! I'd like that very much.\n\n`;
  
  return transcript;
};

// Generate matches for the demo
export const generateDemoMatches = (): Match[] => {
  return demoPersonalities.map((personality, index) => ({
    id: personality.id,
    matchUserId: personality.id,
    name: personality.name,
    age: personality.age,
    interests: personality.interests,
    profilePicture: personality.profilePicture,
    compatibilityScore: personality.compatibilityScore,
    conversationTranscript: generateVariedTranscript(index)
  }));
};

// Store matches in localStorage
export const populateDemoData = (): void => {
  const matches = generateDemoMatches();
  localStorage.setItem('demoMatches', JSON.stringify(matches));
  
  // Store individual transcripts
  matches.forEach(match => {
    localStorage.setItem(`transcript_${match.id}`, match.conversationTranscript);
  });
  
  // Set a flag indicating demo data has been populated
  localStorage.setItem('demoDataPopulated', 'true');
};

// Check if demo data is already populated
export const isDemoDataPopulated = (): boolean => {
  return localStorage.getItem('demoDataPopulated') === 'true';
};

// Get all demo matches
export const getDemoMatches = (): Match[] => {
  const matchesJson = localStorage.getItem('demoMatches');
  return matchesJson ? JSON.parse(matchesJson) : [];
};

// Get transcript for a specific match
export const getDemoTranscript = (matchId: number): string => {
  return localStorage.getItem(`transcript_${matchId}`) || '';
}; 