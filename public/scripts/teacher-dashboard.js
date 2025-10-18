let courses = [];
let assignments = [];
let students = [];
let submissions = [];
let attendanceRecords = [];
let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user')) || { name: "Teacher" };
    document.getElementById('teacher-name').textContent = user.name;

    setupTabNavigation();
    loadData();
    initCharts();
});

function setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Assignment status tabs
    document.querySelectorAll('[data-status]').forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            const allStatusBtns = this.parentElement.querySelectorAll('button');
            allStatusBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderAssignments(status);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'analytics') {
        setTimeout(() => initCharts(), 100);
    } else if (tabName === 'attendance') {
        populateAttendanceCourseSelect();
    }
}

function loadData() {
    courses = JSON.parse(localStorage.getItem('teacherCourses')) || [];
    assignments = JSON.parse(localStorage.getItem('teacherAssignments')) || [];
    students = JSON.parse(localStorage.getItem('enrolledStudents')) || [];
    submissions = JSON.parse(localStorage.getItem('studentSubmissions')) || [];
    attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    
    updateStats();
    renderCourses();
    renderAssignments('all');
    renderStudents();
    renderSubmissions();
    populateAssignmentCourseSelect();
    populateAttendanceCourseSelect();
}

function updateStats() {
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('pendingAssignments').textContent = assignments.filter(a => !a.isCompleted).length;
    document.getElementById('toGrade').textContent = submissions.filter(s => s.status === 'submitted').length;
}

function renderCourses() {
    const grid = document.getElementById('coursesGrid');
    if (courses.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #a0aec0;"><i class="fas fa-book" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i><p>No courses created yet. Create your first course!</p></div>';
        return;
    }

    grid.innerHTML = courses.map((course, idx) => `
        <div class="card">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <p><strong>Code:</strong> ${course.code}</p>
            <p><strong>Duration:</strong> ${course.duration} weeks</p>
            <p><strong>Students:</strong> ${students.filter(s => s.course === course.title).length}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.floor(Math.random() * 60) + 40}%"></div>
            </div>
            <div class="action-buttons">
                <button class="btn-secondary" onclick="editCourse(${idx})">Edit</button>
                <button class="btn-danger" onclick="deleteCourse(${idx})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderAssignments(status) {
    const grid = document.getElementById('assignmentsGrid');
    let filteredAssignments = assignments;
    
    if (status === 'active') {
        filteredAssignments = assignments.filter(a => !a.isCompleted);
    } else if (status === 'graded') {
        filteredAssignments = assignments.filter(a => a.isCompleted);
    }
    
    if (filteredAssignments.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #a0aec0;"><i class="fas fa-tasks" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i><p>No assignments found.</p></div>';
        return;
    }

    grid.innerHTML = filteredAssignments.map((assignment, idx) => `
        <div class="card">
            <h3>${assignment.title}</h3>
            <p>${assignment.instructions}</p>
            <p><strong>Course:</strong> ${assignment.courseName}</p>
            <p><strong>Due:</strong> ${new Date(assignment.dueDate).toLocaleString()}</p>
            <p><strong>Points:</strong> ${assignment.points}</p>
            <span class="badge ${assignment.isCompleted ? 'badge-success' : 'badge-pending'}">${assignment.isCompleted ? 'Graded' : 'Active'}</span>
            <div class="action-buttons" style="margin-top: 10px;">
                <button class="btn-secondary" onclick="editAssignment(${idx})">Edit</button>
                <button class="btn-danger" onclick="deleteAssignment(${idx})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderStudents() {
    const tbody = document.getElementById('studentsTable');
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #a0aec0;">No students enrolled yet</td></tr>';
        return;
    }

    tbody.innerHTML = students.map((student, idx) => {
        const attendanceRate = calculateAttendanceRate(student.name);
        return `
        <tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.enrollmentDate}</td>
            <td>${attendanceRate}%</td>
            <td><span class="badge badge-success">Active</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="viewStudentDetails(${idx})">View</button>
                    <button class="btn-danger" onclick="removeStudent(${idx})">Remove</button>
                </div>
            </td>
        </tr>
    `}).join('');
}

