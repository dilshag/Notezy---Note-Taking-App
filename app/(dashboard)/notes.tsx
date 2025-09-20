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
// // app/(dashboard)/notes.tsx
// import { Ionicons } from "@expo/vector-icons";
// import React, { useEffect, useState } from "react";
// import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import { deleteNote, getNotes, updateNote } from "../../services/noteService";
// import { Note } from "../../types/note";

// export default function NotesPage() {
//   const { user } = useAuth();
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editContent, setEditContent] = useState("");
//   const [search, setSearch] = useState("");

//   const categories = ["Personal", "Work", "Study", "Ideas", "Other"];
//   const categoryColors: { [key: string]: string } = {
//     Personal: "#FFB6C1",
//     Work: "#87CEFA",
//     Study: "#FFD700",
//     Ideas: "#90EE90",
//     Other: "#D3D3D3",
//   };

//   const loadNotes = async () => {
//     if (user?.uid) {
//       const data = await getNotes(user.uid);
//       const notesData: Note[] = data.map((note) => ({
//         id: note.id,
//         title: note.title ?? "",
//         content: note.content ?? "",
//         category: note.category ?? "Other",
//         createdAt: note.createdAt,
//       }));
//       setNotes(notesData);
//     }
//   };

//   useEffect(() => {
//     loadNotes();
//   }, [user]);

//   // Inline edit
//   const handleEdit = (note: Note) => {
//     setEditingId(note.id);
//     setEditTitle(note.title);
//     setEditContent(note.content);
//   };

//   const handleSaveEdit = async (id: string) => {
//     if (!editTitle || !editContent) return;
//     await updateNote(id, editTitle, editContent, notes.find(n => n.id === id)?.category || "Other");
//     setEditingId(null);
//     setEditTitle("");
//     setEditContent("");
//     loadNotes();
//   };

//   const handleDelete = async (id: string) => {
//     await deleteNote(id);
//     loadNotes();
//   };

//   const filteredNotes = notes.filter(
//     (note) =>
//       note.title.toLowerCase().includes(search.toLowerCase()) ||
//       note.content.toLowerCase().includes(search.toLowerCase()) ||
//       note.category.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>📝 Notes</Text>

//       {/* Search */}
//       <TextInput
//         placeholder="Search notes..."
//         placeholderTextColor="#FFA5BA"
//         style={styles.searchInput}
//         value={search}
//         onChangeText={setSearch}
//       />

