import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/GradientBackground';
import FloatingElements from '../../components/FloatingElements';
import { Colors, Fonts } from '../../constants';

export default function BookmarksTab() {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <FloatingElements count={4} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Tersimpan</Text>
            <Text style={styles.subtitle}>Artikel dan tips yang Anda simpan</Text>
          </View>

          {/* Saved Articles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artikel Tersimpan</Text>
            <View style={styles.bookmarkList}>
              <TouchableOpacity style={styles.bookmarkCard}>
                <View style={styles.bookmarkContent}>
                  <View style={styles.bookmarkHeader}>
                    <Text style={styles.bookmarkTitle}>5 Tanaman Hias Pembersih Udara</Text>
                    <TouchableOpacity style={styles.bookmarkButton}>
                      <Ionicons name="bookmark" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bookmarkDescription}>
                    Tanaman yang dapat membantu membersihkan udara di dalam rumah
                  </Text>
                  <Text style={styles.bookmarkMeta}>Disimpan 2 hari lalu</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bookmarkCard}>
                <View style={styles.bookmarkContent}>
                  <View style={styles.bookmarkHeader}>
                    <Text style={styles.bookmarkTitle}>Resep Pembersih Alami</Text>
                    <TouchableOpacity style={styles.bookmarkButton}>
                      <Ionicons name="bookmark" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bookmarkDescription}>
                    Cara membuat pembersih rumah dari bahan-bahan alami
                  </Text>
                  <Text style={styles.bookmarkMeta}>Disimpan 1 minggu lalu</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.bookmarkCard}>
                <View style={styles.bookmarkContent}>
                  <View style={styles.bookmarkHeader}>
                    <Text style={styles.bookmarkTitle}>Zero Waste Lifestyle</Text>
                    <TouchableOpacity style={styles.bookmarkButton}>
                      <Ionicons name="bookmark" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bookmarkDescription}>
                    Panduan memulai gaya hidup tanpa sampah
                  </Text>
                  <Text style={styles.bookmarkMeta}>Disimpan 2 minggu lalu</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Saved Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips Tersimpan</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>💡</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Matikan perangkat elektronik saat tidak digunakan</Text>
                  <Text style={styles.tipCategory}>Hemat Energi</Text>
                </View>
              </View>
              
              <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>🚿</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Mandi dengan shower lebih hemat air daripada bathtub</Text>
                  <Text style={styles.tipCategory}>Hemat Air</Text>
                </View>
              </View>
              
              <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>🛍️</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Bawa tas belanja sendiri saat berbelanja</Text>
                  <Text style={styles.tipCategory}>Kurangi Plastik</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 28,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 16,
  },
  bookmarkList: {
    gap: 16,
  },
  bookmarkCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookmarkContent: {
    padding: 20,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookmarkTitle: {
    flex: 1,
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.primary,
    marginRight: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  bookmarkMeta: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  tipsList: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  tipCategory: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.primary,
  },
});
