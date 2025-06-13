// Local Storage Module for Experience Ghana website
// Handles user preferences, visited destinations, and application state
// Demonstrates localStorage usage for client-side data persistence

// Storage keys for organization
const STORAGE_KEYS = {
    USER_PREFERENCES: 'ghana_user_preferences',
    VISITED_DESTINATIONS: 'ghana_visited_destinations',
    SEARCH_HISTORY: 'ghana_search_history',
    BOOKMARKED_DESTINATIONS: 'ghana_bookmarks',
    USER_PROFILE: 'ghana_user_profile',
    APP_SETTINGS: 'ghana_app_settings',
    CACHED_DATA: 'ghana_cached_data'
};

/**
 * Save user preference to localStorage
 * Demonstrates localStorage setItem with error handling
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 * @returns {boolean} Success status
 */
export function saveUserPreference(key, value) {
    try {
        const preferences = getUserPreferences();
        preferences[key] = value;
        preferences.lastUpdated = new Date().toISOString();
        
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
        
        // Trigger custom event for preference changes
        window.dispatchEvent(new CustomEvent('preferenceChanged', {
            detail: { key, value }
        }));
        
        return true;
    } catch (error) {
        console.error('Error saving user preference:', error);
        return false;
    }
}



/**
 * Get user preference from localStorage
 * Demonstrates localStorage getItem with fallback values
 * @param {string} key - Preference key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Preference value or default
 */
export function getUserPreference(key, defaultValue = null) {
    try {
        const preferences = getUserPreferences();
        return preferences.hasOwnProperty(key) ? preferences[key] : defaultValue;
    } catch (error) {
        console.error('Error getting user preference:', error);
        return defaultValue;
    }
}

// ... rest of your functions remain the same
/**
 * Get all user preferences
 * @returns {Object} All user preferences
 */
export function getUserPreferences() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Error parsing user preferences:', error);
        return {};
    }
}

/**
 * Remove user preference
 * @param {string} key - Preference key to remove
 * @returns {boolean} Success status
 */
export function removeUserPreference(key) {
    try {
        const preferences = getUserPreferences();
        delete preferences[key];
        preferences.lastUpdated = new Date().toISOString();
        
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
        
        window.dispatchEvent(new CustomEvent('preferenceRemoved', {
            detail: { key }
        }));
        
        return true;
    } catch (error) {
        console.error('Error removing user preference:', error);
        return false;
    }
}

/**
 * Save visited destination
 * Demonstrates array manipulation in localStorage
 * @param {Object} destination - Destination object
 */
export function saveVisitedDestination(destination) {
    try {
        const visited = getVisitedDestinations();
        
        // Check if already visited
        const existingIndex = visited.findIndex(d => d.id === destination.id);
        
        const visitRecord = {
            ...destination,
            visitedAt: new Date().toISOString(),
            visitCount: existingIndex >= 0 ? visited[existingIndex].visitCount + 1 : 1
        };
        
        if (existingIndex >= 0) {
            // Update existing visit
            visited[existingIndex] = visitRecord;
        } else {
            // Add new visit
            visited.push(visitRecord);
        }
        
        // Keep only last 50 visited destinations
        if (visited.length > 50) {
            visited.sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));
            visited.splice(50);
        }
        
        localStorage.setItem(STORAGE_KEYS.VISITED_DESTINATIONS, JSON.stringify(visited));
        
        // Update user statistics
        updateUserStats('destinationsVisited', visited.length);
        
        return true;
    } catch (error) {
        console.error('Error saving visited destination:', error);
        return false;
    }
}

/**
 * Get visited destinations
 * @returns {Array} Array of visited destinations
 */
export function getVisitedDestinations() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.VISITED_DESTINATIONS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting visited destinations:', error);
        return [];
    }
}

/**
 * Check if destination has been visited
 * @param {number} destinationId - Destination ID
 * @returns {boolean} Whether destination has been visited
 */
export function hasVisitedDestination(destinationId) {
    const visited = getVisitedDestinations();
    return visited.some(d => d.id === destinationId);
}

/**
 * Save search term to history
 * Demonstrates search history management
 * @param {string} searchTerm - Search term to save
 */
export function saveSearchTerm(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return;
    
    try {
        const history = getSearchHistory();
        const term = searchTerm.trim().toLowerCase();
        
        // Remove existing occurrence
        const filtered = history.filter(item => item.term !== term);
        
        // Add to beginning
        filtered.unshift({
            term: term,
            searchedAt: new Date().toISOString(),
            count: (history.find(item => item.term === term)?.count || 0) + 1
        });
        
        // Keep only last 20 searches
        const limited = filtered.slice(0, 20);
        
        localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
        
        return true;
    } catch (error) {
        console.error('Error saving search term:', error);
        return false;
    }
}

