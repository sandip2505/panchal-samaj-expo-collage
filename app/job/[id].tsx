import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { COLORS } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import dataService from '@/services/data.service';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      // Note: Assuming there is a getJobDetails endpoint, falling back to all jobs filter if not
      const response = await dataService.getJobs();
      const foundJob = response.find((j: any) => j._id === id);
      setJob(foundJob);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.center}>
        <ThemedText>Job not found</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Job Details', headerTitleStyle: { fontWeight: 'bold' } }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.companyIcon}>
            <IconSymbol name="building.2.fill" size={40} color={COLORS.primary} />
          </View>
          <ThemedText style={styles.title}>{job.title}</ThemedText>
          <ThemedText style={styles.company}>{job.company}</ThemedText>
          
          <View style={styles.badges}>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>{job.jobType}</ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: '#4CAF5015' }]}>
              <ThemedText style={[styles.badgeText, { color: '#4CAF50' }]}>{job.location}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.description}>{job.description}</ThemedText>
        </View>

        {job.salary && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Salary</ThemedText>
            <ThemedText style={styles.salary}>{job.salary}</ThemedText>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => router.push({ pathname: '/job-apply', params: { jobId: job._id, title: job.title } } as any)}
        >
          <ThemedText style={styles.applyButtonText}>Apply Now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 25, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  companyIcon: { width: 80, height: 80, borderRadius: 20, backgroundColor: COLORS.primary + '10', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  company: { fontSize: 16, color: '#666', marginTop: 5 },
  badges: { flexDirection: 'row', marginTop: 15, gap: 10 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.primary + '10' },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  section: { padding: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 15, lineHeight: 24, color: '#444' },
  salary: { fontSize: 16, fontWeight: '600', color: '#4CAF50' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  applyButton: { backgroundColor: COLORS.primary, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
