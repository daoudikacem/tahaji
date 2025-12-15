// Arabic Letters (without diacritics)
const arabicLetters = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
    'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
    'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
    'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

// Diacritics (Harakat)
const diacritics = [
    { symbol: 'َ', name: 'فتحة' },
    { symbol: 'ُ', name: 'ضمة' },
    { symbol: 'ِ', name: 'كسرة' },
    { symbol: 'ًا', name: 'تنوين بالفتح' },  // Tanween fathah with alif but without kashida
    { symbol: 'ٌ', name: 'تنوين بالضم' },    // Tanween dummah without shaddah
    { symbol: 'ٍ', name: 'تنوين بالكسر' },   // Tanween kasrah without shaddah
    { symbol: 'ْ', name: 'سكون' },
    { symbol: 'ّ', name: 'شدة' },
    { symbol: 'ا', name: 'مد بالالف' },      // Madd with Alif
    { symbol: 'و', name: 'مد بالواو' },      // Madd with Waw
    { symbol: 'ي', name: 'مد بالياء' }       // Madd with Ya
];

// Selected items
let selectedLetters = [];
let selectedDiacritics = [];

// Button elements
let previewBtn, generateBtn, resetBtn, selectAllLettersBtn, selectAllDiacriticsBtn;
let deselectAllLettersBtn, deselectAllDiacriticsBtn; // Added deselect buttons
let section1Rows, section2Rows, section3Rows, section1Card, section2Card, section3Card;
let previewContainer, lettersContainer, diacriticsContainer;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Get all DOM elements
    previewContainer = document.getElementById('preview-container');
    lettersContainer = document.getElementById('letters-container');
    diacriticsContainer = document.getElementById('diacritics-container');
    
    // Button elements
    previewBtn = document.getElementById('preview-btn');
    generateBtn = document.getElementById('generate-btn');
    resetBtn = document.getElementById('reset-btn');
    selectAllLettersBtn = document.getElementById('select-all-letters');
    selectAllDiacriticsBtn = document.getElementById('select-all-diacritics');
    deselectAllLettersBtn = document.getElementById('deselect-all-letters'); // Added
    deselectAllDiacriticsBtn = document.getElementById('deselect-all-diacritics'); // Added
        
    // Customization elements
    section1Rows = document.getElementById('section1-rows');
    section2Rows = document.getElementById('section2-rows');
    section3Rows = document.getElementById('section3-rows');
    section1Card = document.getElementById('section1-card');
    section2Card = document.getElementById('section2-card');
    section3Card = document.getElementById('section3-card');
    
    // Debug log to check if elements are found
    console.log('DOM Elements loaded:');
    console.log('previewBtn:', previewBtn);
    console.log('generateBtn:', generateBtn);
    console.log('resetBtn:', resetBtn);
    console.log('selectAllLettersBtn:', selectAllLettersBtn);
    console.log('selectAllDiacriticsBtn:', selectAllDiacriticsBtn);
    console.log('deselectAllLettersBtn:', deselectAllLettersBtn); // Added
    console.log('deselectAllDiacriticsBtn:', deselectAllDiacriticsBtn); // Added
    console.log('addWordBtn:', document.getElementById('add-word-btn'));
    
    // Populate containers
    populateLetters();
    populateDiacritics();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize customization settings
    initializeCustomizationSettings();
    
    // Add event listeners for customization checkboxes
    setupCustomizationEventListeners();
    
    // Add event listener for the new start learning button
    const startLearningBtn = document.getElementById('start-learning-btn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', function() {
            // Scroll to the main content
            document.querySelector('.main-content').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
});

// Render Arabic letters
function populateLetters() {
    if (!lettersContainer) return;
    
    lettersContainer.innerHTML = '';
    arabicLetters.forEach(letter => {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBox.textContent = letter;
        letterBox.dataset.letter = letter;
        letterBox.addEventListener('click', () => toggleLetterSelection(letter));
        lettersContainer.appendChild(letterBox);
    });
}

// Render diacritics
function populateDiacritics() {
    if (!diacriticsContainer) return;
    
    diacriticsContainer.innerHTML = '';
    diacritics.forEach(diacritic => {
        const diacriticBox = document.createElement('div');
        diacriticBox.className = 'diacritic-box';
        diacriticBox.textContent = diacritic.symbol;
        diacriticBox.title = diacritic.name;
        diacriticBox.dataset.diacritic = diacritic.symbol;
        diacriticBox.addEventListener('click', () => toggleDiacriticSelection(diacritic.symbol));
        diacriticsContainer.appendChild(diacriticBox);
    });
}

// Toggle letter selection
function toggleLetterSelection(letter) {
    const index = selectedLetters.indexOf(letter);
    const letterBox = document.querySelector(`.letter-box[data-letter="${letter}"]`);
    
    if (index === -1) {
        // Select the letter
        selectedLetters.push(letter);
        if (letterBox) letterBox.classList.add('selected');
    } else {
        // Deselect the letter
        selectedLetters.splice(index, 1);
        if (letterBox) letterBox.classList.remove('selected');
    }
    
    // Update the selected letters display
    updateSelectedLettersDisplay();
}

// Toggle diacritic selection
function toggleDiacriticSelection(diacritic) {
    const index = selectedDiacritics.indexOf(diacritic);
    const diacriticBox = document.querySelector(`.diacritic-box[data-diacritic="${diacritic}"]`);
    
    if (index === -1) {
        // Select the diacritic
        selectedDiacritics.push(diacritic);
        if (diacriticBox) diacriticBox.classList.add('selected');
    } else {
        // Deselect the diacritic
        selectedDiacritics.splice(index, 1);
        if (diacriticBox) diacriticBox.classList.remove('selected');
    }
}

