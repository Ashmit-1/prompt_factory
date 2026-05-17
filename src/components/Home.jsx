import React from 'react';
import './Home.css';

const Home = ({ username }) => {
  const handleBuildPrompt = () => {
    console.log('Navigating to Build Prompt...');
  };

  const handleVisitLibrary = () => {
    console.log('Navigating to Prompt Library...');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome, {username}</h1>
      </header>
      
      <main className="home-main">
        <div className="nav-box">
          <button className="nav-button" onClick={handleBuildPrompt}>
            Build Prompt
          </button>
          <button className="nav-button" onClick={handleVisitLibrary}>
            Visit Prompt Library
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
