// routes/student.js - Complete Backend API
const express = require('express');
const router = express.Router();
// const { isStudent } = require('../middleware/auth'); // Uncomment later

// Mock data (replace with database later)
const mockCourses = [
    { _id: '1', name: 'Web Development', description: 'Learn HTML, CSS, JavaScript', progress: 75, thumbnail: '💻' },
    { _id: '2', name: 'Data Structures', description: 'Master algorithms', progress: 60, thumbnail: '🧠' },
    { _id: '3', name: 'Python Programming', description: 'From basics to advanced', progress: 90, thumbnail: '🐍' }
];

const mockAssignments = [
    { _id: '1', title: 'React Project', course: 'Web Development', dueDate: '2025-10-25', status: 'upcoming' },
    { _id: '2', title: 'Binary Trees', course: 'Data Structures', dueDate: '2025-10-20', status: 'upcoming' },
    { _id: '3', title: 'Flask App', course: 'Python Programming', dueDate: '2025-10-10', status: 'submitted' },
    { _id: '4', title: 'CSS Grid Layout', course: 'Web Development', dueDate: '2025-09-15', status: 'graded' }
];

const mockGrades = [
    { course: 'Web Development', grade: 85 },
    { course: 'Data Structures', grade: 78 },
    { course: 'Python Programming', grade: 92 }
];

// ========== GET COURSES ==========
router.get('/courses', (req, res) => {
    res.json({ 
        success: true, 
        courses: mockCourses
    });
});

// ========== GET ASSIGNMENTS ==========
router.get('/assignments', (req, res) => {
    res.json({ 
        success: true, 
        assignments: mockAssignments
    });
});

// ========== SUBMIT ASSIGNMENT ==========
router.post('/submit-assignment', (req, res) => {
    try {
        const { assignmentId } = req.body;
        
        const assignment = mockAssignments.find(a => a._id === assignmentId);
        if (assignment) {
            assignment.status = 'submitted';
        }
        
        res.json({ 
            success: true, 
            message: 'Assignment submitted successfully!' 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit assignment' 
        });
    }
});

// ========== GET GRADES ==========
router.get('/grades', (req, res) => {
    const overallProgress = Math.round(
        mockGrades.reduce((sum, g) => sum + g.grade, 0) / mockGrades.length
    );
    
    res.json({ 
        success: true, 
        grades: mockGrades,
        overallProgress
    });
});

// ========== UPDATE PROFILE ==========
router.put('/update-profile', async (req, res) => {
    try {
        const { name, email } = req.body;
        // Later: await User.findByIdAndUpdate(req.user._id, { name, email });
        
        res.json({ 
            success: true, 
            message: 'Profile updated successfully!' 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update profile' 
        });
    }
});

module.exports = router;