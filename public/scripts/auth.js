const BASE_URL = "https://edvora-lms-uz2l.onrender.com/api/auth";

// New function to handle redirection to main.html
function goToMainPage() {
    window.location.href = "main.html";
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please enter email and password'
        });
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await res.json();
        console.log('Login response:', data);

        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Welcome ${data.user.name}!`,
                timer: 1500
            }).then(() => {
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // You will need to determine when to redirect to main.html
                // For demonstration, let's assume a click on a button/anchor in the HTML 
                // calls goToMainPage() instead of submitting the form.
                
                // Keep the original role-based redirection as the default success action
                if (data.user.role === 'teacher') {
                    window.location.href = "teacher-dashboard.html";
                } else {
                    window.location.href = "student-dashboard.html";
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message || "Invalid email or password"
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        Swal.fire({
            icon: 'error',
            title: 'Connection Error',
            text: 'Could not connect to server'
        });
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const email = document.getElementById("signup-email").value.trim();
    const name = document.getElementById("signup-name")?.value || email.split('@')[0];
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const role = document.getElementById("signup-role").value;

    if (!email || !password || !confirm || !role) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please fill all fields'
        });
        return;
    }

    if (password !== confirm) {
        Swal.fire({
            icon: 'warning',
            title: 'Password Mismatch',
            text: 'Passwords do not match'
        });
        return;
    }

    if (password.length < 6) {
        Swal.fire({
            icon: 'warning',
            title: 'Weak Password',
            text: 'Password must be at least 6 characters'
        });
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name,
                email, 
                password, 
                role 
            }),
            credentials: "include",
        });

        const data = await res.json();
        console.log('Signup response:', data);

        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Account created! Redirecting...',
                timer: 1500
            }).then(() => {
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Keep the original role-based redirection as the default success action
                if (data.user.role === 'teacher') {
                    window.location.href = "teacher-dashboard.html";
                } else {
                    window.location.href = "student-dashboard.html";
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: data.message
            });
        }
    } catch (err) {
        console.error('Signup error:', err);
        Swal.fire({
            icon: 'error',
            title: 'Connection Error',
            text: 'Could not connect to server'
        });
    }
}

function handleForgot(e) {
    e.preventDefault();
    Swal.fire({
        icon: 'info',
        title: 'Coming Soon',
        text: 'Password reset under development'
    });
}

function sendOTP() {
    Swal.fire({
        icon: 'info',
        title: 'Coming Soon',
        text: 'OTP feature under development'
    });
}