// Update the selected letters display
function updateSelectedLettersDisplay() {
    const displayElement = document.getElementById('selected-letters-banner');
    
    if (displayElement) {
        if (selectedLetters.length > 0) {
            // Create the display text
            let displayText = '';
            selectedLetters.forEach(letter => {
                displayText += letter + ' ';
            });
            
            displayElement.textContent = displayText.trim();
        } else {
            // Show the "no selected letters" message
            displayElement.textContent = 'لم يتم اختيار أي حروف بعد';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Main control buttons
    if (previewBtn) {
        previewBtn.addEventListener('click', createPreview);
    }
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePDFOnly);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSelection);
    }
    
    // Select all letters button event listener
    if (selectAllLettersBtn) {
        selectAllLettersBtn.addEventListener('click', selectAllLetters);
    }
    
    // Deselect all letters button event listener
    if (deselectAllLettersBtn) {
        deselectAllLettersBtn.addEventListener('click', deselectAllLetters);
    }
    
    // Select all diacritics button event listener
    if (selectAllDiacriticsBtn) {
        selectAllDiacriticsBtn.addEventListener('click', selectAllDiacritics);
    }
    
    // Deselect all diacritics button event listener
    if (deselectAllDiacriticsBtn) {
        deselectAllDiacriticsBtn.addEventListener('click', deselectAllDiacritics);
    }
    
    // Add word button event listener
    const addWordBtn = document.getElementById('add-word-btn');
    if (addWordBtn) {
        addWordBtn.addEventListener('click', openAddWordModal);
        console.log('Add word button event listener added');
    } else {
        console.log('Add word button not found');
    }
    
    // Save single word button event listener
    const saveSingleWordBtn = document.getElementById('save-single-word-btn');
    if (saveSingleWordBtn) {
        saveSingleWordBtn.addEventListener('click', saveSingleWord);
    }
    
    // Upload JSON button event listener
    const uploadJsonBtn = document.getElementById('upload-json-btn');
    if (uploadJsonBtn) {
        uploadJsonBtn.addEventListener('click', uploadJsonWords);
    }
    
    // Close modal event listener
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAddWordModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('add-word-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeAddWordModal();
            }
        });
    }
}