/**
 * Get search history
 * @returns {Array} Array of search history items
 */
export function getSearchHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting search history:', error);
        return [];
    }
}

/**
 * Clear search history
 */
export function clearSearchHistory() {
    try {
        localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
        return true;
    } catch (error) {
        console.error('Error clearing search history:', error);
        return false;
    }
}

/**
 * Bookmark destination
 * Demonstrates bookmark management with localStorage
 * @param {Object} destination - Destination to bookmark
 * @returns {boolean} Success status
 */
export function bookmarkDestination(destination) {
    try {
        const bookmarks = getBookmarkedDestinations();
        
        // Check if already bookmarked
        const isBookmarked = bookmarks.some(b => b.id === destination.id);
        if (isBookmarked) {
            return false; // Already bookmarked
        }
        
        const bookmark = {
            ...destination,
            bookmarkedAt: new Date().toISOString()
        };
        
        bookmarks.push(bookmark);
        localStorage.setItem(STORAGE_KEYS.BOOKMARKED_DESTINATIONS, JSON.stringify(bookmarks));
        
        // Update user statistics
        updateUserStats('destinationsBookmarked', bookmarks.length);
        
        return true;
    } catch (error) {
        console.error('Error bookmarking destination:', error);
        return false;
    }
}

/**
 * Remove bookmark
 * @param {number} destinationId - Destination ID to unbookmark
 * @returns {boolean} Success status
 */
export function removeBookmark(destinationId) {
    try {
        const bookmarks = getBookmarkedDestinations();
        const filtered = bookmarks.filter(b => b.id !== destinationId);
        
        localStorage.setItem(STORAGE_KEYS.BOOKMARKED_DESTINATIONS, JSON.stringify(filtered));
        
        // Update user statistics
        updateUserStats('destinationsBookmarked', filtered.length);
        
        return true;
    } catch (error) {
        console.error('Error removing bookmark:', error);
        return false;
    }
}

/**
 * Get bookmarked destinations
 * @returns {Array} Array of bookmarked destinations
 */
export function getBookmarkedDestinations() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_DESTINATIONS);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error getting bookmarked destinations:', error);
        return [];
    }
}

/**
 * Check if destination is bookmarked
 * @param {number} destinationId - Destination ID
 * @returns {boolean} Whether destination is bookmarked
 */
export function isDestinationBookmarked(destinationId) {
    const bookmarks = getBookmarkedDestinations();
    return bookmarks.some(b => b.id === destinationId);
}

/**
 * Save user profile information
 * @param {Object} profile - User profile data
 * @returns {boolean} Success status
 */
export function saveUserProfile(profile) {
    try {
        const currentProfile = getUserProfile();
        const updatedProfile = {
            ...currentProfile,
            ...profile,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
        
        window.dispatchEvent(new CustomEvent('profileUpdated', {
            detail: { profile: updatedProfile }
        }));
        
        return true;
    } catch (error) {
        console.error('Error saving user profile:', error);
        return false;
    }
}

/**
 * Get user profile
 * @returns {Object} User profile data
 */
export function getUserProfile() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        return stored ? JSON.parse(stored) : {
            name: '',
            email: '',
            interests: [],
            travelStyle: '',
            budget: '',
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error getting user profile:', error);
        return {};
    }
}

/**
 * Update user statistics
 * @param {string} stat - Statistic name
 * @param {any} value - Statistic value
 */
function updateUserStats(stat, value) {
    try {
        const profile = getUserProfile();
        if (!profile.stats) {
            profile.stats = {};
        }
        
        profile.stats[stat] = value;
        profile.stats.lastUpdated = new Date().toISOString();
        
        saveUserProfile(profile);
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

/**
 * Get user statistics
 * @returns {Object} User statistics
 */
export function getUserStats() {
    const profile = getUserProfile();
    const visited = getVisitedDestinations();
    const bookmarks = getBookmarkedDestinations();
    const searches = getSearchHistory();
    
    return {
        destinationsVisited: visited.length,
        destinationsBookmarked: bookmarks.length,
        searchesMade: searches.reduce((total, search) => total + search.count, 0),
        uniqueSearches: searches.length,
        totalVisits: visited.reduce((total, dest) => total + dest.visitCount, 0),
        favoriteCategories: getFavoriteCategories(visited),
        recentActivity: getRecentActivity(),
        accountAge: profile.createdAt ? 
            Math.floor((Date.now() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24)) : 0
    };
}

/**
 * Get favorite categories based on visited destinations
 * @param {Array} visited - Visited destinations
 * @returns {Array} Favorite categories
 */
function getFavoriteCategories(visited) {
    const categoryCount = visited.reduce((acc, dest) => {
        const category = dest.category || 'Unknown';
        acc[category] = (acc[category] || 0) + dest.visitCount;
        return acc;
    }, {});
    
    return Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category, count]) => ({ category, count }));
}

