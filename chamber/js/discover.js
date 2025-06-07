// Discover page functionality

// Variables
let attractionsData = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Discover page loaded');
    handleVisitorTracking();
    loadAttractions();
});

// Handle visitor tracking with localStorage
function handleVisitorTracking() {
    const visitorMessageElement = document.getElementById('visitor-message');
    const currentVisit = Date.now();
    const lastVisit = localStorage.getItem('discoverLastVisit');
    
    let message = '';
    
    if (!lastVisit) {
        // First visit
        message = '🎉 Welcome! Let us know if you have any questions.';
    } else {
        const daysSinceLastVisit = Math.floor((currentVisit - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastVisit < 1) {
            // Less than a day
            message = '👋 Back so soon! Awesome!';
        } else if (daysSinceLastVisit === 1) {
            // Exactly 1 day
            message = '📅 You last visited 1 day ago.';
        } else {
            // More than 1 day
            message = `📅 You last visited ${daysSinceLastVisit} days ago.`;
        }
    }
    
    // Display the message
    visitorMessageElement.innerHTML = `
        <p>${message}</p>
        <button onclick="closeVisitorMessage()" aria-label="Close message" style="
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--dark-color);
            font-weight: bold;
        ">×</button>
    `;
    
    // Store current visit
    localStorage.setItem('discoverLastVisit', currentVisit.toString());
    
    console.log(`Visitor tracking: ${message}`);
}

// Close visitor message
function closeVisitorMessage() {
    const visitorMessageElement = document.getElementById('visitor-message');
    visitorMessageElement.style.display = 'none';
}

// Load attractions data
async function loadAttractions() {
    const discoverGrid = document.getElementById('discover-grid');
    
    try {
        console.log('Loading attractions data...');
        
        // Try to fetch from data/attractions.json first
        let response;
        try {
            response = await fetch('data/attractions.json');
        } catch (error) {
            console.log('Could not fetch from data folder, trying root...');
            // Fallback to root directory
            response = await fetch('attractions.json');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        attractionsData = data.attractions;
        
        console.log(`Loaded ${attractionsData.length} attractions`);
        displayAttractions();
        
    } catch (error) {
        console.error('Error loading attractions:', error);
        displayErrorMessage();
    }
}

// Display attractions in the grid
function displayAttractions() {
    const discoverGrid = document.getElementById('discover-grid');
    
    if (!attractionsData || attractionsData.length === 0) {
        displayErrorMessage();
        return;
    }
    
    // Clear loading message
    discoverGrid.innerHTML = '';
    
    // Create cards for each attraction
    attractionsData.forEach((attraction, index) => {
        const card = createAttractionCard(attraction, index);
        discoverGrid.appendChild(card);
    });
    
    console.log('Attractions displayed successfully');
}

// Create individual attraction card
function createAttractionCard(attraction, index) {
    const card = document.createElement('div');
    card.className = 'discover-card';
    card.setAttribute('data-category', attraction.category);
    
    // Create image with fallback
    const imageHTML = `
        <figure>
            <img src="${attraction.image}" 
                 alt="${attraction.name}" 
                 loading="lazy"
                 onerror="this.src='images/placeholder.webp'; this.alt='Image not available';">
        </figure>
    `;
    
    card.innerHTML = `
        ${imageHTML}
        <div class="discover-card-content">
            <h2>${attraction.name}</h2>
            <address>${attraction.address}</address>
            <p>${attraction.description}</p>
            <button class="learn-more-btn" onclick="learnMore('${attraction.name}', ${attraction.id})">
                Learn More
            </button>
        </div>
    `;
    
    return card;
}

// Handle "Learn More" button clicks
function learnMore(attractionName, attractionId) {
    console.log(`Learn more clicked for: ${attractionName} (ID: ${attractionId})`);
    
    // Find the attraction data
    const attraction = attractionsData.find(a => a.id === attractionId);
    
    if (attraction) {
        // Create a simple modal or alert with more information
        // In a real implementation, this could open a detailed page or modal
        alert(`Learn More About ${attraction.name}\n\nCategory: ${attraction.category}\nLocation: ${attraction.address}\n\n${attraction.description}\n\nFor more information, please contact the Teandu Chamber of Commerce at info@tenaduchamber.org or +233 30 123 4567.`);
    } else {
        alert('Sorry, detailed information is not available at this time.');
    }
}

// Display error message
function displayErrorMessage() {
    const discoverGrid = document.getElementById('discover-grid');
    discoverGrid.innerHTML = `
        <div class="error">
            <h3>⚠️ Unable to Load Attractions</h3>
            <p>We're having trouble loading the attractions data. Please try refreshing the page or contact us if the problem persists.</p>
            <button onclick="loadAttractions()" style="
                background-color: var(--secondary-color);
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 1rem;
                font-weight: 600;
            ">Try Again</button>
        </div>
    `;
}

// Filter attractions by category (optional enhancement)
function filterByCategory(category) {
    const cards = document.querySelectorAll('.discover-card');
    
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`Filtered by category: ${category}`);
}

// Lazy loading image optimization
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Error handling for failed image loads
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Image failed to load:', e.target.src);
        e.target.src = 'images/placeholder.webp';
        e.target.alt = 'Image not available';
    }
}, true);

// Debug function for development
function debugAttractions() {
    console.log('Attractions data:', attractionsData);
    console.log('Total attractions:', attractionsData.length);
    console.log('Categories:', [...new Set(attractionsData.map(a => a.category))]);
}

// Export functions for potential use by other scripts
window.discoverFunctions = {
    filterByCategory,
    learnMore,
    debugAttractions,
    closeVisitorMessage
};