// // app/(auth)/login.tsx
// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Platform } from "react-native";
// import { useRouter } from "expo-router"; // ✅ import router
// import { login } from "../../services/authService";

// export default function LoginScreen() {
//   const router = useRouter(); //  get router instance
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       await login(email, password);
//       console.log(" Logged in");
//       router.push("/(dashboard)"); // ✅ redirect to dashboard after login
//     } catch (error: any) {
//       console.error(" Login failed:", error.message);
//     }
//   };
  
//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//       <Text style={styles.title}>Notezy</Text>
//       <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
//       <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
//         <Text style={{ marginTop: 20, textAlign: "center", color: "#4A90E2" }}>Go to Register</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: "#fff" },
//   title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, textAlign: "center", color: "#4A90E2" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 20, borderRadius: 10, backgroundColor: "#f9f9f9" },
//   button: { backgroundColor: "#4A90E2", padding: 15, borderRadius: 10 },
//   buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 }
// });



// app/(auth)/login.tsx
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { login } from "../../services/authService";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const [scaleValue] = useState(new Animated.Value(1));
  const [logoRotate] = useState(new Animated.Value(0));

  const handleLogin = async () => {
    setLoading(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ]).start();

    try {
      await login(email, password);
      router.push("/(dashboard)");
    } catch (error: any) {
      console.error("Login failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logo rotation animation
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#667eea']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Animated Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View style={[styles.logoOrbit, { transform: [{ rotate: rotateInterpolate }] }]}>
              <View style={styles.orbitDot1} />
              <View style={styles.orbitDot2} />
              <View style={styles.orbitDot3} />
            </Animated.View>
            
            <View style={styles.mainLogo}>
              <FontAwesome5 name="feather-alt" size={50} color="#FFFFFF" />
              <View style={styles.logoGlow} />
            </View>
            
            <Text style={styles.appName}>Notezy</Text>
            <Text style={styles.appTagline}>Your thoughts, beautifully organized</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <Text style={styles.welcomeTitle}>Welcome Back ✨</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to continue your journey</Text>
            
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={22} color="#764ba2" style={styles.inputIcon} />
              <TextInput 
                placeholder="Email address"
                placeholderTextColor="#a0a0a0"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={22} color="#764ba2" style={styles.inputIcon} />
              <TextInput 
                placeholder="Password"
                placeholderTextColor="#a0a0a0"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color="#764ba2" 
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <Ionicons name="refresh" size={20} color="#FFFFFF" />
                  ) : (
                    <Ionicons name="log-in" size={20} color="#FFFFFF" />
                  )}
                  <Text style={styles.buttonText}>
                    {loading ? "Signing In..." : "Sign In to Notezy"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>New here?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.registerText}>Create your free account</Text>
              <Ionicons name="arrow-forward" size={18} color="#667eea" />
            </TouchableOpacity>
          </View>

          {/* Original Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ for productive minds</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  logoOrbit: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitDot1: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
  orbitDot2: {
    position: 'absolute',
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  orbitDot3: {
    position: 'absolute',
    bottom: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  mainLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 15,
  },
  loginButton: {
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 15,
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#718096',
    fontWeight: '500',
    fontSize: 14,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#f7fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  registerText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
});

// Installation command
// npx expo install expo-linear-gradient