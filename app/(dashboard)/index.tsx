// // app/(dashboard)/index.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import { getNotes, addNote, updateNote, deleteNote } from "../../services/noteService";

// export default function Dashboard() {
//   const { user, logoutUser } = useAuth();
//   const [notes, setNotes] = useState<any[]>([]);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

//   // Load notes
//   const loadNotes = async () => {
//     if (user?.uid) {
//       let data = await getNotes(user.uid);
//       // Sort latest notes first
//       data.sort(
//         (a, b) =>
//           new Date(b.createdAt?.seconds * 1000).getTime() -
//           new Date(a.createdAt?.seconds * 1000).getTime()
//       );
//       setNotes(data);
//     }
//   };

//   useEffect(() => {
//     loadNotes();
//   }, [user]);

//   // Add / Update note
//   const handleSave = async () => {
//     if (!title || !content || !user?.uid) return;

//     if (editingId) {
//       await updateNote(editingId, title, content);
//       setEditingId(null);
//     } else {
//       await addNote(user.uid, title, content);
//     }

//     setTitle("");
//     setContent("");
//     loadNotes();
//   };

//   // Edit note
//   const handleEdit = (note: any) => {
//     setTitle(note.title);
//     setContent(note.content);
//     setEditingId(note.id);
//   };

//   // Delete note
//   const handleDelete = async (id: string) => {
//     await deleteNote(id);
//     loadNotes();
//   };

//   // Auto filter notes by search
//   const filteredNotes = notes.filter(
//     (note) =>
//       note.title.toLowerCase().includes(search.toLowerCase()) ||
//       note.content.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <Text style={styles.header}>Welcome {user?.email}</Text>

//       {/* 🔍 Search bar */}
//       <TextInput
//         placeholder="Search notes..."
//         value={search}
//         onChangeText={setSearch}
//         style={styles.searchInput}
//       />

//       {/* 📝 Input fields */}
//       <TextInput
//         placeholder="Title"
//         value={title}
//         onChangeText={setTitle}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Content"
//         value={content}
//         onChangeText={setContent}
//         style={[styles.input, { height: 80 }]}
//         multiline
//       />
//       <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//         <Text style={styles.saveButtonText}>
//           {editingId ? "Update Note" : "Add Note"}
//         </Text>
//       </TouchableOpacity>

//       {/* 📌 Notes List */}
//       <FlatList
//         data={filteredNotes}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.noteCard}>
//             <Text style={styles.noteTitle}>{item.title}</Text>
//             <Text style={styles.noteContent}>{item.content}</Text>
//             <View style={styles.noteActions}>
//               <TouchableOpacity onPress={() => handleEdit(item)}>
//                 <Text style={styles.edit}>✏️ Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(item.id)}>
//                 <Text style={styles.delete}>🗑 Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />

//       <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f3f4f6" },
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: "#fff",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: "#fff",
//   },
//   saveButton: {
//     backgroundColor: "#4A90E2",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   noteCard: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginVertical: 6,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   noteTitle: { fontWeight: "bold", fontSize: 16 },
//   noteContent: { marginTop: 4 },
//   noteActions: { flexDirection: "row", marginTop: 10 },
//   edit: { color: "blue", marginRight: 15 },
//   delete: { color: "red" },
//   logoutButton: {
//     backgroundColor: "#f394c0",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   logoutText: { color: "#fff", fontWeight: "bold" },
// });


