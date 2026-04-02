"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContactPage() {
    const [weather, setWeather] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

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
        <ul class="nav-links">
          <li><a className="nav-bar-items" href="/about">About</a></li>
          <li><a className="nav-bar-items" href="/menu">Menu</a></li>
          <li><a className="nav-bar-items" href="/contact">Contact</a></li>
          <li><a className="nav-bar-items" href="/login">Login</a></li>
        </ul>
    </nav>
    <section className="image and paragraph">
        <h1>Contact info</h1>
        <img src="/image.png" alt="Our founders in their natrual habitat"></img>
        <ul class ="contact bar">
            <li><a href="jvashen@tamu.edu">Jesse Ashen</a></li>
            <li><a href="jorgeoliver909@tamu.edu">Jorge Lebron Oliver</a></li>
            <li><a href="rodroman@tamu.edu">Roman Rodriguez</a></li>
            <li><a href="rohakb@tamu.edu">Rohak Brahma</a></li>
            <li><a href="ezra_k234@tamu.edu">Ezra Kuba</a></li>
        </ul>
    </section>
    </main>
  );
}