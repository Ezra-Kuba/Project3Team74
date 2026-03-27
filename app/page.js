import Link from "next/link";

export default function Home() {
  return (
    <main className="menu-page">
      <header className="menu-header">
        <Link className="employee-login" href="/login?role=customer">Customer Login</Link>
        <Link className="employee-login" href="/login?role=employee">Employee Login</Link>
        <Link className="employee-login" href="/login?role=manager">Manager Login</Link>
      </header>

      <section className="menu-hero" aria-labelledby="menu-title">
        <p className="menu-label"></p>
        <h1 id="menu-title">Welcome!<br></br>Page in progress!</h1>
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
