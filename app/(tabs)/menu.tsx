import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import authService from '@/services/auth.service';

const { width } = Dimensions.get('window');

export default function MenuScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    authService.isLoggedIn().then(setIsLoggedIn);
  }, []);

  const menuItems = [
    { id: 'profile', title: 'My Profile', icon: 'person.fill', color: COLORS.primary, route: '/profile' },
    { id: 'committee', title: 'Committee', icon: 'person.3.fill', color: COLORS.secondary, route: '/committee' },
    { id: 'business', title: 'Business Hub', icon: 'building.2.fill', color: COLORS.accent, route: '/business' },
    { id: 'gallery', title: 'Gallery', icon: 'photo.on.rectangle.angled', color: '#673AB7', route: '/gallery' },
    { id: 'donations', title: 'Donations', icon: 'heart.fill', color: '#E91E63', route: '/donations' },
    { id: 'complaints', title: 'Help Desk', icon: 'exclamationmark.bubble.fill', color: '#F44336', route: '/complaints' },
    { id: 'polls', title: 'Live Polls', icon: 'chart.bar.fill', color: '#2196F3', route: '/polls' },
    { id: 'faq', title: 'FAQ', icon: 'questionmark.circle.fill', color: '#FF9800', route: '/faq' },
    { id: 'about', title: 'About Us', icon: 'info.circle.fill', color: '#607D8B', route: '/about' },
  ];

  const handlePress = (route: string) => {
    if (route === '/profile') {
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
      Alert.alert('Profile', 'Please use the profile button in the header or edit profile in member details.');
      return;
    }
    router.push(route as any);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await authService.logout();
        router.replace('/login');
      }}
    ]);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerSubtitle}>Community Services</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuCard}
              onPress={() => handlePress(item.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                <IconSymbol name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoggedIn ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <View style={[styles.iconBox, { backgroundColor: '#F4433615' }]}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#F44336" />
            </View>
            <Text style={[styles.logoutText, { color: '#F44336' }]}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.logoutBtn, { borderStyle: 'dashed' }]} onPress={handleLogin}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.primary + '15' }]}>
              <IconSymbol name="person.fill" size={24} color={COLORS.primary} />
            </View>
            <Text style={[styles.logoutText, { color: COLORS.primary }]}>Login / Register</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.version}>Version 2.1.0-Premium</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 25, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  content: { padding: 20, marginTop: -20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuCard: { width: (width - 60) / 2, backgroundColor: '#fff', borderRadius: 25, padding: 20, marginBottom: 20, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  iconBox: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  menuTitle: { fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, padding: 15, marginTop: 10, elevation: 2 },
  logoutText: { fontSize: 16, fontWeight: 'bold', marginLeft: 15 },
  version: { textAlign: 'center', marginTop: 30, color: COLORS.gray, fontSize: 12, marginBottom: 20 },
});