function renderSubmissions() {
    const tbody = document.getElementById('submissionsTable');
    if (submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #a0aec0;">No submissions yet</td></tr>';
        return;
    }

    tbody.innerHTML = submissions.map((sub, idx) => `
        <tr>
            <td>${sub.studentName}</td>
            <td>${sub.assignmentTitle}</td>
            <td>${sub.courseName}</td>
            <td>${sub.submittedDate}</td>
            <td><span class="badge ${sub.status === 'submitted' ? 'badge-pending' : 'badge-success'}">${sub.status}</span></td>
            <td>
                ${sub.status === 'submitted' ? 
                    <button class="btn-secondary" onclick="openGradeModal(${idx})">Grade</button> : 
                    <span style="color: #a0aec0;">Graded: ${sub.score}/100</span>
                }
            </td>
        </tr>
    `).join('');
}

function populateAssignmentCourseSelect() {
    const select = document.getElementById('assignmentCourse');
    const options = '<option value="">Choose a course...</option>' + courses.map((c, idx) => <option value="${idx}">${c.title}</option>).join('');
    select.innerHTML = options;
}

function populateAttendanceCourseSelect() {
    const select = document.getElementById('attendanceCourseSelect');
    const modalSelect = document.getElementById('attendanceCourse');
    const options = '<option value="">Choose a course...</option>' + courses.map((c, idx) => <option value="${idx}">${c.title}</option>).join('');
    select.innerHTML = options;
    modalSelect.innerHTML = options;
}

function handleCreateCourse(e) {
    e.preventDefault();
    const course = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        duration: document.getElementById('courseDuration').value,
        code: document.getElementById('courseCode').value,
        createdDate: new Date().toLocaleDateString()
    };

    courses.push(course);
    localStorage.setItem('teacherCourses', JSON.stringify(courses));
    
    showSuccess('Course created successfully!');
    closeModal('createCourseModal');
    loadData();
    document.getElementById('createCourseModal').querySelector('form').reset();
}

function handleCreateAssignment(e) {
    e.preventDefault();
    const courseIdx = document.getElementById('assignmentCourse').value;
    const assignment = {
        title: document.getElementById('assignmentTitle').value,
        instructions: document.getElementById('assignmentInstructions').value,
        dueDate: document.getElementById('assignmentDueDate').value,
        points: document.getElementById('assignmentPoints').value,
        courseName: courses[courseIdx].title,
        courseIdx: courseIdx,
        isCompleted: false,
        createdDate: new Date().toLocaleDateString()
    };

    assignments.push(assignment);
    localStorage.setItem('teacherAssignments', JSON.stringify(assignments));
    
    showSuccess('Assignment created successfully!');
    closeModal('createAssignmentModal');
    loadData();
    document.getElementById('createAssignmentModal').querySelector('form').reset();
}

function handleTakeAttendance(e) {
    e.preventDefault();
    const courseIdx = document.getElementById('attendanceCourse').value;
    const date = document.getElementById('attendanceModalDate').value;
    
    const checkboxes = document.querySelectorAll('.attendance-checkbox:checked');
    const presentStudents = Array.from(checkboxes).map(cb => cb.dataset.studentId);
    
    // Get all students for this course
    const courseStudents = students.filter(s => s.course === courses[courseIdx].title);
    
    courseStudents.forEach(student => {
        const record = {
            studentName: student.name,
            course: courses[courseIdx].title,
            date: date,
            status: presentStudents.includes(student.name) ? 'present' : 'absent'
        };
        
        // Check if record already exists for this date and student
        const existingIndex = attendanceRecords.findIndex(r => 
            r.studentName === student.name && r.date === date && r.course === courses[courseIdx].title
        );
        
        if (existingIndex !== -1) {
            attendanceRecords[existingIndex] = record;
        } else {
            attendanceRecords.push(record);
        }
    });
    
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    
    showSuccess('Attendance recorded successfully!');
    closeModal('takeAttendanceModal');
    loadData();
}

