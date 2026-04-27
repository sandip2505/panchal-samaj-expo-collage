import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Text, ActivityIndicator, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@/components/Slider';
import NewsCard from '@/components/NewsCard';
import dataService from '@/services/data.service';
import authService from '@/services/auth.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Config from '@/constants/Config';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [sliders, setSliders] = useState([]);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const loggedIn = await authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const uData = await authService.getUserData();
        setUserData(uData);
      }
      
      const [slidersData, newsData, statsData] = await Promise.all([
        dataService.getSliders(),
        dataService.getNews(),
        dataService.getStats(),
      ]);
      setSliders(slidersData);
      setNews(newsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const quickActions = [
    { id: 'dir', title: 'Directory', icon: 'person.2.fill', route: '/(tabs)/explore', color: COLORS.primary },
    { id: 'com', title: 'Committee', icon: 'person.3.fill', route: '/committee', color: COLORS.secondary },
    { id: 'biz', title: 'Business', icon: 'building.2.fill', route: '/business', color: COLORS.accent },
    { id: 'gal', title: 'Gallery', icon: 'photo.on.rectangle.angled', route: '/gallery', color: '#673AB7' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topHeader, { backgroundColor: COLORS.primary }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>{isLoggedIn ? `Namaste,` : 'Welcome to'}</Text>
              <Text style={styles.userName}>{isLoggedIn ? userData?.name?.split(' ')[0] : 'Panchal Samaj'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileBtn}
              onPress={() => router.push(isLoggedIn ? '/profile' : '/login')}
            >
              {isLoggedIn && userData?.photo ? (
                <Image source={{ uri: Config.getImageUri(userData.photo) || '' }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <IconSymbol name="person.fill" size={24} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.statsOverview}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewVal}>{stats?.summary?.totalMembers || '0'}</Text>
              <Text style={styles.overviewLab}>Members</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewVal}>{stats?.summary?.totalEvents || '0'}</Text>
              <Text style={styles.overviewLab}>Events</Text>
            </View>
            <View style={styles.overviewDivider} />
            <View style={styles.overviewItem}>
              <Text style={styles.overviewVal}>{stats?.summary?.totalBusinesses || '0'}</Text>
              <Text style={styles.overviewLab}>Businesses</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.sliderContainer}>
            <Slider data={sliders} />
          </View>

          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.actionGrid}>
              {quickActions.map(action => (
                <TouchableOpacity 
                  key={action.id} 
                  style={styles.actionItem}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                    <IconSymbol name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.newsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Updates</Text>
              <TouchableOpacity onPress={() => router.push('/news' as any)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {news.map((item: any) => (
              <NewsCard 
                key={item._id} 
                item={item} 
                onPress={() => router.push(`/news/${item._id}`)}
              />
            ))}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topHeader: { paddingTop: 60, paddingBottom: 60, paddingHorizontal: 25, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcomeText: { color: '#fff', fontSize: 16, opacity: 0.9 },
  userName: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  profileBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', padding: 2, elevation: 5 },
  avatar: { width: '100%', height: '100%', borderRadius: 25 },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  statsOverview: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 25, paddingVertical: 20 },
  overviewItem: { alignItems: 'center', flex: 1 },
  overviewVal: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  overviewLab: { color: '#fff', fontSize: 12, opacity: 0.8 },
  overviewDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  content: { marginTop: -30, paddingHorizontal: 20 },
  sliderContainer: { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10 },
  quickActionsContainer: { marginTop: 30, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { alignItems: 'center', width: (width - 40) / 4 },
  actionIcon: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2 },
  actionLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.darkGray },
  newsSection: { marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAll: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});
