import Link from "next/link";

export default function Home() {
  return (
    <main className="menu-page">
      <header className="menu-header">
        <Link className="employee-login" href="/login?role=customer">Customer Login</Link>
        <Link className="employee-login" href="/login?role=customer">Employee Login</Link>
        <Link className="employee-login" href="/login?role=customer">Manager Login</Link>
      </header>
      

      <section className="menu-hero" aria-labelledby="menu-title">
        <p className="menu-label"></p>
        <h1 id="menu-title">Self-Serve Customer Functionality Here this is our portal page, We need this i</h1>
      </section>
    </main>
  );
}
