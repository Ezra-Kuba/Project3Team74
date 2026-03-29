import "./globals.css";
import AppGoogleOAuthProvider from "./google-oauth-provider";

export const metadata = {
  title: "Point of Access",
  description: "Self-serve customer endpoint",
};

export default function RootLayout({ children }) {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    "";

  return (
    <html lang="en">
      <body>
        <AppGoogleOAuthProvider clientId={googleClientId}>
          {children}
        </AppGoogleOAuthProvider>
      </body>
    </html>
  );
}