// Open add word modal
function openAddWordModal() {
    console.log('Opening add word modal');
    const modal = document.getElementById('add-word-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close add word modal
function closeAddWordModal() {
    const modal = document.getElementById('add-word-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Clear status message
    const statusDiv = document.getElementById('upload-status');
    if (statusDiv) {
        statusDiv.style.display = 'none';
    }
}

// Save single word to JSON file
function saveSingleWord() {
    const newWordInput = document.getElementById('new-word-input');
    const newWord = newWordInput ? newWordInput.value.trim() : '';
    
    if (!newWord) {
        showUploadStatus('يرجى إدخال كلمة جديدة', 'error');
        return;
    }
    
    // Check if the input contains commas (multiple words)
    if (newWord.includes('،') || newWord.includes(',')) {
        // Split by Arabic comma or English comma and trim whitespace
        const words = newWord.split(/[,،]/).map(word => word.trim()).filter(word => word.length > 0);
        
        // Validate that all words contain Arabic characters
        const arabicRegex = /[\u0600-\u06FF]/;
        const invalidWords = words.filter(word => !arabicRegex.test(word));
        
        if (invalidWords.length > 0) {
            showUploadStatus('بعض الكلمات لا تحتوي على أحرف عربية: ' + invalidWords.join(', '), 'error');
            return;
        }
        
        // Validate that all words are properly diacritized
        const improperlyDiacritizedWords = words.filter(word => !isProperlyDiacritized(word));
        
        if (improperlyDiacritizedWords.length > 0) {
            showUploadStatus('الكلمات التالية ليست مشكولة تشكيلاً كاملاً: ' + improperlyDiacritizedWords.join(', '), 'error');
            return;
        }
        
        // Send all words to the server
        fetch('/api/words/bulk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ words: words })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showUploadStatus(`تمت إضافة ${data.addedCount} كلمة جديدة من أصل ${data.totalCount}`, 'success');
                if (newWordInput) newWordInput.value = '';
            } else {
                showUploadStatus(`حدث خطأ: ${data.message || data.error}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error saving words:', error);
            // More detailed error handling
            if (error instanceof TypeError && error.message.includes('fetch')) {
                showUploadStatus('فشل الاتصال بالخادم. يرجى التأكد من أن الخادم قيد التشغيل.', 'error');
            } else {
                showUploadStatus('حدث خطأ أثناء حفظ الكلمات: ' + error.message, 'error');
            }
        });
    } else {
        // Single word handling
        // Validate that the word contains Arabic characters
        const arabicRegex = /[\u0600-\u06FF]/;
        if (!arabicRegex.test(newWord)) {
            showUploadStatus('يجب أن تحتوي الكلمة على أحرف عربية', 'error');
            return;
        }
        
        // Validate that the word is properly diacritized
        if (!isProperlyDiacritized(newWord)) {
            showUploadStatus('الكلمة ليست مشكولة تشكيلاً كاملاً. يرجى إضافة التشكيل الكامل للكلمة.', 'error');
            return;
        }
        
        // Log the request for debugging
        console.log('Sending request to add word:', newWord);
        
        // Send the new word to the server
        fetch('/api/words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: newWord })
        })
        .then(response => {
            console.log('Response received:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success response:', data);
            if (data.success) {
                showUploadStatus(`تمت إضافة الكلمة: ${newWord}`, 'success');
                if (newWordInput) newWordInput.value = '';
            } else {
                showUploadStatus(`حدث خطأ: ${data.message || data.error}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error saving word:', error);
            // More detailed error handling
            if (error instanceof TypeError && error.message.includes('fetch')) {
                showUploadStatus('فشل الاتصال بالخادم. يرجى التأكد من أن الخادم قيد التشغيل.', 'error');
            } else {
                showUploadStatus('حدث خطأ أثناء حفظ الكلمة: ' + error.message, 'error');
            }
        });
    }
}

// Check if a word is properly diacritized (every letter must have a diacritic except madd letters)
function isProperlyDiacritized(word) {
    // If the word is empty, it's not valid
    if (!word || word.trim() === '') {
        return false;
    }
    
    // Define Arabic diacritics and madd letters
    const diacritics = ['َ', 'ُ', 'ِ', 'ً', 'ٌ', 'ٍ', 'ْ', 'ّ'];
    const maddLetters = ['ا', 'و', 'ي', 'ى', 'آ'];
    const tanween = ['ً', 'ٌ', 'ٍ'];
    
    // Check if word contains Arabic letters
    const arabicRegex = /[\u0600-\u06FF]/;
    if (!arabicRegex.test(word)) {
        return false;
    }
    
    // Extract letters from the word (this includes madd letters as letters)
    const letters = extractLettersFromWord(word);
    
    // If no letters, it's not a valid word
    if (letters.length === 0) {
        return false;
    }
    
    // Check if word has tanween
    let hasTanween = false;
    for (let i = 0; i < word.length; i++) {
        if (tanween.includes(word[i])) {
            hasTanween = true;
            break;
        }
    }
    
    // If word has tanween, the last letter doesn't need a separate diacritic
    let lettersToCheck = letters.length;
    if (hasTanween) {
        lettersToCheck = letters.length - 1;
    }
    
    // Identify the positions of all letters in the word
    let letterPositions = []; // Store positions of actual letters in the word
    
    // First, identify the positions of all letters in the word
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        // If this is a letter (not a diacritic)
        if (arabicRegex.test(char) && 
            char !== 'ً' && char !== 'ٌ' && char !== 'ٍ' && 
            char !== 'َ' && char !== 'ُ' && char !== 'ِ' && 
            char !== 'ْ' && char !== 'ّ') {
            letterPositions.push(i);
        }
    }
    
    // If no letters found, it's not valid
    if (letterPositions.length === 0) {
        return false;
    }
    
    // Check each letter to see if it has a diacritic
    for (let i = 0; i < letterPositions.length && i < lettersToCheck; i++) {
        const letterPos = letterPositions[i];
        const letter = word[letterPos];
        
        // Special case: if this is a madd letter, it doesn't need a diacritic
        if (maddLetters.includes(letter)) {
            continue;
        }
        
        // Check if this letter has a diacritic
        let hasDiacritic = false;
        let nextIndex = letterPos + 1;
        
        // Look ahead for diacritics associated with this letter
        while (nextIndex < word.length) {
            const nextChar = word[nextIndex];
            
            // If we find a diacritic
            if (diacritics.includes(nextChar)) {
                hasDiacritic = true;
                break;
            }
            
            // If we find another letter, stop looking
            if (arabicRegex.test(nextChar) && 
                nextChar !== 'ً' && nextChar !== 'ٌ' && nextChar !== 'ٍ' && 
                nextChar !== 'َ' && nextChar !== 'ُ' && nextChar !== 'ِ' && 
                nextChar !== 'ْ' && nextChar !== 'ّ') {
                break;
            }
            
            nextIndex++;
        }
        
        // If this letter doesn't have a diacritic, the word is not properly diacritized
        if (!hasDiacritic) {
            return false;
        }
    }
    
    // Word is properly diacritized if we got here
    return true;
}

// Upload words from JSON file
function uploadJsonWords() {
    const fileInput = document.getElementById('json-file-input');
    const file = fileInput ? fileInput.files[0] : null;
    
    if (!file) {
        showJsonUploadStatus('يرجى اختيار ملف JSON', 'error');
        return;
    }
    
    // Check file type
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        showJsonUploadStatus('يجب أن يكون الملف من نوع JSON', 'error');
        return;
    }
    
    // Read the file
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Validate JSON structure
            if (!jsonData.words || !Array.isArray(jsonData.words)) {
                showJsonUploadStatus('تنسيق الملف غير صحيح. يجب أن يحتوي على مفتاح "words" كمصفوفة', 'error');
                return;
            }
            
            // Validate that all entries are strings
            if (!jsonData.words.every(word => typeof word === 'string')) {
                showJsonUploadStatus('جميع العناصر في المصفوفة يجب أن تكون نصوصًا', 'error');
                return;
            }
            
            // Send the words to the server
            fetch('/api/words/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ words: jsonData.words })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showJsonUploadStatus(`تمت إضافة ${data.addedCount} كلمة جديدة من أصل ${data.totalCount}`, 'success');
                    if (fileInput) fileInput.value = '';
                } else {
                    showJsonUploadStatus(`حدث خطأ: ${data.message || data.error}`, 'error');
                }
            })
            .catch(error => {
                console.error('Error uploading words:', error);
                // More detailed error handling
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    showJsonUploadStatus('فشل الاتصال بالخادم. يرجى التأكد من أن الخادم قيد التشغيل.', 'error');
                } else {
                    showJsonUploadStatus('حدث خطأ أثناء رفع الكلمات: ' + error.message, 'error');
                }
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            showJsonUploadStatus('خطأ في تحليل ملف JSON: ' + error.message, 'error');
        }
    };
    
    reader.onerror = function() {
        showJsonUploadStatus('حدث خطأ أثناء قراءة الملف', 'error');
    };
    
    reader.readAsText(file);
}

