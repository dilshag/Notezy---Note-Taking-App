// app/(auth)/register.tsx
import React, { useState } from "react";
import {  Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router"; // ✅ import router
import { register } from "../../services/authService";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
  const router = useRouter(); // ✅ get router instance
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(email, password);
      console.log("✅ User registered");
      router.push("/(auth)/login"); // ✅ redirect to login after registration
    } catch (error: any) {
      console.error("❌ Registration failed:", error.message);
    }
  };

  
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {/* Gradient Button */}
      <TouchableOpacity style={{ width: "100%", borderRadius: 10, overflow: "hidden" }} onPress={handleRegister}>
        <LinearGradient
          colors={["#f394c0ff", "#e421c3ff", "#ce6abdff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={{ marginTop: 20, textAlign: "center", color: "#f394c0ff", fontWeight: "bold" }}>Go to Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, textAlign: "center", color: "#f394c0ff" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 20, borderRadius: 10, backgroundColor: "#f9f9f9" },
  button: { padding: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});