"use client";

// export const metadata = {
//   title: "Menu Page",
// };

import { useState, useEffect } from "react";

export default function MenuGUI() {
  const [menuItems, setMenuItems] = useState([]);

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
          setMenuItems(data);
        }
      } catch (error) {
        console.error("Error loading menu items:", error);
      }
    }

    loadMenuItems();

    return () => {
      isActive = false;
    };
  }, []);


  return (
    <main className="menu-page">
      <nav class="navbar">
        <div class="logo">Supa Yummi Boba</div>
        <ul className="nav-links">
          {/* <li><a className="nav-bar-items" href="/">Home</a></li> */}
          <li><a className="nav-bar-items" href="#about">About</a></li>
          <li><a className="nav-bar-items" href="/menu">Menu</a></li>
          <li><a className="nav-bar-items" href="#contact">Contact</a></li>
          <li><a className="nav-bar-items" href="/login">Login</a></li>
        </ul>
      </nav>
      
      <section className="menu-title" aria-labelledby="menu-title">
        <h1 id="menu-title">Menu Page</h1>
        <p className="menu-copy">This page is not done, but this is where we will begin implementing a menu page. <br></br>That way we can just link it to other pages when the login ect. features are done.</p>
      </section>

      <section className="menu-mainScreen">
        <h2 className="menu-list-title">Menu List</h2>
        
        <ul className="menu-items">
          {menuItems.map((item) => (
            <li key={item.item_name} className="menu-item">
              <span className="menu-item-name">{item.item_name}</span>
              <span className="menu-item-price">${Number(item.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
