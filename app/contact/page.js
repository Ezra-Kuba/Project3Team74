import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">
    <nav class="navbar">
        <div class="logo">Supa Yummi Boba</div>
        <ul class="nav-links">
          <li><a className="nav-bar-items" href="/about">About</a></li>
          <li><a className="nav-bar-items" href="/menu">Menu</a></li>
          <li><a className="nav-bar-items" href="/contact">Contact</a></li>
          <li><a className="nav-bar-items" href="/login">Login</a></li>
        </ul>
    </nav>
    <section className="image and paragraph">
        <h1>About us</h1>
        <img src="/jesse.png"></img>
        <p>this is a fake biography about founder Jesse Ashen.</p>
    </section>
    </main>
  );
}