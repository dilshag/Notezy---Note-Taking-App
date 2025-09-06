// app/(dashboard)/index.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome {user?.email}</Text>
      <Button title="Logout" onPress={logoutUser} />
    </View>
  );
}
