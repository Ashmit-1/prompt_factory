import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import Home from './components/Home';
import OnboardingModal from './components/OnboardingModal';

function App() {
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      {!username && <OnboardingModal onSave={handleSetUsername} />}
      {username && <Home username={username} />}
    </div>
  );
}

export default App;
