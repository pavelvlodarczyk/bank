import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TotalBalanceProps {
  amount: number;
  currency?: string;
  label?: string;
  onPress?: () => void;
}

const getColors = (colorScheme: 'light' | 'dark' | null | undefined) => ({
  text: colorScheme === 'dark' ? '#FFFFFF' : '#222222',
  textSecondary: colorScheme === 'dark' ? '#B0B0B0' : '#4C4C4C',
});

export function TotalBalance({ amount, currency = 'PLN', label = 'Łączne saldo', onPress }: TotalBalanceProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  const formatAmount = (value: number, curr: string) => {
    return new Intl.NumberFormat('pl-PL', { 
      style: 'currency', 
      currency: curr 
    }).format(value);
  };

  const content = (
    <View style={styles.totalRow}>
      <View>
        <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <View style={styles.totalAmountRow}>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            {formatAmount(amount, currency)}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={colors.text} 
            style={styles.totalChevron} 
          />
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  totalRow: {
    marginBottom: 18 
  },
  totalLabel: { 
    fontSize: 13 
  },
  totalAmountRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  totalAmount: { 
    fontSize: 32, 
    fontWeight: '700' 
  },
  totalChevron: { 
    marginLeft: 8 
  },
});