import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Platform, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TransferScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Form state
  const [recipientName, setRecipientName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Animation values - jednolita animacja wysuwania z dołu (100% wysokości ekranu)
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  // Entry animation
  useEffect(() => {
    // Entry animation - jednolita animacja wysuwania z dołu
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-fill form from URL parameters
  useEffect(() => {
    if (params.name && typeof params.name === 'string') {
      setRecipientName(decodeURIComponent(params.name));
    }
    if (params.account && typeof params.account === 'string') {
      setAccountNumber(decodeURIComponent(params.account));
    }
    if (params.title && typeof params.title === 'string') {
      setTitle(decodeURIComponent(params.title));
    }
  }, [params]);

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

  const formatAccountNumber = (text: string) => {
    // Remove all non-digits
    const digits = text.replace(/\D/g, '');
    
    // Format as IBAN for Poland (PL + 24 digits with spaces every 4 digits)
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 10) return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
    if (digits.length <= 14) return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
    if (digits.length <= 18) return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 14)} ${digits.slice(14)}`;
    if (digits.length <= 22) return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 14)} ${digits.slice(14, 18)} ${digits.slice(18)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 14)} ${digits.slice(14, 18)} ${digits.slice(18, 22)} ${digits.slice(22, 26)}`;
  };

  const handleAccountNumberChange = (text: string) => {
    const formatted = formatAccountNumber(text);
    setAccountNumber(formatted);
  };

  const formatAmount = (text: string) => {
    // Remove all non-digits and dots
    const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '.');
    
    // Split by dot to handle decimal places
    const parts = cleaned.split('.');
    
    if (parts.length > 2) {
      // More than one dot, keep only first two parts
      return `${parts[0]}.${parts[1]}`;
    }
    
    if (parts.length === 2) {
      // Limit decimal places to 2
      return `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    
    return cleaned;
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    setAmount(formatted);
  };

  const validateForm = () => {
    if (!recipientName.trim()) {
      Alert.alert('Błąd', 'Podaj nazwę odbiorcy');
      return false;
    }
    
    if (!accountNumber.trim() || accountNumber.replace(/\s/g, '').length < 26) {
      Alert.alert('Błąd', 'Podaj prawidłowy numer rachunku (26 cyfr)');
      return false;
    }
    
    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Błąd', 'Podaj prawidłową kwotę');
      return false;
    }
    
    if (!title.trim()) {
      Alert.alert('Błąd', 'Podaj tytuł przelewu');
      return false;
    }
    
    return true;
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Przelew wysłany',
        `Przelew na kwotę ${amount} PLN dla ${recipientName} został wysłany pomyślnie.`,
        [
          {
            text: 'OK',
            onPress: handleClose
          }
        ]
      );
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się wysłać przelewu. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = colorScheme === 'dark';

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          overflow: 'visible',
        }
      ]}
    >
      <View style={[
        styles.modalContent, 
        { backgroundColor: isDark ? '#000000' : '#F5F5F5' }
      ]}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        {/* Header */}
        <View style={[
          styles.header, 
          { 
            paddingTop: 16,
            borderBottomColor: isDark ? '#3A3A3C' : '#E5E5E7'
          }
        ]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleClose}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Przelew</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Form */}
            <ThemedView style={styles.formSection}>
              {/* Recipient Name */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Nazwa odbiorcy</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#000000',
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  placeholder="Jan Kowalski"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                />
              </View>

              {/* Account Number */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Numer rachunku</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#000000',
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  value={accountNumber}
                  onChangeText={handleAccountNumberChange}
                  placeholder="PL 1234 5678 9012 3456 7890 1234"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                  keyboardType="numeric"
                  maxLength={32} // 26 digits + 6 spaces
                />
              </View>

              {/* Amount */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Kwota (PLN)</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    styles.amountInput,
                    { 
                      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#000000',
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Tytuł przelewu</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
                      color: isDark ? '#FFFFFF' : '#000000',
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Za usługi"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                />
              </View>
            </ThemedView>

            {/* Transfer Button */}
            <TouchableOpacity 
              style={[
                styles.transferButton,
                isLoading && styles.transferButtonDisabled
              ]}
              onPress={handleTransfer}
              disabled={isLoading}
            >
              {isLoading ? (
                <ThemedText style={styles.transferButtonText}>Wysyłanie...</ThemedText>
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                  <ThemedText style={styles.transferButtonText}>Wyślij przelew</ThemedText>
                </>
              )}
            </TouchableOpacity>

            {/* Info */}
            <ThemedView style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color="#4A3A7A" />
                <ThemedText style={styles.infoText}>
                  Przelew zostanie zrealizowany w ciągu 24h
                </ThemedText>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#4A3A7A" />
                <ThemedText style={styles.infoText}>
                  Wszystkie dane są szyfrowane i bezpieczne
                </ThemedText>
              </View>
            </ThemedView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
      marginTop: '10%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }),
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  formSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  amountInput: {
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 18,
  },
  transferButton: {
    backgroundColor: '#4A3A7A',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  transferButtonDisabled: {
    opacity: 0.6,
  },
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    borderRadius: 16,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    opacity: 0.8,
  },
});