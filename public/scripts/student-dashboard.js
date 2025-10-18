let courses = [];
let assignments = [];
let submissions = [];
let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('student-name').textContent = user.name;
    } else {
        // Default student enrollment data for initial run
        // This ensures the student dashboard has content even if not logged in
        initializeStudentData();
    }

    setupTabNavigation();
    loadData();
});

function initializeStudentData() {
    // Mock courses
    if (!localStorage.getItem('enrolledStudentCourses')) {
        localStorage.setItem('enrolledStudentCourses', JSON.stringify([
            { title: 'Advanced Web Dev', description: 'Deep dive into modern JavaScript frameworks.', duration: 16, createdDate: '01/08/2025' },
            { title: 'Calculus I', description: 'Introduction to differential and integral calculus.', duration: 12, createdDate: '15/07/2025' }
        ]));
    }
    // Mock assignments
    if (!localStorage.getItem('teacherAssignments')) {
        localStorage.setItem('teacherAssignments', JSON.stringify([
            { title: 'React Project Setup', instructions: 'Set up a basic React application.', dueDate: '2025-10-25', courseName: 'Advanced Web Dev', isCompleted: false, createdDate: '10/10/2025' },
            { title: 'Limits and Continuity Quiz', instructions: 'Answer questions on limits.', dueDate: '2025-11-01', courseName: 'Calculus I', isCompleted: false, createdDate: '12/10/2025' }
        ]));
    }
    // Mock submissions (some submitted, some graded)
    if (!localStorage.getItem('studentSubmissions')) {
        localStorage.setItem('studentSubmissions', JSON.stringify([
            { id: 1, studentName: 'Student', assignmentTitle: 'React Project Setup', courseName: 'Advanced Web Dev', submittedDate: '18/10/2025', status: 'submitted', content: 'Repo link: github.com/student/react-proj' }
        ]));
    }
    // Mock grades
    if (!localStorage.getItem('studentGrades')) {
        localStorage.setItem('studentGrades', JSON.stringify([
            { assignmentTitle: 'Limits and Continuity Quiz', score: 85, feedback: 'Good effort, but check question 4 for a small error in domain definition.', gradedDate: '15/10/2025' }
        ]));
    }
    
    // Mock student profile (assuming this would be set on login in a real app)
    if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify({ name: 'Jane Doe', email: 'jane@edvora.com', role: 'student' }));
    }
}


function setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName, event);
        });
    });
}

function switchTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'analytics') {
        setTimeout(() => initCharts(), 100);
    }
}

function loadData() {
    courses = JSON.parse(localStorage.getItem('enrolledStudentCourses')) || [];
    assignments = JSON.parse(localStorage.getItem('teacherAssignments')) || [];
    submissions = JSON.parse(localStorage.getItem('studentSubmissions')) || [];
    grades = JSON.parse(localStorage.getItem('studentGrades')) || [];
    
    updateStats();
    renderCourses();
    renderAssignments();
    renderGrades();
}

function updateStats() {
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalAssignments').textContent = assignments.length;
    
    const submittedTitles = submissions.map(s => s.assignmentTitle);
    const pending = assignments.filter(a => !submittedTitles.includes(a.title));
    document.getElementById('pendingAssignments').textContent = pending.length;
    
    const gradedScores = grades.map(g => parseInt(g.score));
    if (gradedScores.length > 0) {
        const average = (gradedScores.reduce((sum, score) => sum + score, 0) / gradedScores.length).toFixed(1);
        document.getElementById('averageGrade').textContent = `${average}%`;
    } else {
        document.getElementById('averageGrade').textContent = 'N/A';
    }
}

function renderCourses() {
    const grid = document.getElementById('coursesGrid');
    if (courses.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #a0aec0;"><i class="fas fa-book-open" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i><p>You are not enrolled in any courses yet.</p></div>';
        return;
    }

    grid.innerHTML = courses.map(course => `
        <div class="card">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <p><strong>Duration:</strong> ${course.duration} weeks</p>
            <p><strong>Enrollment:</strong> ${course.createdDate}</p>
            <div class="action-buttons">
                <button class="btn-primary" onclick="alert('Viewing course details for: ${course.title}')">View Course</button>
            </div>
        </div>
    `).join('');
}

function renderAssignments() {
    const tbody = document.getElementById('assignmentsTable');
    if (assignments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #a0aec0;">No assignments currently due.</td></tr>';
        return;
    }

    tbody.innerHTML = assignments.map((assignment, idx) => {
        const submission = submissions.find(s => s.assignmentTitle === assignment.title);
        const status = submission ? (grades.find(g => g.assignmentTitle === assignment.title) ? 'graded' : 'submitted') : 'pending';
        const badgeClass = status === 'submitted' ? 'badge-info' : status === 'graded' ? 'badge-success' : 'badge-pending';
        const actionButton = status === 'submitted' ?
            `<button class="btn-secondary" disabled>Submitted</button>` :
            status === 'graded' ?
            `<button class="btn-primary" onclick="openFeedbackModal('${assignment.title}')">View Grade</button>` :
            `<button class="btn-primary" onclick="openSubmitModal(${idx})">Submit</button>`;

        return `
            <tr>
                <td>${assignment.title}</td>
                <td>${assignment.courseName}</td>
                <td>${assignment.dueDate}</td>
                <td><span class="badge ${badgeClass}">${status}</span></td>
                <td>${actionButton}</td>
            </tr>
        `;
    }).join('');
}

