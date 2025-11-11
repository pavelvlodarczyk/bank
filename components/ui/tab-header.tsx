import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image as RNImage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

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
  background: colorScheme === 'dark' ? '#121212' : '#F8F8F8',
  text: colorScheme === 'dark' ? '#FFFFFF' : '#222222',
  iconBackground: colorScheme === 'dark' ? '#2A2A2A' : '#F2F2F2',
});

export function TabHeader({ 
  title = '', 
  showAvatar = false, 
  showNotifications = true, 
  showContact = false,
  onAvatarPress,
  onNotificationPress,
  onContactPress 
}: TabHeaderProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <View style={styles.headerLeft}>
        {showAvatar && (
          <TouchableOpacity onPress={onAvatarPress} style={styles.avatarContainer}>
            <RNImage 
              source={{ uri: 'https://randomuser.me/api/portraits/women/10.jpg' }} 
              style={styles.avatar} 
            />
            <ThemedText style={styles.greetingText}>Cześć, Iwona!</ThemedText>
          </TouchableOpacity>
        )}
        <ThemedText style={styles.headerTitle}>{title}</ThemedText>
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
    </View>
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