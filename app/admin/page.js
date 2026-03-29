import Link from "next/link";

export default function AdminPortalPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="admin-portal-title">
        <h1 id="admin-portal-title">Admin Portal</h1>
        <p className="login-copy">
          You have permissions to access all possible endpoints, select one below.
        </p>

        <div className="login-form">
          <Link className="employee-login" href="/managerGUI">
             Manager GUI
          </Link>
          <Link className="employee-login" href="/cashierGUI">
             Cashier GUI
          </Link>
          <Link className="employee-login" href="/customerGUI">
             Customer GUI
          </Link>
        </div>
      </section>
    </main>
  );
}
