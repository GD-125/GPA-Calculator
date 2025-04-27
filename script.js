// Improved menu toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.getElementById('nav-links');

    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    // Toggle menu when hamburger icon is clicked
    menuIcon.addEventListener('click', function () {
        menuIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');

        // Prevent scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on overlay
    overlay.addEventListener('click', function () {
        menuIcon.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            menuIcon.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            menuIcon.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Tab switching functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// University selection functionality
const cgpaUniBtns = document.querySelectorAll('#cgpa-to-percentage .university-btn');
const percentageUniBtns = document.querySelectorAll('#percentage-to-cgpa .university-btn');

cgpaUniBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        cgpaUniBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('cgpa-formula').textContent = `Percentage = ${btn.dataset.formula.replace('cgpa', 'CGPA')}`;
    });
});

percentageUniBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        percentageUniBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('percentage-formula').textContent = `CGPA = ${btn.dataset.formula.replace('percentage', 'Percentage')}`;
    });
});

// CGPA to Percentage conversion
document.getElementById('convert-cgpa-btn').addEventListener('click', function () {
    const cgpaInput = parseFloat(document.getElementById('cgpa-input').value);

    if (isNaN(cgpaInput) || cgpaInput < 0 || cgpaInput > 10) {
        alert('Please enter a valid CGPA between 0 and 10.');
        return;
    }

    const activeUni = document.querySelector('#cgpa-to-percentage .university-btn.active');
    const formula = activeUni.dataset.formula;
    const percentage = eval(formula.replace('cgpa', cgpaInput));

    document.getElementById('percentage-value').textContent = percentage.toFixed(2) + '%';
    document.getElementById('cgpa-result').classList.add('visible');
});

// Percentage to CGPA conversion
document.getElementById('convert-percentage-btn').addEventListener('click', function () {
    const percentageInput = parseFloat(document.getElementById('percentage-input').value);

    if (isNaN(percentageInput) || percentageInput < 0 || percentageInput > 100) {
        alert('Please enter a valid percentage between 0 and 100.');
        return;
    }

    const activeUni = document.querySelector('#percentage-to-cgpa .university-btn.active');
    const formula = activeUni.dataset.formula;
    const cgpa = eval(formula.replace('percentage', percentageInput));

    document.getElementById('cgpa-value').textContent = cgpa.toFixed(2);
    document.getElementById('percentage-result').classList.add('visible');
});

// Add subject row functionality
function addSubjectRow() {
    const container = document.getElementById('subjects-container');
    const rowCount = container.children.length + 1;

    const row = document.createElement('div');
    row.className = 'form-group';
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '2fr 1fr 1fr';
    row.style.gap = '1rem';
    row.style.marginBottom = '1rem';
    row.style.alignItems = 'center';

    row.innerHTML = `
                <input type="text" class="form-control subject-name" placeholder="Subject ${rowCount}" required>
                <select class="form-control credit-select" required>
                    <option value="">Credits</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <select class="form-control grade-select" required>
                    <option value="">Grade</option>
                    <option value="10">O (10)</option>
                    <option value="9">A+ (9)</option>
                    <option value="8">A (8)</option>
                    <option value="7">B+ (7)</option>
                    <option value="6">B (6)</option>
                    <option value="5">C (5)</option>
                    <option value="4">P (4)</option>
                    <option value="0">F (0)</option>
                </select>
            `;

    container.appendChild(row);
}

