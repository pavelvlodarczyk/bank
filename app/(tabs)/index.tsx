import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, Image as RNImage, TouchableOpacity, ScrollView, Text, NativeScrollEvent, NativeSyntheticEvent, Animated, Easing, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { BlikLogo } from '@/components/ui/blik-logo';
import { Link, useRouter } from 'expo-router';
import { TabHeader } from '@/components/ui/tab-header';

type Card = { id: string; brand: string; number: string; balance: number; type: string; gradient: readonly [string, string, ...string[]]; cvv: string; expiration: string; fullNumber: string };

const getColors = (colorScheme: 'light' | 'dark' | null | undefined) => ({
  background: colorScheme === 'dark' ? '#121212' : '#F8F8F8',
  cardBackground: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
  text: colorScheme === 'dark' ? '#FFFFFF' : '#222222',
  textSecondary: colorScheme === 'dark' ? '#B0B0B0' : '#4C4C4C',
  textTertiary: colorScheme === 'dark' ? '#888888' : '#B0B0B0',
  border: colorScheme === 'dark' ? '#333333' : '#E2E4E8',
  inputBackground: colorScheme === 'dark' ? '#2A2A2A' : '#F2F2F2',
  iconBackground: colorScheme === 'dark' ? '#2A2A2A' : '#F2F2F2',
  accent: '#7B61FF',
  accentLight: colorScheme === 'dark' ? '#2A1F4F' : '#EDE7FE',
});

const cards: Card[] = [
  { id: '0', brand: 'Bank Pekao', number: '••• 1234', balance: 15678.90, type: 'Rachunek główny', gradient: ['#00A86B', '#228B22', '#006400'], cvv: '000', expiration: '00/00', fullNumber: '1234 5678 9012 1234' },
  { id: '1', brand: 'VISA', number: '••• 3245', balance: 10234.54, type: 'Karta debetowa', gradient: ['#7B61FF', '#5B42E6', '#3F2DC4'], cvv: '123', expiration: '12/27', fullNumber: '4532 1234 5678 3245' },
  { id: '2', brand: 'VISA', number: '••• 4432', balance: 22114.22, type: 'Karta Black', gradient: ['#4A4A4A', '#2D2D2D', '#1A1A1A'], cvv: '456', expiration: '08/26', fullNumber: '4532 9876 5432 4432' },
];

const transactions = [
  { id: '1', type: 'card', merchant: 'Allegro', amount: -189.99, date: '9 lis', icon: 'card-outline', category: 'Zakupy' },
  { id: '2', type: 'atm', merchant: 'Bankomat PKO BP', amount: -200.00, date: '8 lis', icon: 'cash-outline', category: 'Wypłata' },
  { id: '3', type: 'transfer', merchant: 'Jan Kowalski', amount: 500.00, date: '7 lis', icon: 'arrow-down-outline', category: 'Przelew' },
];

const recipients = [
  { id: 'blik', label: 'BLIK', blik: true },
  { id: 'new', label: 'Przelew', icon: 'add' as const },
  { id: 'ry', label: 'Rina Y.', text: 'RY' },
  { id: 'dad', label: 'Tata', text: 'Dad' },
  { id: 'ksu', label: 'Kasia B.', uri: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 'mum', label: 'Mama', uri: 'https://randomuser.me/api/portraits/women/66.jpg' },
  { id: 'die', label: 'Diana E.', uri: 'https://randomuser.me/api/portraits/women/67.jpg' },
];

