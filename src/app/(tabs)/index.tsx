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
  const [events, setEvents] = useState([]);
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
      
      const [slidersData, newsData, statsData, eventsData] = await Promise.all([
        dataService.getSliders(),
        dataService.getNews(),
        dataService.getStats(),
        dataService.getEvents(),
      ]);
      setSliders(slidersData);
      setNews(newsData);
      setStats(statsData);
      setEvents(eventsData);
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
              onPress={() => router.push(isLoggedIn ? '/(tabs)/profile' : '/login')}
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
                  <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                    <IconSymbol name={action.icon as any} size={26} color="#fff" />
                  </View>
                  <Text style={styles.actionLabel}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.moreSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>More Services</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moreScroll}>
              <TouchableOpacity style={styles.moreItem} onPress={() => router.push('/villages' as any)}>
                <View style={[styles.moreIcon, { backgroundColor: '#4CAF5015' }]}>
                  <IconSymbol name="mappin.and.ellipse" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.moreLabel}>Villages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreItem} onPress={() => router.push('/donations' as any)}>
                <View style={[styles.moreIcon, { backgroundColor: '#E91E6315' }]}>
                  <IconSymbol name="heart.fill" size={24} color="#E91E63" />
                </View>
                <Text style={styles.moreLabel}>Donations</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreItem} onPress={() => router.push('/polls' as any)}>
                <View style={[styles.moreIcon, { backgroundColor: '#2196F315' }]}>
                  <IconSymbol name="chart.bar.fill" size={24} color="#2196F3" />
                </View>
                <Text style={styles.moreLabel}>Polls</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreItem} onPress={() => router.push('/support' as any)}>
                <View style={[styles.moreIcon, { backgroundColor: '#FF980015' }]}>
                  <IconSymbol name="questionmark.circle.fill" size={24} color="#FF9800" />
                </View>
                <Text style={styles.moreLabel}>Support</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.newsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/events' as any)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventsScroll}>
              {events.map((event: any) => (
                <TouchableOpacity 
                  key={event._id} 
                  style={styles.eventCard}
                  onPress={() => router.push(`/event/${event._id}`)}
                >
                  <View style={styles.eventImageContainer}>
                    {event.bannerImage ? (
                      <Image source={{ uri: Config.getImageUri(event.bannerImage) }} style={styles.eventImage} />
                    ) : (
                      <View style={styles.eventPlaceholder}>
                        <IconSymbol name="calendar" size={30} color={COLORS.primary} />
                      </View>
                    )}
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                    <Text style={styles.eventDate}>{new Date(event.date).toLocaleDateString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  quickActionsContainer: { marginTop: 30, marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { alignItems: 'center', width: (width - 40) / 4 },
  actionIconContainer: { width: 64, height: 64, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.black },
  moreSection: { marginBottom: 25 },
  moreScroll: { paddingRight: 20 },
  moreItem: { alignItems: 'center', marginRight: 20, backgroundColor: '#fff', padding: 15, borderRadius: 20, width: 100, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  moreIcon: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  moreLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.darkGray },
  newsSection: { marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAll: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
  eventsScroll: { paddingRight: 20 },
  eventCard: { width: 220, backgroundColor: '#fff', borderRadius: 20, marginRight: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, overflow: 'hidden' },
  eventImageContainer: { height: 120, width: '100%', backgroundColor: '#f9f9f9' },
  eventImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  eventPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  eventInfo: { padding: 12 },
  eventTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.black },
  eventDate: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
});
