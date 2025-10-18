const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.json({ 
                success: false, 
                message: 'All fields required' 
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Create user with Passport
        const user = new User({
            email: email.toLowerCase(),
            name,
            role
        });

        // Register method from passport-local-mongoose
        await User.register(user, password);

        // Create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Register error:', err);
        res.json({ 
            success: false, 
            message: err.message 
        });
    }
});

// LOGIN
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ 
                success: false, 
                message: 'Email and password required' 
            });
        }

        // Use Passport authenticate
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error('Auth error:', err);
                return res.json({ 
                    success: false, 
                    message: 'Authentication error' 
                });
            }

            if (!user) {
                console.log('User not found or password wrong:', email);
                return res.json({ 
                    success: false, 
                    message: 'Invalid email or password' 
                });
            }

            // Login user
            req.logIn(user, (err) => {
                if (err) {
                    console.error('Login error:', err);
                    return res.json({ 
                        success: false, 
                        message: 'Login failed' 
                    });
                }

                // Create JWT
                const token = jwt.sign(
                    { id: user._id, email: user.email, role: user.role },
                    process.env.JWT_SECRET || 'your_secret_key',
                    { expiresIn: '7d' }
                );

                // Set cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                console.log('Login successful:', user.email, 'Role:', user.role);
                res.json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            });
        })(req, res, next);

    } catch (err) {
        console.error('Login error:', err);
        res.json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// VERIFY
router.get('/verify', (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: 'No token' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        res.json({ success: true, user: decoded });
    } catch (err) {
        res.json({ success: false, message: 'Token invalid' });
    }
});

// LOGOUT
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.json({ success: false });
        }
        res.clearCookie('token');
        res.json({ success: true, message: 'Logged out' });
    });
});

module.exports = router;
