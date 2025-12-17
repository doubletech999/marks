// ===================================
// King of the Class - Grade 8
// Main Application Logic
// ===================================

// Constants
const STUDENTS = [
    "ابرار حذيفة خضير سمرين",
    "بنان شادي حسين معطان",
    "تقوى عمر ساري ابو صبحة",
    "' حسنة عماد احمد سمرين",
    "رغد كاظم عبد العزيز معطان",
    "رفيف منثور عبد الحافظ معطان",
    "عاطف رأفت محمد نوابيت",
    "محمد نواف خضر بركات",
    "ندى عبد الله فايز معطان"
];

const WINNING_SCORE = 30;
const STORAGE_KEY = 'kingOfClassData';

// Translation Dictionary
const translations = {
    en: {
        title: "KING OF THE CLASS – GRADE 8",
        studentName: "Student Name",
        tallyMarks: "Tally Marks",
        winner: "Winner 👑",
        actions: "Actions",
        teacherName: "Teacher Name:",
        classSection: "Class Section:",
        save: "💾 Save",
        resetWeek: "🔄 Reset Week",
        print: "🖨️ Print",
        langToggle: "العربية",
        lastUpdated: "Last updated:",
        never: "Never",
        confirmReset: "Are you sure you want to reset all tallies? This will clear the week's progress.",
        savedSuccess: "Progress saved successfully!",
        enterTeacher: "Enter teacher name",
        enterSection: "Enter section"
    },
    ar: {
        title: "ملك الصف – الصف الثامن",
        studentName: "اسم الطالب",
        tallyMarks: "الشحطات",
        winner: "الفائز 👑",
        actions: "الإجراءات",
        teacherName: "اسم المعلم:",
        classSection: "شعبة الصف:",
        save: "💾 حفظ",
        resetWeek: "🔄 إعادة تعيين الأسبوع",
        print: "🖨️ طباعة",
        langToggle: "English",
        lastUpdated: "آخر تحديث:",
        never: "أبداً",
        confirmReset: "هل أنت متأكد أنك تريد إعادة تعيين جميع الشحطات؟ سيؤدي هذا إلى مسح تقدم الأسبوع.",
        savedSuccess: "تم حفظ التقدم بنجاح!",
        enterTeacher: "أدخل اسم المعلم",
        enterSection: "أدخل الشعبة"
    }
};

// State Management
let state = {
    students: [],
    crownedWinnerId: null,
    language: 'en',
    teacherName: '',
    classSection: ''
};

// Initialize Application
function init() {
    loadState();
    setupEventListeners();
    renderTable();
    updateLastUpdatedTime();
    applyLanguage();
}

// Load State from localStorage
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            
            // Ensure all students exist
            if (!state.students || state.students.length === 0) {
                initializeStudents();
            } else {
                // Add any missing students
                STUDENTS.forEach((name, index) => {
                    if (!state.students.find(s => s.id === index)) {
                        state.students.push({
                            id: index,
                            name: name,
                            tally: 0
                        });
                    }
                });
                // Sort by original order
                state.students.sort((a, b) => a.id - b.id);
            }
        } catch (e) {
            console.error('Error loading state:', e);
            initializeStudents();
        }
    } else {
        initializeStudents();
    }
    
    // Update form fields
    document.getElementById('teacherName').value = state.teacherName || '';
    document.getElementById('classSection').value = state.classSection || '';
}

// Initialize Students
function initializeStudents() {
    state.students = STUDENTS.map((name, index) => ({
        id: index,
        name: name,
        tally: 0
    }));
}

