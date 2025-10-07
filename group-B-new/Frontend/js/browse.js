// Browse events page functionality

let allEvents = [];
let currentView = 'grid';

// Load events with filters
async function loadEvents() {
    const loadingMessage = document.getElementById('loadingMessage');
    const noEventsMessage = document.getElementById('noEventsMessage');
    const container = document.getElementById('eventsContainer');
    
    if (loadingMessage) loadingMessage.style.display = 'block';
    if (noEventsMessage) noEventsMessage.style.display = 'none';
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const params = new URLSearchParams();
    
    // Add filters from URL or form
    const dateFilter = document.getElementById('filterDate')?.value || urlParams.get('startDate');
    const categoryFilter = document.getElementById('filterCategory')?.value || urlParams.get('category');
    const locationFilter = document.getElementById('filterLocation')?.value || urlParams.get('location');
    
    if (dateFilter) params.append('startDate', dateFilter);
    if (categoryFilter) params.append('category', categoryFilter);
    if (locationFilter) params.append('location', locationFilter);
    
    try {
        const response = await fetch(`${API_ENDPOINTS.events}?${params.toString()}`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            allEvents = await response.json();
            displayEvents(allEvents);
        } else {
            console.error('Failed to load events');
        }
    } catch (error) {
        console.error('Error loading events:', error);
    } finally {
        if (loadingMessage) loadingMessage.style.display = 'none';
    }
}

// Display events
function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    const noEventsMessage = document.getElementById('noEventsMessage');
    
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '';
        if (noEventsMessage) noEventsMessage.style.display = 'block';
        return;
    }
    
    if (noEventsMessage) noEventsMessage.style.display = 'none';
    
    container.innerHTML = events.map(event => createEventCard(event)).join('');
}

// Create event card
function createEventCard(event) {
    const user = getCurrentUser();
    const showFavoriteBtn = user !== null;
    
    return `
        <div class="event-card">
            <img src="${event.imagePath || '../assets/1.jpeg'}" alt="${event.title}" onclick="window.location.href='event-detail.html?id=${event.eventId}'">
            <div class="event-card-content">
                <span class="event-category">${event.category}</span>
                <h3 onclick="window.location.href='event-detail.html?id=${event.eventId}'">${event.title}</h3>
                <p class="event-date">${formatDate(event.date)} at ${formatTime(event.time)}</p>
                <p class="event-location">${event.location}</p>
                <p class="event-description">${event.description.substring(0, 100)}...</p>
                ${showFavoriteBtn ? `
                    <button class="btn btn-favorite ${event.isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(${event.eventId}, this)">
                        ${event.isFavorited ? '★ Favorited' : '☆ Add to Favorites'}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Toggle favorite
async function toggleFavorite(eventId, button) {
    if (!isLoggedIn()) {
        alert('Please login to add favorites');
        window.location.href = 'login.html';
        return;
    }
    
    const isFavorited = button.classList.contains('favorited');
    
    try {
        const url = `${API_ENDPOINTS.favorites}/${eventId}`;
        const method = isFavorited ? 'DELETE' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            button.classList.toggle('favorited');
            button.textContent = isFavorited ? '☆ Add to Favorites' : '★ Favorited';
        } else {
            alert('Failed to update favorite');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('An error occurred');
    }
}

// Apply filters
function applyFilters() {
    loadEvents();
}

// Clear filters
function clearFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLocation').value = '';
    
    // Clear URL parameters
    window.history.pushState({}, '', 'browse.html');
    
    loadEvents();
}

// Toggle view (list/grid)
function toggleView(view) {
    currentView = view;
    const container = document.getElementById('eventsContainer');
    const listBtn = document.getElementById('listViewBtn');
    const gridBtn = document.getElementById('gridViewBtn');
    
    if (view === 'list') {
        container.classList.remove('events-grid');
        container.classList.add('events-list');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    } else {
        container.classList.remove('events-list');
        container.classList.add('events-grid');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Set filters from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('startDate')) {
        document.getElementById('filterDate').value = urlParams.get('startDate');
    }
    if (urlParams.get('category')) {
        document.getElementById('filterCategory').value = urlParams.get('category');
    }
    if (urlParams.get('location')) {
        document.getElementById('filterLocation').value = urlParams.get('location');
    }
    
    loadEvents();
});
