# Development Log - Prompt Factory

## [2026-05-17] - Initial Implementation: Home Page & Onboarding

### Thought Process
- **Architecture**: Used a root `App` component to handle the global authentication state (username) via `localForage`.
- **State Management**: Simple React `useState` and `useEffect` for managing the user's session.
- **UI/UX**:
    - Implemented a dark-theme minimalist aesthetic.
    - Created an `OnboardingModal` that blocks the main UI until a username is provided, ensuring the "Welcome" experience is personalized from the start.
    - Used `localForage` for asynchronous persistence of the username in IndexedDB.
- **Styling**: Used a centralized `global.css` for theme variables and component-specific CSS files for modularity.

### Process Log
1. Set up Vite project structure and installed `localforage`.
2. Configured Global CSS with a strict black/white palette.
3. Implemented `App.jsx` logic to check for `pf_username` on mount.
4. Built `OnboardingModal` for first-time users.
5. Developed the `Home` page with the requested layout:
    - Centered welcome message.
    - Central navigation box with two placeholder buttons.
6. Added loading state to prevent UI flickering during IndexedDB read.

## [2026-05-17] - Global Header & Local Data Management

### Thought Process
- **Global Header**: Implemented a fixed header that persists across the application (once the user is onboarded). This ensures the brand and data controls are always accessible.
- **Data Portability**:
    - **Export**: Created a function to iterate through all keys in `localForage`, aggregate them into a JSON object, and trigger a browser download. This gives users full ownership of their data.
    - **Import**: Implemented a hidden file input that reads a JSON file and writes the contents back into IndexedDB. Used `window.location.reload()` to ensure the application state refreshes with the imported data.
- **Navigation**: Added a `view` state to `App.jsx` to handle simple routing, allowing the brand logo to return the user to the 'home' view.
- **Layout Adjustments**: Updated `Home.css` to ensure the central content is centered within the viewport remaining after the 60px header.

### Process Log
1. Created `GlobalHeader` component with export/import logic.
2. Integrated `GlobalHeader` into `App.jsx`, conditionally rendering it only after onboarding.
3. Implemented JSON serialization/deserialization for local data backups.
4. Adjusted `Home.css` to prevent the fixed header from overlapping the welcome message.