// Save State to localStorage
function saveState() {
    const toSave = {
        students: state.students,
        crownedWinnerId: state.crownedWinnerId,
        language: state.language,
        teacherName: state.teacherName,
        classSection: state.classSection,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    updateLastUpdatedTime();
}

// Update Last Updated Time Display
function updateLastUpdatedTime() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.lastUpdated) {
                const date = new Date(parsed.lastUpdated);
                const formatted = date.toLocaleString(state.language === 'ar' ? 'ar-EG' : 'en-US');
                document.getElementById('updateTime').textContent = formatted;
            }
        } catch (e) {
            document.getElementById('updateTime').textContent = translations[state.language].never;
        }
    } else {
        document.getElementById('updateTime').textContent = translations[state.language].never;
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Language Toggle
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
    
    // Save Button
    document.getElementById('saveBtn').addEventListener('click', handleSave);
    
    // Reset Week Button
    document.getElementById('resetWeekBtn').addEventListener('click', handleResetWeek);
    
    // Print Button
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    
    // Teacher Name & Class Section
    document.getElementById('teacherName').addEventListener('change', (e) => {
        state.teacherName = e.target.value;
        saveState();
    });
    
    document.getElementById('classSection').addEventListener('change', (e) => {
        state.classSection = e.target.value;
        saveState();
    });
}

// Toggle Language
function toggleLanguage() {
    state.language = state.language === 'en' ? 'ar' : 'en';
    document.documentElement.setAttribute('lang', state.language);
    document.documentElement.setAttribute('dir', state.language === 'ar' ? 'rtl' : 'ltr');
    applyLanguage();
    renderTable();
    saveState();
}

// Apply Language Translations
function applyLanguage() {
    const t = translations[state.language];
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        const key = el.getAttribute('data-en').toLowerCase().replace(/[^a-z]/g, '');
        if (el.tagName === 'INPUT') {
            el.placeholder = t.enterTeacher || t.enterSection || el.placeholder;
        } else {
            el.textContent = el.getAttribute(`data-${state.language}`);
        }
    });
    
    // Update placeholders
    document.getElementById('teacherName').placeholder = t.enterTeacher;
    document.getElementById('classSection').placeholder = t.enterSection;
    
    updateLastUpdatedTime();
}

// Handle Save
function handleSave() {
    saveState();
    
    // Visual feedback
    const btn = document.getElementById('saveBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ ' + translations[state.language].savedSuccess + '</span>';
    btn.style.background = 'linear-gradient(to bottom, #4CAF50, #45a049)';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

// Handle Reset Week
function handleResetWeek() {
    if (confirm(translations[state.language].confirmReset)) {
        state.students.forEach(student => {
            student.tally = 0;
        });
        state.crownedWinnerId = null;
        saveState();
        renderTable();
    }
}

// Render Student Table
function renderTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';
    
    state.students.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // Check if this student has reached 30 and should be crowned
        if (student.tally >= WINNING_SCORE && state.crownedWinnerId === null) {
            state.crownedWinnerId = student.id;
            saveState();
            showConfetti();
        }
        
        const isCrowned = state.crownedWinnerId === student.id;
        const hasReached30 = student.tally >= WINNING_SCORE;
        
        if (isCrowned) {
            row.classList.add('crowned');
        }
        
        // Name Cell
        const nameCell = document.createElement('td');
        nameCell.className = 'name-cell';
        nameCell.textContent = student.name;
        row.appendChild(nameCell);
        
        // Tally Cell
        const tallyCell = document.createElement('td');
        tallyCell.className = 'tally-cell';
        tallyCell.appendChild(createTallyDisplay(student.tally));
        row.appendChild(tallyCell);
        
        // Winner Cell
        const winnerCell = document.createElement('td');
        winnerCell.className = 'winner-cell';
        if (isCrowned) {
            const crown = document.createElement('span');
            crown.className = 'crown-icon';
            crown.textContent = '👑';
            crown.setAttribute('aria-label', 'Winner');
            winnerCell.appendChild(crown);
        } else if (hasReached30) {
            const badge = document.createElement('span');
            badge.className = 'badge-30';
            badge.textContent = '30!';
            winnerCell.appendChild(badge);
        }
        row.appendChild(winnerCell);
        
        // Actions Cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell no-print';
        actionsCell.appendChild(createActionButtons(student.id));
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    });
}

