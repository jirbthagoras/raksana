import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../constants';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Hola! Salam hijau</Text>
        <Text style={styles.subtitle}>Lanjutkan perjalanan-mu di Raksana.</Text>
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

        <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
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

        <TouchableOpacity style={styles.primaryButton} onPress={() => { /* handle submit later */ }}>
          <Text style={styles.primaryButtonText}>Masuk</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryLink} onPress={() => router.push('/register')}>
          <Text style={styles.secondaryLinkText}>Tidak punya akun? Daftar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color={Colors.secondary} />
        <Text style={styles.backLinkText}>Kembali</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    marginTop: 10,
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
