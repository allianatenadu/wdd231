 // Select HTML elements in the document
        const currentTemp = document.querySelector('#current-temp');
        const weatherIcon = document.querySelector('#weather-icon');
        const captionDesc = document.querySelector('figcaption');

        // Coordinates for Trier, Germany (rounded to 2 decimal places as requested)
        const lat = 5.60931;

        const lon = -0.18076;
        
        // IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
        const apiKey = 'a505e1db6e9a52719b9127e25414fa73'; // You need to get this from openweathermap.org
        
        // Construct the API URL
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        // Asynchronous function to fetch weather data
        async function apiFetch() {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // testing only
                    displayResults(data);
                } else {
                    throw Error(await response.text());
                }
            } catch (error) {
                console.log(error);
                displayError(error.message);
            }
        }

        // Function to display the weather results
        function displayResults(data) {
            // Fill in the blanks from the tutorial:
            currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;
            const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            let desc = data.weather[0].description;
            
            weatherIcon.setAttribute('src', iconsrc);
            weatherIcon.setAttribute('alt', desc);
            weatherIcon.style.display = 'block';
            captionDesc.textContent = `${desc}`;
        }

        // Function to display errors
        function displayError(message) {
            currentTemp.innerHTML = '<span class="error">Error loading weather data</span>';
            captionDesc.innerHTML = `<div class="error">Error: ${message}<br><br>Please make sure to:<br>1. Get an API key from <a href="https://openweathermap.org/api" target="_blank">OpenWeatherMap.org</a><br>2. Replace 'YOUR_API_KEY' in the code with your actual API key</div>`;
        }

        // For demonstration purposes, let's simulate the API call with sample data
        // since we don't have a real API key
        function simulateWeatherData() {
            const sampleData = {
                main: {
                    temp: 72.5,
                    feels_like: 75.2,
                    humidity: 65
                },
                weather: [
                    {
                        main: "Clouds",
                        description: "partly cloudy",
                        icon: "02d"
                    }
                ],
                name: "Trier"
            };
            
            setTimeout(() => {
                displayResults(sampleData);
            }, 1000);
        }

        // Check if we have a real API key, otherwise use sample data
        if (apiKey === 'YOUR_API_KEY') {
            console.log('Using sample data since no API key is provided');
            simulateWeatherData();
        } else {
            // Call the API fetch function
            apiFetch();
        }