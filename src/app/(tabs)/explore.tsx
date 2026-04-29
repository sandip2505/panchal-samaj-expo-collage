import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TextInput, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import dataService from '@/services/data.service';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import MemberCard from '@/components/MemberCard';

export default function DirectoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMembers = async (pageNumber = 1, isRefreshing = false) => {
    try {
      const response = await dataService.getMembers({ search, page: pageNumber, limit: 20 });
      if (response && response.members) {
        if (isRefreshing) {
          setMembers(response.members);
        } else {
          setMembers((prev): any => [...prev, ...response.members]);
        }
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setMembers([]);
    setPage(1);
    fetchMembers(1, true);
  }, [search]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchMembers(1, true);
  };

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMembers(nextPage);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText type="title">Community Directory</ThemedText>
        <View style={[styles.searchBar, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, ID or mobile..."
            placeholderTextColor={colors.icon}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading && page === 1 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      ) : (
        <FlatList
          data={members}
          renderItem={({ item }) => (
            <MemberCard 
              member={item} 
              onPress={() => router.push(`/member/${item._id}`)} 
            />
          )}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="person.fill.xmark" size={50} color={colors.icon} />
              <Text style={[styles.emptyText, { color: colors.icon }]}>No members found</Text>
            </View>
          }
          ListFooterComponent={
            page < totalPages ? (
              <ActivityIndicator size="small" color={colors.tint} style={{ marginVertical: 20 }} />
            ) : null
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});
