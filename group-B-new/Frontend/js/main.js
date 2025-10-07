// Main page functionality

let currentCarouselIndex = 0;
let featuredEvents = [];

// Fallback sample featured events using local assets
function getSampleFeaturedEvents() {
    return [
        {
            eventId: 10001,
            title: 'Darwin Sunset Markets',
            date: new Date().toISOString(),
            time: '18:00',
            location: 'Mindil Beach, Darwin',
            imagePath: 'assets/2.jpg'
        },
        {
            eventId: 10002,
            title: 'Kakadu Cultural Festival',
            date: new Date(Date.now() + 86400000).toISOString(),
            time: '10:00',
            location: 'Kakadu National Park',
            imagePath: 'assets/3.jpg'
        },
        {
            eventId: 10003,
            title: 'Alice Springs Desert Music Night',
            date: new Date(Date.now() + 2 * 86400000).toISOString(),
            time: '19:30',
            location: 'Alice Springs',
            imagePath: 'assets/4.jpg'
        },
        {
            eventId: 10004,
            title: 'NT Food & Drink Fair',
            date: new Date(Date.now() + 3 * 86400000).toISOString(),
            time: '12:00',
            location: 'Darwin Waterfront',
            imagePath: 'assets/5.jpeg'
        },
        {
            eventId: 10005,
            title: 'Litchfield National Park Adventure Day',
            date: new Date(Date.now() + 4 * 86400000).toISOString(),
            time: '09:00',
            location: 'Litchfield National Park',
            imagePath: 'assets/6.jpeg'
        }
    ];
}

// Load featured events
async function loadFeaturedEvents() {
    try {
        const response = await fetch(`${API_ENDPOINTS.featuredEvents}?count=5`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            featuredEvents = Array.isArray(data) && data.length > 0 ? data : getSampleFeaturedEvents();
        } else {
            featuredEvents = getSampleFeaturedEvents();
        }
        displayFeaturedEvents();
    } catch (error) {
        console.error('Error loading featured events:', error);
        featuredEvents = getSampleFeaturedEvents();
        displayFeaturedEvents();
    }
}

// Display featured events in carousel
function displayFeaturedEvents() {
    const container = document.getElementById('carouselContainer');
    if (!container) return;
    
    if (featuredEvents.length === 0) {
        container.innerHTML = '<p>No featured events available</p>';
        return;
    }
    
    const fixedIds = new Set([10001, 10002, 10003, 10004, 10005]);
    container.innerHTML = featuredEvents.map((event, index) => {
        const href = fixedIds.has(Number(event.eventId))
            ? `event-${event.eventId}.html`
            : `event-detail.html?id=${event.eventId}`;
        return `
        <div class="carousel-item ${index === 0 ? 'active' : ''}" onclick="window.location.href='${href}'">
            <a href="${href}">
                <img src="${event.imagePath || 'assets/1.jpeg'}" alt="${event.title}">
            </a>
            <div class="carousel-caption">
                <h3>${event.title}</h3>
                <p>${formatDate(event.date)} at ${formatTime(event.time)}</p>
                <p>${event.location}</p>
            </div>
        </div>`;
    }).join('');
}

// Move carousel
function moveCarousel(direction) {
    if (featuredEvents.length === 0) return;
    
    currentCarouselIndex += direction;
    
    if (currentCarouselIndex < 0) {
        currentCarouselIndex = featuredEvents.length - 1;
    } else if (currentCarouselIndex >= featuredEvents.length) {
        currentCarouselIndex = 0;
    }
    
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentCarouselIndex);
    });
}

// Auto-rotate carousel
setInterval(() => {
    if (featuredEvents.length > 1) {
        moveCarousel(1);
    }
}, 5000);

// Load upcoming events
async function loadUpcomingEvents() {
    try {
        const response = await fetch(`${API_ENDPOINTS.upcomingEvents}?count=12`, {
            headers: getAuthHeaders()
        });
        
        if (response.ok) {
            const events = await response.json();
            displayUpcomingEvents(events);
        }
    } catch (error) {
        console.error('Error loading upcoming events:', error);
    }
}

// Display upcoming events
function displayUpcomingEvents(events) {
    const container = document.getElementById('upcomingEvents');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p>No upcoming events available</p>';
        return;
    }
    
    container.innerHTML = events.map(event => createEventCard(event)).join('');
}

// Create event card HTML
function createEventCard(event) {
    return `
        <div class="event-card" onclick="window.location.href='event-detail.html?id=${event.eventId}'">
            <img src="${event.imagePath || 'assets/1.jpeg'}" alt="${event.title}">
            <div class="event-card-content">
                <span class="event-category">${event.category}</span>
                <h3>${event.title}</h3>
                <p class="event-date">${formatDate(event.date)} at ${formatTime(event.time)}</p>
                <p class="event-location">${event.location}</p>
                <p class="event-description">${event.description.substring(0, 100)}...</p>
            </div>
        </div>
    `;
}

// Search events
function searchEvents() {
    const searchInput = document.getElementById('searchInput').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    // Build query string
    const params = new URLSearchParams();
    if (dateFilter) params.append('startDate', dateFilter);
    if (locationFilter) params.append('location', locationFilter);
    if (categoryFilter) params.append('category', categoryFilter);
    
    // Redirect to browse page with filters
    window.location.href = `browse.html?${params.toString()}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedEvents();
    loadUpcomingEvents();
    
    // Add enter key support for search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchEvents();
            }
        });
    }
});
