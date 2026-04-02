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
    <section className="about-body">
        <h1>About us</h1>
        <img src="/jesse.png"></img>
        <img src="chineseJesse.png"></img>
        <p>The story of Supa Yummi Boba is one of great trials and tribulations.
          Before getting into the Boba Tea business, our founder Jesse Ashen was a 
          sad lonely man. He only lived for food one could only describe as "goyslop"
          and Roblox. One day, however, an ancient Chinese Water Lemur came to him in a dream.
          He told him "my friend, this is not your path. I will make you into who you really are
          , then you will find your destiny." When Jesse awoke, he was now a changed man, fully
          embracing his Chinese roots. From then on, he knew his calling was Boba Tea, and the rest is
          history.
        </p>
    </section>
    </main>
  );
}
