// App.tsx
import React from "react";
import LoginScreen from "./app/(auth)/login"; // oyage login screen path eka ganna
import Dashboard from "./app/(dashboard)/index";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or <ActivityIndicator /> danna puluwan
  }

  return user ? <Dashboard /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
