"use client"; // Required for client-side interactivity

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react"; // Added Suspense here

// 1. Rename your main logic function so it's not the default export anymore
function LoginContent() {
  const router = useRouter();
  
  // Safely extract the role from the URL using the Next.js hook
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer"; 

  // Create a state variable to hold any login errors
  const [errorMessage, setErrorMessage] = useState("");

  // Your Mock database
  const mockUsers = {
    manager: { username: "Pete", password: "admin" },
    cashier: { username: "Drew", password: "11" },
    customer: { username: "Bob", password: "yes" }
  };

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

  const loginHandler = (e) => {
    e.preventDefault(); 

    // Use FormData to easily grab what the user typed into the inputs
    const formData = new FormData(e.target);
    const enteredUsername = formData.get("username");
    const enteredPassword = formData.get("password");

    // Look up the correct credentials for whichever role is trying to log in
    const validCredentials = mockUsers[role];

    // Compare the typed credentials against our hardcoded ones
    if (
      validCredentials && 
      enteredUsername === validCredentials.username && 
      enteredPassword === validCredentials.password
    ) {
      // SUCCESS! Clear any errors and redirect to the correct GUI
      setErrorMessage("");
      console.log(`Successful login for role: ${role}`);

      if (role === "manager") {
        router.push("/managerGUI");
      } else if (role === "cashier") {
        router.push("/cashierGUI");
      } else {
        router.push("/customerGUI"); 
      }
    } else {
      // FAILURE! Update our state to show an error message
      setErrorMessage("Incorrect username or password. Please try again.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        
        <h1 id="login-title">{displayTitle}</h1>
        <p className="login-copy">{subtitle}</p>

        <form className="login-form" onSubmit={loginHandler}>
          <label className="field">
            <span>Username</span>
            <input type="text" name="username" placeholder="Enter username" required/>
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              required
            />
          </label>

          {/* Conditionally render the error message if one exists */}
          {errorMessage && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>
              {errorMessage}
            </p>
          )}

          <button type="submit">Log In</button>
        </form>
      </section>
    </main>
  );
}

// 2. Create the new default export that wraps your logic in <Suspense>
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}