// Submit event page functionality

let isEditMode = false;
let editEventId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please login to submit an event');
        window.location.href = 'login.html';
        return;
    }
    
    // Check if editing existing event
    const urlParams = new URLSearchParams(window.location.search);
    editEventId = urlParams.get('edit');
    
    if (editEventId) {
        isEditMode = true;
        loadEventForEdit(editEventId);
    }
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});

// Load event for editing
async function loadEventForEdit(eventId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.events}/${eventId}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const event = await response.json();
            
            // Check if user can edit this event
            const user = getCurrentUser();
            if (!user || (user.userId !== event.createdBy && !user.isAdmin)) {
                alert('You do not have permission to edit this event');
                window.location.href = 'browse.html';
                return;
            }
            
            // Populate form
            document.getElementById('title').value = event.title;
            document.getElementById('date').value = event.date.split('T')[0];
            document.getElementById('time').value = event.time;
            document.getElementById('location').value = event.location;
            document.getElementById('category').value = event.category;
            document.getElementById('imagePath').value = event.imagePath || '';
            document.getElementById('description').value = event.description;
            
            // Update form title
            document.querySelector('.submit-container h1').textContent = 'Edit Event';
            document.querySelector('.submit-container .subtitle').textContent = 'Update your event details';
            document.querySelector('button[type="submit"]').textContent = 'Update Event';
        } else {
            alert('Event not found');
            window.location.href = 'browse.html';
        }
    } catch (error) {
        console.error('Error loading event:', error);
        alert('An error occurred');
    }
}

// Handle form submission
async function handleSubmitEvent(event) {
    event.preventDefault();
    clearMessages();
    
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;
    const imagePath = document.getElementById('imagePath').value;
    const description = document.getElementById('description').value;
    
    const eventData = {
        title,
        date: new Date(date).toISOString(),
        time,
        location,
        category,
        imagePath: imagePath || null,
        description
    };
    
    try {
        let response;
        
        if (isEditMode && editEventId) {
            // Update existing event
            response = await fetch(`${API_ENDPOINTS.events}/${editEventId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(eventData)
            });
        } else {
            // Create new event
            response = await fetch(API_ENDPOINTS.events, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(eventData)
            });
        }
        
        if (response.ok) {
            const result = await response.json();
            const user = getCurrentUser();
            
            if (user && user.isAdmin) {
                showSuccess('successMessage', 'Event saved and published successfully!');
            } else {
                showSuccess('successMessage', 'Event submitted successfully! It will be visible after admin approval.');
            }
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            const error = await response.json();
            showError('errorMessage', error.message || 'Failed to submit event');
        }
    } catch (error) {
        console.error('Error submitting event:', error);
        showError('errorMessage', 'An error occurred. Please try again.');
    }
}
