import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = 'hasSeenOnboarding';

const slides = [
  {
    id: '1',
    icon: 'person.3.fill' as const,
    title: 'Welcome to\nPanchal Samaj',
    subtitle: 'Your complete community portal connecting families, businesses, and culture across generations.',
    bgColor: '#e28867',
    lightBg: '#fde8dd',
    accent: '#c9623a',
  },
  {
    id: '2',
    icon: 'building.2.fill' as const,
    title: 'Discover &\nGrow Together',
    subtitle: 'Explore local businesses, upcoming events, job opportunities, and community news all in one place.',
    bgColor: '#5b8dee',
    lightBg: '#dde9ff',
    accent: '#3a6fd4',
  },
  {
    id: '3',
    icon: 'heart.fill' as const,
    title: 'Stay Connected\nWith Your Roots',
    subtitle: 'Access the member directory, participate in polls, donate to causes, and be part of something bigger.',
    bgColor: '#4caf50',
    lightBg: '#dff4e0',
    accent: '#388e3c',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    router.replace('/login');
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { width }]}>
      {/* Top curved background */}
      <View style={[styles.topSection, { backgroundColor: item.bgColor }]}>
        <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
          <IconSymbol name={item.icon} size={70} color="#fff" />
        </View>

        {/* Decorative circles */}
        <View style={[styles.decorCircle1, { borderColor: 'rgba(255,255,255,0.2)' }]} />
        <View style={[styles.decorCircle2, { borderColor: 'rgba(255,255,255,0.15)' }]} />
      </View>

      {/* Content card */}
      <View style={[styles.contentCard, { backgroundColor: item.lightBg }]}>
        <Text style={[styles.slideTitle, { color: item.accent }]}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  // Dot indicator
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });
        const bgColor = scrollX.interpolate({
          inputRange,
          outputRange: [COLORS.gray, slides[currentIndex].bgColor, COLORS.gray],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[styles.dot, { width: dotWidth, opacity, backgroundColor: bgColor }]}
          />
        );
      })}
    </View>
  );

  const isLast = currentIndex === slides.length - 1;
  const activeBg = slides[currentIndex].bgColor;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={activeBg} />

      {/* Skip Button */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={finishOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={renderSlide}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {renderDots()}

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: activeBg }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          {isLast ? (
            <Text style={styles.nextBtnText}>Get Started</Text>
          ) : (
            <IconSymbol name="chevron.right" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipBtn: {
    position: 'absolute',
    top: 55,
    right: 25,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  topSection: {
    width: '100%',
    height: height * 0.48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorCircle1: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 30,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 35,
  },
  contentCard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  slideSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    height: 56,
    minWidth: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
