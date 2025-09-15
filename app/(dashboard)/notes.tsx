// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// export default function NotesPage() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📝 Notes</Text>
//       <Text style={styles.subtitle}>Here you can manage your notes.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 24, fontWeight: "bold", color: "#FF6B8B" },
//   subtitle: { fontSize: 16, color: "#555", marginTop: 10 },
// });




// app/(dashboard)/notes.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNotes } from "../../context/NotesContext";
import { deleteNote } from "../../services/noteService";

export default function NotesScreen() {
  const { notes, reloadNotes } = useNotes();
  const [search, setSearch] = useState("");

  const categoryColors: { [key: string]: string } = {
    Personal: "#FFB6C1",
    Work: "#87CEFA",
    Study: "#FFD700",
    Ideas: "#90EE90",
    Other: "#D3D3D3",
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    reloadNotes();
  };

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteCard, { backgroundColor: categoryColors[item.category] || "#FFF" }]}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteCategory}>{item.category}</Text>
            </View>
            <Text style={styles.noteContent}>{item.content}</Text>
            <View style={styles.noteActions}>
              <TouchableOpacity onPress={() => alert("Edit not implemented here")} style={styles.actionButton}>
                <Ionicons name="create-outline" size={18} color="#FF6B8B" />
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                <Ionicons name="trash-outline" size={18} color="#FF6B8B" />
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes found</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFECF1" },
  noteCard: { padding: 12, borderRadius: 16, marginBottom: 12 },
  noteHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  noteTitle: { fontWeight: "700", fontSize: 16, color: "#FF6B8B" },
  noteCategory: { fontSize: 12, color: "#FF6B8B", fontStyle: "italic" },
  noteContent: { fontSize: 14, color: "#FF6B8B" },
  noteActions: { flexDirection: "row", marginTop: 8 },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 16, gap: 4 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#FF6B8B" },
});

