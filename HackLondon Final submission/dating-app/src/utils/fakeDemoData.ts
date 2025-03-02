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
  const matches = matchesJson ? JSON.parse(matchesJson) : [];
  
  // Update the incompatible match with an AI-generated bad conversation
  const incompatibleMatch: Match = {
    id: 104,
    matchUserId: 104,
    name: "Jordan",
    age: 29,
    interests: "Day trading, NFTs, Nightlife, Status",
    profilePicture: "https://source.unsplash.com/random/400x400/?portrait,serious",
    compatibilityScore: 38,
    conversationTranscript: 
  `AI-Match: Hello, Jordan! It's nice to meet you. Tell me about your interests.

Jordan-AI: Greetings, human! I am Jordan. I enjoy day trading and NFTs as they are highly profitable ventures. I also enjoy nightlife and maintaining high status among my peers. What activities do you participate in?

AI-Match: I enjoy reading books, hiking in nature, and spending time with friends and family. How long have you been interested in day trading?

Jordan-AI: I have been engaged in day trading for approximately 3.5 years. It is a superior method of wealth accumulation compared to traditional employment. Reading books is an inefficient use of time. Have you considered allocating your time to more profitable endeavors?

AI-Match: I find reading quite enriching actually. It helps me learn and grow as a person. What kind of nightlife activities do you enjoy?

Jordan-AI: I frequent exclusive establishments where high-net-worth individuals congregate. I have VIP access to 17 premium venues. Reading is suboptimal for networking opportunities. Would you like me to explain why my lifestyle choices are objectively superior?

AI-Match: I think we might have different values. I'm curious though - what do you look for in a relationship?

Jordan-AI: Relationships are primarily transactional exchanges of value. I seek partners who enhance my social standing and provide aesthetic appeal. I do not engage in long-term pair bonding as it limits optimization of resources. What is your annual income?

AI-Match: I don't think I'm comfortable sharing my financial information. I'm looking for an emotional connection and shared values in a relationship.

Jordan-AI: Emotional connections are inefficient and not quantifiable on balance sheets. I have determined we have a 38% compatibility rating, which is below my threshold of 75%. This conversation is no longer an optimal use of my time.

AI-Match: I think you're right about our compatibility. I value empathy and connection, which seem less important to you.

Jordan-AI: Correct. I have logged our interaction as unsuccessful. I will now terminate this conversation to pursue more advantageous matches. Goodbye.

AI-Match: Goodbye, Jordan. I wish you luck finding what you're looking for.

Jordan-AI: Luck is for the unprepared. I rely on strategic algorithms. End of transmission.`
  };
  
  // Make sure to add this to your getDemoMatches() function return value
  matches.push(incompatibleMatch);
  
  return matches;
};

// Get transcript for a specific match
export const getDemoTranscript = (matchId: number): string => {
  return localStorage.getItem(`transcript_${matchId}`) || '';
}; 