// Create Tally Display
function createTallyDisplay(count) {
    const container = document.createElement('div');
    container.className = 'tally-display';
    
    const fullGroups = Math.floor(count / 5);
    const remainder = count % 5;
    
    // Render full groups (||||X)
    for (let i = 0; i < fullGroups; i++) {
        container.appendChild(createTallyGroup(5));
    }
    
    // Render partial group
    if (remainder > 0) {
        container.appendChild(createTallyGroup(remainder));
    }
    
    // Add count badge
    const countBadge = document.createElement('span');
    countBadge.className = 'tally-count';
    countBadge.textContent = `(${count})`;
    container.appendChild(countBadge);
    
    return container;
}

// Create Tally Group (SVG)
function createTallyGroup(count) {
    const group = document.createElement('div');
    group.className = 'tally-group';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 50 60');
    svg.setAttribute('aria-label', `Tally group of ${count}`);
    
    // Draw vertical lines (up to 4)
    const lineCount = Math.min(count, 4);
    for (let i = 0; i < lineCount; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const x = 10 + (i * 10);
        line.setAttribute('x1', x);
        line.setAttribute('y1', '10');
        line.setAttribute('x2', x);
        line.setAttribute('y2', '50');
        line.setAttribute('class', 'tally-line');
        svg.appendChild(line);
    }
    
    // Draw diagonal X for the 5th mark
    if (count === 5) {
        const diagonal = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        diagonal.setAttribute('x1', '5');
        diagonal.setAttribute('y1', '10');
        diagonal.setAttribute('x2', '45');
        diagonal.setAttribute('y2', '50');
        diagonal.setAttribute('class', 'tally-x');
        svg.appendChild(diagonal);
    }
    
    group.appendChild(svg);
    
    return group;
}

// Create Action Buttons
function createActionButtons(studentId) {
    const container = document.createElement('div');
    container.className = 'action-buttons';
    
    // Increment Button
    const incrementBtn = document.createElement('button');
    incrementBtn.className = 'btn btn-small btn-increment';
    incrementBtn.textContent = '+1';
    incrementBtn.setAttribute('aria-label', 'Add one tally mark');
    incrementBtn.addEventListener('click', () => modifyTally(studentId, 1));
    container.appendChild(incrementBtn);
    
    // Decrement Button
    const decrementBtn = document.createElement('button');
    decrementBtn.className = 'btn btn-small btn-decrement';
    decrementBtn.textContent = '-1';
    decrementBtn.setAttribute('aria-label', 'Remove one tally mark');
    decrementBtn.addEventListener('click', () => modifyTally(studentId, -1));
    container.appendChild(decrementBtn);
    
    // Reset Button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-small btn-reset';
    resetBtn.textContent = '↺';
    resetBtn.setAttribute('aria-label', 'Reset this student');
    resetBtn.addEventListener('click', () => resetStudent(studentId));
    container.appendChild(resetBtn);
    
    return container;
}

// Modify Tally
function modifyTally(studentId, delta) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;
    
    const newTally = Math.max(0, student.tally + delta);
    const wasAtWinning = student.tally >= WINNING_SCORE;
    
    student.tally = newTally;
    
    // Check for new winner
    if (newTally >= WINNING_SCORE && !wasAtWinning && state.crownedWinnerId === null) {
        state.crownedWinnerId = studentId;
        showConfetti();
    }
    
    // If the crowned winner drops below 30, remove crown
    if (state.crownedWinnerId === studentId && newTally < WINNING_SCORE) {
        state.crownedWinnerId = null;
    }
    
    saveState();
    renderTable();
}

// Reset Individual Student
function resetStudent(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;
    
    student.tally = 0;
    
    // If this was the crowned winner, remove crown
    if (state.crownedWinnerId === studentId) {
        state.crownedWinnerId = null;
    }
    
    saveState();
    renderTable();
}

// Show Confetti Animation
function showConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#9B0000', '#004028', '#FFD700', '#FFA500', '#FF6B6B'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3500);
        }, i * 30);
    }
}

// Initialize on DOM Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Auto-save on visibility change (user switching tabs)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveState();
    }
});

// Service Worker Registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {
            // Service worker registration failed, but app still works
        });
    });
}