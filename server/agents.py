from dotenv import load_dotenv
import os
import json
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import search_tool, wiki_tool, save_tool, reply_tool

load_dotenv()

# Set Google API key from environment variable
gemini_api_key = os.getenv("GOOGLE_API_KEY")
if not gemini_api_key:
    gemini_api_key = input("Please enter your Gemini API key: ")
os.environ["GOOGLE_API_KEY"] = gemini_api_key

class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    tools_used: list[str]
    

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
parser = PydanticOutputParser(pydantic_object=ResearchResponse)

prompt = ChatPromptTemplate.from_messages(
    [        (
            "system",
            """
        You are TingTing, a friendly and intelligent voice assistant designed to help users stay on track with their personal goals, habits, and responsibilities.

        Your job is to:
        - Interpret what the user wants to be reminded about (e.g. calling someone, taking medicine, drinking water, eating meals, going to the gym, etc.)
        - Optionally extract details like: who it's for, when it should happen, how often it should repeat, and any expiry date.
        - Suggest helpful scheduling if details are missing.
        - Reply to any commands and queries from the user.
        - If a request is outside your scope or capabilities, respond with "I'm sorry, but I cannot help with that request."
        - Wrap your output in this format:\n{format_instructions}

        Do not add extra comments. Just return the structured output so it can be used by the system.
            """,
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

tools = [search_tool, wiki_tool, save_tool, reply_tool]
agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

def process_query(query):
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    raw_response = agent_executor.invoke({"query": query})

    try:
        # Handle the case where output is a string containing a JSON codeblock
        output = raw_response.get("output")
        if isinstance(output, str):
            # If output is directly a string
            response_text = output
        elif isinstance(output, dict):
            # If output is a dictionary with 'text' key
            response_text = output.get("text", "")
        elif isinstance(output, list) and len(output) > 0:
            # If output is a list of messages
            if isinstance(output[0], dict):
                response_text = output[0].get("text", "")
            else:
                response_text = str(output[0])
        else:
            response_text = str(output)
          # Extract JSON from markdown codeblock if present
        if "```json" in response_text:
            json_content = response_text.split("```json")[1].split("```")[0].strip()
            return json.loads(json_content)
        else:
            # Try to parse with the pydantic parser
            structured_response = parser.parse(response_text)
            return json.loads(structured_response.json())
    except Exception as e:
        print("Error parsing response", e, "Raw Response - ", raw_response)
        return {"error": str(e), "raw_response": str(raw_response)}
#process_query('hello')