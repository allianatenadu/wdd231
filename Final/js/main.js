// Main JavaScript file for Experience Ghana website
// Demonstrates ES Modules, DOM manipulation, async operations, array methods, and template literals

import { fetchDestinations, displayDestinationsPreview, filterDestinations } from './modules/destinations.js';
import { showModal, hideModal, toggleMobileMenu } from './modules/ui.js';
import { saveUserPreference, getUserPreference } from './modules/storage.js';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize the application
        await initializeApp();
        
        // Set up event listeners
        setupEventListeners();
        
        // Load user preferences from localStorage
        loadUserPreferences();
        
        console.log('Experience Ghana website initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorMessage('Failed to load content. Please refresh the page.');
    }
});

/**
 * Initialize the main application
 * Demonstrates async/await with try-catch blocks
 */
async function initializeApp() {
    try {
        // Fetch destinations data (async operation with error handling)
        const destinations = await fetchDestinations();
        
        if (destinations && destinations.length > 0) {
            // Display featured destinations on homepage (array methods and template literals)
            const featuredDestinations = getRandomDestinations(destinations, 3);
            displayDestinationsPreview(featuredDestinations, 'destinations-preview');
            
            // Store destinations in localStorage for offline access
            saveUserPreference('cachedDestinations', destinations);
            saveUserPreference('lastUpdated', new Date().toISOString());
            
            console.log(`Loaded ${destinations.length} destinations successfully`);
        } else {
            throw new Error('No destinations data available');
        }
    } catch (error) {
        console.error('Failed to initialize app:', error);
        
        // Try to load cached data from localStorage
        const cachedDestinations = getUserPreference('cachedDestinations');
        if (cachedDestinations) {
            console.log('Loading cached destinations data');
            const featuredDestinations = getRandomDestinations(cachedDestinations, 3);
            displayDestinationsPreview(featuredDestinations, 'destinations-preview');
        } else {
            showErrorMessage('Unable to load destinations. Please check your connection.');
        }
    }
}

/**
 * Set up all event listeners
 * Demonstrates DOM manipulation and event handling
 */
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            toggleMobileMenu(navMenu);
            // Save menu state preference
            saveUserPreference('menuOpen', navMenu.classList.contains('active'));
        });
    }
    
    // Hero CTA button
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            // Smooth scroll to quick navigation or redirect to explore page
            const quickNav = document.querySelector('.quick-nav');
            if (quickNav) {
                quickNav.scrollIntoView({ behavior: 'smooth' });
                // Track user interaction
                saveUserPreference('heroButtonClicked', true);
            }
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
    
    // Navigation card interactions
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('click', handleNavCardClick);
        
        // Add keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavCardClick.call(card, e);
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
    });
    
    // Destination card clicks (for modal display)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.destination-card')) {
            const card = e.target.closest('.destination-card');
            const destinationId = card.dataset.id;
            if (destinationId) {
                showDestinationModal(destinationId);
            }
        }
    });
    
    // Modal close events
    const closeModal = document.getElementById('close-modal');
    const modal = document.getElementById('destination-modal');
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => hideModal(modal));
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                hideModal(modal);
            }
        });
    }
    
    // Window scroll events for navbar styling
    window.addEventListener('scroll', handleScroll);
}

/**
 * Get random destinations for featured section
 * Demonstrates array methods (sort, slice)
 */
function getRandomDestinations(destinations, count) {
    // Create a copy and shuffle using sort with random comparison
    const shuffled = [...destinations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Handle newsletter form submission
 * Demonstrates form data handling and validation
 */
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const interests = formData.get('interests');
    const frequency = formData.get('frequency');
    
    // Basic validation
    if (!email || !frequency) {
        showErrorMessage('Please fill in all required fields.');
        return;
    }
    
    // Save user preferences
    saveUserPreference('subscribedEmail', email);
    saveUserPreference('interests', interests);
    saveUserPreference('frequency', frequency);
    saveUserPreference('subscriptionDate', new Date().toISOString());
    
    // Show success message using template literals
    const successMessage = `
        <div class="success-notification">
            <h3>🎉 Thank you for subscribing!</h3>
            <p>We'll send you ${frequency} updates about Ghana travel to <strong>${email}</strong></p>
            ${interests ? `<p>We noted your interests: <em>${interests}</em></p>` : ''}
        </div>
    `;
    
    // Create and show success modal
    showSuccessModal(successMessage);
    
    // Allow form to proceed to action page
    setTimeout(() => {
        e.target.submit();
    }, 2000);
}

/**
 * Handle navigation card clicks
 * Demonstrates template literals and DOM manipulation
 */
function handleNavCardClick(e) {
    const section = this.dataset.section;
    const cardTitle = this.querySelector('h3').textContent;
    
    // Track user interaction
    saveUserPreference(`${section}CardClicked`, true);
    saveUserPreference('lastClickedCard', {
        section: section,
        title: cardTitle,
        timestamp: new Date().toISOString()
    });
    
    // Add visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
    
    // Navigate after animation
    setTimeout(() => {
        const link = this.querySelector('.card-link');
        if (link) {
            window.location.href = link.href;
        }
    }, 200);
}
// Add to your main.js file
document.addEventListener('DOMContentLoaded', () => {
    // Handle missing images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Missing image:', this.src);
        });
    });
});

