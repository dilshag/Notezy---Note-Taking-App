import { Ionicons } from "@expo/vector-icons"
import { useRouter, useSegments } from "expo-router"
import React from "react"
import { Pressable, Text, View } from "react-native"

const tabs = [
  { 
    label: "Home", 
    path: "/home",
    icon: "home-outline",
    activeIcon: "home",
    color: "#6366F1"
  },
  { 
    label: "Notes", 
    path: "/notes",
    icon: "document-text-outline",
    activeIcon: "document-text",
    color: "#10B981"
  },
  { 
    label: "Profile", 
    path: "/profile",
    icon: "person-outline",
    activeIcon: "person",
    color: "#8B5CF6"
  }
] as const

const FooterNav = () => {
  const router = useRouter()
  const segment = useSegments()
  const activeRoute = "/" + (segment[0] || "")

  return (
    <View className="flex-row justify-around items-center border-t border-gray-100 py-3 bg-white shadow-xl">
      {tabs.map((data, index) => {
        const isActive = data.path === activeRoute
        
        return (
          <Pressable
            key={index}
            className={`flex-1 items-center justify-center py-3 mx-1 rounded-2xl ${
              isActive ? "bg-blue-50 border border-blue-100" : ""
            }`}
            onPress={() => {
              router.push(data.path)
            }}
          >
            <View className={`p-2 rounded-full ${isActive ? "bg-blue-100" : ""}`}>
              <Ionicons 
                name={isActive ? data.activeIcon : data.icon} 
                size={22} 
                color={isActive ? data.color : "#94A3B8"} 
              />
            </View>
            <Text 
              className={`text-xs font-semibold mt-1 ${
                isActive ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {data.label}
            </Text>
            
            {/* Active indicator dot */}
            {isActive && (
              <View 
                className="w-1 h-1 rounded-full mt-1"
                style={{ backgroundColor: data.color }}
              />
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

export default FooterNav