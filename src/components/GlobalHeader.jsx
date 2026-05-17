import React, { useRef } from 'react';
import localforage from 'localforage';
import './GlobalHeader.css';

const GlobalHeader = ({ onHomeClick }) => {
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    try {
      // Get all keys from localForage
      const keys = await localforage.keys();
      const data = {};
      
      // Fetch values for all keys
      await Promise.all(
        keys.map(async (key) => {
          const value = await localforage.getItem(key);
          data[key] = value;
        })
      );

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `prompt_factory_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        
        // Clear current data or merge? The requirement says "overwrite or hydrate". 
        // We'll merge for safety but overwrite matching keys.
        const keys = Object.keys(json);
        await Promise.all(
          keys.map(key => localforage.setItem(key, json[key]))
        );

        alert('Data imported successfully! Refreshing...');
        window.location.reload(); // Refresh to update UI state with new data
      } catch (error) {
        console.error('Import failed:', error);
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <header className="global-header">
      <div className="header-left">
        <div className="brand" onClick={onHomeClick} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && onHomeClick()}>
          <span className="logo">⚙️</span>
          <span className="app-name">Prompt Factory</span>
        </div>
      </div>
      
      <div className="header-right">
        <button className="header-btn" onClick={handleExport}>Export Data</button>
        <button className="header-btn" onClick={handleImportClick}>Import Data</button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json" 
          onChange={handleImportFile} 
        />
      </div>
    </header>
  );
};

export default GlobalHeader;
