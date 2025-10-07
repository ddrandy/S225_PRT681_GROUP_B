// Favorites page functionality

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please login to view your favorites');
        window.location.href = 'login.html';
        return;
    }
    
    loadFavorites();
});

// Load user's favorite events
async function loadFavorites() {
    const loadingMessage = document.getElementById('loadingMessage');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    const container = document.getElementById('favoritesContainer');
    
    if (loadingMessage) loadingMessage.style.display = 'block';
    if (noFavoritesMessage) noFavoritesMessage.style.display = 'none';
    
    try {
        const response = await fetch(API_ENDPOINTS.favorites, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const favorites = await response.json();
            displayFavorites(favorites);
        } else {
            console.error('Failed to load favorites');
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    } finally {
        if (loadingMessage) loadingMessage.style.display = 'none';
    }
}

// Display favorite events
function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    
    if (!container) return;
    
    if (favorites.length === 0) {
        container.innerHTML = '';
        if (noFavoritesMessage) noFavoritesMessage.style.display = 'block';
        return;
    }
    
    if (noFavoritesMessage) noFavoritesMessage.style.display = 'none';
    
    container.innerHTML = favorites.map(event => createFavoriteCard(event)).join('');
}

// Create favorite event card
function createFavoriteCard(event) {
    return `
        <div class="event-card">
            <img src="${event.imagePath || '../assets/1.jpeg'}" alt="${event.title}" onclick="window.location.href='event-detail.html?id=${event.eventId}'">
            <div class="event-card-content">
                <span class="event-category">${event.category}</span>
                <h3 onclick="window.location.href='event-detail.html?id=${event.eventId}'">${event.title}</h3>
                <p class="event-date">${formatDate(event.date)} at ${formatTime(event.time)}</p>
                <p class="event-location">${event.location}</p>
                <p class="event-description">${event.description.substring(0, 100)}...</p>
                <button class="btn btn-danger" onclick="removeFavorite(${event.eventId})">Remove from Favorites</button>
            </div>
        </div>
    `;
}

// Remove from favorites
async function removeFavorite(eventId) {
    if (!confirm('Remove this event from your favorites?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.favorites}/${eventId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            // Reload favorites
            loadFavorites();
        } else {
            alert('Failed to remove favorite');
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
        alert('An error occurred');
    }
}
