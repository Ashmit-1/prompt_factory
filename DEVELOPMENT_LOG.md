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
- [x] Prompt Library Implementation (Current Task)

## [2026-05-19] - Fix: Onboarding Modal Styling

### Issue
The onboarding modal had styling issues after recent CSS changes:
1. The instructional text ("Enter a nickname to get started") appeared too dim.
2. The input field lacked a visible border.
3. Typed text was not visible due to insufficient contrast.

### Fix
Updated src/components/OnboardingModal.css with:
- Increased paragraph color to #ccc for better readability
- Changed input border to #555 in normal state (more visible on dark background)
- Added placeholder styling (#777) for visibility
- Maintained white text color on input for user-typed content
- Preserved focus state with white border for clear interaction feedback

### Result
The modal now properly matches the application's minimalist black-and-white theme while ensuring all elements are clearly visible and usable.

## [2026-05-17] - Fix: Onboarding Modal Input Text Visibility

### Issue
After the previous styling fix, the text entered by the user in the onboarding modal input field was still not visible enough due to the background being too dark.

### Fix
Updated `src/components/OnboardingModal.css` to give the input field a slightly lighter background color (`#2a2a2a`) while keeping the text white. This improves contrast without breaking the dark theme.

- Changed input background from `transparent` to `#2a2a2a`
- Kept text color as `var(--text-color)` (white)
- Kept border color as `#555` for visibility
- Preserved placeholder and focus styles

### Result
The user's entered text is now clearly visible in the onboarding modal input field.

## [2026-05-17] - Fix: Onboarding Modal Typography & Contrast

### Issue
User reported that the instructional text was too small and the typed text color was appearing as black instead of white, making it blend into the background.

### Fix
Updated `src/components/OnboardingModal.css`:
- **Instructional Text**: Increased `font-size` from `1rem` to `1.2rem` for the "Enter a nickname to get started" prompt.
- **Input Text Color**: Explicitly set the input text color to `#ffffff !important` to override any unexpected browser defaults or inherited styles causing the text to appear black.
- **Input Font Size**: Slightly increased the input text size to `1.1rem` for better readability.

### Result
Improved legibility of the onboarding instructions and ensured a high-contrast, white-text-on-dark-background experience for the username input.
