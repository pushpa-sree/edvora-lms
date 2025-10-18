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

        // Render Assignments
        function renderAssignments(status){
            const container = document.getElementById('assignmentsList');
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
        renderAssignments('upcoming');

        // Render Grades
        const gradesGrid = document.getElementById('gradesGrid');
        grades.forEach(g => {
            const card = document.createElement('div');
            card.className = 'card';
        //    card.innerHTML = <h3>${g.course}</h3><p>Grade: ${g.grade}</p>;

            gradesGrid.appendChild(card);
        });

        // Render Forum Threads
        const threadsList = document.getElementById('threadsList');
        function renderThreads(){
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
        renderThreads();

        document.getElementById('postThreadBtn').addEventListener('click', () => {
            const msg = document.getElementById('newThread').value.trim();
            if(msg){
                threads.unshift({user:"You", message: msg, time:"Just now"});
                document.getElementById('newThread').value = '';
                renderThreads();
            }
        });

        // Render Peers
        const peersGrid = document.getElementById('peersGrid');
        peers.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${p.name}</h3><p>Course: ${p.course}</p>
            <button class="btn-primary">Connect</button>`;
            peersGrid.appendChild(card);
        });

        // Render Certificates
        const certificatesGrid = document.getElementById('certificatesGrid');
        certificates.forEach(c => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${c.title}</h3>
            <button class="btn-primary">Download</button>
            <button class="btn-secondary">Share</button>`;
            certificatesGrid.appendChild(card);
        });

        // Profile Save
        document.getElementById('saveProfileBtn').addEventListener('click', () => {
            const name = document.getElementById('profileName').value;
            const bio = document.getElementById('profileBio').value;
            document.getElementById('profileMessage').classList.add('show');
            setTimeout(()=>document.getElementById('profileMessage').classList.remove('show'),2000);
        });