import React, { createContext, useContext, useEffect, useState } from "react";
import { getNotes } from "../services/noteService";
import { Note } from "../types/note";
import { useAuth } from "./AuthContext";

type NotesContextType = {
  notes: Note[];
  reloadNotes: () => void;
};

const NotesContext = createContext<NotesContextType>({
  notes: [],
  reloadNotes: () => {},
});

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  const reloadNotes = async () => {
    if (user?.uid) {
      const data = await getNotes(user.uid);
      setNotes(data);
    }
  };

  useEffect(() => {
    reloadNotes();
  }, [user]);

  return (
    <NotesContext.Provider value={{ notes, reloadNotes }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
 

//home eke create krna note eka ewelema notes list eke 
//pennanna ona nisa meka gtte