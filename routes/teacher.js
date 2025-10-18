const express = require('express');
const router = express.Router();
// const { isTeacher } = require('../middleware/auth');

// Example route
router.post('/create-course', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Course created!'
    });
});

module.exports = router;  // ← MUST HAVE THIS LINE