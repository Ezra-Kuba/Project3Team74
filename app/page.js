import Link from "next/link";

export default function Home() {
  return (
    <main className="menu-page">
      {/* <header className="menu-header">
        <Link className="employee-login" href="/login">Login</Link>
      </header> */}

      <nav class="navbar">
        <div class="logo">BrandName</div>
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a className="employee-login" href="/login">Login</a></li>
        </ul>
      </nav>

      <section className="menu-hero" aria-labelledby="menu-title">
        <p className="menu-label"></p>
        <h1 id="menu-title">Supa Chirese Dragon Boba desu!<br></br>You likes yes!</h1>
      </section>

      <section className="menu-img">
        <img src="/image.png"></img>  
        <img src="/jesse.png"></img> 
        <img src="/image.png"></img>
      </section> 

      <section className = "landingPageBottomSection">
        <h4 className = "landingPageBottomHeader">These r examples buttons that will link to other pages. Implementation needs fixing later:</h4>
        <Link className = "landingPageBottomButtons" href="/menu">example menu button</Link>
      </section>
    </main>
  );
}
