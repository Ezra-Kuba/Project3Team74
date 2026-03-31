import Link from "next/link";

export default function ContactPage() {
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
        <h1>Contact info</h1>
        <img src="/image.png" alt="Our founders in their natrual habitat"></img>
        <ul class ="contact bar">
            <li><a href="jvashen@tamu.edu">Jesse Ashen</a></li>
            <li><a href="jorgeoliver909@tamu.edu">Jorge Lebron Oliver</a></li>
            <li><a href="rodroman@tamu.edu">Roman Rodriguez</a></li>
            <li><a href="rohakb@tamu.edu">Rohak Brahma</a></li>
            <li><a href="ezra_k234@tamu.edu">Ezra Kuba</a></li>
        </ul>
    </section>
    </main>
  );
}