# Portuguese Learning Flashcards

A minimalistic web app to help learn Portuguese (European) vocabulary through flashcards.

## Project Overview

This app displays flashcards to help learn Portuguese vocabulary. It's designed to run unobtrusively in the background on a workstation or mobile device, showing vocabulary items at regular intervals.

## Current Implementation Status

The MVP (Minimum Viable Product) has been successfully implemented with the following features:

### Core Features (Implemented)
- Simple flashcard system showing Portuguese verbs and their English translations
- Cards flip automatically after a set time (default: 10 seconds)
- Support for both EN-PT and PT-EN directions
- Random selection from a dictionary of common verbs
- Minimalistic interface that works well on mobile devices
- Pure CSS circular timer animation that visualizes the countdown
- Settings panel with customizable options
- Persistent settings using localStorage

### Technical Implementation Details

#### User Interface
- **Two-part Card Layout**: 
  - Top half displays the word/phrase in source language
  - Bottom half contains the translation (hidden initially, revealed after delay)
- **Circular Timer**: 
  - Visual indicator showing time remaining before card flip
  - Implemented using pure CSS animations (no JavaScript timers for the visual effect)
  - Completes one full rotation during question phase, then another during answer phase
- **Settings Panel**: 
  - Accessible via gear icon in top-right corner
  - Allows changing translation direction (EN→PT or PT→EN)
  - Customizable flip timing (1-60 seconds)

#### Interaction Flow
1. App displays a random verb in the selected source language
2. Circular timer begins countdown animation
3. After the set time elapses, the translation is revealed
4. Timer continues for the same duration to allow reading the answer
5. Process repeats with a new random verb
6. User can click the timer to manually advance at any point

#### Technical Architecture
- **HTML/CSS/JavaScript**: No framework dependencies for maximum simplicity
- **CSS Animations**: Pure CSS for the timer animation using keyframes
- **Local Storage**: Persists user settings between sessions
- **Data Structure**: Simple JSON array of verb pairs
- **Responsive Design**: Mobile-friendly layout that works on various screen sizes

## Future Enhancements
- Expanded content (phrases, different tenses, topics)
- Additional settings:
  - Content categories (top 10/100 verbs, past tense, questions, etc.)
  - Visual theme options
  - Animation speed preferences
- Support for more complex grammatical structures
- Spaced repetition algorithm for optimized learning
- Export/import of custom vocabulary lists

## Technical Design

### Implementation Details
- **HTML Structure**: Semantic markup with clear separation of components
- **CSS**: Modern CSS with animations, flexbox layout, and CSS variables
- **JavaScript**: Vanilla JS with event listeners and timeout management
- **Data Management**: Vocabulary stored in a separate data.js file for easy expansion
- **Animation**: CSS-based circular timer using webkit keyframes and transforms
- **Settings**: User preferences stored in localStorage as JSON
