# app.py
from flask import Flask, request, jsonify
from rasa.core.agent import Agent

app = Flask(__name__)

agent = Agent.load("models")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data['user_input']

    # Get response from Rasa model
    response = agent.handle_text(user_input)

    # Extract the first response as the chatbot response
    bot_response = response[0]['text']
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
