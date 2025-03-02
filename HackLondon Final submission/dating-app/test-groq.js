const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

// Check if API key is set
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY not found in environment variables');
  console.log('Please make sure you have created a .env file in the server directory with your Groq API key');
  process.exit(1);
}

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Simple test function to verify connectivity
async function testGroqConnection() {
  console.log('🔄 Testing connection to Groq API...');
  
  try {
    // Send a simple test prompt
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Write a one-sentence summary of what Groq offers." }],
      model: "llama3-70b-8192",
    });
    
    console.log('✅ Successfully connected to Groq API!');
    console.log('\n📝 Response:');
    console.log(chatCompletion.choices[0].message.content);
    
    console.log('\n⏱️ Response metrics:');
    console.log(`- Model: ${chatCompletion.model}`);
    console.log(`- Completion tokens: ${chatCompletion.usage.completion_tokens}`);
    console.log(`- Prompt tokens: ${chatCompletion.usage.prompt_tokens}`);
    console.log(`- Total tokens: ${chatCompletion.usage.total_tokens}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to Groq API:');
    console.error(error);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Groq API integration tests...');
  
  // Test 1: Basic connectivity
  const connectionSuccessful = await testGroqConnection();
  
  if (connectionSuccessful) {
    console.log('\n✅ All tests passed! Your Groq integration is working correctly.');
    console.log('\nNext steps:');
    console.log('1. Run the application with: npm run server (in one terminal)');
    console.log('2. In another terminal: npm start');
    console.log('3. To use actual LLM integration, uncomment the Groq section in server.js');
  } else {
    console.log('\n❌ Tests failed. Please check your API key and connection.');
  }
}

// Run the tests
runTests(); 