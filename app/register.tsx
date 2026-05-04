import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, TextInput, TouchableOpacity, Text, Alert,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  Modal, FlatList, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dataService } from '../services/data.service';
import api from '../services/api.service';
import { Colors, COLORS } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { IconSymbol } from '../components/ui/icon-symbol';
import { RadioGroup } from '../components/ui/RadioGroup';

// ─── Types ────────────────────────────────────────────────────────
type Opt = { label: string; value: string };

// ─── Reusable Picker ──────────────────────────────────────────────
function PickerField({ label, value, options, onChange, icon, placeholder, colors }: {
  label: string; value: string; options: Opt[]; onChange: (v: string) => void;
  icon: string; placeholder?: string; colors: any;
}) {
  const [open, setOpen] = useState(false);
  const sel = options.find(o => o.value === value);
  return (
    <View style={s.group}>
      <Text style={[s.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity style={[s.row2, { borderColor: colors.border }]} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <IconSymbol name={icon as any} size={20} color={COLORS.gray} />
        <Text style={[s.pickerTxt, { color: sel ? colors.text : COLORS.gray }]}>
          {sel ? sel.label : (placeholder || `Select ${label}`)}
        </Text>
        <IconSymbol name="chevron.down" size={16} color={COLORS.gray} />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={s.sheet}>
          <View style={s.handle} />
          <Text style={s.sheetTitle}>{label}</Text>
          <FlatList
            data={options} keyExtractor={i => i.value}
            renderItem={({ item }) => (
              <TouchableOpacity style={[s.opt, item.value === value && { backgroundColor: COLORS.primary + '15' }]}
                onPress={() => { onChange(item.value); setOpen(false); }}>
                <Text style={[s.optTxt, item.value === value && { color: COLORS.primary, fontWeight: '700' }]}>{item.label}</Text>
                {item.value === value && <IconSymbol name="checkmark" size={18} color={COLORS.primary} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

// ─── Reusable Text Input ──────────────────────────────────────────
function Field({ label, value, onChange, placeholder, icon, secure, keyboard, multi, colors, editable = true }: any) {
  return (
    <View style={s.group}>
      <Text style={[s.label, { color: colors.text }]}>{label}</Text>
      <View style={[s.row2, { borderColor: colors.border, height: multi ? 90 : 52, alignItems: multi ? 'flex-start' : 'center', paddingTop: multi ? 12 : 0, backgroundColor: editable ? 'transparent' : '#f5f5f5' }]}>
        <IconSymbol name={icon} size={20} color={COLORS.gray} />
        <TextInput
          style={[s.inp, { color: colors.text, textAlignVertical: multi ? 'top' : 'center' }]}
          placeholder={placeholder} placeholderTextColor={COLORS.gray}
          value={value} onChangeText={onChange}
          secureTextEntry={secure} keyboardType={keyboard}
          multiline={multi} editable={editable}
          autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
        />
      </View>
    </View>
  );
}

// ─── Section Label ────────────────────────────────────────────────
function Section({ title }: { title: string }) {
  return (
    <View style={s.sec}>
      <View style={[s.secBar, { backgroundColor: COLORS.primary }]} />
      <Text style={[s.secTxt, { color: COLORS.primary }]}>{title}</Text>
    </View>
  );
}

// ─── Constants ────────────────────────────────────────────────────
const GENDERS: Opt[] = [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }];
const MARITAL: Opt[] = [
  { label: 'Single', value: 'Single' }, { label: 'Married', value: 'Married' },
  { label: 'Divorced', value: 'Divorced' }, { label: 'Widowed', value: 'Widowed' },
];

// ─── Main Screen ──────────────────────────────────────────────────
export default function RegisterScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [villages, setVillages] = useState<Opt[]>([]);
  const [photoUri, setPhotoUri] = useState('');
  const [bannerUri, setBannerUri] = useState('');
  const [payMethod, setPayMethod] = useState<'Cash' | 'Online' | ''>('');

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDate, setDobDate] = useState(new Date(2000, 0, 1));

  const [form, setForm] = useState({
    firstname: '', middlename: '', lastname: '',
    dob: '', gender: 'Male', email: '', mobile_number: '', password: '',
    address: '', state: 'Gujarat', city: '', pincode: '',
    locations_id: '', job: '', education: '', marital_status: 'Single',
  });

  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  // Load villages
  useEffect(() => {
    dataService.getVillages().then((data: any) => {
      const list = Array.isArray(data) ? data : data?.villages || data?.data || [];
      setVillages(list.map((v: any) => ({ label: v.name, value: v._id })));
    }).catch(() => { });
  }, []);

  // Date change handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDobDate(selectedDate);
      const formatted = selectedDate.toISOString().split('T')[0];
      upd('dob', formatted);
    }
  };

  // Image picker helper
  const pickImage = async (type: 'photo' | 'banner') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission required', 'Please allow media access.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true,
      aspect: type === 'photo' ? [1, 1] : [16, 9], quality: 0.8,
    });
    if (!res.canceled && res.assets[0]) {
      type === 'photo' ? setPhotoUri(res.assets[0].uri) : setBannerUri(res.assets[0].uri);
    }
  };

  // Upload image to server, returns URL string
  const uploadImage = async (uri: string, fieldName: string): Promise<string> => {
    const fd = new FormData();
    fd.append('file', { uri, name: `${fieldName}-${Date.now()}.jpg`, type: 'image/jpeg' } as any);
    const res = await api.post('/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data?.url || res.data?.data?.url || '';
  };

  const handleRegister = async () => {
    // Validation
    if (!form.firstname.trim() || !form.lastname.trim()) return Alert.alert('Error', 'First and Last name are required');
    if (!form.password || form.password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    if (form.mobile_number && !/^[0-9]{10}$/.test(form.mobile_number)) return Alert.alert('Error', 'Mobile must be 10 digits');
    if (form.pincode && !/^[0-9]{6}$/.test(form.pincode)) return Alert.alert('Error', 'Pincode must be 6 digits');
    if (!form.locations_id) return Alert.alert('Error', 'Please select your Village/Location');
    if (!payMethod) return Alert.alert('Error', 'Please select a payment method');

    if (payMethod === 'Online') {
      Alert.alert('Online Payment', 'Online payment will be available soon. Please use Cash for now.');
      return;
    }

    setLoading(true);
    try {
      // Upload images if chosen
      let photoUrl = '';
      let bannerUrl = '';
      if (photoUri) {
        try { photoUrl = await uploadImage(photoUri, 'photo'); } catch { /* skip if upload fails */ }
      }
      if (bannerUri) {
        try { bannerUrl = await uploadImage(bannerUri, 'banner'); } catch { /* skip if upload fails */ }
      }

      // Build payload — strip empty strings
      const payload: any = {};
      Object.entries(form).forEach(([k, v]) => { if (v && v.trim()) payload[k] = v.trim(); });
      if (photoUrl) payload.photo = photoUrl;
      if (bannerUrl) payload.profile_banner = bannerUrl;

      // Cash payment info passed to backend
      if (payMethod === 'Cash') {
        payload.initialPayment = { method: 'Cash', amount: 500 };
      }

      const result = await dataService.registerMember(payload);
      if (result) {
        Alert.alert('Registration Successful! 🎉',
          `Welcome to Panchal Samaj!\nYour Personal ID: ${result?.personal_id || result?.data?.personal_id || 'Check your profile'}\n\nPlease login to continue.`,
          [{ text: 'Login Now', onPress: () => router.replace('/login') }]
        );
      }
    } catch (error: any) {
      const msg = error?.error || error?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[s.header, { backgroundColor: COLORS.primary }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={s.htitle}>Create Account</Text>
          <Text style={s.hsub}>Join the Panchal Samaj community</Text>
        </View>

        <View style={s.card}>

          {/* ── Personal Info ── */}
          <Section title="Personal Information" />

          <View style={s.rowGap}>
            <View style={s.half}><Field label="First Name *" value={form.firstname} onChange={(v: string) => upd('firstname', v)} placeholder="First name" icon="person.fill" colors={colors} /></View>
            <View style={s.half}><Field label="Middle Name" value={form.middlename} onChange={(v: string) => upd('middlename', v)} placeholder="Father/Husband" icon="person.fill" colors={colors} /></View>
          </View>
          <Field label="Last Name *" value={form.lastname} onChange={(v: string) => upd('lastname', v)} placeholder="Last name" icon="person.fill" colors={colors} />

          {/* DOB with Custom Picker */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
            <Field
              label="Date of Birth"
              value={form.dob}
              placeholder="Select Date"
              icon="calendar"
              colors={colors}
              editable={false}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dobDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          <RadioGroup
            label="Gender"
            options={GENDERS}
            value={form.gender}
            onChange={v => upd('gender', v)}
            colors={colors}
          />

          {/* ── Contact ── */}
          <Section title="Contact Details" />
          <Field label="Email Address" value={form.email} onChange={(v: string) => upd('email', v)} placeholder="your@email.com" icon="envelope.fill" keyboard="email-address" colors={colors} />
          <Field label="Mobile Number *" value={form.mobile_number} onChange={(v: string) => upd('mobile_number', v)} placeholder="10-digit number" icon="phone.fill" keyboard="phone-pad" colors={colors} />
          <Field label="Password *" value={form.password} onChange={(v: string) => upd('password', v)} placeholder="Min. 6 characters" icon="lock.fill" secure colors={colors} />

          {/* ── Profile Photos ── */}
          <Section title="Profile Photos" />
          <Text style={[s.label, { color: colors.text }]}>Profile Photo</Text>
          <TouchableOpacity style={s.imgPicker} onPress={() => pickImage('photo')} activeOpacity={0.8}>
            {photoUri
              ? <Image source={{ uri: photoUri }} style={s.previewSquare} />
              : <View style={s.imgPlaceholder}>
                <IconSymbol name="camera.fill" size={32} color={COLORS.gray} />
                <Text style={s.imgHint}>Tap to upload profile photo</Text>
              </View>
            }
          </TouchableOpacity>

          <Text style={[s.label, { color: colors.text, marginTop: 14 }]}>Profile Banner</Text>
          <TouchableOpacity style={s.bannerPicker} onPress={() => pickImage('banner')} activeOpacity={0.8}>
            {bannerUri
              ? <Image source={{ uri: bannerUri }} style={s.previewBanner} />
              : <View style={s.imgPlaceholder}>
                <IconSymbol name="photo.fill" size={32} color={COLORS.gray} />
                <Text style={s.imgHint}>Tap to upload banner image (16:9)</Text>
              </View>
            }
          </TouchableOpacity>

          {/* ── Address ── */}
          <Section title="Address" />
          <Field label="Current Residential Address" value={form.address} onChange={(v: string) => upd('address', v)} placeholder="House no., Street, Area..." icon="mappin.circle.fill" multi colors={colors} />
          <View style={s.rowGap}>
            <View style={s.half}><Field label="City" value={form.city} onChange={(v: string) => upd('city', v)} placeholder="City" icon="building.2.fill" colors={colors} /></View>
            <View style={s.half}><Field label="State" value={form.state} onChange={(v: string) => upd('state', v)} placeholder="State" icon="map.fill" colors={colors} /></View>
          </View>
          <Field label="Pincode" value={form.pincode} onChange={(v: string) => upd('pincode', v)} placeholder="6-digit pincode" icon="number" keyboard="number-pad" colors={colors} />

          <PickerField
            label="Location (Village / Town) *"
            value={form.locations_id}
            options={villages.length > 0 ? villages : [{ label: 'Loading villages...', value: '' }]}
            onChange={v => upd('locations_id', v)}
            icon="mappin"
            placeholder="Select your village/town"
            colors={colors}
          />

          {/* ── Professional ── */}
          <Section title="Professional Details" />
          <Field label="Education" value={form.education} onChange={(v: string) => upd('education', v)} placeholder="e.g. B.Sc, MBA, 12th Pass" icon="book.fill" colors={colors} />
          <Field label="Job / Occupation" value={form.job} onChange={(v: string) => upd('job', v)} placeholder="e.g. Farmer, Engineer, Business" icon="briefcase.fill" colors={colors} />

          <PickerField
            label="Marital Status"
            value={form.marital_status}
            options={MARITAL}
            onChange={v => upd('marital_status', v)}
            icon="heart.fill"
            colors={colors}
          />

          {/* ── Payment ── */}
          <Section title="Registration Payment" />
          <Text style={[s.label, { color: colors.text, marginBottom: 12 }]}>Select Payment Method *</Text>
          <View style={s.payRow}>
            {/* Cash */}
            <TouchableOpacity
              style={[s.payCard, payMethod === 'Cash' && { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' }]}
              onPress={() => setPayMethod('Cash')} activeOpacity={0.8}
            >
              <IconSymbol name="banknote.fill" size={30} color={payMethod === 'Cash' ? COLORS.primary : COLORS.gray} />
              <Text style={[s.payLabel, { color: payMethod === 'Cash' ? COLORS.primary : colors.text }]}>Cash</Text>
              <Text style={s.payDesc}>Pay offline{'\n'}at office</Text>
              {payMethod === 'Cash' && (
                <View style={[s.payCheck, { backgroundColor: COLORS.primary }]}>
                  <IconSymbol name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Online */}
            <TouchableOpacity
              style={[s.payCard, payMethod === 'Online' && { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' }]}
              onPress={() => setPayMethod('Online')} activeOpacity={0.8}
            >
              <IconSymbol name="creditcard.fill" size={30} color={payMethod === 'Online' ? COLORS.primary : COLORS.gray} />
              <Text style={[s.payLabel, { color: payMethod === 'Online' ? COLORS.primary : colors.text }]}>Online</Text>
              <Text style={s.payDesc}>Pay via{'\n'}Razorpay</Text>
              <View style={s.comingSoon}><Text style={s.comingSoonTxt}>Soon</Text></View>
              {payMethod === 'Online' && (
                <View style={[s.payCheck, { backgroundColor: COLORS.primary }]}>
                  <IconSymbol name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {payMethod === 'Cash' && (
            <View style={[s.infoBox, { backgroundColor: '#fff8e1' }]}>
              <IconSymbol name="info.circle.fill" size={18} color="#f9a825" />
              <Text style={[s.infoTxt, { color: '#795548' }]}>
                Your registration will be recorded. Please pay ₹500 at the community office to complete activation.
              </Text>
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[s.btn, { backgroundColor: COLORS.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleRegister} disabled={loading} activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnTxt}>REGISTER NOW</Text>
            }
          </TouchableOpacity>

          <View style={s.footer}>
            <Text style={[s.footTxt, { color: COLORS.gray }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={[s.footLink, { color: COLORS.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 50 },

  header: { padding: 30, paddingTop: 60, paddingBottom: 55, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  htitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  hsub: { fontSize: 15, color: 'rgba(255,255,255,0.88)', marginTop: 4 },

  card: { margin: 15, marginTop: -30, backgroundColor: '#fff', borderRadius: 30, padding: 22, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 10, marginBottom: 20 },

  sec: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 14 },
  secBar: { width: 4, height: 18, borderRadius: 2, marginRight: 10 },
  secTxt: { fontSize: 15, fontWeight: '700' },

  group: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 7 },
  row2: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, height: 52 },
  pickerTxt: { flex: 1, fontSize: 15, marginLeft: 10 },
  inp: { flex: 1, height: '100%', marginLeft: 10, fontSize: 15 },

  rowGap: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },

  // Image pickers
  imgPicker: { borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed', overflow: 'hidden', marginBottom: 4 },
  bannerPicker: { borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed', overflow: 'hidden' },
  imgPlaceholder: { height: 120, justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#fafafa' },
  imgHint: { fontSize: 13, color: COLORS.gray },
  previewSquare: { width: '100%', height: 150, borderRadius: 12 },
  previewBanner: { width: '100%', height: 130, borderRadius: 12 },

  // Modal picker
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingBottom: 40, maxHeight: '65%' },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#ddd', marginTop: 12, marginBottom: 6 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 12 },
  opt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  optTxt: { fontSize: 15, color: '#333' },

  // Payment
  payRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  payCard: { flex: 1, borderRadius: 16, borderWidth: 2, borderColor: '#e0e0e0', padding: 16, alignItems: 'center', gap: 6, position: 'relative' },
  payLabel: { fontSize: 15, fontWeight: '700' },
  payDesc: { fontSize: 11, color: COLORS.gray, textAlign: 'center' },
  payCheck: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  comingSoon: { backgroundColor: '#FF9800', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  comingSoonTxt: { fontSize: 10, color: '#fff', fontWeight: '700' },

  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, marginBottom: 16 },
  infoTxt: { flex: 1, fontSize: 13, lineHeight: 20 },

  btn: { height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footTxt: { fontSize: 14 },
  footLink: { fontSize: 14, fontWeight: 'bold' },
});

