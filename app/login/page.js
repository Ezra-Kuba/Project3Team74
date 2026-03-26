export const metadata = {
  title: "Point of Access Login",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Point of Access Login</h1>
        <p className="login-copy">Enter your credentials.</p>

        <form className="login-form">
          <label className="field">
            <span>Username</span>
            <input type="text" name="username" placeholder="Enter username" />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
            />
          </label>

          <button type="button">Log In</button>
        </form>
      </section>
    </main>
  );
}
