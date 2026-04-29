import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Image, TouchableOpacity, StatusBar, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Config from '@/constants/Config';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const response = await dataService.getBusinessDetails(id as string);
      setBusiness(response);
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (business?.mobile) {
      Linking.openURL(`tel:${business.mobile}`);
    }
  };

  const handleEmail = () => {
    if (business?.email) {
      Linking.openURL(`mailto:${business.email}`);
    }
  };

  const handleMap = () => {
    if (business?.address) {
      const url = Platform.select({
        ios: `maps:0,0?q=${business.address}`,
        android: `geo:0,0?q=${business.address}`,
      });
      if (url) Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Business not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              {business.logo ? (
                <Image source={{ uri: Config.getImageUri(business.logo) || '' }} style={styles.logo} />
              ) : (
                <IconSymbol name="building.2.fill" size={40} color={COLORS.primary} />
              )}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <Text style={styles.category}>{business.category || 'Business'}</Text>
            <Text style={styles.name}>{business.name}</Text>
            <Text style={styles.owner}>Owned by {business.ownerName}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionCircle, { backgroundColor: COLORS.secondary + '15' }]} onPress={handleCall}>
              <IconSymbol name="phone.fill" size={20} color={COLORS.secondary} />
              <Text style={[styles.actionLabel, { color: COLORS.secondary }]}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCircle, { backgroundColor: '#2196F315' }]} onPress={handleEmail}>
              <IconSymbol name="envelope.fill" size={20} color="#2196F3" />
              <Text style={[styles.actionLabel, { color: '#2196F3' }]}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionCircle, { backgroundColor: COLORS.accent + '15' }]} onPress={handleMap}>
              <IconSymbol name="mappin.and.ellipse" size={20} color={COLORS.accent} />
              <Text style={[styles.actionLabel, { color: COLORS.accent }]}>Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Business</Text>
            <Text style={styles.description}>{business.description || 'No description provided.'}</Text>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem icon="phone.fill" label="Contact Number" value={business.mobile} />
            <InfoItem icon="envelope.fill" label="Email Address" value={business.email || 'Not provided'} />
            <InfoItem icon="mappin.circle.fill" label="Business Address" value={business.address} />
            <InfoItem icon="clock.fill" label="Working Hours" value={business.workingHours || '9:00 AM - 7:00 PM'} />
          </View>

          {business.website && (
            <TouchableOpacity 
              style={[styles.websiteBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => Linking.openURL(business.website)}
            >
              <IconSymbol name="globe" size={20} color="#fff" />
              <Text style={styles.websiteBtnText}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <IconSymbol name={icon} size={18} color={COLORS.primary} />
      </View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { height: 200, paddingTop: 60, alignItems: 'center', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  backBtn: { position: 'absolute', top: 60, left: 25, width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  logoContainer: { position: 'absolute', bottom: -50 },
  logoCircle: { width: 100, height: 100, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10, overflow: 'hidden' },
  logo: { width: '100%', height: '100%' },
  content: { padding: 25, paddingTop: 70 },
  mainInfo: { alignItems: 'center', marginBottom: 30 },
  category: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase', marginBottom: 5 },
  name: { fontSize: 26, fontWeight: 'bold', color: COLORS.black, textAlign: 'center' },
  owner: { fontSize: 15, color: COLORS.gray, marginTop: 5 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  actionCircle: { alignItems: 'center', width: 70, height: 70, borderRadius: 20, justifyContent: 'center' },
  actionLabel: { fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginBottom: 30 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  description: { fontSize: 15, color: COLORS.darkGray, lineHeight: 24 },
  infoGrid: { gap: 20, marginBottom: 30 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primary + '10', justifyContent: 'center', alignItems: 'center' },
  infoTexts: { marginLeft: 15, flex: 1 },
  infoLabel: { fontSize: 12, color: COLORS.gray },
  infoValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.black, marginTop: 2 },
  websiteBtn: { height: 55, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  websiteBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});
