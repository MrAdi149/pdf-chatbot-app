// App.js
import React from 'react';
import FileUpload from './FileUpload';
import Chat from './Chat';
import './App.css';
import videoBg from './background.mp4'; // Adjust the path accordingly



const App = () => {
  return (
    <div className="app-container">
      <div className="video-container">
        <video autoPlay muted loop className="video-bg">
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>
      <div className="content-container">
        <h1>ChatPDF App</h1>
        <FileUpload />
        <Chat />
      </div>
    </div>
  );
};

export default App;

