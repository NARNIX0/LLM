// Placeholder AI personality for simulation
export interface Personality {
  name: string;
  age: number;
  interests: string[];
  traits: string[];
  values: string[];
  conversationStyle: string;
  backgroundStory: string;
}

export const placeholderPersonality: Personality = {
  name: "Alex",
  age: 27,
  interests: [
    "hiking",
    "reading science fiction",
    "cooking international cuisine",
    "playing the guitar",
    "traveling to new countries"
  ],
  traits: [
    "thoughtful",
    "intellectually curious",
    "empathetic",
    "slightly introverted",
    "creative"
  ],
  values: [
    "personal growth",
    "meaningful connections",
    "cultural understanding",
    "authenticity",
    "work-life balance"
  ],
  conversationStyle: "Warm and reflective, with occasional humor. Asks thoughtful follow-up questions. Shares personal stories when relevant but doesn't dominate the conversation.",
  backgroundStory: "Grew up in a small town before moving to the city for university. Studied literature but works in tech. Has traveled to 12 countries and lived abroad for a year. Close to family but lives independently. Looking for someone to share adventures and deep conversations with."
};

// Pre-defined answers to the 36 questions for the placeholder personality
export const placeholderAnswers = [
  // Set 1
  "If I could choose anyone, I'd love to have dinner with Carl Sagan. His perspective on the cosmos and our place in it fascinated me, and I think he'd bring both scientific wisdom and human warmth to the conversation.",
  "I don't really crave fame, but I would like to be known for creating something meaningful that helps people connect with each other more authentically.",
  "Before making a phone call, I usually take a moment to think about what I want to say, especially if it's an important conversation. Sometimes I jot down bullet points if it's particularly complex.",
  "My idea of a perfect day would start with a quiet morning hike watching the sunrise, followed by brunch with close friends, an afternoon of either reading in a park or exploring a new neighborhood, and ending with cooking dinner with someone special while sharing stories about our lives.",
  "I don't sing all that often, but I do sing along with music when I'm driving alone. Sometimes I'll catch myself humming while I'm cooking or working on something that requires concentration.",
  "If I could live to 90 and have either the mind or body of a 30-year-old for the last 60 years, I'd definitely choose the mind. Physical limitations can be adapted to, but losing your mental faculties means losing your sense of self.",
  "I do have a secret hunch about how I'll die. I've always had this feeling it will be peaceful and that I'll know it's coming. Maybe that's just what I hope for rather than a premonition.",
  "For me, love means presence - being truly there for someone, even when it's difficult. It's choosing to understand someone deeply and allowing yourself to be understood in return.",
  "There are so many things I'm grateful for, but right now I'm particularly thankful for the moments of unexpected connection - like a deep conversation with a stranger or rediscovering an old friendship.",
  "If I could change anything about how I was raised, I might wish for more encouragement to take risks and be comfortable with failure. My family valued stability and certainty, which has benefits but also made me somewhat risk-averse.",
  "It would take me about 15 minutes to tell you my life story with reasonable detail, though we could easily expand particular chapters if something resonates with you.",
  "If I could wake up tomorrow having gained any one ability or quality, I'd choose the ability to quickly learn languages. I think language connects us to culture in a way nothing else can, and I'd love to speak directly with people from around the world.",
  
  // Set 2
  "If a crystal ball could tell me the truth about myself, my life, or anything else, I'd want to know if the work I do will have made a positive difference in people's lives when I look back years from now.",
  "There is something I've dreamed of doing for a long time - living in another country for at least a year, immersing myself completely in another culture and language.",
  "My greatest accomplishment is probably building deep, lasting friendships that have endured through major life changes. The relationships we nurture say so much about who we are.",
  "I value deep trust and emotional intimacy most in friendships. Someone who knows me completely and accepts me, who I can be entirely myself around without fear of judgment.",
  "One of my most treasured memories is a camping trip with friends where we stayed up all night talking by the fire, solving the world's problems and sharing our dreams. It was nothing extraordinary, but the connection felt so pure.",
  "My most terrible memory involves losing someone close to me suddenly. It taught me how fragile life is and how important it is to express love while we can.",
  "If I knew I would die suddenly in a year, I would quit my job and focus on experiences rather than possessions. I'd travel to the places I've always wanted to see, spend more time with the people I love, and try to create something meaningful to leave behind.",
  "Friendship means showing up consistently for someone, in both the difficult moments and the celebrations. It's a chosen commitment to be part of someone else's story.",
  "The role love and affection play in my life is central - they're the forces that give life meaning. I try to approach my relationships with generosity and openness, though sometimes my fear of vulnerability gets in the way.",
  "I like sharing personal feelings and emotions, though it often takes me time to feel comfortable enough with someone to be fully open. When I find someone I trust deeply, I'm quite transparent about my inner world.",
  "If we were to become close friends, you should know that I value authenticity above almost everything else. I'd rather have an honest, difficult conversation than maintain a comfortable pretense.",
  "Tell me what you like about me - that's hard to answer without knowing you! But generally, I appreciate people who listen actively, share their authentic selves, and approach life with curiosity rather than judgment.",
  
  // Set 3
  "I sometimes worry my life is too comfortable and that I'm not challenging myself enough or making a big enough difference in the world.",
  "If I were to die without being able to communicate with anyone, I'd most regret not telling certain people how profoundly they affected my life for the better.",
  "My house is burning down and I can only save one thing - assuming people and pets are already safe, I'd grab the journal where I've recorded significant moments and reflections throughout my life.",
  "Of all the people in my family, I feel closest to my sister. We're quite different in many ways, but there's a foundational understanding and acceptance that feels rare and precious.",
  "My most embarrassing memory is from a presentation in college where I completely froze, forgot everything I was supposed to say, and had to leave the stage. It taught me that failure isn't as catastrophic as it feels in the moment.",
  "I last cried in front of another person about six months ago, during a deeply honest conversation with a close friend about some struggles I was going through.",
  "Something I find too serious to be joked about? That's a tough one - I think context matters enormously. But generally, I don't appreciate jokes that punch down or make light of someone's genuine suffering.",
  "If I were to die this evening with no opportunity to communicate with anyone, I'd regret not expressing my gratitude more openly to the people who have shaped my life.",
  "The one thing I'd want people to know about me before we get close is that I sometimes need time alone to recharge, and it's never a reflection on them or the relationship.",
  "If you and I were to become close, I would hope to learn from your unique perspective and experiences. Everyone carries wisdom from their particular path in life.",
  "I share embarrassing things about myself with others once I feel there's mutual trust. Vulnerability tends to deepen connections, but it requires feeling safe.",
  "The last time I played alone as a child, I was probably around 12, creating elaborate stories in my backyard with just my imagination.",
  "Something I'd do but wouldn't admit? I occasionally read the last page of a book first. There's something about knowing where things end up that makes me more attentive to how we get there.",
  "My most memorable birthday was my 25th, when a group of friends orchestrated a series of small surprises throughout the day, each one personal to our shared experiences.",
];

