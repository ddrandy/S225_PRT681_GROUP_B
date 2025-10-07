// Dashboard page functionality

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please login to access the dashboard');
        window.location.href = 'login.html';
        return;
    }
    
    loadProfile();
    loadUserContent();
});

// Load user profile
async function loadProfile() {
    try {
        const response = await fetch(API_ENDPOINTS.profile, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const profile = await response.json();
            displayProfile(profile);
            
            // Show admin panel if user is admin
            if (profile.isAdmin) {
                document.getElementById('adminPanel').style.display = 'block';
                loadAdminContent();
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Display user profile
function displayProfile(profile) {
    const container = document.getElementById('profileInfo');
    if (!container) return;
    
    container.innerHTML = `
        <div class="profile-info">
            <p><strong>Username:</strong> ${profile.username}</p>
            <p><strong>Email:</strong> ${profile.email}</p>
            <p><strong>Role:</strong> ${profile.isAdmin ? 'Administrator' : 'User'}</p>
            <p><strong>Member since:</strong> ${formatDate(profile.dateRegistered)}</p>
        </div>
    `;
}

// Load user-specific content
async function loadUserContent() {
    await Promise.all([
        loadMyEvents(),
        loadMyFavorites()
    ]);
}

// Load user's created events
async function loadMyEvents() {
    try {
        const user = getCurrentUser();
        const response = await fetch(`${API_ENDPOINTS.events}?approvedOnly=false`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const allEvents = await response.json();
            const myEvents = allEvents.filter(event => event.createdBy === user.userId);
            displayMyEvents(myEvents);
        }
    } catch (error) {
        console.error('Error loading my events:', error);
    }
}

// Display user's events
function displayMyEvents(events) {
    const container = document.getElementById('myEventsContainer');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p>You haven\'t created any events yet. <a href="submit.html">Submit your first event</a></p>';
        return;
    }
    
    container.innerHTML = events.map(event => createMyEventCard(event)).join('');
}

// Create user's event card
function createMyEventCard(event) {
    return `
        <div class="event-card">
            <img src="${event.imagePath || '../assets/1.jpeg'}" alt="${event.title}">
            <div class="event-card-content">
                <span class="event-category">${event.category}</span>
                <span class="event-status ${event.isApproved ? 'approved' : 'pending'}">${event.isApproved ? 'Approved' : 'Pending Approval'}</span>
                <h3>${event.title}</h3>
                <p class="event-date">${formatDate(event.date)} at ${formatTime(event.time)}</p>
                <p class="event-location">${event.location}</p>
                <div class="event-actions">
                    <button class="btn btn-secondary" onclick="window.location.href='event-detail.html?id=${event.eventId}'">View</button>
                    <button class="btn btn-secondary" onclick="window.location.href='submit.html?edit=${event.eventId}'">Edit</button>
                    <button class="btn btn-danger" onclick="deleteMyEvent(${event.eventId})">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Delete user's event
async function deleteMyEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.events}/${eventId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            loadMyEvents(); // Reload events
        } else {
            alert('Failed to delete event');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('An error occurred');
    }
}

// Load user's favorites
async function loadMyFavorites() {
    try {
        const response = await fetch(API_ENDPOINTS.favorites, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const favorites = await response.json();
            displayMyFavorites(favorites.slice(0, 6)); // Show only first 6
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

// Display user's favorites
function displayMyFavorites(favorites) {
    const container = document.getElementById('myFavoritesContainer');
    if (!container) return;
    
    if (favorites.length === 0) {
        container.innerHTML = '<p>No favorite events yet. <a href="browse.html">Browse events</a> to add some!</p>';
        return;
    }
    
    container.innerHTML = favorites.map(event => `
        <div class="event-card" onclick="window.location.href='event-detail.html?id=${event.eventId}'">
            <img src="${event.imagePath || '../assets/1.jpeg'}" alt="${event.title}">
            <div class="event-card-content">
                <span class="event-category">${event.category}</span>
                <h3>${event.title}</h3>
                <p class="event-date">${formatDate(event.date)} at ${formatTime(event.time)}</p>
                <p class="event-location">${event.location}</p>
            </div>
        </div>
    `).join('') + (favorites.length === 6 ? '<p><a href="favorites.html">View all favorites</a></p>' : '');
}

// Admin functions
async function loadAdminContent() {
    await Promise.all([
        loadPendingEvents(),
        loadAllUsers()
    ]);
}

// Load pending events for admin approval
async function loadPendingEvents() {
    try {
        const response = await fetch(`${API_ENDPOINTS.events}?approvedOnly=false`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const allEvents = await response.json();
            const pendingEvents = allEvents.filter(event => !event.isApproved);
            displayPendingEvents(pendingEvents);
        }
    } catch (error) {
        console.error('Error loading pending events:', error);
    }
}

// Display pending events
function displayPendingEvents(events) {
    const container = document.getElementById('pendingEventsContainer');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p>No pending events</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="pending-event">
            <h4>${event.title}</h4>
            <p><strong>Submitted by:</strong> ${event.creatorUsername}</p>
            <p><strong>Date:</strong> ${formatDate(event.date)} at ${formatTime(event.time)}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Category:</strong> ${event.category}</p>
            <div class="admin-actions">
                <button class="btn btn-success" onclick="approveEvent(${event.eventId})">Approve</button>
                <button class="btn btn-danger" onclick="rejectEvent(${event.eventId})">Reject</button>
                <button class="btn btn-secondary" onclick="window.location.href='event-detail.html?id=${event.eventId}'">View Details</button>
            </div>
        </div>
    `).join('');
}

// Approve event
async function approveEvent(eventId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.events}/${eventId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ isApproved: true })
        });
        
        if (response.ok) {
            loadPendingEvents(); // Reload pending events
        } else {
            alert('Failed to approve event');
        }
    } catch (error) {
        console.error('Error approving event:', error);
        alert('An error occurred');
    }
}

// Reject event (delete)
async function rejectEvent(eventId) {
    if (!confirm('Are you sure you want to reject and delete this event?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.events}/${eventId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            loadPendingEvents(); // Reload pending events
        } else {
            alert('Failed to reject event');
        }
    } catch (error) {
        console.error('Error rejecting event:', error);
        alert('An error occurred');
    }
}

// Load all users for admin management
async function loadAllUsers() {
    try {
        const response = await fetch(API_ENDPOINTS.users, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Display users
function displayUsers(users) {
    const container = document.getElementById('usersContainer');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    
    container.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <h4>${user.username}</h4>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.isAdmin ? 'Administrator' : 'User'}</p>
                <p><strong>Joined:</strong> ${formatDate(user.dateRegistered)}</p>
            </div>
            ${user.userId !== currentUser.userId ? `
                <div class="user-actions">
                    <button class="btn btn-danger" onclick="deleteUser(${user.userId}, '${user.username}')">Delete User</button>
                </div>
            ` : '<p><em>Current User</em></p>'}
        </div>
    `).join('');
}

// Delete user
async function deleteUser(userId, username) {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.users}/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            loadAllUsers(); // Reload users
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred');
    }
}
