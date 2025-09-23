// // app/(auth)/register.tsx
// import React, { useState } from "react";
// import {  Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
// import { useRouter } from "expo-router"; // ✅ import router
// import { register } from "../../services/authService";
// import { LinearGradient } from "expo-linear-gradient";

// export default function RegisterScreen() {
//   const router = useRouter(); // ✅ get router instance
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async () => {
//     try {
//       await register(email, password);
//       console.log("✅ User registered");
//       router.push("/(auth)/login"); // ✅ redirect to login after registration
//     } catch (error: any) {
//       console.error("❌ Registration failed:", error.message);
//     }
//   };

  
//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//       <Text style={styles.title}>Register</Text>

//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         onChangeText={setEmail}
//         value={email}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />

//       <TextInput
//         placeholder="Password"
//         style={styles.input}
//         secureTextEntry
//         onChangeText={setPassword}
//         value={password}
//       />

//       {/* Gradient Button */}
//       <TouchableOpacity style={{ width: "100%", borderRadius: 10, overflow: "hidden" }} onPress={handleRegister}>
//         <LinearGradient
//           colors={["#f394c0ff", "#e421c3ff", "#ce6abdff"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.button}
//         >
//           <Text style={styles.buttonText}>Register</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
//         <Text style={{ marginTop: 20, textAlign: "center", color: "#f394c0ff", fontWeight: "bold" }}>Go to Login</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: "#fff" },
//   title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, textAlign: "center", color: "#f394c0ff" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 20, borderRadius: 10, backgroundColor: "#f9f9f9" },
//   button: { padding: 15, alignItems: "center" },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
// });



// app/(auth)/register.tsx
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
import { register } from "../../services/authService";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const [scaleValue] = useState(new Animated.Value(1));
  const [logoRotate] = useState(new Animated.Value(0));

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

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
      await register(email, password);
      console.log("✅ User registered");
      alert("Registration successful! Please login.");
      router.push("/(auth)/login");
    } catch (error: any) {
      console.error("❌ Registration failed:", error.message);
      alert("Registration failed: " + error.message);
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
            <Text style={styles.appTagline}>Join our community of thinkers</Text>
          </View>

          {/* Register Card */}
          <View style={styles.registerCard}>
            <Text style={styles.welcomeTitle}>Create Account 🌟</Text>
            <Text style={styles.welcomeSubtitle}>Start your note-taking journey</Text>
            
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

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={22} color="#764ba2" style={styles.inputIcon} />
              <TextInput 
                placeholder="Confirm Password"
                placeholderTextColor="#a0a0a0"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color="#764ba2" 
                />
              </TouchableOpacity>
            </View>

            {/* Password Requirements */}
            <View style={styles.requirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={password.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={password.length >= 6 ? "#10B981" : "#94A3B8"} 
                />
                <Text style={styles.requirementText}>At least 6 characters</Text>
              </View>
            </View>

            {/* Register Button */}
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <TouchableOpacity 
                style={[styles.registerButton, loading && styles.buttonDisabled]} 
                onPress={handleRegister}
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
                    <Ionicons name="person-add" size={20} color="#FFFFFF" />
                  )}
                  <Text style={styles.buttonText}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Already have an account?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.loginText}>Sign in to your account</Text>
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
  registerCard: {
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
    marginBottom: 15,
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
  requirements: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
  registerButton: {
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
  loginButton: {
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
  loginText: {
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