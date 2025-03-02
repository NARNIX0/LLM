# AI Match - Dating App MVP

This project was created for HackLondon 2025 under the "A World Without X" category, reimagining traditional dating apps by removing manual swiping and superficial matching.

## Concept

AI Match uses Large Language Models (LLMs) to simulate conversations between potential matches based on the famous "36 Questions to Fall in Love" study by psychologist Arthur Aron. Instead of swiping through profiles, users answer these deep, meaningful questions, which our AI uses to:

1. Create an LLM representation of their personality and values
2. Simulate conversations between two LLM-trained profiles
3. Assess compatibility based on the conversation transcript
4. Present matches with compatibility scores and full conversation transcripts

## Features

- **Profile Creation**: Users input basic details and answer the 36 questions
- **Simulated Conversations**: LLMs simulate one conversation using the 36 questions as prompts
- **Compatibility Assessment**: A second LLM evaluates the conversation for compatibility
- **Matches Screen**: View potential matches with compatibility scores and conversation transcripts

## Tech Stack

- **Frontend**: React.js with TypeScript and Material-UI
- **Backend**: Node.js/Express.js 
- **Database**: SQLite
- **LLM Integration**: Groq API (using Llama 3 70B model)

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd dating-app
```

2. Install frontend dependencies:
```
npm install
```

3. Install backend dependencies:
```
cd server
npm install
cd ..
```

4. Create a `.env` file in the server directory with your Groq API key:
```
PORT=3001
GROQ_API_KEY=your_api_key_here
```

### Running the Application

1. Start the backend server:
```
npm run server
```

2. In a new terminal, start the React frontend:
```
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

- `/src`: Frontend React application
  - `/components`: Reusable UI components
  - `/pages`: Main application screens
  - `/services`: API services
  - `/utils`: Utility functions and constants
- `/server`: Backend Express server
  - `server.js`: Main server file
  - `/uploads`: User-uploaded profile pictures

## Future Enhancements

- User authentication and secure profiles
- More sophisticated LLM training based on user responses
- Multiple simulated conversations with different question sets
- Video/audio integration for in-app meetings between matches
- Improved matching algorithm with more parameters (location, age preferences, etc.)

## License

This project is created for HackLondon 2025 and is for demonstration purposes only.

## Credits

- The "36 Questions to Fall in Love" by Arthur Aron
- Groq API for language model integration
- Material-UI for the component library