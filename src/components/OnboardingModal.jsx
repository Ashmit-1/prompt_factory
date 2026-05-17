import React, { useState } from 'react';
import './OnboardingModal.css';

const OnboardingModal = ({ onSave }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to Prompt Factory!</h2>
        <p>Enter a nickname to get started.</p>
        <form onSubmit={handleSubmit} className="modal-form">
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your nickname..."
            autoFocus
            required
          />
          <button type="submit">Get Started</button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;
