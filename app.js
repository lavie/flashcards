// DOM Elements
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const timer = document.querySelector('.timer');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const directionSelect = document.getElementById('direction');
const flipTimeInput = document.getElementById('flipTime');
const applySettingsButton = document.getElementById('applySettings');

// App State
let settings = {
    direction: 'en-pt',
    flipTime: 10
};

// Load settings from localStorage if available
if (localStorage.getItem('flashcardSettings')) {
    settings = JSON.parse(localStorage.getItem('flashcardSettings'));
    directionSelect.value = settings.direction;
    flipTimeInput.value = settings.flipTime;
}

// Timers
let flipTimer;
let nextCardTimer;
let isShowingAnswer = false;

// Timer animation is now handled by CSS

// Toggle settings panel
settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
});

// Apply settings
applySettingsButton.addEventListener('click', () => {
    settings.direction = directionSelect.value;
    settings.flipTime = parseInt(flipTimeInput.value);
    
    // Save to localStorage
    localStorage.setItem('flashcardSettings', JSON.stringify(settings));
    
    // Hide settings panel
    settingsPanel.classList.remove('active');
    
    // Update timer duration
    timer.style.setProperty('--duration', settings.flipTime);
    
    // Reset current card
    showNextCard();
});

// Helper function to start a timer and execute callback when done
function startTimer(duration, callback) {
    return setTimeout(callback, duration * 1000);
}

// Show next card
function showNextCard() {
    // Clear any existing timers
    if (flipTimer) {
        clearTimeout(flipTimer);
    }
    if (nextCardTimer) {
        clearTimeout(nextCardTimer);
    }
    
    // Reset state
    isShowingAnswer = false;
    
    // Hide the back of the card
    cardBack.classList.remove('revealed');
    
    // Get random entry from dictionary
    const randomIndex = Math.floor(Math.random() * dictionary.length);
    const entry = dictionary[randomIndex];
    
    // Set content based on direction
    if (settings.direction === 'en-pt') {
        cardFront.textContent = entry.english;
        cardBack.textContent = entry.portuguese;
    } else {
        cardFront.textContent = entry.portuguese;
        cardBack.textContent = entry.english;
    }
    
    // Update timer duration
    timer.style.setProperty('--duration', settings.flipTime);
    
    // Start the first timer (question phase)
    flipTimer = startTimer(settings.flipTime, () => {
        // Reveal the answer
        cardBack.classList.add('revealed');
        isShowingAnswer = true;
        
        // Start the second timer (answer phase)
        nextCardTimer = startTimer(settings.flipTime, () => {
            // Move to next card
            showNextCard();
        });
    });
}

// Initialize first card
showNextCard();

// Allow clicking on the timer to manually advance
document.querySelector('.timer').addEventListener('click', () => {
    if (isShowingAnswer) {
        // If answer is showing, go to next card
        showNextCard();
    } else {
        // If question is showing, reveal answer
        if (flipTimer) {
            clearTimeout(flipTimer);
        }
        cardBack.classList.add('revealed');
        isShowingAnswer = true;
        
        // Start the answer phase timer
        if (nextCardTimer) {
            clearTimeout(nextCardTimer);
        }
        nextCardTimer = startTimer(settings.flipTime, () => {
            showNextCard();
        });
    }
});
