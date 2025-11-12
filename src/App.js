import React, { useState } from 'react';
import './App.css';
import WeatherChart from './weatherchart';

function App() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);
  const [currentCondition, setCurrentCondition] = useState(null);
  const [error, setError] = useState('');

  const apiKey = '30053e107c4a7dab37f4acdf8e4b4656';

  // Function to get weather emoji based on condition
  const getWeatherEmoji = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('drizzle')) return '🌦️';
    if (conditionLower.includes('thunderstorm')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    return '🌤️'; // default
  };

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    try {
      // Fetch current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!currentRes.ok) throw new Error('City not found.');
      const currentData = await currentRes.json();
      
      setCurrentTemp(currentData.main.temp);
      setCurrentCondition({
        main: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon
      });

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!forecastRes.ok) throw new Error('City not found.');
      const forecastData = await forecastRes.json();
      
      // Get daily data with weather conditions
      const dailyData = forecastData.list.filter(item =>
        item.dt_txt.includes('12:00:00')
      ).map(item => ({
        ...item,
        weatherCondition: item.weather[0].main,
        weatherDescription: item.weather[0].description,
        weatherIcon: item.weather[0].icon
      }));

      setForecast(dailyData);
      setError('');
    } catch (err) {
      setError(err.message);
      setForecast(null);
      setCurrentTemp(null);
      setCurrentCondition(null);
    }
  };

  return (
    <div className="App">
      <h1>5-Day Weather Forecast</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      {currentTemp !== null && currentCondition && (
        <div className="current-weather">
          <h2>Current Weather in {city}</h2>
          <div className="current-display">
            <span className="weather-emoji">
              {getWeatherEmoji(currentCondition.main)}
            </span>
            <div className="weather-info">
              <p className="temperature">{Math.round(currentTemp)}°C</p>
              <p className="condition">{currentCondition.main}</p>
              <p className="description">{currentCondition.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {forecast && (
        <div className="forecast-section">
          <h3>5-Day Forecast</h3>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p className="date">
                  {new Date(day.dt_txt).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <span className="weather-emoji">
                  {getWeatherEmoji(day.weatherCondition)}
                </span>
                <p className="temp">{Math.round(day.main.temp)}°C</p>
                <p className="condition">{day.weatherCondition}</p>
                <p className="description">{day.weatherDescription}</p>
              </div>
            ))}
          </div>
          <WeatherChart forecast={forecast} />
        </div>
      )}
    </div>
  );
}

export default App;
