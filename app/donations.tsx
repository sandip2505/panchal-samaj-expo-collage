import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity, StatusBar, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DonationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentDonations, setRecentDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await dataService.getDonations();
      setRecentDonations(response);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleDonate = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    Alert.alert('Payment Integration', 'Payment gateway integration will be available soon. Please use the cash donation option for now.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Donations</Text>
        </View>

        <View style={styles.donationCard}>
          <Text style={styles.cardTitle}>Support Your Community</Text>
          <Text style={styles.cardSubtitle}>Every contribution helps us build a stronger samaj.</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.quickAmounts}>
            {['501', '1101', '2101', '5001'].map(val => (
              <TouchableOpacity 
                key={val} 
                style={styles.quickBtn}
                onPress={() => setAmount(val)}
              >
                <Text style={styles.quickText}>₹{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.donateBtn, { backgroundColor: COLORS.primary }]} onPress={handleDonate}>
            <Text style={styles.donateBtnText}>DONATE NOW</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Contributions</Text>
          {recentDonations.length > 0 ? (
            recentDonations.slice(0, 10).map((item: any) => (
              <View key={item._id} style={styles.historyItem}>
                <View style={[styles.historyIcon, { backgroundColor: COLORS.success + '15' }]}>
                  <IconSymbol name="heart.fill" size={16} color={COLORS.success} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.donorName}>{item.memberName || 'Anonymous'}</Text>
                  <Text style={styles.donationDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.historyAmount}>+₹{item.amount}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={{ color: COLORS.gray }}>No recent donations found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 60, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 15 },
  donationCard: { margin: 25, backgroundColor: '#fff', borderRadius: 30, padding: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  cardSubtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginBottom: 30 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingBottom: 10, marginBottom: 25 },
  currencySymbol: { fontSize: 30, fontWeight: 'bold', color: COLORS.primary, marginRight: 10 },
  amountInput: { fontSize: 36, fontWeight: 'bold', color: COLORS.black, minWidth: 100, textAlign: 'center' },
  quickAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  quickBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: COLORS.primary + '10' },
  quickText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
  donateBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  donateBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  historySection: { paddingHorizontal: 25, paddingBottom: 50 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 1 },
  historyIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  historyInfo: { marginLeft: 15, flex: 1 },
  donorName: { fontSize: 16, fontWeight: 'bold' },
  donationDate: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  historyAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.success },
  emptyContainer: { alignItems: 'center', padding: 30 },
});
