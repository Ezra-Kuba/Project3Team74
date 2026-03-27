export default function CustomerGUI() {
  const items = [
    "Taro Milk Tea",
    "Matcha Milk Tea",
    "Milk Tea",
    "Brown Sugar Tea",
    "Chai Milk Tea",
    "Vietnamese Iced Coffee",
    "Boba Milk Tea",
    "Coconut Milk Tea",
    "Peach Tea",
    "Lychee Tea",
    "Watermelon Tea",
    "Jasmine Green Tea",
    "Mango Tea",
    "Pineapple Tea",
    "Strawberry Slush",
  ];

  return (
    <main className="customer-pos-page">
      <aside className="customer-sidebar">
        <button className="customer-category-button">Milk Teas</button>
        <button className="customer-category-button">Fruit Teas</button>
        <button className="customer-category-button">Slushes</button>
        <button className="customer-category-button">Specials</button>
      </aside>

      <section className="customer-menu-section">
        <h1 className="customer-menu-title">Customer Menu</h1>

        <div className="customer-item-grid">
          {items.map((item, index) => (
            <button key={index} className="customer-item-card">
              {item}
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