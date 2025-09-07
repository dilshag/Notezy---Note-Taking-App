
// // app/_layout.tsx
// import { Stack } from "expo-router";
// import { AuthProvider } from "../context/AuthContext"; // adjust path if needed

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack screenOptions={{ headerShown: false }} />
//     </AuthProvider>
//   );
// }


// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}


//  Key Point:
// useAuth() call karanna puluwan only inside children of <AuthProvider>.
//  app/_layout.tsx eke wrap karanna with AuthProvider.
// Then (auth)/_layout.tsx + (dashboard)/_layout.tsx walin user check karanna.
