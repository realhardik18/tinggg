from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import search_tool, wiki_tool, save_tool, fetch_tool
import os

load_dotenv()

class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    tools_used: list[str]
    
# Get Gemini API key from environment variables
gemini_api_key = os.getenv("GOOGLE_API_KEY")
if not gemini_api_key:
    # Fallback to direct input if not in environment
    gemini_api_key = input("Please enter your Gemini API key: ")
    os.environ["GOOGLE_API_KEY"] = gemini_api_key

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
parser = PydanticOutputParser(pydantic_object=ResearchResponse)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a research assistant that will help generate a research paper.
            Answer the user query and use neccessary tools. 
            Wrap the output in this format and provide no other text\n{format_instructions}
            """,
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

tools = [search_tool, wiki_tool, save_tool,fetch_tool]
agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
query = input("What can i help you research? ")

print("\n=== EXECUTING QUERY ===")
print(f"Query: {query}")
print("======================\n")

raw_response = agent_executor.invoke({"query": query})

print("\n=== FINAL RESULTS ===")
# Extract and print just the output portion
if "output" in raw_response:
    print(raw_response["output"])
else:
    print("No output found in response")
    print("Complete response:", raw_response)
print("======================")