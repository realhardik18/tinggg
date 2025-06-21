from flask import Flask, request, jsonify
from tools import process_query_with_agent
import traceback

app = Flask(__name__)

@app.route('/')
def main():
    return 'server is alive'

@app.route('/process', methods=['POST'])
def process_query():
    """Process a user query and return the result"""
    try:
        data = request.json
        
        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing query parameter',
                'status': 'error'
            }), 400
            
        query = data['query']
        result = process_query_with_agent(query)
        
        # Try to parse the result as JSON if it seems to be JSON
        try:
            import json
            if isinstance(result, str) and result.strip().startswith('{'):
                parsed_result = json.loads(result)
                return jsonify({
                    'status': 'success',
                    'result': parsed_result
                })
        except:
            # If parsing fails, return as string
            pass
            
        return jsonify({
            'status': 'success',
            'result': result
        })
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Activity Processing API is running'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)