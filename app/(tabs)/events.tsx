import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import dataService from '@/services/data.service';
import { Colors, COLORS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Config from '@/constants/Config';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EventsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await dataService.getEvents();
      setEvents(response);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderEvent = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.eventCard, { backgroundColor: '#fff' }]}
      onPress={() => router.push(`/event/${item._id}`)}
    >
      <View style={styles.imageContainer}>
        {item.bannerImage ? (
          <Image
            source={{ uri: Config.getImageUri(item.bannerImage) || '' }}
            style={styles.eventImage}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: COLORS.primary + '10' }]}>
            <IconSymbol name="calendar" size={40} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
          <Text style={styles.dateMonth}>{new Date(item.date).toLocaleString('default', { month: 'short' })}</Text>
        </View>
      </View>
      
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, { color: COLORS.black }]}>{item.title}</Text>
        
        <View style={styles.infoRow}>
          <IconSymbol name="clock.fill" size={14} color={COLORS.primary} />
          <Text style={[styles.infoText, { color: COLORS.gray }]}>
            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={styles.separator} />
          <IconSymbol name="mappin.circle.fill" size={14} color={COLORS.secondary} />
          <Text style={[styles.infoText, { color: COLORS.gray }]} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <Text style={[styles.eventDescription, { color: COLORS.gray }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.attendees}>
            <View style={[styles.avatarStack, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.stackText}>+</Text>
            </View>
            <Text style={styles.attendeeText}>{item.attendeeCount || 0} Attending</Text>
          </View>
          <TouchableOpacity 
            style={[styles.registerBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => router.push({
              pathname: '/event-register',
              params: { eventId: item._id, eventTitle: item.title }
            })}
          >
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Community Events</ThemedText>
        <TouchableOpacity style={styles.filterBtn}>
          <IconSymbol name="line.3.horizontal.decrease.circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="calendar.badge.exclamationmark" size={60} color={COLORS.gray} />
              <Text style={[styles.emptyText, { color: COLORS.gray }]}>No upcoming events</Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 25,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  filterBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  eventCard: {
    borderRadius: 30,
    marginBottom: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  eventContent: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  attendeeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
    marginLeft: 8,
  },
  registerBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 60,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});
