export const metadata = {
  title: "Menu Page Placeholder",
};

export default function MenuGUI() {
  return (
    <main className="menu-page">
      <section className="menu-title" aria-labelledby="menu-title">
        <h1 id="menu-title">Menu Page</h1>
        <p className="menu-copy">This page is not done, but this is where we will begin implementing a menu page. <br></br>That way we can just link it to other pages when the login ect. features are done.</p>
      </section>

      <section className="menu-mainScreen">
        <h2 className="menu-list-title">Menu List</h2>
        <ul className="menu-items">
          <li className="menu-item">Menu Item 1</li>
          <li className="menu-item">Menu Item 2</li>
          <li className="menu-item">Menu Item 3</li>
        </ul>
      </section>
    </main>
  );
}
