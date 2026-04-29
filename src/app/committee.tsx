import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Config from '@/constants/Config';

export default function CommitteeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommittee();
  }, []);

  const fetchCommittee = async () => {
    try {
      const response = await dataService.getCommittee();
      setCommittee(response);
    } catch (error) {
      console.error('Error fetching committee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (number: string) => {
    // In a real app, use Linking.openURL(`tel:${number}`)
    console.log('Calling:', number);
  };

  const handleWhatsApp = (number: string) => {
    // In a real app, use Linking.openURL(`whatsapp://send?phone=${number}`)
    console.log('WhatsApp:', number);
  };

  const renderMember = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: '#fff' }]}>
      <View style={styles.cardMain}>
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image 
              source={{ uri: Config.getImageUri(item.image) || '' }} 
              style={styles.photo} 
            />
          ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: COLORS.primary + '10' }]}>
              <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 24 }}>{item.name?.[0]}</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.designation}>{item.designation || 'Member'}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.mobile}>{item.phone}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF5015' }]} onPress={() => handleCall(item.phone)}>
          <IconSymbol name="phone.fill" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2196F315' }]} onPress={() => handleWhatsApp(item.phone)}>
          <IconSymbol name="message.fill" size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Committee Members</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={committee}
          renderItem={renderMember}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="person.3.fill" size={60} color={COLORS.gray} />
              <Text style={[styles.emptyText, { color: COLORS.gray }]}>No committee members listed</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 60, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 15, color: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 25, marginBottom: 15, padding: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  imageContainer: { width: 70, height: 70, borderRadius: 25, overflow: 'hidden', elevation: 2 },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  info: { marginLeft: 15, flex: 1 },
  designation: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  mobile: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  actionBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', padding: 60 },
  emptyText: { marginTop: 15, fontSize: 16, fontWeight: '500' },
});
