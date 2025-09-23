import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";
import { auth, db } from "@/firebase";
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { uploadToCloudinary } from "../../services/cloudinaryService";

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme, loading: themeLoading } = useThemeContext();

  const isDark = theme === "dark";

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);

  // Color palette
  const colors = {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#10B981",
    background: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#334155",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#334155" : "#E2E8F0",
  };

  // Load current profile image from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data?.profileImage) setImage(data.profileImage);
          if (data?.displayName) setDisplayName(data.displayName);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  // Password Management
  const handleChangePassword = async () => {
    Alert.prompt(
      "Change Password",
      "Enter your new password",
      async (newPassword) => {
        if (!newPassword) return;
        try {
          if (auth.currentUser) {
            await updatePassword(auth.currentUser, newPassword);
            Alert.alert("✅ Password Updated", "Your password has been changed successfully.");
          }
        } catch (error: any) {
          Alert.alert("Error", error.message);
        }
      }
    );
  };

  const handleResetPassword = async () => {
    try {
      if (!user?.email) return;
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert("📧 Email Sent", "Check your inbox to reset your password.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your gallery!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadProfileImage(result.assets[0].uri);
    }
  };

  // Pick image from camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadProfileImage(result.assets[0].uri);
    }
  };

  const saveDisplayName = async () => {
    if (!user?.uid) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
      });
      Alert.alert("✅ Success", "Your display name has been updated!");
      setEditingName(false);
    } catch (err) {
      console.error("Failed to update name:", err);
      Alert.alert("Error", "Could not update your name. Try again.");
    }
  };

  // Upload to Cloudinary & save URL to Firestore
  const uploadProfileImage = async (uri: string) => {
    if (!user?.uid) return;
    setUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(uri, "image");
      setImage(uploadedUrl);
      await updateDoc(doc(db, "users", user.uid), { profileImage: uploadedUrl });
      Alert.alert("✨ Success", "Your profile picture has been updated!");
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload failed", "Could not upload profile image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logoutUser }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Profile Settings
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Manage your account and preferences
            </Text>
          </View>
          <View style={[styles.themeIndicator, { backgroundColor: colors.card }]}>
            <Ionicons 
              name={isDark ? "moon" : "sunny"} 
              size={16} 
              color={colors.primary} 
            />
            <Text style={[styles.themeText, { color: colors.text }]}>
              {themeLoading ? "..." : isDark ? "Dark" : "Light"}
            </Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <View style={styles.imageContainer}>
              {uploading ? (
                <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.uploadingText, { color: colors.textMuted }]}>
                    Uploading...
                  </Text>
                </View>
              ) : image ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.profileImage} />
                  <TouchableOpacity 
                    style={[styles.editImageButton, { backgroundColor: colors.primary }]} 
                    onPress={pickImage}
                  >
                    <Ionicons name="camera" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.placeholderContainer, { backgroundColor: colors.background }]}>
                  <Ionicons name="person" size={48} color={colors.textMuted} />
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              {editingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textMuted}
                  />
                  <View style={styles.nameEditActions}>
                    <TouchableOpacity 
                      style={[styles.saveNameButton, { backgroundColor: colors.primary }]} 
                      onPress={saveDisplayName}
                    >
                      <Text style={styles.saveNameButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.cancelNameButton, { borderColor: colors.border }]} 
                      onPress={() => setEditingName(false)}
                    >
                      <Text style={[styles.cancelNameButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditingName(true)} style={styles.nameContainer}>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {displayName || user?.email?.split('@')[0] || "User"}
                  </Text>
                  <Ionicons name="pencil" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: colors.background }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>∞</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Notes</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={[styles.statItem, { backgroundColor: colors.background }]}>
              <Text style={[styles.statNumber, { color: colors.accent }]}>100%</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Active</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={[styles.statItem, { backgroundColor: colors.background }]}>
              <Text style={[styles.statNumber, { color: colors.secondary }]}>⭐</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Pro</Text>
            </View>
          </View>
        </View>

        {/* Photo Actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Update Profile Photo</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]} 
              onPress={pickImage}
              disabled={uploading}
            >
              <Ionicons name="images" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.secondary }]} 
              onPress={openCamera}
              disabled={uploading}
            >
              <Ionicons name="camera" size={20} color="#FFF" />
              <Text style={styles.actionButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Security</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="key" size={20} color={colors.accent} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Change Password</Text>
              <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                Update your current password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleResetPassword}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Ionicons name="mail" size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Reset Password</Text>
              <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                Send password reset email
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Appearance Settings */}
        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={toggleTheme}
            disabled={themeLoading}
          >
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={colors.secondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.settingDescription, { color: colors.textMuted }]}>
                {themeLoading ? "Loading..." : `Current: ${isDark ? "Dark" : "Light"}`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Feather name="info" size={24} color={colors.primary} />
          <Text style={[styles.infoTitle, { color: colors.text }]}>Notezy App</Text>
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            Capture your thoughts, organize your ideas, and stay productive with our elegant note-taking solution.
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={[styles.logoutText, { color: "#EF4444" }]}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Made with ❤️ for productive minds
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 15,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 16,
  },
  loadingContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#E2E8F0',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  placeholderContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  nameEditContainer: {
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  nameEditActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveNameButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveNameButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelNameButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelNameButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    marginVertical: 8,
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  settingsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});