// app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router"; // ✅ import router
import { login } from "../../services/authService";

export default function LoginScreen() {
  const router = useRouter(); // ✅ get router instance
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      console.log("✅ Logged in");
      router.push("/(dashboard)"); // ✅ redirect to dashboard after login
    } catch (error: any) {
      console.error("❌ Login failed:", error.message);
    }
  };
  
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.title}>Notezy</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={{ marginTop: 20, textAlign: "center", color: "#4A90E2" }}>Go to Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, textAlign: "center", color: "#4A90E2" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 20, borderRadius: 10, backgroundColor: "#f9f9f9" },
  button: { backgroundColor: "#4A90E2", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 }
});