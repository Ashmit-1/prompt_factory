# Prompt Factory - Development Log

## Project Overview
A local-first, serverless prompt engineering workspace.

## Architectural Decisions
- **Storage**: Using `localForage` for asynchronous IndexedDB interaction to ensure large prompt libraries don't block the main UI thread.
- **Theming**: Premium Dark Brutalist. Pure black (`#000000`), white text, and off-white borders (`rgba(255, 255, 255, 0.2)`).
- **State Management**: Lifting state to `App.jsx` for basic routing between Home, Build, and Library.

## Implementation Log
- [x] Core Infrastructure & Onboarding
- [x] Global Header & Navigation
- [x] Build Prompt Workspace (Dynamic Blocks & Variable Parsing)
- [ ] Prompt Library Implementation (Current Task)
