"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CustomerGUI() {
  const [items, setItems] = useState([]);
  const [weather, setWeather] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let isActive = true;

    async function loadMenuItems() {
      try {
        const response = await fetch("/api/get_menu_items", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load menu items.");
        }

        if (isActive) {
          setItems(data);
          setErrorMessage("");
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage("Failed to load menu items.");
        }
      }
    }

    loadMenuItems();

    return () => {
      isActive = false;
    };
  }, []);

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


  function addToOrder(itemName, price) {
    setOrderItems((prevItems) => [...prevItems, { itemName, price }]);
  }

  function removeFromOrder(indexToRemove) {
    setOrderItems((prevItems) => prevItems.filter((item, index) => index !== indexToRemove));
  }

  async function placeOrder(){
    try{
      const response = await fetch("/api/place_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: orderItems }),
      });

      const data = await response.json();

      if (!response.ok){
        throw new Error(data.error || "Failed to place order.");
      }

    alert("Order placed!");

    setOrderItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
    
  }

  const [orderItems, setOrderItems] = useState([]);

  const total = orderItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

  useEffect(() => {
      document.documentElement.style.setProperty("--fontScale", scale);
    }, [scale]);

  return (
    <main className="customer-pos-page">
      <aside className="customer-sidebar">
        <button className="customer-category-button">All Items</button>
        <button className="customer-category-button">Milk Teas</button>
        <button className="customer-category-button">Fruit Teas</button>
        <button className="customer-category-button">Specials</button>
      </aside>

      {/* <div className="p-6"> */}
    {/* 1. Header with the very first item (Current Weather) */}

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
          {/* <li><a className="nav-bar-items" href="/">Home</a></li> */}
          <li><a className="nav-bar-items" href="/about">About</a></li>
          <li><a className="nav-bar-items" href="/customerGUI">Menu</a></li>
          <li><a className="nav-bar-items" href="/contact">Contact</a></li>
          <li><a className="nav-bar-items" href="/login">Login</a></li>
        </ul>
      </nav>

      <section className="customer-menu-section">
        <h1 className="customer-menu-title">Customer Menu</h1>

        {errorMessage ? (
          <p className="customer-order-placeholder">{errorMessage}</p>
        ) : null}

        {!errorMessage && items.length === 0 ? (
          <p className="customer-order-placeholder">Loading menu items...</p>
        ) : null}

        <div className="customer-item-grid">
          {items.map((item) => (
            <button key={item.item_name} className="customer-item-card" onClick={() => addToOrder(item.item_name, item.price)}>
              <span className="menu-item-name">{item.item_name}</span>
              <span className="menu-item-price">${Number(item.price).toFixed(2)}</span>
            </button>
          ))}
        </div>
      </section>

      <aside className="customer-order-panel">
        <h2 className="customer-order-title">Current Order</h2>

        <div className="customer-order-box">
          {orderItems.length === 0 ? (
            <p className="customer-order-placeholder">No items selected yet.</p>
          ) : (
            orderItems.map((item, index) => (
              <p key={index}> {item.itemName} - ${Number(item.price).toFixed(2)} <button onClick={() => removeFromOrder(index)} style={{marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1.2em', padding: '0', lineHeight: '1'}}>×</button></p>
            ))
          )}
        </div>

        <button className="customer-total-button" onClick={() => placeOrder(orderItems)}>Total: ${total}</button>
      </aside>
    </main>
  );
}
