import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const { showError } = useError();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !name || !password || !confirmPassword) {
      showError('Mohon isi semua field', 'Input Required', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showError('Password dan konfirmasi password tidak sama', 'Password Mismatch', 'warning');
      return;
    }

    if (password.length < 6) {
      showError('Password minimal 6 karakter', 'Password Too Short', 'warning');
      return;
    }

    try {
      const result = await register({ email, username, name, password, password_confirmation: confirmPassword });
      if (result?.success) {
        showError(result.message, 'Registration Successful', 'info');
        setTimeout(() => router.replace('/login'), 2000);
      }
    } catch (error: any) {
      showError(error.message || 'Terjadi kesalahan saat registrasi', 'Registrasi Gagal', 'error');
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
            placeholderTextColor={Colors.text.light}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.text.light}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor={Colors.text.light}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { flex: 1, marginBottom: 0, paddingRight: 44 }]}
              placeholder="••••••••"
              placeholderTextColor={Colors.text.light}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, {marginTop: 10}]}>Konfirmasi Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, { flex: 1, marginBottom: 0, paddingRight: 44 }]}
              placeholder="••••••••"
              placeholderTextColor={Colors.text.light}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, isLoading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryLink} onPress={() => router.push('/login')}>
            <Text style={styles.secondaryLinkText}>Sudah ada akun? Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Colors.secondary} />
          <Text style={styles.backLinkText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
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
    color: Colors.text.secondary,
    marginTop: 6,
  },
  form: {
    marginTop: 24,
  },
  label: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.text.primary,
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
    backgroundColor: Colors.text.light,
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: Fonts.display.medium,
    fontSize: 16,
    color: Colors.white,
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
