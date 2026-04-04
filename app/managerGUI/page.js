"use client";

import { useEffect, useState } from "react";
import { useCallback } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

  const loadMenuItems = useCallback(async (isActive = true) => {
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
  }, []);

  useEffect(() => {
    if (activeTab !== "menu") return;

    let isActive = true;
    loadMenuItems(isActive);

    return () => {
      isActive = false;
    };
  }, [activeTab, loadMenuItems]);

  const loadEmployees = useCallback(async (isActive = true) => {
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
  }, []);

  useEffect(() => {
  if (activeTab !== "employees") return;

  let isActive = true;
  loadEmployees(isActive);

  return () => {
    isActive = false;
  };
}, [activeTab, loadEmployees]);


  const REPORT_OPTIONS = [
    { label: "Daily Sales", value: "total_sales_per_day", needsRange: false },
    { label: "Daily Sales by Time", value: "sales_report_by_time", needsRange: true },
    { label: "Least Popular Item", value: "least_ordered_item", needsRange: false },
    { label: "Most Popular Item", value: "top_selling", needsRange: false },
    { label: "X Report", value: "x_report", needsRange: false },
    { label: "Z Report", value: "total_orders_and_sales_today", needsRange: false },
    { label: "Inventory Chart", value: "product_usage", needsRange: true },
  ];

  const formatReportLabel = (label) =>
    label
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const formatReportValue = (key, value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value === "number") {
      const formatted = value.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });

      return key.includes("sales") || key.includes("value")
        ? `$${formatted}`
        : formatted;
    }

    return String(value);
  };

  const getSelectedReport = () =>
    REPORT_OPTIONS.find((option) => option.value === reportType);

  const generateReport = async () => {
    setReportError("");
    setReportRows([]);
    setReportSubmitted(true);

    const selectedReport = getSelectedReport();

    if (!selectedReport) {
      setReportError("Please choose a valid report.");
      return;
    }

    if (selectedReport.needsRange) {
      if (!timeStart || !timeEnd) {
        setReportError("Please provide both start and end timestamps.");
        return;
      }

      if (timeStart > timeEnd) {
        setReportError("Start time must be before end time.");
        return;
      }
    }

    if (reportType === "total_orders_and_sales_today") {
      const confirmed = window.confirm(
        "Run Z Report? This will return today's totals."
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setReportLoading(true);

      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          timeStart,
          timeEnd,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate report.");
      }

      setReportRows(data.rows || []);
    } catch (error) {
      setReportError(
        error instanceof Error ? error.message : "Failed to generate report."
      );
    } finally {
      setReportLoading(false);
    }
  };

  const renderReportResults = () => {
    if (!reportRows || reportRows.length === 0) {
      return null;
    }

    const rowKeys = Object.keys(reportRows[0] || {});

    if (reportRows.length === 1 && rowKeys.length <= 4) {
      return (
        <article className="manager-list-card">
          {rowKeys.map((key) => (
            <div key={key}>
              <span className="manager-list-name">{formatReportLabel(key)}</span>
              <span className="manager-list-value">
                {formatReportValue(key, reportRows[0][key])}
              </span>
            </div>
          ))}
        </article>
      );
    }

    return (
      <div className="manager-report-table-wrapper">
        <table className="manager-report-table">
          <thead>
            <tr>
              {rowKeys.map((key) => (
                <th key={key}>{formatReportLabel(key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {rowKeys.map((key) => (
                  <td key={key}>{formatReportValue(key, row[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const [clickedItem, setClickedItem] = useState(null);
  // Universal modal handlers
  const [openModal, setOpenModal] = useState(null);
  const handleClose = () => setOpenModal(null);
  const selectedEmployee = employees.find(e => e.employee_id_num === clickedItem);
  const [editableTemp, setEditableTemp] = useState(null);
  // Comparison test for objects, if any values do not match then true is returned
  const hasChanges = (a, b) => Object.keys(a).some(key => b[key] !== a[key]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  async function updateEmployee(employee) {
    try {
      const response = await fetch("/api/edit_employee", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(employee), // send editableEmployee
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update employee information.");
      }

      // Refresh employee list after the save is made
      await loadEmployees();
    }

    // Show popup if an error occurs
    catch(error){
      alert(error.message);
    }
  }

  async function fireEmployee(employee){
    try {
      const response = await fetch("/api/remove_employee", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(employee), // send unfortunate employee
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fire employee.");
      }

      // Refresh employee list after the save is made
      await loadEmployees();
    }

    // Show popup if an error occurs
    catch(error){
      alert(error.message);
    }
  }

  async function hireEmployee(employee) {
    try {
      const response = await fetch("/api/add_employee", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(employee),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to hire employee.");
      }

      // Refresh employee list after the save is made
      await loadEmployees();
    }

    // Show popup if an error occurs
    catch(error){
      alert(error.message);
    }
  }

  // New employee template
  const emptyEmployee = {
    employee_name: "",
    manager: 0,
    employee_password: ""
  };

  // New menu item template
  const emptyMenu = {
    item_name: "",
    price: 0
  };

  const selectedMenuItem = menuItems.find(e => e.item_name === clickedItem);

  async function updateMenuItem(item) {
    try {
      const response = await fetch("/api/edit_menu_item", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          ogName: selectedMenuItem.item_name,
          ...item
        }), // Send new item params and old item name 
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update menu item.");
      }

      // Refresh menu item list after the save is made
      await loadMenuItems();
    }

    // Show popup if an error occurs
    catch(error){
      alert(error.message);
    }
  }

  async function removeMenuItem(item){
    try {
      const response = await fetch("/api/remove_menu_item", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(item), // send outdated trash menu item
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove menu item.");
      }

      // Refresh menu item list after the save is made
      await loadMenuItems();
    }

    // Show popup if an error occurs
    catch(error){
      alert(error.message);
    }
  }

    async function addNewMenu(item) {
    try {
      const response = await fetch("/api/add_menu_item", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(item),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add new menu item.");
      }

      // Refresh employee list after the save is made
      await loadMenuItems();
    }

    // Show popup if an error occurs
    catch(error){
      alert(error.message);
    }
  }


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
              <div className="manager-section-header">
              <h2 className="manager-section-title">Menu</h2>
              <button className="addButton"
                      onClick={() => {
                        {/* Set editable employee to empty template */}
                        setEditableTemp(emptyMenu);
                        setOpenModal("addMenu")
                        }}>
                      Add Menu Item
              </button>
            </div>

              {menuError ? (
                <p className="customer-order-placeholder">{menuError}</p>
              ) : null}

              {!menuError && menuItems.length === 0 ? (
                <p className="customer-order-placeholder">Loading menu items...</p>
              ) : null}

              <div className="manager-list">
                {menuItems.map((item) => (
                  <article key={item.item_name}
                    onClick={() => {
                        setClickedItem(item.item_name); 
                        setEditableTemp({...item});
                        setOpenModal("editMenuItem")
                      }}
                      className="manager-list-card">
                    <span className="manager-list-name">{item.item_name}</span>
                    <span className="manager-list-value">
                      Price: ${Number(item.price).toFixed(2)}
                    </span>
                  </article>
                ))}
              </div>

              {/* Edit Menu Item Modal */}
              {openModal === "editMenuItem" && selectedMenuItem && (
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="Menu Item Information"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={{...style, width:"400"}}>
                    <Typography variant="h6" component="h2">
                      Menu Item Information
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Menu Item Name: <input type="text" 
                                            value={editableTemp.item_name} 
                                            style={{width:"100px", border: "1px solid #000"}}
                                            onChange={(e) => setEditableTemp({...editableTemp, item_name: e.target.value})}
                                      />
                      <br></br>
                      Menu Item Price: $<input  type="number" 
                                          min="0"
                                          step=".01"
                                          value={editableTemp.price} 
                                          style={{width:"55px", border: "1px solid #000"}}
                                          onChange={(e) => setEditableTemp({...editableTemp, price: e.target.value})}
                                />
                      <br></br>
                      Inventory Cost: <input  type="text" 
                                        value={editableTemp.inventory_cost} 
                                        style={{width:"150px", border: "1px solid #000"}}
                                        onChange={(e) => setEditableTemp({...editableTemp, inventory_cost: e.target.value})}
                                />
                      <br></br>
                    </Typography>
                    <div className="managerButtons">
                      <button className="saveButton" 
                              disabled = {!hasChanges(selectedMenuItem, editableTemp)}
                              onClick={() => {
                                if(editableTemp.item_name === "" || editableTemp.inventory_cost === ""){
                                  alert("Invalid Input(s): Fields cannot be left blank!");
                                  return;
                                }

                                if(!editableTemp.price || editableTemp.price <= 0){
                                  alert("Invalid Input(s): Price cannot be negative or left blank!");
                                  return;
                                }
                                
                                // If inputs are valid call update function
                                updateMenuItem(editableTemp, selectedMenuItem.item_name);
                                alert("Menu item has been updated");

                                // Close modal once done
                                handleClose();
                              }}>
                              Save
                      </button>
                      <button className="removeButton" 
                              onClick={() => {
                                confirm("Are you sure you want to remove this menu item?\nThis action cannot be undone.")
                                removeMenuItem(selectedMenuItem);
                              }}>
                              Remove Item</button>
                    </div>
                  </Box>
                </Modal>
              )}

              {/* Add New Menu Item Modal */}
              {openModal === "addMenu" && (
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="Enter New Menu Item Information"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={{...style, width: 400}}>
                    <Typography variant="h6" component="h2">
                      Enter New Menu Item Information
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                       Menu Item Name: <input type="text" 
                                            style={{width:"100px", border: "1px solid #000"}}
                                            onChange={(e) => setEditableTemp({...editableTemp, item_name: e.target.value})}
                                      />
                      <br></br>
                      Menu Item Price: $<input  type="number" 
                                          min="0"
                                          step=".01"
                                          style={{width:"55px", border: "1px solid #000"}}
                                          onChange={(e) => setEditableTemp({...editableTemp, price: e.target.value})}
                                />
                      <br></br>
                      Inventory Cost: <input  type="text" 
                                        style={{width:"150px", border: "1px solid #000"}}
                                        onChange={(e) => setEditableTemp({...editableTemp, inventory_cost: e.target.value})}
                                />
                      <br></br>
                    </Typography>
                    <div className="managerButtons">
                      <button className="saveButton" 
                              onClick={() => {
                                if(editableTemp.item_name === "" || editableTemp.inventory_cost === ""){
                                  alert("Invalid Input(s): Fields cannot be left blank!");
                                  return;
                                }

                                if(!editableTemp.price || editableTemp.price <= 0){
                                  alert("Invalid Input(s): Price cannot be negative or left blank!");
                                  return;
                                }
                                
                                // If inputs are valid call hire function
                                addNewMenu(editableTemp);
                                alert("Item has been added to the menu!");

                                // Close modal once done
                                handleClose();
                              }}>
                              Save
                      </button>
                    </div>
                  </Box>
                </Modal>
              )}
            </>
          ) : null}

          {activeTab === "employees" ? (
            <>
            <div className="manager-section-header">
              <h2 className="manager-section-title">Employees</h2>
              <button className="addButton"
                      onClick={() => {
                        {/* Set editable employee to empty template */}
                        setEditableTemp(emptyEmployee);
                        setOpenModal("hireEmployee")
                        }}>
                      Hire Employee
              </button>
            </div>
            
            
              {employeeError ? (
                <p className="customer-order-placeholder">{employeeError}</p>
              ) : null}

              {!employeeError && employees.length === 0 ? (
                <p className="customer-order-placeholder">Loading employee information...</p>
              ) : null}


              <div className="manager-list">
                {employees.map((item) => (
                  <article key={item.employee_name} 
                    onClick={() => {
                      setClickedItem(item.employee_id_num); 
                      setEditableTemp({...item});
                      setOpenModal("editEmployee")
                    }}
                    className="manager-list-card">
                    <span className="manager-list-name">{item.employee_name}</span>
                    <span className="manager-list-value">Employee ID: {item.employee_id_num}</span>
                  </article>
                ))}
              </div>

              {/* Edit Employee Modal */}
              {openModal === "editEmployee" && selectedEmployee && (
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="Employee Information"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography variant="h6" component="h2">
                      Employee Information
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Employee Name: <input type="text" 
                                            value={editableTemp.employee_name} 
                                            style={{width:"100px", border: "1px solid #000"}}
                                            onChange={(e) => setEditableTemp({...editableTemp, employee_name: e.target.value})}
                                      />
                      <br></br>
                      Employee ID: {selectedEmployee.employee_id_num}<br></br>
                      Manager: <input type="checkbox"
                                      checked={editableTemp.manager}
                                      onChange={(e) => setEditableTemp({...editableTemp, manager: e.target.checked ? 1 : 0})}
                                />
                      <br></br>
                      Password: <input  type="text" 
                                        value={editableTemp.employee_password} 
                                        style={{width:"50px", border: "1px solid #000"}}
                                        onChange={(e) => setEditableTemp({...editableTemp, employee_password: e.target.value})}
                                />
                      <br></br>
                    </Typography>
                    <div className="managerButtons">
                      <button className="saveButton" 
                              disabled = {!hasChanges(selectedEmployee, editableTemp)}
                              onClick={() => {
                                if(editableTemp.employee_name === "" || editableTemp.employee_password === ""){
                                  alert("Invalid Input(s): Fields cannot be left blank!");
                                  return;
                                }
                                
                                // If inputs are valid call update function
                                updateEmployee(editableTemp);
                                alert("Employee information has been updated");

                                // Close modal once done
                                handleClose();
                              }}>
                              Save
                      </button>
                      <button className="removeButton" 
                              onClick={() => {
                                confirm("Are you sure you want to fire this employee?\nThis action cannot be undone.")
                                fireEmployee(selectedEmployee);
                              }}>
                              Fire Employee</button>
                    </div>
                  </Box>
                </Modal>
              )}

              {/* Hire Employee Modal */}
              {openModal === "hireEmployee" && (
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="Enter New Employee Information"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={{...style, width: 400}}>
                    <Typography variant="h6" component="h2">
                      Enter New Employee Information
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Employee Name: <input type="text" 
                                            style={{width:"100px", border: "1px solid #000"}}
                                            onChange={(e) => setEditableTemp({...editableTemp, employee_name: e.target.value})}
                                      />
                      <br></br>
                      Manager: <input type="checkbox"
                                      onChange={(e) => setEditableTemp({...editableTemp, manager: e.target.checked ? 1 : 0})}
                                />
                      <br></br>
                      Password: <input  type="text" 
                                        style={{width:"50px", border: "1px solid #000"}}
                                        onChange={(e) => setEditableTemp({...editableTemp, employee_password: e.target.value})}
                                />
                      <br></br>
                    </Typography>
                    <div className="managerButtons">
                      <button className="saveButton" 
                              onClick={() => {
                                if(editableTemp.employee_name === "" || editableTemp.employee_password === ""){
                                  alert("Invalid Input(s): Fields cannot be left blank!");
                                  return;
                                }
                                
                                // If inputs are valid call hire function
                                hireEmployee(editableTemp);
                                alert("Employee has been hired!");

                                // Close modal once done
                                handleClose();
                              }}>
                              Save
                      </button>
                    </div>
                  </Box>
                </Modal>
              )}
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
