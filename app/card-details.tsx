import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, Animated, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

const cardData = {
  cardNumber: '5355 0348 5945 5045',
  maskedNumber: '1268 7068 2265 5248',
  expirationDate: '10/08/2024',
  cvv: '123',
  cardholderName: 'CHROVA CHRISTIE ADELAKLE',
  bankName: 'Bank Name',
  cardType: 'Debit',
  gradient: ['#4F46E5', '#8645f5ff', '#402ca8ff'] as const,
};

export default function CardDetailsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isCardLocked, setIsCardLocked] = useState(false);
  
  // Animation values - jednolita animacja wysuwania z dołu (100% wysokości ekranu)
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const handleLockCard = () => {
    Alert.alert(
      isCardLocked ? 'Odblokuj kartę' : 'Zablokuj kartę',
      isCardLocked ? 'Czy chcesz odblokować kartę?' : 'Czy chcesz zablokować kartę?',
      [
        { text: 'Anuluj', style: 'cancel' },
        { 
          text: isCardLocked ? 'Odblokuj' : 'Zablokuj',
          onPress: () => setIsCardLocked(!isCardLocked)
        }
      ]
    );
  };

  const handleCardHistory = () => {
    Alert.alert('Historia karty', 'Funkcja w przygotowaniu');
  };

  const handleCardSettings = () => {
    Alert.alert('Ustawienia karty', 'Funkcja w przygotowaniu');
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

  // Entry animation - jednolita animacja wysuwania z dołu
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const isDark = colorScheme === 'dark';

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          overflow: 'visible',
        }
      ]}
    >
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
          <ThemedText style={styles.headerTitle}>Detail Card</ThemedText>
          <View style={styles.placeholder} />
        </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card */}
      <View 
        style={styles.cardContainer}
      >
        <LinearGradient
          colors={cardData.gradient}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardType}>{cardData.cardType}</ThemedText>
            <View style={styles.bankInfo}>
              <ThemedText style={styles.bankName}>{cardData.bankName}</ThemedText>
              <ThemedText style={styles.bankSubtitle}>& Logo</ThemedText>
            </View>
          </View>

          <View style={styles.cardChip}>
            <View style={styles.chip} />
          </View>

          <View style={styles.cardBottom}>
            <ThemedText style={styles.cardNumber}>{cardData.cardNumber}</ThemedText>
            <ThemedText style={styles.cardExpiry}>12/24</ThemedText>
          </View>
          
          <ThemedText style={styles.cardHolder}>{cardData.cardholderName}</ThemedText>

          <View style={styles.cardLogo}>
            <View style={[styles.masterCardCircle, { backgroundColor: '#EB001B' }]} />
            <View style={[styles.masterCardCircle, { backgroundColor: '#F79E1B', marginLeft: -12 }]} />
          </View>
        </LinearGradient>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLockCard}>
          <View style={[styles.actionIcon, { backgroundColor: isCardLocked ? '#FF3B30' : '#4A3A7A' }]}>
            <Ionicons 
              name={isCardLocked ? "lock-closed" : "lock-open"} 
              size={24} 
              color="#FFFFFF" 
            />
          </View>
          <ThemedText style={styles.actionLabel}>
            {isCardLocked ? 'Unlock Card' : 'Lock Card'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleCardHistory}>
          <View style={[styles.actionIcon, { backgroundColor: '#4A3A7A' }]}>
            <Ionicons name="document-text" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.actionLabel}>History Card</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleCardSettings}>
          <View style={[styles.actionIcon, { backgroundColor: '#4A3A7A' }]}>
            <Ionicons name="settings" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.actionLabel}>Setting Card</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Card Information */}
      <ThemedView style={styles.infoSection}>
        <ThemedText style={styles.sectionTitle}>Card Information</ThemedText>
        
        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="card" size={20} color="#4A3A7A" />
          </View>
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Card Number</ThemedText>
            <ThemedText style={styles.infoValue}>{cardData.maskedNumber}</ThemedText>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="calendar" size={20} color="#4A3A7A" />
          </View>
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Expiration Date</ThemedText>
            <ThemedText style={styles.infoValue}>{cardData.expirationDate}</ThemedText>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="lock-closed" size={20} color="#4A3A7A" />
          </View>
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoLabel}>Information Cvv</ThemedText>
            <ThemedText style={styles.infoValue}>{cardData.expirationDate}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
    </View>
    </Animated.View>
  );
}const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  cardContainer: {
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: 320,
    height: 202, // 320/202 ≈ 1.585 (standardowe proporcje karty kredytowej)
    maxWidth: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  bankInfo: {
    alignItems: 'flex-end',
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bankSubtitle: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
  },
  cardChip: {
    marginBottom: 20,
  },
  chip: {
    width: 32,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  cardBottom: {
    marginBottom: 40,
  },
  cardExpiry: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  cardHolder: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    position: 'absolute',
    bottom: 30,
    left: 20,
    maxWidth: '55%',
  },
  cardLogo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  masterCardCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoSection: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(142, 142, 147, 0.2)',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});