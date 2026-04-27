import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, ActivityIndicator, Alert, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import authService from '@/services/auth.service';
import dataService from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Config from '@/constants/Config';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [user, setUser] = useState<any>(null);
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await authService.getUserData();
      if (!userData) {
        router.replace('/login');
        return;
      }
      setUser(userData);
      
      const details = await dataService.getMemberDetails(userData.id || userData._id);
      setMemberDetails(details);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const fullName = `${memberDetails?.firstname || ''} ${memberDetails?.middlename || ''} ${memberDetails?.lastname || ''}`.trim();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={[styles.headerGradient, { backgroundColor: COLORS.primary }]}>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.headerBtn}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.photoContainer}>
            {memberDetails?.photo ? (
              <Image 
                source={{ uri: Config.getImageUri(memberDetails.photo) || '' }} 
                style={styles.profilePhoto} 
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{memberDetails?.firstname?.[0] || 'U'}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editPhotoBtn}>
              <IconSymbol name="camera.fill" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{fullName || user?.name}</Text>
          <Text style={styles.userEmail}>{memberDetails?.email}</Text>
          <View style={styles.idBadge}>
            <Text style={styles.personalId}>{memberDetails?.personal_id}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>
          <View style={[styles.card, { backgroundColor: '#fff' }]}>
            <InfoRow icon="phone.fill" label="Mobile" value={memberDetails?.mobile_number} color={COLORS.primary} />
            <InfoRow icon="person.fill" label="Gender" value={memberDetails?.gender} color={COLORS.secondary} />
            <InfoRow icon="calendar" label="Birth Date" value={memberDetails?.dob ? new Date(memberDetails.dob).toLocaleDateString() : 'N/A'} color={COLORS.accent} />
            <InfoRow icon="heart.fill" label="Marital Status" value={memberDetails?.marital_status} color="#E91E63" />
            <InfoRow icon="book.fill" label="Education" value={memberDetails?.education} color="#673AB7" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Residential Address</Text>
          <View style={[styles.card, { backgroundColor: '#fff' }]}>
            <InfoRow icon="mappin.circle.fill" label="Address" value={memberDetails?.address} color={COLORS.secondary} />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InfoRow icon="building.2.fill" label="City" value={memberDetails?.city} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <InfoRow icon="map.fill" label="State" value={memberDetails?.state} color={COLORS.accent} />
              </View>
            </View>
            <InfoRow icon="number" label="Pincode" value={memberDetails?.pincode} color={COLORS.gray} />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.editBtn, { backgroundColor: COLORS.primary }]}
          onPress={() => Alert.alert('Edit Profile', 'Profile editing will be available soon.')}
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value, color }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.iconBox, { backgroundColor: color + '10' }]}>
        <IconSymbol name={icon} size={18} color={color} />
      </View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Not Provided'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  idBadge: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 10,
  },
  personalId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    padding: 25,
    marginTop: -20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 5,
  },
  card: {
    borderRadius: 25,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTexts: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  row: {
    flexDirection: 'row',
  },
  editBtn: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    elevation: 5,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
