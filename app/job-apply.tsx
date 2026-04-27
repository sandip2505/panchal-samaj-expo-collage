import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { dataService } from '@/services/data.service';
import authService from '@/services/auth.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function JobApplyScreen() {
  const router = useRouter();
  const { jobId, jobTitle } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !experience) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const userData = await authService.getUserData();
      if (!userData) {
        Alert.alert('Login Required', 'Please login to apply for jobs');
        router.push('/login');
        return;
      }

      await dataService.applyForJob({
        jobId,
        memberId: userData.id || userData._id,
        applicantName: name,
        applicantEmail: email,
        applicantPhone: phone,
        experience,
        coverLetter
      });
      Alert.alert('Success', 'Application submitted successfully! The employer will contact you.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
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
        <Text style={styles.headerTitle}>Job Application</Text>
        <Text style={styles.headerSubtitle}>{jobTitle || 'Career Opportunity'}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Your Details</Text>
          
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>Email Address *</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>Years of Experience *</Text>
          <TextInput 
            style={styles.input}
            placeholder="e.g. 3 years"
            value={experience}
            onChangeText={setExperience}
          />

          <Text style={styles.inputLabel}>Cover Letter / Message</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Introduce yourself and why you're a good fit..."
            multiline
            numberOfLines={6}
            value={coverLetter}
            onChangeText={setCoverLetter}
          />

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: COLORS.primary }]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit Application</Text>}
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
  textArea: { height: 140, paddingTop: 15, textAlignVertical: 'top' },
  submitBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
