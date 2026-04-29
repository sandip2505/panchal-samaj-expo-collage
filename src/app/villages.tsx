import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Config from '@/constants/Config';

export default function VillagesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await dataService.getVillages();
      setVillages(response);
    } catch (error) {
      console.error('Error fetching villages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVillages = villages.filter((v: any) => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVillage = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: Config.getImageUri(item.image) || '' }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <IconSymbol name="mappin.and.ellipse" size={30} color={COLORS.primary} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.district}, {item.state}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villages</Text>
        </View>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color={COLORS.gray} />
          <TextInput 
            placeholder="Search villages..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredVillages}
          renderItem={renderVillage}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="mappin.slash" size={60} color={COLORS.gray} />
              <Text style={styles.emptyText}>No villages found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 60, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginLeft: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 15, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  imageContainer: { height: 150, width: '100%', backgroundColor: '#f0f0f0' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  info: { padding: 15 },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  location: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  emptyContainer: { alignItems: 'center', padding: 60 },
  emptyText: { marginTop: 15, fontSize: 16, color: COLORS.gray, fontWeight: '500' },
});
