"use client";

import { useEffect, useState } from "react";

const TABS = ["inventory", "menu", "employees", "reports"];

export default function ManagerGUI() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryError, setInventoryError] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [menuError, setMenuError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeError, setEmployeeError] = useState("");
  const [reportType, setReportType] = useState("total_sales_per_day");
  const [reportRows, setReportRows] = useState([]);
  const [reportError, setReportError] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

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

  useEffect(() => {
    if (activeTab !== "employees") {
      return;
    }

    let isActive = true;

    async function loadEmployees() {
      try {
        const response = await fetch("/api/get_employees", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load employees.");
        }

        if (isActive) {
          setEmployees(data);
          setEmployeeError("");
        }
      } catch {
        if (isActive) {
          setEmployeeError("Failed to retrieve employee information.");
        }
      }
    }

    loadEmployees();

    return () => {
      isActive = false;
    };
  }, [activeTab]);

  const [clickedEmployee, setClickedEmployee] = useState(null);

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
              {employeeError ? (
                <p className="customer-order-placeholder">{employeeError}</p>
              ) : null}

              {!employeeError && employees.length === 0 ? (
                <p className="customer-order-placeholder">Loading employee information...</p>
              ) : null}


              <div className="manager-list">
                {employees.map((item) => (
                  <article key={item.employee_name} 
                    onClick={() => setClickedEmployee(item.employee_id_num)}
                    className="manager-list-card">
                    <span className="manager-list-name">{item.employee_name}</span>
                    <span className="manager-list-value">Employee ID: {item.employee_id_num}</span>
                    {clickedEmployee === item.employee_id_num &&(
                      <div>
                      <div>Manager Status: {item.manager ? "Yes" : "No"}</div>
                      <div>Password: {item.employee_password}</div>
                    </div>
                    )}
                  </article>
                ))}
              </div>

            </>
          ) : null}

          {activeTab === "reports" ? (
            <>
              <h2 className="manager-section-title">Reports</h2>
              <p className="manager-section-copy">
                Select a report, supply any required date range, and generate the results below.
              </p>

              <div className="manager-report-controls">
                <div className="field">
                  <label htmlFor="report-type">Report</label>
                  <select
                    id="report-type"
                    value={reportType}
                    onChange={(event) => setReportType(event.target.value)}
                  >
                    {REPORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {getSelectedReport()?.needsRange ? (
                  <div className="manager-report-range-grid">
                    <div className="field">
                      <label htmlFor="report-start">Start Time</label>
                      <input
                        id="report-start"
                        type="datetime-local"
                        value={timeStart}
                        onChange={(event) => setTimeStart(event.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="report-end">End Time</label>
                      <input
                        id="report-end"
                        type="datetime-local"
                        value={timeEnd}
                        onChange={(event) => setTimeEnd(event.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  className="customer-total-button"
                  onClick={generateReport}
                >
                  Generate Report
                </button>
              </div>

              {reportError ? (
                <p className="customer-order-placeholder">{reportError}</p>
              ) : null}

              {reportLoading ? (
                <p className="customer-order-placeholder">Generating report...</p>
              ) : null}

              {!reportLoading && reportRows.length === 0 && !reportError ? (
                <p className="customer-order-placeholder">
                  {reportSubmitted
                    ? "No results found for this report."
                    : "Choose a report and click Generate Report."}
                </p>
              ) : null}

              {renderReportResults()}
            </>
          ) : null}
        </section>
      </section>
    </main>
  );
}
