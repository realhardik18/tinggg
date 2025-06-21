from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType
from langchain_google_genai import ChatGoogleGenerativeAI
import warnings
import os
from dotenv import load_dotenv

load_dotenv()

warnings.filterwarnings("ignore", category=DeprecationWarning)

def fetch_activites(id: str):
    mock_activities = [
        f"Activity 1: User {id} logged in at 9:00 AM",
        f"Activity 2: User {id} updated profile at 9:15 AM",
        f"Activity 3: User {id} sent 3 messages at 10:30 AM",
        f"Activity 4: User {id} joined group 'Research' at 11:00 AM",
        f"Activity 5: User {id} uploaded document at 1:45 PM",
        f"Activity 6: User {id} commented on post #1234 at 2:30 PM",
        f"Activity 7: User {id} liked content at 3:15 PM",
        f"Activity 8: User {id} shared article at 4:00 PM",
        f"Activity 9: User {id} scheduled meeting at 4:45 PM",
        f"Activity 10: User {id} logged out at 5:30 PM"
    ]
    activities_str = "\n".join(mock_activities)
    print(f"\n--- USER ACTIVITIES FOR ID: {id} ---")
    print(activities_str)
    print("-----------------------------------\n")
    return activities_str
def add_activity(input_str:str):
    """Add an activity for a user.
    
    Args:
        input_str: A string containing user ID and activity description
    
    Returns:
        JSON formatted activity data
    """
    import json
    import uuid
    import re
    from datetime import datetime, timedelta

    try:
        # First try simple parsing for ID and description
        if ',' in input_str:
            parts = input_str.split(",", 1)
            id = parts[0].strip()
            name = parts[1].strip()
        else:
            words = input_str.split()
            if len(words) >= 2:
                id = words[0]
                name = " ".join(words[1:])
            else:
                return "Error: Input must contain user ID and activity description"
                        
        date = datetime.now().strftime("%Y-%m-%d")
        tags = []          
        llm_data = extract_activity_data_with_llm(llm, input_str)
        
        if not llm_data:
            return "Service Unavailable: Unable to process the request at this time."
            
        print("\n--- LLM EXTRACTED DATA ---")
        print(json.dumps(llm_data, indent=2))
        print("-------------------------\n")
                
        if "user_id" in llm_data and llm_data["user_id"]:
            id = llm_data["user_id"]
        
        if "description" in llm_data and llm_data["description"]:
            name = llm_data["description"]
            
        if "time" in llm_data and llm_data["time"]:
            time = llm_data["time"]
            
        if "date" in llm_data and llm_data["date"]:
            date = llm_data["date"]
            
        if "tags" in llm_data and isinstance(llm_data["tags"], list) and llm_data["tags"]:
            tags = llm_data["tags"]
                
        activity_id = f"act_{uuid.uuid4().hex[:6]}"          
        activity = {
            "activity_id": activity_id,
            "user_id": id,
            "timestamp": datetime.now().isoformat() + "Z",
            "description": name,
            "tags": tags if tags else ["task"],
            "source": "assistant",
            "frequency": {
                "type": llm_data.get("type", "one_time") if llm_data else "one_time",
                "date": date,
                "pattern": llm_data.get("pattern", []) if llm_data else [],
                "time": time
            },
            "expiry": (datetime.now() + timedelta(days=14)).isoformat() + "Z"
        }
                
        if llm_data and "duration" in llm_data and llm_data["duration"]:
            duration = llm_data["duration"].lower()            
            days = 7  
            
            if "week" in duration or "wk" in duration:                
                match = re.search(r'(\d+)\s*(?:week|wk)', duration)
                if match:
                    days = int(match.group(1)) * 7
            elif "day" in duration:
                match = re.search(r'(\d+)\s*day', duration)
                if match:
                    days = int(match.group(1))
            elif "month" in duration:
                match = re.search(r'(\d+)\s*month', duration)
                if match:
                    days = int(match.group(1)) * 30
                                
            activity["expiry"] = (datetime.now() + timedelta(days=days)).isoformat() + "Z"
                
        formatted_json = json.dumps(activity, indent=2)
        
        print(f"\n--- ADDING ACTIVITY FOR USER: {id} ---")
        print(f"Activity: {name}")
        print(f"Execution Time: {time}")
        print("Activity JSON Data:")
        print(formatted_json)
        print("-----------------------------------\n")
        
        return formatted_json
    except Exception as e:
        print(f"Error in add_activity: {e}")
        print(f"Input received: '{input_str}'")
        return f"Error processing activity: {e}"

