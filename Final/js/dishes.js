// Dishes Module for Experience Ghana website
// Handles fetching and managing Ghanaian dishes data
// Demonstrates async/await, error handling, and data processing

/**
 * Fetch dishes data from JSON file
 * Demonstrates async/await with try-catch error handling
 * @returns {Promise<Array>} Array of dish objects
 */
export async function fetchDishes() {
    try {
        const response = await fetch('./data/dishes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dishes = await response.json();
        
        // Validate data structure
        if (!Array.isArray(dishes)) {
            throw new Error('Invalid data format: expected array');
        }
        
        // Add timestamp for caching
        const dishesWithTimestamp = dishes.map(dish => ({
            ...dish,
            fetchedAt: new Date().toISOString()
        }));
        
        console.log(`Successfully fetched ${dishes.length} dishes`);
        return dishesWithTimestamp;
        
    } catch (error) {
        console.error('Error fetching dishes:', error);
        
        // Return fallback data if fetch fails
        return getFallbackDishes();
    }
}

/**
 * Get fallback dishes data when fetch fails
 * Demonstrates error recovery and data resilience
 * @returns {Array} Fallback dish data
 */
function getFallbackDishes() {
    return [
        {
            id: 1,
            name: "Jollof Rice",
            type: "Main Dish",
            description: "Ghana's signature rice dish cooked in a rich tomato sauce with spices and vegetables. Often served with chicken, beef, or fish.",
            origin: "Akan Region",
            spiceLevel: "Medium",
            ingredients: ["Rice", "Tomatoes", "Onions", "Garlic", "Ginger", "Bay leaves", "Thyme", "Scotch bonnet pepper"],
            image: "images/jollof-rice.jpg",
            cookingTime: "45 minutes",
            difficulty: "Medium",
            servings: "4-6 people",
            category: "Traditional",
            price: "₵15-25",
            calories: "350 per serving",
            prepTime: "15 minutes",
            fetchedAt: new Date().toISOString()
        },
        {
            id: 2,
            name: "Fufu with Palm Nut Soup",
            type: "Main Dish",
            description: "Traditional pounded cassava and plantain served with rich palm nut soup containing meat or fish and vegetables.",
            origin: "Ashanti Region",
            spiceLevel: "Mild",
            ingredients: ["Cassava", "Plantain", "Palm nuts", "Meat/Fish", "Tomatoes", "Onions", "Spinach"],
            image: "images/fufu-palm-soup.jpg",
            cookingTime: "90 minutes",
            difficulty: "Hard",
            servings: "4-5 people",
            category: "Traditional",
            price: "₵20-30",
            calories: "400 per serving",
            prepTime: "30 minutes",
            fetchedAt: new Date().toISOString()
        },
        {
            id: 3,
            name: "Kelewele",
            type: "Snack",
            description: "Spiced fried plantain cubes seasoned with ginger, garlic, and hot pepper. Perfect as a snack or side dish.",
            origin: "Ga Region",
            spiceLevel: "Hot",
            ingredients: ["Ripe plantains", "Ginger", "Garlic", "Scotch bonnet", "Nutmeg", "Cloves", "Salt"],
            image: "images/kelewele.jpg",
            cookingTime: "20 minutes",
            difficulty: "Easy",
            servings: "3-4 people",
            category: "Street Food",
            price: "₵5-10",
            calories: "180 per serving",
            prepTime: "10 minutes",
            fetchedAt: new Date().toISOString()
        },
        {
            id: 4,
            name: "Banku with Tilapia",
            type: "Main Dish",
            description: "Fermented corn and cassava dumpling served with grilled tilapia and spicy pepper sauce.",
            origin: "Ewe Region",
            spiceLevel: "Hot",
            ingredients: ["Corn dough", "Cassava dough", "Tilapia", "Tomatoes", "Pepper", "Onions", "Ginger"],
            image: "images/banku-tilapia.jpg",
            cookingTime: "60 minutes",
            difficulty: "Medium",
            servings: "2-3 people",
            category: "Traditional",
            price: "₵18-28",
            calories: "420 per serving",
            prepTime: "20 minutes",
            fetchedAt: new Date().toISOString()
        },
        {
            id: 5,
            name: "Waakye",
            type: "Main Dish",
            description: "Rice and beans cooked together with millet stalks, giving it a distinctive brown color. Served with various sides.",
            origin: "Northern Region",
            spiceLevel: "Mild",
            ingredients: ["Rice", "Black-eyed peas", "Millet stalks", "Gari", "Boiled eggs", "Spaghetti", "Stew"],
            image: "images/waakye.jpg",
            cookingTime: "50 minutes",
            difficulty: "Medium",
            servings: "4-6 people",
            category: "Traditional",
            price: "₵12-20",
            calories: "320 per serving",
            prepTime: "15 minutes",
            fetchedAt: new Date().toISOString()
        },
        {
            id: 6,
            name: "Red Red",
            type: "Main Dish",
            description: "Black-eyed peas stewed in palm oil with tomatoes and spices, served with fried plantain and gari.",
            origin: "Ashanti Region",
            spiceLevel: "Medium",
            ingredients: ["Black-eyed peas", "Palm oil", "Tomatoes", "Onions", "Plantain", "Gari", "Fish/Meat"],
            image: "images/red-red.jpg",
            cookingTime: "75 minutes",
            difficulty: "Medium",
            servings: "4-5 people",
            category: "Traditional",
            price: "₵14-22",
            calories: "380 per serving",
            prepTime: "25 minutes",
            fetchedAt: new Date().toISOString()
        }
    ];
}

/**
 * Filter dishes by category
 * Demonstrates array filter method
 * @param {Array} dishes - Array of dish objects
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered dishes
 */
export function filterDishesByCategory(dishes, category) {
    if (!category || category === 'all') {
        return dishes;
    }
    
    return dishes.filter(dish => 
        dish.category && dish.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Filter dishes by spice level
 * Demonstrates array filter method with multiple conditions
 * @param {Array} dishes - Array of dish objects
 * @param {string} spiceLevel - Spice level to filter by
 * @returns {Array} Filtered dishes
 */
export function filterDishesBySpiceLevel(dishes, spiceLevel) {
    if (!spiceLevel || spiceLevel === 'all') {
        return dishes;
    }
    
    return dishes.filter(dish => 
        dish.spiceLevel && dish.spiceLevel.toLowerCase() === spiceLevel.toLowerCase()
    );
}

/**
 * Sort dishes by specified criteria
 * Demonstrates array sort method with multiple sorting options
 * @param {Array} dishes - Array of dish objects
 * @param {string} sortBy - Sort criteria (name, difficulty, cookingTime)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} Sorted dishes
 */
export function sortDishes(dishes, sortBy = 'name', order = 'asc') {
    const sortedDishes = [...dishes]; // Create copy to avoid mutation
    
    sortedDishes.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
            case 'name':
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'difficulty':
                const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
                valueA = difficultyOrder[a.difficulty.toLowerCase()] || 0;
                valueB = difficultyOrder[b.difficulty.toLowerCase()] || 0;
                break;
            case 'cookingTime':
                // Extract minutes from cooking time string
                valueA = parseInt(a.cookingTime) || 0;
                valueB = parseInt(b.cookingTime) || 0;
                break;
            case 'spiceLevel':
                const spiceOrder = { 'mild': 1, 'medium': 2, 'hot': 3 };
                valueA = spiceOrder[a.spiceLevel.toLowerCase()] || 0;
                valueB = spiceOrder[b.spiceLevel.toLowerCase()] || 0;
                break;
            default:
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
        }
        
        if (order === 'desc') {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        } else {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        }
    });
    
    return sortedDishes;
}

