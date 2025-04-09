# Portuguese Learning Flashcards

A minimalistic web app to help learn Portuguese (European) vocabulary through flashcards.

## Project Overview

This app displays flashcards to help learn Portuguese vocabulary. It's designed to run unobtrusively in the background on a workstation or mobile device.

### Core Features (MVP)
- Simple flashcard system showing Portuguese verbs and their English translations
- Cards flip automatically after a set time (default: 10 seconds)
- Support for both EN-PT and PT-EN directions
- Random selection from a dictionary of common verbs
- Minimalistic interface that works well on mobile devices

### Future Enhancements
- Expanded content (phrases, different tenses, topics)
- Settings page to customize:
  - Content categories (top 10/100 verbs, past tense, questions, etc.)
  - Flip timing
  - Display preferences
- Support for more complex grammatical structures

## Technical Design

### Interface
- Top half: Word/phrase in source language
- Bottom half: Translation (hidden initially, revealed after delay)
- Minimal controls to avoid distraction
- Mobile-friendly layout

### Implementation
- HTML/CSS/JavaScript (no framework dependencies)
- Local storage for basic settings
- JSON data structure for vocabulary
