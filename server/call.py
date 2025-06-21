import requests
import os
from dotenv import load_dotenv

load_dotenv()

def call():
    VAPI_API_KEY = os.getenv('VAPI_API_KEY')
    AGENT_ID = os.getenv('AGENT_ID')
    TARGET = os.getenv('TARGET')
    PHONE_NUMBER_ID = os.getenv('PHONE_NUMBER_ID')

    url = "https://api.vapi.ai/call"
    headers = {
        "Authorization": f"Bearer {VAPI_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "assistantId": AGENT_ID,
        "phoneNumberId": PHONE_NUMBER_ID,
        "customer": {
            "number": TARGET
        },
        "assistantOverrides": {
            "variableValues": {
                "custom_prompt": "Hi, this is TingTing checking in. Did you take your medicine today?"
            }
        }
    }

    resp = requests.post(url, headers=headers, json=payload)
    print(resp.status_code, resp.text)

call()
