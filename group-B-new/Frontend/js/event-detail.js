// Event detail page functionality

let currentEvent = null;

// Load event details
async function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    let eventId = urlParams.get('id');
    if (!eventId) {
        // Support fixed pages that provide an ID via body data attribute or global
        const bodyAttrId = document.body && document.body.getAttribute('data-event-id');
        if (bodyAttrId) {
            eventId = bodyAttrId;
        } else if (window.FIXED_EVENT_ID) {
            eventId = String(window.FIXED_EVENT_ID);
        }
    }
    
    if (!eventId) {
        window.location.href = 'browse.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.events}/${eventId}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            currentEvent = await response.json();
            displayEventDetails(currentEvent);
            loadRelatedEvents(currentEvent.category, eventId);
        } else {
            alert('Event not found');
            window.location.href = 'browse.html';
        }
    } catch (error) {
        console.error('Error loading event details:', error);
        alert('An error occurred');
    }
}

// Display event details
function displayEventDetails(event) {
    const container = document.getElementById('eventDetailContainer');
    if (!container) return;
    
    const user = getCurrentUser();
    const isOwner = user && user.userId === event.createdBy;
    const isAdmin = user && user.isAdmin;
    const canEdit = isOwner || isAdmin;
    
    container.innerHTML = `
        <div class="event-detail">
            <div class="event-detail-header">
                <img src="${event.imagePath || '../assets/1.jpeg'}" alt="${event.title}">
            </div>
            <div class="event-detail-body">
                <div class="event-detail-info">
                    <span class="event-category">${event.category}</span>
                    <h1>${event.title}</h1>
                    <div class="event-meta">
                        <p><strong>Date:</strong> ${formatDate(event.date)}</p>
                        <p><strong>Time:</strong> ${formatTime(event.time)}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>Organizer:</strong> ${event.creatorUsername}</p>
                    </div>
                    <div class="event-actions">
                        ${user ? `
                            <button class="btn btn-favorite ${event.isFavorited ? 'favorited' : ''}" onclick="toggleFavorite()">
                                ${event.isFavorited ? '★ Favorited' : '☆ Save to Favorites'}
                            </button>
                        ` : ''}
                        <button class="btn btn-secondary" onclick="shareEvent()">Share</button>
                        ${canEdit ? `
                            <button class="btn btn-secondary" onclick="editEvent()">Edit</button>
                            <button class="btn btn-danger" onclick="deleteEvent()">Delete</button>
                        ` : ''}
                    </div>
                </div>
                <div class="event-detail-description">
                    <h2>About This Event</h2>
                    <p>${event.description}</p>
                </div>
                <div class="event-detail-map">
                    <h3>Location</h3>
                    <p>${event.location}</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}" 
                       target="_blank" class="btn btn-secondary">View on Google Maps</a>
                </div>
            </div>
        </div>
    `;
}

// Toggle favorite
async function toggleFavorite() {
    if (!isLoggedIn()) {
        alert('Please login to add favorites');
        window.location.href = 'login.html';
        return;
    }
    
    if (!currentEvent) return;
    
    try {
        const url = `${API_ENDPOINTS.favorites}/${currentEvent.eventId}`;
        const method = currentEvent.isFavorited ? 'DELETE' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            currentEvent.isFavorited = !currentEvent.isFavorited;
            displayEventDetails(currentEvent);
        } else {
            alert('Failed to update favorite');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('An error occurred');
    }
}

// Share event
function shareEvent() {
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: currentEvent.title,
            text: currentEvent.description,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}

// Edit event
function editEvent() {
    if (!currentEvent) return;
    window.location.href = `submit.html?edit=${currentEvent.eventId}`;
}

// Delete event
async function deleteEvent() {
    if (!currentEvent) return;
    
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.events}/${currentEvent.eventId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            alert('Event deleted successfully');
            window.location.href = 'browse.html';
        } else {
            alert('Failed to delete event');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('An error occurred');
    }
}

// Load related events
async function loadRelatedEvents(category, excludeId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.events}?category=${category}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            let events = await response.json();
            // Filter out current event and limit to 3
            events = events.filter(e => e.eventId !== parseInt(excludeId)).slice(0, 3);
            displayRelatedEvents(events);
        }
    } catch (error) {
        console.error('Error loading related events:', error);
    }
}

// Display related events
function displayRelatedEvents(events) {
    const container = document.getElementById('relatedEventsContainer');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p>No related events found</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-card" onclick="window.location.href='event-detail.html?id=${event.eventId}'">
            <img src="${event.imagePath || '../assets/1.jpeg'}" alt="${event.title}">
            <div class="event-card-content">
                <span class="event-category">${event.category}</span>
                <h3>${event.title}</h3>
                <p class="event-date">${formatDate(event.date)} at ${formatTime(event.time)}</p>
                <p class="event-location">${event.location}</p>
            </div>
        </div>
    `).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadEventDetails();
});
