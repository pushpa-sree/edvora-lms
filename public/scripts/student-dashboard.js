// Load user data from localStorage and update UI
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // Update student name in welcome text
        document.getElementById('studentName').textContent = user.name;
        
        // Update header user info
        document.getElementById('headerUserName').textContent = user.name;
        document.getElementById('headerUserEmail').textContent = user.email;
        
        // Update avatar with first letter of name
        document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
    } else {
        // Redirect to login if no user found
        window.location.href = '/login.html';
    }
});

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchBar').value.trim();
    if (searchTerm) {
        console.log('Searching for:', searchTerm);
        alert(`Searching for: ${searchTerm}`);
        // Add your search logic here
    }
}

// Enter key search
document.getElementById('searchBar').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Tab functionality
const tabs = document.querySelectorAll('.nav-tabs button');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Handle main tabs
        const target = tab.dataset.tab;
        if(target){
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        }
        // Handle assignment status tabs
        const status = tab.dataset.status;
        if(status){
            const allStatusBtns = tab.parentElement.querySelectorAll('button');
            allStatusBtns.forEach(b => b.classList.remove('active'));
            tab.classList.add('active');
            renderAssignments(status);
        }
    });
});

// Mock Data
const courses = [
    {title: "Python Basics", progress: 70},
    {title: "Web Development", progress: 50},
    {title: "Data Science Intro", progress: 30},
];

const assignments = [
    {title: "Python Assignment", status: "upcoming", due: "2025-10-20"},
    {title: "Web Dev Project", status: "submitted", due: "2025-10-15"},
    {title: "Data Science Quiz", status: "graded", due: "2025-10-10"},
];

const grades = [
    {course: "Python Basics", grade: "A"},
    {course: "Web Development", grade: "B+"},
    {course: "Data Science Intro", grade: "B"},
];

const threads = [
    {user: "Rahul", message: "How to solve assignment 1?", time: "2h ago"},
    {user: "Meena", message: "Can someone explain topic 3?", time: "5h ago"},
];

const peers = [
    {name: "Amit", course: "Python Basics"},
    {name: "Neha", course: "Web Development"},
];

const certificates = [
    {title: "Python Basics Certificate"},
    {title: "Web Dev Certificate"},
];

// Render Courses
const coursesGrid = document.getElementById('coursesGrid');
if (coursesGrid) {
    courses.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${c.title}</h3>
            <p>Progress: ${c.progress}%</p>
            <div style="background:#16213e;height:10px;border-radius:5px;overflow:hidden;">
                <div style="width:${c.progress}%;background:#667eea;height:10px;"></div>
            </div>`;
        coursesGrid.appendChild(card);
    });
}

// Render Assignments
function renderAssignments(status){
    const container = document.getElementById('assignmentsList');
    if (container) {
        container.innerHTML = '';
        assignments.filter(a => a.status === status).forEach(a => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `<h3>${a.title}</h3>
            <p>Status: <span class="badge badge-${status==='upcoming'?'pending':status==='graded'?'success':'info'}">${a.status}</span></p>
            <p>Due: ${a.due}</p>`;
            container.appendChild(div);
        });
    }
}
renderAssignments('upcoming');

// Render Grades
const gradesGrid = document.getElementById('gradesGrid');
if (gradesGrid) {
    grades.forEach(g => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${g.course}</h3><p>Grade: ${g.grade}</p>`;
        gradesGrid.appendChild(card);
    });
}

// Render Forum Threads
const threadsList = document.getElementById('threadsList');
function renderThreads(){
    if (threadsList) {
        threadsList.innerHTML = '';
        threads.forEach(t => {
            const div = document.createElement('div');
            div.className = 'discussion-thread';
            div.innerHTML = `<h4>${t.user}</h4>
                <div class="chat-bubble">${t.message}</div>
                <div class="chat-meta">${t.time}</div>`;
            threadsList.appendChild(div);
        });
    }
}
renderThreads();

const postThreadBtn = document.getElementById('postThreadBtn');
if (postThreadBtn) {
    postThreadBtn.addEventListener('click', () => {
        const msg = document.getElementById('newThread').value.trim();
        if(msg){
            threads.unshift({user:"You", message: msg, time:"Just now"});
            document.getElementById('newThread').value = '';
            renderThreads();
        }
    });
}

// Render Peers
const peersGrid = document.getElementById('peersGrid');
if (peersGrid) {
    peers.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${p.name}</h3><p>Course: ${p.course}</p>
        <button class="btn-primary">Connect</button>`;
        peersGrid.appendChild(card);
    });
}

// Render Certificates
const certificatesGrid = document.getElementById('certificatesGrid');
if (certificatesGrid) {
    certificates.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${c.title}</h3>
        <button class="btn-primary">Download</button>
        <button class="btn-secondary">Share</button>`;
        certificatesGrid.appendChild(card);
    });
}

// Profile Save
const saveProfileBtn = document.getElementById('saveProfileBtn');
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
        const name = document.getElementById('profileName').value;
        const bio = document.getElementById('profileBio').value;
        const profileMessage = document.getElementById('profileMessage');
        if (profileMessage) {
            profileMessage.classList.add('show');
            setTimeout(()=>profileMessage.classList.remove('show'),2000);
        }
    });
}