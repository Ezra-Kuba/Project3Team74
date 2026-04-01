import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from "openmeteo";

export async function GET() {
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: 30.628,
    longitude: -96.3344,
    daily: "uv_index_max",
    hourly: ["temperature_2m", "precipitation_probability"],
    timezone: "auto",
    wind_speed_unit: "mph",
    temperature_unit: "fahrenheit",
    precipitation_unit: "inch",
  };

  try {
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // 1. Calculate which index represents the current hour
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const startOfArray = Number(hourly.time());
    const currentHourIndex = Math.floor((nowInSeconds - startOfArray) / hourly.interval());

    // 2. Build the array starting from 'currentHourIndex' instead of 0
    const weatherArray = Array.from(
      { length: 24 }, // Still grab 24 hours of data
      (_, i) => {
        const actualIndex = currentHourIndex + i; // Shift the index forward
        
        return {
          time: new Date((Number(hourly.time()) + actualIndex * hourly.interval() + utcOffsetSeconds) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(hourly.variables(0).valuesArray()[actualIndex]),
          rainChance: hourly.variables(1).valuesArray()[actualIndex],
        };
      }
    );

    return NextResponse.json(weatherArray);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}