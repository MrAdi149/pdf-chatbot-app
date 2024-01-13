//chat.js
import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const sendMessageToOpenAI = async (message, retryCount) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://api.openai.com/v1/engines/curie/completions',
        {
          prompt: messages.map(msg => msg.text).join('\n') + '\nUser: ' + input + '\nBot:',
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const botMessage = response.data.choices[0].text.trim();
      setMessages(prevMessages => prevMessages.map(msg => (msg === message ? { ...msg, text: botMessage } : msg)));
      await delayBetweenMessages(1000)
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('Rate limit exceeded. Retrying after a delay...');
        const delayTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await delay(delayTime);
        handleSendMessage(retryCount + 1); // Retry the request with incremented retry count
      } else {
        console.error('Error making API request to OpenAI:', error);
        setMessages(prevMessages => [...prevMessages, { text: 'Error generating bot response', sender: 'bot' }]);
        setLoading(false);
        setInput('');
      }
    }
  };
  

  const delayBetweenMessages = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSendMessage = async (retryCount = 0) => {
    // Add user message to the chat optimistically
    const userMessage = { text: input, sender: 'user', gif: '/thinking.gif' };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Make API request to OpenAI for bot response
    await sendMessageToOpenAI(userMessage);
    
    // Other code for retry logic if needed
    // ...
    
    setInput('');
  };

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: 'rgba(280, 2, 255, 0.1)' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ position: 'relative', padding: '10px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
            {message.text}
            {message.gif && (
              <div
                style={{
                  position: 'absolute',
                  top: '30%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <img src={process.env.PUBLIC_URL + message.gif} alt="GIF" className="gif" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;
