// app/(dashboard)/notes.tsx
import { useThemeContext } from "@/context/ThemeContext";
import { scheduleNotification } from "@/services/notificationService";
import { Feather, Ionicons } from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { uploadToCloudinary } from "../../services/cloudinaryService";
import { addNote } from "../../services/noteService";

const { width } = Dimensions.get('window');

export default function Home() {
  const { theme } = useThemeContext();
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  
  // 🔑 State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const categories = [
    { name: "Personal", icon: "person-outline", color: "#6366F1" },
    { name: "Work", icon: "briefcase-outline", color: "#10B981" },
    { name: "Study", icon: "school-outline", color: "#F59E0B" },
    { name: "Ideas", icon: "bulb-outline", color: "#8B5CF6" },
    { name: "Other", icon: "ellipsis-horizontal", color: "#6B7280" }
  ];

  // Color palette
  const colors = {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#10B981",
    background: theme === "dark" ? "#0F172A" : "#F8FAFC",
    card: theme === "dark" ? "#1E293B" : "#FFFFFF",
    text: theme === "dark" ? "#F1F5F9" : "#334155",
    textMuted: theme === "dark" ? "#94A3B8" : "#64748B",
    border: theme === "dark" ? "#334155" : "#E2E8F0",
  };

  // 📷 Pick Image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // 🎥 Pick Video
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled) setVideo(result.assets[0].uri);
  };

  // 📄 Pick File
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });
      if (!result.canceled) setFile(result.assets[0].uri);
    } catch (err) {
      console.error("Error picking file:", err);
    }
  };

  // ⏰ Pick Reminder
  const pickReminder = () => {
    DateTimePickerAndroid.open({
      value: reminderDate || new Date(),
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
                setReminderDate(finalDate);
              }
            },
          });
        }
      },
    });
  };

  // 💾 Save Note
  const handleSave = async () => {
    if (!title || !content || !user?.uid) return;

    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    let fileUrl: string | null = null;

    try {
      if (image) imageUrl = await uploadToCloudinary(image, "image");
      if (video) videoUrl = await uploadToCloudinary(video, "video");
      if (file) fileUrl = await uploadToCloudinary(file, "file");

      const noteId = await addNote(
        user.uid,
        title,
        content,
        category,
        imageUrl,
        videoUrl,
        fileUrl,
        reminderDate
      );

      if (reminderDate) {
        await scheduleNotification(`Reminder: ${title}`, content, reminderDate);
        Alert.alert("✅ Reminder set!", `Notification at: ${reminderDate.toLocaleString()}`);
      }

      // Reset form
      setTitle("");
      setContent("");
      setCategory("Personal");
      setImage(null);
      setVideo(null);
      setFile(null);
      setReminderDate(null);
      setResetKey(prev => prev + 1);
      
      Alert.alert("Success", "Note saved successfully!");
    } catch (err) {
      console.error("Upload or save failed:", err);
      Alert.alert("Error", "Failed to save note.");
    }
  };

  const currentCategory = categories.find(cat => cat.name === category);

  return (
    <ScrollView
      key={resetKey}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeTextContainer}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome back, {user?.email?.split("@")[0]}! 👋
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>
            Ready to capture your thoughts?
          </Text>
        </View>
        <TouchableOpacity 
          onPress={logoutUser} 
          style={[styles.avatar, { backgroundColor: colors.card }]}
        >
          <Ionicons name="person" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Notes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.accent }]}>3</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Reminders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>5</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Categories</Text>
        </View>
      </View>

      {/* Category Selector */}
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
              styles.categoryButton,
              { 
                backgroundColor: category === cat.name ? cat.color : colors.card,
                borderColor: colors.border
              }
            ]}
            onPress={() => setCategory(cat.name)}
          >
            <Ionicons 
              name={cat.icon as any} 
              size={20} 
              color={category === cat.name ? "#FFFFFF" : cat.color} 
            />
            <Text style={[
              styles.categoryText,
              { color: category === cat.name ? "#FFFFFF" : colors.text }
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Note Form */}
      <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="pencil" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            placeholder="Note Title"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }]}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="create" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            placeholder="Start writing your thoughts here..."
            placeholderTextColor={colors.textMuted}
            value={content}
            onChangeText={setContent}
            style={[styles.input, styles.contentInput, { color: colors.text }]}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Attachment Buttons */}
        <View style={styles.attachmentContainer}>
          <TouchableOpacity style={styles.attachmentButton} onPress={pickImage}>
            <Ionicons name="image" size={20} color={colors.primary} />
            <Text style={[styles.attachmentText, { color: colors.text }]}>Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachmentButton} onPress={pickVideo}>
            <Ionicons name="videocam" size={20} color={colors.primary} />
            <Text style={[styles.attachmentText, { color: colors.text }]}>Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachmentButton} onPress={pickFile}>
            <Ionicons name="document" size={20} color={colors.primary} />
            <Text style={[styles.attachmentText, { color: colors.text }]}>File</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.attachmentButton} onPress={pickReminder}>
            <Ionicons name="notifications" size={20} color={colors.primary} />
            <Text style={[styles.attachmentText, { color: colors.text }]}>Reminder</Text>
          </TouchableOpacity>
        </View>

        {/* Preview Attachments */}
        {image && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {video && (
          <View style={styles.previewContainer}>
            <Video 
              source={{ uri: video }} 
              style={styles.previewVideo} 
              useNativeControls 
              resizeMode={ResizeMode.CONTAIN} 
            />
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => setVideo(null)}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {file && (
          <View style={[styles.filePreview, { backgroundColor: colors.background }]}>
            <Ionicons name="document" size={24} color={colors.primary} />
            <Text style={[styles.fileText, { color: colors.text }]} numberOfLines={1}>
              {file.split("/").pop()}
            </Text>
            <TouchableOpacity onPress={() => setFile(null)}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {reminderDate && (
          <View style={[styles.reminderPreview, { backgroundColor: colors.background }]}>
            <Ionicons name="time" size={20} color={colors.accent} />
            <Text style={[styles.reminderText, { color: colors.text }]}>
              ⏰ {reminderDate.toLocaleString()}
            </Text>
            <TouchableOpacity 
              onPress={() => setReminderDate(null)}
              style={styles.cancelReminderButton}
            >
              <Text style={styles.cancelReminderText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { 
              backgroundColor: (!title || !content) ? colors.border : colors.primary,
              opacity: (!title || !content) ? 0.6 : 1
            }
          ]}
          onPress={handleSave}
          disabled={!title || !content}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Create Note</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  categoryScroll: {
    marginBottom: 24,
  },
  categoryContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    minWidth: 100,
  },
  categoryText: {
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  contentInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  attachmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  attachmentButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    minWidth: 70,
  },
  attachmentText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  previewVideo: {
    width: '100%',
    height: 200,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  fileText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  reminderPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  reminderText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  cancelReminderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  cancelReminderText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#6366F1',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});