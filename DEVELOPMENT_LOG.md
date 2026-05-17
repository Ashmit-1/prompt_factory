# Prompt Factory - Development Log

## Architecture Decisions

### View Management
Currently using a simple state-based routing (`view` state in `App.jsx`) to manage transitions between the Home Page and the Build Prompt Page. Given the local-first nature and minimalist scope, this avoids the overhead of a full routing library while keeping state transitions snappy.

### State Management for Build Prompt
- **Blocks**: Managed as an array of objects `[{ id, title, content }]`. This allows for easy reordering, deletion, and mapping to the Markdown preview.
- **Variables**: Managed as a key-value map `{ [variableName]: value }`. 
- **Parsing**: Variable extraction is triggered specifically when switching to the Variables tab to ensure the UI remains performant during heavy typing in the Prompt tab.

### Storage Strategy
Utilizing `localForage` (IndexedDB) for persisting prompts. Each prompt is stored as a structured object containing its metadata (name, version) and its structural blocks. Versioning is handled by cloning the object and incrementing a version counter.

---

## Process Log

- **2026-05-17**: Initialized session to build the "Build Prompt Page".
- **2026-05-17**: Planned component architecture: `BuildPrompt` page with `BlockEditor` and `LivePreview` sub-components.
- **2026-05-17**: Implemented basic routing in `App.jsx` to allow navigation from `Home` to `BuildPrompt`.
