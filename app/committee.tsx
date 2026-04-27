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

  const renderMember = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: '#fff' }]}>
      <View style={styles.imageContainer}>
        {item.photo ? (
          <Image 
            source={{ uri: Config.getImageUri(item.photo) || '' }} 
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
        <Text style={styles.mobile}>{item.mobile}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={COLORS.primary} />
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
  header: { padding: 25, paddingTop: 60, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 15 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 25, paddingBottom: 40 },
  card: { flexDirection: 'row', padding: 15, borderRadius: 25, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, alignItems: 'center' },
  imageContainer: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  info: { marginLeft: 20, flex: 1 },
  designation: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  mobile: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  emptyContainer: { alignItems: 'center', padding: 60 },
  emptyText: { marginTop: 15, fontSize: 16, fontWeight: '500' },
});
