import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def call(activity_data=None,task='',description='',activity_id=""):
    """Make a call using the VAPI API with personalized prompt based on activity data.
    
    Args:
        activity_data: Optional dictionary containing activity information
    """
    VAPI_API_KEY = os.getenv('VAPI_API_KEY')
    AGENT_ID = os.getenv('AGENT_ID')
    TARGET = os.getenv('TARGET')
    PHONE_NUMBER_ID = os.getenv('PHONE_NUMBER_ID')

    url = "https://api.vapi.ai/call"
    headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Create a personalized prompt based on the activity data
    custom_prompt = "Hi, this is TingTing checking in with your scheduled reminder."
    greeting = "Hi"
    time_context = ""
    
    if activity_data:
        # Extract user information
        user_id = activity_data.get('user_id', '')
        username = user_id.split('_')[-1] if '_' in user_id else user_id
        
        # Extract activity information
        activity_name = activity_data.get('description', '')
        detailed_desc = activity_data.get('detailed_description', '')
        
        # Get time information for context
        if 'frequency' in activity_data and 'time' in activity_data['frequency']:
            time_str = activity_data['frequency']['time']
            
            # Convert 24-hour time to more natural time description
            try:
                hour = int(time_str.split(':')[0])
                if 5 <= hour < 12:
                    time_context = "this morning"
                elif 12 <= hour < 17:
                    time_context = "this afternoon"
                elif 17 <= hour < 22:
                    time_context = "this evening"
                else:
                    time_context = "tonight"
            except:
                # If parsing fails, use generic time context
                time_context = "today"
        
        # Personalize greeting based on time of day
        current_hour = datetime.now().hour
        if 5 <= current_hour < 12:
            greeting = "Good morning"
        elif 12 <= current_hour < 17:
            greeting = "Good afternoon"
        elif 17 <= current_hour < 22:
            greeting = "Good evening"
        else:
            greeting = "Hello"
        
        # Create personalized prompt based on activity type
        if activity_name:
            if "medicine" in activity_name.lower() or "pill" in activity_name.lower() or "medication" in activity_name.lower():
                custom_prompt = f"{greeting} {username}, this is TingTing. It's time for your {activity_name} {time_context}. Have you taken it yet?"
            elif "exercise" in activity_name.lower() or "workout" in activity_name.lower() or "fitness" in activity_name.lower():
                custom_prompt = f"{greeting} {username}! TingTing here. Time for your {activity_name} {time_context}. Are you ready to get moving?"
            elif "appointment" in activity_name.lower() or "meeting" in activity_name.lower() or "visit" in activity_name.lower():
                custom_prompt = f"{greeting} {username}, TingTing here. Just a reminder about your {activity_name} {time_context}. Are you prepared?"
            elif "meal" in activity_name.lower() or "eat" in activity_name.lower() or "food" in activity_name.lower() or "breakfast" in activity_name.lower() or "lunch" in activity_name.lower() or "dinner" in activity_name.lower():
                custom_prompt = f"{greeting} {username}! This is TingTing reminding you it's time for {activity_name} {time_context}. Have you eaten yet?"
            elif "study" in activity_name.lower() or "class" in activity_name.lower() or "lesson" in activity_name.lower():
                custom_prompt = f"{greeting} {username}, TingTing here. It's time for your {activity_name} {time_context}. Are you ready to focus?"
            elif "sleep" in activity_name.lower() or "bed" in activity_name.lower() or "rest" in activity_name.lower():
                custom_prompt = f"{greeting} {username}, this is TingTing. Just a gentle reminder that it's time to prepare for {activity_name} {time_context}."
            else:                # Use detailed description if available
                if detailed_desc:
                    custom_prompt = f"{greeting} {username}, TingTing here. {detailed_desc} {time_context}."
                else:
                    custom_prompt = f"{greeting} {username}, this is TingTing. It's time for your {activity_name} {time_context}. Are you ready?"
                    
    payload = {
        "assistantId": AGENT_ID,
        "phoneNumberId": PHONE_NUMBER_ID,
        "customer": {
            "number": TARGET
        },        "assistantOverrides": {
            "variableValues": {
                "custom_prompt": custom_prompt,
                "task":task,
                "description":description,
                "activity_id":activity_id
            }
        }
    }

    resp = requests.post(url, headers=headers, json=payload)
    print(resp.status_code, resp.text)
    
    return resp

if __name__ == "__main__":
    # Test the call function directly
    call()
