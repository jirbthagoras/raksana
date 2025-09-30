import { Colors, Fonts } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoadingOverlay from '@/components/Screens/LoadingComponent';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegisterLoading } = useAuth();
  const { showPopUp } = useError();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dismiss keyboard when loading starts
  useEffect(() => {
    if (isRegisterLoading) {
      Keyboard.dismiss();
    }
  }, [isRegisterLoading]);

  const handleRegister = async () => {
    if (!email || !username || !name || !password || !confirmPassword) {
      showPopUp('Mohon isi semua field', 'Input Required', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showPopUp('Password dan konfirmasi password tidak sama', 'Password Mismatch', 'warning');
      return;
    }

    if (password.length < 6) {
      showPopUp('Password minimal 6 karakter', 'Password Too Short', 'warning');
      return;
    }

    try {
      const result = await register({ email, username, name, password, password_confirmation: confirmPassword });
      if (result?.user && result?.token) {
        showPopUp('Registrasi berhasil! Selamat datang di Raksana!', 'Registration Successful', "info");
        setTimeout(() => router.replace('/onboarding'), 1500);
      }
    } catch (error: any) {
      showPopUp(error.message || 'Terjadi kesalahan saat registrasi', 'Registrasi Gagal', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Registrasi</Text>
          <Text style={styles.subtitle}>Bergabung dengan Raksana, jadilah Eco Centric.</Text>
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

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.onSurfaceVariant}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor={Colors.onSurfaceVariant}
          />

          <Text style={styles.label}>Password</Text>
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

          <Text style={[styles.label, {marginTop: 10}]}>Konfirmasi Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, { flex: 1, marginBottom: 0, paddingRight: 44 }]}
              placeholder="••••••••"
              placeholderTextColor={Colors.onSurfaceVariant}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, isRegisterLoading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={isRegisterLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isRegisterLoading ? 'Memproses...' : 'Daftar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryLink} onPress={() => router.push('/login')}>
            <Text style={styles.secondaryLinkText}>Sudah ada akun? Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/')}>
          <Ionicons name="chevron-back" size={20} color={Colors.secondary} />
          <Text style={styles.backLinkText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <LoadingOverlay visible={isRegisterLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 40,
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
