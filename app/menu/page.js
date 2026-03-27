export const metadata = {
  title: "Point of Access Login",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Menu Page</h1>
        <p className="login-copy">This page is not done, but this is where we will begin implementing a menu page. <br></br>That way we can just link it to other pages when the login ect. features are done.</p>

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
