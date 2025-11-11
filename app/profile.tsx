import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image as RNImage, Animated, Easing, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

const { height: screenHeight } = Dimensions.get('window');

const getColors = (colorScheme: 'light' | 'dark' | null | undefined) => ({
  background: colorScheme === 'dark' ? '#000000' : '#f5f5f5',
  cardBackground: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
  text: colorScheme === 'dark' ? '#FFFFFF' : '#222222',
  textSecondary: colorScheme === 'dark' ? '#B0B0B0' : '#4C4C4C',
  textTertiary: colorScheme === 'dark' ? '#888888' : '#B0B0B0',
  border: colorScheme === 'dark' ? '#333333' : '#E2E4E8',
  accent: '#7B61FF',
  accentLight: colorScheme === 'dark' ? '#2A1F4F' : '#EDE7FE',
});

const profileOptions = [
  { id: 'settings', label: 'Ustawienia', icon: 'settings-outline', screen: '/settings' },
  { id: 'limits', label: 'Limity i blokady', icon: 'shield-outline', screen: '/limits' },
  { id: 'security', label: 'Bezpieczeństwo', icon: 'lock-closed-outline', screen: '/security' },
  { id: 'devices', label: 'Zaufane urządzenia', icon: 'phone-portrait-outline', screen: '/devices' },
  { id: 'notifications', label: 'Powiadomienia', icon: 'notifications-outline', screen: '/notifications' },
  { id: 'help', label: 'Pomoc i wsparcie', icon: 'help-circle-outline', screen: '/help' },
];

export default function ProfileModal() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleOptionPress = (screen: string) => {
    // Tutaj można dodać nawigację do konkretnych ekranów
    console.log(`Navigate to: ${screen}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <Animated.View
        style={[
          styles.modal,
          {
            backgroundColor: colors.background,
            transform: [{ translateY: slideAnim }],
            paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 20,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Profil</ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info Section */}
          <View style={[styles.userInfoSection, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.userInfoHeader}>
              <RNImage 
                source={{ uri: 'https://randomuser.me/api/portraits/women/10.jpg' }} 
                style={styles.profileAvatar} 
              />
              <View style={styles.userDetails}>
                <ThemedText style={styles.userName}>Iwona Kowalska</ThemedText>
              </View>
            </View>
            
            <View style={[styles.userStats, { borderTopColor: colors.border }]}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: colors.accent }]}>3</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Konta</ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: colors.accent }]}>2</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Karty</ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: colors.accent }]}>Premium</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Status</ThemedText>
              </View>
            </View>
          </View>

          {/* Options List */}
          <View style={[styles.optionsSection, { backgroundColor: colors.cardBackground }]}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  index !== profileOptions.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                ]}
                onPress={() => handleOptionPress(option.screen)}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIconContainer, { backgroundColor: colors.accentLight }]}>
                    <Ionicons name={option.icon as any} size={20} color={colors.accent} />
                  </View>
                  <ThemedText style={styles.optionLabel}>{option.label}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Account Info */}
          <View style={[styles.accountSection, { backgroundColor: colors.cardBackground }]}>
            <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Informacje o koncie
            </ThemedText>
            <View style={styles.accountInfo}>
              <View style={styles.accountInfoRow}>
                <ThemedText style={[styles.accountInfoLabel, { color: colors.textSecondary }]}>
                  Numer klienta:
                </ThemedText>
                <ThemedText style={styles.accountInfoValue}>12345678</ThemedText>
              </View>
              <View style={styles.accountInfoRow}>
                <ThemedText style={[styles.accountInfoLabel, { color: colors.textSecondary }]}>
                  Data dołączenia:
                </ThemedText>
                <ThemedText style={styles.accountInfoValue}>15.03.2020</ThemedText>
              </View>
              <View style={styles.accountInfoRow}>
                <ThemedText style={[styles.accountInfoLabel, { color: colors.textSecondary }]}>
                  Ostatnie logowanie:
                </ThemedText>
                <ThemedText style={styles.accountInfoValue}>Dziś, 14:30</ThemedText>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={[styles.logoutButton, { borderColor: colors.border }]}>
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <ThemedText style={styles.logoutText}>Wyloguj się</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userInfoSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
  },
  userStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    alignSelf: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  optionsSection: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountInfo: {
    gap: 8,
  },
  accountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoLabel: {
    fontSize: 14,
  },
  accountInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E74C3C',
  },
});