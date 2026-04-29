import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { stripHtml } from '@/utils/html-helper';

export default function AboutUsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await dataService.getPageContent('about-us');
      setContent(response);
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false}>
        <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Our Community</Text>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <IconSymbol name="person.3.fill" size={40} color={COLORS.primary} />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
          ) : (
            <>
              <Text style={styles.title}>{content?.title || 'Our Mission'}</Text>
              <Text style={styles.body}>{content ? stripHtml(content.content) : 'Panchal Samaj is a vibrant community dedicated to the welfare, growth, and unity of our members. Our goal is to provide a platform for professional networking, social support, and cultural preservation.'}</Text>
              
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>5000+</Text>
                  <Text style={styles.statLab}>Members</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>50+</Text>
                  <Text style={styles.statLab}>Events</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>100%</Text>
                  <Text style={styles.statLab}>Unity</Text>
                </View>
              </View>

              <Text style={styles.subTitle}>Our Values</Text>
              <ValueItem title="Unity" desc="Bringing people together across generations." icon="heart.fill" color="#E91E63" />
              <ValueItem title="Growth" desc="Empowering members through jobs and business." icon="chart.bar.fill" color={COLORS.secondary} />
              <ValueItem title="Support" desc="Helping families in times of need." icon="hand.raised.fill" color="#2196F3" />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function ValueItem({ title, desc, icon, color }: any) {
  return (
    <View style={styles.valueItem}>
      <View style={[styles.valueIcon, { backgroundColor: color + '15' }]}>
        <IconSymbol name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.valueTexts}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 80, paddingHorizontal: 25, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 60, left: 25, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  logoContainer: { position: 'absolute', bottom: -40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  content: { padding: 25, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 15, textAlign: 'center' },
  body: { fontSize: 16, color: COLORS.gray, lineHeight: 26, textAlign: 'center', marginBottom: 30 },
  statsCard: { flexDirection: 'row', backgroundColor: COLORS.primary + '10', borderRadius: 25, padding: 20, marginBottom: 35, justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLab: { fontSize: 12, color: COLORS.gray },
  divider: { width: 1, height: 30, backgroundColor: COLORS.primary + '30' },
  subTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  valueItem: { flexDirection: 'row', marginBottom: 20 },
  valueIcon: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  valueTexts: { marginLeft: 15, flex: 1 },
  valueTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  valueDesc: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
});