def extract_activity_data_with_llm(llm, input_str):
    """Use the Gemini API to directly extract structured activity data from user input.
    
    Args:
        llm: The language model to use
        input_str: User input string
    
    Returns:
        Dictionary with extracted activity data or None if extraction fails
    """
    try:
        # Create a structured prompt that explicitly asks for JSON output
        prompt = f"""
You are a data extraction assistant. Parse the following user input into a structured JSON object.

User input: "{input_str}"

Extract and return ONLY a valid, properly formatted JSON object with these fields:
- user_id (string): The ID of the user mentioned in the input
- description (string): A clean description of the activity without time/date information
- time (string): The time of execution in 24-hour format (HH:MM)
- date (string): The date in YYYY-MM-DD format, use tomorrow's date if "tomorrow" is mentioned
- tags (array): Relevant tags based on the activity (e.g., ["medicine", "health"] for medicine-related activities)
- type (string): Either "one_time" or "recurring" based on the frequency mentioned
- pattern (array): For recurring activities, days of the week as ["mon", "tue", etc.], or empty for one-time
- duration (string): How long the activity should continue (e.g., "2 weeks")

RESPOND ONLY WITH THE JSON OBJECT, no explanations or other text.
"""
        # Call the LLM to extract the data
        response = llm.invoke(prompt)
        content = response.content.strip()
        
        # Try to parse the response directly as JSON
        import json
        
        try:
            # First, try to parse the entire response as JSON
            data = json.loads(content)
            return data
        except json.JSONDecodeError:
            # If that fails, try to extract JSON using regex
            import re
            json_match = re.search(r'({.*})', content, re.DOTALL)
            if json_match:
                try:
                    data = json.loads(json_match.group(1))
                    return data
                except:
                    # Any parsing failure returns None
                    return None
            # Could not extract JSON
            return None
    except Exception as e:
        # Any error returns None
        print(f"Error extracting data with LLM: {e}")
        return None

# ✅ Wrap it as a Tool
tools = [
    Tool(
        name="UserActivityFetcher",
        func=fetch_activites,
        description="Use this tool to fetch user activity logs. Input should be a user ID string."
    ),    Tool(
        name="UserActivityAdded",
        func=add_activity,
        description="Use this tool to add user activity. Input should be a string containing user ID and activity description and a time for execution (either comma-separated or as first word followed by description)."
    )
]

# ✅ Gemini LLM wrapper
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=os.getenv('GOOGLE_API_KEY'))

# ✅ Create the agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# ✅ Ask the agent to fetch user activity
#query = "user_32i4u92432 add activity called take medicine twice daily at 9:45 am and 8:30 pm starting tomorrow and continuing for the next 2 weeks"
#output = agent.run(query)

def process_query_with_agent(query):
    """Process a user query using the agent to determine the appropriate tool
    
    Args:
        query: The user query string
    
    Returns:
        The agent's response
    """
    try:
        # Create an instance of the LLM if not already available
        gemini_api_key = os.getenv("GOOGLE_API_KEY")
        if not gemini_api_key:
            return "Service Unavailable: Missing API key"
            
        gemini = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=gemini_api_key)
        
        # Initialize the agent with tools
        agent = initialize_agent(
            tools=tools,
            llm=gemini,
            agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )
        
        # Let the agent decide which tool to use based on the query
        output = agent.run(query)
        
        # Return the output
        return output
    except Exception as e:
        return f"Service Unavailable: {str(e)}"

# Example of agent-based processing
if __name__ == "__main__":    
    #query='add activity for userr_291231 to take bath in 5 minutes'        
    query='fetch all the activites for userr_291231'        
    print(f"\n=== PROCESSING QUERY: {query} ===")
    result = process_query_with_agent(query)
    print("AGENT RESULT:")
    print(result)
    print("="*50)
