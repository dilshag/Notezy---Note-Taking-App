// import * as ImagePicker from "expo-image-picker";
// import React, { useState } from "react";
// import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

// export default function ProfilePage() {
//   const [image, setImage] = useState<string | null>(null);

//   // pick image from gallery
//   const pickImage = async () => {
//     // ask permission
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "We need access to your gallery!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 4],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   // pick image from camera
//   const openCamera = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "We need access to your camera!");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 4],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>👤 Profile</Text>

//       {image ? (
//         <Image source={{ uri: image }} style={styles.profileImage} />
//       ) : (
//         <Text style={styles.subtitle}>No profile picture selected</Text>
//       )}

//       <View style={styles.buttonContainer}>
//         <Button title="Pick from Gallery" onPress={pickImage} />
//         <Button title="Open Camera" onPress={openCamera} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", color: "#FF6B8B", marginBottom: 20 },
//   subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
//   profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
//   buttonContainer: { flexDirection: "row", gap: 10 },
// });
