import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { Slot } from "expo-router";
import React from "react";
import { NotesProvider } from "../context/NotesContext";
import './../global.css';

const RootLayout = () => {
  

//  useEffect(() => {
//     const init = async () => {
//       const granted = await setupNotifications();
//       if (!granted) {
//         console.warn("Notifications are disabled. Please enable them for reminders.");
//       }
//     };
//     init();
//   }, []);

  
  return (
    <LoaderProvider>
      <AuthProvider>
         <NotesProvider>
          <Slot />
        </NotesProvider>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout