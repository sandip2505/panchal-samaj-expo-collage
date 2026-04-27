import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import authService from '@/services/auth.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function PollsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await dataService.getPolls();
      setPolls(response);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    const userData = await authService.getUserData();
    if (!userData) {
      Alert.alert('Login Required', 'Please login to participate in polls');
      router.push('/login');
      return;
    }

    setVotingId(pollId);
    try {
      const result = await dataService.submitVote({
        pollId,
        memberId: userData.id || userData._id,
        optionId
      });
      if (result) {
        Alert.alert('Success', 'Vote submitted successfully!');
        fetchPolls(); // Refresh results
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Voting failed';
      Alert.alert('Info', errorMsg);
    } finally {
      setVotingId(null);
    }
  };

  const renderPoll = ({ item }: { item: any }) => {
    const totalVotes = item.options.reduce((sum: number, opt: any) => sum + (opt.votesCount || 0), 0);
    const isActive = item.isActive && (!item.expiresAt || new Date(item.expiresAt) > new Date());
    
    return (
      <View style={[styles.card, { backgroundColor: '#fff' }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: isActive ? COLORS.success + '15' : COLORS.gray + '15' }]}>
            <Text style={[styles.statusText, { color: isActive ? COLORS.success : COLORS.gray }]}>
              {isActive ? 'ACTIVE' : 'CLOSED'}
            </Text>
          </View>
          <Text style={styles.totalVotes}>{totalVotes} Total Votes</Text>
        </View>
        
        <Text style={styles.question}>{item.question}</Text>
        
        <View style={styles.optionsList}>
          {item.options.map((option: any) => {
            const percentage = totalVotes > 0 ? Math.round(((option.votesCount || 0) / totalVotes) * 100) : 0;
            return (
              <TouchableOpacity 
                key={option._id} 
                style={styles.optionContainer}
                onPress={() => isActive && handleVote(item._id, option._id)}
                disabled={!isActive || votingId === item._id}
              >
                <View style={styles.optionRow}>
                  <Text style={styles.optionText}>{option.text}</Text>
                  <Text style={styles.percentage}>{percentage}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: COLORS.primary }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Polls</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={polls}
          renderItem={renderPoll}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="chart.bar.fill" size={60} color={COLORS.gray} />
              <Text style={[styles.emptyText, { color: COLORS.gray }]}>No active polls</Text>
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
  card: { padding: 20, borderRadius: 25, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  totalVotes: { fontSize: 12, color: COLORS.gray },
  question: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginBottom: 20 },
  optionsList: { gap: 15 },
  optionContainer: { width: '100%' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  optionText: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  percentage: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  progressBarContainer: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 4 },
  emptyContainer: { alignItems: 'center', padding: 60 },
  emptyText: { marginTop: 15, fontSize: 16, fontWeight: '500' },
});
