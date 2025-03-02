from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set")

# Initialize language model
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama3-70b-8192",
)

# Define request and response models
class ConversationRequest(BaseModel):
    starter: str
    messages: Optional[List[dict]] = []

class ConversationResponse(BaseModel):
    alex_message: str
    jordan_message: str

class Message(BaseModel):
    speaker: str
    text: str

class ConversationAnalysisRequest(BaseModel):
    messages: List[Message]

class ConversationAnalysisResponse(BaseModel):
    chemistry: str
    connectionPoints: List[str]
    potentialIssues: List[str]
    overallAssessment: str

# Create CrewAI agents
alex = Agent(
    role="Alex",
    goal="Engage in a thoughtful, philosophical conversation",
    backstory="""You are Alex, a thoughtful and philosophical individual who enjoys deep conversations.
    You are interested in art, literature, and exploring the meaning of life. You express yourself 
    in a contemplative manner and ask thought-provoking questions.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
)

jordan = Agent(
    role="Jordan",
    goal="Share exciting experiences and connect with energy",
    backstory="""You are Jordan, an energetic and adventurous person who loves sharing experiences.
    You're passionate about travel, outdoor activities, and trying new things. You communicate with 
    enthusiasm and often relate conversations back to your exciting adventures.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
)

@app.post("/generate-conversation", response_model=ConversationResponse)
async def generate_conversation(request: ConversationRequest):
    try:
        logger.info(f"Received request with starter: {request.starter}")
        # Extract conversation starter and previous messages
        starter = request.starter
        previous_messages = "\n".join([f"{msg['speaker']}: {msg['text']}" for msg in request.messages]) if request.messages else ""
        
        # Define tasks for each agent
        if not previous_messages:
            # First exchange
            jordan_task = Task(
                description=f"""Respond to Alex's message: "{starter}"
                
                Your response should be authentic to your adventurous, energetic personality.
                Keep it under 100 words and make it conversational.
                """,
                agent=jordan,
            )
            
            # Get Jordan's response
            jordan_response = jordan_task.execute()
            
            # Now Alex responds to Jordan
            alex_next_task = Task(
                description=f"""The conversation so far:
                Alex: {starter}
                Jordan: {jordan_response}
                
                Now respond to Jordan's message. Be thoughtful and philosophical.
                Keep it under 100 words and make it conversational.
                """,
                agent=alex,
            )
            
            alex_response = alex_next_task.execute()
        else:
            # Continuing conversation
            # Check who spoke last to determine who speaks next
            last_speaker = request.messages[-1]['speaker']
            last_message = request.messages[-1]['text']
            
            if last_speaker == "Alex":
                # Jordan responds to Alex
                jordan_task = Task(
                    description=f"""The conversation so far:
                    {previous_messages}
                    
                    Now respond to Alex's last message: "{last_message}"
                    Be true to your adventurous, energetic personality.
                    Keep it under 100 words and make it conversational.
                    """,
                    agent=jordan,
                )
                
                jordan_response = jordan_task.execute()
                
                # Alex responds to Jordan
                alex_task = Task(
                    description=f"""The conversation so far:
                    {previous_messages}
                    Jordan: {jordan_response}
                    
                    Now respond to Jordan's message. Be thoughtful and philosophical.
                    Keep it under 100 words and make it conversational.
                    """,
                    agent=alex,
                )
                
                alex_response = alex_task.execute()
            else:
                # Alex responds to Jordan
                alex_task = Task(
                    description=f"""The conversation so far:
                    {previous_messages}
                    
                    Now respond to Jordan's last message: "{last_message}"
                    Be thoughtful and philosophical.
                    Keep it under 100 words and make it conversational.
                    """,
                    agent=alex,
                )
                
                alex_response = alex_task.execute()
                
                # Jordan responds to Alex
                jordan_task = Task(
                    description=f"""The conversation so far:
                    {previous_messages}
                    Alex: {alex_response}
                    
                    Now respond to Alex's message. Be true to your adventurous, energetic personality.
                    Keep it under 100 words and make it conversational.
                    """,
                    agent=jordan,
                )
                
                jordan_response = jordan_task.execute()
        
        return ConversationResponse(
            alex_message=alex_response,
            jordan_message=jordan_response
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-conversation", response_model=ConversationAnalysisResponse)
async def analyze_conversation(request: ConversationAnalysisRequest):
    try:
        logger.info(f"Analyzing conversation with {len(request.messages)} messages")
        
        # Format conversation for the LLM
        conversation_text = "\n".join([f"{msg.speaker}: {msg.text}" for msg in request.messages])
        
        # Create analysis task
        analysis_task = Task(
            description=f"""Analyze the following conversation between Alex and Jordan:

{conversation_text}

Based on this conversation, provide:
1. An assessment of their conversational chemistry
2. 3-4 potential connection points between them
3. 2-3 potential issues or incompatibilities
4. An overall assessment of their compatibility (2-3 sentences)

Your analysis should be balanced, insightful, and focused on interpersonal dynamics.
""",
            agent=Agent(
                role="Relationship Analyst",
                goal="Provide insightful conversation analysis",
                backstory="You are an expert in analyzing conversations and interpersonal dynamics.",
                verbose=True,
                allow_delegation=False,
                llm=llm,
            ),
        )
        
        analysis_result = analysis_task.execute()
        
        # Parse the analysis - this is simplified and might need improvement
        # depending on how structured the LLM output is
        chemistry = ""
        connection_points = []
        potential_issues = []
        overall_assessment = ""
        
        # Simple parsing attempt - would be more robust with better prompting
        sections = analysis_result.split("\n\n")
        for section in sections:
            if section.startswith("Chemistry:"):
                chemistry = section.replace("Chemistry:", "").strip()
            elif section.startswith("Connection Points:"):
                points_text = section.replace("Connection Points:", "").strip()
                connection_points = [p.replace("- ", "").strip() for p in points_text.split("\n") if p.strip()]
            elif section.startswith("Potential Issues:"):
                issues_text = section.replace("Potential Issues:", "").strip()
                potential_issues = [p.replace("- ", "").strip() for p in issues_text.split("\n") if p.strip()]
            elif section.startswith("Overall Assessment:"):
                overall_assessment = section.replace("Overall Assessment:", "").strip()
        
        # Fallbacks if parsing doesn't work well
        if not chemistry:
            chemistry = "Alex and Jordan show an interesting dynamic with complementary conversation styles."
        
        if not connection_points:
            connection_points = [
                "Shared interest in meaningful experiences",
                "Different perspectives that could lead to mutual growth",
                "Respectful engagement with each other's ideas"
            ]
            
        if not potential_issues:
            potential_issues = [
                "Different approaches to finding meaning",
                "Varying energy levels and communication styles"
            ]
            
        if not overall_assessment:
            overall_assessment = "This match shows potential for a balanced relationship where each person brings different but complementary strengths to the conversation."
        
        return ConversationAnalysisResponse(
            chemistry=chemistry,
            connectionPoints=connection_points,
            potentialIssues=potential_issues,
            overallAssessment=overall_assessment
        )
    
    except Exception as e:
        logger.error(f"Error analyzing conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 