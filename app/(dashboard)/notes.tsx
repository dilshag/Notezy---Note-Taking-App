import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Notes</Text>
      <Text style={styles.subtitle}>Here you can manage your notes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#FF6B8B" },
  subtitle: { fontSize: 16, color: "#555", marginTop: 10 },
});
