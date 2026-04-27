import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import dataService from '@/services/data.service';
import authService from '@/services/auth.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function JobsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const response = await dataService.getJobs();
      setJobs(response);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleApply = async (jobId: string) => {
    const userData = await authService.getUserData();
    if (!userData) {
      Alert.alert('Login Required', 'Please login to apply for jobs');
      router.push('/login');
      return;
    }

    setApplyingId(jobId);
    try {
      const result = await dataService.applyForJob({
        jobId,
        memberId: userData.id || userData._id,
        applicationDate: new Date(),
        status: 'Pending'
      });
      if (result) {
        Alert.alert('Success', 'Application submitted successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Application failed');
    } finally {
      setApplyingId(null);
    }
  };

  const renderJob = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.jobCard, { backgroundColor: '#fff' }]}>
      <View style={styles.jobHeader}>
        <View style={[styles.logoPlaceholder, { backgroundColor: COLORS.primary + '10' }]}>
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{item.company?.[0] || 'J'}</Text>
        </View>
        <View style={styles.titleInfo}>
          <Text style={[styles.jobTitle, { color: COLORS.black }]}>{item.title}</Text>
          <Text style={[styles.company, { color: COLORS.gray }]}>{item.company}</Text>
        </View>
        <TouchableOpacity>
          <IconSymbol name="bookmark" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tagsRow}>
        <View style={[styles.tag, { backgroundColor: COLORS.secondary + '10' }]}>
          <Text style={[styles.tagText, { color: COLORS.secondary }]}>{item.jobType}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: COLORS.primary + '10' }]}>
          <Text style={[styles.tagText, { color: COLORS.primary }]}>Active</Text>
        </View>
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <IconSymbol name="mappin.and.ellipse" size={14} color={COLORS.gray} />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <IconSymbol name="indianrupeesign" size={14} color={COLORS.gray} />
          <Text style={styles.metaText}>{item.salary || 'Competitive'}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.postedDate}>
          Posted {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity 
          style={[styles.applyBtn, { backgroundColor: COLORS.primary }]}
          onPress={() => handleApply(item._id)}
          disabled={applyingId === item._id}
        >
          {applyingId === item._id ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.applyBtnText}>Apply Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.title}>Career Portal</ThemedText>
          <Text style={styles.subtitle}>Find your dream opportunity</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <IconSymbol name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="briefcase.fill" size={60} color={COLORS.gray} />
              <Text style={[styles.emptyText, { color: COLORS.gray }]}>No jobs available right now</Text>
            </View>
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
    padding: 25,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  jobCard: {
    padding: 20,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleInfo: {
    flex: 1,
    marginLeft: 15,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobMeta: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: 6,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 15,
  },
  postedDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  applyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 60,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});