// Show upload status message
function showUploadStatus(message, type) {
    const statusDiv = document.getElementById('upload-status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = 'upload-status ' + (type === 'success' ? 'upload-success' : 'upload-error');
        statusDiv.style.display = 'block';
        
        // Hide the message after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// Show JSON upload status message
function showJsonUploadStatus(message, type) {
    const statusDiv = document.getElementById('upload-status-json');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = 'upload-status ' + (type === 'success' ? 'upload-success' : 'upload-error');
        statusDiv.style.display = 'block';
        
        // Hide the message after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// Select all letters
function selectAllLetters() {
    // Add all letters to selectedLetters array if not already selected
    arabicLetters.forEach(letter => {
        if (!selectedLetters.includes(letter)) {
            selectedLetters.push(letter);
        }
    });
    
    // Add selected class to all letter boxes
    document.querySelectorAll('.letter-box').forEach(box => {
        box.classList.add('selected');
    });
    
    // Update the selected letters display
    updateSelectedLettersDisplay();
}

// Deselect all letters
function deselectAllLetters() {
    // Clear the selectedLetters array
    selectedLetters = [];
    
    // Remove selected class from all letter boxes
    document.querySelectorAll('.letter-box').forEach(box => {
        box.classList.remove('selected');
    });
    
    // Update the selected letters display
    updateSelectedLettersDisplay();
}

// Select all diacritics
function selectAllDiacritics() {
    // Add all diacritics to selectedDiacritics array if not already selected
    diacritics.forEach(diacritic => {
        if (!selectedDiacritics.includes(diacritic.symbol)) {
            selectedDiacritics.push(diacritic.symbol);
        }
    });
    
    // Add selected class to all diacritic boxes
    document.querySelectorAll('.diacritic-box').forEach(box => {
        box.classList.add('selected');
    });
}

// Deselect all diacritics
function deselectAllDiacritics() {
    // Clear the selectedDiacritics array
    selectedDiacritics = [];
    
    // Remove selected class from all diacritic boxes
    document.querySelectorAll('.diacritic-box').forEach(box => {
        box.classList.remove('selected');
    });
}

// Reset selections
function resetSelection() {
    selectedLetters = [];
    selectedDiacritics = [];
    
    // Remove selected class from all boxes
    document.querySelectorAll('.letter-box, .diacritic-box').forEach(box => {
        box.classList.remove('selected');
    });
    
    // Clear preview
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }
    
    // Update the selected letters display
    updateSelectedLettersDisplay();
    
    // Reset customization settings to defaults
    if (section1Card) {
        section1Card.classList.remove('unselected');
        section1Card.classList.add('selected');
        // Add animation effect
        section1Card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            section1Card.style.transform = '';
        }, 300);
    }
    if (section2Card) {
        section2Card.classList.remove('unselected');
        section2Card.classList.add('selected');
        // Add animation effect
        section2Card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            section2Card.style.transform = '';
        }, 300);
    }
    if (section3Card) {
        section3Card.classList.remove('unselected');
        section3Card.classList.add('selected');
        // Add animation effect
        section3Card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            section3Card.style.transform = '';
        }, 300);
    }
    if (section1Rows) section1Rows.value = 3;
    if (section2Rows) section2Rows.value = 3;
    if (section3Rows) section3Rows.value = 3;
}

