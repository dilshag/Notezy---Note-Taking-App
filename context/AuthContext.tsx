// context/AuthContext.tsx
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { logout, subscribeToAuthChanges } from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        router.replace("/(dashboard)"); // ✅ dashboard route
      } else {
        router.replace("/(auth)/login"); // ✅ login route
      }
    });

    return unsubscribe;
  }, []);

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      router.replace("/(auth)/login"); // ✅ force go to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
