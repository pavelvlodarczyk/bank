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

interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'funds' | 'etf' | 'bonds' | 'crypto';
  currentValue: string;
  investedAmount: string;
  returnPercentage: string;
  returnAmount: string;
  color: string;
  icon: string;
  status: 'profit' | 'loss' | 'neutral';
  lastUpdate: string;
}

interface InvestmentProduct {
  id: string;
  name: string;
  type: 'stocks' | 'funds' | 'etf' | 'bonds' | 'crypto';
  description: string;
  expectedReturn: string;
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: string;
  features: string[];
  color: string;
  icon: string;
}

const myInvestments: Investment[] = [
  {
    id: '1',
    name: 'Fundusz Akcji Europejskich',
    type: 'funds',
    currentValue: '12 450,00 zł',
    investedAmount: '10 000,00 zł',
    returnPercentage: '+24.5%',
    returnAmount: '+2 450,00 zł',
    color: '#34C759',
    icon: 'trending-up',
    status: 'profit',
    lastUpdate: 'Dzisiaj, 16:30'
  },
  {
    id: '2',
    name: 'Apple Inc. (AAPL)',
    type: 'stocks',
    currentValue: '8 890,00 zł',
    investedAmount: '9 200,00 zł',
    returnPercentage: '-3.4%',
    returnAmount: '-310,00 zł',
    color: '#FF3B30',
    icon: 'trending-down',
    status: 'loss',
    lastUpdate: 'Dzisiaj, 16:30'
  },
  {
    id: '3',
    name: 'Vanguard S&P 500 ETF',
    type: 'etf',
    currentValue: '15 680,00 zł',
    investedAmount: '14 500,00 zł',
    returnPercentage: '+8.1%',
    returnAmount: '+1 180,00 zł',
    color: '#34C759',
    icon: 'trending-up',
    status: 'profit',
    lastUpdate: 'Dzisiaj, 16:30'
  },
  {
    id: '4',
    name: 'Bitcoin (BTC)',
    type: 'crypto',
    currentValue: '4 230,00 zł',
    investedAmount: '3 000,00 zł',
    returnPercentage: '+41.0%',
    returnAmount: '+1 230,00 zł',
    color: '#FF9500',
    icon: 'logo-bitcoin',
    status: 'profit',
    lastUpdate: 'Dzisiaj, 16:28'
  }
];

const investmentProducts: InvestmentProduct[] = [
  {
    id: '1',
    name: 'Fundusz Obligacji Skarbowych',
    type: 'bonds',
    description: 'Bezpieczne inwestycje w obligacje rządowe z przewidywalnym dochodem',
    expectedReturn: '5.2% rocznie',
    riskLevel: 'low',
    minInvestment: '500 zł',
    features: ['Gwarantowany zwrot', 'Niskie ryzyko', 'Regularne wypłaty odsetek'],
    color: '#007AFF',
    icon: 'shield-checkmark'
  },
  {
    id: '2',
    name: 'Fundusz Rynków Wschodzących',
    type: 'funds',
    description: 'Inwestycje w dynamicznie rozwijające się gospodarki świata',
    expectedReturn: '15.8% rocznie',
    riskLevel: 'high',
    minInvestment: '1 000 zł',
    features: ['Wysoki potencjał zysku', 'Dywersyfikacja geograficzna', 'Zarządzanie aktywne'],
    color: '#AF52DE',
    icon: 'globe'
  },
  {
    id: '3',
    name: 'Portfel ESG',
    type: 'etf',
    description: 'Inwestycje odpowiedzialne społecznie i środowiskowo',
    expectedReturn: '9.5% rocznie',
    riskLevel: 'medium',
    minInvestment: '200 zł',
    features: ['Inwestycje zrównoważone', 'Niskie opłaty', 'Automatyczna dywersyfikacja'],
    color: '#34C759',
    icon: 'leaf'
  }
];

