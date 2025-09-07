// // app/(auth)/_layout.tsx
// import { Stack, Redirect } from "expo-router";
// import { useAuth } from "../../context/AuthContext";

// export default function AuthLayout() {
//   const { user } = useAuth();

//   //  If already logged in → redirect to dashboard
//   if (user) {
//     return <Redirect href="/(dashboard)" />;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="login" />
//       <Stack.Screen name="register" />
//     </Stack>
//   );
// }


// app/(auth)/_layout.tsx
import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(dashboard)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
