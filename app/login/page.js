export const metadata = {
  title: "Point of Access Login",
};

// 1. Add { searchParams } as an argument to your component
export default function LoginPage({ searchParams }) {
  
  // 2. Extract the role from the URL (e.g., ?role=manager)
  // We use a fallback just in case someone goes to /login without clicking a button
  const role = searchParams.role || "customer"; 

  // 3. Set up dynamic variables based on that role
  let displayTitle = "Welcome!";
  let subtitle = "Enter your credentials.";

  if (role === "manager") {
    displayTitle = "Manager Portal";
    subtitle = "Authorized management personnel only.";
  } else if (role === "cashier") {
    displayTitle = "POS System Login";
    subtitle = "Clock in to access the register.";
  } else if (role === "customer") {
    displayTitle = "Customer Login";
    subtitle = "Sign in to view your loyalty points and orders.";
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        
        {/* 4. Inject your dynamic variables into the JSX using curly braces {} */}
        <h1 id="login-title">{displayTitle}</h1>
        <p className="login-copy">{subtitle}</p>

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