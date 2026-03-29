"use client";

import { useEffect, useState } from "react";

export default function CustomerGUI() {
  const [items, setItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <main className="customer-pos-page">
      <aside className="customer-sidebar">
        <button className="customer-category-button">All Items</button>
        <button className="customer-category-button">Milk Teas</button>
        <button className="customer-category-button">Fruit Teas</button>
        <button className="customer-category-button">Specials</button>
      </aside>

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
            <button key={item.item_name} className="customer-item-card">
              <span className="menu-item-name">{item.item_name}</span>
              <span className="menu-item-price">${Number(item.price).toFixed(2)}</span>
            </button>
          ))}
        </div>
      </section>

      <aside className="customer-order-panel">
        <h2 className="customer-order-title">Current Order</h2>

        <div className="customer-order-box">
          <p className="customer-order-placeholder">No items selected yet.</p>
        </div>

        <button className="customer-total-button">Total: $0.00</button>
      </aside>
    </main>
  );
}
