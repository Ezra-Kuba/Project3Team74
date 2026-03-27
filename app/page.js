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
        <h1 id="menu-title">Welcome!<br></br>Please select the proper login page using the buttons above!</h1>
      </section>
    </main>
  );
}
