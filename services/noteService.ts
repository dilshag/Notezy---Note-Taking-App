import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
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

// // Add new note

export const addNote = async (
userId: string, 
title: string, 
content: string, 
category: string, 
imageUrl: string | null = null, 
videoUrl: string | null = null, 
fileUrl: string | null = null, 
reminderDate: Date | null,
reminderId: string | null = null
): Promise<string> => {

  const docRef = await addDoc(notesCollection, {
    userId,
    title,
    content,
    category,
    imageUrl: imageUrl ?? null,
    videoUrl: videoUrl ?? null,
    fileUrl: fileUrl ?? null,
    reminderDate: reminderDate ? Timestamp.fromDate(reminderDate) : null,
    reminderId: reminderId ?? null,

    createdAt: Timestamp.now(),
  });
  return docRef.id;
};


// Update note
export const updateNote = async (
  noteId: string, 
  title: string, 
  content: string, 
  category: string, 
  editReminder: Date | null,
  reminderId?: string | null
): Promise<void> => {
  const noteRef = doc(db, "notes", noteId);
  await updateDoc(noteRef, { 
    title, 
    content, 
    category,
    reminderDate: editReminder ? Timestamp.fromDate(editReminder) : null,
    reminderId: reminderId || null, // 🆕 store in Firestore
    updatedAt: serverTimestamp(),});
   
  

  };

// Delete note
export const deleteNote = async (noteId: string): Promise<void> => {
  const noteRef = doc(db, "notes", noteId);
  await deleteDoc(noteRef);
};



// export const addNote = async (
//   userId: string,
//   title: string,
//   content: string,
//   category: string
// ): Promise<string> => {
//   const docRef = await addDoc(notesCollection, {
//     userId,
//     title,
//     content,
//     category,
//     createdAt: Timestamp.now(),
//   });
//   return docRef.id;
// };