# AI Match - Technical Documentation

## Architecture Overview

This document provides a detailed explanation of the AI Match dating app codebase, explaining how components interact and the technical implementation details.

## Tech Stack

### Frontend
- **React 18**: UI library for building the user interface
- **TypeScript**: For type-safe JavaScript development
- **Material-UI 5**: Component library for styling and UI elements
- **React Router 6**: For client-side routing
- **Axios**: For API requests to the backend

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web server framework
- **SQLite3**: Lightweight database for storing user profiles and answers
- **Multer**: For handling file uploads (profile pictures)
- **Groq SDK**: For interacting with Groq's LLM API (Llama 3 70B)
- **CORS**: For handling cross-origin requests
- **dotenv**: For environment variable management

## Codebase Structure

### Frontend Structure
```
/src
  /components       # Reusable UI components
  /pages            # Main application screens
  /services         # API service integration
  /utils            # Utility functions and constants
  App.tsx           # Main application component with routing
  index.tsx         # Entry point for React application
  index.css         # Global styles
```

### Backend Structure
```
/server
  server.js         # Main Express server
  /uploads          # Storage for user profile pictures
  .env              # Environment variables (API keys, ports)
```

## Component Hierarchy & Data Flow

### Frontend Pages
1. **LandingPage**: Entry point displaying app introduction
2. **ProfileCreation**: Multi-step form for creating user profile and answering 36 questions
3. **MatchesScreen**: Displays compatible matches with compatibility scores
4. **ConversationScreen**: Shows simulated conversation between users
5. **TranscriptViewer**: Displays full conversation transcript with compatibility analysis

### Data Flow
- User profiles and question answers are stored in the **SQLite database**
- The frontend uses **Axios** to make API calls to the backend
- API responses are handled via TypeScript interfaces defined in `src/services/api.ts`
- The backend uses **Groq SDK** to generate AI conversations and assess compatibility

## Backend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-profile` | POST | Creates a new user profile |
| `/api/save-question-answer` | POST | Saves a user's answer to a question |
| `/api/simulate-conversation` | POST | Generates a conversation between two users and assesses compatibility |
| `/api/matches/:userId` | GET | Retrieves potential matches for a user |

## Database Schema

The SQLite database consists of three main tables:

1. **Users**
   - id (INTEGER PRIMARY KEY)
   - name (TEXT)
   - age (INTEGER)
   - interests (TEXT)
   - profilePicture (TEXT) - path to uploaded image

2. **Answers**
   - id (INTEGER PRIMARY KEY)
   - userId (INTEGER) - foreign key to Users
   - questionNumber (INTEGER) - index of the question (0-35)
   - answer (TEXT) - user's answer to the question

3. **Matches**
   - id (INTEGER PRIMARY KEY)
   - user1Id (INTEGER) - foreign key to Users
   - user2Id (INTEGER) - foreign key to Users
   - compatibilityScore (REAL) - percentage score (0-100)
   - conversationTranscript (TEXT) - AI-generated conversation

## AI Integration Details

The application uses Groq's API to access the Llama 3 70B model for two main functions:

1. **Conversation Simulation**: 
   - Function: `simulateConversation` in `server.js`
   - Process: 
     1. Retrieves profiles and answers for both users
     2. Constructs a prompt using the 36 questions and user answers
     3. Sends request to Groq API to generate a realistic conversation
     4. Parses and formats the response for display

2. **Compatibility Assessment**:
   - Based on the conversation transcript, a second LLM request evaluates compatibility
   - The assessment considers communication style, shared values, and emotional response
   - Returns a compatibility score (0-100) and justification

## Frontend Component Interactions

### User Journey Flow
1. User visits **LandingPage**
2. User navigates to **ProfileCreation** and:
   - Enters basic profile information
   - Uploads a profile picture
   - Answers the 36 questions
3. User is directed to **MatchesScreen** showing potential matches
4. User can select a match to view the **ConversationScreen**
5. User can view the full conversation in **TranscriptViewer**

### State Management
- Local React state with `useState` hooks for component-level state
- Form data for profile creation is managed stepwise with state
- API responses are stored in local state and passed to child components as needed

## Key Implementation Details

### The 36 Questions
- Questions are stored in `src/utils/questions.ts`
- These form the basis of all conversation simulations
- Each answer is stored individually in the database

### Profile Picture Handling
- Profile pictures are uploaded using a form with `encType="multipart/form-data"`
- Processed by Multer middleware on the backend
- Stored in the `/server/uploads` directory
- File paths are saved in the database

### Conversation Simulation
- The `ConversationScreen` component uses a progressive typing effect to display the AI-generated conversation
- This creates the illusion of a real-time conversation
- Compatibility score is revealed after the conversation completes

### Responsive Design
- Material-UI's Grid system is used for responsive layouts
- Custom CSS in `index.css` provides additional styling
- All screens are optimized for both mobile and desktop views

## Testing and Debug Tips

- The application includes a `test-groq.js` script to verify Groq API connectivity
- In case of connectivity issues, the app falls back to mock data
- Console logging is implemented at critical points for debugging
- The `setup-groq.js` script helps configure the Groq API key

## Deployment Considerations

- Frontend can be built with `npm run build` for production
- Backend requires Node.js environment
- Environment variables for API keys need to be set
- Database is contained in a local SQLite file, which should be backed up

## Future Enhancements (Planned but Not Implemented)

- User authentication system
- Real-time notifications
- Expanded question sets beyond the original 36
- Video call integration for matched users
- Progressive profile enhancement based on continuous user feedback

This document provides a comprehensive overview of the technical implementation of AI Match, covering architecture, data flow, and implementation details. 