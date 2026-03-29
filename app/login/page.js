"use client";

import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGoogleOAuthReady } from "../google-oauth-provider";

const STORAGE_KEY = "google-oauth-user";

function decodeJwt(token) {
  const base64Url = token.split(".")[1];

  if (!base64Url) {
    throw new Error("Missing JWT payload");
  }

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const payload = window.atob(padded);
  const json = decodeURIComponent(
    Array.from(payload)
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );

  return JSON.parse(json);
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";
  const isGoogleOAuthReady = useGoogleOAuthReady();
  const [user, setUser] = useState(null);
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const mockUsers = {
    manager: { username: "Pete", password: "admin" },
    cashier: { username: "Drew", password: "11" },
    customer: { username: "Bob", password: "yes" },
    admin: { username: "jorgeoliver909@tamu.edu", password: "admin" },
  };

  let displayTitle = "Welcome!";
  let subtitle = "Enter your credentials or continue with Google.";

  if (role === "manager") {
    displayTitle = "Manager Portal";
    subtitle = "Authorized management personnel only.";
  } else if (role === "cashier") {
    displayTitle = "POS System Login";
    subtitle = "Clock in to access the register.";
  } else if (role === "admin") {
    displayTitle = "Admin Login";
    subtitle = "Sign in to access the admin portal.";
  } else if (role === "customer") {
    displayTitle = "Customer Login";
    subtitle = "Sign in with your account or continue with Google.";
  }

  useEffect(() => {
    const savedUser = window.localStorage.getItem(STORAGE_KEY);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSuccess = (credentialResponse) => {
    try {
      const profile = decodeJwt(credentialResponse.credential);
      const nextUser = {
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
      };

      if (profile.email !== mockUsers.admin.username) {
        setGoogleErrorMessage("This Google account is not authorized for the admin portal.");
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      setGoogleErrorMessage("");
      router.push("/admin");
    } catch {
      setGoogleErrorMessage("Google login succeeded, but the profile could not be read.");
    }
  };

  const handleLogout = () => {
    googleLogout();
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setGoogleErrorMessage("");
  };

  const loginHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const enteredUsername = formData.get("username");
    const enteredPassword = formData.get("password");
    const validCredentials = mockUsers[role];

    if (
      validCredentials &&
      enteredUsername === validCredentials.username &&
      enteredPassword === validCredentials.password
    ) {
      setFormErrorMessage("");

      if (role === "manager") {
        router.push("/managerGUI");
      } else if (role === "admin") {
        router.push("/admin");
      } else if (role === "cashier") {
        router.push("/cashierGUI");
      } else {
        router.push("/customerGUI");
      }
    } else {
      setFormErrorMessage("Incorrect username or password. Please try again.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">{displayTitle}</h1>
        <p className="login-copy">{subtitle}</p>

        {!user ? (
          <>
            <form className="login-form" onSubmit={loginHandler}>
              <label className="field">
                <span>Username</span>
                <input type="text" name="username" placeholder="Enter username" required />
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

              {formErrorMessage ? (
                <p style={{ color: "#b91c1c", fontSize: "14px", margin: 0 }}>
                  {formErrorMessage}
                </p>
              ) : null}

              <button type="submit">Log In</button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "24px 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              <span style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
              <span>or sign in with Google</span>
              <span style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
            </div>
          </>
        ) : null}

        <div
          className="login-form"
          style={{ justifyItems: "center", textAlign: "center" }}
        >
          {user ? (
            <>
              <p style={{ margin: 0, fontWeight: 600 }}>You are already logged in.</p>
              <p style={{ margin: 0, color: "#4b5563" }}>
                Use logout below to switch accounts.
              </p>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : !isGoogleOAuthReady ? (
            <p style={{ color: "#b91c1c", margin: 0 }}>
              Google OAuth is not configured. Add
              {" "}
              <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>
              {" "}
              or move your current client ID into the Next app env file.
            </p>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                setGoogleErrorMessage("Google login failed. Please try again.");
              }}
              text="signin_with"
              shape="pill"
            />
          )}

          {googleErrorMessage ? (
            <p style={{ color: "#b91c1c", fontSize: "14px", margin: 0 }}>
              {googleErrorMessage}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
