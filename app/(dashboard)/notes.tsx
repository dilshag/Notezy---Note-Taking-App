// app/(dashboard)/notes.tsx
import { useThemeContext } from "@/context/ThemeContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { deleteNote, getNotes, updateNote } from "../../services/noteService";
import { cancelNotification, scheduleNotification } from "../../services/notificationService";
import { Note } from "../../types/note";

const { width } = Dimensions.get('window');

// Helper function to convert Firestore timestamp to Date
const convertToDate = (timestamp: any): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000);
  }
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  return new Date(); // fallback to current date
};

export default function NotesPage() {
  const { theme } = useThemeContext();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [search, setSearch] = useState("");
  const [editReminder, setEditReminder] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const router = useRouter();

  // Color palette
  const colors = {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    background: theme === "dark" ? "#0F172A" : "#F8FAFC",
    card: theme === "dark" ? "#1E293B" : "#FFFFFF",
    text: theme === "dark" ? "#F1F5F9" : "#334155",
    textMuted: theme === "dark" ? "#94A3B8" : "#64748B",
    border: theme === "dark" ? "#334155" : "#E2E8F0",
  };

  const categories = [
    { name: "All", icon: "apps", color: colors.primary },
    { name: "Personal", icon: "person", color: "#6366F1" },
    { name: "Work", icon: "briefcase", color: "#10B981" },
    { name: "Study", icon: "school", color: "#F59E0B" },
    { name: "Ideas", icon: "bulb", color: "#8B5CF6" },
    { name: "Other", icon: "ellipsis-horizontal", color: "#6B7280" }
  ];

  const categoryColors: { [key: string]: string } = {
    Personal: "rgba(99, 102, 241, 0.1)",
    Work: "rgba(16, 185, 129, 0.1)",
    Study: "rgba(245, 158, 11, 0.1)",
    Ideas: "rgba(139, 92, 246, 0.1)",
    Other: "rgba(107, 114, 128, 0.1)",
  };

  const categoryBorderColors: { [key: string]: string } = {
    Personal: "#6366F1",
    Work: "#10B981",
    Study: "#F59E0B",
    Ideas: "#8B5CF6",
    Other: "#6B7280",
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
        reminder: note.reminderDate ? convertToDate(note.reminderDate) : null,
        reminderId: note.reminderId ?? undefined,
      }));
      setNotes(notesData);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  const pickReminder = (currentReminder: Date | null, callback: (newDate: Date) => void) => {
    const initDate = currentReminder || new Date();
    DateTimePickerAndroid.open({
      value: initDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: "time",
            is24Hour: true,
            onChange: (event, selectedTime) => {
              if (selectedTime) {
                const finalDate = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate(),
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
    setEditReminder(note.reminder || null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle || !editContent) return;

    const existingNote = notes.find((n) => n.id === id);
    let newReminderId: string | null = existingNote?.reminderId || null;

    if (editReminder) {
      newReminderId = await scheduleNotification(`Reminder: ${editTitle}`, editContent, editReminder);
    } else if (existingNote?.reminderId) {
      await cancelNotification(existingNote.reminderId);
      newReminderId = null;
    }

    await updateNote(
      id,
      editTitle,
      editContent,
      existingNote?.category || "Other",
      editReminder,
      newReminderId
    );

    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditReminder(null);
    loadNotes();
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const noteToDelete = notes.find((n) => n.id === id);
            if (noteToDelete?.reminderId) {
              await cancelNotification(noteToDelete.reminderId);
            }
            await deleteNote(id);
            loadNotes();
          }
        }
      ]
    );
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const NoteCard = ({ item }: { item: Note }) => (
    <View style={[
      styles.noteCard,
      { 
        backgroundColor: colors.card,
        borderLeftWidth: 4,
        borderLeftColor: categoryBorderColors[item.category] || colors.border
      }
    ]}>
      {editingId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.editInput, { color: colors.text }]}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Note title"
            placeholderTextColor={colors.textMuted}
          />
          <TextInput
            style={[styles.editInput, styles.editContent, { color: colors.text }]}
            value={editContent}
            onChangeText={setEditContent}
            placeholder="Note content"
            placeholderTextColor={colors.textMuted}
            multiline
          />
          
          <View style={styles.reminderEditContainer}>
            <TouchableOpacity 
              style={styles.reminderButton}
              onPress={() => pickReminder(editReminder, setEditReminder)}
            >
              <Ionicons name="time-outline" size={16} color={colors.primary} />
              <Text style={[styles.reminderText, { color: colors.text }]}>
                {editReminder ? editReminder.toLocaleString() : "Set Reminder"}
              </Text>
            </TouchableOpacity>
            
            {editReminder && (
              <TouchableOpacity
                onPress={() => setEditReminder(null)}
                style={styles.removeReminderButton}
              >
                <Ionicons name="close" size={16} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.editActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]}
              onPress={() => handleSaveEdit(item.id)}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setEditingId(null)}
            >
              <Ionicons name="close" size={16} color={colors.text} />
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.noteHeader}>
            <View style={styles.titleContainer}>
              <Text style={[styles.noteTitle, { color: colors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: categoryColors[item.category] }
              ]}>
                <Text style={[
                  styles.categoryText,
                  { color: categoryBorderColors[item.category] }
                ]}>
                  {item.category}
                </Text>
              </View>
            </View>
            <Text style={[styles.noteDate, { color: colors.textMuted }]}>
              {convertToDate(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <Text style={[styles.noteContent, { color: colors.text }]} numberOfLines={3}>
            {item.content}
          </Text>

          {item.reminder && (
            <View style={styles.reminderBadge}>
              <Ionicons name="notifications" size={14} color={colors.accent} />
              <Text style={[styles.reminderText, { color: colors.accent }]}>
                {item.reminder.toLocaleString()}
              </Text>
            </View>
          )}

          {(item.imageUrl || item.videoUrl || item.fileUrl) && (
            <View style={styles.attachmentsContainer}>
              {item.imageUrl && <Ionicons name="image" size={16} color={colors.textMuted} />}
              {item.videoUrl && <Ionicons name="videocam" size={16} color={colors.textMuted} />}
              {item.fileUrl && <Ionicons name="document" size={16} color={colors.textMuted} />}
              <Text style={[styles.attachmentsText, { color: colors.textMuted }]}>
                {[item.imageUrl, item.videoUrl, item.fileUrl].filter(Boolean).length} attachment(s)
              </Text>
            </View>
          )}

          <View style={styles.noteActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="create-outline" size={18} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>My Notes</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("./index")}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>New Note</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          placeholder="Search notes..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            style={[
              styles.categoryFilterButton,
              { 
                backgroundColor: selectedCategory === cat.name ? cat.color : colors.card,
                borderColor: colors.border
              }
            ]}
            onPress={() => setSelectedCategory(cat.name)}
          >
            <Ionicons 
              name={cat.icon as any} 
              size={16} 
              color={selectedCategory === cat.name ? "#FFFFFF" : cat.color} 
            />
            <Text style={[
              styles.categoryFilterText,
              { color: selectedCategory === cat.name ? "#FFFFFF" : colors.text }
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No notes found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {search || selectedCategory !== "All" ? "Try adjusting your search or filter" : "Create your first note to get started"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContainer: {
    paddingRight: 20,
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    gap: 6,
  },
  categoryFilterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  noteCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  noteDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  reminderText: {
    fontSize: 12,
    fontWeight: '500',
  },
  attachmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  attachmentsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  editContainer: {
    gap: 12,
  },
  editInput: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    fontSize: 16,
    fontWeight: '500',
  },
  editContent: {
    height: 80,
    textAlignVertical: 'top',
  },
  reminderEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    flex: 1,
  },
  removeReminderButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});