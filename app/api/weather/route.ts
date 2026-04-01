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

    // Process the binary data into a clean JSON object
    const weatherArray = Array.from(
      { length: 24 }, // Just grab the next 24 hours to keep it light
      (_, i) => ({
        time: new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(hourly.variables(0)!.valuesArray()[i]),
        rainChance: hourly.variables(1)!.valuesArray()[i],
      })
    );

    // Return the array to your React frontend
    return NextResponse.json(weatherArray);
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}