// app/(dashboard)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ImageBackground
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getNotes, addNote, updateNote, deleteNote } from "../../services/noteService";
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  type Note = {
    id: string;
    title: string;
    content: string;
    createdAt?: { seconds: number; nanoseconds?: number };
  };
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Load notes
  const loadNotes = async () => {
    if (user?.uid) {
      let data = await getNotes(user.uid);
      // Ensure each note has all required fields
      const notesData: Note[] = data.map((note: any) => ({
        id: note.id,
        title: note.title ?? "",
        content: note.content ?? "",
        createdAt: note.createdAt,
      }));
      // Sort latest notes first
      notesData.sort(
        (a, b) =>
          new Date((b.createdAt?.seconds ?? 0) * 1000).getTime() -
          new Date((a.createdAt?.seconds ?? 0) * 1000).getTime()
      );
      setNotes(notesData);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  // Add / Update note
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

  // Edit note
  const handleEdit = (note: any) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  // Delete note
  const handleDelete = async (id: string) => {
    await deleteNote(id);
    loadNotes();
  };

  // Auto filter notes by search
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={{uri: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, Beautiful! 🌸</Text>
              <Text style={styles.subtitle}>Your thoughts are precious {user?.email?.split('@')[0]}</Text>
            </View>
            <TouchableOpacity onPress={logoutUser} style={styles.avatar}>
              <Ionicons name="flower-outline" size={24} color="#FF6B8B" />
            </TouchableOpacity>
          </View>

          {/* 🔍 Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#FF6B8B" style={styles.searchIcon} />
            <TextInput
              placeholder="Search your beautiful notes..."
              placeholderTextColor="#FFA5BA"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          {/* 📝 Input fields */}
          <ScrollView style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>
              {editingId ? "✨ Edit Your Note" : "🖋 Create New Magic"}
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="pencil" size={20} color="#FF6B8B" style={styles.inputIcon} />
              <TextInput
                placeholder="Note Title"
                placeholderTextColor="#FFA5BA"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="create" size={20} color="#FF6B8B" style={styles.inputIcon} />
              <TextInput
                placeholder="Express your beautiful thoughts here..."
                placeholderTextColor="#FFA5BA"
                value={content}
                onChangeText={setContent}
                style={[styles.input, styles.contentInput]}
                multiline
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity 
              style={[styles.saveButton, (!title || !content) && styles.saveButtonDisabled]} 
              onPress={handleSave}
              disabled={!title || !content}
            >
              <Text style={styles.saveButtonText}>
                {editingId ? "Update Note ✨" : "Create Note 🌸"}
              </Text>
              <Feather name={editingId ? "check-circle" : "plus-circle"} size={20} color="#fff" />
            </TouchableOpacity>
          </ScrollView>

          {/* 📌 Notes List */}
          <Text style={styles.sectionTitle}>Your Beautiful Notes ({filteredNotes.length}) 💖</Text>
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[
                styles.noteCard,
                { backgroundColor: `hsl(${Math.floor(Math.random() * 60) + 300}, 70%, 90%)` }
              ]}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteTitleContainer}>
                    <Ionicons name="bookmark" size={16} color="#FF6B8B" />
                    <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
                  </View>
                  <Text style={styles.noteTime}>
                    {new Date(((item.createdAt?.seconds ?? 0) * 1000)).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.noteContent} numberOfLines={3}>{item.content}</Text>
                <View style={styles.noteActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                    <Ionicons name="create-outline" size={18} color="#FF6B8B" />
                    <Text style={styles.edit}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={18} color="#FF6B8B" />
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="flower-outline" size={60} color="#FFD1DC" />
                <Text style={styles.emptyStateText}>No notes yet, beautiful!</Text>
                <Text style={styles.emptyStateSubtext}>Create your first note to capture your thoughts</Text>
              </View>
            }
            style={styles.notesList}
          />
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFECF1",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: 'rgba(255, 236, 241, 0.85)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FF6B8B",
  },
  subtitle: {
    fontSize: 14,
    color: "#FF6B8B",
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 214, 224, 0.7)",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#FF6B8B",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FF6B8B',
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF6B8B",
    marginBottom: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 10,
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FF6B8B',
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: "#FF6B8B",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#FFD1DC",
  },
  saveButtonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16, 
    marginRight: 8 
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  noteTitle: { 
    fontWeight: "700", 
    fontSize: 16, 
    color: "#FF6B8B",
    marginLeft: 6,
  },
  noteTime: {
    fontSize: 12,
    color: "#FF6B8B",
    fontStyle: 'italic',
  },
  noteContent: { 
    color: "#FF6B8B", 
    lineHeight: 20,
    marginBottom: 12,
  },
  noteActions: { 
    flexDirection: "row", 
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  edit: { 
    color: "#FF6B8B", 
    marginLeft: 4,
    fontWeight: '600',
  },
  delete: { 
    color: "#FF6B8B", 
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B8B',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#FF6B8B',
    marginTop: 4,
    textAlign: 'center',
  },
});