export default function InvestmentsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const getTotalValue = () => {
    return myInvestments.reduce((sum, inv) => {
      const value = parseFloat(inv.currentValue.replace(/[^\d,]/g, '').replace(',', '.'));
      return sum + value;
    }, 0);
  };

  const getTotalInvested = () => {
    return myInvestments.reduce((sum, inv) => {
      const value = parseFloat(inv.investedAmount.replace(/[^\d,]/g, '').replace(',', '.'));
      return sum + value;
    }, 0);
  };

  const getTotalReturn = () => {
    const current = getTotalValue();
    const invested = getTotalInvested();
    const returnValue = current - invested;
    const returnPercentage = ((returnValue / invested) * 100);
    return {
      amount: returnValue.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      percentage: returnPercentage.toFixed(1)
    };
  };

  const renderInvestment = (investment: Investment) => (
    <TouchableOpacity
      key={investment.id}
      style={[
        styles.investmentContainer,
        { 
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#3C3C43' : '#E5E5EA'
        }
      ]}
    >
      <View style={[styles.investmentIconContainer, { backgroundColor: investment.color + '15' }]}>
        <Ionicons 
          name={investment.icon as any} 
          size={20} 
          color={investment.color} 
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.investmentName}>{investment.name}</ThemedText>
          <View style={[styles.statusDot, { backgroundColor: investment.color }]} />
        </View>
        <ThemedText style={styles.investmentSubtitle}>
          {investment.type === 'stocks' ? 'Akcje' : 
           investment.type === 'funds' ? 'Fundusz' : 
           investment.type === 'etf' ? 'ETF' : 
           investment.type === 'bonds' ? 'Obligacje' : 'Krypto'}
        </ThemedText>
        <ThemedText style={styles.investmentDetail}>
          {investment.currentValue} • {investment.returnPercentage}
        </ThemedText>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={colorScheme === 'dark' ? '#8E8E93' : '#C7C7CC'} 
      />
    </TouchableOpacity>
  );

  const renderProduct = (product: InvestmentProduct) => (
    <TouchableOpacity
      key={product.id}
      style={[
        styles.investmentContainer,
        { 
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#3C3C43' : '#E5E5EA'
        }
      ]}
    >
      <View style={[styles.investmentIconContainer, { backgroundColor: product.color + '15' }]}>
        <Ionicons 
          name={product.icon as any} 
          size={20} 
          color={product.color} 
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.investmentName}>{product.name}</ThemedText>
          <View style={[styles.statusDot, { backgroundColor: product.color }]} />
        </View>
        <ThemedText style={styles.investmentSubtitle}>
          {product.type === 'stocks' ? 'Akcje' : 
           product.type === 'funds' ? 'Fundusz' : 
           product.type === 'etf' ? 'ETF' : 
           product.type === 'bonds' ? 'Obligacje' : 'Krypto'}
        </ThemedText>
        <ThemedText style={styles.investmentDetail}>
          Zwrot: {product.expectedReturn} • Min: {product.minInvestment}
        </ThemedText>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={colorScheme === 'dark' ? '#8E8E93' : '#C7C7CC'} 
      />
    </TouchableOpacity>
  );

  const totalReturn = getTotalReturn();

  return (
    <ThemedView style={styles.container}>
      <TabHeader
        showSearch={true}
        showAvatar={true}
        onSearchPress={() => console.log('Search pressed')}
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
          Inwestycje
        </ThemedText>
      </ThemedView>
      <View style={styles.spacer} />
      <ThemedText style={styles.subtitle}>
        Zarządzaj swoim portfelem i odkrywaj nowe możliwości inwestycyjne
      </ThemedText>

      <ThemedView style={styles.portfolioSummary}>
        <ThemedText style={styles.summaryTitle}>Mój portfel</ThemedText>
        <ThemedView style={styles.summaryStats}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Wartość całkowita</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {getTotalValue().toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Zysk/Strata</ThemedText>
            <ThemedText style={[styles.summaryValue, { 
              color: parseFloat(totalReturn.percentage) >= 0 ? '#34C759' : '#FF3B30' 
            }]}>
              {parseFloat(totalReturn.percentage) >= 0 ? '+' : ''}{totalReturn.amount} zł ({totalReturn.percentage}%)
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Moje inwestycje</ThemedText>
        <ThemedView style={styles.investmentsContainer}>
          {myInvestments.map(renderInvestment)}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Dostępne produkty</ThemedText>
        <ThemedView style={styles.productsContainer}>
          {investmentProducts.map(renderProduct)}
        </ThemedView>
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
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
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
  portfolioSummary: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  investmentsContainer: {
    gap: 16,
  },
  investmentCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(142, 142, 147, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  investmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  investmentType: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  investmentValues: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  returnValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  investmentDetails: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(142, 142, 147, 0.2)',
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  productsContainer: {
    gap: 16,
  },
  productCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(142, 142, 147, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productTitleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
  },
  returnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  returnLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  featuresContainer: {
    gap: 6,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    flex: 1,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(142, 142, 147, 0.2)',
  },
  minInvestment: {
    fontSize: 12,
    opacity: 0.7,
  },
  investButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  investButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  investmentContainer: {
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
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  investmentSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 2,
  },
  investmentDetail: {
    fontSize: 12,
    opacity: 0.5,
  },
  spacer: {
    height: 24,
  },
});
