import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function FaqScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await dataService.getFaqs();
      setFaqs(response);
    } catch (error) {
      console.error('Error fetching faqs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isExpanded = expandedId === item._id;
    return (
      <TouchableOpacity 
        style={[styles.faqCard, { backgroundColor: '#fff' }]} 
        onPress={() => setExpandedId(isExpanded ? null : item._id)}
      >
        <View style={styles.questionRow}>
          <Text style={[styles.question, { color: isExpanded ? COLORS.primary : COLORS.black }]}>{item.question}</Text>
          <IconSymbol name={isExpanded ? "chevron.up" : "chevron.down"} size={18} color={COLORS.gray} />
        </View>
        {isExpanded && (
          <View style={styles.answerRow}>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={faqs}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="questionmark.circle.fill" size={60} color={COLORS.gray} />
              <Text style={[styles.emptyText, { color: COLORS.gray }]}>No FAQs available</Text>
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 25, paddingBottom: 40 },
  faqCard: { padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  questionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  question: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 10 },
  answerRow: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 },
  answer: { fontSize: 14, color: COLORS.gray, lineHeight: 22 },
  emptyContainer: { alignItems: 'center', padding: 60 },
  emptyText: { marginTop: 15, fontSize: 16, fontWeight: '500' },
});