/**
 * Search dishes by name, ingredients, or description
 * Demonstrates array filter method with string matching
 * @param {Array} dishes - Array of dish objects
 * @param {string} searchTerm - Search term
 * @returns {Array} Matching dishes
 */
export function searchDishes(dishes, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return dishes;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return dishes.filter(dish => {
        // Search in name
        if (dish.name.toLowerCase().includes(term)) {
            return true;
        }
        
        // Search in description
        if (dish.description.toLowerCase().includes(term)) {
            return true;
        }
        
        // Search in ingredients
        if (dish.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(term)
        )) {
            return true;
        }
        
        // Search in origin
        if (dish.origin && dish.origin.toLowerCase().includes(term)) {
            return true;
        }
        
        return false;
    });
}

/**
 * Get dish by ID
 * Demonstrates array find method
 * @param {Array} dishes - Array of dish objects
 * @param {number} dishId - Dish ID to find
 * @returns {Object|null} Found dish or null
 */
export function getDishById(dishes, dishId) {
    return dishes.find(dish => dish.id === parseInt(dishId)) || null;
}

/**
 * Get dishes by difficulty level
 * Demonstrates array filter method
 * @param {Array} dishes - Array of dish objects
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @returns {Array} Dishes matching difficulty
 */
export function getDishesByDifficulty(dishes, difficulty) {
    if (!difficulty) {
        return dishes;
    }
    
    return dishes.filter(dish => 
        dish.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
}

/**
 * Get random dishes
 * Demonstrates array manipulation and randomization
 * @param {Array} dishes - Array of dish objects
 * @param {number} count - Number of random dishes to return
 * @returns {Array} Random selection of dishes
 */
export function getRandomDishes(dishes, count = 3) {
    if (dishes.length <= count) {
        return [...dishes];
    }
    
    const shuffled = [...dishes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Get dish statistics
 * Demonstrates array reduce method for data analysis
 * @param {Array} dishes - Array of dish objects
 * @returns {Object} Statistics about dishes
 */
export function getDishStatistics(dishes) {
    if (!dishes.length) {
        return {
            total: 0,
            byCategory: {},
            bySpiceLevel: {},
            byDifficulty: {},
            averageCookingTime: 0
        };
    }
    
    const stats = dishes.reduce((acc, dish) => {
        // Count by category
        const category = dish.category || 'Unknown';
        acc.byCategory[category] = (acc.byCategory[category] || 0) + 1;
        
        // Count by spice level
        const spiceLevel = dish.spiceLevel || 'Unknown';
        acc.bySpiceLevel[spiceLevel] = (acc.bySpiceLevel[spiceLevel] || 0) + 1;
        
        // Count by difficulty
        const difficulty = dish.difficulty || 'Unknown';
        acc.byDifficulty[difficulty] = (acc.byDifficulty[difficulty] || 0) + 1;
        
        // Sum cooking times
        const cookingTime = parseInt(dish.cookingTime) || 0;
        acc.totalCookingTime += cookingTime;
        
        return acc;
    }, {
        byCategory: {},
        bySpiceLevel: {},
        byDifficulty: {},
        totalCookingTime: 0
    });
    
    return {
        total: dishes.length,
        byCategory: stats.byCategory,
        bySpiceLevel: stats.bySpiceLevel,
        byDifficulty: stats.byDifficulty,
        averageCookingTime: Math.round(stats.totalCookingTime / dishes.length)
    };
}

/**
 * Validate dish data structure
 * Demonstrates data validation
 * @param {Object} dish - Dish object to validate
 * @returns {boolean} Whether dish is valid
 */
export function validateDish(dish) {
    const requiredFields = ['id', 'name', 'type', 'description', 'ingredients'];
    
    return requiredFields.every(field => {
        if (field === 'ingredients') {
            return Array.isArray(dish[field]) && dish[field].length > 0;
        }
        return dish[field] && typeof dish[field] === 'string';
    });
}

/**
 * Get unique categories from dishes
 * Demonstrates Set for unique values and array manipulation
 * @param {Array} dishes - Array of dish objects
 * @returns {Array} Unique categories
 */
export function getUniqueCategories(dishes) {
    const categories = dishes.map(dish => dish.category).filter(Boolean);
    return [...new Set(categories)].sort();
}

/**
 * Get unique spice levels from dishes
 * Demonstrates Set for unique values
 * @param {Array} dishes - Array of dish objects
 * @returns {Array} Unique spice levels
 */
export function getUniqueSpiceLevels(dishes) {
    const spiceLevels = dishes.map(dish => dish.spiceLevel).filter(Boolean);
    return [...new Set(spiceLevels)].sort();
}