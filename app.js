// DOM Elements
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const nextButton = document.getElementById('nextButton');
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

// Timer for card flipping
let flipTimer;

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

// Show next card
function showNextCard() {
    // Clear any existing timer
    if (flipTimer) {
        clearTimeout(flipTimer);
    }
    
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
    
    // Set timer to reveal the back of the card
    flipTimer = setTimeout(() => {
        cardBack.classList.add('revealed');
    }, settings.flipTime * 1000);
}

// Next button event
nextButton.addEventListener('click', showNextCard);

// Initialize first card
showNextCard();
