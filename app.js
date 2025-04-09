// DOM Elements
const cardFront = document.getElementById('cardFront');
const cardBack = document.getElementById('cardBack');
const timer = document.querySelector('.timer');
const settingsToggle = document.getElementById('settingsToggle');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const settingsPanel = document.getElementById('settingsPanel');
const directionSelect = document.getElementById('direction');
const flipTimeInput = document.getElementById('flipTime');
const flipTimeValue = document.getElementById('flipTimeValue');
const themeSelect = document.getElementById('theme');
const contentTypeCheckboxes = document.querySelectorAll('input[name="contentType"]');
const applySettingsButton = document.getElementById('applySettings');

// App State
let settings = {
    direction: 'en-pt',
    flipTime: 10,
    theme: 'system',
    contentTypes: ['infinitive']
};

// Timer state
let isPaused = false;

// Load settings from localStorage if available
if (localStorage.getItem('flashcardSettings')) {
    settings = JSON.parse(localStorage.getItem('flashcardSettings'));
    directionSelect.value = settings.direction;
    flipTimeInput.value = settings.flipTime;
    flipTimeValue.textContent = settings.flipTime;
    
    // Set theme or default to 'system' if not previously set
    settings.theme = settings.theme || 'system';
    themeSelect.value = settings.theme;
    
    // Set content types or default if not previously set
    settings.contentTypes = settings.contentTypes || ['infinitive'];
    
    // Update checkboxes based on settings
    contentTypeCheckboxes.forEach(checkbox => {
        checkbox.checked = settings.contentTypes.includes(checkbox.value);
    });
    
}

// Apply theme based on settings
applyTheme(settings.theme);

// Function to apply theme
function applyTheme(theme) {
    if (theme === 'system') {
        document.documentElement.classList.remove('dark-theme', 'light-theme');
        document.documentElement.classList.add('system-theme');
    } else if (theme === 'dark') {
        document.documentElement.classList.remove('system-theme', 'light-theme');
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('system-theme', 'dark-theme');
        document.documentElement.classList.add('light-theme');
    }
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

// Update flip time display when slider changes
flipTimeInput.addEventListener('input', () => {
    flipTimeValue.textContent = flipTimeInput.value;
});

// Apply settings
applySettingsButton.addEventListener('click', () => {
    settings.direction = directionSelect.value;
    settings.flipTime = parseInt(flipTimeInput.value);
    settings.theme = themeSelect.value;
    
    // Get selected content types from checkboxes
    settings.contentTypes = [];
    contentTypeCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            settings.contentTypes.push(checkbox.value);
        }
    });
    
    // If no content types are selected, default to infinitive
    if (settings.contentTypes.length === 0) {
        settings.contentTypes = ['infinitive'];
        document.getElementById('infinitiveCheck').checked = true;
    }
    
    
    // Apply theme
    applyTheme(settings.theme);
    
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

// Function to resize text to fit container
function resizeText(element) {
    const maxFontSize = 96; // Starting font size
    const minFontSize = 24; // Minimum font size
    const container = element;
    const content = element.textContent;
    
    // Reset font size to maximum
    container.style.fontSize = maxFontSize + 'px';
    
    // Check if content overflows
    while (
        (container.scrollHeight > container.clientHeight || 
         container.scrollWidth > container.clientWidth) && 
        parseInt(window.getComputedStyle(container).fontSize) > minFontSize
    ) {
        // Reduce font size by 2px until it fits
        const currentSize = parseInt(window.getComputedStyle(container).fontSize);
        container.style.fontSize = (currentSize - 2) + 'px';
    }
}

