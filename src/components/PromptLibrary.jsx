import React, { useState, useEffect, useMemo } from 'react';
import localforage from 'localforage';
import './PromptLibrary.css';

const PromptLibrary = ({ onEditPrompt }) => {
  const [allPrompts, setAllPrompts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copyingId, setCopyingId] = useState(null);
  const [promptToDelete, setPromptToDelete] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const savedPrompts = await localforage.getItem('pf_prompts') || [];
      setAllPrompts(savedPrompts);
    } catch (error) {
      console.error('Error loading prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Derived Search State using useMemo to prevent duplication/accumulation bugs ---
  const filteredPrompts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allPrompts;

    return allPrompts.filter(prompt => {
      const nameMatch = prompt.name.toLowerCase().includes(query);
      const fullContent = prompt.blocks.map(b => b.content).join(' ').toLowerCase();
      const contentMatch = fullContent.includes(query);
      return nameMatch || contentMatch;
    });
  }, [allPrompts, searchQuery]);

  // --- Text Cleaning Logic for Snippets ---
  const getCleanSnippet = (blocks) => {
    const combinedText = blocks
      .map(block => {
        // Strip markdown heading tags like ## Role: or # Task:
        return block.content.replace(/^#+\s*[\w\s]*:?\s*/gm, '');
      })
      .join(' ')
      .trim();

    if (combinedText.length <= 120) return combinedText;
    return combinedText.substring(0, 120) + '...';
  };

  // --- Delete Logic ---
  const handleDeleteClick = (e, prompt) => {
    e.stopPropagation(); // Prevent triggering the card click edit routing
    setPromptToDelete(prompt); // Open the modal by setting the target prompt state
  };

  const executeDelete = async () => {
    if (!promptToDelete) return;

    try {
      const currentPrompts = await localforage.getItem('pf_prompts') || [];

      // Fallback-safe approach: Filter out the prompt matching name and version
      const updatedPrompts = currentPrompts.filter(p =>
        !(p.name === promptToDelete.name && p.version === promptToDelete.version)
      );

      await localforage.setItem('pf_prompts', updatedPrompts);
      setAllPrompts(updatedPrompts);
      setPromptToDelete(null); // Close the modal on success
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  // --- Clipboard Copy Logic ---
  const handleCopy = async (e, prompt) => {
    e.stopPropagation(); // Prevent triggering the card click edit routing

    let finalPrompt = `# ${prompt.name}\n\n`;
    prompt.blocks.forEach(block => {
      finalPrompt += `## ${block.title}\n${block.content}\n\n---\n\n`;
    });

    // Interpolate variables
    if (prompt.variables) {
      Object.entries(prompt.variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
        finalPrompt = finalPrompt.replace(regex, value || `{{${key}}}`);
      });
    }

    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopyingId(prompt.name); // Using name as ID for simplicity if ID is missing
      setTimeout(() => setCopyingId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return <div className="library-loading">Loading your library...</div>;
  }

  return (
    <div className="library-container">
      <div className="library-search-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search prompts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="library-search-input"
          />
        </div>
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="library-empty">
          <p>No prompts found. Start building something great!</p>
        </div>
      ) : (
        <div className="library-grid">
          {filteredPrompts.map((prompt, index) => (
            <div 
              key={`${prompt.name}-${index}`} 
              className="prompt-card" 
              onClick={() => onEditPrompt(prompt)}
            >
              <div className="card-header">
                <h3 className="card-title">{prompt.name}</h3>
                <button 
                  className="card-delete-btn" 
                  onClick={(e) => handleDeleteClick(e, prompt)}
                  title="Delete Prompt"
                >
                  🗑️
                </button>
              </div>
              <div className="card-content">
                <p className="card-snippet">{getCleanSnippet(prompt.blocks)}</p>
              </div>
              <div className="card-footer">
                <button 
                  className="card-copy-btn" 
                  onClick={(e) => handleCopy(e, prompt)}
                >
                  {copyingId === prompt.name ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {promptToDelete && (
        <div className="modal-overlay">
          <div className="modal-card">
            <p className="modal-message">
              Are you sure you want to delete <strong>{promptToDelete.name}</strong>?
            </p>
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setPromptToDelete(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete" 
                onClick={executeDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptLibrary;