function handleGradeSubmission(e) {
    e.preventDefault();
    const idx = e.target.dataset.submissionIdx;
    submissions[idx].score = document.getElementById('gradeScore').value;
    submissions[idx].feedback = document.getElementById('gradeFeedback').value;
    submissions[idx].status = 'graded';
    submissions[idx].gradedDate = new Date().toLocaleDateString();

    // Mark assignment as completed
    const assignmentTitle = submissions[idx].assignmentTitle;
    const assignmentIdx = assignments.findIndex(a => a.title === assignmentTitle);
    if (assignmentIdx !== -1) {
        assignments[assignmentIdx].isCompleted = true;
    }
    
    localStorage.setItem('studentSubmissions', JSON.stringify(submissions));
    localStorage.setItem('teacherAssignments', JSON.stringify(assignments));
    
    showSuccess('Submission graded successfully!');
    closeModal('gradeModal');
    loadData();
}

function openGradeModal(idx) {
    const sub = submissions[idx];
    document.getElementById('gradingStudentName').value = sub.studentName;
    document.getElementById('gradingAssignmentName').value = sub.assignmentTitle;
    document.getElementById('gradeModal').querySelector('form').dataset.submissionIdx = idx;
    openModal('gradeModal');
}

function openCreateCourseModal() {
    openModal('createCourseModal');
}

function openCreateAssignmentModal() {
    openModal('createAssignmentModal');
}

function openTakeAttendanceModal() {
    const courseSelect = document.getElementById('attendanceCourse');
    if (courses.length === 0) {
        alert('Please create a course first');
        return;
    }
    
    // Populate student list for selected course
    courseSelect.addEventListener('change', function() {
        const courseIdx = this.value;
        if (courseIdx === "") return;
        
        const studentList = document.getElementById('attendanceStudentList');
        const courseStudents = students.filter(s => s.course === courses[courseIdx].title);
        
        if (courseStudents.length === 0) {
            studentList.innerHTML = '<p style="color: #a0aec0; text-align: center;">No students enrolled in this course</p>';
            return;
        }
        
        studentList.innerHTML = courseStudents.map(student => `
            <div class="attendance-student">
                <span>${student.name}</span>
                <div class="attendance-actions">
                    <label>
                        <input type="checkbox" class="attendance-checkbox" data-student-id="${student.name}" checked>
                        Present
                    </label>
                </div>
            </div>
        `).join('');
    });
    
    // Set default date to today
    document.getElementById('attendanceModalDate').valueAsDate = new Date();
    
    openModal('takeAttendanceModal');
}