function renderGrades() {
    const tbody = document.getElementById('gradesTable');
    const submissionsAndGrades = assignments.map(assignment => {
        const submission = submissions.find(s => s.assignmentTitle === assignment.title);
        const grade = grades.find(g => g.assignmentTitle === assignment.title);
        return {
            title: assignment.title,
            courseName: assignment.courseName,
            status: grade ? 'Graded' : submission ? 'Submitted' : 'Missing',
            score: grade ? `${grade.score}/100` : 'N/A',
            feedback: grade ? grade.feedback : 'N/A'
        };
    });

    if (submissionsAndGrades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #a0aec0;">No grades available yet.</td></tr>';
        return;
    }

    tbody.innerHTML = submissionsAndGrades.map(item => {
        const badgeClass = item.status === 'Graded' ? 'badge-success' : item.status === 'Submitted' ? 'badge-info' : 'badge-danger';
        return `
            <tr>
                <td>${item.title}</td>
                <td>${item.courseName}</td>
                <td>${item.score}</td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
                <td>${item.status === 'Graded' ? `<button class="btn-secondary" onclick="openFeedbackModal('${item.title}')">View Feedback</button>` : '---'}</td>
            </tr>
        `;
    }).join('');
}

// --- Modal Functions ---

function openSubmitModal(idx) {
    const assignment = assignments[idx];
    document.getElementById('submissionAssignmentTitle').value = assignment.title;
    document.getElementById('submitAssignmentModal').querySelector('form').dataset.assignmentIdx = idx;
    openModal('submitAssignmentModal');
}

function openFeedbackModal(assignmentTitle) {
    const grade = grades.find(g => g.assignmentTitle === assignmentTitle);
    if (grade) {
        document.getElementById('feedbackAssignment').textContent = assignmentTitle;
        document.getElementById('feedbackScore').textContent = grade.score;
        document.getElementById('feedbackText').value = grade.feedback;
        openModal('feedbackModal');
    } else {
        alert('Grade and feedback not yet available.');
    }
}

function handleSubmitAssignment(e) {
    e.preventDefault();
    const idx = e.target.dataset.assignmentIdx;
    const assignment = assignments[idx];
    const submissionContent = document.getElementById('submissionContent').value;
    
    // Create new submission object
    const newSubmission = {
        id: submissions.length + 1,
        studentName: document.getElementById('student-name').textContent,
        assignmentTitle: assignment.title,
        courseName: assignment.courseName,
        submittedDate: new Date().toLocaleDateString(),
        status: 'submitted',
        content: submissionContent,
        // File is not actually uploaded, just recorded its presence
        hasFile: document.getElementById('submissionFile').files.length > 0
    };

    // Add to student submissions (and implicitly, the teacher's toGrade list)
    submissions.push(newSubmission);
    localStorage.setItem('studentSubmissions', JSON.stringify(submissions));
    
    showSuccess(`Successfully submitted: ${assignment.title}!`);
    closeModal('submitAssignmentModal');
    loadData();
    document.getElementById('submitAssignmentModal').querySelector('form').reset();
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// --- Chart Functions ---

function initCharts() {
    const completedCount = grades.length;
    const submittedCount = submissions.filter(s => !grades.find(g => g.assignmentTitle === s.assignmentTitle)).length;
    const pendingCount = assignments.length - (completedCount + submittedCount);
    
    // Chart 1: Assignment Completion Rate (Pie/Doughnut)
    if (charts.completion) charts.completion.destroy();
    const completionCtx = document.getElementById('completionChart');
    if (completionCtx) {
        charts.completion = new Chart(completionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Graded', 'Submitted (Pending Grade)', 'Missing'],
                datasets: [{
                    data: [completedCount, submittedCount, pendingCount],
                    backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#cbd5e0' } },
                    title: { display: true, text: `Total: ${assignments.length} Assignments`, color: '#a0aec0' }
                }
            }
        });
    }

    // Chart 2: Recent Grades (Line Chart)
    if (charts.recentGrades) charts.recentGrades.destroy();
    const recentGradesCtx = document.getElementById('recentGradesChart');
    const recentGrades = grades.sort((a, b) => new Date(a.gradedDate) - new Date(b.gradedDate));
    const gradeLabels = recentGrades.map(g => g.assignmentTitle);
    const gradeScores = recentGrades.map(g => parseInt(g.score));

    if (recentGradesCtx) {
        charts.recentGrades = new Chart(recentGradesCtx, {
            type: 'line',
            data: {
                labels: gradeLabels.length > 0 ? gradeLabels : ['No Grades Yet'],
                datasets: [{
                    label: 'Score (%)',
                    data: gradeScores,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#cbd5e0' } }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: { color: '#a0aec0' },
                        grid: { color: '#16213e' }
                    },
                    x: {
                        ticks: { color: '#a0aec0' },
                        grid: { color: '#16213e' }
                    }
                }
            }
        });
    }
}

// --- Utility Functions ---

function showSuccess(msg) {
    const el = document.getElementById('successMessage');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

function handleLogout() {
    localStorage.removeItem('user');
    // Assuming there is a login.html page to redirect to
    window.location.href = 'login.html';
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}