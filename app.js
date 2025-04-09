// DOM Elements
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const timerProgress = document.getElementById('timerProgress');
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

// Timer animation
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 16; // 2πr where r=16 (from SVG)
timerProgress.style.strokeDasharray = TIMER_CIRCUMFERENCE;
timerProgress.style.strokeDashoffset = TIMER_CIRCUMFERENCE;

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
    
    // Reset current card
    showNextCard();
});

// Start timer animation
function startTimerAnimation(duration, callback) {
    // Reset timer state
    let startTime = null;
    const totalTime = duration * 1000;
    
    // Reset the circle
    timerProgress.style.transition = 'none';
    timerProgress.style.strokeDashoffset = TIMER_CIRCUMFERENCE;
    
    // Force reflow to make sure the transition is reset
    void timerProgress.offsetWidth;
    
    // Start the animation
    timerProgress.style.transition = `stroke-dashoffset ${totalTime}ms linear`;
    timerProgress.style.strokeDashoffset = 0;
    
    return setTimeout(callback, totalTime);
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
    
    // Start the first timer animation (question phase)
    flipTimer = startTimerAnimation(settings.flipTime, () => {
        // Reveal the answer
        cardBack.classList.add('revealed');
        isShowingAnswer = true;
        
        // Start the second timer animation (answer phase)
        nextCardTimer = startTimerAnimation(settings.flipTime, () => {
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
        nextCardTimer = startTimerAnimation(settings.flipTime, () => {
            showNextCard();
        });
    }
});
