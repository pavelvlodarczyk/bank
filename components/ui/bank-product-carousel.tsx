import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';

interface BankProduct {
  id: string;
  name: string;
  balance: string;
  number: string;
}

interface CarouselProps {
  products: BankProduct[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const BankProductCarousel: React.FC<CarouselProps> = ({ products, selectedId, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      snapToInterval={260}
      decelerationRate="fast"
    >
      {products.map((product) => (
        <View
          key={product.id}
          style={[
            styles.card,
            selectedId === product.id && styles.selectedCard,
          ]}
          onTouchEnd={() => onSelect(product.id)}
        >
          {/* Możesz dodać tu logo banku lub ikonę */}
          <View style={styles.cardContent}>
            <View style={styles.cardTitle}><Text style={styles.cardTitleText}>{product.name}</Text></View>
            <View style={styles.cardBalance}><Text style={styles.cardBalanceText}>{product.balance}</Text></View>
            <View style={styles.cardNumber}><Text style={styles.cardNumberText}>{product.number}</Text></View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    width: 240,
    marginRight: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    padding: 18,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4A3A7A',
  },
  cardContent: {
    width: '100%',
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardBalance: {
    marginBottom: 4,
  },
  cardBalanceText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4A3A7A',
  },
  cardNumber: {},
  cardNumberText: {
    fontSize: 14,
    color: '#888',
  },
});
