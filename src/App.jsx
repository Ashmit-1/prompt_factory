import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import Home from './components/Home';
import OnboardingModal from './components/OnboardingModal';
import GlobalHeader from './components/GlobalHeader';
import BuildPrompt from './components/BuildPrompt';

function App() {
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('home');

  useEffect(() => {
    async function checkUser() {
      try {
        const savedName = await localforage.getItem('pf_username');
        if (savedName) {
          setUsername(savedName);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      } finally {
        setIsLoading(false);
      }
    }
    checkUser();
  }, []);

  const handleSetUsername = async (name) => {
    try {
      await localforage.setItem('pf_username', name);
      setUsername(name);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {username && <GlobalHeader 
        onHomeClick={() => setView('home')} 
        currentView={view} 
        setView={setView} 
      />}
      {!username && <OnboardingModal onSave={handleSetUsername} />}
      {username && view === 'home' && <Home username={username} onBuildPrompt={() => setView('build')} />}
      {username && view === 'build' && <BuildPrompt onBack={() => setView('home')} />}
    </div>
  );
}

export default App;
