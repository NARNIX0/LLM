# Groq API Integration Guide

This guide explains how to use Groq's Large Language Models (LLMs) in the AI Match dating app.

## What is Groq?

Groq is an AI inference company that provides fast inference for large language models (LLMs). Their API gives access to powerful models like Llama 3 70B with significantly faster response times compared to other providers.

## Setup

1. **Get a Groq API Key**
   - Sign up at [groq.com](https://console.groq.com/)
   - Create a new API key in your Groq dashboard

2. **Install Dependencies**
   - Run the setup script: `npm run setup-groq`
   - When prompted, enter your Groq API key
   - The script will install all necessary dependencies and configure your environment

3. **Configure .env File**
   - The setup script creates a `.env` file in the `server` directory
   - Make sure it contains your Groq API key: `GROQ_API_KEY=your_key_here`

## Using Groq in the Application

The application is configured to use Groq with the Llama 3 70B model for:

1. **Simulating conversations** between potential matches based on their profiles and answers to the 36 questions
2. **Evaluating compatibility** between users based on the simulated conversation

### Enabling Full LLM Integration

The server code currently uses mock data for the MVP demonstration. To enable the actual Groq LLM integration:

1. Open `server/server.js`
2. Find the `simulate-conversation` endpoint
3. Comment out the mock data section and uncomment the Groq API section:

```javascript
// Comment this section
/*
const mockTranscript = `...`;
const mockCompatibilityScore = Math.random() * 100;
*/

// Uncomment this section
const user1Profile = await getUserProfile(user1Id);
const user2Profile = await getUserProfile(user2Id);
// ... rest of the Groq implementation
```

## Model Configuration

The app uses the following Groq model settings:

- **Model**: `llama3-70b-8192`
- **Context Length**: 8192 tokens
- **Prompt Structure**: The prompts are designed to generate conversational responses based on user profiles and question answers

## Troubleshooting

If you encounter issues with the Groq integration:

1. **Check your API key** is correctly set in the `.env` file
2. **Verify network connectivity** to Groq's API servers
3. **Check response formats** - if you modify the prompts, ensure the expected response format is maintained
4. **Monitor usage** - check your Groq dashboard for any rate limiting or quota issues

## Advanced Usage

You can modify the prompts and model parameters in `server.js` to customize the behavior:

- Change the model to a different one offered by Groq
- Adjust the prompt templates to generate different conversation styles
- Modify how compatibility is calculated based on the conversation transcript

## Resources

- [Groq API Documentation](https://console.groq.com/docs/quickstart)
- [Llama 3 70B Model Information](https://console.groq.com/docs/models#llama3-70b) 