// services/noteService.ts
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

const notesCollection = collection(db, "notes");

//  Get all notes for a user
export const getNotes = async (userId: string) => {
  const q = query(notesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

//  Add new note
export const addNote = async (userId: string, title: string, content: string, category: string) => {
  const docRef = await addDoc(notesCollection, {
    userId,
    title,
    content,
    category,  
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

//  Update note
export const updateNote = async (noteId: string, title: string, content: string,category: string) => {
  const noteRef = doc(db, "notes", noteId);
  await updateDoc(noteRef, { title, content , category});
};

//  Delete note
export const deleteNote = async (noteId: string) => {
  const noteRef = doc(db, "notes", noteId);
  await deleteDoc(noteRef);
};

//  Search notes (client-side filter)
export const searchNotes = async (userId: string, keyword: string) => {
  const q = query(notesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const allNotes = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  // Case-insensitive search
  return allNotes.filter(
    (note: any) =>
      note.title.toLowerCase().includes(keyword.toLowerCase()) ||
      note.content.toLowerCase().includes(keyword.toLowerCase())
  );
};
