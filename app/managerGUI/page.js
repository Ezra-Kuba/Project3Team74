"use client";

import { useEffect, useState } from "react";

const TABS = ["inventory", "menu", "employees", "reports"];

export default function ManagerGUI() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryError, setInventoryError] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [menuError, setMenuError] = useState("");

  useEffect(() => {
    if (activeTab !== "inventory") {
      return;
    }

    let isActive = true;

    async function loadInventory() {
      try {
        const response = await fetch("/api/get_inventory_items", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load inventory.");
        }

        if (isActive) {
          setInventoryItems(data);
          setInventoryError("");
        }
      } catch {
        if (isActive) {
          setInventoryError("Failed to load inventory.");
        }
      }
    }

    loadInventory();

    return () => {
      isActive = false;
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "menu") {
      return;
    }

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
          setMenuError("");
        }
      } catch {
        if (isActive) {
          setMenuError("Failed to load menu items.");
        }
      }
    }

    loadMenuItems();

    return () => {
      isActive = false;
    };
  }, [activeTab]);

  return (



    <main className="manager-page">
      <section className="manager-shell">
        <header className="manager-header">
          <div>
            <h1>Manager Portal</h1>
          </div>
        </header>

        <nav className="manager-tabs" aria-label="Manager sections">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`manager-tab ${activeTab === tab ? "manager-tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>





        <section className="manager-panel">


          
          {activeTab === "inventory" ? (
            <>
              <h2 className="manager-section-title">Inventory</h2>

              {inventoryError ? (
                <p className="customer-order-placeholder">{inventoryError}</p>
              ) : null}

              {!inventoryError && inventoryItems.length === 0 ? (
                <p className="customer-order-placeholder">Loading inventory...</p>
              ) : null}

              <div className="manager-list">
                {inventoryItems.map((item) => (
                  <article key={item.inventory_item} className="manager-list-card">
                    <span className="manager-list-name">{item.inventory_item}</span>
                    <span className="manager-list-value">Stock: {item.stock}</span>
                  </article>
                ))}
              </div>
            </>
          ) : null}




          {activeTab === "menu" ? (
            <>
              <h2 className="manager-section-title">Menu</h2>

              {menuError ? (
                <p className="customer-order-placeholder">{menuError}</p>
              ) : null}

              {!menuError && menuItems.length === 0 ? (
                <p className="customer-order-placeholder">Loading menu items...</p>
              ) : null}

              <div className="manager-list">
                {menuItems.map((item) => (
                  <article key={item.item_name} className="manager-list-card">
                    <span className="manager-list-name">{item.item_name}</span>
                    <span className="manager-list-value">
                      Price: ${Number(item.price).toFixed(2)}
                    </span>
                  </article>
                ))}
              </div>
            </>
          ) : null}



          {activeTab === "employees" ? (
            <>
              <h2 className="manager-section-title">Employees</h2>
              <p className="manager-section-copy">
                Employee tools will go here.
              </p>
            </>
          ) : null}




          {activeTab === "reports" ? (
            <>
              <h2 className="manager-section-title">Reports</h2>
              <p className="manager-section-copy">
                performance reports will appear here.
              </p>
            </>
          ) : null}
        </section>
      </section>
    </main>
  );
}