// Create preview of the worksheet
function createPreview() {
    if (selectedLetters.length === 0 || selectedDiacritics.length === 0) {
        alert('يرجى اختيار حروف وحركات على الأقل واحدة من كل نوع');
        return;
    }
    
    // Check if only standalone diacritics are selected (tanween, sukun, shaddah)
    const standaloneDiacritics = ['ًا', 'ٌ', 'ٍ', 'ْ', 'ّ'];
    const nonStandaloneSelected = selectedDiacritics.some(diacritic => !standaloneDiacritics.includes(diacritic));
    
    if (!nonStandaloneSelected) {
        alert('يرجى اختيار حركات أخرى بالإضافة إلى التنوين أو السكون أو الشدة، حيث أن هذه الحركات لا يمكن استخدامها بمفردها');
        return;
    }
    
    // Check if madd diacritics are selected without their required diacritics
    const maddDiacritics = ['ا', 'و', 'ي', 'ى', 'آ'];
    const selectedMadd = selectedDiacritics.filter(diacritic => maddDiacritics.includes(diacritic));
    
    if (selectedMadd.length > 0) {
        for (const madd of selectedMadd) {
            let requiredDiacritic;
            let diacriticName;
            
            if (madd === 'ا' || madd === 'آ') {
                requiredDiacritic = 'َ';
                diacriticName = 'فتحة';
            } else if (madd === 'و') {
                requiredDiacritic = 'ُ';
                diacriticName = 'ضمة';
            } else if (madd === 'ي' || madd === 'ى') {
                requiredDiacritic = 'ِ';
                diacriticName = 'كسرة';
            }
            
            // Check if the required diacritic is selected
            if (!selectedDiacritics.includes(requiredDiacritic)) {
                alert(`لقد اخترت حرف المد (${madd})، يرجى إضافة الحركة المناسبة له: ${diacriticName} (${requiredDiacritic})`);
                return;
            }
        }
    }
    
    if (!previewContainer) return;
    
    previewContainer.innerHTML = '';
    
    const worksheetDiv = document.createElement('div');
    worksheetDiv.className = 'worksheet-preview';
    worksheetDiv.id = 'worksheet-preview';
    
    // Add main title to the worksheet preview
    const mainTitle = document.createElement('div');
    mainTitle.className = 'worksheet-main-title';
    mainTitle.textContent = 'تعليم تهجي الكلمات';
    worksheetDiv.appendChild(mainTitle);
    
    // Add selected letters display to the worksheet preview
    const selectedLettersDiv = document.createElement('div');
    selectedLettersDiv.className = 'worksheet-selected-letters';
    
    if (selectedLetters.length > 0) {
        let selectedLettersText = '';
        selectedLetters.forEach(letter => {
            selectedLettersText += letter + ' ';
        });
        selectedLettersDiv.innerHTML = '<span class="worksheet-label">الحروف المختارة:</span> ' + selectedLettersText.trim();
    } else {
        selectedLettersDiv.innerHTML = '<span class="worksheet-label">الحروف المختارة:</span> لم يتم اختيار أي حروف بعد';
    }
    
    worksheetDiv.appendChild(selectedLettersDiv);
    
    // Get customization settings
    const includeSection1 = section1Card && section1Card.classList.contains('selected');
    const includeSection2 = section2Card && section2Card.classList.contains('selected');
    const includeSection3 = section3Card && section3Card.classList.contains('selected');
    
    const section1RowCount = parseInt(section1Rows ? section1Rows.value : 3) || 3;
    const section2RowCount = parseInt(section2Rows ? section2Rows.value : 3) || 3;
    const section3RowCount = parseInt(section3Rows ? section3Rows.value : 3) || 3;
    
    // Section 1: Letters with diacritics (10 columns)
    if (includeSection1) {
        const section1Title = document.createElement('div');
        section1Title.className = 'section-title';
        section1Title.textContent = 'القسم الأول: الحروف مع الحركات';
        worksheetDiv.appendChild(section1Title);
        
        const section1Grid = document.createElement('div');
        section1Grid.className = 'worksheet-grid grid-10';
        
        // Generate combinations based on row count (rowCount * 10 cells)
        const section1CellCount = section1RowCount * 10;
        for (let i = 0; i < section1CellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'worksheet-cell';
            cell.textContent = generateRandomCombination();
            section1Grid.appendChild(cell);
        }
        
        worksheetDiv.appendChild(section1Grid);
    }
    
    // Section 2: Two-letter combinations (8 columns)
    if (includeSection2) {
        const section2Title = document.createElement('div');
        section2Title.className = 'section-title';
        section2Title.textContent = 'القسم الثاني: مجموعات من حرفين';
        worksheetDiv.appendChild(section2Title);
        
        const section2Grid = document.createElement('div');
        section2Grid.className = 'worksheet-grid grid-8';
        
        // Generate combinations based on row count (rowCount * 8 cells)
        const section2CellCount = section2RowCount * 8;
        for (let i = 0; i < section2CellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'worksheet-cell';
            cell.textContent = generateTwoLetterCombination();
            section2Grid.appendChild(cell);
        }
        
        worksheetDiv.appendChild(section2Grid);
    }
    
    // Section 3: Words from JSON file
    if (includeSection3) {
        const section3Title = document.createElement('div');
        section3Title.className = 'section-title';
        section3Title.textContent = 'القسم الثالث: كلمات مختارة';
        worksheetDiv.appendChild(section3Title);
        
        const section3Grid = document.createElement('div');
        section3Grid.className = 'worksheet-grid grid-4';
        
        // Generate words based on criteria
        generateWordsFromCriteria().then(words => {
            // Generate words based on row count (rowCount * 4 cells)
            const section3CellCount = section3RowCount * 4;
            for (let i = 0; i < Math.min(section3CellCount, words.length); i++) {
                const cell = document.createElement('div');
                cell.className = 'worksheet-cell';
                cell.textContent = words[i];
                section3Grid.appendChild(cell);
            }
            
            // If no words match criteria, show a message
            if (words.length === 0) {
                const cell = document.createElement('div');
                cell.className = 'worksheet-cell';
                cell.textContent = 'لا توجد كلمات تطابق المعايير المحددة';
                cell.style.gridColumn = '1 / -1';
                cell.style.textAlign = 'center';
                section3Grid.appendChild(cell);
            }
            
            worksheetDiv.appendChild(section3Grid);
            if (previewContainer) {
                previewContainer.appendChild(worksheetDiv);
            }
        });
    } else {
        // If section 3 is not included, we still need to append the worksheet
        if (previewContainer) {
            previewContainer.appendChild(worksheetDiv);
        }
    }
}

