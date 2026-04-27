import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SupportScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Assuming we need a memberId, in a real app we'd get it from auth context
      await dataService.createComplaint({
        subject,
        description,
        type: 'support',
        priority: 'medium'
      });
      Alert.alert('Success', 'Your support request has been submitted. Our team will contact you soon.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error submitting support request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} bounces={false}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helpdesk & Support</Text>
        <Text style={styles.headerSubtitle}>How can we help you today?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <IconSymbol name="phone.fill" size={24} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Call Us</Text>
            <Text style={styles.infoValue}>+91 98765 43210</Text>
          </View>
          <View style={styles.infoCard}>
            <IconSymbol name="envelope.fill" size={24} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Email Us</Text>
            <Text style={styles.infoValue}>support@panchalsamaj.com</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Submit a Request</Text>
          
          <Text style={styles.inputLabel}>Subject</Text>
          <TextInput 
            style={styles.input}
            placeholder="What is the issue about?"
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Tell us more details..."
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: COLORS.primary }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit Request</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 25, paddingTop: 60, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9, marginTop: 5 },
  content: { padding: 20, marginTop: -20 },
  infoSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoCard: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  infoLabel: { fontSize: 12, color: COLORS.gray, marginTop: 8 },
  infoValue: { fontSize: 13, fontWeight: 'bold', color: COLORS.black, marginTop: 2 },
  formCard: { backgroundColor: '#fff', borderRadius: 25, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: COLORS.black },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray, marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  textArea: { height: 120, paddingTop: 15, textAlignVertical: 'top' },
  submitBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
