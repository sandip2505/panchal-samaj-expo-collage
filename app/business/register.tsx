import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import authService from '@/services/auth.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RegisterBusinessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    contact: '',
    subscriptionPlanId: '',
    whatsapp: '',
    website: '',
  });

  useEffect(() => {
    checkAuth();
    fetchPlans();
  }, []);

  const checkAuth = async () => {
    const user = await authService.getUserData();
    if (!user) {
      Alert.alert('Login Required', 'You must be logged in to register a business.');
      router.replace('/login');
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await dataService.getSubscriptionPlans();
      setPlans(response);
      if (response.length > 0) {
        setFormData(prev => ({ ...prev, subscriptionPlanId: response[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setFetchingPlans(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.contact || !formData.subscriptionPlanId) {
      Alert.alert('Error', 'Please fill all required fields (*)');
      return;
    }

    const user = await authService.getUserData();
    if (!user) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        ownerId: user.id || user._id,
        socialLinks: {
          website: formData.website
        },
        initialPayment: {
          method: 'Cash', // Default for app submission, admin can approve
          amount: plans.find((p: any) => p._id === formData.subscriptionPlanId)?.price || 0
        }
      };

      await dataService.createBusiness(payload);
      Alert.alert(
        'Success', 
        'Business registration submitted! Our team will verify and activate your listing soon.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Business</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter business name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Manufacturing, Retail, IT"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Primary contact number"
              keyboardType="phone-pad"
              value={formData.contact}
              onChangeText={(text) => setFormData({ ...formData, contact: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="WhatsApp number"
              keyboardType="phone-pad"
              value={formData.whatsapp}
              onChangeText={(text) => setFormData({ ...formData, whatsapp: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Full address"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your business..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
          </View>

          <Text style={styles.sectionTitle}>Select Subscription Plan</Text>
          {fetchingPlans ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <View style={styles.plansGrid}>
              {plans.map((plan: any) => (
                <TouchableOpacity 
                  key={plan._id}
                  style={[
                    styles.planCard, 
                    formData.subscriptionPlanId === plan._id && styles.selectedPlan
                  ]}
                  onPress={() => setFormData({ ...formData, subscriptionPlanId: plan._id })}
                >
                  <Text style={[styles.planName, formData.subscriptionPlanId === plan._id && { color: '#fff' }]}>{plan.name}</Text>
                  <Text style={[styles.planPrice, formData.subscriptionPlanId === plan._id && { color: '#fff' }]}>₹{plan.price}</Text>
                  <Text style={[styles.planDuration, formData.subscriptionPlanId === plan._id && { color: '#fff' }]}>{plan.durationInMonths} Months</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: COLORS.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>REGISTER BUSINESS</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 60, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  scrollContent: { paddingBottom: 40 },
  form: { padding: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, marginTop: 10, color: COLORS.primary },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray, marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, height: 55, fontSize: 15, borderWidth: 1, borderColor: '#eee' },
  textArea: { height: 100, paddingTop: 15, textAlignVertical: 'top' },
  plansGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  planCard: { flex: 1, minWidth: '30%', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#eee', alignItems: 'center', backgroundColor: '#fff' },
  selectedPlan: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  planName: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  planPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  planDuration: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
  submitBtn: { height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 5 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
