import LoadingOverlay from '@/components/Screens/LoadingComponent';
import { Colors, Fonts } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { ErrorProvider, useError } from '../contexts/ErrorContext';

export default function LoginScreen() {
  const router = useRouter();
  const segments = useSegments();
  const { login, isLoginLoading } = useAuth();
  const { showPopUp } = useError();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dismiss keyboard when loading starts
  useEffect(() => {
    if (isLoginLoading) {
      Keyboard.dismiss();
    }
  }, [isLoginLoading]);

  // Debug current route

  const handleLogin = async () => {
    if (!email || !password) {
      showPopUp('Mohon isi email dan password', 'Input Required', 'warning');
      return;
    }

    console.log('Login: Starting login process');
    try {
      await login({ email, password });
    } catch (error: any) {
      showPopUp(error.message || 'Terjadi kesalahan saat login', 'Login Gagal', 'error');
    }
  };

  return (
    <ErrorProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Masuk</Text>
        <Text style={styles.subtitle}>Lanjutkan perjalanan-mu di Raksana.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="contoh@email.com"
          placeholderTextColor={Colors.onSurfaceVariant}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { flex: 1, marginBottom: 0, paddingRight: 44 }]}
            placeholder="••••••••"
            placeholderTextColor={Colors.onSurfaceVariant}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, isLoginLoading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={isLoginLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoginLoading ? 'Memproses...' : 'Masuk'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryLink} onPress={() => router.push('/register')}>
          <Text style={styles.secondaryLinkText}>Belum punya akun? Daftar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/')}>
        <Ionicons name="chevron-back" size={20} color={Colors.secondary} />
        <Text style={styles.backLinkText}>Kembali</Text>
      </TouchableOpacity>
      
      <LoadingOverlay visible={isLoginLoading} />
    </SafeAreaView>
    </ErrorProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    marginTop: 20
  },
  header: {
    paddingTop: 32,
    paddingBottom: 12,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 6,
  },
  form: {
    marginTop: 24,
  },
  label: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onBackground,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
    marginBottom: 12,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: Colors.surfaceVariant,
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: Fonts.display.medium,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  secondaryLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryLinkText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  backLinkText: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.secondary,
  },
});
