// context/ThemeContext.tsx
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  loading: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (t: Theme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>("light");
  const [loading, setLoading] = useState(true);

  // Load saved theme from Firestore when user changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      if (!user?.uid) {
        // not logged in -> default
        if (mounted) {
          setThemeState("light");
          setLoading(false);
        }
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data() as any;
          if (data?.theme === "dark" || data?.theme === "light") {
            if (mounted) setThemeState(data.theme);
          } else {
            if (mounted) setThemeState("light");
          }
        } else {
          // no user doc -> default
          if (mounted) setThemeState("light");
        }
      } catch (e) {
        console.error("Failed to load theme:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  // Persist theme to Firestore (merge so we don't clobber other fields)
  const persistTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    if (!user?.uid) return;
    try {
      await setDoc(doc(db, "users", user.uid), { theme: newTheme }, { merge: true });
    } catch (e) {
      console.error("Failed to save theme:", e);
    }
  };

  const toggleTheme = async () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    await persistTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, toggleTheme, setTheme: persistTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used inside ThemeProvider");
  return ctx;
};
