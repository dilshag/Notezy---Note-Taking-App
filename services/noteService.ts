import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase"; // Firebase config path
import { Note } from "../types/note";

const notesCollection = collection(db, "notes");

// Get all notes for a user
export const getNotes = async (userId: string): Promise<Note[]> => {
  const q = query(notesCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Note[];
};

// Add new note
export const addNote = async (
  userId: string,
  title: string,
  content: string,
  category: string
): Promise<string> => {
  const docRef = await addDoc(notesCollection, {
    userId,
    title,
    content,
    category,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

// Update note
export const updateNote = async (
  noteId: string,
  title: string,
  content: string,
  category: string
): Promise<void> => {
  const noteRef = doc(db, "notes", noteId);
  await updateDoc(noteRef, { title, content, category });
};

// Delete note
export const deleteNote = async (noteId: string): Promise<void> => {
  const noteRef = doc(db, "notes", noteId);
  await deleteDoc(noteRef);
};
