import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dataService } from '../../services/data.service';
import authService from '../../services/auth.service';
import { Colors, COLORS } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { IconSymbol } from '../../components/ui/icon-symbol';
import Config from '../../constants/Config';
import { stripHtml } from '../../utils/html-helper';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await dataService.getEventDetails(id as string);
      setEvent(response);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const userData = await authService.getUserData();
    if (!userData) {
      Alert.alert('Login Required', 'Please login to register for events', [
        { text: 'Login', onPress: () => router.push('/login') },
        { text: 'Cancel', style: 'cancel' }
      ]);
      return;
    }

    setRegistering(true);
    try {
      const result = await dataService.registerForEvent({
        eventId: id,
        memberId: userData.id || userData._id,
        name: userData.name || `${userData.firstname} ${userData.lastname}`,
        mobile: userData.mobile_number || userData.mobile || userData.phone,
        email: userData.email,
        registrationDate: new Date()
      });
      if (result) {
        Alert.alert('Success', 'Successfully registered for the event!');
        fetchEventDetails(); // Refresh to update attendee count
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}>
      <View style={styles.imageContainer}>
        {event.bannerImage ? (
          <Image 
            source={{ uri: Config.getImageUri(event.bannerImage) || '' }} 
            style={styles.bannerImage} 
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: COLORS.primary + '10' }]}>
            <IconSymbol name="calendar" size={80} color={COLORS.primary} />
          </View>
        )}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.headerInfo}>
          <View style={[styles.statusBadge, { backgroundColor: event.status === 'upcoming' ? COLORS.success + '20' : COLORS.gray + '20' }]}>
            <Text style={[styles.statusText, { color: event.status === 'upcoming' ? COLORS.success : COLORS.gray }]}>
              {event.status?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <View style={[styles.iconBox, { backgroundColor: COLORS.primary + '10' }]}>
                <IconSymbol name="calendar" size={18} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{new Date(event.date).toLocaleDateString()}</Text>
              </View>
            </View>
            <View style={styles.metaItem}>
              <View style={[styles.iconBox, { backgroundColor: COLORS.secondary + '10' }]}>
                <IconSymbol name="clock.fill" size={18} color={COLORS.secondary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Time</Text>
                <Text style={styles.metaValue}>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationCard}>
            <IconSymbol name="mappin.circle.fill" size={22} color={COLORS.primary} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.locationValue}>{event.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>{stripHtml(event.description)}</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{event.attendeeCount || 0}</Text>
            <Text style={styles.statLabel}>Attending</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{event.capacity || '∞'}</Text>
            <Text style={styles.statLabel}>Capacity</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{event.isPaid ? `₹${event.ticketFees}` : 'FREE'}</Text>
            <Text style={styles.statLabel}>Entry Fee</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.registerBtn, { backgroundColor: event.registrationStatus === 'open' ? COLORS.primary : COLORS.gray }]}
          onPress={handleRegister}
          disabled={registering || event.registrationStatus !== 'open'}
        >
          {registering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerBtnText}>
              {event.registrationStatus === 'open' ? 'REGISTER FOR EVENT' : 'REGISTRATION CLOSED'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { position: 'relative', height: 300 },
  bannerImage: { width: '100%', height: '100%' },
  imagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  backBtn: { position: 'absolute', top: 60, left: 25, width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 25, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40 },
  headerInfo: { marginBottom: 25 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 15 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  metaLabel: { fontSize: 12, color: COLORS.gray },
  metaValue: { fontSize: 15, fontWeight: 'bold' },
  locationCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9', borderRadius: 20 },
  locationLabel: { fontSize: 12, color: COLORS.gray },
  locationValue: { fontSize: 15, fontWeight: 'bold' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 15, color: COLORS.gray, lineHeight: 24 },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0', marginBottom: 30 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.gray },
  divider: { width: 1, height: '100%', backgroundColor: '#f0f0f0' },
  registerBtn: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 40, elevation: 5 },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
