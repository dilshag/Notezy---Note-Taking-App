import { useThemeContext } from "@/context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const tabs = [
  { label: "Home", name: "index", icon: "home" },
  { label: "Notes", name: "notes", icon: "note" },
  { label: "Profile", name: "profile", icon: "person" },
];

const DashboardLayout = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const colors = {
    primary: "#6366F1",
    primaryLight: "rgba(99, 102, 241, 0.1)",
    background: isDark ? "#0F172A" : "#FFFFFF",
    card: isDark ? "#1E293B" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#334155",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#334155" : "#E2E8F0",
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: isDark ? "#000" : "#6366F1",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: isDark ? 0.8 : 0.1,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 6,
        },
      }}
    >
      {tabs.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, size, focused }) => (
              <View 
                style={{
                  backgroundColor: focused ? colors.primaryLight : 'transparent',
                  padding: 8,
                  borderRadius: 12,
                  marginTop: 4,
                }}
              >
                <MaterialIcons 
                  name={icon as any} 
                  color={color} 
                  size={focused ? 26 : 24} 
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;