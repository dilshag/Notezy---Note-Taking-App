// app/(dashboard)/index.tsx
import React, { useEffect, useState } from "react";
import { auth } from "@/firebase";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  searchNotes,
} from "../../services/noteService";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // ✅ Load notes
  const loadNotes = async () => {
    if (user?.uid) {
      const data = await getNotes(user.uid);
      setNotes(data);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  // ✅ Add or Update note
  const handleSave = async () => {
    if (!title || !content || !user?.uid) return;

    if (editingId) {
      await updateNote(editingId, title, content);
      setEditingId(null);
    } else {
      await addNote(user.uid, title, content);
    }

    setTitle("");
    setContent("");
    loadNotes();
  };

  // ✅ Edit note
  const handleEdit = (note: any) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  // ✅ Delete note
  const handleDelete = async (id: string) => {
    await deleteNote(id);
    loadNotes();
  };

  // ✅ Search notes
  const handleSearch = async () => {
    if (user?.uid) {
      if (search.trim() === "") {
        loadNotes();
      } else {
        const results = await searchNotes(user.uid, search);
        setNotes(results);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome {user?.email}</Text>

      {/* 🔍 Search Bar */}
      <TextInput
        placeholder="Search notes..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <Button title="Search" onPress={handleSearch} />

      {/* 📝 Input fields */}
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <Button title={editingId ? "Update Note" : "Add Note"} onPress={handleSave} />

      {/* 📌 Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text>{item.content}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>🗑 Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Button title="Logout" onPress={logoutUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  note: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  noteTitle: { fontSize: 16, fontWeight: "bold" },
  actions: { flexDirection: "row", marginTop: 10 },
  edit: { marginRight: 15, color: "blue" },
  delete: { color: "red" },
});
