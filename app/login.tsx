import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import { Colors, COLORS } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { IconSymbol } from '../components/ui/icon-symbol';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login({ email, password });
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={[styles.headerSection, { backgroundColor: COLORS.primary }]}>
          <View style={styles.logoCircle}>
            <IconSymbol name="person.2.fill" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>Panchal Samaj</Text>
          <Text style={styles.headerSubtitle}>Community Portal</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back!</Text>
          <Text style={[styles.instructionText, { color: colors.icon }]}>Please login to your account</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <IconSymbol name="envelope.fill" size={20} color={colors.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <IconSymbol name="lock.fill" size={20} color={colors.icon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <IconSymbol name={showPassword ? "eye.slash.fill" : "eye.fill"} size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Reset Password', 'Verification code will be sent to your email.')}
          >
            <Text style={[styles.forgotPasswordText, { color: COLORS.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: COLORS.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.icon }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => Alert.alert('Join Us', 'Please contact community admin for registration.')}>
              <Text style={[styles.signUpText, { color: COLORS.primary }]}>Join Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  formCard: {
    flex: 1,
    marginTop: -40,
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 16,
  },
  loginButton: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -10,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
