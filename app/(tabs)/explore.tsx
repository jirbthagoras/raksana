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

export default function ExploreTab() {
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
            <Text style={styles.title}>Jelajahi</Text>
            <Text style={styles.subtitle}>Temukan tips dan artikel eco-friendly</Text>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategori</Text>
            <View style={styles.categoryGrid}>
              <TouchableOpacity style={styles.categoryCard}>
                <Ionicons name="leaf" size={32} color={Colors.primary} />
                <Text style={styles.categoryTitle}>Gaya Hidup Hijau</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categoryCard}>
                <Ionicons name="car" size={32} color={Colors.primary} />
                <Text style={styles.categoryTitle}>Transportasi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categoryCard}>
                <Ionicons name="home" size={32} color={Colors.primary} />
                <Text style={styles.categoryTitle}>Rumah Ramah Lingkungan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.categoryCard}>
                <Ionicons name="restaurant" size={32} color={Colors.primary} />
                <Text style={styles.categoryTitle}>Makanan Berkelanjutan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Articles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artikel Pilihan</Text>
            <View style={styles.articleList}>
              <TouchableOpacity style={styles.articleCard}>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>10 Cara Mudah Mengurangi Sampah Plastik</Text>
                  <Text style={styles.articleDescription}>
                    Pelajari cara sederhana untuk mengurangi penggunaan plastik dalam kehidupan sehari-hari
                  </Text>
                  <Text style={styles.articleMeta}>5 min read • Eco Tips</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.articleCard}>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>Panduan Kompos di Rumah</Text>
                  <Text style={styles.articleDescription}>
                    Mulai membuat kompos sendiri dengan bahan-bahan yang ada di rumah
                  </Text>
                  <Text style={styles.articleMeta}>8 min read • DIY</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.articleCard}>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>Transportasi Ramah Lingkungan</Text>
                  <Text style={styles.articleDescription}>
                    Alternatif transportasi yang dapat mengurangi jejak karbon Anda
                  </Text>
                  <Text style={styles.articleMeta}>6 min read • Transport</Text>
                </View>
              </TouchableOpacity>
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryTitle: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  articleList: {
    gap: 16,
  },
  articleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  articleContent: {
    padding: 20,
  },
  articleTitle: {
    fontFamily: Fonts.display.bold,
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 8,
  },
  articleDescription: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    fontFamily: Fonts.text.regular,
    fontSize: 12,
    color: Colors.text.secondary,
  },
});
