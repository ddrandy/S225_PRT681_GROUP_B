// Authentication functions

// Update navigation based on auth status
function updateNavigation() {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isLoggedIn()) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (logoutLink) {
            logoutLink.style.display = 'inline';
            logoutLink.onclick = handleLogout;
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Handle user registration
async function handleRegister(event) {
    event.preventDefault();
    clearMessages();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('errorMessage', 'Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store auth token and user info
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                userId: data.userId,
                username: data.username,
                email: data.email,
                isAdmin: data.isAdmin
            }));
            
            showSuccess('successMessage', 'Registration successful! Redirecting...');
            
            // Show admin message if first user
            if (data.isAdmin) {
                alert('Congratulations! You are the first user and have been granted administrator privileges.');
            }
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showError('errorMessage', data.message || 'Registration failed');
        }
    } catch (error) {
        showError('errorMessage', 'An error occurred. Please try again.');
        console.error('Registration error:', error);
    }
}

// Handle user login
async function handleLogin(event) {
    event.preventDefault();
    clearMessages();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(API_ENDPOINTS.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store auth token and user info
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                userId: data.userId,
                username: data.username,
                email: data.email,
                isAdmin: data.isAdmin
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            showError('errorMessage', data.message || 'Login failed');
        }
    } catch (error) {
        showError('errorMessage', 'An error occurred. Please try again.');
        console.error('Login error:', error);
    }
}

// Handle user logout
function handleLogout(event) {
    if (event) event.preventDefault();
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check if user is authenticated (for protected pages)
function requireAuth() {
    if (!isLoggedIn()) {
        alert('Please login to access this page');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Check if user is admin
function requireAdmin() {
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
});
