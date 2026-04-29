import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, Image, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Config from '@/constants/Config';

export default function BusinessHubScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await dataService.getBusinesses();
      setBusinesses(response.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = Array.isArray(businesses) ? businesses.filter((b: any) => 
    b.name?.toLowerCase().includes(search?.toLowerCase() || '') || 
    b.category?.toLowerCase().includes(search?.toLowerCase() || '')
  ) : [];

  const renderBusiness = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: '#fff' }]}
      onPress={() => router.push(`/business/${item._id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.imageContainer, { backgroundColor: COLORS.primary + '10' }]}>
          {item.logo ? (
            <Image source={{ uri: Config.getImageUri(item.logo) || '' }} style={styles.logo} />
          ) : (
            <IconSymbol name="building.2.fill" size={30} color={COLORS.primary} />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.category}>{item.category || 'Business'}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <IconSymbol name="person.fill" size={14} color={COLORS.gray} />
          <Text style={styles.detailText}>{item.ownerName}</Text>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol name="mappin.and.ellipse" size={14} color={COLORS.gray} />
          <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: COLORS.secondary + '15' }]}
          onPress={() => item.mobile && Linking.openURL(`tel:${item.mobile}`)}
        >
          <IconSymbol name="phone.fill" size={16} color={COLORS.secondary} />
          <Text style={[styles.actionText, { color: COLORS.secondary }]}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: COLORS.primary + '15' }]}
          onPress={() => router.push(`/business/${item._id}`)}
        >
          <IconSymbol name="paperplane.fill" size={16} color={COLORS.primary} />
          <Text style={[styles.actionText, { color: COLORS.primary }]}>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Hub</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => router.push('/business/register')}
        >
          <IconSymbol name="plus.circle.fill" size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color={COLORS.gray} />
          <TextInput
            placeholder="Search businesses..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBusinesses}
          renderItem={renderBusiness}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="building.2.fill" size={60} color={COLORS.gray} />
              <Text style={[styles.emptyText, { color: COLORS.gray }]}>No businesses found</Text>
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 15, flex: 1 },
  addBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { paddingHorizontal: 25, marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 15, height: 50, borderRadius: 15, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 25, paddingBottom: 40 },
  card: { padding: 20, borderRadius: 25, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  imageContainer: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  logo: { width: '100%', height: '100%' },
  headerText: { marginLeft: 15, flex: 1 },
  category: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', textTransform: 'uppercase' },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginTop: 2 },
  details: { marginBottom: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailText: { marginLeft: 10, fontSize: 14, color: COLORS.gray },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12 },
  actionText: { marginLeft: 8, fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { alignItems: 'center', padding: 60 },
  emptyText: { marginTop: 15, fontSize: 16, fontWeight: '500' },
});
