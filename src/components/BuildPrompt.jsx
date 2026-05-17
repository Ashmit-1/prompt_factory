import React, { useState, useEffect, useCallback } from 'react';
import localforage from 'localforage';
import './BuildPrompt.css';

const DEFAULT_BLOCKS = [
  { id: '1', title: 'Role', content: '' },
  { id: '2', title: 'Task', content: '' },
  { id: '3', title: 'Context', content: '' },
  { id: '4', title: 'Content', content: '' },
  { id: '5', title: 'Output Format', content: '' },
];

const BuildPrompt = ({ onBack }) => {
  const [promptName, setPromptName] = useState('');
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [variables, setVariables] = useState({});
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' | 'variables'
  const [copyStatus, setCopyStatus] = useState('Copy Prompt');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // --- Block Logic ---
  const updateBlock = (id, field, value) => {
    setBlocks(prev => prev.map(block => block.id === id ? { ...block, [field]: value } : block));
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const deleteBlock = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const addCustomBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      title: 'Custom Block',
      content: '',
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  // --- Variable Logic ---
  const extractVariables = useCallback(() => {
    const allContent = blocks.map(b => b.content).join('\n');
    const regex = /\{\{\s*([\w\s]+)\s*\}\}/g;
    const foundVars = new Set();
    let match;

    while ((match = regex.exec(allContent)) !== null) {
      foundVars.add(match[1].trim());
    }

    setVariables(prev => {
      const nextVars = {};
      foundVars.forEach(varName => {
        nextVars[varName] = prev[varName] || '';
      });
      return nextVars;
    });
  }, [blocks]);

  useEffect(() => {
    if (activeTab === 'variables') {
      extractVariables();
    }
  }, [activeTab, extractVariables]);

  const updateVariableValue = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  // --- Preview Logic ---
  const compiledMarkdown = () => {
    let md = `# ${promptName || 'Untitled Prompt'}\n\n`;
    blocks.forEach(block => {
      md += `## ${block.title || 'Untitled Block'}\n${block.content || '*No content*'}\n\n---\n\n`;
    });
    return md;
  };

  const handleCopy = async () => {
    let finalPrompt = compiledMarkdown();
    
    // Interpolate variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      finalPrompt = finalPrompt.replace(regex, value || `{{${key}}}`);
    });

    await navigator.clipboard.writeText(finalPrompt);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Prompt'), 2000);
  };

  // --- Save Logic ---
  const handleSave = async (mode, customVersionName = '') => {
    const promptData = {
      name: promptName,
      blocks: blocks,
      variables: variables,
      updatedAt: new Date().toISOString(),
    };

    const existingPrompts = (await localforage.getItem('pf_prompts')) || [];
    const existingIdx = existingPrompts.findIndex(p => p.name === promptName);

    if (mode === 'overwrite' || existingIdx === -1) {
      // Scenario A or Scenario B1: New or Modify Existing
      const version = existingIdx === -1 ? 'v1' : (existingPrompts[existingIdx].version || 'v1');
      const finalData = { ...promptData, version };
      
      if (existingIdx === -1) {
        existingPrompts.push(finalData);
      } else {
        existingPrompts[existingIdx] = finalData;
      }
      await localforage.setItem('pf_prompts', existingPrompts);
    } else if (mode === 'new_version') {
      // Scenario B2: Create New Version
      const currentVersion = existingPrompts[existingIdx].version || 'v1';
      const versionMatch = currentVersion.match(/v(\d+)/);
      const nextVersionNumber = versionMatch ? parseInt(versionMatch[1]) + 1 : 2;
      const newVersion = `v${nextVersionNumber}`;
      
      const finalData = { 
        ...promptData, 
        version: newVersion, 
        versionNote: customVersionName 
      };
      existingPrompts.push(finalData);
      await localforage.setItem('pf_prompts', existingPrompts);
    }
    
    setShowSaveModal(false);
    alert('Prompt saved successfully!');
  };

  return (
    <div className="build-prompt-container">
      <div className="build-prompt-header">
        <input 
          type="text" 
          className="prompt-name-input" 
          placeholder="Enter Prompt Name..." 
          value={promptName}
          onChange={(e) => setPromptName(e.target.value)}
        />
        <button className="save-button" onClick={() => setShowSaveModal(true)}>Save Prompt</button>
      </div>

      <div className="build-prompt-grid">
        {/* Left Column: Workspace */}
        <div className="workspace-column">
          <div className="tab-container">
            <button 
              className={`tab-button ${activeTab === 'prompt' ? 'active' : ''}`} 
              onClick={() => setActiveTab('prompt')}
            >
              Prompt Tab
            </button>
            <button 
              className={`tab-button ${activeTab === 'variables' ? 'active' : ''}`} 
              onClick={() => setActiveTab('variables')}
            >
              Variables Tab
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'prompt' ? (
              <div className="block-editor">
                {blocks.map((block, index) => (
                  <div key={block.id} className="block-card">
                    <div className="block-card-header">
                      <input 
                        type="text" 
                        className="block-title" 
                        value={block.title}
                        onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                      />
                      <div className="block-controls">
                        <button onClick={() => moveBlock(block.id, 'up')} disabled={index === 0}>↑</button>
                        <button onClick={() => moveBlock(block.id, 'down')} disabled={index === blocks.length - 1}>↓</button>
                        <button className="delete-btn" onClick={() => deleteBlock(block.id)}>🗑️</button>
                      </div>
                    </div>
                    <textarea 
                      className="block-content" 
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                      placeholder="Write your instructions here..."
                    />
                  </div>
                ))}
                <button className="add-block-btn" onClick={addCustomBlock}>+ Add Custom Block</button>
              </div>
            ) : (
              <div className="variables-editor">
                {Object.keys(variables).length === 0 ? (
                  <div className="empty-state">No variables detected. Use {"{{ variable_name }}" in your prompt.</div>
                ) : (
                  <div className="variables-list">
                    {Object.entries(variables).map(([key, value]) => (
                      <div key={key} className="variable-row">
                        <span className="variable-key">{`{{ ${key} }}`}</span>
                        <input 
                          type="text" 
                          className="variable-value" 
                          value={value}
                          onChange={(e) => updateVariableValue(key, e.target.value)}
                          placeholder="Value..."
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="preview-column">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <button className="copy-btn" onClick={handleCopy}>{copyStatus}</button>
          </div>
          <pre className="markdown-preview">
            {compiledMarkdown()}
          </pre>
        </div>
      </div>

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="save-modal">
            <h3>Save Prompt</h3>
            <p>How would you like to save <strong>{promptName || 'this prompt'}</strong>?</p>
            <div className="modal-options">
              <button onClick={() => handleSave('overwrite')}>Modify Existing / Save New</button>
              <div className="version-option">
                <input type="text" id="version-note" placeholder="Version note (optional)" />
                <button onClick={() => handleSave('new_version', document.getElementById('version-note').value)}>Create New Version</button>
              </div>
            </div>
            <button className="close-modal" onClick={() => setShowSaveModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildPrompt;
