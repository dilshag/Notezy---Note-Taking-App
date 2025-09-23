import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { setupNotifications } from "@/services/notificationService";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import { NotesProvider } from "../context/NotesContext";
import './../global.css';

const RootLayout = () => {
  

 useEffect(() => {
    const init = async () => {
      const granted = await setupNotifications();
      if (!granted) {
        console.warn("Notifications are disabled. Please enable them for reminders.");
      }
    };
    init();
  }, []);

  
  return (
    <LoaderProvider>
      <AuthProvider>
        <ThemeProvider>
          <NotesProvider>  
          <Slot />
          </NotesProvider>
         </ThemeProvider>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout

//Why here?
//Because RootLayout is the top-level wrapper for your entire app (Expo Router uses it as the layout).
//By putting ThemeProvider here, every screen in your app (Notes, Profile, Index, etc.) can use useThemeContext() 
// to access and toggle the theme