import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const getTabColors = (colorScheme: 'light' | 'dark' | null | undefined) => ({
    activeTintColor: '#7B61FF', // Firmowy fiolet pozostaje ten sam
    inactiveTintColor: colorScheme === 'dark' ? '#888888' : '#687076',
    backgroundColor: Platform.OS === 'ios' || Platform.OS === 'web' 
      ? 'transparent' 
      : colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderTopColor: Platform.OS === 'ios' || Platform.OS === 'web'
      ? 'rgba(226, 228, 232, 0.2)' // Delikatna, przezroczysta ramka
      : colorScheme === 'dark' ? '#333333' : '#E2E4E8',
  });

  const tabColors = getTabColors(colorScheme);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabColors.activeTintColor,
        tabBarInactiveTintColor: tabColors.inactiveTintColor,
        tabBarStyle: {
          borderTopColor: tabColors.borderTopColor,
          borderTopWidth: 1,
          backgroundColor: tabColors.backgroundColor,
          ...(Platform.OS === 'web' && {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }),
        },
        tabBarBackground: Platform.OS === 'ios' 
          ? () => (
              <BlurView 
                intensity={80} 
                tint={colorScheme === 'dark' ? 'dark' : 'light'} 
                style={{ flex: 1 }} 
              />
            )
          : undefined,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pulpit',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produkty',
          tabBarIcon: ({ color }) => <Ionicons name="apps" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Kredyty',
          tabBarIcon: ({ color }) => <Ionicons name="card" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="investments"
        options={{
          title: 'Inwestycje',
          tabBarIcon: ({ color }) => <Ionicons name="trending-up" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color }) => <Ionicons name="storefront" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
