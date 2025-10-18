# 📚 EDVORA - Empower Your Learning Journey

> **Your Creative Learning Companion** — Transforming Education Through Innovation, Collaboration, and Personalized Growth

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/cloud/atlas)
[![Express.js](https://img.shields.io/badge/Express-4.18+-blue)](https://expressjs.com/)
[![Live](https://img.shields.io/badge/Status-Live%20on%20Render-success)](https://edvora-lms-uz2l.onrender.com)

---

## 🎯 About EDVORA

EDVORA is a modern, interactive Learning Management System (LMS) that breaks down barriers to education by creating an engaging platform where students and teachers collaborate, grow, and achieve together.

We believe education should be:
- **Accessible** - Available to everyone, everywhere
- **Interactive** - Dynamic lessons that engage learners
- **Collaborative** - Fostering community connections
- **Rewarding** - Celebrating achievements and progress
- **Personalized** - Learning at your own pace

---

## ✨ Key Features

### For Students
- 📖 **Enroll in Courses** - Browse and join courses from expert instructors
- 📝 **Submit Assignments** - Complete coursework with instant feedback
- 📊 **Track Progress** - View detailed analytics and performance metrics
- 🏆 **Earn Certificates** - Get recognized for your achievements
- 💬 **Join Discussions** - Collaborate with peers and instructors
- 📈 **View Grades** - Track your performance across all courses

### For Teachers
- 🎓 **Create Courses** - Design engaging learning experiences
- 📚 **Manage Assignments** - Create, distribute, and track submissions
- ✅ **Grade Submissions** - Evaluate student work with detailed feedback
- 👥 **View Students** - Monitor enrollment and attendance
- 📊 **Analytics Dashboard** - Track class performance and trends
- 💬 **Discussion Forums** - Facilitate Q&A and collaboration

### Platform Features
- 🔐 **Secure Authentication** - JWT-based authentication with password hashing
- 🌐 **Real-time Sync** - Instant data synchronization across all clients
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 🚀 **High Performance** - Fast load times and optimized queries
- 🔒 **Enterprise Security** - MongoDB Atlas with encrypted connections

---

## 🛠 Tech Stack

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Chart.js** - Data visualization
- **SweetAlert2** - Beautiful alerts and modals
- **Font Awesome** - Icon library

### Backend
- **Node.js & Express.js** - REST API server
- **MongoDB Atlas** - Cloud database
- **Mongoose** - Database ODM
- **Passport.js** - Authentication
- **bcryptjs** - Password hashing
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing

### Deployment
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **GitHub** - Version control

---

## 📋 Project Structure

```
LMShackathon/
├── middleware/
│   └── auth.js                    # Authentication middleware
├── models/
│   └── User.js                    # User schema
├── public/                        # Frontend files
│   ├── scripts/
│   │   ├── auth.js               # Authentication scripts
│   │   ├── main.js               # Main app scripts
│   │   ├── student-dashboard.js
│   │   └── teacher-dashboard.js
│   ├── styles/
│   │   ├── auth.css
│   │   ├── main.css
│   │   ├── student-dashboard.css
│   │   └── teacher-dashboard.css
│   ├── sources/mainSources/       # Source files
│   ├── forgot.html                # Forgot password
│   ├── login.html                 # Login page
│   ├── main.html                  # Landing page
│   ├── signup.html                # Registration
│   ├── student-dashboard.html     # Student portal
│   └── teacher-dashboard.html     # Teacher portal
├── routes/
│   ├── auth.js                    # Auth endpoints
│   ├── student.js                 # Student endpoints
│   └── teacher.js                 # Teacher endpoints
├── server.js                      # Express server
├── package.json                   # Dependencies
├── package-lock.json
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/edvora-lms.git
cd edvora-lms
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/LMShackathon?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
```

4. **Start the development server**
```bash
node server.js
```

5. **Open in browser**
```
http://localhost:5000
```

---

## 📖 API Documentation

### Authentication Endpoints

**POST /api/auth/signup**
- Register a new user
- Body: `{ name, email, password, role }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`

**POST /api/auth/logout**
- Logout user

### Student Endpoints

**GET /api/student/courses**
- Get all enrolled courses

**GET /api/student/assignments**
- Get assignments for enrolled courses

**POST /api/student/submit**
- Submit an assignment
- Body: `{ assignmentId, studentId, solution, fileName }`

**GET /api/student/submissions/:studentId**
- Get student's submissions

### Teacher Endpoints

**POST /api/teacher/courses**
- Create a new course
- Body: `{ title, description, duration, teacherId }`

**GET /api/teacher/courses/:teacherId**
- Get teacher's courses

**POST /api/teacher/assignments**
- Create an assignment
- Body: `{ title, instructions, dueDate, courseId, teacherId }`

**PUT /api/teacher/submissions/:submissionId**
- Grade a submission
- Body: `{ score, feedback }`

---

## 🎓 How to Use

### For Students

1. **Sign Up** - Create an account as a student
2. **Browse Courses** - Explore available courses on the dashboard
3. **Enroll** - Join courses that interest you
4. **Complete Assignments** - Submit your work before due dates
5. **Track Progress** - View your grades and performance metrics
6. **Participate** - Join discussion forums and connect with peers

### For Teachers

1. **Sign Up** - Create an account as a teacher
2. **Create Courses** - Design new courses with title, description, and duration
3. **Add Assignments** - Create assignments with instructions and due dates
4. **Manage Students** - View enrolled students in each course
5. **Grade Submissions** - Evaluate student work and provide feedback
6. **View Analytics** - Monitor class performance with detailed reports

---

## 📊 Database Schema

### User
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/teacher),
  createdAt: Date
}
```

### Course
```
{
  title: String,
  description: String,
  duration: Number,
  teacherId: ObjectId,
  students: [ObjectId],
  materials: [String],
  createdAt: Date
}
```

### Assignment
```
{
  title: String,
  instructions: String,
  dueDate: Date,
  courseId: ObjectId,
  teacherId: ObjectId,
  createdAt: Date
}
```

### Submission
```
{
  assignmentId: ObjectId,
  studentId: ObjectId,
  solution: String,
  fileName: String,
  status: String (submitted/graded),
  score: Number,
  feedback: String,
  submittedDate: Date,
  gradedDate: Date
}
```

---

## 🌐 Deployment

### Deploy to Render

1. Connect GitHub repository to Render
2. Configure build and start commands:
   - Build: `npm install`
   - Start: `node server.js`
3. Set environment variables in Render dashboard
4. Deploy automatically on every push

### Database on MongoDB Atlas

- All data is stored in MongoDB Atlas cloud database
- Automatic backups and security features included
- Real-time data synchronization

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT token-based authentication
- CORS enabled for secure API access
- MongoDB Atlas encryption at rest and in transit
- Environment variables for sensitive data

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team - QUAD SQUAD 😎

**Synapse 2K25 - National Hackathon | Mohan Babu University**

| Member | Role | Contact |
|--------|------|---------|
| **Vankadari Pushpa Sree** | Team Leader | +918868188539 |
| **Venkata Darshini** | Developer | +918309223120 |
| **Hemanth M** | Developer | +917661022620 |
| **Venkata Sai Rohith Bolla Pragada** | Developer | +919542030276 |

**QUAD SQUAD** - Built with passion, innovation, and teamwork to transform education!

---

- **MongoDB Atlas** - Cloud database infrastructure
- **Render** - Deployment platform
- **Express.js** - Web framework
- **Passport.js** - Authentication middleware
- Font Awesome for icons
- Chart.js for data visualization

---

## 📞 Contact & Support

- **GitHub Issues** - Report bugs and request features
- **Email** - Contact us at support@edvora.com
- **Website** - [EDVORA Learning Platform](https://edvora-lms-uz2l.onrender.com)

---

## 🚀 Live Demo

**Backend API:** [https://edvora-lms-uz2l.onrender.com](https://edvora-lms-uz2l.onrender.com)

**API Health Check:** [https://edvora-lms-uz2l.onrender.com/api/health](https://edvora-lms-uz2l.onrender.com/api/health)

---

<div align="center">

**Built with ❤️ by the EDVORA Team**

*Empowering Education • Building Communities • Inspiring Growth*

⭐ If you find this project helpful, please consider giving it a star!

</div>
