import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors, COLORS } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { IconSymbol } from './ui/icon-symbol';
import Config from '../constants/Config';

interface MemberCardProps {
  member: any;
  onPress?: () => void;
}

export default function MemberCard({ member, onPress }: MemberCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        {member.photo ? (
          <Image 
            source={{ uri: Config.getImageUri(member.photo) || '' }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: COLORS.primary + '15' }]}>
            <Text style={[styles.avatarText, { color: COLORS.primary }]}>{member.firstname[0]}{member.lastname[0]}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{member.firstname} {member.lastname}</Text>
          <View style={[styles.idBadge, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.idText}>{member.personal_id}</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.meta}>
          <IconSymbol name="phone.fill" size={14} color={COLORS.primary} />
          <Text style={[styles.metaText, { color: colors.text }]}>{member.mobile_number}</Text>
        </View>
        <View style={styles.meta}>
          <IconSymbol name="mappin.circle.fill" size={14} color={COLORS.secondary} />
          <Text style={[styles.metaText, { color: colors.text }]}>{member.city || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  info: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  idBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  idText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
});