// Function to create placeholder conversation messages with 50 exchanges
export const generatePlaceholderConversation = (
  userAnswers: string[], 
  systemPrompt?: string
): { transcript: string, compatibilityScore: number } => {
  // Initialize empty transcript
  let transcript = '';
  
  // Determine the personality to use - either default or user-defined via system prompt
  const personality = systemPrompt ? 
    { name: "Ramen", ...placeholderPersonality } : // Use the user's name but keep other personality traits
    placeholderPersonality;
  
  // Start with introduction
  transcript += 'User 1: Hi there! Nice to connect with you through AI Match!\n\n';
  transcript += `User 2: Hello! I'm ${personality.name}. I'm excited to get to know you through these questions.\n\n`;
  
  // Use the 36 questions as structure for conversation
  // We'll only use 25 question pairs to create 50 total exchanges (25 from each side)
  const questions = [
    "Given the choice of anyone in the world, whom would you want as a dinner guest?",
    "Would you like to be famous? In what way?",
    "Before making a phone call, do you ever rehearse what you are going to say?",
    "What would constitute a perfect day for you?",
    "When did you last sing to yourself? To someone else?",
    "If you could live to 90 and have either the mind or body of a 30-year-old for the last 60 years, which would you choose?",
    "Do you have a secret hunch about how you will die?",
    "What does friendship mean to you?",
    "What are you most grateful for in your life?",
    "If you could change anything about how you were raised, what would it be?",
    "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
    "If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?",
    "Is there something that you've dreamed of doing for a long time?",
    "What is your most treasured memory?",
    "What is your most terrible memory?",
    "If you knew that in one year you would die suddenly, what would you change about the way you are now living?",
    "What roles do love and affection play in your life?",
    "How close and warm is your family? Do you feel your childhood was happier than most other people's?",
    "How do you feel about your relationship with your mother?",
    "Complete this sentence: 'I wish I had someone with whom I could share...'",
    "When did you last cry in front of another person? By yourself?",
    "What, if anything, is too serious to be joked about?",
    "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone?",
    "Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be?",
    "Of all the people in your family, whose death would you find most disturbing?",
  ];
  
  // Generate conversation using the questions
  for (let i = 0; i < 25; i++) {
    const questionIndex = i % questions.length;
    const question = questions[questionIndex];
    
    // User 1 asks a question
    transcript += `User 1: ${question}\n\n`;
    
    // User 2 (personality) responds
    // If we have a systemPrompt, use the user's answers instead of placeholder answers
    transcript += `User 2: ${systemPrompt ? userAnswers[questionIndex] || placeholderAnswers[questionIndex] : placeholderAnswers[questionIndex]}\n\n`;
    
    // User 2 asks the same question back
    transcript += `User 2: What about you? ${question}\n\n`;
    
    // User 1 responds with a generic response (since we're simulating another user)
    transcript += `User 1: ${getPlaceholderResponse(questionIndex)}\n\n`;
  }
  
  // Add a conclusion
  transcript += `User 2: It's been really interesting getting to know you through these questions! I hope we can chat more soon, mate!\n\n`;
  transcript += "User 1: Likewise! I've enjoyed our conversation.\n\n";
  
  // Calculate a random compatibility score between 70-95% for the placeholder
  const compatibilityScore = Math.floor(Math.random() * 26) + 70;
  
  return { transcript, compatibilityScore };
};

