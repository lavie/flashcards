# Portuguese Learning Flashcards

A minimalistic web app to help learn Portuguese (European) vocabulary through flashcards.

## Project Overview

This app displays flashcards to help learn Portuguese vocabulary. It's designed to run unobtrusively in the background on a workstation or mobile device, showing vocabulary items at regular intervals.

## Current Implementation Status

The MVP (Minimum Viable Product) has been successfully implemented with the following features:

### Core Features (Implemented)
- Simple flashcard system showing Portuguese verbs and their English translations
- Cards flip automatically after a set time (configurable from 3-20 seconds)
- Support for both EN-PT and PT-EN directions
- Random selection from a dictionary of common verbs
- Minimalistic interface that works well on mobile devices
- Simple spinning timer animation that visualizes the countdown
- Settings panel with customizable options
- Persistent settings using localStorage
- Fullscreen mode for distraction-free learning
- Dark mode with system preference detection and manual theme selection
- Play/pause functionality with visual icon toggle
- Dynamic text resizing to accommodate longer translations

### Technical Implementation Details

#### User Interface
- **Two-part Card Layout**: 
  - Top half displays the word/phrase in source language
  - Bottom half contains the translation (hidden initially, revealed after delay)
- **Circular Timer**: 
  - Visual indicator showing time remaining before card flip
  - Implemented using CSS animations with a spinning circle and small gap
  - Features play/pause button with toggle between pause and play icons
  - Each phase (question and answer) gets equal time
- **Settings Panel**: 
  - Accessible via gear icon in top-right corner
  - Allows changing translation direction (EN→PT or PT→EN)
  - Mobile-friendly slider for customizable flip timing (3-20 seconds)
  - Theme selection (system default, light, or dark)

#### Interaction Flow
1. App displays a random verb in the selected source language
2. Circular timer begins countdown animation
3. After half the set time elapses (e.g., 5 seconds for a 10-second setting), the translation is revealed
4. Timer continues for the remaining half of the time to allow reading the answer
5. Process repeats with a new random verb
6. User can click the timer to pause/resume the countdown (icon toggles between pause/play)
7. Double-click the timer to manually advance to the next step

#### Technical Architecture
- **HTML/CSS/JavaScript**: No framework dependencies for maximum simplicity
- **CSS Animations**: Pure CSS for the timer animation using keyframes
- **Local Storage**: Persists user settings between sessions
- **Data Structure**: Simple JSON array of verb pairs
- **Responsive Design**: Mobile-friendly layout that works on various screen sizes
- **Theme System**: Dark/light mode with system preference detection using CSS variables
- **Adaptive Text**: Dynamic font sizing to ensure content fits within cards

## Future Enhancements
- Expanded content (phrases, different tenses, topics)
- Additional settings:
  - Content categories (top 10/100 verbs, past tense, questions, etc.)
  - Additional visual theme options
  - Animation speed preferences
- Support for more complex grammatical structures
- Spaced repetition algorithm for optimized learning
- Export/import of custom vocabulary lists

## Technical Design

### Implementation Details
- **HTML Structure**: Semantic markup with clear separation of components
- **CSS**: Modern CSS with animations, flexbox layout, and CSS variables for theming
- **JavaScript**: Vanilla JS with event listeners and timeout management
- **Data Management**: Vocabulary stored in a separate data.js file for easy expansion
- **Animation**: CSS-based spinning timer with counter-rotation for the play/pause icon
- **Settings**: User preferences stored in localStorage as JSON
- **Responsive Text**: Algorithm to dynamically resize text based on content length

## Deployment

This is a static web application that can be deployed on any static web hosting service:

### GitHub Pages
1. Push the code to a GitHub repository
2. Go to repository Settings > Pages
3. Select the branch to deploy (usually "main")
4. The site will be available at `https://username.github.io/repository-name`

### Netlify (Alternative)
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop the project folder
3. Get an instant deployment with a Netlify subdomain
