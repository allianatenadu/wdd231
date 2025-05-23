// home.js - JavaScript for Chamber of Commerce Home Page

// OpenWeatherMap API configuration
const API_KEY = 'a505e1db6e9a52719b9127e25414fa73'; // You'll need to get this from openweathermap.org
const CITY = 'Accra'; 
const COUNTRY_CODE = 'GH'; // Ghana country code
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}&units=metric`;
const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}&units=metric`;

// Weather Functions
async function fetchWeatherData() {
  try {
    console.log('Fetching weather data...');
    
    // For demo purposes, we'll use mock data if API key is not set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
      displayMockWeather();
      return;
    }
    
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(WEATHER_API_URL),
      fetch(FORECAST_API_URL)
    ]);
    
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather API request failed');
    }
    
    const currentWeather = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    
    displayWeather(currentWeather, forecastData);
    
  } catch (error) {
    console.error('Error fetching weather:', error);
    displayWeatherError();
  }
}

function displayWeather(current, forecast) {
  const weatherContainer = document.getElementById('weather-container');
  const forecastContainer = document.getElementById('forecast-container');
  
  console.log('Weather container found:', !!weatherContainer);
  console.log('Forecast container found:', !!forecastContainer);
  
  // Get forecast for next 3 days (skip today, take next 3)
  const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0).slice(1, 4);
  
  // Get sunrise and sunset times
  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  // Convert temperature to Fahrenheit for display
  const tempF = Math.round((current.main.temp * 9/5) + 32);
  const highF = Math.round((current.main.temp_max * 9/5) + 32);
  const lowF = Math.round((current.main.temp_min * 9/5) + 32);
  
  // Display current weather
  if (weatherContainer) {
    weatherContainer.innerHTML = `
      <div class="weather-info">
        <div class="weather-icon">
          ${getWeatherIcon(current.weather[0].main)}
        </div>
        <div class="weather-details">
          <div class="temperature">${tempF}°F</div>
          <p class="weather-description"><strong>${current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1)}</strong></p>
          <p><strong>High:</strong> ${highF}°</p>
          <p><strong>Low:</strong> ${lowF}°</p>
          <p><strong>Humidity:</strong> ${current.main.humidity}%</p>
          <p><strong>Sunrise:</strong> ${sunrise}</p>
          <p><strong>Sunset:</strong> ${sunset}</p>
        </div>
      </div>
    `;
  }
  
  // Display forecast in separate container
  if (forecastContainer) {
    forecastContainer.innerHTML = `
      <div class="forecast-summary">
        <div class="forecast-today">
          <div><strong>Today: ${tempF}°F</strong></div>
        </div>
        ${dailyForecasts.map((day, index) => {
          const dayTempF = Math.round((day.main.temp * 9/5) + 32);
          const dayName = index === 0 ? 'Tomorrow' : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
          return `
            <div class="forecast-summary-day">
              <div><strong>${dayName}: ${dayTempF}°F</strong></div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    console.log('Live forecast data populated successfully');
  } else {
    console.error('Forecast container not found!');
  }
}

function displayMockWeather() {
  const weatherContainer = document.getElementById('weather-container');
  const forecastContainer = document.getElementById('forecast-container');
  
  console.log('Weather container found:', !!weatherContainer);
  console.log('Forecast container found:', !!forecastContainer);
  
  // Current weather display
  if (weatherContainer) {
    weatherContainer.innerHTML = `
      <div class="weather-info">
        <div class="weather-icon">⛅</div>
        <div class="weather-details">
          <div class="temperature">75°F</div>
          <p class="weather-description"><strong>Partly Cloudy</strong></p>
          <p><strong>High:</strong> 85°</p>
          <p><strong>Low:</strong> 52°</p>
          <p><strong>Humidity:</strong> 34%</p>
          <p><strong>Sunrise:</strong> 7:30am</p>
          <p><strong>Sunset:</strong> 9:59pm</p>
        </div>
      </div>
    `;
  }
  
  // Forecast display
  if (forecastContainer) {
    forecastContainer.innerHTML = `
      <div class="forecast-summary">
        <div class="forecast-today">
          <div><strong>Today: 90°F</strong></div>
        </div>
        <div class="forecast-summary-day">
          <div><strong>Wednesday: 89°F</strong></div>
        </div>
        <div class="forecast-summary-day">
          <div><strong>Thursday: 68°F</strong></div>
        </div>
      </div>
      <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #666;">
        <em>Demo weather data - Add your OpenWeatherMap API key for live data</em>
      </p>
    `;
    console.log('Forecast container populated successfully');
  } else {
    console.error('Forecast container not found!');
  }
}

