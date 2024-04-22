// WeatherPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import WeatherSkeleton from "../skeleton/skeleton";
import { WiDaySunny, WiRain, WiCloudy, WiShowers } from 'react-icons/wi';

import sunnyBackground from "../assets/sunny.jpg";
import rainyBackground from "../assets/rain.jpg";
import cloudyBackground from "../assets/cloud.jpg";
import drizzleBackground from "../assets/drizzle.jpg";
import clear from "../assets/clear.jpg";

// Define interfaces for weather data and API response
interface Weather {
  id: number;
  main: string;
  description: string;
}

interface MainWeatherData {
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
}

interface WeatherAPIResponse {
  weather: Weather[];
  main: MainWeatherData;
  wind: {
    speed: number;
  };
}

const apikey: string = process.env.REACT_APP_API_KEY ?? "" ;


export const WeatherPage = () => {
  const [weatherdata, setWeatherData] = useState<WeatherAPIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { cityName } = useParams<{ cityName: string }>();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get<WeatherAPIResponse>(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}`
        );
        setWeatherData(response.data);
      } catch (error) {
        setError("Failed to fetch weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [cityName]);

  const selectBackground = (): string => {
    if (weatherdata && weatherdata.weather && weatherdata.weather.length > 0) {
      switch (weatherdata.weather[0].main) {
        case 'Clear':
          return sunnyBackground;
        case 'Rain':
          return rainyBackground;
        case 'Clouds':
          return cloudyBackground;
        case 'Drizzle':
          return drizzleBackground;
        default:
          return clear;
      }
    } else {
      return clear;
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${selectBackground()})` }}>
        {loading && <WeatherSkeleton />}
        {weatherdata && !error && !loading && (
          <div className="flex flex-col bg-white rounded p-4 w-full max-w-xs shadow-2xl border-2 hover:bg-sky-100">
            <div className="font-bold text-xl">{cityName}</div>
            <div className="text-sm text-gray-500">{new Date().toDateString()}</div>
            <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
              {weatherdata.weather[0].main === 'Clear' && <WiDaySunny />}
              {weatherdata.weather[0].main === 'Rain' && <WiRain />}
              {weatherdata.weather[0].main === 'Clouds' && <WiCloudy />}
              {weatherdata.weather[0].main === 'Drizzle' && <WiShowers />}
            </div>
            <div className="flex flex-row items-center justify-center mt-6">
              {weatherdata && !error && (
                <>
                  <div className="font-medium text-6xl">{(weatherdata.main.temp - 273.15).toFixed(1)}°c</div>
                  <div className="flex flex-col items-center ml-6">
                    <div>{weatherdata.weather[0].main}</div>
                    <div className="mt-1">
                      <span className="text-sm"><i className="far fa-long-arrow-up" /></span>
                      <span className="text-sm font-light text-gray-500">Max - {(weatherdata.main.temp_max - 273.15).toFixed(1)}°c </span>
                    </div>
                    <div>
                      <span className="text-sm"><i className="far fa-long-arrow-down" /></span>
                      <span className="text-sm font-light text-gray-500">Min - {(weatherdata.main.temp_min - 273.15).toFixed(1)}°c  </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-row justify-between mt-6">
              {weatherdata && !error && (
                <>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Wind</div>
                    <div className="text-sm text-gray-500">{weatherdata.wind.speed} km/h</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Humidity</div>
                    <div className="text-sm text-gray-500">{weatherdata.main?.humidity} %</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Pressure</div>
                    <div className="text-sm text-gray-500">{weatherdata.main?.pressure} hPa</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {error && !loading && <div>{error}</div>}
      </div>
    </div>
  );
};
