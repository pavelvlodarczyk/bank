import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const getTabColors = (colorScheme: 'light' | 'dark' | null | undefined) => ({
    activeTintColor: '#7B61FF', // Firmowy fiolet pozostaje ten sam
    inactiveTintColor: colorScheme === 'dark' ? '#888888' : '#687076',
    backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    borderTopColor: colorScheme === 'dark' ? '#333333' : '#E2E4E8',
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
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pulpit',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produkty',
          tabBarIcon: ({ color }) => <AntDesign name="product" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Kredyty',
          tabBarIcon: ({ color }) => <Entypo name="credit" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="investments"
        options={{
          title: 'Inwestycje',
          tabBarIcon: ({ color }) => <Entypo name="area-graph" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color }) => <AntDesign name="percentage" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
