// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session 
app.use(session({
    secret: process.env.SECRET || 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// passport
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongodb
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/LMShackathon')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/main.html')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});