// Calculate CGPA functionality
function calculateCGPA() {
    const subjectRows = document.querySelectorAll('#subjects-container .form-group');
    let totalCredits = 0;
    let totalWeightedGrade = 0;
    let isValid = true;

    subjectRows.forEach(row => {
        const subject = row.querySelector('.subject-name');
        const credit = row.querySelector('.credit-select');
        const grade = row.querySelector('.grade-select');

        if (!subject.value || !credit.value || !grade.value) {
            isValid = false;
            return;
        }

        const creditValue = parseFloat(credit.value);
        const gradeValue = parseFloat(grade.value);

        totalCredits += creditValue;
        totalWeightedGrade += (creditValue * gradeValue);
    });

    if (!isValid) {
        alert('Please fill in all fields for each subject.');
        return;
    }

    if (totalCredits === 0) {
        alert('Please add at least one subject with valid credits.');
        return;
    }

    const cgpa = totalWeightedGrade / totalCredits;
    document.getElementById('cgpa-calc-value').textContent = cgpa.toFixed(2);
    document.getElementById('cgpa-calc-result').classList.add('visible');

    // Apply color based on CGPA value
    const resultValue = document.getElementById('cgpa-calc-value');
    if (cgpa < 5) {
        resultValue.style.color = '#e63946';  // Red for low CGPA
    } else if (cgpa >= 5 && cgpa < 7) {
        resultValue.style.color = '#fb8500';  // Orange for medium CGPA
    } else {
        resultValue.style.color = '#38b000';  // Green for high CGPA
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Add initial subject row
    addSubjectRow();

    // Simulate clicks to set initial states
    document.querySelector('#cgpa-to-percentage .university-btn').click();
    document.querySelector('#percentage-to-cgpa .university-btn').click();
});

    // JavaScript for GPA Calculator
    // Add semester row functionality
    function addSemesterRow() {
        const container = document.getElementById('gpa-container');
        const rowCount = container.children.length + 1;

        const row = document.createElement('div');
        row.className = 'form-group semester-row';
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1fr 1fr';
        row.style.gap = '1rem';
        row.style.marginBottom = '1rem';
        row.style.backgroundColor = '#f8f9fa';
        row.style.padding = '1rem';
        row.style.borderRadius = 'var(--border-radius)';
        row.style.border = '1px solid #dee2e6';

        row.innerHTML = `
        <div>
            <label>Semester ${rowCount}</label>
            <input type="text" class="form-control semester-name" placeholder="Semester ${rowCount}" value="Semester ${rowCount}" required readonly>
        </div>
        <div>
            <label>SGPA</label>
            <input type="number" class="form-control sgpa-value" placeholder="Enter SGPA" min="0" max="10" step="0.01" required>
        </div>
    `;

        container.appendChild(row);
    }

        // Calculate Overall GPA functionality
        function calculateOverallGPA() {
        const semesterRows = document.querySelectorAll('#gpa-container .semester-row');
        let totalSGPA = 0;
        let semesterCount = 0;
        let isValid = true;

        semesterRows.forEach(row => {
            const sgpa = row.querySelector('.sgpa-value');

            if (!sgpa.value) {
                isValid = false;
                return;
            }

            const sgpaValue = parseFloat(sgpa.value);

            if (isNaN(sgpaValue) || sgpaValue < 0 || sgpaValue > 10) {
                isValid = false;
                return;
            }

            totalSGPA += sgpaValue;
            semesterCount++;
        });

        if (!isValid) {
            alert('Please enter valid SGPA values (between 0 and 10) for all semesters.');
            return;
        }

        if (semesterCount === 0) {
            alert('Please add at least one semester with a valid SGPA.');
            return;
        }

        const overallGPA = totalSGPA / semesterCount;
        document.getElementById('gpa-calc-value').textContent = overallGPA.toFixed(2);
        document.getElementById('gpa-calc-result').classList.add('visible');

        // Apply color based on GPA value
        const resultValue = document.getElementById('gpa-calc-value');
        if (overallGPA < 5) {
            resultValue.style.color = '#e63946';  // Red for low GPA
        } else if (overallGPA >= 5 && overallGPA < 7) {
            resultValue.style.color = '#fb8500';  // Orange for medium GPA
        } else {
            resultValue.style.color = '#38b000';  // Green for high GPA
        }
    }

        // Initialize the GPA calculator
        document.addEventListener('DOMContentLoaded', function () {
        // Check if this event handler already exists to avoid duplicates
        if (!window.gpaInitialized) {
            // Add initial semester row
            addSemesterRow();
            window.gpaInitialized = true;
        }
    });