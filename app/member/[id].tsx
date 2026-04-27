import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dataService } from '../../services/data.service';
import { Colors, COLORS } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { IconSymbol } from '../../components/ui/icon-symbol';
import Config from '../../constants/Config';

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      const response = await dataService.getMemberDetails(id as string);
      setMember(response);
    } catch (error) {
      console.error('Error fetching member details:', error);
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

  if (!member) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Member not found</Text>
      </View>
    );
  }

  const fullName = `${member.firstname} ${member.middlename || ''} ${member.lastname}`.trim();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.profileContainer}>
          {member.photo ? (
            <Image 
              source={{ uri: Config.getImageUri(member.photo) || '' }} 
              style={styles.profilePhoto} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{member.firstname[0]}</Text>
            </View>
          )}
          <Text style={styles.userName}>{fullName}</Text>
          <View style={styles.idBadge}>
            <Text style={styles.personalId}>{member.personal_id}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Section title="Contact Information">
          <DetailItem icon="phone.fill" label="Mobile Number" value={member.mobile_number} color={COLORS.primary} action={() => Linking.openURL(`tel:${member.mobile_number}`)} />
          <DetailItem icon="envelope.fill" label="Email Address" value={member.email} color={COLORS.secondary} action={() => Linking.openURL(`mailto:${member.email}`)} />
        </Section>

        <Section title="Personal Details">
          <DetailItem icon="person.fill" label="Gender" value={member.gender} color="#673AB7" />
          <DetailItem icon="calendar" label="Date of Birth" value={member.dob ? new Date(member.dob).toLocaleDateString() : 'N/A'} color="#E91E63" />
          <DetailItem icon="heart.fill" label="Marital Status" value={member.marital_status} color="#F44336" />
          <DetailItem icon="book.fill" label="Education" value={member.education} color="#2196F3" />
          <DetailItem icon="briefcase.fill" label="Occupation" value={member.job} color="#FF9800" />
        </Section>

        <Section title="Location Info">
          <DetailItem icon="mappin.circle.fill" label="Address" value={member.address} color={COLORS.secondary} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}><DetailItem icon="building.2.fill" label="City" value={member.city} color={COLORS.primary} /></View>
            <View style={{ flex: 1 }}><DetailItem icon="map.fill" label="State" value={member.state} color={COLORS.accent} /></View>
          </View>
          <DetailItem icon="number" label="Pincode" value={member.pincode} color={COLORS.gray} />
        </Section>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function DetailItem({ icon, label, value, color, action }: any) {
  return (
    <TouchableOpacity style={styles.item} disabled={!action} onPress={action}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <IconSymbol name={icon} size={18} color={color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'Not provided'}</Text>
      </View>
      {action && <IconSymbol name="chevron.right" size={16} color={COLORS.gray} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileContainer: { alignItems: 'center' },
  profilePhoto: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff' },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  avatarText: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  idBadge: { marginTop: 8, backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 4, borderRadius: 10 },
  personalId: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  content: { padding: 25, marginTop: -20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 5 },
  card: { backgroundColor: '#fff', borderRadius: 25, padding: 20, elevation: 4 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemContent: { marginLeft: 15, flex: 1 },
  label: { fontSize: 12, color: COLORS.gray },
  value: { fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row' },
});
