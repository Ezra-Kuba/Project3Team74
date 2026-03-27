export default function CustomerGUI() {
  const items = [
    { id: 1, name: "Ultra Boba Special", price: 67.76, inventoryCost: "Cup, blue tea, Straw, green tea, Cream, Boba, strawberry" },
    { id: 2, name: "Taro Milk Tea", price: 7.99, inventoryCost: "Cup, Boba, milk tea, Straw, taro powder" },
    { id: 3, name: "Matcha Milk Tea", price: 10.11, inventoryCost: "Cup, Boba, milk tea, matcha, Straw" },
    { id: 4, name: "Milk Tea", price: 7.11, inventoryCost: "Cup, milk tea, straw" },
    { id: 5, name: "Rohak's Creamy Surprise", price: 12.88, inventoryCost: "Cup, Water, Cream, Straw" },
    { id: 6, name: "Brown Sugar Milk Tea", price: 25.99, inventoryCost: "Cup, Brown sugar, milk tea, straw" },
    { id: 7, name: "Chai Milk Tea", price: 100, inventoryCost: "Cup, Boba, Straw, ginger, cinnamon" },
    { id: 8, name: "Vietnamese Iced Coffee", price: 75, inventoryCost: "Cup, Boba, Straw, Ground Coffee, Condensed milk" },
    { id: 9, name: "Boba Milk Tea", price: 12.77, inventoryCost: "Cup, Boba, Straw, milk tea" },
    { id: 10, name: "Coconut Milk Tea", price: 32.77, inventoryCost: "Cup,Boba,Straw, coconut, milk tea" },
    { id: 11, name: "Peach Tea", price: 7.99, inventoryCost: "Cup,Boba,Straw, peach" },
    { id: 12, name: "Lychee Tea", price: 69.99, inventoryCost: "Cup, green tea, lychee, straw" },
    { id: 13, name: "Watermelon Tea", price: 8.99, inventoryCost: "Cup, black tea, watermelon, Straw" },
    { id: 14, name: "Ezra's Mystery Slop", price: 7.99, inventoryCost: "Cup,Boba,Straw, blue tea, green tea, milk tea, ginger, peach" },
    { id: 15, name: "Jasmine Green Tea", price: 8.99, inventoryCost: "Cup,Boba,Straw, green tea" },
    { id: 16, name: "Jesse's Mango Milk Tea", price: 10, inventoryCost: "Cup,Boba,Straw, milk tea, brown sugar, Mango" },
    { id: 17, name: "Pineapple Tea", price: 14.88, inventoryCost: "Cup, green tea, pineapple, straw" },
    { id: 18, name: "Roman's Experience", price: 18.99, inventoryCost: "Cup,Boba,Straw, peach, strawberry, blue tea" },
    { id: 19, name: "Strawberry Slush", price: 15.99, inventoryCost: "Cup,Boba,Straw, strawberry" },
    { id: 20, name: "Roman's Tropical Island Adventure", price: 19.99, inventoryCost: "Cup, Milk, Pineapple, Mango, Strawberry, straw" },
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
          {items.map((item) => (
            <button key={item.id} className="customer-item-card">
              {item.name}
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