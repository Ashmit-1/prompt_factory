import React, { useRef } from "react";
import localforage from "localforage";
import "./GlobalHeader.css";
import logoImg from "../assets/logo.png";

const GlobalHeader = ({ onHomeClick, currentView, setView }) => {
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    try {
      const keys = await localforage.keys();
      const data = {};
      await Promise.all(
        keys.map(async (key) => {
          const value = await localforage.getItem(key);
          data[key] = value;
        }),
      );

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `prompt_factory_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data.");
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
        const keys = Object.keys(json);
        await Promise.all(
          keys.map((key) => localforage.setItem(key, json[key])),
        );
        alert("Data imported successfully! Refreshing...");
        window.location.reload();
      } catch (error) {
        console.error("Import failed:", error);
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="global-header">
      <div className="header-left">
        <div
          className="brand"
          onClick={onHomeClick}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => e.key === "Enter" && onHomeClick()}
        >
          <img
            src={logoImg}
            alt="Prompt Factree Logo"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
          <span className="app-name">Prompt FacTree</span>
        </div>
      </div>

      <div className="header-center">
        <div className="nav-segmented">
          <button
            className={`nav-tab ${currentView === "home" ? "active" : ""}`}
            onClick={() => setView("home")}
          >
            Home
          </button>
          <button
            className={`nav-tab ${currentView === "build" ? "active" : ""}`}
            onClick={() => setView("build")}
          >
            Build Prompt
          </button>
          <button
            className={`nav-tab ${currentView === "library" ? "active" : ""}`}
            onClick={() => setView("library")}
          >
            Prompt Library
          </button>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" onClick={handleExport}>
          Export Data
        </button>
        <button className="header-btn" onClick={handleImportClick}>
          Import Data
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".json"
          onChange={handleImportFile}
        />
      </div>
    </header>
  );
};

export default GlobalHeader;