// Helper function to format English prompts for conjugated verbs
function formatEnglishPrompt(infinitive, tense, person) {
    // Remove "to " from the beginning of the English infinitive
    const baseVerb = infinitive.startsWith('to ') ? infinitive.substring(3) : infinitive;
    
    // Handle multiple translations (e.g., "to think, to find")
    const firstVerb = baseVerb.split(',')[0].trim();
    
    // Map Portuguese person to English pronoun
    const pronounMap = {
        'eu': 'I',
        'tu': 'you',
        'ele_ela_você': ['he', 'she', 'you'],
        'nós': 'we',
        'eles_elas_vocês': ['they', 'you all']
    };
    
    // Get a random pronoun if there are multiple options
    let pronoun = pronounMap[person] || person;
    if (Array.isArray(pronoun)) {
        pronoun = pronoun[Math.floor(Math.random() * pronoun.length)];
    }
    
    // Format based on tense
    switch(tense) {
        case 'present':
            if (person === 'eu') {
                return `${pronoun} ${firstVerb}`;
            } else if (person === 'ele_ela_você') {
                return `${pronoun} ${firstVerb}s`;
            } else {
                return `${pronoun} ${firstVerb}`;
            }
        case 'preterite':
            // Check for irregular past tense
            const irregularPast = getIrregularEnglishPastForm(firstVerb);
            if (irregularPast) {
                return `${pronoun} ${irregularPast}`;
            }
            
            // Regular past tense in English
            if (firstVerb.endsWith('e')) {
                return `${pronoun} ${firstVerb}d`;
            } else {
                return `${pronoun} ${firstVerb}ed`;
            }
        case 'future':
            return `${pronoun} will ${firstVerb}`;
        default:
            return `${pronoun} ${firstVerb}`;
    }
}

// Function to handle irregular English past tense verbs
function getIrregularEnglishPastForm(verb) {
    const irregularVerbs = {
        'be': 'was/were',
        'go': 'went',
        'do': 'did',
        'have': 'had',
        'say': 'said',
        'make': 'made',
        'know': 'knew',
        'take': 'took',
        'see': 'saw',
        'come': 'came',
        'think': 'thought',
        'find': 'found',
        'give': 'gave',
        'tell': 'told',
        'get': 'got',
        'put': 'put',
        'leave': 'left',
        'feel': 'felt'
    };
    
    return irregularVerbs[verb] || null;
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
    
    // Determine which content type to show
    let selectedContentType;
    if (settings.contentTypes.length === 1) {
        // If only one content type is selected, use that
        selectedContentType = settings.contentTypes[0];
    } else {
        // If multiple content types are selected, choose one randomly
        selectedContentType = settings.contentTypes[Math.floor(Math.random() * settings.contentTypes.length)];
    }
    
    let frontText, backText;
    
    if (selectedContentType === 'infinitive') {
        // Handle infinitive form (original behavior)
        if (settings.direction === 'random') {
            // Randomly choose direction for this card
            const randomDirection = Math.random() < 0.5 ? 'en-pt' : 'pt-en';
            if (randomDirection === 'en-pt') {
                frontText = entry.en;
                backText = entry.pt;
            } else {
                frontText = entry.pt;
                backText = entry.en;
            }
        } else if (settings.direction === 'en-pt') {
            frontText = entry.en;
            backText = entry.pt;
        } else {
            frontText = entry.pt;
            backText = entry.en;
        }
    } else {
        // Handle conjugated forms
        const tense = selectedContentType; // 'present', 'preterite', or 'future'
        
        // Get conjugations for this verb
        const verbConjugations = getConjugations(entry.pt);
        if (!verbConjugations || !verbConjugations[tense]) {
            // Skip this verb and try another one
            showNextCard();
            return;
        }
        
        // Choose a random person
        const persons = Object.keys(verbConjugations[tense]);
        const randomPerson = persons[Math.floor(Math.random() * persons.length)];
        
        // Get the conjugated form
        const conjugatedForm = verbConjugations[tense][randomPerson];
        
        // Format the Portuguese person display
        let displayPerson = randomPerson;
        if (randomPerson === 'ele_ela_você') {
            const options = ['ele', 'ela', 'você'];
            displayPerson = options[Math.floor(Math.random() * options.length)];
        } else if (randomPerson === 'eles_elas_vocês') {
            const options = ['eles', 'elas', 'vocês'];
            displayPerson = options[Math.floor(Math.random() * options.length)];
        }
        
        // Format the display text
        if (settings.direction === 'random') {
            // Randomly choose direction for this card
            const randomDirection = Math.random() < 0.5 ? 'en-pt' : 'pt-en';
            if (randomDirection === 'en-pt') {
                frontText = formatEnglishPrompt(entry.en, tense, randomPerson);
                backText = `${displayPerson} ${conjugatedForm}`;
            } else {
                frontText = `${displayPerson} ${conjugatedForm}`;
                backText = formatEnglishPrompt(entry.en, tense, randomPerson);
            }
        } else if (settings.direction === 'en-pt') {
            frontText = formatEnglishPrompt(entry.en, tense, randomPerson);
            backText = `${displayPerson} ${conjugatedForm}`;
        } else {
            frontText = `${displayPerson} ${conjugatedForm}`;
            backText = formatEnglishPrompt(entry.en, tense, randomPerson);
        }
    }
    
    cardFront.textContent = frontText;
    cardBack.textContent = backText;
    
    // Resize text to fit container
    resizeText(cardFront);
    
    // Update timer duration - use half the time for each phase
    timer.style.setProperty('--duration', settings.flipTime / 2);
    
    // If we were paused, stay paused
    if (isPaused) {
        document.querySelector('.timer').classList.add('paused');
        return;
    }
    
    // Start the first timer (question phase) - 5 seconds
    flipTimer = startTimer(settings.flipTime / 2, () => {
        // Reveal the answer
        cardBack.classList.add('revealed');
        isShowingAnswer = true;
        
        // Resize the answer text
        resizeText(cardBack);
        
        // Start the second timer (answer phase) - 5 seconds
        nextCardTimer = startTimer(settings.flipTime / 2, () => {
            // Move to next card
            showNextCard();
        });
    });
}

