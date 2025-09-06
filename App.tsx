// App.tsx
import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./app/(dashboard)/index"; 
import LoginScreen from "./app/(auth)/login";   // oyage login screen path eka ganna

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
