import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { Slot } from "expo-router";
import React from "react";
import { NotesProvider } from "../context/NotesContext";
import './../global.css';


const RootLayout = () => {
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