/**
 * Get recent user activity
 * @returns {Array} Recent activity items
 */
function getRecentActivity() {
    const visited = getVisitedDestinations();
    const bookmarks = getBookmarkedDestinations();
    const searches = getSearchHistory();
    
    const activities = [
        ...visited.map(dest => ({
            type: 'visit',
            destination: dest.name,
            timestamp: dest.visitedAt
        })),
        ...bookmarks.map(dest => ({
            type: 'bookmark',
            destination: dest.name,
            timestamp: dest.bookmarkedAt
        })),
        ...searches.slice(0, 5).map(search => ({
            type: 'search',
            term: search.term,
            timestamp: search.searchedAt
        }))
    ];
    
    return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
}

/**
 * Cache data for offline access
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
export function cacheData(key, data, ttl = 24 * 60 * 60 * 1000) { // 24 hours default
    try {
        const cached = getCachedData();
        cached[key] = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        };
        
        localStorage.setItem(STORAGE_KEYS.CACHED_DATA, JSON.stringify(cached));
        return true;
    } catch (error) {
        console.error('Error caching data:', error);
        return false;
    }
}

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {any} Cached data or null if expired/not found
 */
export function getCachedData(key = null) {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.CACHED_DATA);
        const cached = stored ? JSON.parse(stored) : {};
        
        if (key === null) {
            return cached;
        }
        
        const item = cached[key];
        if (!item) {
            return null;
        }
        
        // Check if expired
        if (Date.now() - item.timestamp > item.ttl) {
            delete cached[key];
            localStorage.setItem(STORAGE_KEYS.CACHED_DATA, JSON.stringify(cached));
            return null;
        }
        
        return item.data;
    } catch (error) {
        console.error('Error getting cached data:', error);
        return null;
    }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache() {
    try {
        const cached = getCachedData();
        const now = Date.now();
        let hasChanges = false;
        
        Object.keys(cached).forEach(key => {
            const item = cached[key];
            if (now - item.timestamp > item.ttl) {
                delete cached[key];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            localStorage.setItem(STORAGE_KEYS.CACHED_DATA, JSON.stringify(cached));
        }
        
        return true;
    } catch (error) {
        console.error('Error clearing expired cache:', error);
        return false;
    }
}

/**
 * Clear all stored data
 * @returns {boolean} Success status
 */
export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        
        window.dispatchEvent(new CustomEvent('dataCleared'));
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }
}

/**
 * Get storage usage information
 * @returns {Object} Storage usage stats
 */
export function getStorageInfo() {
    try {
        let totalSize = 0;
        const breakdown = {};
        
        Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
            const item = localStorage.getItem(key);
            const size = item ? new Blob([item]).size : 0;
            breakdown[name] = {
                size: size,
                sizeFormatted: formatBytes(size),
                exists: !!item
            };
            totalSize += size;
        });
        
        // Estimate total localStorage usage
        let totalLocalStorage = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalLocalStorage += localStorage[key].length;
            }
        }
        
        return {
            appStorage: {
                total: totalSize,
                totalFormatted: formatBytes(totalSize),
                breakdown: breakdown
            },
            localStorage: {
                total: totalLocalStorage,
                totalFormatted: formatBytes(totalLocalStorage),
                limit: 5 * 1024 * 1024, // Typical 5MB limit
                limitFormatted: '5 MB',
                percentage: (totalLocalStorage / (5 * 1024 * 1024)) * 100
            }
        };
    } catch (error) {
        console.error('Error getting storage info:', error);
        return null;
    }
}

/**
 * Format bytes to human readable format
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Initialize storage module
 * Clears expired cache and sets up event listeners
 */
export function initializeStorage() {
    // Clear expired cache on initialization
    clearExpiredCache();
    
    // Set up storage event listeners for cross-tab communication
    window.addEventListener('storage', (e) => {
        if (Object.values(STORAGE_KEYS).includes(e.key)) {
            window.dispatchEvent(new CustomEvent('storageChanged', {
                detail: {
                    key: e.key,
                    oldValue: e.oldValue,
                    newValue: e.newValue
                }
            }));
        }
    });
    
    console.log('Storage module initialized');
}  
