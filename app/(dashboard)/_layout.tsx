import { useThemeContext } from "@/context/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";

const tabs = [
  { label: "Home", name: "index", icon: "home" },
  { label: "Notes", name: "notes", icon: "note" },
  { label: "Profile", name: "profile", icon: "person" },
];

const DashboardLayout = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: isDark ? "#64748B" : "#94A3B8",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderTopColor: isDark ? "#334155" : "#E2E8F0",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      {tabs.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icon as any} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;