//       {/* Notes List */}
//       <FlatList
//         data={filteredNotes}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={[styles.noteCard, { backgroundColor: categoryColors[item.category] || "#FFF" }]}>
//             {editingId === item.id ? (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   value={editTitle}
//                   onChangeText={setEditTitle}
//                 />
//                 <TextInput
//                   style={[styles.input, { height: 60 }]}
//                   value={editContent}
//                   onChangeText={setEditContent}
//                   multiline
//                 />
//                 <View style={{ flexDirection: "row", gap: 16 }}>
//                   <TouchableOpacity onPress={() => handleSaveEdit(item.id)}>
//                     <Text style={{ color: "#FF6B8B", fontWeight: "700" }}>Save</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => setEditingId(null)}>
//                     <Text style={{ color: "#FF6B8B", fontWeight: "700" }}>Cancel</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             ) : (
//               <>
//                 <View style={styles.noteHeader}>
//                   <Text style={styles.noteTitle}>{item.title}</Text>
//                   <Text style={styles.noteCategory}>{item.category}</Text>
//                 </View>
//                 <Text style={styles.noteContent}>{item.content}</Text>
//                 <View style={styles.noteActions}>
//                   <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
//                     <Ionicons name="create-outline" size={18} color="#FF6B8B" />
//                     <Text>Edit</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
//                     <Ionicons name="trash-outline" size={18} color="#FF6B8B" />
//                     <Text>Delete</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         )}
//         ListEmptyComponent={<Text style={styles.emptyText}>No notes found</Text>}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#FFECF1" },
//   title: { fontSize: 24, fontWeight: "700", color: "#FF6B8B", marginBottom: 16 },
//   searchInput: { backgroundColor: "#FFF", padding: 12, borderRadius: 20, marginBottom: 16, color: "#FF6B8B" },
//   input: { backgroundColor: "#FFF", padding: 12, borderRadius: 12, marginBottom: 8, color: "#FF6B8B" },
//   noteCard: { padding: 12, borderRadius: 16, marginBottom: 12 },
//   noteHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
//   noteTitle: { fontWeight: "700", fontSize: 16, color: "#FF6B8B" },
//   noteCategory: { fontSize: 12, color: "#FF6B8B", fontStyle: "italic" },
//   noteContent: { fontSize: 14, color: "#FF6B8B" },
//   noteActions: { flexDirection: "row", marginTop: 8, gap: 16 },
//   actionButton: { flexDirection: "row", alignItems: "center", gap: 4 },
//   emptyText: { textAlign: "center", marginTop: 20, color: "#FF6B8B" },
// });
// app/(dashboard)/notes.tsx
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { deleteNote, getNotes, updateNote } from "../../services/noteService";
import { Note } from "../../types/note";

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [search, setSearch] = useState("");

  const categories = ["Personal", "Work", "Study", "Ideas", "Other"];
  const categoryColors: { [key: string]: string } = {
    Personal: "#FFB6C1",
    Work: "#87CEFA",
    Study: "#FFD700",
    Ideas: "#90EE90",
    Other: "#D3D3D3",
  };

  const loadNotes = async () => {
    if (user?.uid) {
      const data = await getNotes(user.uid);
      const notesData: Note[] = data.map((note) => ({
        id: note.id,
        title: note.title ?? "",
        content: note.content ?? "",
        category: note.category ?? "Other",
        createdAt: note.createdAt,
        imageUrl: note.imageUrl ?? undefined,
        videoUrl: note.videoUrl ?? undefined,
        fileUrl: note.fileUrl ?? undefined,
      }));
      setNotes(notesData);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  // Inline edit
  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle || !editContent) return;
    await updateNote(
      id,
      editTitle,
      editContent,
      notes.find((n) => n.id === id)?.category || "Other"
    );
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    loadNotes();
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    loadNotes();
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📝 Notes</Text>

      {/* Search */}
      <TextInput
        placeholder="Search notes..."
        placeholderTextColor="#FFA5BA"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteCard, { backgroundColor: categoryColors[item.category] || "#FFF" }]}>
            {editingId === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                />
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline
                />
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <TouchableOpacity onPress={() => handleSaveEdit(item.id)}>
                    <Text style={{ color: "#FF6B8B", fontWeight: "700" }}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingId(null)}>
                    <Text style={{ color: "#FF6B8B", fontWeight: "700" }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.noteCategory}>{item.category}</Text>
                </View>

                <Text style={styles.noteContent}>{item.content}</Text>

                {/* Media previews */}
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 8 }}
                  />
                )}
                {item.videoUrl && (
                  <Video
                    source={{ uri: item.videoUrl }}
                    style={{ width: "100%", height: 200, marginTop: 8 }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                  />
                )}
                {item.fileUrl && (
                  <Text style={{ marginTop: 8 }}>File: {item.fileUrl.split("/").pop()}</Text>
                )}

                <View style={styles.noteActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={18} color="#FF6B8B" />
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={18} color="#FF6B8B" />
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes found</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FFECF1" },
  title: { fontSize: 24, fontWeight: "700", color: "#FF6B8B", marginBottom: 16 },
  searchInput: { backgroundColor: "#FFF", padding: 12, borderRadius: 20, marginBottom: 16, color: "#FF6B8B" },
  input: { backgroundColor: "#FFF", padding: 12, borderRadius: 12, marginBottom: 8, color: "#FF6B8B" },
  noteCard: { padding: 12, borderRadius: 16, marginBottom: 12 },
  noteHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  noteTitle: { fontWeight: "700", fontSize: 16, color: "#FF6B8B" },
  noteCategory: { fontSize: 12, color: "#FF6B8B", fontStyle: "italic" },
  noteContent: { fontSize: 14, color: "#FF6B8B" },
  //noteActions: { flexDirection: "row", marginTop: 8, gap: 16 },
  noteActions: { flexDirection: "row", marginTop: 8 },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#FF6B8B" },
});