// Helper function to get placeholder responses for User 1
function getPlaceholderResponse(questionIndex: number): string {
  const responses = [
    "I'd love to have dinner with Neil Armstrong. The experience of walking on the moon must have been incredible.",
    "I don't think I'd want to be famous. I value my privacy too much.",
    "Yes, sometimes I rehearse important calls, especially for job interviews.",
    "My perfect day would involve a hike in nature, a good book, and dinner with friends.",
    "I sing in the shower all the time! But not often to other people.",
    "I'd choose the mind of a 30-year-old. I think mental clarity is more important than physical prowess.",
    "I haven't really thought about how I'll die. I try to focus on living well.",
    "Friendship means mutual support and authentic connection to me.",
    "I'm grateful for my health and the opportunities I've had to learn and grow.",
    "I wouldn't change much about my upbringing. My parents did their best.",
    "If I could gain one ability, I'd want to be fluent in every language.",
    "I'd want to know if the choices I'm making now will lead to a fulfilling life.",
    "I've always dreamed of writing a novel that touches people's hearts.",
    "My most treasured memory is a family reunion where all my cousins were together.",
    "My worst memory is probably failing an important exam I had studied hard for.",
    "If I had one year to live, I'd travel more and spend more time with loved ones.",
    "Love is central to my life - it gives meaning to everything else.",
    "My family is fairly close. I had a happy childhood with supportive parents.",
    "I have a good relationship with my mother, though we have different perspectives.",
    "I wish I had someone to share my passion for astronomy and stargazing.",
    "I cried recently watching a moving film, but not in front of others for a while.",
    "I think terminal illness is too serious to joke about without context.",
    "I would regret not telling my best friend how much their support has meant to me.",
    "I would save my journal - it contains memories that can't be replaced.",
    "I'd find my sister's death most disturbing. We've always been very close."
  ];
  
  return responses[questionIndex % responses.length];
} 