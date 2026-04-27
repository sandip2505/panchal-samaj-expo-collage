import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { dataService } from '../services/data.service';
import { Colors, COLORS } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { IconSymbol } from '../components/ui/icon-symbol';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    mobile_number: '',
    password: '',
    gender: 'Male',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const { firstname, lastname, email, mobile_number, password } = formData;
    if (!firstname || !lastname || !email || !mobile_number || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await dataService.registerMember(formData);
      if (result) {
        Alert.alert('Success', 'Registration successful. Please login.', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join our community today</Text>
        </View>

        <View style={styles.form}>
          <InputGroup label="First Name *" value={formData.firstname} onChange={(val) => handleInputChange('firstname', val)} placeholder="Enter first name" icon="person.fill" colors={colors} />
          <InputGroup label="Middle Name" value={formData.middlename} onChange={(val) => handleInputChange('middlename', val)} placeholder="Enter middle name" icon="person.fill" colors={colors} />
          <InputGroup label="Last Name *" value={formData.lastname} onChange={(val) => handleInputChange('lastname', val)} placeholder="Enter last name" icon="person.fill" colors={colors} />
          
          <InputGroup label="Email Address *" value={formData.email} onChange={(val) => handleInputChange('email', val)} placeholder="Enter email" icon="envelope.fill" keyboardType="email-address" colors={colors} />
          <InputGroup label="Mobile Number *" value={formData.mobile_number} onChange={(val) => handleInputChange('mobile_number', val)} placeholder="Enter mobile number" icon="phone.fill" keyboardType="phone-pad" colors={colors} />
          <InputGroup label="Password *" value={formData.password} onChange={(val) => handleInputChange('password', val)} placeholder="Create password" icon="lock.fill" secureTextEntry colors={colors} />
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <InputGroup label="Gender" value={formData.gender} onChange={(val) => handleInputChange('gender', val)} placeholder="Male/Female" icon="person.fill" colors={colors} />
            </View>
            <View style={{ flex: 1 }}>
              <InputGroup label="DOB" value={formData.dob} onChange={(val) => handleInputChange('dob', val)} placeholder="YYYY-MM-DD" icon="calendar" colors={colors} />
            </View>
          </View>

          <InputGroup label="Full Address" value={formData.address} onChange={(val) => handleInputChange('address', val)} placeholder="Enter your address" icon="mappin.circle.fill" multiline colors={colors} />
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <InputGroup label="City" value={formData.city} onChange={(val) => handleInputChange('city', val)} placeholder="City" icon="building.2.fill" colors={colors} />
            </View>
            <View style={{ flex: 1 }}>
              <InputGroup label="State" value={formData.state} onChange={(val) => handleInputChange('state', val)} placeholder="State" icon="map.fill" colors={colors} />
            </View>
          </View>
          
          <InputGroup label="Pincode" value={formData.pincode} onChange={(val) => handleInputChange('pincode', val)} placeholder="Pincode" icon="number" keyboardType="number-pad" colors={colors} />

          <TouchableOpacity 
            style={[styles.registerBtn, { backgroundColor: COLORS.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerBtnText}>REGISTER NOW</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: COLORS.gray }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={[styles.loginLink, { color: COLORS.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputGroup({ label, value, onChange, placeholder, icon, secureTextEntry, keyboardType, multiline, colors }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.inputWrapper, { borderColor: colors.border, height: multiline ? 100 : 55 }]}>
        <IconSymbol name={icon} size={20} color={COLORS.gray} style={{ marginTop: multiline ? 15 : 0 }} />
        <TextInput
          style={[styles.input, { color: colors.text, textAlignVertical: multiline ? 'top' : 'center' }]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 30,
    paddingTop: 60,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    padding: 25,
    marginTop: -30,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
  },
  registerBtn: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
