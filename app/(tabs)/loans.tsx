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

interface MyLoan {
  id: string;
  name: string;
  type: 'mortgage' | 'personal' | 'business';
  accountNumber?: string;
  remainingAmount: string;
  nextPayment: string;
  nextPaymentDate: string;
  interestRate: string;
  monthlyPayment: string;
  status: 'active' | 'closed' | 'overdue';
  startDate: string;
  maturityDate: string;
  color: string;
  emoji: string;
}

const myLoans: MyLoan[] = [
  {
    id: '1',
    name: 'Kredyt Hipoteczny',
    type: 'mortgage',
    accountNumber: 'KH-2024-001-789456',
    remainingAmount: '380 450,00 zł',
    nextPayment: '2 890,00 zł',
    nextPaymentDate: '15.01.2025',
    interestRate: '6.8%',
    monthlyPayment: '2 890,00 zł',
    status: 'active',
    startDate: '15.08.2019',
    maturityDate: '15.08.2044',
    color: '#007AFF',
    emoji: '🏠'
  },
  {
    id: '2', 
    name: 'Kredyt Konsumencki',
    type: 'personal',
    accountNumber: 'KK-2023-012-445678',
    remainingAmount: '42 780,00 zł',
    nextPayment: '1 245,00 zł',
    nextPaymentDate: '10.01.2025',
    interestRate: '8.9%',
    monthlyPayment: '1 245,00 zł',
    status: 'active',
    startDate: '10.03.2023',
    maturityDate: '10.03.2027',
    color: '#FF2D92',
    emoji: '💳'
  },
  {
    id: '3',
    name: 'Kredyt Samochodowy',
    type: 'personal',
    accountNumber: 'KS-2022-045-123789',
    remainingAmount: '18 900,00 zł',
    nextPayment: '890,00 zł',
    nextPaymentDate: '20.01.2025',
    interestRate: '7.2%',
    monthlyPayment: '890,00 zł',
    status: 'active',
    startDate: '20.06.2022',
    maturityDate: '20.06.2026',
    color: '#34C759',
    emoji: '�'
  }
];

export default function LoansScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mortgage': return 'HIPOTECZNY';
      case 'personal': return 'KONSUMENCKI';
      case 'business': return 'BIZNESOWY';
      default: return 'KREDYT';
    }
  };

  const renderLoan = (loan: MyLoan) => (
    <TouchableOpacity
      key={loan.id}
      style={[
        loanStyles.loanContainer,
        { 
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderColor: isDark ? '#3C3C43' : '#E5E5EA'
        }
      ]}
    >
      <View style={[loanStyles.loanIconContainer, { backgroundColor: loan.color + '15' }]}>
        <ThemedText style={loanStyles.iconEmoji}>{loan.emoji}</ThemedText>
      </View>
      <View style={loanStyles.contentContainer}>
        <View style={loanStyles.headerRow}>
          <ThemedText style={loanStyles.loanName}>{loan.name}</ThemedText>
          <View style={[loanStyles.statusDot, { backgroundColor: loan.status === 'active' ? '#34C759' : '#FF3B30' }]} />
        </View>
        <ThemedText style={loanStyles.loanSubtitle}>
          Pozostało: {loan.remainingAmount}
        </ThemedText>
        <ThemedText style={loanStyles.loanDetail}>
          Rata: {loan.monthlyPayment} • {loan.interestRate}
        </ThemedText>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={colorScheme === 'dark' ? '#8E8E93' : '#C7C7CC'}
      />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={loanStyles.container}>
      <TabHeader
        showSearch={true}
        showAvatar={true}
        onSearchPress={() => console.log('Search pressed')}
        onNotificationPress={() => console.log('Notifications pressed')}
      />
      
      <ScrollView 
        style={loanStyles.scrollContainer}
        contentContainerStyle={loanStyles.scrollContent}
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Moje kredyty
        </ThemedText>
      </ThemedView>
      <View style={loanStyles.spacer} />
      <ThemedText style={loanStyles.subtitle}>
        Zarządzaj swoimi aktywnymi kredytami i płatnościami
      </ThemedText>

      <ThemedView style={loanStyles.statsContainer}>
        <ThemedView style={loanStyles.statItem}>
          <ThemedText style={loanStyles.statNumber}>3</ThemedText>
          <ThemedText style={loanStyles.statLabel}>aktywnych kredytów</ThemedText>
        </ThemedView>
        <ThemedView style={loanStyles.statItem}>
          <ThemedText style={loanStyles.statNumber}>442,130 zł</ThemedText>
          <ThemedText style={loanStyles.statLabel}>łączne zadłużenie</ThemedText>
        </ThemedView>
        <ThemedView style={loanStyles.statItem}>
          <ThemedText style={loanStyles.statNumber}>5,025 zł</ThemedText>
          <ThemedText style={loanStyles.statLabel}>miesięczne raty</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={loanStyles.loansContainer}>
        {myLoans.map(renderLoan)}
      </ThemedView>
    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  }
});

const loanStyles = StyleSheet.create({
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
  quickCalculator: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  calculatorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  calculatorSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  calculatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calculatorLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  calculatorResult: {
    fontSize: 16,
    fontWeight: '600',
  },
  calculatorAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#007AFF',
  },
  loansContainer: {
    gap: 16,
  },
  loanContainer: {
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
  loanIconContainer: {
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  loanSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 2,
  },
  loanDetail: {
    fontSize: 12,
    opacity: 0.5,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  typeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  processingTime: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: '500',
  },
  loanContent: {
    gap: 16,
  },
  loanName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  loanDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  keyInfoContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  keyInfoItem: {
    flex: 1,
    backgroundColor: 'rgba(142, 142, 147, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  keyInfoLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: 4,
  },
  keyInfoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 1,
  },
  bullet: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 1,
  },
  listText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  accountNumber: {
    fontSize: 12,
    fontFamily: 'monospace',
    opacity: 0.7,
    marginTop: 4,
  },
  paymentInfo: {
    backgroundColor: 'rgba(142, 142, 147, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 13,
    opacity: 0.7,
  },
  detailsContainer: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
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
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
  },
  spacer: {
    height: 24,
  },
});
