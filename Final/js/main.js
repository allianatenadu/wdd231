// Main JavaScript file for Experience Ghana website
// Demonstrates ES Modules, DOM manipulation, async operations, array methods, and template literals

// FIXED: Updated import paths to match actual file structure
import { fetchDestinations, displayDestinationsPreview, filterDestinations, displayDestinations, getUniqueCategories, getUniqueRegions, searchDestinations, sortDestinations } from './destinations.js';
import { fetchDishes, searchDishes, filterDishesByCategory, getDishById } from './dishes.js';
import { showModal, hideModal, toggleMobileMenu, showNotification } from './ui.js';
import { saveUserPreference, getUserPreference } from './storage.js';

// Global variables for data storage
let allDestinations = [];
let allDishes = [];
let currentPage = '';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Determine current page
        currentPage = getCurrentPage();
        console.log('Initializing page:', currentPage);
        
        // Initialize the application based on current page
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
 * Get current page name from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    if (page === '' || page === 'index.html') return 'index';
    if (page.includes('explore')) return 'explore';
    if (page.includes('taste')) return 'taste';
    if (page.includes('travel-tips')) return 'travel-tips';
    
    return page.replace('.html', '');
}

/**
 * Initialize the main application
 * Demonstrates async/await with try-catch blocks
 */
async function initializeApp() {
    try {
        switch (currentPage) {
            case 'index':
                await initializeHomePage();
                break;
            case 'explore':
                await initializeExplorePage();
                break;
            case 'taste':
                await initializeTastePage();
                break;
            default:
                // For other pages, just load basic data
                allDestinations = await fetchDestinations();
                allDishes = await fetchDishes();
        }
    } catch (error) {
        console.error('Failed to initialize app:', error);
        
        // Try to load cached data from localStorage
        const cachedDestinations = getUserPreference('cachedDestinations');
        if (cachedDestinations) {
            console.log('Loading cached destinations data');
            allDestinations = cachedDestinations;
            
            if (currentPage === 'index') {
                const featuredDestinations = getRandomDestinations(cachedDestinations, 3);
                displayDestinationsPreview(featuredDestinations, 'destinations-preview');
            }
        } else {
            showErrorMessage('Unable to load destinations. Please check your connection.');
        }
    }
}

/**
 * Initialize home page
 */
async function initializeHomePage() {
    // Fetch destinations data (async operation with error handling)
    allDestinations = await fetchDestinations();
    
    if (allDestinations && allDestinations.length > 0) {
        // Display featured destinations on homepage (array methods and template literals)
        const featuredDestinations = getRandomDestinations(allDestinations, 3);
        displayDestinationsPreview(featuredDestinations, 'destinations-preview');
        
        // Store destinations in localStorage for offline access
        saveUserPreference('cachedDestinations', allDestinations);
        saveUserPreference('lastUpdated', new Date().toISOString());
        
        console.log(`Loaded ${allDestinations.length} destinations successfully`);
    } else {
        throw new Error('No destinations data available');
    }
    
    // Also fetch dishes for potential use
    allDishes = await fetchDishes();
}

/**
 * Initialize explore page
 */
async function initializeExplorePage() {
    console.log('Loading explore page...');
    
    // Show loading state
    showLoadingState('destinations-container');
    
    // Fetch destinations
    allDestinations = await fetchDestinations();
    console.log('Fetched destinations:', allDestinations.length);
    
    if (allDestinations.length === 0) {
        showErrorState('destinations-container', 'No destinations found');
        return;
    }
    
    // Setup filters
    setupDestinationFilters();
    
    // Display all destinations initially
    displayDestinations(allDestinations, 'destinations-container');
    
    // Setup explore page specific event listeners
    setupExplorePageEventListeners();
    
    console.log('Explore page initialized successfully');
}

/**
 * Initialize taste page
 */
async function initializeTastePage() {
    console.log('Loading taste page...');
    
    // Show loading state
    showLoadingState('dishes-container');
    
    // Fetch dishes
    allDishes = await fetchDishes();
    console.log('Fetched dishes:', allDishes.length);
    
    if (allDishes.length === 0) {
        showErrorState('dishes-container', 'No dishes found');
        return;
    }
    
    // Display dishes
    displayDishesGrid(allDishes);
    
    // Setup taste page specific event listeners
    setupTastePageEventListeners();
    
    console.log('Taste page initialized successfully');
}

