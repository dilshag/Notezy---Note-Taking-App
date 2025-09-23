
// app/(dashboard)/notes.tsximport { Feather, Ionicons } from "@expo/vector-icons";
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
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { uploadToCloudinary } from "../../services/cloudinaryService";
import { addNote } from "../../services/noteService";

export default function Home() {
  const { user, logoutUser } = useAuth();
 const router = useRouter();
  // 🔑 State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);

  // Reminder state
  const [reminderDate, setReminderDate] = useState<Date | null>(null);

  const categories = ["Personal", "Work", "Study", "Ideas", "Other"];



  // 📷 Pick Image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  // 📄 Pick File (Fixed)
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("File picking canceled");
        return;
      }

      const pickedFileUri = result.assets[0].uri;
      console.log("Picked file:", result.assets[0].name);
      setFile(pickedFileUri);
    } catch (err) {
      console.error("Error picking file:", err);
    }
  };



// ⏰ Pick Reminder (Date + Time)
  const pickReminder = () => {
    DateTimePickerAndroid.open({
      value: reminderDate || new Date(),
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
                setReminderDate(finalDate);
              }
            },
          });
        }
      },
    });
  };



  // 💾 Save Note (Uploads first)
  const handleSave = async () => {
    if (!title || !content || !user?.uid) return;

    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    let fileUrl: string | null = null;

    try {
      if (image) {
        const uploadedImageUrl = await uploadToCloudinary(image, "image");
        console.log("Image URL to save:", uploadedImageUrl);
        imageUrl = uploadedImageUrl;
      }

      if (video) {
        const uploadedVideoUrl = await uploadToCloudinary(video, "video");
        console.log("Video URL to save:", uploadedVideoUrl);
        videoUrl = uploadedVideoUrl;
      }

      if (file) {
        const uploadedFileUrl = await uploadToCloudinary(file, "file");
        console.log("File URL to save:", uploadedFileUrl);
        fileUrl = uploadedFileUrl;
      }

      const noteId = await addNote(
        user.uid,
        title,
        content,
        category,
        imageUrl,
        videoUrl,
        fileUrl,
        reminderDate // Save reminder
      );
      console.log("Note saved with ID:", noteId);

// Schedule Notification
      if (reminderDate) {
        await scheduleNotification(`Reminder: ${title}`, content, reminderDate);
        Alert.alert("✅ Reminder set!", `Notification at: ${reminderDate.toLocaleString()}`);
      }



      // ✅ Reset all fields after save
      setTitle("");
      setContent("");
      setCategory("Personal");
      setImage(null);
      setVideo(null);
      setFile(null);
      setReminderDate(null);
      Alert.alert("Note saved successfully!");
    } catch (err) {
      console.error("Upload or save failed:", err);
       Alert.alert("Error saving note.");
    }
  };

  return (
    <ScrollView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.email?.split("@")[0]} 🌸</Text>
          <Text style={styles.subtitle}>Your thoughts are precious!</Text>
        </View>
        <TouchableOpacity onPress={logoutUser} style={styles.avatar}>
          <Ionicons name="flower-outline" size={24} color="#FF6B8B" />
        </TouchableOpacity>
      </View>

      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, category === cat && styles.categoryButtonSelected]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inputs */}
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

      {/* Attachments */}
      <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
        <TouchableOpacity onPress={pickImage}><Text style={{ color: "#FF6B8B" }}>Add Image</Text></TouchableOpacity>
        <TouchableOpacity onPress={pickVideo}><Text style={{ color: "#FF6B8B" }}>Add Video</Text></TouchableOpacity>
        <TouchableOpacity onPress={pickFile}><Text style={{ color: "#FF6B8B" }}>Add File</Text></TouchableOpacity>
        <TouchableOpacity onPress={pickReminder}><Text style={{ color: "#FF6B8B" }}>Add Reminder</Text></TouchableOpacity>
      </View>

      {/* Preview Attachments */}
      {image && <Image source={{ uri: image }} style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 8 }} />}
      {video && <Video source={{ uri: video }} style={{ width: "100%", height: 200, marginBottom: 8 }} useNativeControls resizeMode={ResizeMode.CONTAIN} />}
      {file && <Text style={{ color: "#FF6B8B", marginBottom: 8 }}>📄 File: {file.split("/").pop()}</Text>}
      {/* {reminderDate && <Text style={{ color: "#FF6B8B", marginBottom: 8 }}>⏰ Reminder: {reminderDate.toLocaleString()}</Text>} */}
      {reminderDate && (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "rgba(255,255,255,0.6)",
      padding: 8,
      borderRadius: 10,
      marginBottom: 8,
    }}
  >
    <Text style={{ color: "#FF6B8B", flex: 1 }}>
      ⏰ Reminder: {reminderDate.toLocaleString()}
    </Text>

    {/* Cancel Reminder Button */}
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          "Remove Reminder?",
          "Are you sure you want to remove this reminder?",
          [
            { text: "No" },
            { text: "Yes", onPress: () => setReminderDate(null) },
          ]
        )
      }
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#FF6B8B",
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>Cancel</Text>
    </TouchableOpacity>
  </View>
)}





      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, (!title || !content) && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!title || !content}
      >
        <Text style={styles.saveButtonText}>Create Note 🌸</Text>
        <Feather name="plus-circle" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, padding: 20, backgroundColor: "#FFECF1" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 26, fontWeight: "700", color: "#FF6B8B" },
  subtitle: { fontSize: 14, color: "#FF6B8B", marginTop: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,214,224,0.7)", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#FF6B8B" },
  categoryContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  categoryButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.7)", marginRight: 8, marginBottom: 6 },
  categoryButtonSelected: { backgroundColor: "#FF6B8B" },
  categoryText: { color: "#FF6B8B", fontWeight: "600" },
  categoryTextSelected: { color: "#fff" },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 20, marginBottom: 12, paddingHorizontal: 10 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#FF6B8B" },
  contentInput: { height: 120, textAlignVertical: "top" },
  saveButton: { backgroundColor: "#FF6B8B", padding: 16, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", marginTop: 10 },
  saveButtonDisabled: { backgroundColor: "#FFD1DC" },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16, marginRight: 8 },
});