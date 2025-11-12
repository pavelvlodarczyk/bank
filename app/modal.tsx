import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, TextInput, FlatList, View, SafeAreaView, Platform, KeyboardAvoidingView, Animated, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Mock data for search functionality
const mockData = [
  { id: '1', title: 'Konta bankowe', description: 'Zarządzaj swoimi kontami osobistymi i firmowymi', category: 'banking' },
  { id: '2', title: 'Karty płatnicze', description: 'Sprawdź limity, transakcje i ustawienia kart', category: 'cards' },
  { id: '3', title: 'Kredyty hipoteczne', description: 'Złóż wniosek o kredyt mieszkaniowy', category: 'loans' },
  { id: '4', title: 'Lokaty i oszczędności', description: 'Porównaj oferty lokat i kont oszczędnościowych', category: 'savings' },
  { id: '5', title: 'Inwestycje', description: 'Fundusze inwestycyjne i portfel akcji', category: 'investments' },
  { id: '6', title: 'Ubezpieczenia', description: 'Ubezpieczenia życiowe, majątkowe i podróżne', category: 'insurance' },
  { id: '7', title: 'Przelewy i płatności', description: 'Wykonuj przelewy krajowe i zagraniczne', category: 'transfers' },
  { id: '8', title: 'BLIK', description: 'Płatności mobilne i wypłaty z bankomatów', category: 'blik' },
  { id: '9', title: 'Kursy walut', description: 'Aktualne kursy wymiany walut', category: 'currency' },
  { id: '10', title: 'Kontakt z bankiem', description: 'Pomoc i wsparcie klienta', category: 'support' },
];

export default function ModalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(mockData);
  const [recentSearches, setRecentSearches] = useState([
    'przelew zagraniczny',
    'karta kredytowa',
    'lokaty bankowe',
    'ubezpieczenie mieszkania',
    'BLIK płatności',
    'kredyt hipoteczny'
  ]);

  // Animation values - jednolita animacja wysuwania z dołu (100% wysokości ekranu)
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

  useEffect(() => {
    // Filter data based on search query
    const filtered = mockData.filter(
      item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery]);

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

  const handleItemPress = (item: typeof mockData[0]) => {
    console.log('Selected item:', item);
    // Here you can handle item selection
    handleClose();
  };

  const handleRecentSearchPress = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    // Move the selected search to the top of recent searches
    const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 6);
    setRecentSearches(updatedRecent);
  };

  const renderSearchItem = ({ item, index }: { item: typeof mockData[0], index: number }) => {
    const isDark = colorScheme === 'dark';
    
    return (
      <TouchableOpacity 
        style={[
          styles.searchItem
        ]}
        onPress={() => handleItemPress(item)}
      >
        <View style={styles.itemContent}>
          <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
          <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#8E8E93' : '#C7C7CC'} 
        />
      </TouchableOpacity>
    );
  };  const isDark = colorScheme === 'dark';

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
        { backgroundColor: isDark ? '#000000' : '#F5F5F5' }
      ]}>
        {/* Header with Search Input */}
        <View style={[
          styles.header,
          {
            paddingTop: 16,
            borderBottomColor: isDark ? '#3A3A3C' : '#E5E5E7'
          }
        ]}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Ionicons 
              name="search" 
              size={20} 
              color={isDark ? '#8E8E93' : '#8E8E93'} 
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.headerSearchInput,
                { 
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  color: isDark ? '#FFFFFF' : '#000000',
                }
              ]}
              placeholder="Czego szukasz?"
              placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {searchQuery.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderSearchItem}
              keyExtractor={item => item.id}
              style={styles.searchResults}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons 
                    name="search" 
                    size={48} 
                    color={isDark ? '#3A3A3C' : '#C7C7CC'} 
                  />
                  <ThemedText style={styles.emptyText}>
                    Nie znaleziono wyników dla "{searchQuery}"
                  </ThemedText>
                </View>
              }
            />
          ) : (
            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => index.toString()}
              style={styles.recentSearchesList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <ThemedText style={styles.recentSearchesTitle}>
                  Ostatnie wyszukiwania
                </ThemedText>
              }
              renderItem={({ item: searchTerm, index }) => (
                <TouchableOpacity
                  style={[
                    styles.recentSearchItem,
                    { 
                      borderBottomColor: isDark ? '#2C2C2E' : '#E5E5E7',
                    }
                  ]}
                  onPress={() => handleRecentSearchPress(searchTerm)}
                >
                  <Ionicons 
                    name="time-outline" 
                    size={18} 
                    color={isDark ? '#8E8E93' : '#8E8E93'} 
                    style={styles.clockIcon}
                  />
                  <ThemedText style={styles.recentSearchText}>
                    {searchTerm}
                  </ThemedText>
                  <Ionicons 
                    name="arrow-up-outline" 
                    size={16} 
                    color={isDark ? '#8E8E93' : '#C7C7CC'} 
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <View style={styles.recentSearchesFooter}>
                  <ThemedText style={styles.footerText}>
                    Wpisz frazę w polu wyszukiwania powyżej lub wybierz z ostatnich wyszukiwań
                  </ThemedText>
                </View>
              }
            />
          )}
        </View>
      </View>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
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
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    position: 'relative',
  },
  headerSearchInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingLeft: 40,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iosContainer: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    position: 'relative',
  },
  closeButton: {
    padding: 12,
    borderRadius: 22,
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  scrollableContent: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  recentSearchesList: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 4,
  },

  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  searchResults: {
    flex: 1,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 16,
    opacity: 0.8,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  clockIcon: {
    marginRight: 12,
    opacity: 0.6,
  },
  recentSearchText: {
    flex: 1,
    fontSize: 16,
  },
  arrowIcon: {
    opacity: 0.5,
  },
  recentSearchesFooter: {
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});