// Generate words based on user criteria
async function generateWordsFromCriteria() {
    // Load words from JSON file
    let words = [];
    try {
        const response = await fetch('words.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        words = data.words;
    } catch (error) {
        console.error('Error loading words.json:', error);
        // Use default words if JSON file cannot be loaded
        words = [
            "بَيْتٌ", "قَلَمٌ", "كِتَابٌ", "طَالِبٌ", "مَدْرَسَةٌ", "مُعَلِّمٌ", "دَرْسٌ", "فَصْلٌ",
            "مَجَلَّةٌ", "جَرِيدَةٌ", "رَسُولٌ", "نَبِيٌّ", "مَلَكٌ", "شَيْطَانٌ", "إِنْسَانٌ",
            "حَيَوَانٌ", "نَبَاتٌ", "شَجَرَةٌ", "زَهْرَةٌ", "نَهْرٌ", "بَحْرٌ", "جَبَلٌ", "سَمَاءٌ",
            "شَمْسٌ", "قَمَرٌ", "نُجُومٌ", "سَحَابٌ", "مَطَرٌ", "بَرْدٌ", "رِيحٌ", "نَارٌ"
        ];
    }
    
    // Filter words based on selected letters
    let filteredWords = words.filter(word => {
        // Check if all letters in the word are in the selected letters
        const wordLetters = extractLettersFromWord(word);
        return wordLetters.every(letter => selectedLetters.includes(letter));
    });
    
    // Filter words based on selected diacritics
    // ALL diacritics in the word must be in the selected diacritics
    if (selectedDiacritics.length > 0) {
        filteredWords = filteredWords.filter(word => {
            return wordHasOnlySelectedDiacritics(word);
        });
    }
    
    return filteredWords;
}

// Check if a word contains only selected diacritics
function wordHasOnlySelectedDiacritics(word) {
    // Get all diacritics in the word
    const wordDiacritics = getAllDiacriticsFromWord(word);
    
    // Check if all diacritics in the word are in the selected diacritics
    for (const diacritic of wordDiacritics) {
        if (!selectedDiacritics.includes(diacritic)) {
            return false;
        }
    }
    
    return true;
}

// Get all diacritics from a word
function getAllDiacriticsFromWord(word) {
    const diacritics = [];
    
    // Go through each character in the word
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        
        // Check if character is a diacritic
        if (isDiacritic(char)) {
            diacritics.push(char);
        }
    }
    
    return diacritics;
}

// Check if a character is a diacritic
function isDiacritic(char) {
    // Arabic diacritics
    const diacriticChars = ['َ', 'ُ', 'ِ', 'ً', 'ٌ', 'ٍ', 'ْ', 'ّ'];
    // Madd diacritics
    const maddChars = ['ا', 'و', 'ي'];
    
    return diacriticChars.includes(char) || maddChars.includes(char);
}

// Extract letters from a word (removing diacritics but keeping madd letters)
function extractLettersFromWord(word) {
    // Arabic diacritics Unicode ranges (excluding madd letters)
    const diacriticsRegex = /[\u064B-\u065F\u0670\u0640]/g;
    // Remove diacritics but keep madd letters (ا, و, ي)
    return word.replace(diacriticsRegex, '').split('').filter(char => char.trim() !== '');
}

// Generate a random combination of letter and diacritic
function generateRandomCombination() {
    if (selectedLetters.length === 0 || selectedDiacritics.length === 0) return '';
    
    // Check if only standalone diacritics are selected
    const standaloneDiacritics = ['ًا', 'ٌ', 'ٍ', 'ْ', 'ّ'];
    const nonStandaloneSelected = selectedDiacritics.some(diacritic => !standaloneDiacritics.includes(diacritic));
    
    if (!nonStandaloneSelected) {
        // If only standalone diacritics selected, return a simple letter without diacritics
        return selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
    }
    
    const letter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
    const diacritic = selectedDiacritics[Math.floor(Math.random() * selectedDiacritics.length)];
    
    // Special handling for some diacritics
    if (diacritic === 'ّ') {
        // For shadda, it must be preceded by another letter with a diacritic
        const firstLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        const secondLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        
        // Check if tanween is also selected
        const tanweenDiacritics = ['ًا', 'ٌ', 'ٍ'];
        const tanweenSelected = selectedDiacritics.some(d => tanweenDiacritics.includes(d));
        
        // Get a regular diacritic to accompany the shadda
        const regularDiacritics = selectedDiacritics.filter(d => 
            d !== 'ْ' && d !== 'ّ' && d !== 'ًا' && d !== 'ٌ' && d !== 'ٍ' &&
            d !== 'ا' && d !== 'و' && d !== 'ي'
        );
        
        if (tanweenSelected && regularDiacritics.length > 0) {
            // 30% chance to create shaddah with tanween combination
            if (Math.random() < 0.3) {
                const tanween = tanweenDiacritics.find(t => selectedDiacritics.includes(t));
                // For tanween with shaddah: letter + letter + shaddah + tanween
                // Since tanween already includes the vowel sound, we don't need an extra diacritic
                return firstLetter + secondLetter + diacritic + tanween;
            }
        }
        
        // Regular shaddah combination
        if (regularDiacritics.length > 0) {
            const accompanyingDiacritic = regularDiacritics[Math.floor(Math.random() * regularDiacritics.length)];
            return firstLetter + accompanyingDiacritic + secondLetter + accompanyingDiacritic + diacritic;
        } else {
            // Fallback if no regular diacritics are available
            return firstLetter + secondLetter;
        }
    } else if (diacritic === 'ا' || diacritic === 'و' || diacritic === 'ي') {
        // Madd diacritics - they need to be part of a two-letter combination
        // First letter with appropriate diacritic + madd letter
        const firstLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        
        // Determine the appropriate diacritic for the madd letter
        let requiredDiacritic;
        if (diacritic === 'ا') {
            requiredDiacritic = 'َ'; // Fatha for alif
        } else if (diacritic === 'و') {
            requiredDiacritic = 'ُ'; // Dammah for waw
        } else if (diacritic === 'ي') {
            requiredDiacritic = 'ِ'; // Kasra for ya
        }
        
        // Check if the required diacritic is selected
        if (selectedDiacritics.includes(requiredDiacritic)) {
            return firstLetter + requiredDiacritic + diacritic;
        } else {
            // If the required diacritic is not selected, use a fallback
            // Create a regular two-letter combination with available diacritics
            const secondLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
            const regularDiacritics = selectedDiacritics.filter(d => 
                d !== 'ْ' && d !== 'ّ' && d !== 'ًا' && d !== 'ٌ' && d !== 'ٍ' &&
                d !== 'ا' && d !== 'و' && d !== 'ي'
            );
            
            if (regularDiacritics.length > 0) {
                const randomDiacritic = regularDiacritics[Math.floor(Math.random() * regularDiacritics.length)];
                // Apply diacritic to first letter
                return firstLetter + randomDiacritic + secondLetter;
            } else {
                // No diacritics available, just return two letters
                return firstLetter + secondLetter;
            }
        }
    } else if (diacritic === 'ْ') {
        // For sukun, it should be preceded by another letter with a diacritic
        // Create a combination like "أَدْ" (fatha + letter + sukun)
        const firstLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        const secondLetter = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        
        // Get a regular diacritic for the first letter
        let firstDiacritic;
        const regularDiacritics = selectedDiacritics.filter(d => 
            d !== 'ْ' && d !== 'ّ' && d !== 'ًا' && d !== 'ٌ' && d !== 'ٍ' &&
            d !== 'ا' && d !== 'و' && d !== 'ي'
        );
        
        if (regularDiacritics.length > 0) {
            firstDiacritic = regularDiacritics[Math.floor(Math.random() * regularDiacritics.length)];
            return firstLetter + firstDiacritic + secondLetter + diacritic;
        } else {
            // Fallback if no regular diacritics are available
            return firstLetter + secondLetter + diacritic;
        }
    } else {
        // Regular diacritics placed above/below the letter
        return letter + diacritic;
    }
}