/**
 * Setup destination filters (for explore page)
 */
function setupDestinationFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const regionFilter = document.getElementById('region-filter');
    
    if (categoryFilter) {
        const categories = getUniqueCategories(allDestinations);
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase();
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    if (regionFilter) {
        const regions = getUniqueRegions(allDestinations);
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region.toLowerCase();
            option.textContent = region.charAt(0).toUpperCase() + region.slice(1);
            regionFilter.appendChild(option);
        });
    }
}

/**
 * Setup explore page event listeners
 */
function setupExplorePageEventListeners() {
    const searchInput = document.getElementById('search-input');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const sortSelect = document.getElementById('sort-select');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleDestinationSearch, 300));
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', handleApplyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', handleClearFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

/**
 * Setup taste page event listeners
 */
function setupTastePageEventListeners() {
    // Add any taste page specific event listeners here
    console.log('Taste page event listeners set up');
}

/**
 * Handle destination search
 */
function handleDestinationSearch(e) {
    const searchTerm = e.target.value;
    const filteredDestinations = searchDestinations(allDestinations, searchTerm);
    displayDestinations(filteredDestinations, 'destinations-container');
    updateResultCount(filteredDestinations.length);
}

/**
 * Handle apply filters
 */
function handleApplyFilters() {
    const filters = {
        category: document.getElementById('category-filter')?.value || 'all',
        region: document.getElementById('region-filter')?.value || 'all',
        costLevel: document.getElementById('cost-filter')?.value || 'all',
        search: document.getElementById('search-input')?.value || ''
    };
    
    let filteredDestinations = filterDestinations(allDestinations, filters);
    
    if (filters.search) {
        filteredDestinations = searchDestinations(filteredDestinations, filters.search);
    }
    
    const sortBy = document.getElementById('sort-select')?.value || 'name';
    filteredDestinations = sortDestinations(filteredDestinations, sortBy);
    
    displayDestinations(filteredDestinations, 'destinations-container');
    updateResultCount(filteredDestinations.length);
}

/**
 * Handle clear filters
 */
function handleClearFilters() {
    // Reset all filter inputs
    const inputs = ['search-input', 'category-filter', 'region-filter', 'cost-filter', 'sort-select'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = element.tagName === 'SELECT' ? 'all' : '';
        }
    });
    
    // Display all destinations
    displayDestinations(allDestinations, 'destinations-container');
    updateResultCount(allDestinations.length);
}

/**
 * Handle sort change
 */
function handleSortChange(e) {
    const sortBy = e.target.value;
    
    // Get currently displayed destinations (simplified - get all for now)
    const sortedDestinations = sortDestinations(allDestinations, sortBy);
    
    displayDestinations(sortedDestinations, 'destinations-container');
}

/**
 * Display dishes grid on taste page
 */
