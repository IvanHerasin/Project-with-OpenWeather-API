// Знаходимо елементи інтерфейсу
const cityInput = document.querySelector(".city-input"); // Пошук за класом, як у твоєму HTML
const searchBtn = document.getElementById("searchBtn");
const loadingState = document.getElementById('loadingState');
const errorMessage = document.getElementById('errorMessage');
const weatherDisplay = document.getElementById('weatherDisplay');

// Елементи для виводу даних
const cityName = document.getElementById('cityName');
const tempValue = document.getElementById('tempValue');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const windSpeed = document.getElementById('windSpeed');
const windDirection = document.getElementById('windDirection');
const weatherAdvice = document.getElementById('weatherAdvice');

const API_KEY = "7523412e84e7f0c5d639104c86ad6ee4";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


async function fetchWeatherData(city) {
    showLoading(true);
    hideError();
    weatherDisplay.classList.add('hidden');

    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=uk`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Місто не знайдено. Спробуйте ще раз.');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}


function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    tempValue.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    windDirection.textContent = `${data.wind.deg}°`;


    updateWeatherAdvice(data.main.temp);
    

    updateBackground(data.main.temp);

    weatherDisplay.classList.remove('hidden');
}

function updateWeatherAdvice(temp) {
    if (temp <= 0) {
        weatherAdvice.textContent = "Сьогодні морозно! Одягайтеся дуже тепло ❄️";
    } else if (temp > 0 && temp <= 15) {
        weatherAdvice.textContent = "Прохолодно. Не забудьте куртку 🧥";
    } else if (temp > 15 && temp <= 25) {
        weatherAdvice.textContent = "Чудова погода для прогулянки! 🌤️";
    } else {
        weatherAdvice.textContent = "Спекотно! Пийте більше води ☀️";
    }
}


function updateBackground(temp) {
    document.body.classList.remove('cold-bg', 'neutral-bg', 'warm-bg');
    if (temp <= 5) {
        document.body.classList.add('cold-bg');
    } else if (temp > 5 && temp <= 22) {
        document.body.classList.add('neutral-bg');
    } else {
        document.body.classList.add('warm-bg');
    }
}


function showLoading(isLoading) {
    loadingState.classList.toggle('hidden', !isLoading);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}


searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});


cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeatherData(city);
    }
});