// Generate two-letter combination with diacritics
function generateTwoLetterCombination() {
    if (selectedLetters.length === 0 || selectedDiacritics.length === 0) return '';
    
    // Check if only standalone diacritics are selected (tanween, sukun, shaddah)
    const standaloneDiacritics = ['ًا', 'ٌ', 'ٍ', 'ْ', 'ّ'];
    const nonStandaloneSelected = selectedDiacritics.some(diacritic => !standaloneDiacritics.includes(diacritic));
    
    if (!nonStandaloneSelected) {
        // If only standalone diacritics selected, return a simple two-letter combination without diacritics
        const letter1 = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        const letter2 = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        return letter1 + letter2;
    }
    
    const letter1 = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
    const letter2 = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
    
    // Apply diacritics to both letters
    let result = letter1;
    
    // Always add a diacritic to the first letter (100% chance)
    // But exclude standalone diacritics (tanween, sukun, shaddah) as they have special rules
    let diacritic1;
    do {
        diacritic1 = selectedDiacritics[Math.floor(Math.random() * selectedDiacritics.length)];
    } while (diacritic1 === 'ًا' || diacritic1 === 'ٌ' || diacritic1 === 'ٍ' || diacritic1 === 'ْ' || diacritic1 === 'ّ'); // Exclude standalone diacritics
    
    if (diacritic1 !== 'ْ' && diacritic1 !== 'ّ' && 
        diacritic1 !== 'ا' && diacritic1 !== 'و' && diacritic1 !== 'ي') {
        result += diacritic1;
    } else if (diacritic1 === 'ْ' || diacritic1 === 'ّ') {
        // For sukun and shadda, place them after the letter
        result += diacritic1;
    } else if (diacritic1 === 'ا' || diacritic1 === 'و' || diacritic1 === 'ي') {
        // Madd diacritics - they need to be preceded by the appropriate diacritic
        let requiredDiacritic;
        if (diacritic1 === 'ا') {
            requiredDiacritic = 'َ'; // Fatha for alif
        } else if (diacritic1 === 'و') {
            requiredDiacritic = 'ُ'; // Dammah for waw
        } else if (diacritic1 === 'ي') {
            requiredDiacritic = 'ِ'; // Kasra for ya
        }
        
        // Check if the required diacritic is selected
        if (selectedDiacritics.includes(requiredDiacritic)) {
            result += requiredDiacritic + diacritic1;
        } else {
            // If required diacritic is not selected, just add the madd letter without diacritic
            result += diacritic1;
        }
    }
    
    result += letter2;
    
    // Always add a diacritic to the second letter (100% chance)
    // Standalone diacritics are allowed here as they're at the end or have special rules
    const diacritic2 = selectedDiacritics[Math.floor(Math.random() * selectedDiacritics.length)];
    
    // Special handling for shaddah in two-letter combinations
    if (diacritic2 === 'ّ') {
        // For shadda, it must be accompanied by another diacritic
        // Check if tanween is also selected
        const tanweenDiacritics = ['ًا', 'ٌ', 'ٍ'];
        const tanweenSelected = selectedDiacritics.some(d => tanweenDiacritics.includes(d));
        
        // Get a regular diacritic to accompany the shadda
        const regularDiacritics = selectedDiacritics.filter(d => 
            d !== 'ْ' && d !== 'ّ' && d !== 'ًا' && d !== 'ٌ' && d !== 'ٍ' &&
            d !== 'ا' && d !== 'و' && d !== 'ي'
        );
        
        if (tanweenSelected && regularDiacritics.length > 0) {
            // 30% chance to create shaddah with tanween combination
            if (Math.random() < 0.3) {
                const tanween = tanweenDiacritics.find(t => selectedDiacritics.includes(t));
                // For tanween with shaddah: letter + shaddah + tanween
                // Since tanween already includes the vowel sound, we don't need an extra diacritic
                result += diacritic2 + tanween;
                return result;
            }
        }
        
        // Regular shaddah combination
        if (regularDiacritics.length > 0) {
            const accompanyingDiacritic = regularDiacritics[Math.floor(Math.random() * regularDiacritics.length)];
            result += accompanyingDiacritic + diacritic2;
        }
    } else if (diacritic2 !== 'ْ' && diacritic2 !== 'ّ' && 
        diacritic2 !== 'ا' && diacritic2 !== 'و' && diacritic2 !== 'ي') {
        result += diacritic2;
    } else if (diacritic2 === 'ْ' || diacritic2 === 'ّ') {
        // For sukun and shadda, place them after the letter
        result += diacritic2;
    } else if (diacritic2 === 'ا' || diacritic2 === 'و' || diacritic2 === 'ي') {
        // Madd diacritics - they need to be preceded by the appropriate diacritic
        let requiredDiacritic;
        if (diacritic2 === 'ا') {
            requiredDiacritic = 'َ'; // Fatha for alif
        } else if (diacritic2 === 'و') {
            requiredDiacritic = 'ُ'; // Dammah for waw
        } else if (diacritic2 === 'ي') {
            requiredDiacritic = 'ِ'; // Kasra for ya
        }
        
        // Check if the required diacritic is selected
        if (selectedDiacritics.includes(requiredDiacritic)) {
            result += requiredDiacritic + diacritic2;
        } else {
            // If required diacritic is not selected, just add the madd letter without diacritic
            result += diacritic2;
        }
    }
    
    return result;
}

