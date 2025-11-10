import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, TextInput, FlatList, View, SafeAreaView, Platform, KeyboardAvoidingView, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

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

  // Web-specific animations
  const fadeAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 0 : 1)).current;
  const slideAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 30 : 0)).current;

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Animate modal entrance on web
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
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
      // Animate modal exit on web
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
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
    
    const itemAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      if (Platform.OS === 'web') {
        Animated.timing(itemAnim, {
          toValue: 1,
          duration: 200,
          delay: index * 50, // Staggered animation
          useNativeDriver: true,
        }).start();
      }
    }, []);
    
    const ItemComponent = Platform.OS === 'web' ? Animated.View : View;
    const animatedStyle = Platform.OS === 'web' ? {
      opacity: itemAnim,
      transform: [{ translateY: itemAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0]
      })}]
    } : {};
    
    return (
      <ItemComponent style={animatedStyle}>
        <TouchableOpacity 
          style={[
            styles.searchItem,
            { 
              borderBottomColor: isDark ? '#2C2C2E' : '#E5E5E7',
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF'
            }
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
      </ItemComponent>
    );
  };

  const isDark = colorScheme === 'dark';

  const containerContent = Platform.OS === 'web' ? (
    <Animated.View style={[
      styles.modalContent,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      {/* Scrollable Content */}
      <View style={styles.scrollableContent}>
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
                    backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF'
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
                  Wpisz frazę powyżej lub wybierz z ostatnich wyszukiwań
                </ThemedText>
              </View>
            }
          />
        )}
      </View>

      {/* Sticky Search Footer */}
      <View style={[
        styles.stickyFooter,
        { 
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDark ? '#2C2C2E' : '#E5E5E7'
        }
      ]}>          
        <View style={styles.footerContainer}>
          {/* Search Input */}
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="search" 
              size={20} 
              color={isDark ? '#8E8E93' : '#8E8E93'} 
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchInput,
                { 
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  borderColor: isDark ? '#48484A' : '#C7C7CC',
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
          {/* Close button outside input */}
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  ) : (
    <View style={[
      styles.modalContent,
      Platform.OS === 'ios' && styles.iosContainer
    ]}>
        {/* Scrollable Content */}
        <View style={styles.scrollableContent}>
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
                      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF'
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
                    Wpisz frazę powyżej lub wybierz z ostatnich wyszukiwań
                  </ThemedText>
                </View>
              }
            />
          )}
        </View>

        {/* Sticky Search Footer */}
        <View style={[
          styles.stickyFooter,
          { 
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderTopColor: isDark ? '#2C2C2E' : '#E5E5E7'
          }
        ]}>          
          <View style={styles.footerContainer}>
            {/* Search Input */}
            <View style={styles.inputWrapper}>
              <Ionicons 
                name="search" 
                size={20} 
                color={isDark ? '#8E8E93' : '#8E8E93'} 
                style={styles.searchIcon}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { 
                    backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                    borderColor: isDark ? '#48484A' : '#C7C7CC',
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
            {/* Close button outside input */}
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={[
      styles.safeArea,
      { backgroundColor: isDark ? '#000000' : '#fff' }
    ]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ThemedView style={styles.container}>
          {containerContent}
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  },
  modalContent: {
    flex: 1,
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
    paddingHorizontal: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 10,
    paddingLeft: 56,
    paddingRight: 16,
    borderRadius: 12,
    borderWidth: 2,
    height: 44,
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
