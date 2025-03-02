const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const fs = require('fs');
const { Groq } = require('groq-sdk');

// Load environment variables
dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up middleware
app.use(cors());
app.use(express.json());

// Configure storage for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      interests TEXT,
      profile_picture TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Questions table (36 questions)
    db.run(`CREATE TABLE IF NOT EXISTS user_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      question_number INTEGER,
      answer TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Matches table
    db.run(`CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user1_id INTEGER,
      user2_id INTEGER,
      compatibility_score FLOAT,
      conversation_transcript TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user1_id) REFERENCES users (id),
      FOREIGN KEY (user2_id) REFERENCES users (id)
    )`);
  });
}

// API Endpoints
// Create user profile
app.post('/api/create-profile', upload.single('profilePicture'), (req, res) => {
  const { name, age, interests } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  db.run(
    'INSERT INTO users (name, age, interests, profile_picture) VALUES (?, ?, ?, ?)',
    [name, age, interests, profilePicture],
    function (err) {
      if (err) {
        console.error('Error creating profile:', err);
        return res.status(500).json({ error: 'Failed to create profile' });
      }

      res.status(201).json({ 
        id: this.lastID,
        message: 'Profile created successfully' 
      });
    }
  );
});

// Save user's answers to the 36 questions
app.post('/api/save-question-answer', (req, res) => {
  const { userId, questionNumber, answer } = req.body;

  db.run(
    'INSERT INTO user_questions (user_id, question_number, answer) VALUES (?, ?, ?)',
    [userId, questionNumber, answer],
    function (err) {
      if (err) {
        console.error('Error saving answer:', err);
        return res.status(500).json({ error: 'Failed to save answer' });
      }

      res.status(201).json({ 
        id: this.lastID,
        message: 'Answer saved successfully' 
      });
    }
  );
});

// Get user answers for the LLM
async function getUserAnswers(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT question_number, answer FROM user_questions WHERE user_id = ? ORDER BY question_number',
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

// Get user profile for the LLM
async function getUserProfile(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT name, age, interests FROM users WHERE id = ?',
      [userId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });
}

// Simulate conversation between two users
app.post('/api/simulate-conversation', async (req, res) => {
  const { user1Id, user2Id } = req.body;

  try {
    // For the MVP demo, we're using a simplified version
    // In a production app, we would fetch both users' answers and create more sophisticated profiles
    
    // For demonstration purposes, use mock data
    // Comment this section and uncomment the Groq section below to use actual LLM
    const mockTranscript = `
      User 1: Given the choice of anyone in the world, whom would you want as a dinner guest?
      User 2: I would love to have dinner with Marie Curie. Her pioneering work in radioactivity and being the first person to win Nobel Prizes in two different scientific fields is so inspiring.
      User 1: That's a great choice! I'd choose Leonardo da Vinci, to learn about his diverse interests in art, science, and innovation.
      
      User 2: Would you like to be famous? In what way?
      User 1: I'd like to be known for creating something that positively impacts people's lives, like an innovation in healthcare or education, but not celebrity-level famous.
      User 2: I feel similarly. I'd prefer recognition in my field for meaningful contributions rather than general fame.
    `;

    const mockCompatibilityScore = Math.random() * 100;

    // Uncomment below to use actual Groq LLM API
    /*
    // Get user profiles and answers
    const user1Profile = await getUserProfile(user1Id);
    const user2Profile = await getUserProfile(user2Id);
    const user1Answers = await getUserAnswers(user1Id);
    const user2Answers = await getUserAnswers(user2Id);

    // Create user personas
    const user1Description = `Name: ${user1Profile.name}, Age: ${user1Profile.age}, Interests: ${user1Profile.interests}`;
    const user2Description = `Name: ${user2Profile.name}, Age: ${user2Profile.age}, Interests: ${user2Profile.interests}`;

    // Create a prompt for the conversation simulation
    const prompt = `
    You will simulate a conversation between two people based on their profiles and answers to the 36 Questions to Fall in Love.
    
    Person 1: ${user1Description}
    Person 2: ${user2Description}
    
    Generate a conversation where they discuss 3-4 of the 36 Questions. Format it as:
    User 1: [question from the 36 Questions list]
    User 2: [thoughtful response based on their profile]
    User 1: [thoughtful response to the same question]
    
    Then move to the next question. The conversation should feel natural and reveal their personalities.
    `;

    // Call Groq API to simulate the conversation
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
    });
    
    const transcript = chatCompletion.choices[0].message.content;

    // Now use Groq to evaluate compatibility
    const compatibilityPrompt = `
    Based on the following conversation between two people answering the 36 Questions to Fall in Love,
    analyze their compatibility on a scale of 0-100. Consider factors like:
    - Shared values
    - Communication style
    - Emotional openness
    - Complementary traits
    
    Conversation:
    ${transcript}
    
    Return only a number between 0 and 100 representing their compatibility score.
    `;
    
    const compatibilityCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: compatibilityPrompt }],
      model: "llama3-70b-8192",
    });
    
    const compatibilityScore = parseFloat(compatibilityCompletion.choices[0].message.content.trim());
    */

    // Save the match and conversation in the database
    db.run(
      'INSERT INTO matches (user1_id, user2_id, compatibility_score, conversation_transcript) VALUES (?, ?, ?, ?)',
      [user1Id, user2Id, mockCompatibilityScore, mockTranscript],
      function (err) {
        if (err) {
          console.error('Error saving match:', err);
          return res.status(500).json({ error: 'Failed to save match' });
        }

        res.status(200).json({
          matchId: this.lastID,
          compatibilityScore: mockCompatibilityScore,
          transcript: mockTranscript
        });
      }
    );
  } catch (error) {
    console.error('Error simulating conversation:', error);
    res.status(500).json({ error: 'Failed to simulate conversation' });
  }
});

// Get all matches for a user
app.get('/api/matches/:userId', (req, res) => {
  const userId = req.params.userId;

  db.all(
    `SELECT m.id, m.compatibility_score, m.conversation_transcript, 
            u.id as match_user_id, u.name, u.age, u.interests, u.profile_picture
     FROM matches m
     JOIN users u ON (m.user1_id = ? AND m.user2_id = u.id) OR (m.user2_id = ? AND m.user1_id = u.id)
     ORDER BY m.compatibility_score DESC`,
    [userId, userId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching matches:', err);
        return res.status(500).json({ error: 'Failed to fetch matches' });
      }

      res.status(200).json({ matches: rows });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 