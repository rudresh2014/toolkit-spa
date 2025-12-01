import { useState, useEffect } from "react";

type WeatherData = {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    name: string;
};

type UseWeatherReturn = {
    data: WeatherData | null;
    loading: boolean;
    error: Error | null;
};

export function useWeather(): UseWeatherReturn {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const apiKey = import.meta.env.VITE_WEATHER_API;

                if (!apiKey) {
                    console.error("Weather API key not found in environment variables");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=Bangalore&units=metric&appid=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch weather data");
                }

                const weatherData = await response.json();
                setData(weatherData);
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    return { data, loading, error };
}