// Generate PDF only (no preview recreation)
function generatePDFOnly() {
    if (selectedLetters.length === 0 || selectedDiacritics.length === 0) {
        alert('يرجى اختيار حروف وحركات على الأقل واحدة من كل نوع');
        return;
    }
    
    // Check if preview exists
    if (!document.getElementById('worksheet-preview')) {
        alert('يرجى النقر على معاينة أولاً');
        return;
    }
    
    // Generate PDF
    generatePDF();
}

// Generate PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Use html2canvas to convert the preview to canvas
    const previewElement = document.getElementById('worksheet-preview');
    if (!previewElement) return;
    
    html2canvas(previewElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add new pages if content is taller than one page
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Add second identical page
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Add additional pages if content is taller than one page (for second copy)
        let heightLeftSecond = imgHeight;
        heightLeftSecond -= pageHeight;
        
        while (heightLeftSecond >= 0) {
            position = heightLeftSecond - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeftSecond -= pageHeight;
        }
        
        // Save the PDF
        doc.save('worksheet.pdf');
    });
}

// Initialize customization settings with default values
function initializeCustomizationSettings() {
    // Set default values if not already set
    if (section1Card && !section1Card.classList.contains('selected')) {
        section1Card.classList.add('selected');
        section1Card.classList.remove('unselected');
    }
    if (section2Card && !section2Card.classList.contains('selected')) {
        section2Card.classList.add('selected');
        section2Card.classList.remove('unselected');
    }
    if (section3Card && !section3Card.classList.contains('selected')) {
        section3Card.classList.add('selected');
        section3Card.classList.remove('unselected');
    }
    if (section1Rows && !section1Rows.value) {
        section1Rows.value = 3;
    }
    if (section2Rows && !section2Rows.value) {
        section2Rows.value = 3;
    }
    if (section3Rows && !section3Rows.value) {
        section3Rows.value = 3;
    }
}

// Setup event listeners for customization cards
function setupCustomizationEventListeners() {
    // Add click event listeners to section cards
    if (section1Card) {
        section1Card.addEventListener('click', function(e) {
            // Prevent triggering when clicking on the row input
            if (e.target.classList.contains('row-input')) {
                return;
            }
            
            // Toggle selection state
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                this.classList.add('unselected');
            } else {
                this.classList.remove('unselected');
                this.classList.add('selected');
            }
            
            // Add animation effect
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
    
    if (section2Card) {
        section2Card.addEventListener('click', function(e) {
            // Prevent triggering when clicking on the row input
            if (e.target.classList.contains('row-input')) {
                return;
            }
            
            // Toggle selection state
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                this.classList.add('unselected');
            } else {
                this.classList.remove('unselected');
                this.classList.add('selected');
            }
            
            // Add animation effect
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
    
    if (section3Card) {
        section3Card.addEventListener('click', function(e) {
            // Prevent triggering when clicking on the row input
            if (e.target.classList.contains('row-input')) {
                return;
            }
            
            // Toggle selection state
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                this.classList.add('unselected');
            } else {
                this.classList.remove('unselected');
                this.classList.add('selected');
            }
            
            // Add animation effect
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
    
    // Add hover effects to row inputs
    const rowInputs = document.querySelectorAll('.row-input');
    rowInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.backgroundColor = 'rgba(56, 103, 214, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.backgroundColor = 'rgba(56, 103, 214, 0.1)';
        });
    });
}