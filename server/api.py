from flask import Flask, request
from agents import process_query as agent_process_query
app=Flask(__name__)

@app.route('/')
def main():
    return 'server is alive'

@app.route('/process-query')
def process_query():
    query = request.args.get('q', '')
    response=agent_process_query(query)
    return response

app.run(debug=True)