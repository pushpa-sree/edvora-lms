function validateRegister(req, res, next) {
    const { name, email, password, role } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // check if password exists
    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required!' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters!' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format!' });
    }

    if (role !== 'student' && role !== 'teacher') {
        return res.status(400).json({ success: false, message: 'Invalid role! Must be student or teacher.' });
    }

    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required!' });
    }
    next();
}

module.exports = { validateRegister, validateLogin };
