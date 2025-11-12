import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Animated, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlikLogo } from '@/components/ui/blik-logo';
import { useRouter } from 'expo-router';

export default function BlikScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [blikCode, setBlikCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Animation values - jednolita animacja wysuwania z dołu (100% wysokości ekranu)
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const codeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const generateBlikCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setBlikCode(code);
    setTimeLeft(60);
    setIsActive(true);
    
    // Animate code appearance
    Animated.sequence([
      Animated.timing(codeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(codeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Start progress bar animation
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 60000,
      useNativeDriver: false,
    }).start();
  };

  const handleClose = () => {
    if (Platform.OS === 'web') {
      // Exit animation - slide down
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.back();
      });
    } else {
      router.back();
    }
  };

  const handleCopyCode = () => {
    if (blikCode && isActive) {
      // In a real app, this would copy to clipboard
      Alert.alert('Kod skopiowany', `Kod BLIK ${blikCode} został skopiowany do schowka`);
    }
  };

  // Entry animation and auto-generate code
  useEffect(() => {
    // Entry animation - jednolita animacja wysuwania z dołu
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Auto-generate BLIK code on modal open
    generateBlikCode();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsActive(false);
            setBlikCode('');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const isDark = colorScheme === 'dark';

  const ContainerComponent = Platform.OS === 'web' ? Animated.View : ThemedView;
  const containerStyle = Platform.OS === 'web' 
    ? [
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          overflow: 'visible' as const,
        }
      ]
    : styles.container;

  return (
    <ContainerComponent style={containerStyle}>
      <View style={[
        styles.modalContent, 
        { backgroundColor: isDark ? '#000000' : '#F5F5F5' }
      ]}>
        {/* Header */}
        <View style={[
          styles.header,
          {
            paddingTop: 16,
          }
        ]}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>BLIK</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* BLIK Logo and Info */}
        <View style={styles.logoSection}>
          <View style={styles.blikLogoContainer}>
            <BlikLogo size={60} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.title}>Twój kod BLIK</ThemedText>
        </View>

        {/* Code Display */}
        <ThemedView style={styles.codeSection}>
          {blikCode ? (
            <Animated.View 
              style={[
                styles.codeContainer,
                {
                  opacity: codeAnim,
                  transform: [{
                    scale: codeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }]
                }
              ]}
            >
              <ThemedText style={styles.codeText}>{blikCode}</ThemedText>
              <View style={styles.progressBarContainer}>
                <Animated.View 
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    }
                  ]}
                />
              </View>
              <ThemedText style={styles.timerText}>
                {formatTime(timeLeft)}
              </ThemedText>
              
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={handleCopyCode}
              >
                <Ionicons name="copy-outline" size={16} color={isDark ? '#FFFFFF' : '#000000'} />
                <ThemedText style={styles.copyButtonText}>Skopiuj kod</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={styles.placeholderContainer}>
              <ThemedText style={styles.placeholderText}>
                Generowanie kodu BLIK...
              </ThemedText>
            </View>
          )}
        </ThemedView>

        {/* Generate Button */}
        <TouchableOpacity 
          style={[
            styles.generateButton,
            isActive && styles.generateButtonActive
          ]}
          onPress={generateBlikCode}
        >
          <BlikLogo size={24} color="#FFFFFF" />
          <ThemedText style={styles.generateButtonText}>
            {isActive ? 'Generuj nowy kod BLIK' : 'Generuj nowy kod BLIK'}
          </ThemedText>
        </TouchableOpacity>

        {/* Info */}
        <ThemedView style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#4A3A7A" />
            <ThemedText style={styles.infoText}>
              Kod ważny przez 60 sekund
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#4A3A7A" />
            <ThemedText style={styles.infoText}>
              Bezpieczne płatności i wypłaty
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="card-outline" size={20} color="#4A3A7A" />
            <ThemedText style={styles.infoText}>
              Bez konieczności podawania numeru karty
            </ThemedText>
          </View>
        </ThemedView>
      </View>
    </View>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      zIndex: 1000,
      position: 'fixed' as any,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }),
  },
  modalContent: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      marginTop: '10%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 10,
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  blikLogoContainer: {
    width: 120,
    height: 80,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
  },
  codeSection: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  codeContainer: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },

  codeText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 16,
    lineHeight: 56,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A3A7A',
    borderRadius: 2,
  },
  timerText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  copyButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#999999',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  generateButtonActive: {
    backgroundColor: '#000000',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
});