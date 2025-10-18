 let courses = [];
    let assignments = [];
    let students = [];
    let submissions = [];
    let charts = {};

    document.addEventListener('DOMContentLoaded', function() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        document.getElementById('teacher-name').textContent = user.name;
      }

      setupTabNavigation();
      loadData();
    });

    function setupTabNavigation() {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const tabName = this.getAttribute('data-tab');
          switchTab(tabName);
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
      }
    }

    function loadData() {
      courses = JSON.parse(localStorage.getItem('teacherCourses')) || [];
      assignments = JSON.parse(localStorage.getItem('teacherAssignments')) || [];
      students = JSON.parse(localStorage.getItem('enrolledStudents')) || [];
      submissions = JSON.parse(localStorage.getItem('studentSubmissions')) || [];
      
      updateStats();
      renderCourses();
      renderAssignments();
      renderStudents();
      renderSubmissions();
      populateAssignmentCourseSelect();
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
          <p><strong>Duration:</strong> ${course.duration} weeks</p>
          <p><strong>Created:</strong> ${course.createdDate}</p>
          <div class="action-buttons">
            <button class="btn-secondary" onclick="deleteCourse(${idx})">Delete</button>
          </div>
        </div>
      `).join('');
    }

    function renderAssignments() {
      const grid = document.getElementById('assignmentsGrid');
      if (assignments.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #a0aec0;"><i class="fas fa-tasks" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i><p>No assignments created yet.</p></div>';
        return;
      }

      grid.innerHTML = assignments.map((assignment, idx) => `
        <div class="card">
          <h3>${assignment.title}</h3>
          <p>${assignment.instructions}</p>
          <p><strong>Course:</strong> ${assignment.courseName}</p>
          <p><strong>Due:</strong> ${assignment.dueDate}</p>
          <span class="badge badge-pending">Pending</span>
          <div class="action-buttons" style="margin-top: 10px;">
            <button class="btn-danger" onclick="deleteAssignment(${idx})">Delete</button>
          </div>
        </div>
      `).join('');
    }

    function renderStudents() {
      const tbody = document.getElementById('studentsTable');
      if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #a0aec0;">No students enrolled yet</td></tr>';
        return;
      }

      tbody.innerHTML = students.map((student, idx) => `
        <tr>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.course}</td>
          <td>${student.enrollmentDate}</td>
          <td>${Math.floor(Math.random() * 40) + 60}%</td>
          <td><span class="badge badge-success">Active</span></td>
        </tr>
      `).join('');
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
            ${sub.status === 'submitted' ? `<button class="btn-secondary" onclick="openGradeModal(${idx})">Grade</button>` : `<span style="color: #a0aec0;">Graded: ${sub.score}/100</span>`}
          </td>
        </tr>
      `).join('');
    }

    function populateAssignmentCourseSelect() {
      const select = document.getElementById('assignmentCourse');
      const options = '<option value="">Choose a course...</option>' + courses.map((c, idx) => `<option value="${idx}">${c.title}</option>`).join('');
      select.innerHTML = options;
    }

    function handleCreateCourse(e) {
      e.preventDefault();
      const course = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        duration: document.getElementById('courseDuration').value,
        createdDate: new Date().toLocaleDateString()
      };

      courses.push(course);
      localStorage.setItem('teacherCourses', JSON.stringify(courses));
      
      // Also add to student's enrolled courses
      let enrolledCourses = JSON.parse(localStorage.getItem('enrolledStudentCourses')) || [];
      enrolledCourses.push(course);
      localStorage.setItem('enrolledStudentCourses', JSON.stringify(enrolledCourses));
      
      showSuccess('Course created and synced to students!');
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
        courseName: courses[courseIdx].title,
        courseIdx: courseIdx,
        isCompleted: false,
        createdDate: new Date().toLocaleDateString()
      };

      assignments.push(assignment);
      localStorage.setItem('teacherAssignments', JSON.stringify(assignments));
      
      // Sync to student's assignment list
      let studentAssignments = JSON.parse(localStorage.getItem('teacherAssignments')) || [];
      studentAssignments = assignments;
      localStorage.setItem('teacherAssignments', JSON.stringify(studentAssignments));
      
      showSuccess('Assignment created and synced to students!');
      closeModal('createAssignmentModal');
      loadData();
      document.getElementById('createAssignmentModal').querySelector('form').reset();
    }

    function handleGradeSubmission(e) {
      e.preventDefault();
      const idx = e.target.dataset.submissionIdx;
      submissions[idx].score = document.getElementById('gradeScore').value;
      submissions[idx].feedback = document.getElementById('gradeFeedback').value;
      submissions[idx].status = 'graded';
      submissions[idx].gradedDate = new Date().toLocaleDateString();

      localStorage.setItem('studentSubmissions', JSON.stringify(submissions));
      
      // Sync grades to student's grades list
      let studentGrades = JSON.parse(localStorage.getItem('studentGrades')) || [];
      studentGrades.push({
        submissionId: idx,
        score: document.getElementById('gradeScore').value,
        feedback: document.getElementById('gradeFeedback').value,
        gradedDate: new Date().toLocaleDateString()
      });
      localStorage.setItem('studentGrades', JSON.stringify(studentGrades));
      
      showSuccess('Submission graded and synced to student!');
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

    function openModal(id) {
      document.getElementById(id).classList.add('active');
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
    }

    function deleteCourse(idx) {
      if (confirm('Are you sure?')) {
        courses.splice(idx, 1);
        localStorage.setItem('teacherCourses', JSON.stringify(courses));
        loadData();
        showSuccess('Course deleted');
      }
    }

    function deleteAssignment(idx) {
      if (confirm('Are you sure?')) {
        assignments.splice(idx, 1);
        localStorage.setItem('teacherAssignments', JSON.stringify(assignments));
        loadData();
        showSuccess('Assignment deleted');
      }
    }

    function initCharts() {
      const courseNames = courses.map(c => c.title);
      const attendanceData = students.length > 0 ? courseNames.map(() => Math.floor(Math.random() * 40) + 60) : [];
      const gradesData = submissions.length > 0 ? [15, 25, 20, 10, 8, 2] : [0, 0, 0, 0, 0, 0];
      const submissionRate = assignments.length > 0 ? [(submissions.length / assignments.length) * 100, ((assignments.length - submissions.length) / assignments.length) * 100] : [0, 100];

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