function loadAttendanceRecords() {
    const courseIdx = document.getElementById('attendanceCourseSelect').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (courseIdx === "" || date === "") {
        alert('Please select both course and date');
        return;
    }
    
    const courseName = courses[courseIdx].title;
    const tbody = document.getElementById('attendanceTable');
    
    const records = attendanceRecords.filter(r => r.course === courseName && r.date === date);
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #a0aec0;">No attendance records found for this date</td></tr>';
        return;
    }
    
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.studentName}</td>
            <td>${record.course}</td>
            <td>${record.date}</td>
            <td><span class="badge ${record.status === 'present' ? 'badge-present' : 'badge-absent'}">${record.status}</span></td>
            <td>
                <button class="btn-secondary" onclick="editAttendance('${record.studentName}', '${record.course}', '${record.date}')">Edit</button>
            </td>
        </tr>
    `).join('');
}

function calculateAttendanceRate(studentName) {
    const studentRecords = attendanceRecords.filter(r => r.studentName === studentName);
    if (studentRecords.length === 0) return 0;
    
    const presentCount = studentRecords.filter(r => r.status === 'present').length;
    return Math.round((presentCount / studentRecords.length) * 100);
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function deleteCourse(idx) {
    if (confirm('Are you sure you want to delete this course?')) {
        courses.splice(idx, 1);
        localStorage.setItem('teacherCourses', JSON.stringify(courses));
        loadData();
        showSuccess('Course deleted successfully');
    }
}

function deleteAssignment(idx) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        assignments.splice(idx, 1);
        localStorage.setItem('teacherAssignments', JSON.stringify(assignments));
        loadData();
        showSuccess('Assignment deleted successfully');
    }
}

function removeStudent(idx) {
    if (confirm('Are you sure you want to remove this student?')) {
        students.splice(idx, 1);
        localStorage.setItem('enrolledStudents', JSON.stringify(students));
        loadData();
        showSuccess('Student removed successfully');
    }
}

function editCourse(idx) {
    // Implementation for editing a course
    alert('Edit course functionality would go here');
}

function editAssignment(idx) {
    // Implementation for editing an assignment
    alert('Edit assignment functionality would go here');
}

function viewStudentDetails(idx) {
    // Implementation for viewing student details
    alert('View student details functionality would go here');
}

function editAttendance(studentName, course, date) {
    // Implementation for editing attendance
    alert('Edit attendance for ${studentName} in ${course} on ${date}');
}

function initCharts() {
    const courseNames = courses.map(c => c.title);
    const attendanceData = students.length > 0 ? courseNames.map(() => Math.floor(Math.random() * 40) + 60) : [];
    const gradesData = submissions.length > 0 ? [15, 25, 20, 10, 8, 2] : [0, 0, 0, 0, 0, 0];
    const submissionRate = assignments.length > 0 ? [(submissions.length / assignments.length) * 100, ((assignments.length - submissions.length) / assignments.length) * 100] : [0, 100];
    const performanceData = students.length > 0 ? [5, 10, 15, 8, 3] : [0, 0, 0, 0, 0];

    // Attendance Chart
    if (charts.attendance) charts.attendance.destroy();
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        charts.attendance = new Chart(attendanceCtx, {
            type: 'bar',
            data: {
                labels: courseNames.length > 0 ? courseNames : ['No Data'],
                datasets: [{
                    label: 'Attendance %',
                    data: attendanceData,
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: '#667eea',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e0' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
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

    // Grades Chart
    if (charts.grades) charts.grades.destroy();
    const gradesCtx = document.getElementById('gradesChart');
    if (gradesCtx) {
        charts.grades = new Chart(gradesCtx, {
            type: 'doughnut',
            data: {
                labels: ['90-100', '80-89', '70-79', '60-69', '50-59', 'Below 50'],
                datasets: [{
                    data: gradesData,
                    backgroundColor: [
                        '#27ae60',
                        '#3498db',
                        '#f39c12',
                        '#e67e22',
                        '#e74c3c',
                        '#c0392b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e0' }
                    }
                }
            }
        });
    }

    // Submission Chart
    if (charts.submission) charts.submission.destroy();
    const submissionCtx = document.getElementById('submissionChart');
    if (submissionCtx) {
        charts.submission = new Chart(submissionCtx, {
            type: 'pie',
            data: {
                labels: ['Submitted', 'Not Submitted'],
                datasets: [{
                    data: submissionRate,
                    backgroundColor: [
                        '#27ae60',
                        '#e74c3c'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e0' }
                    }
                }
            }
        });
    }

    // Performance Chart
    if (charts.performance) charts.performance.destroy();
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        charts.performance = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                datasets: [{
                    label: 'Average Score',
                    data: performanceData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e0' }
                    }
                },
                scales: {
                    y: {
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

function showSuccess(msg) {
    const el = document.getElementById('successMessage');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

function handleLogout() {
    localStorage.removeItem('user');
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

// Initialize with sample data including AI and ML courses
if (!localStorage.getItem('teacherCourses') || JSON.parse(localStorage.getItem('teacherCourses')).length === 0) {
    const sampleCourses = [
        {
            title: "Python Programming",
            description: "Introduction to Python programming language and fundamentals",
            duration: "12",
            code: "CS101",
            createdDate: new Date().toLocaleDateString()
        },
        {
            title: "Web Development",
            description: "Building modern web applications with HTML, CSS, and JavaScript",
            duration: "10",
            code: "CS102",
            createdDate: new Date().toLocaleDateString()
        },
        {
            title: "Artificial Intelligence",
            description: "Fundamentals of AI, machine learning, and neural networks",
            duration: "14",
            code: "CS201",
            createdDate: new Date().toLocaleDateString()
        },
        {
            title: "Machine Learning",
            description: "Advanced ML algorithms, deep learning, and data science applications",
            duration: "16",
            code: "CS202",
            createdDate: new Date().toLocaleDateString()
        }
    ];
    localStorage.setItem('teacherCourses', JSON.stringify(sampleCourses));
}

if (!localStorage.getItem('enrolledStudents') || JSON.parse(localStorage.getItem('enrolledStudents')).length === 0) {
    const sampleStudents = [
        {
            name: "John Doe",
            email: "john@example.com",
            course: "Python Programming",
            enrollmentDate: new Date().toLocaleDateString()
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            course: "Web Development",
            enrollmentDate: new Date().toLocaleDateString()
        },
        {
            name: "Bob Johnson",
            email: "bob@example.com",
            course: "Python Programming",
            enrollmentDate: new Date().toLocaleDateString()
        },
        {
            name: "Alice Brown",
            email: "alice@example.com",
            course: "Artificial Intelligence",
            enrollmentDate: new Date().toLocaleDateString()
        },
        {
            name: "Charlie Wilson",
            email: "charlie@example.com",
            course: "Machine Learning",
            enrollmentDate: new Date().toLocaleDateString()
        },
        {
            name: "Diana Lee",
            email: "diana@example.com",
            course: "Artificial Intelligence",
            enrollmentDate: new Date().toLocaleDateString()
        },
        {
            name: "Ethan Davis",
            email: "ethan@example.com",
            course: "Machine Learning",
            enrollmentDate: new Date().toLocaleDateString()
        },
        {
            name: "Fiona Garcia",
            email: "fiona@example.com",
            course: "Web Development",
            enrollmentDate: new Date().toLocaleDateString()
        }
    ];
    localStorage.setItem('enrolledStudents', JSON.stringify(sampleStudents));
}

// Add sample assignments for the new courses
if (!localStorage.getItem('teacherAssignments') || JSON.parse(localStorage.getItem('teacherAssignments')).length === 0) {
    const sampleAssignments = [
        {
            title: "Python Basics Assignment",
            instructions: "Complete the Python fundamentals exercises",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            points: 100,
            courseName: "Python Programming",
            courseIdx: 0,
            isCompleted: false,
            createdDate: new Date().toLocaleDateString()
        },
        {
            title: "Web Design Project",
            instructions: "Create a responsive website using HTML and CSS",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            points: 150,
            courseName: "Web Development",
            courseIdx: 1,
            isCompleted: false,
            createdDate: new Date().toLocaleDateString()
        },
        {
            title: "AI Problem Set 1",
            instructions: "Solve the search algorithms and heuristic functions problems",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            points: 100,
            courseName: "Artificial Intelligence",
            courseIdx: 2,
            isCompleted: false,
            createdDate: new Date().toLocaleDateString()
        },
        {
            title: "ML Model Implementation",
            instructions: "Implement and train a linear regression model from scratch",
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            points: 200,
            courseName: "Machine Learning",
            courseIdx: 3,
            isCompleted: false,
            createdDate: new Date().toLocaleDateString()
        },
        {
            title: "Neural Networks Lab",
            instructions: "Build and train a simple neural network for classification",
            dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            points: 250,
            courseName: "Machine Learning",
            courseIdx: 3,
            isCompleted: false,
            createdDate: new Date().toLocaleDateString()
        }
    ];
    localStorage.setItem('teacherAssignments', JSON.stringify(sampleAssignments));
}

// Add sample submissions
if (!localStorage.getItem('studentSubmissions') || JSON.parse(localStorage.getItem('studentSubmissions')).length === 0) {
    const sampleSubmissions = [
        {
            studentName: "John Doe",
            assignmentTitle: "Python Basics Assignment",
            courseName: "Python Programming",
            submittedDate: new Date().toLocaleDateString(),
            status: "submitted"
        },
        {
            studentName: "Alice Brown",
            assignmentTitle: "AI Problem Set 1",
            courseName: "Artificial Intelligence",
            submittedDate: new Date().toLocaleDateString(),
            status: "submitted"
        },
        {
            studentName: "Charlie Wilson",
            assignmentTitle: "ML Model Implementation",
            courseName: "Machine Learning",
            submittedDate: new Date().toLocaleDateString(),
            status: "graded",
            score: 85,
            feedback: "Good implementation, but needs better documentation"
        }
    ];
    localStorage.setItem('studentSubmissions', JSON.stringify(sampleSubmissions));
}