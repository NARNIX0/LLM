const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Setting up Groq API integration for your dating app...');

// Function to run shell commands and log output
function runCommand(command, cwd) {
  try {
    console.log(`\n🔄 Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Main setup function
async function setupGroq() {
  // 1. Install server dependencies
  console.log('\n📦 Installing server dependencies including Groq SDK...');
  if (!runCommand('npm install', path.join(process.cwd(), 'server'))) {
    console.error('❌ Failed to install server dependencies. Please check for errors and try again.');
    process.exit(1);
  }

  // 2. Create .env file if it doesn't exist
  const envPath = path.join(process.cwd(), 'server', '.env');
  
  // Ask for Groq API key
  rl.question('\n🔑 Please enter your Groq API key: ', (apiKey) => {
    if (!apiKey) {
      console.log('⚠️ No API key provided. Using placeholder in .env file.');
      apiKey = 'your_api_key_here';
    }

    // Create or update .env file
    const envContent = `PORT=3001\nGROQ_API_KEY=${apiKey}`;
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Created/updated .env file at ${envPath}`);

    // 3. Install frontend dependencies
    console.log('\n📦 Installing frontend dependencies...');
    if (!runCommand('npm install', process.cwd())) {
      console.error('❌ Failed to install frontend dependencies. Please check for errors and try again.');
      process.exit(1);
    }

    console.log('\n🎉 Setup complete! Here\'s how to run your app:');
    console.log('1️⃣ Start the server: npm run server');
    console.log('2️⃣ In a new terminal, start the frontend: npm start');
    console.log('\n📝 Note: For a full LLM integration, uncomment the Groq API section in server.js');

    rl.close();
  });
}

// Run the setup
setupGroq(); 