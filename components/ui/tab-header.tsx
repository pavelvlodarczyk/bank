import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image as RNImage, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { BlurView } from 'expo-blur';

const profileAvatar = require('@/assets/images/avatars/profile.jpg');

interface TabHeaderProps {
  title?: string;
  showAvatar?: boolean;
  showNotifications?: boolean;
  showContact?: boolean;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  onContactPress?: () => void;
}

const getColors = (colorScheme: 'light' | 'dark' | null | undefined) => ({
  background: 'transparent', // Przezroczyste tło dla efektu blur
  text: colorScheme === 'dark' ? '#FFFFFF' : '#222222',
  iconBackground: colorScheme === 'dark' ? 'rgba(42, 42, 42, 0.8)' : 'rgba(242, 242, 242, 0.8)',
});

export function TabHeader({ 
  title = '', 
  showAvatar = false, 
  showNotifications = true, 
  showContact = false,
  onAvatarPress,
  onNotificationPress,
  onContactPress,
}: TabHeaderProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  const HeaderWrapper = Platform.OS === 'ios' ? BlurView : View;
  const blurProps = Platform.OS === 'ios' 
    ? { 
        intensity: 80, 
        tint: (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark',
        style: [styles.header, styles.blurHeader, { paddingTop: insets.top + 16 }]
      } 
    : { style: [styles.header, styles.blurHeader, { backgroundColor: 'transparent', paddingTop: insets.top + 16 }] };

  return (
    <HeaderWrapper {...blurProps}>
      <View style={styles.headerLeft}>
        {showAvatar && (
          <TouchableOpacity onPress={onAvatarPress} style={styles.avatarContainer}>
            <RNImage 
              style={styles.avatar}
              source={profileAvatar} 
            />
            <ThemedText style={styles.greetingText}>Cześć, Iwona!</ThemedText>
          </TouchableOpacity>
        )}
        {title && <ThemedText style={styles.headerTitle}>{title}</ThemedText>}
      </View>
      
      <View style={styles.headerRight}>
        {showContact && (
          <TouchableOpacity 
            style={[styles.headerIconBtn, { backgroundColor: colors.iconBackground }]}
            onPress={onContactPress}
          >
            <Ionicons name="call-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        {showNotifications && (
          <TouchableOpacity 
            style={[styles.headerIconBtn, { backgroundColor: colors.iconBackground }]}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </HeaderWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  blurHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  greetingText: { 
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
},
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    borderRadius: 16,
    padding: 8,
    marginLeft: 10,
  },
});