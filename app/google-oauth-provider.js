"use client";

import { createContext, useContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleOAuthContext = createContext({ isReady: false });

export function useGoogleOAuthReady() {
  return useContext(GoogleOAuthContext).isReady;
}

export default function AppGoogleOAuthProvider({ children, clientId }) {
  if (!clientId) {
    return (
      <GoogleOAuthContext.Provider value={{ isReady: false }}>
        {children}
      </GoogleOAuthContext.Provider>
    );
  }

  return (
    <GoogleOAuthContext.Provider value={{ isReady: true }}>
      <GoogleOAuthProvider clientId={clientId}>
        {children}
      </GoogleOAuthProvider>
    </GoogleOAuthContext.Provider>
  );
}
