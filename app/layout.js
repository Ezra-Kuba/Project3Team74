import "./globals.css";

export const metadata = {
  title: "Point of Access",
  description: "Self-serve customer endpoint",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
