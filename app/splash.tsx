import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const ONBOARDING_KEY = 'hasSeenOnboarding';

// Keep native splash screen visible while we prepare
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AppSplashScreen() {
  const router = useRouter();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const bgScale = useRef(new Animated.Value(1.2)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide native splash and run custom one
    SplashScreen.hideAsync().catch(() => {});
    runAnimations();
  }, []);

  const runAnimations = () => {
    // 1) Background settle
    Animated.timing(bgScale, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // 2) Logo pop
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3) Title text fade in
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 4) Tagline fade in
    Animated.sequence([
      Animated.delay(900),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 5) Loading dots fade in, then navigate
    Animated.sequence([
      Animated.delay(1100),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 6) Navigate after total ~2.5 seconds
    setTimeout(() => navigateNext(), 2800);
  };

  const navigateNext = async () => {
    try {
      const [hasSeenOnboarding, userToken] = await Promise.all([
        SecureStore.getItemAsync(ONBOARDING_KEY),
        SecureStore.getItemAsync('userToken'),
      ]);

      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else if (userToken) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    } catch {
      router.replace('/onboarding');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Animated gradient background */}
      <Animated.View style={[styles.bgCircle1, { transform: [{ scale: bgScale }] }]} />
      <Animated.View style={[styles.bgCircle2, { transform: [{ scale: bgScale }] }]} />

      {/* Center content */}
      <View style={styles.centerContent}>
        {/* Logo circle */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoInner}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
          Panchal Samaj
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Our Community, Our Pride
        </Animated.Text>
      </View>

      {/* Bottom loading indicator */}
      <Animated.View style={[styles.bottomSection, { opacity: dotsOpacity }]}>
        <LoadingDots />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>

      {/* Bottom branding */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

// Animated loading dots
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          Animated.delay(800 - delay),
        ])
      );

    Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 267),
      animate(dot3, 534),
    ]).start();
  }, []);

  return (
    <View style={styles.dotsRow}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { opacity: dot }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    top: -height * 0.15,
    right: -width * 0.3,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -height * 0.12,
    left: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  centerContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  version: {
    position: 'absolute',
    bottom: 20,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});
