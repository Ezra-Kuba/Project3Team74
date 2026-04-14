"use client";

import HomeChatbot from "./components/HomeChatbot";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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

    // export default function Component(){
    //   const [scale, setScale] = useState(1);

    //   useEffect(() => {
    //     document.documentElement.style.setProperty("--fontScale", scale);
    //   }, [scale]);

    //   return(
    //     <div className="slidecontainer">
    //       <label htmlFor ="slider">Font Size:</label>
    //       <input type="range" min="0.5" max="2" step = "0.1" value={scale} onChange={(e) => setScale(e.target.value)}/>
    //     </div>
    //   );

    useEffect(() => {
      document.documentElement.style.setProperty("--fontScale", scale);
    }, [scale]);


    // useEffect(() => {
    //   const slider = document.getElementById("slider");
    //   const root = document.documentElement;

    //   slider.addEventListener("input", (e) => {
    //     root.style.setProperty("--fontScale", e.target.value);
    //   });
    // }, []);

  return (
    <main className="menu-page">
      {/* <header className="menu-header">
        <Link className="employee-login" href="/login">Login</Link>
      </header> */}

      <nav className="navbar">
        <Link className="logo" href="/">Supa Yummi Boba</Link>
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

        <ul className="nav-links">
          <li><a className="nav-bar-items" href="/">Home</a></li>
          <li><a className="nav-bar-items" href="/about">About</a></li>
          <li><a className="nav-bar-items" href="/customerGUI">Menu</a></li>
          <li><a className="nav-bar-items" href="#contact">Contact</a></li>
          <li><a className="nav-bar-items" href="/login">Login</a></li>
        </ul>
      </nav>

      <section className="menu-hero" aria-labelledby="menu-title">
        <p className="menu-label"></p>
        <h1 id="menu-title">Authentic PseudoAsian Boba!<br></br>You likes yes!</h1>
      </section>

      <section className="menu-img">
        <img className="menu-img" src="/image.png"></img>  
        <img className="menu-img" src="/jesse.png"></img> 
        <img className="menu-img" src="/image.png"></img>
      </section> 

      <section className = "landingPageBottomSection">
        <h4 className = "landingPageBottomHeader">
          Here at Supa Yummi Boba we value our customers needs!
        </h4>
        <p>The buttons below will enable accessibility features:</p>
        <button >
          Toggle High Contrast
        </button>
      </section>

      <HomeChatbot />
    </main>
  );
}
