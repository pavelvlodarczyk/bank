import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabHeader } from '@/components/ui/tab-header';
import { Fonts } from '@/constants/theme';

interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  items: MarketplaceProduct[];
}

interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
  features: string[];
  provider: string;
  rating: number;
  color: string;
}

const marketplaceData: MarketplaceCategory[] = [
  {
    id: '1',
    name: 'Ubezpieczenia',
    description: 'Kompleksowa ochrona dla Ciebie i Twojej rodziny',
    icon: 'shield-checkmark',
    color: '#007AFF',
    items: [
      {
        id: '1',
        name: 'Ubezpieczenie OC/AC',
        description: 'Kompleksowe ubezpieczenie samochodu z rabatem dla klientów banku',
        price: 'od 89 zł/miesiąc',
        badge: '-15% rabat',
        features: ['Assistance 24/7', 'Samochód zastępczy', 'Ochrona prawna'],
        provider: 'Partner Insurance',
        rating: 4.8,
        color: '#007AFF'
      },
      {
        id: '2',
        name: 'Ubezpieczenie mieszkania',
        description: 'Ochrona Twojego domu i mienia przed nieprzewidzianymi zdarzeniami',
        price: 'od 25 zł/miesiąc',
        features: ['Ochrona przed pożarem', 'Kradzież z włamaniem', 'Zalanie'],
        provider: 'Home Protect',
        rating: 4.6,
        color: '#34C759'
      },
      {
        id: '3',
        name: 'Ubezpieczenie podróżne',
        description: 'Bezpieczne podróżowanie po całym świecie',
        price: 'od 8 zł/dzień',
        features: ['Koszty leczenia do 1M EUR', 'Bagaż i opóźnienia', 'Sport zimowy'],
        provider: 'Travel Safe',
        rating: 4.9,
        color: '#FF9500'
      }
    ]
  },
  {
    id: '2',
    name: 'Usługi dla biznesu',
    description: 'Rozwiązania wspierające rozwój Twojej firmy',
    icon: 'briefcase',
    color: '#AF52DE',
    items: [
      {
        id: '4',
        name: 'Terminal płatniczy',
        description: 'Przyjmuj płatności kartą w swojej firmie',
        price: '0 zł abonament',
        badge: 'Promocja',
        features: ['Płatności bezstykowe', 'Prowizja 1.2%', 'Raportowanie online'],
        provider: 'PayTech Solutions',
        rating: 4.7,
        color: '#AF52DE'
      },
      {
        id: '5',
        name: 'Faktoring',
        description: 'Szybka sprzedaż faktur i poprawa płynności finansowej',
        price: 'prowizja od 2.5%',
        features: ['Finansowanie do 90%', 'Bez zabezpieczeń', 'Ocena kontrahentów'],
        provider: 'FactorPro',
        rating: 4.5,
        color: '#FF2D92'
      }
    ]
  },
  {
    id: '3',
    name: 'Telekomunikacja',
    description: 'Nowoczesne rozwiązania komunikacyjne',
    icon: 'phone-portrait',
    color: '#34C759',
    items: [
      {
        id: '6',
        name: 'Abonament komórkowy',
        description: 'Nielimitowane rozmowy, SMS-y i internet',
        price: 'od 39 zł/miesiąc',
        badge: 'Rabat -20%',
        features: ['Internet bez limitu', '5G w całej Polsce', 'Roaming EU'],
        provider: 'MobileTech',
        rating: 4.4,
        color: '#34C759'
      },
      {
        id: '7',
        name: 'Internet domowy',
        description: 'Szybki internet światłowodowy do domu',
        price: 'od 49 zł/miesiąc',
        features: ['Do 1 Gb/s', 'Router w cenie', 'Instalacja gratis'],
        provider: 'FiberNet',
        rating: 4.6,
        color: '#5856D6'
      }
    ]
  },
  {
    id: '4',
    name: 'Lifestyle',
    description: 'Produkty i usługi na co dzień',
    icon: 'heart',
    color: '#FF3B30',
    items: [
      {
        id: '8',
        name: 'Karnet fitness',
        description: 'Dostęp do sieci klubów fitness w całej Polsce',
        price: 'od 99 zł/miesiąc',
        badge: 'Pierwsze 2 tygodnie gratis',
        features: ['Ponad 200 klubów', 'Zajęcia grupowe', 'Aplikacja mobilna'],
        provider: 'FitClub Network',
        rating: 4.3,
        color: '#FF3B30'
      }
    ]
  }
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#FF9500" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FF9500" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#FF9500" />
      );
    }

    return stars;
  };

  const renderProduct = (product: MarketplaceProduct) => (
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
          name="gift" 
          size={20} 
          color={product.color} 
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
          {product.badge && (
            <View style={[styles.statusDot, { backgroundColor: product.color }]} />
          )}
        </View>
        <ThemedText style={styles.productSubtitle}>{product.provider}</ThemedText>
        <ThemedText style={styles.productDetail}>
          {product.price} • ⭐ {product.rating}
        </ThemedText>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color={colorScheme === 'dark' ? '#8E8E93' : '#C7C7CC'} 
      />
    </TouchableOpacity>
  );

  const renderCategory = (category: MarketplaceCategory) => (
    <ThemedView key={category.id} style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '15' }]}>
          <Ionicons 
            name={category.icon as any} 
            size={24} 
            color={category.color} 
          />
        </View>
        <View style={styles.categoryInfo}>
          <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
          <ThemedText style={styles.categoryDescription}>{category.description}</ThemedText>
        </View>
      </View>
      
      <View style={styles.productsGrid}>
        {category.items.map(renderProduct)}
      </View>
    </ThemedView>
  );

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
        <ThemedView style={styles.heroSection}>
          <ThemedText style={styles.heroEmoji}>🛍️</ThemedText>
          <ThemedText style={styles.subtitle}>
            Odkryj szeroki wybór usług i produktów od zaufanych partnerów
          </ThemedText>

          <ThemedView style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>50+</ThemedText>
              <ThemedText style={styles.statLabel}>partnerów</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>200+</ThemedText>
              <ThemedText style={styles.statLabel}>produktów</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>95%</ThemedText>
              <ThemedText style={styles.statLabel}>zadowolenia</ThemedText>
            </View>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.categoriesContainer}>
          {marketplaceData.map(renderCategory)}
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
    paddingBottom: 32,
  },
  heroSection: {
    paddingHorizontal: 18,
    paddingVertical: 24,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 60,
    marginBottom: 16,
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
  categoriesContainer: {
    gap: 32,
  },
  categorySection: {
    gap: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  productsGrid: {
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
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
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
  providerText: {
    fontSize: 12,
    opacity: 0.6,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  },
});
