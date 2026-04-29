import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Config from '@/constants/Config';
import { stripHtml } from '@/utils/html-helper';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetails();
  }, [id]);

  const fetchNewsDetails = async () => {
    try {
      const response = await dataService.getNewsDetails(id as string);
      setNews(response);
    } catch (error) {
      console.error('Error fetching news details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>News not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {news.image ? (
            <Image 
              source={{ uri: Config.getImageUri(news.image) || '' }} 
              style={styles.bannerImage} 
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: COLORS.primary + '20' }]}>
              <IconSymbol name="newspaper.fill" size={80} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.overlay} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>Latest News</Text>
            </View>
            <Text style={styles.title}>{news.title}</Text>
            <View style={styles.metaRow}>
              <IconSymbol name="calendar" size={14} color={COLORS.gray} />
              <Text style={styles.date}>{new Date(news.date || news.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.body}>
            <Text style={styles.description}>{stripHtml(news.content)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { height: 350, position: 'relative' },
  bannerImage: { width: '100%', height: '100%' },
  imagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  backBtn: { position: 'absolute', top: 60, left: 25, width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  content: { marginTop: -40, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, minHeight: 500 },
  headerInfo: { marginBottom: 25 },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 15 },
  categoryText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginBottom: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  date: { marginLeft: 8, color: COLORS.gray, fontSize: 14 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 25 },
  body: { paddingBottom: 50 },
  description: { fontSize: 16, color: '#444', lineHeight: 28 },
});
