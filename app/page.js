import Link from "next/link";

export default function Home() {
  return (
    <main className="menu-page">
      {/* <header className="menu-header">
        <Link className="employee-login" href="/login">Login</Link>
      </header> */}

      <nav class="navbar">
        <div class="logo">Supa Yummi Boba</div>
        <ul class="nav-links">
          <li><a className="nav-bar-items" href="/">Home</a></li>
          <li><a className="nav-bar-items" href="#about">About</a></li>
          <li><a className="nav-bar-items" href="/menu">Menu</a></li>
          <li><a className="nav-bar-items" href="#contact">Contact</a></li>
          <li><a className="nav-bar-items" href="/login">Login</a></li>
        </ul>
      </nav>

      <section className="menu-hero" aria-labelledby="menu-title">
        <p className="menu-label"></p>
        <h1 id="menu-title">Authentic PseudoAsian Cuisine<br></br>You likes yes!</h1>
      </section>

      <section className="menu-img">
        <img className="menu-img" src="/image.png"></img>  
        <img className="menu-img" src="/jesse.png"></img> 
        <img className="menu-img" src="/image.png"></img>
      </section> 

      <section className = "landingPageBottomSection">
        <h4 className = "landingPageBottomHeader">
          Here at Supa Yummi Boba
        </h4>
        <Link className = "landingPageBottomButtons" href="/menu">example menu button</Link>
      </section>
    </main>
  );
}