// Initialize first card
showNextCard();

// Fullscreen functionality
fullscreenToggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
            document.documentElement.msRequestFullscreen();
        }
        fullscreenToggle.textContent = '⛶';
        fullscreenToggle.classList.add('active');
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        fullscreenToggle.textContent = '⛶';
        fullscreenToggle.classList.remove('active');
    }
});

// Update fullscreen button when fullscreen state changes
document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange', updateFullscreenButton);
document.addEventListener('MSFullscreenChange', updateFullscreenButton);

function updateFullscreenButton() {
    if (document.fullscreenElement) {
        fullscreenToggle.textContent = '⛶';
        fullscreenToggle.classList.add('active');
    } else {
        fullscreenToggle.textContent = '⛶';
        fullscreenToggle.classList.remove('active');
    }
}

// Allow clicking on the timer to toggle pause or advance
document.querySelector('.timer').addEventListener('click', () => {
    togglePause();
});

// Function to toggle pause state
function togglePause() {
    isPaused = !isPaused;
    const timerElement = document.querySelector('.timer');
    
    if (isPaused) {
        // Pause timers
        timerElement.classList.add('paused');
        if (flipTimer) {
            clearTimeout(flipTimer);
            flipTimer = null;
        }
        if (nextCardTimer) {
            clearTimeout(nextCardTimer);
            nextCardTimer = null;
        }
    } else {
        // Resume timers
        timerElement.classList.remove('paused');
        
        // Calculate remaining time based on animation progress
        const computedStyle = window.getComputedStyle(timerElement);
        const animationName = computedStyle.getPropertyValue('animation-name');
        const animationDuration = parseFloat(computedStyle.getPropertyValue('animation-duration'));
        const animationDelay = parseFloat(computedStyle.getPropertyValue('animation-delay'));
        
        // Restart appropriate timer based on current state
        if (isShowingAnswer) {
            nextCardTimer = startTimer(settings.flipTime / 2, () => {
                showNextCard();
            });
        } else {
            flipTimer = startTimer(settings.flipTime / 2, () => {
                cardBack.classList.add('revealed');
                isShowingAnswer = true;
                
                nextCardTimer = startTimer(settings.flipTime / 2, () => {
                    showNextCard();
                });
            });
        }
    }
}

// Double-click to advance card
document.querySelector('.timer').addEventListener('dblclick', () => {
    if (isPaused) {
        // If paused, just unpause first
        togglePause();
    }
    
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
        
        // Resize the answer text
        resizeText(cardBack);
        
        // Start the answer phase timer - 5 seconds
        if (nextCardTimer) {
            clearTimeout(nextCardTimer);
        }
        nextCardTimer = startTimer(settings.flipTime / 2, () => {
            showNextCard();
        });
    }
});