function displayWeatherError() {
  const weatherContainer = document.getElementById('weather-container');
  const forecastContainer = document.getElementById('forecast-container');
  
  if (weatherContainer) {
    weatherContainer.innerHTML = `
      <div class="error">
        Unable to load weather data. Please check your API configuration.
      </div>
    `;
  }
  
  if (forecastContainer) {
    forecastContainer.innerHTML = `
      <div class="error">
        Unable to load forecast data.
      </div>
    `;
  }
}

function getWeatherIcon(weatherMain) {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return icons[weatherMain] || '🌤️';
}

// Member Spotlight Functions
async function fetchAndDisplaySpotlights() {
  try {
    console.log('Fetching member spotlights...');
    
    // Try multiple paths to find the JSON file
    const possiblePaths = [
      "data/members.json",
      "members.json",
      "../members.json",
      "./data/members.json",
      "./members.json"
    ];
    
    let response;
    let fetchSuccessful = false;
    
    for (const path of possiblePaths) {
      try {
        console.log(`Trying to fetch from: ${path}`);
        response = await fetch(path);
        
        if (response.ok) {
          console.log(`Successfully loaded from: ${path}`);
          fetchSuccessful = true;
          break;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${path}: ${err.message}`);
      }
    }
    
    if (!fetchSuccessful) {
      throw new Error("Could not find members.json file");
    }
    
    const members = await response.json();
    displayRandomSpotlights(members);
    
  } catch (error) {
    console.error('Error fetching member data:', error);
    displaySpotlightError();
  }
}

function displayRandomSpotlights(members) {
  // Filter for gold (3) and silver (2) members only
  const eligibleMembers = members.filter(member => member.membership >= 2);
  
  if (eligibleMembers.length === 0) {
    displaySpotlightError("No eligible members found for spotlight");
    return;
  }
  
  // Randomly select 2-3 members
  const numSpotlights = Math.min(3, eligibleMembers.length);
  const selectedMembers = getRandomMembers(eligibleMembers, numSpotlights);
  
  const spotlightsContainer = document.getElementById('spotlights-container');
  
  spotlightsContainer.innerHTML = `
    <div class="spotlight-grid">
      ${selectedMembers.map(member => `
        <div class="spotlight-card">
          <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy"
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' viewBox=\\'0 0 200 150\\'%3E%3Crect width=\\'200\\' height=\\'150\\' fill=\\'%23cccccc\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%23333333\\'%3E${member.name}%3C/text%3E%3C/svg%3E';">
          <div class="spotlight-content">
            <div class="membership-badge">${getMembershipLevel(member.membership)}</div>
            <h4>${member.name}</h4>
            <p><strong>📍</strong> ${member.address}</p>
            <p><strong>📞</strong> ${member.phone}</p>
            <p><a href="${member.website}" target="_blank" rel="noopener">🌐 Visit Website</a></p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  console.log(`Displayed ${selectedMembers.length} member spotlights`);
}

function getRandomMembers(members, count) {
  const shuffled = [...members].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getMembershipLevel(level) {
  switch (level) {
    case 3:
      return "Gold Member";
    case 2:
      return "Silver Member";
    case 1:
      return "Bronze Member";
    default:
      return "Member";
  }
}

function displaySpotlightError(message = "Unable to load member spotlights") {
  const spotlightsContainer = document.getElementById('spotlights-container');
  spotlightsContainer.innerHTML = `
    <div class="error">${message}</div>
  `;
}

// Home page specific navigation highlighting
function setActiveNavigation() {
  document.querySelectorAll("#nav-links a").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "index.html" || link.getAttribute("href") === "./") {
      link.classList.add("active");
    }
  });
}

// Initialize home page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded, initializing...");
  
  // Debug: Check if all required elements exist
  const weatherContainer = document.getElementById('weather-container');
  const forecastContainer = document.getElementById('forecast-container');
  const spotlightsContainer = document.getElementById('spotlights-container');
  
  console.log('Elements found:', {
    weather: !!weatherContainer,
    forecast: !!forecastContainer,
    spotlights: !!spotlightsContainer
  });
  
  // Set active navigation
  setActiveNavigation();
  
  // Initialize containers with loading states
  if (weatherContainer) {
    weatherContainer.innerHTML = '<div class="loading">Loading weather data...</div>';
  }
  
  if (forecastContainer) {
    forecastContainer.innerHTML = '<div class="loading">Loading forecast data...</div>';
  }
  
  // Load weather data
  fetchWeatherData();
  
  // Load member spotlights with a small delay to avoid conflicts
  setTimeout(fetchAndDisplaySpotlights, 200);
  
  // Set year and last modified date
  const yearElement = document.getElementById("year");
  const lastModifiedElement = document.getElementById("lastModified");
  
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  if (lastModifiedElement) {
    lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
  }
});