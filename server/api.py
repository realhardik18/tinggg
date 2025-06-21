from flask import Flask

app=Flask(__name__)

@app.route('/')
def main():
    return 'server is alive'

app.run(debug=True)