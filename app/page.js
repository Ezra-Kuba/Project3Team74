import Link from "next/link";

export default function Home() {
  return (
    <main className="menu-page">
      {/* <header className="menu-header">
        <Link className="employee-login" href="/login">Login</Link>
      </header> */}

      <nav className="navbar">
        <div className="logo">Supa Yummi Boba</div>
        <ul className="nav-links">
          <li><a className="nav-bar-items" href="/">Home</a></li>
          <li><a className="nav-bar-items" href="/about">About</a></li>
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
          Here at Supa Yummi Boba we value our customers needs!
        </h4>
        <p>The buttons below will enable accessibility features:</p>
        <button >
          Toggle High Contrast
        </button>
        <p>This is a demo of the accessibility features. In the full version, this slider would adjust the font size.</p>
        <div className="slidecontainer">
          {/* <input type="range" min="1" max="100" value="50" className="slider" id="myRange"> */}
        </div>
      </section>
    </main>
  );
}
