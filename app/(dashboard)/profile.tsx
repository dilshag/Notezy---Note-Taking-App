// import { useAuth } from "@/context/AuthContext";
// import { db } from "@/firebase";
// import * as ImagePicker from "expo-image-picker";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// //import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
// // app/(dashboard)/profile.tsx
// import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from "react-native";
// import { uploadToCloudinary } from "../../services/cloudinaryService";

// export default function ProfilePage() {
//   const { user, logoutUser } = useAuth();
//   const [image, setImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Load current profile image from Firestore
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user?.uid) return;

//       try {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           if (data?.profileImage) setImage(data.profileImage);
//         }
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       }
//     };

//     fetchProfile();
//   }, [user]);

//   // Pick image from gallery
//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "We need access to your gallery!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       await uploadProfileImage(result.assets[0].uri);
//     }
//   };

//   // Pick image from camera
//   const openCamera = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "We need access to your camera!");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       await uploadProfileImage(result.assets[0].uri);
//     }
//   };

//   // Upload to Cloudinary & save URL to Firestore
//   const uploadProfileImage = async (uri: string) => {
//     if (!user?.uid) return;
//     setLoading(true);

//     try {
//       // Upload to Cloudinary
//       const uploadedUrl = await uploadToCloudinary(uri, "image");
//       setImage(uploadedUrl);

//       // Save URL to Firestore
//       await updateDoc(doc(db, "users", user.uid), { profileImage: uploadedUrl });
//       Alert.alert("Success", "Profile image updated!");
//     } catch (err) {
//       console.error("Upload error:", err);
//       Alert.alert("Upload failed", "Could not upload profile image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>👤 Profile</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#FF6B8B" style={{ marginBottom: 20 }} />
//       ) : image ? (
//         <Image source={{ uri: image }} style={styles.profileImage} />
//       ) : (
//         <Text style={styles.subtitle}>No profile picture selected</Text>
//       )}

//       <View style={styles.buttonContainer}>
//         <Button title="Pick from Gallery" onPress={pickImage} />
//         <Button title="Open Camera" onPress={openCamera} />
//       </View>

//       <View style={{ marginTop: 20 }}>
//         <Button title="Logout" onPress={logoutUser} color="#FF6B8B" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", color: "#FF6B8B", marginBottom: 20 },
//   subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
//   profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
//   buttonContainer: { flexDirection: "row", gap: 10, justifyContent: "space-between", width: "80%" },
// });
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);


  // Load current profile image from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data?.profileImage) setImage(data.profileImage);
       
          if (data?.displayName) setDisplayName(data.displayName);}
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

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
      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(uri, "image");
      setImage(uploadedUrl);

      // Save URL to Firestore
      await updateDoc(doc(db, "users", user.uid), { profileImage: uploadedUrl });
      Alert.alert("✨ Success", "Your profile picture has been updated beautifully!");
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
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={{uri: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'}}
        style={styles.backgroundImage}
        blurRadius={3}
      >
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🌸 Your Profile</Text>
            <Text style={styles.subtitle}>Make it as beautiful as you are!</Text>
          </View>

          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>
              {uploading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FF6B8B" />
                  <Text style={styles.uploadingText}>Uploading your beautiful picture...</Text>
                </View>
              ) : image ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.profileImage} />
                  <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
                    <Ionicons name="camera" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="person-circle-outline" size={120} color="#FFD1DC" />
                  <Text style={styles.placeholderText}>Add your beautiful picture</Text>
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>

              {editingName ? (
          <View style={styles.nameEditContainer}>
            <TextInput
                style={styles.nameInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
    />
    <TouchableOpacity style={styles.saveButton} onPress={saveDisplayName}>
      <Text style={styles.saveButtonText}>Save</Text>
    </TouchableOpacity>
  </View>
) : (
  <TouchableOpacity onPress={() => setEditingName(true)}>
    <Text style={styles.userName}>{displayName || "Beautiful User"}</Text>
  </TouchableOpacity>
)}

              {/* <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Beautiful User'}</Text> */}
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>∞</Text>
                  <Text style={styles.statLabel}>Beautiful Notes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>💖</Text>
                  <Text style={styles.statLabel}>Loved</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Update Your Picture</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.galleryButton]} 
                onPress={pickImage}
                disabled={uploading}
              >
                <Ionicons name="images" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.cameraButton]} 
                onPress={openCamera}
                disabled={uploading}
              >
                <Ionicons name="camera" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Take a Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Feather name="heart" size={24} color="#FF6B8B" />
              <Text style={styles.infoTitle}>Beautiful Notes App</Text>
              <Text style={styles.infoText}>
                Capture your thoughts, dreams, and beautiful moments with style and elegance.
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF6B8B" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with 💖 for beautiful minds</Text>
          </View>
        </ScrollView>
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
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF6B8B",
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FF6B8B",
    textAlign: 'center',
    opacity: 0.8,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  uploadingText: {
    marginTop: 10,
    color: "#FF6B8B",
    fontSize: 14,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#FFD1DC',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FF6B8B',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
  },
  placeholderText: {
    marginTop: 10,
    color: "#FF6B8B",
    fontSize: 14,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FF6B8B",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#FF6B8B",
    opacity: 0.7,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF6B8B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#FF6B8B",
    opacity: 0.8,
  },
  actionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B8B",
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 25,
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 10,
  },
  galleryButton: {
    backgroundColor: "#FF6B8B",
  },
  cameraButton: {
    backgroundColor: "#FF9EBD",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF6B8B",
    marginVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#FF6B8B",
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: '#FFD1DC',
    marginBottom: 20,
    gap: 8,
  },
  logoutText: {
    color: "#FF6B8B",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#FF6B8B",
    opacity: 0.6,
  },

  nameEditContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},
nameInput: {
  borderBottomWidth: 1,
  borderColor: "#FF6B8B",
  paddingVertical: 5,
  paddingHorizontal: 10,
  fontSize: 18,
  color: "#FF6B8B",
  minWidth: 180,
},
saveButton: {
  backgroundColor: "#FF6B8B",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 10,
},
saveButtonText: {
  color: "#FFF",
  fontWeight: "600",
},

});