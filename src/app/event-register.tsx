import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { dataService } from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EventRegisterScreen() {
  const router = useRouter();
  const { eventId, eventTitle } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [attendees, setAttendees] = useState('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !mobile || !attendees) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      await dataService.registerForEvent({
        eventId,
        name,
        mobile,
        numberOfAttendees: parseInt(attendees),
        notes
      });
      Alert.alert('Success', 'Registration successful! See you at the event.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error registering for event:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
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
        <Text style={styles.headerTitle}>Event Registration</Text>
        <Text style={styles.headerSubtitle}>{eventTitle || 'Community Event'}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Attendee Details</Text>
          
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Mobile Number *</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
          />

          <Text style={styles.inputLabel}>Number of Attendees *</Text>
          <TextInput 
            style={styles.input}
            placeholder="How many people?"
            keyboardType="numeric"
            value={attendees}
            onChangeText={setAttendees}
          />

          <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Any special requests or info..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: COLORS.primary }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Confirm Registration</Text>}
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
  formCard: { backgroundColor: '#fff', borderRadius: 25, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: COLORS.black },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray, marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  textArea: { height: 100, paddingTop: 15, textAlignVertical: 'top' },
  submitBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
