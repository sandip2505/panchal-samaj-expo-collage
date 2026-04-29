import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors, COLORS } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import Config from '../constants/Config';
import { stripHtml } from '../utils/html-helper';

interface NewsCardProps {
  item: any;
  onPress?: () => void;
}

export default function NewsCard({ item, onPress }: NewsCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image 
            source={{ uri: Config.getImageUri(item.image) || '' }} 
            style={styles.image} 
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: COLORS.primary + '10' }]}>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>NEWS</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: colors.gray }]} numberOfLines={2}>
          {stripHtml(item.content)}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.date, { color: COLORS.primary }]}>
            {new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.readMore, { color: COLORS.secondary }]}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    width: 100,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  readMore: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
