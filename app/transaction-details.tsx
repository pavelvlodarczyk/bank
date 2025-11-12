import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, SafeAreaView, Platform, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Transaction types
interface BaseTransaction {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  time: string;
  type: string;
  status: string;
  reference: string;
  fee: number;
  category: string;
  location: string;
}

interface TransferTransaction extends BaseTransaction {
  type: 'transfer';
  recipient: {
    name: string;
    account: string;
    bank: string;
  };
  description: string;
}

interface ATMTransaction extends BaseTransaction {
  type: 'atm';
  atmId: string;
}

interface CardTransaction extends BaseTransaction {
  type: 'card';
  merchant: string;
  cardLast4: string;
}

type Transaction = TransferTransaction | ATMTransaction | CardTransaction;

// Mock transaction data
const mockTransactions: Record<string, Transaction> = {
  '1': {
    id: '1',
    title: 'Przelew do Jan Kowalski',
    amount: -250.00,
    currency: 'PLN',
    date: '2024-11-10',
    time: '14:30',
    type: 'transfer',
    status: 'completed',
    recipient: {
      name: 'Jan Kowalski',
      account: '12 3456 7890 1234 5678 9012 3456',
      bank: 'Bank Millennium'
    },
    description: 'Za naprawę samochodu',
    reference: 'REF/2024/11/001234',
    fee: 0.00,
    category: 'Usługi',
    location: 'Aplikacja mobilna'
  },
  '2': {
    id: '2',
    title: 'Wypłata z bankomatu',
    amount: -200.00,
    currency: 'PLN',
    date: '2024-11-09',
    time: '18:45',
    type: 'atm',
    status: 'completed',
    location: 'Euronet - ul. Marszałkowska 1, Warszawa',
    reference: 'ATM/2024/11/005678',
    fee: 5.00,
    category: 'Wypłata gotówki',
    atmId: 'WAR001234'
  },
  '3': {
    id: '3',
    title: 'Płatność kartą - Żabka',
    amount: -15.50,
    currency: 'PLN',
    date: '2024-11-09',
    time: '12:15',
    type: 'card',
    status: 'completed',
    merchant: 'Żabka Polska sp. z o.o.',
    location: 'ul. Nowy Świat 25, Warszawa',
    reference: 'CARD/2024/11/009876',
    fee: 0.00,
    category: 'Zakupy spożywcze',
    cardLast4: '1234'
  }
};

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  
  // Animation setup - jednolita animacja wysuwania z dołu (100% wysokości ekranu)
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  
  useEffect(() => {
    // Entry animation - jednolita animacja wysuwania z dołu
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const transaction = mockTransactions[id as keyof typeof mockTransactions];
  
  if (!transaction) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colorScheme === 'dark' ? '#000000' : '#fff' }]}>
        <ThemedView style={styles.container}>
          <ThemedText>Nie znaleziono transakcji</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const isDark = colorScheme === 'dark';

  const handleClose = () => {
    if (Platform.OS === 'web') {
      // Exit animation - slide down
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.back();
      });
    } else {
      router.back();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'failed':
        return '#FF3B30';
      default:
        return isDark ? '#8E8E93' : '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Zrealizowana';
      case 'pending':
        return 'W trakcie';
      case 'failed':
        return 'Nieudana';
      default:
        return 'Nieznany';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'swap-horizontal';
      case 'atm':
        return 'cash';
      case 'card':
        return 'card';
      default:
        return 'help-circle';
    }
  };

  const ContainerComponent = Platform.OS === 'web' ? Animated.View : ThemedView;
  const containerStyle = Platform.OS === 'web' 
    ? [
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          overflow: 'visible' as const,
        }
      ]
    : styles.container;

  return (
    <ContainerComponent style={containerStyle}>
      <View style={[
        styles.modalContent,
        { backgroundColor: isDark ? '#000000' : '#fff' }
      ]}>
        <View style={[
          styles.header,
          {
            paddingTop: 16,
          }
        ]}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Szczegóły transakcji</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Transaction Summary - Hero Section */}
          <View style={[
            styles.summarySection,
            { 
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            }
          ]}>
            {/* Gradient background overlay */}
            <View style={[
              styles.gradientOverlay,
              { 
                backgroundColor: transaction.amount < 0 
                  ? (isDark ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 59, 48, 0.05)') 
                  : (isDark ? 'rgba(52, 199, 89, 0.1)' : 'rgba(52, 199, 89, 0.05)')
              }
            ]} />
            
            <View style={styles.summaryHeader}>
              <View style={[
                styles.typeIcon,
                { 
                  backgroundColor: transaction.amount < 0 
                    ? (isDark ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)') 
                    : (isDark ? 'rgba(52, 199, 89, 0.2)' : 'rgba(52, 199, 89, 0.1)'),
                  borderWidth: 2,
                  borderColor: transaction.amount < 0 
                    ? (isDark ? 'rgba(255, 59, 48, 0.3)' : 'rgba(255, 59, 48, 0.2)') 
                    : (isDark ? 'rgba(52, 199, 89, 0.3)' : 'rgba(52, 199, 89, 0.2)')
                }
              ]}>
                <Ionicons 
                  name={getTypeIcon(transaction.type)} 
                  size={28} 
                  color={transaction.amount < 0 ? '#FF3B30' : '#34C759'} 
                />
              </View>
              <View style={styles.summaryInfo}>
                <ThemedText style={styles.transactionTitle}>{transaction.title}</ThemedText>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(transaction.status) + '20' }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(transaction.status) }
                    ]} />
                    <ThemedText style={[
                      styles.statusText,
                      { color: getStatusColor(transaction.status) }
                    ]}>
                      {getStatusText(transaction.status)}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.amountContainer}>
              <ThemedText 
                style={[
                  styles.amount,
                  { 
                    color: transaction.amount < 0 ? '#FF3B30' : '#34C759',
                    fontWeight: Platform.OS === 'ios' ? '700' : '800'
                  }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={Platform.OS === 'ios'}
                allowFontScaling={false}
              >
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} {transaction.currency}
              </ThemedText>
              <View style={styles.dateTimeContainer}>
                <Ionicons 
                  name="time-outline" 
                  size={14} 
                  color={isDark ? '#8E8E93' : '#8E8E93'} 
                />
                <ThemedText style={styles.dateTime}>
                  {transaction.date} • {transaction.time}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Transaction Details */}
          <View style={[
            styles.detailsSection,
            { 
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            }
          ]}>
            <ThemedText style={styles.sectionTitle}>Szczegóły</ThemedText>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Numer referencyjny</ThemedText>
              <ThemedText style={styles.detailValue}>{transaction.reference}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Kategoria</ThemedText>
              <ThemedText style={styles.detailValue}>{transaction.category}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Lokalizacja</ThemedText>
              <ThemedText style={styles.detailValue}>{transaction.location}</ThemedText>
            </View>

            {transaction.fee > 0 && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Prowizja</ThemedText>
                <ThemedText style={[styles.detailValue, { color: '#FF3B30' }]}>
                  {transaction.fee.toFixed(2)} {transaction.currency}
                </ThemedText>
              </View>
            )}

            {transaction.type === 'transfer' && (transaction as TransferTransaction).description && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Opis</ThemedText>
                <ThemedText style={styles.detailValue}>{(transaction as TransferTransaction).description}</ThemedText>
              </View>
            )}
          </View>

          {/* Recipient Details (for transfers) */}
          {transaction.type === 'transfer' && (
            <View style={[
              styles.detailsSection,
              { 
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2C2C2E' : '#E5E5E7'
              }
            ]}>
              <ThemedText style={styles.sectionTitle}>Odbiorca</ThemedText>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Nazwa</ThemedText>
                <ThemedText style={styles.detailValue}>{(transaction as TransferTransaction).recipient.name}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Numer konta</ThemedText>
                <ThemedText style={[styles.detailValue, styles.accountNumber]}>
                  {(transaction as TransferTransaction).recipient.account}
                </ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Bank</ThemedText>
                <ThemedText style={styles.detailValue}>{(transaction as TransferTransaction).recipient.bank}</ThemedText>
              </View>
            </View>
          )}

          {/* Card Details (for card payments) */}
          {transaction.type === 'card' && (
            <View style={[
              styles.detailsSection,
              { 
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2C2C2E' : '#E5E5E7'
              }
            ]}>
              <ThemedText style={styles.sectionTitle}>Karta</ThemedText>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Ostatnie 4 cyfry</ThemedText>
                <ThemedText style={styles.detailValue}>•••• {(transaction as CardTransaction).cardLast4}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Sprzedawca</ThemedText>
                <ThemedText style={styles.detailValue}>{(transaction as CardTransaction).merchant}</ThemedText>
              </View>
            </View>
          )}

          {/* ATM Details */}
          {transaction.type === 'atm' && (
            <View style={[
              styles.detailsSection,
              { 
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                borderColor: isDark ? '#2C2C2E' : '#E5E5E7'
              }
            ]}>
              <ThemedText style={styles.sectionTitle}>Bankomat</ThemedText>
              
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>ID Bankomatu</ThemedText>
                <ThemedText style={styles.detailValue}>{(transaction as ATMTransaction).atmId}</ThemedText>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      zIndex: 1000,
      position: 'fixed' as any,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }),
  },
  modalContent: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      marginTop: '40px',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 10,
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  summarySection: {
    borderRadius: 20,
    padding: Platform.OS === 'ios' ? 32 : 28,
    paddingHorizontal: Platform.OS === 'ios' ? 28 : 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountContainer: {
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 24 : 16,
    width: '100%',
    minHeight: Platform.OS === 'ios' ? 60 : 50,
    justifyContent: 'center',
  },
  amount: {
    fontSize: Platform.OS === 'ios' ? 28 : 32,
    fontWeight: Platform.OS === 'ios' ? '700' : '800',
    marginBottom: 8,
    letterSpacing: Platform.OS === 'ios' ? 0 : -0.3,
    textAlign: 'center',
    width: '100%',
    lineHeight: Platform.OS === 'ios' ? 34 : undefined,
    includeFontPadding: false,
    flexShrink: 1,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dateTime: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
  },
  detailsSection: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(142, 142, 147, 0.15)',
  },
  detailLabel: {
    fontSize: 15,
    opacity: 0.8,
    flex: 1,
    marginRight: 16,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
    lineHeight: 20,
  },
  accountNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    letterSpacing: 1,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});