export default function HomeScreen() {
  const [activeCard, setActiveCard] = useState(cards[0].id);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [flipAnimations, setFlipAnimations] = useState<Record<string, Animated.Value>>({});
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const [isSearchButtonHidden, setIsSearchButtonHidden] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const badgeAnim = useRef(new Animated.Value(1)).current;
  const searchButtonAnim = useRef(new Animated.Value(0)).current;
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardsScrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const router = useRouter();

  // Handle transaction press
  const handleTransactionPress = (transaction: any) => {
    // Map transaction IDs from home screen to transaction detail IDs
    let transactionDetailId = '1'; // Default to transfer
    
    if (transaction.id === '1') {
      transactionDetailId = '3'; // Card transaction (Allegro)
    } else if (transaction.id === '2') {
      transactionDetailId = '2'; // ATM transaction
    } else if (transaction.id === '3') {
      transactionDetailId = '1'; // Transfer transaction
    }
    
    router.push(`/transaction-details?id=${transactionDetailId}`);
  };

  // Handle search button animation
  useEffect(() => {
    // Hide if button is hidden OR if we're at bottom (static version shows)
    const shouldHide = isSearchButtonHidden || isAtBottom;
    
    Animated.timing(searchButtonAnim, {
      toValue: shouldHide ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isSearchButtonHidden, isAtBottom]);

  // Initialize flip animations for all cards
  useEffect(() => {
    const initialAnimations: Record<string, Animated.Value> = {};
    cards.forEach(card => {
      initialAnimations[card.id] = new Animated.Value(0);
    });
    setFlipAnimations(initialAnimations);
  }, []);

  // Badge animation effect
  useEffect(() => {
    const startBadgeAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(badgeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(badgeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startBadgeAnimation();
    
    // Cleanup timeout on unmount
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [badgeAnim]);

  const CARD_WIDTH = 240;
  const SPACING = 16;
  const START_OFFSET = 18 + 60 + SPACING; // left padding + addCard width + spacing

  const handleCardsScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    // Oblicz index najbliższej karty
    const relativeX = Math.max(0, x - (60 + SPACING)); // pomijamy kartę dodawania
    const index = Math.round(relativeX / (CARD_WIDTH + SPACING));
    const card = cards[index];
    if (card && card.id !== activeCard) setActiveCard(card.id);
  };

  const handleCardPress = (cardId: string) => {
    // Single tap triggers flip
    handleCardFlip(cardId);
    // Also set as active card
    setActiveCard(cardId);
  };

  const handleCardFlip = (cardId: string) => {
    const animValue = flipAnimations[cardId];
    if (!animValue) return; // Exit if animation not initialized yet

    const isFlipped = flippedCards[cardId] || false;
    const toValue = isFlipped ? 0 : 1;

    Animated.timing(animValue, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !isFlipped
    }));
  };

  const handleMainScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const currentScrollY = contentOffset.y;
    const scrollDiff = Math.abs(currentScrollY - lastScrollY);
    const contentHeight = contentSize.height;
    const screenHeight = layoutMeasurement.height;
    
    const SCROLL_THRESHOLD = 30; // Lowered threshold for more responsive
    const MIN_SCROLL_POSITION = 50; // Lowered minimum position
    const BOTTOM_BOUNCE_THRESHOLD = 50;
    
    // Only process if scroll difference is significant
    if (scrollDiff < SCROLL_THRESHOLD) return;
    
    // Check if we're in iOS bounce area
    const isInTopBounce = currentScrollY < 0;
    const isInBottomBounce = currentScrollY > (contentHeight - screenHeight + BOTTOM_BOUNCE_THRESHOLD);
    
    // Ignore bounce effects completely
    if (isInTopBounce || isInBottomBounce) {
      return;
    }
    
    const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    
    // Check if we're near the bottom of content
    const BOTTOM_THRESHOLD = 100; // Distance from bottom to trigger "at bottom" state
    const isNearBottom = currentScrollY >= (contentHeight - screenHeight - BOTTOM_THRESHOLD);
    
    // Update bottom state
    setIsAtBottom(isNearBottom);
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Set scrolling state
    if (!isScrolling) {
      setIsScrolling(true);
    }
    
    // Handle search button visibility
    if (scrollDirection === 'down' && currentScrollY > MIN_SCROLL_POSITION && !isInBottomBounce) {
      // Hide search button when scrolling down
      setIsSearchButtonHidden(true);
    } else if (scrollDirection === 'up' && currentScrollY >= 0 && !isInTopBounce) {
      // Show search button when scrolling up
      setIsSearchButtonHidden(false);
    }
    
    // Set timeout to reset scrolling state
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 200);
    
    // Only update lastScrollY if we're not in bounce area
    if (!isInTopBounce && !isInBottomBounce) {
      setLastScrollY(currentScrollY);
    }
  };
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Gradient overlay under notch/Dynamic Island */}
      {insets.top > 20 && (
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? ['#000000BB', '#1E1E1E88', '#1E1E1E55', '#1E1E1E22', '#1E1E1E00'] 
            : ['#FFFFFFBB', '#F8F8F888', '#F8F8F855', '#F8F8F822', '#F8F8F800']
          }
          style={[styles.notchGradient, { height: insets.top + 25 }]}
          pointerEvents="none"
        />
      )}
      
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        onScroll={handleMainScroll}
        scrollEventThrottle={100}
      >
      
      {/* Header (Safe Area aware) */}
      <TabHeader
        showSearch={true}
        showAvatar={true}
        onSearchPress={() => console.log('Search pressed')}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      {/* Total balance */}
      <View style={styles.totalRow}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Łączne saldo</Text>
          <View style={styles.totalAmountRow}>
            <Text style={[styles.totalAmount, { color: colors.text }]}>{new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(34534)}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={styles.totalChevron} />
          </View>
        </View>
      </View>

      {/* Cards carousel */}
      <ScrollView
        ref={cardsScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
        style={[styles.cardsScrollView]}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="start"
        onScroll={handleCardsScroll}
        scrollEventThrottle={16}
      >
        {cards.map(card => {
          const flipAnim = flipAnimations[card.id];
          const isFlipped = flippedCards[card.id] || false;
          
          // Skip rendering if animation not initialized yet
          if (!flipAnim) return null;
          
          const frontAnimatedStyle = {
            transform: [
              { perspective: 1000 },
              {
                rotateY: flipAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-180deg'],
                }),
              },
            ],
            opacity: flipAnim.interpolate({
              inputRange: [0, 0.5, 0.5, 1],
              outputRange: [1, 1, 0, 0],
            }),
          };

          const backAnimatedStyle = {
            transform: [
              { perspective: 1000 },
              {
                rotateY: flipAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['180deg', '0deg'],
                }),
              },
            ],
            opacity: flipAnim.interpolate({
              inputRange: [0, 0.5, 0.5, 1],
              outputRange: [0, 0, 1, 1],
            }),
          };

          return (
            <TouchableOpacity
              key={card.id}
              activeOpacity={1}
              onPress={() => handleCardPress(card.id)}
              style={[styles.cardWrapper, activeCard === card.id && styles.cardActive]}
            >
              {/* Front Side */}
              <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
                <LinearGradient colors={card.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardBrand}>{card.brand}</Text>
                    <Text style={styles.cardDots}>•••</Text>
                    <Text style={styles.cardNumber}>{card.number}</Text>
                  </View>
                  <View style={styles.cardBalanceBlock}>
                    <Text style={styles.cardBalance}>{new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(card.balance)}</Text>
                    <Text style={styles.cardType}>{card.type}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Back Side */}
              <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
                <LinearGradient colors={card.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient}>
                  <View style={styles.cardBackContent}>
                    {/* Header like front side */}
                    <View style={styles.cardBackHeader}>
                      <Text style={styles.cardBackTitle}>{card.type === 'Rachunek główny' ? 'Dane rachunku' : 'Dane karty'}</Text>
                    </View>
                    
                    {/* Content area with bottom alignment like front */}
                    <View style={styles.cardBackMainArea}>
                      {card.type === 'Rachunek główny' ? (
                        <View style={styles.cardBackInfoRow}>
                          <View style={styles.cardBackLeftInfo}>
                            <Text style={styles.cardBackLabel}>IBAN</Text>
                            <Text style={styles.cardBackValue}>PL 1234 5678 9012 3456</Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.cardBackInfoRow}>
                          <View style={styles.cardBackLeftInfo}>
                            <Text style={styles.cardBackLabel}>CVV</Text>
                            <Text style={styles.cardBackValue}>{card.cvv}</Text>
                          </View>
                          <View style={styles.cardBackRightInfo}>
                            <Text style={styles.cardBackLabel}>Data ważności</Text>
                            <Text style={styles.cardBackValue}>{card.expiration}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={[styles.addCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Ionicons name="add" size={28} color={colors.accent} />
        </TouchableOpacity>
      </ScrollView>

      {/* Transfers */}
      <View style={styles.transfersSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Płatności</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.transfersList}>
          {recipients.map(r => (
            <View key={r.id} style={styles.transferItem}>
              {r.blik ? (
                <View style={[styles.transferAvatar, styles.transferAvatarBlik]}><BlikLogo size={28} color="#FFFFFF" /></View>
              ) : r.icon ? (
                <View style={[styles.transferAvatar, styles.transferAvatarNew, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}><Ionicons name={r.icon} size={22} color={colors.accent} /></View>
              ) : r.text ? (
                <View style={[styles.transferAvatar, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}><Text style={[styles.transferAvatarText, { color: colors.text }]}>{r.text}</Text></View>
              ) : (
                <RNImage source={{ uri: r.uri }} style={styles.transferAvatarImg} />
              )}
              <Text style={[styles.transferName, { color: colors.text }]}>{r.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ostatnie transakcje</Text>
        <View style={[styles.transactionsCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {transactions.map((transaction, index) => (
            <View key={transaction.id}>
              <TouchableOpacity 
                style={styles.transactionItem}
                onPress={() => handleTransactionPress(transaction)}
              >
                <View style={[styles.transactionIcon, { backgroundColor: colorScheme === 'dark' ? '#4A3A7A' : '#EDE7FE' }]}>
                  <Ionicons name={transaction.icon as any} size={20} color={colors.accent} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionMerchant, { color: colors.text }]}>{transaction.merchant}</Text>
                  <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>{transaction.category}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color: transaction.amount > 0 ? '#00A86B' : colors.text }]}>
                    {transaction.amount > 0 ? '+' : ''}{new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(transaction.amount)}
                  </Text>
                  <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>{transaction.date}</Text>
                </View>
              </TouchableOpacity>
              {index < transactions.length - 1 && <View style={[styles.transactionSeparator, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </View>
      </View>

      {/* Services */}
      <View style={styles.servicesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Usługi</Text>
        <View style={[styles.servicesCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.serviceItem}>
            <View style={[styles.serviceIcon, { backgroundColor: colorScheme === 'dark' ? '#4A3A7A' : '#EDE7FE' }]}><Ionicons name="globe-outline" size={20} color={colors.accent} /></View>
            <View style={styles.serviceNameWrapper}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Konto walutowe</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
          <View style={[styles.serviceSeparator, { backgroundColor: colors.border }]} />
          <Link href="/card-details" asChild>
            <TouchableOpacity style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: colorScheme === 'dark' ? '#4A3A7A' : '#EDE7FE' }]}><Ionicons name="card-outline" size={20} color={colors.accent} /></View>
              <View style={styles.serviceNameWrapper}>
                <Text style={[styles.serviceName, { color: colors.text }]}>Karta kredytowa</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </Link>
          <View style={[styles.serviceSeparator, { backgroundColor: colors.border }]} />
          <View style={styles.serviceItem}>
            <View style={[styles.serviceIcon, { backgroundColor: colorScheme === 'dark' ? '#4A3A7A' : '#EDE7FE' }]}><Ionicons name="cash-outline" size={20} color={colors.accent} /></View>
            <View style={styles.serviceNameWrapper}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Kredyty</Text>
              <Animated.View style={[styles.badge, { opacity: badgeAnim, backgroundColor: colors.accent }]} />
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
        </View>
      </View>

      {/* Static Search Button at Bottom of Content */}
      <View style={styles.staticSearchWrapper}>
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
                <Text style={[styles.searchButtonText, { color: colors.textSecondary }]}>Szukaj z AI</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </View>
      </ScrollView>
      
      {/* Fixed Search Button at Bottom */}
      <Animated.View
        style={[
          styles.fixedSearchWrapper, 
          { 
            bottom: 10,
            transform: [{
              translateY: searchButtonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100],
              })
            }]
          }
        ]}
      >
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
                <Text style={[styles.searchButtonText, { color: colors.textSecondary }]}>Szukaj z AI</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </Animated.View>


    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  notchGradient: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  fixedSearchWrapper: { position: 'absolute', left: 0, right: 0, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 4 },
  staticSearchWrapper: { paddingHorizontal: 18, paddingVertical: 20, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 18 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, marginRight: 8 },
  greetingText: { fontSize: 18, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: { borderRadius: 16, padding: 8, marginLeft: 10 },
  searchButton: { alignSelf: 'center' },
  searchButtonGradient: { 
    borderRadius: 20, 
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  searchButtonContent: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10 },
  searchButtonText: { fontSize: 14, fontWeight: '500' },
  totalRow: { paddingHorizontal: 18, marginBottom: 18 },
  totalLabel: { fontSize: 13 },
  totalAmountRow: { flexDirection: 'row', alignItems: 'center' },
  totalAmount: { fontSize: 32, fontWeight: '700' },
  totalChevron: { marginLeft: 8 },
  cardsScrollView: { 
    overflow: 'visible',
    ...(Platform.OS === 'web' && {
      // @ts-ignore - Web-specific CSS properties
      overflowX: 'auto',
      overflowY: 'visible',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch',
      paddingTop: 20,
      paddingBottom: 20,
      marginTop: -20,
      marginBottom: -20,
    })
  },
  cardsRow: { paddingLeft: 18, paddingRight: 10, overflow: 'visible' },
  addCard: { width: 60, height: 140, borderRadius: 12, marginRight: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  cardWrapper: { 
    width: 240, 
    height: 140, 
    marginRight: 16, 
    overflow: 'visible',
    ...(Platform.OS === 'web' && {
      // Delikatny obszar ochronny tylko dla web
      transform: [{ scale: 1 }], // Force compositing layer
      zIndex: 1,
    }),
  },
  cardActive: {},
  cardGradient: { flex: 1, borderRadius: 12, padding: 18, justifyContent: 'space-between'},
  cardTopRow: { flexDirection: 'row', alignItems: 'center' },
  cardBrand: { fontSize: 14, fontWeight: '700', color: '#fff', marginRight: 8 },
  cardDots: { fontSize: 18, color: '#fff', marginRight: 4, marginTop: -3 },
  cardNumber: { fontSize: 14, color: '#fff' },
  cardBalanceBlock: {},
  cardBalance: { fontSize: 22, fontWeight: '700', color: '#fff' },
  cardType: { fontSize: 13, color: '#F2F2F2', marginTop: 2 },
  transfersSection: { marginTop: 24, paddingHorizontal: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  transfersList: { flexDirection: 'row', alignItems: 'flex-start' },
  transferItem: { alignItems: 'center', marginRight: 16, width: 60 },
  transferAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 1 },
  transferAvatarNew: {},
  transferAvatarBlik: { backgroundColor: '#000000' },
  transferAvatarText: { fontWeight: '700', fontSize: 16 },
  transferAvatarImg: { width: 48, height: 48, borderRadius: 24, marginBottom: 6 },
  transferName: { fontSize: 12, textAlign: 'center' },
  transactionsSection: { marginTop: 24, paddingHorizontal: 18 },
  transactionsCard: { borderRadius: 14, borderWidth: 1 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  transactionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transactionDetails: { flex: 1 },
  transactionMerchant: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  transactionCategory: { fontSize: 13 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  transactionDate: { fontSize: 13 },
  transactionSeparator: { height: 1, marginHorizontal: 16 },
  servicesSection: { marginTop: 28, paddingHorizontal: 18 },
  servicesCard: { borderRadius: 14, borderWidth: 1 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  serviceSeparator: { height: 1, marginHorizontal: 16 },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  serviceNameWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  serviceName: { fontSize: 15, fontWeight: '500' },
  badge: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  // Card flip animation styles
  cardFace: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' },
  cardBack: {},
  cardBackContent: { flex: 1, justifyContent: 'space-between' },
  cardBackHeader: { marginBottom: 0 },
  cardBackTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 0 },
  cardBackMainArea: { justifyContent: 'flex-end' },
  cardBackInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardBackLeftInfo: { alignItems: 'flex-start' },
  cardBackRightInfo: { alignItems: 'flex-end' },
  cardBackLabel: { fontSize: 12, color: '#F2F2F2', marginBottom: 2 },
  cardBackValue: { fontSize: 14, fontWeight: '700', color: '#fff' },

});