/**
 * Show destination modal with detailed information
 * Demonstrates async data retrieval and template literals
 */
async function showDestinationModal(destinationId) {
    try {
        const destinations = await fetchDestinations();
        const destination = destinations.find(d => d.id == destinationId);
        
        if (!destination) {
            throw new Error('Destination not found');
        }
        
        const modal = document.getElementById('destination-modal');
        const modalBody = document.getElementById('modal-body');
        const modalTitle = document.getElementById('modal-title');
        
        // Update modal content using template literals
        modalTitle.textContent = destination.name;
        modalBody.innerHTML = `
            <div class="modal-destination-content">
                <img src="${destination.image}" alt="${destination.name}" class="modal-image" loading="lazy">
                <div class="modal-info">
                    <div class="destination-meta">
                        <span class="location">📍 ${destination.location}</span>
                        <span class="rating">⭐ ${destination.rating}/5</span>
                        <span class="cost">${destination.costLevel}</span>
                    </div>
                    <p class="description">${destination.description}</p>
                    <div class="destination-details">
                        <div class="detail-section">
                            <h4>🎯 Activities</h4>
                            <ul>
                                ${destination.activities.map(activity => `<li>${activity}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="detail-section">
                            <h4>📅 Best Time to Visit</h4>
                            <p>${destination.bestTime}</p>
                        </div>
                        <div class="detail-section">
                            <h4>⏰ Duration</h4>
                            <p>${destination.duration}</p>
                        </div>
                        <div class="detail-section">
                            <h4>✨ Highlights</h4>
                            <ul>
                                ${destination.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="window.open('explore.html', '_blank')">
                            See More Destinations
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        showModal(modal);
        
        // Track modal view
        saveUserPreference('lastViewedDestination', {
            id: destinationId,
            name: destination.name,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error showing destination modal:', error);
        showErrorMessage('Unable to load destination details.');
    }
}

/**
 * Show success modal
 * Demonstrates DOM creation and manipulation
 */
function showSuccessModal(content) {
    // Create temporary modal
    const tempModal = document.createElement('div');
    tempModal.className = 'modal';
    tempModal.innerHTML = `
        <div class="modal-content success-modal">
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(tempModal);
    showModal(tempModal);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        hideModal(tempModal);
        setTimeout(() => {
            document.body.removeChild(tempModal);
        }, 300);
    }, 3000);
}

/**
 * Show error message
 * Demonstrates template literals and DOM manipulation
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

/**
 * Handle scroll events for header styling
 * Demonstrates event handling and DOM manipulation
 */
function handleScroll() {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Save scroll position
    saveUserPreference('lastScrollPosition', scrollY);
}

/**
 * Load user preferences on page load
 * Demonstrates localStorage usage
 */
function loadUserPreferences() {
    // Restore scroll position
    const lastScrollPosition = getUserPreference('lastScrollPosition');
    if (lastScrollPosition && lastScrollPosition > 0) {
        setTimeout(() => {
            window.scrollTo(0, lastScrollPosition);
        }, 100);
    }
    
    // Show personalized welcome message if user has visited before
    const subscribedEmail = getUserPreference('subscribedEmail');
    const lastVisit = getUserPreference('lastVisit');
    
    if (subscribedEmail && lastVisit) {
        const daysSinceVisit = Math.floor((Date.now() - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
        if (daysSinceVisit > 7) {
            showWelcomeBackMessage(subscribedEmail);
        }
    }
    
    // Update last visit timestamp
    saveUserPreference('lastVisit', new Date().toISOString());
}

/**
 * Show welcome back message for returning users
 * Demonstrates personalization with localStorage
 */
function showWelcomeBackMessage(email) {
    const lastViewedDestination = getUserPreference('lastViewedDestination');
    
    const welcomeMessage = `
        <div class="welcome-back-notification">
            <h3>🇬🇭 Welcome back to Experience Ghana!</h3>
            <p>Hello ${email.split('@')[0]}, great to see you again!</p>
            ${lastViewedDestination ? 
                `<p>Continue exploring from where you left off: <strong>${lastViewedDestination.name}</strong></p>` : 
                '<p>Discover new destinations and experiences in Ghana.</p>'
            }
        </div>
    `;
    
    setTimeout(() => {
        showSuccessModal(welcomeMessage);
    }, 1000);
}

// Export functions for use in other modules if needed
export { 
    getRandomDestinations, 
    showDestinationModal, 
    showErrorMessage,
    handleScroll
};