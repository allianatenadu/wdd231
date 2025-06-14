// Destinations module for Experience Ghana website
// Handles data fetching, filtering, and display of Ghana destinations
// Demonstrates async operations, array methods, and template literals

/**
 * Fetch destinations data from JSON file
 * Demonstrates async/await with proper error handling using try-catch
 * @returns {Promise<Array>} Array of destination objects
 */
export async function fetchDestinations() {
    try {
        const response = await fetch('./data/destinations.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const destinations = await response.json();
        
        // Validate the data structure
        if (!Array.isArray(destinations)) {
            throw new Error('Invalid data format: expected array');
        }
        
        // Ensure each destination has required properties
        const validatedDestinations = destinations.filter(dest => {
            return dest.id && dest.name && dest.location && dest.description && dest.image;
        });
        
        console.log(`Successfully fetched ${validatedDestinations.length} destinations`);
        return validatedDestinations;
        
    } catch (error) {
        console.error('Error fetching destinations:', error);
        
        // Return empty array on error to prevent crashes
        return [];
    }
}

/**
 * Display destinations preview on homepage
 * Demonstrates template literals and DOM manipulation
 * @param {Array} destinations - Array of destination objects to display
 * @param {string} containerId - ID of container element
 */
export function displayDestinationsPreview(destinations, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }
    
    if (!destinations || destinations.length === 0) {
        container.innerHTML = `
            <div class="no-destinations">
                <p>No destinations available at the moment.</p>
                <p>Please try again later.</p>
            </div>
        `;
        return;
    }
    
    // Use template literals to create destination cards
    container.innerHTML = destinations.map(destination => `
        <div class="destination-card" data-id="${destination.id}" role="button" tabindex="0" 
             aria-label="View details for ${destination.name}">
            <img src="${destination.image}" 
                 alt="${destination.name} - ${destination.location}" 
                 loading="lazy"
                 onerror="this.src='images/placeholder.jpg'; this.alt='Image not available';">
            <div class="destination-card-content">
                <h3>${destination.name}</h3>
                <p class="location">📍 ${destination.location}</p>
                <p class="description">${truncateText(destination.description, 100)}</p>
                <div class="destination-meta">
                    <span class="rating" title="Rating out of 5">
                        ⭐ ${destination.rating}
                    </span>
                    <span class="cost-level" title="Cost level">
                        💰 ${destination.costLevel}
                    </span>
                    <span class="category" title="Category">
                        🏷️ ${destination.category}
                    </span>
                </div>
                <div class="destination-activities">
                    ${destination.activities.slice(0, 3).map(activity => 
                        `<span class="activity-tag">${activity}</span>`
                    ).join('')}
                    ${destination.activities.length > 3 ? 
                        `<span class="activity-more">+${destination.activities.length - 3} more</span>` : 
                        ''
                    }
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click event listeners to cards
    const cards = container.querySelectorAll('.destination-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const destinationId = card.dataset.id;
            // Trigger custom event for modal display
            document.dispatchEvent(new CustomEvent('showDestinationModal', {
                detail: { destinationId }
            }));
        });
        
        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

/**
 * Display full destinations list (for explore page)
 * Demonstrates array methods and advanced filtering
 * @param {Array} destinations - Array of destination objects
 * @param {string} containerId - ID of container element
 * @param {Object} filters - Filter options
 */
export function displayDestinations(destinations, containerId, filters = {}) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return;
    }
    
    // Apply filters using array methods
    let filteredDestinations = [...destinations];
    
    if (filters.category && filters.category !== 'all') {
        filteredDestinations = filteredDestinations.filter(dest => 
            dest.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    if (filters.region && filters.region !== 'all') {
        filteredDestinations = filteredDestinations.filter(dest => 
            dest.region.toLowerCase() === filters.region.toLowerCase()
        );
    }
    
    if (filters.costLevel && filters.costLevel !== 'all') {
        filteredDestinations = filteredDestinations.filter(dest => 
            dest.costLevel.toLowerCase().includes(filters.costLevel.toLowerCase())
        );
    }
    
    if (filters.search) {
        filteredDestinations = filteredDestinations.filter(dest => 
            dest.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            dest.location.toLowerCase().includes(filters.search.toLowerCase()) ||
            dest.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            dest.activities.some(activity => 
                activity.toLowerCase().includes(filters.search.toLowerCase())
            )
        );
    }
    
    // Sort destinations based on filters
    if (filters.sortBy) {
        filteredDestinations = sortDestinations(filteredDestinations, filters.sortBy);
    }
    
    // Display results count
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
        resultCount.textContent = `${filteredDestinations.length} destination${filteredDestinations.length !== 1 ? 's' : ''} found`;
    }
    
    if (filteredDestinations.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No destinations found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button onclick="clearAllFilters()" class="btn-secondary">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    // Create destinations grid using template literals
    container.innerHTML = `
        <div class="destinations-grid">
            ${filteredDestinations.map(destination => `
                <div class="destination-card full" data-id="${destination.id}" role="button" tabindex="0">
                    <div class="destination-image-container">
                        <img src="${destination.image}" 
                             alt="${destination.name}" 
                             loading="lazy"
                             onerror="this.src='images/placeholder.jpg';">
                        <div class="destination-overlay">
                            <span class="category-badge">${destination.category}</span>
                            <span class="rating-badge">⭐ ${destination.rating}</span>
                        </div>
                    </div>
                    <div class="destination-content">
                        <div class="destination-header">
                            <h3>${destination.name}</h3>
                            <p class="location">📍 ${destination.location}</p>
                        </div>
                        <p class="description">${destination.description}</p>
                        <div class="destination-details">
                            <div class="detail-row">
                                <span class="detail-label">Best Time:</span>
                                <span class="detail-value">${destination.bestTime}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Duration:</span>
                                <span class="detail-value">${destination.duration}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Cost:</span>
                                <span class="detail-value">${destination.costLevel}</span>
                            </div>
                        </div>
                        <div class="activities-container">
                            <h4>Activities:</h4>
                            <div class="activities-list">
                                ${destination.activities.map(activity => 
                                    `<span class="activity-tag">${activity}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="highlights-container">
                            <h4>Highlights:</h4>
                            <ul class="highlights-list">
                                ${destination.highlights.map(highlight => 
                                    `<li>${highlight}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <button class="learn-more-btn" data-id="${destination.id}">
                            Learn More
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add event listeners
    addDestinationCardListeners(container);
}

/**
 * Filter destinations by various criteria
 * Demonstrates advanced array filtering methods
 * @param {Array} destinations - Array of destinations to filter
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Filtered destinations
 */
export function filterDestinations(destinations, criteria) {
    return destinations.filter(destination => {
        // Filter by multiple criteria using array methods
        const matchesCategory = !criteria.category || 
            criteria.category === 'all' || 
            destination.category.toLowerCase() === criteria.category.toLowerCase();
            
        const matchesRegion = !criteria.region || 
            criteria.region === 'all' || 
            destination.region.toLowerCase() === criteria.region.toLowerCase();
            
        const matchesCost = !criteria.costLevel || 
            criteria.costLevel === 'all' || 
            destination.costLevel.toLowerCase().includes(criteria.costLevel.toLowerCase());
            
        const matchesRating = !criteria.minRating || 
            destination.rating >= parseFloat(criteria.minRating);
            
        const matchesActivities = !criteria.activities || 
            criteria.activities.length === 0 || 
            criteria.activities.some(activity => 
                destination.activities.some(destActivity => 
                    destActivity.toLowerCase().includes(activity.toLowerCase())
                )
            );
            
        return matchesCategory && matchesRegion && matchesCost && matchesRating && matchesActivities;
    });
}

/**
 * Sort destinations by specified criteria
 * Demonstrates array sorting methods
 * @param {Array} destinations - Array to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted destinations
 */
export function sortDestinations(destinations, sortBy) {
    const sortedDestinations = [...destinations];
    
    switch (sortBy) {
        case 'name':
            return sortedDestinations.sort((a, b) => a.name.localeCompare(b.name));
            
        case 'rating':
            return sortedDestinations.sort((a, b) => b.rating - a.rating);
            
        case 'location':
            return sortedDestinations.sort((a, b) => a.location.localeCompare(b.location));
            
        case 'category':
            return sortedDestinations.sort((a, b) => a.category.localeCompare(b.category));
            
        case 'cost':
            // Custom sort for cost levels
            const costOrder = { 'free': 0, 'budget-friendly': 1, 'moderate': 2, 'expensive': 3 };
            return sortedDestinations.sort((a, b) => {
                const costA = costOrder[a.costLevel.toLowerCase()] || 99;
                const costB = costOrder[b.costLevel.toLowerCase()] || 99;
                return costA - costB;
            });
            
        default:
            return sortedDestinations;
    }
}

/**
 * Get destinations by category
 * Demonstrates array filtering and grouping
 * @param {Array} destinations - All destinations
 * @param {string} category - Category to filter by
 * @returns {Array} Destinations in specified category
 */
export function getDestinationsByCategory(destinations, category) {
    if (category === 'all') {
        return destinations;
    }
    
    return destinations.filter(dest => 
        dest.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Get destinations by region
 * Demonstrates array methods for geographical filtering
 * @param {Array} destinations - All destinations
 * @param {string} region - Region to filter by
 * @returns {Array} Destinations in specified region
 */
export function getDestinationsByRegion(destinations, region) {
    if (region === 'all') {
        return destinations;
    }
    
    return destinations.filter(dest => 
        dest.region.toLowerCase() === region.toLowerCase()
    );
}

/**
 * Search destinations by text
 * Demonstrates comprehensive text searching with array methods
 * @param {Array} destinations - All destinations
 * @param {string} searchTerm - Text to search for
 * @returns {Array} Matching destinations
 */
export function searchDestinations(destinations, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return destinations;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return destinations.filter(dest => {
        // Search in multiple fields
        const searchableText = [
            dest.name,
            dest.location,
            dest.description,
            dest.category,
            dest.region,
            ...dest.activities,
            ...dest.highlights
        ].join(' ').toLowerCase();
        
        return searchableText.includes(term);
    });
}

/**
 * Get unique categories from destinations
 * Demonstrates array methods for data extraction
 * @param {Array} destinations - All destinations
 * @returns {Array} Unique categories
 */
export function getUniqueCategories(destinations) {
    const categories = destinations.map(dest => dest.category);
    return [...new Set(categories)].sort();
}

/**
 * Get unique regions from destinations
 * Demonstrates Set for unique values
 * @param {Array} destinations - All destinations
 * @returns {Array} Unique regions
 */
export function getUniqueRegions(destinations) {
    const regions = destinations.map(dest => dest.region);
    return [...new Set(regions)].sort();
}

/**
 * Get destination statistics
 * Demonstrates array methods for data analysis
 * @param {Array} destinations - All destinations
 * @returns {Object} Statistics object
 */
export function getDestinationStats(destinations) {
    if (!destinations || destinations.length === 0) {
        return {
            total: 0,
            averageRating: 0,
            categories: [],
            regions: [],
            costLevels: []
        };
    }
    
    // Calculate statistics using array methods
    const totalDestinations = destinations.length;
    const averageRating = destinations.reduce((sum, dest) => sum + dest.rating, 0) / totalDestinations;
    const categories = getUniqueCategories(destinations);
    const regions = getUniqueRegions(destinations);
    const costLevels = [...new Set(destinations.map(dest => dest.costLevel))].sort();
    
    // Count destinations by category
    const categoryCount = destinations.reduce((acc, dest) => {
        acc[dest.category] = (acc[dest.category] || 0) + 1;
        return acc;
    }, {});
    
    // Count destinations by region
    const regionCount = destinations.reduce((acc, dest) => {
        acc[dest.region] = (acc[dest.region] || 0) + 1;
        return acc;
    }, {});
    
    return {
        total: totalDestinations,
        averageRating: Math.round(averageRating * 10) / 10,
        categories,
        regions,
        costLevels,
        categoryCount,
        regionCount,
        topRated: destinations.filter(dest => dest.rating >= 4.5).length,
        budgetFriendly: destinations.filter(dest => 
            dest.costLevel.toLowerCase().includes('budget') || 
            dest.costLevel.toLowerCase().includes('free')
        ).length
    };
}

/**
 * Utility function to truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Add event listeners to destination cards
 * @param {Element} container - Container element
 */
function addDestinationCardListeners(container) {
    const cards = container.querySelectorAll('.destination-card');
    const learnMoreBtns = container.querySelectorAll('.learn-more-btn');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on button
            if (e.target.classList.contains('learn-more-btn')) {
                return;
            }
            
            const destinationId = card.dataset.id;
            document.dispatchEvent(new CustomEvent('showDestinationModal', {
                detail: { destinationId }
            }));
        });
        
        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const destinationId = btn.dataset.id;
            document.dispatchEvent(new CustomEvent('showDestinationModal', {
                detail: { destinationId }
            }));
        });
    });
}