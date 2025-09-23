// app/(dashboard)/notes.tsx
import { useThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { deleteNote, getNotes, updateNote } from "../../services/noteService";
import { cancelNotification, scheduleNotification } from "../../services/notificationService";
import { Note } from "../../types/note";
export default function NotesPage() {

     const { theme } = useThemeContext();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [editReminder, setEditReminder] = useState<Date | null>(null);

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
        reminder: note.reminderDate ? new Date(note.reminderDate) : null,

      }));
      setNotes(notesData);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);


// 🔧 Pick/Edit Reminder
  const pickReminder = (currentReminder: Date | null, callback: (newDate: Date) => void) => {
    const initDate = currentReminder || new Date();
    DateTimePickerAndroid.open({
      value: initDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const pickedDate = selectedDate;
          DateTimePickerAndroid.open({
            value: pickedDate,
            mode: "time",
            is24Hour: true,
            onChange: (event, selectedTime) => {
              if (selectedTime) {
                const finalDate = new Date(
                  pickedDate.getFullYear(),
                  pickedDate.getMonth(),
                  pickedDate.getDate(),
                  selectedTime.getHours(),
                  selectedTime.getMinutes()
                );
                callback(finalDate);
              }
            },
          });
        }
      },
    });
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditReminder(note.reminderDate || null);
  };

  const handleSaveEdit = async (id: string) => {
  if (!editTitle || !editContent) return;

  const existingNote = notes.find((n) => n.id === id);
  let newReminderId: string | null = existingNote?.reminderId || null;

  if (editReminder) {
    // Schedule or update reminder
    newReminderId = await scheduleNotification(`Reminder: ${editTitle}`, editContent, editReminder);
  } else if (existingNote?.reminderId) {
    // Cancel old reminder if removed
    await cancelNotification(existingNote.reminderId);
    newReminderId = null;
  }

  await updateNote(
    id,
    editTitle,
    editContent,
    existingNote?.category || "Other",
    editReminder,
    newReminderId // 🆕 Save reminder ID
  );

  setEditingId(null);
  setEditTitle("");
  setEditContent("");
  setEditReminder(null);
  loadNotes();
};


const handleDelete = async (id: string) => {
  const noteToDelete = notes.find((n) => n.id === id);
  if (noteToDelete?.reminderId) {
    await cancelNotification(noteToDelete.reminderId); // cancel this note's reminder only
  }
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme === "dark" ? "#121212" : "#FFECF1" }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <Text style={[styles.title, { color: theme === "dark" ? "#fff" : "#FF6B8B" }]}>📝 Notes</Text>
        <Button title="Add Note" onPress={() => router.push("./index")} color="#FF6B8B" />
      </View>

      <TextInput
        placeholder="Search notes..."
        placeholderTextColor="#FFA5BA"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

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
      placeholder="Edit title"
      placeholderTextColor="#FFA5BA"
    />
    <TextInput
      style={[styles.input, { height: 60 }]}
      value={editContent}
      onChangeText={setEditContent}
      placeholder="Edit content"
      placeholderTextColor="#FFA5BA"
      multiline
    />

    {/* 🔧 Reminder Picker + Cancel */}
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
      <TouchableOpacity onPress={() => pickReminder(editReminder, setEditReminder)}>
        <Text style={{ color: "#FF6B8B" }}>
          {editReminder ? `⏰ Reminder: ${editReminder.toLocaleString()}` : "Add Reminder"}
        </Text>
      </TouchableOpacity>

      {editReminder && (
        <TouchableOpacity
          onPress={() =>
            setEditReminder(null)
          }
          style={{
            backgroundColor: "#FF6B8B",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>

    {/* Save / Cancel Buttons */}
    <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
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

                {item.reminderDate && <Text style={{ marginTop: 4, color: "#FF6B8B" }}>⏰ Reminder: {item.reminderDate.toLocaleString()}</Text>}

                {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 8 }} />}
                {item.videoUrl && <Video source={{ uri: item.videoUrl }} style={{ width: "100%", height: 200, marginTop: 8 }} useNativeControls resizeMode={ResizeMode.CONTAIN} />}
                {item.fileUrl && <Text style={{ marginTop: 8 }}>📄 File: {item.fileUrl.split("/").pop()}</Text>}

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
  title: { fontSize: 24, fontWeight: "700", color: "#FF6B8B" },
  searchInput: { backgroundColor: "#FFF", padding: 12, borderRadius: 20, marginBottom: 16, color: "#FF6B8B" },
  input: { backgroundColor: "#FFF", padding: 12, borderRadius: 12, marginBottom: 8, color: "#FF6B8B" },
  noteCard: { padding: 12, borderRadius: 16, marginBottom: 12 },
  noteHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  noteTitle: { fontWeight: "700", fontSize: 16, color: "#FF6B8B" },
  noteCategory: { fontSize: 12, color: "#FF6B8B", fontStyle: "italic" },
  noteContent: { fontSize: 14, color: "#FF6B8B" },
  noteActions: { flexDirection: "row", marginTop: 8, gap: 16 },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#FF6B8B" },
});