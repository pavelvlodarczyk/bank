import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

const getColors = (colorScheme: 'light' | 'dark' | null | undefined) => ({
  inputBackground: colorScheme === 'dark' ? '#2A2A2A' : '#F2F2F2',
  textSecondary: colorScheme === 'dark' ? '#B0B0B0' : '#4C4C4C',
});

export function SearchWithAI() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <Link href="/modal" asChild>
      <TouchableOpacity style={styles.searchButton}>
        <LinearGradient
          colors={['#7B61FF', '#5B42E6', '#00A86B', '#FF6B6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.searchButtonGradient}
        >
          <View style={[styles.searchButtonContent, { backgroundColor: colors.inputBackground }]}>
            <Ionicons name="search" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={[styles.searchButtonText, { color: colors.textSecondary }]}>Szukaj</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  searchButton: { 
    alignSelf: 'center' 
  },
  searchButtonGradient: { 
    borderRadius: 20, 
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  searchButtonContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 18, 
    paddingHorizontal: 8, 
    paddingVertical: 4 
  },
  searchButtonText: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
});