function displayDishesGrid(dishes) {
    const container = document.getElementById('dishes-container');
    if (!container) return;
    
    container.innerHTML = dishes.map(dish => `
        <div class="dish-card" data-dish-id="${dish.id}" role="button" tabindex="0">
            <img src="${dish.image}" alt="${dish.name}" class="dish-image" loading="lazy">
            <div class="dish-content">
                <h3 class="dish-name">${dish.name}</h3>
                <div class="dish-type">${dish.type}</div>
                <p class="dish-description">${dish.description}</p>
                <div class="dish-details">
                    <span class="dish-origin">📍 ${dish.origin}</span>
                    <span class="dish-spice">🌶️ ${dish.spiceLevel}</span>
                </div>
                <div class="ingredients-list">
                    <h4>Main Ingredients:</h4>
                    <div class="ingredients">
                        ${dish.ingredients.slice(0, 4).map(ingredient => 
                            `<span class="ingredient-tag">${ingredient}</span>`
                        ).join('')}
                        ${dish.ingredients.length > 4 ? 
                            `<span class="ingredient-tag">+${dish.ingredients.length - 4} more</span>` : 
                            ''
                        }
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click listeners
    container.querySelectorAll('.dish-card').forEach(card => {
        card.addEventListener('click', () => {
            const dishId = card.dataset.dishId;
            showDishModal(dishId);
        });
        
        // Keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const dishId = card.dataset.dishId;
                showDishModal(dishId);
            }
        });
    });
}

/**
 * Show dish modal
 */
function showDishModal(dishId) {
    const dish = getDishById(allDishes, parseInt(dishId));
    
    if (!dish) {
        console.error('Dish not found:', dishId);
        showNotification('Dish details not available', 'error');
        return;
    }
    
    const modal = document.getElementById('dish-modal');
    const modalTitle = document.getElementById('dish-modal-title');
    const modalBody = document.getElementById('dish-modal-body');
    
    if (!modal || !modalTitle || !modalBody) {
        console.error('Dish modal elements not found');
        return;
    }
    
    modalTitle.textContent = dish.name;
    modalBody.innerHTML = `
        <div class="modal-dish-content">
            <img src="${dish.image}" alt="${dish.name}" class="modal-image">
            <div class="dish-full-details">
                <div class="dish-meta">
                    <span class="dish-type-badge">${dish.type}</span>
                    <span class="origin-badge">📍 ${dish.origin}</span>
                    <span class="spice-badge">🌶️ ${dish.spiceLevel}</span>
                </div>
                <p class="dish-full-description">${dish.description}</p>
                
                <div class="cooking-info">
                    <div class="info-item">
                        <strong>⏱️ Cooking Time:</strong> ${dish.cookingTime}
                    </div>
                    <div class="info-item">
                        <strong>👨‍🍳 Difficulty:</strong> ${dish.difficulty}
                    </div>
                    <div class="info-item">
                        <strong>🍽️ Servings:</strong> ${dish.servings}
                    </div>
                    ${dish.prepTime ? `
                        <div class="info-item">
                            <strong>⏰ Prep Time:</strong> ${dish.prepTime}
                        </div>
                    ` : ''}
                    ${dish.calories ? `
                        <div class="info-item">
                            <strong>🔥 Calories:</strong> ${dish.calories}
                        </div>
                    ` : ''}
                    ${dish.price ? `
                        <div class="info-item">
                            <strong>💰 Price Range:</strong> ${dish.price}
                        </div>
                    ` : ''}
                </div>

                <div class="full-ingredients">
                    <h4>🥘 Complete Ingredients List:</h4>
                    <div class="ingredients-grid">
                        ${dish.ingredients.map(ingredient => 
                            `<span class="ingredient-item">${ingredient}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modal);
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
    setupModalEvents();
    
    // Window scroll events for navbar styling
    window.addEventListener('scroll', handleScroll);
    
    // Listen for destination modal events
    document.addEventListener('showDestinationModal', (e) => {
        const { destinationId } = e.detail;
        showDestinationModal(destinationId);
    });
}

/**
 * Setup modal events
 */
function setupModalEvents() {
    // Destination modal
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
    }
    
    // Dish modal
    const closeDishModal = document.getElementById('close-dish-modal');
    const dishModal = document.getElementById('dish-modal');
    
    if (closeDishModal && dishModal) {
        closeDishModal.addEventListener('click', () => hideModal(dishModal));
        
        // Close modal when clicking outside
        dishModal.addEventListener('click', (e) => {
            if (e.target === dishModal) {
                hideModal(dishModal);
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => hideModal(modal));
        }
    });
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

/**
 * Show destination modal with detailed information
 * Demonstrates async data retrieval and template literals
 */
async function showDestinationModal(destinationId) {
    try {
        const destination = allDestinations.find(d => d.id == destinationId);
        
        if (!destination) {
            throw new Error('Destination not found');
        }
        
        const modal = document.getElementById('destination-modal');
        const modalBody = document.getElementById('modal-body');
        const modalTitle = document.getElementById('modal-title');
        
        if (!modal || !modalBody || !modalTitle) {
            throw new Error('Modal elements not found');
        }
        
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
 * Show loading state
 */
function showLoadingState(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-animation"></div>
                <p class="spinner-message">Loading content...</p>
            </div>
        `;
    }
}

/**
 * Show error state
 */
function showErrorState(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Reload Page</button>
            </div>
        `;
    }
}

/**
 * Update result count
 */
function updateResultCount(count) {
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
        resultCount.textContent = `${count} destination${count !== 1 ? 's' : ''} found`;
    }
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

/**
 * Debounce function for search
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle missing images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Missing image:', this.src);
        });
    });
});

// Export functions for use in other modules if needed
export { 
    getRandomDestinations, 
    showDestinationModal, 
    showErrorMessage,
    handleScroll
};