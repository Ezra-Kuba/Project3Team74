"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutPage() {

    const [weather, setWeather] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [scale, setScale] = useState(1);

    useEffect(() => {
      let isActive = true;
      async function loadWeather() {
        try {
          const response = await fetch("/api/weather", { cache: "no-store" });
          const data = await response.json();
          if (isActive && response.ok) setWeather(data);
        } catch (err) {
          if (isActive) console.error("Weather failed to load.");
        }
      }
      loadWeather();
      return () => { isActive = false; };
    }, []);

    useEffect(() => {
      document.documentElement.style.setProperty("--fontScale", scale);
    }, [scale]);

  return (
    <main className="about-page">
    <nav class="navbar">
        <div class="logo">Supa Yummi Boba</div>
        <div className="weather">
        {weather.length > 0 && (
          <>
          {/* <h2>Temperature: {weather[0].temp}°F</h2> */}
          <p>Chance of Rain: {weather[0].rainChance}%, 
            Current Temperature:{weather[0].temp}°F
          </p>
          </>
        )}
        </div>
        <div className="slidecontainer">
          <label htmlFor ="slider">Font Size:</label>
          <input type="range" min="0.5" max="2" step="0.1" value={scale} onChange={(e) => setScale(e.target.value)} id="slider"/>
        </div>
        <ul class="nav-links">
          <li><a className="nav-bar-items" href="/about">About</a></li>
          <li><a className="nav-bar-items" href="/menu">Menu</a></li>
          <li><a className="nav-bar-items" href="/contact">Contact</a></li>
          <li><a className="nav-bar-items" href="/login">Login</a></li>
        </ul>
    </nav>
    <section className="about-body">
        <h1>About us</h1>
        <img src="/jesse.png"></img>
        <img src="chineseJesse.png"></img>
        <p>The story of Supa Yummi Boba is one of great trials and tribulations.
          Before getting into the Boba Tea business, our founder Jesse Ashen was a 
          sad lonely man. He only lived for food one could only describe as "goyslop"
          and Roblox. One day, however, an ancient Chinese Water Lemur came to him in a dream.
          He told him "my friend, this is not your path. I will make you into who you really are
          , then you will find your destiny." When Jesse awoke, he was now a changed man, fully
          embracing his Chinese roots. From then on, he knew his calling was Boba Tea, and the rest is
          history.
        </p>
    </section>
    </main>
  );
}
