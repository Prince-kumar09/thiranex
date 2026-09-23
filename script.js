const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const statusMessage = document.getElementById("statusMessage");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const cloudCover = document.getElementById("cloudCover");

const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const updatedTime = document.getElementById("updatedTime");


const weatherCodeDescriptions = {
    0: {
        description: "Clear sky",
        icon: "☀️"
    },

    1: {
        description: "Mainly clear",
        icon: "🌤️"
    },

    2: {
        description: "Partly cloudy",
        icon: "⛅"
    },

    3: {
        description: "Overcast",
        icon: "☁️"
    },

    45: {
        description: "Fog",
        icon: "🌫️"
    },

    48: {
        description: "Depositing rime fog",
        icon: "🌫️"
    },

    51: {
        description: "Light drizzle",
        icon: "🌦️"
    },

    53: {
        description: "Moderate drizzle",
        icon: "🌦️"
    },

    55: {
        description: "Dense drizzle",
        icon: "🌧️"
    },

    61: {
        description: "Slight rain",
        icon: "🌦️"
    },

    63: {
        description: "Moderate rain",
        icon: "🌧️"
    },

    65: {
        description: "Heavy rain",
        icon: "🌧️"
    },

    71: {
        description: "Slight snow",
        icon: "🌨️"
    },

    73: {
        description: "Moderate snow",
        icon: "🌨️"
    },

    75: {
        description: "Heavy snow",
        icon: "❄️"
    },

    80: {
        description: "Slight rain showers",
        icon: "🌦️"
    },

    81: {
        description: "Moderate rain showers",
        icon: "🌧️"
    },

    82: {
        description: "Violent rain showers",
        icon: "⛈️"
    },

    95: {
        description: "Thunderstorm",
        icon: "⛈️"
    },

    96: {
        description: "Thunderstorm with slight hail",
        icon: "⛈️"
    },

    99: {
        description: "Thunderstorm with heavy hail",
        icon: "⛈️"
    }
};


async function getCoordinates(city) {

    const geocodingURL =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(geocodingURL);

    if (!response.ok) {
        throw new Error("Unable to search for the city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please enter a valid city name.");
    }

    return data.results[0];
}


async function getWeather(latitude, longitude) {

    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m&timezone=auto`;

    const response = await fetch(weatherURL);

    if (!response.ok) {
        throw new Error("Unable to fetch weather data.");
    }

    const data = await response.json();

    return data;
}


function updateWeatherUI(location, weatherData) {

    const current = weatherData.current;

    cityName.textContent = location.name;

    countryName.textContent =
        `${location.admin1 ? location.admin1 + ", " : ""}${location.country}`;

    temperature.textContent =
        Math.round(current.temperature_2m);

    humidity.textContent =
        current.relative_humidity_2m;

    windSpeed.textContent =
        Math.round(current.wind_speed_10m);

    feelsLike.textContent =
        Math.round(current.apparent_temperature);

    cloudCover.textContent =
        current.cloud_cover;

    const weatherInfo =
        weatherCodeDescriptions[current.weather_code];

    if (weatherInfo) {

        weatherDescription.textContent =
            weatherInfo.description;

        weatherIcon.textContent =
            weatherInfo.icon;

    } else {

        weatherDescription.textContent =
            "Weather information";

        weatherIcon.textContent =
            "🌤️";
    }

    updatedTime.textContent =
        current.time.replace("T", " ");

    weatherCard.classList.remove("hidden");
}


async function searchWeather(city) {

    try {

        statusMessage.textContent =
            "Searching for weather data...";

        searchButton.disabled = true;

        weatherCard.classList.add("hidden");

        const location =
            await getCoordinates(city);

        const weatherData =
            await getWeather(
                location.latitude,
                location.longitude
            );

        updateWeatherUI(
            location,
            weatherData
        );

        statusMessage.textContent =
            "Weather data loaded successfully.";

    } catch (error) {

        statusMessage.textContent =
            error.message;

    } finally {

        searchButton.disabled = false;
    }
}


searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const city =
        cityInput.value.trim();

    if (city === "") {

        statusMessage.textContent =
            "Please enter a city name.";

        return;
    }

    searchWeather(city);
});


searchWeather("Gorakhpur");