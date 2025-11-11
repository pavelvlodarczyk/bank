import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabHeader } from '@/components/ui/tab-header';
import { Fonts } from '@/constants/theme';

interface MyProduct {
  id: string;
  name: string;
  type: 'account' | 'card' | 'deposit';
  accountNumber?: string;
  balance?: string;
  status: 'active' | 'blocked' | 'pending';
  lastActivity: string;
  icon: string;
  color: string;
  details: string;
}

const myProducts: MyProduct[] = [
  {
    id: '1',
    name: 'Konto Osobiste Premium',
    type: 'account',
    accountNumber: '12 3456 7890 1234 5678 9012',
    balance: '45 230,50 zł',
    status: 'active',
    lastActivity: 'Dzisiaj, 14:23',
    icon: 'wallet-outline',
    color: '#4A3A7A',
    details: 'Główne konto osobiste z kartą debetową'
  },
  {
    id: '2',
    name: 'Karta Kredytowa Gold',
    type: 'card',
    accountNumber: '**** **** **** 4592',
    balance: 'Limit: 15 000 zł | Dostępne: 12 340 zł',
    status: 'active',
    lastActivity: 'Wczoraj, 19:45',
    icon: 'card-outline',
    color: '#FF9500',
    details: 'Złota karta kredytowa z cashback'
  },
  {
    id: '3',
    name: 'Lokata Terminowa 12M',
    type: 'deposit',
    balance: '25 000,00 zł',
    status: 'active',
    lastActivity: '2 dni temu',
    icon: 'trending-up',
    color: '#AF52DE',
    details: 'Oprocentowanie: 5.5% | Do 15.03.2026'
  },
  {
    id: '4',
    name: 'Karta Debetowa Contactless',
    type: 'card',
    accountNumber: '**** **** **** 1247',
    balance: 'Połączona z kontem głównym',
    status: 'active',
    lastActivity: 'Dzisiaj, 12:15',
    icon: 'card',
    color: '#5856D6',
    details: 'Płatności bezstykowe, Apple Pay'
  },
  {
    id: '5',
    name: 'Konto Oszczędnościowe',
    type: 'account',
    accountNumber: '12 3456 7890 1234 5678 9087',
    balance: '8 750,25 zł',
    status: 'active',
    lastActivity: '5 dni temu',
    icon: 'wallet',
    color: '#34C759',
    details: 'Oprocentowanie: 3.2% w skali roku'
  }
];

export default function ProductsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'account': return 'KONTO';
      case 'card': return 'KARTA';
      case 'deposit': return 'LOKATA';
      default: return 'PRODUKT';
    }
  };

  const renderProduct = (product: MyProduct) => (
    <TouchableOpacity
      key={product.id}
      style={[
        styles.productContainer,
        { 
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#3C3C43' : '#E5E5EA'
        }
      ]}
    >
      <View style={[styles.productIconContainer, { backgroundColor: product.color + '15' }]}>
        <Ionicons 
          name={product.icon as any} 
          size={20} 
          color={product.color}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
          <View style={[styles.statusDot, { backgroundColor: product.status === 'active' ? '#34C759' : '#FF3B30' }]} />
        </View>
        <ThemedText style={styles.productSubtitle}>
          {product.balance}
        </ThemedText>
        {product.accountNumber && (
          <ThemedText style={styles.productDetail}>
            {product.accountNumber}
          </ThemedText>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={colorScheme === 'dark' ? '#8E8E93' : '#C7C7CC'}
      />
    </TouchableOpacity>
  );
  
  return (
    <ThemedView style={styles.container}>
      <TabHeader
        showContact={true}
        showAvatar={true}
        onContactPress={() => {
          console.log('Calling bank...');
          alert('Dzwonimy do banku: +48 800 123 456');
        }}
        onNotificationPress={() => console.log('Notifications pressed')}
      />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Produkty
        </ThemedText>
      </ThemedView>
      <View style={styles.spacer} />
      <ThemedView style={styles.productsContainer}>
        {myProducts.map(renderProduct)}
      </ThemedView>
    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  headerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  headerEmoji: {
    fontSize: Platform.OS === 'ios' ? 100 : 120,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  productsContainer: {
    gap: 16,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  productSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 2,
  },
  productDetail: {
    fontSize: 12,
    opacity: 0.5,
    fontFamily: 'monospace',
  },
  spacer: {
    height: 24,
  },
});


