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
import * as LocalAuthentication from 'expo-local-authentication';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TransferScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Account data
  const accounts = [
    { id: '1', number: '*6034', balance: 75399.72, name: 'Konto osobiste', type: 'Konto ROR' },
    { id: '2', number: '*7812', balance: 15280.50, name: 'Konto oszczędnościowe', type: 'Lokata' },
    { id: '3', number: '*9456', balance: 8500.00, name: 'Konto firmowe', type: 'Konto biznesowe' },
    { id: '4', number: '*2234', balance: 2450.25, name: 'Konto młodzieżowe', type: 'Konto Student' },
    { id: '5', number: '*8891', balance: 45678.90, name: 'Konto premium', type: 'Konto Premium' },
    { id: '6', number: '*1122', balance: 567.33, name: 'Konto dodatkowe', type: 'Konto pomocnicze' },
    { id: '7', number: '*5577', balance: 12345.67, name: 'Konto inwestycyjne', type: 'Maklerskie' },
  ];

  // Form state
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [transferDate, setTransferDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [showPinInput, setShowPinInput] = useState<boolean>(false);
  
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

    const validateForm = (): boolean => {
    if (!recipientName.trim()) {
      Alert.alert('Błąd', 'Podaj nazwę odbiorcy');
      return false;
    }
    
    if (!recipientAddress.trim()) {
      Alert.alert('Błąd', 'Podaj adres odbiorcy');
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
    
    if (!transferDate) {
      Alert.alert('Błąd', 'Podaj datę przelewu');
      return false;
    }
    
    return true;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTransferDate(selectedDate);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        // Fallback to PIN
        setShowPinInput(true);
        return;
      }

      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autoryzuj przelew',
        fallbackLabel: 'Użyj PIN',
        cancelLabel: 'Anuluj',
      });

      if (authResult.success) {
        await executeTransfer();
      } else {
        if (authResult.error === 'user_fallback') {
          setShowPinInput(true);
        }
      }
    } catch (error) {
      setShowPinInput(true);
    }
  };

  const handlePinSubmit = () => {
    if (pin === '1234') { // Simplified PIN validation
      setShowPinInput(false);
      setPin('');
      executeTransfer();
    } else {
      Alert.alert('Błąd', 'Nieprawidłowy PIN');
      setPin('');
    }
  };

  const executeTransfer = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowThankYou(true);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się wysłać przelewu. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;
    await handleBiometricAuth();
  };

  const isDark = colorScheme === 'dark';

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
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        {/* Header */}
        <View style={[
          styles.header, 
          { 
            paddingTop: 16,
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

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          onTouchStart={() => setIsDropdownOpen(false)}
        >
          <View style={styles.content}>
            {/* Form */}
            <ThemedView style={styles.formSection}>
              {/* From Account Dropdown */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Z rachunku</ThemedText>
                <TouchableOpacity 
                  style={[
                    styles.dropdownButton,
                    { 
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.accountInfo}>
                      <ThemedText style={styles.accountNumber}>{selectedAccount.number}</ThemedText>
                      <ThemedText style={styles.accountName}>{selectedAccount.name}</ThemedText>
                    </View>
                    <View style={styles.accountBalance}>
                      <ThemedText style={styles.balanceAmount}>
                        {new Intl.NumberFormat('pl-PL', { 
                          style: 'currency', 
                          currency: 'PLN' 
                        }).format(selectedAccount.balance)}
                      </ThemedText>
                      <ThemedText style={styles.accountType}>{selectedAccount.type}</ThemedText>
                    </View>
                  </View>
                  <Ionicons 
                    name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={isDark ? '#8E8E93' : '#8E8E93'} 
                  />
                </TouchableOpacity>
              </View>

              {/* Recipient Name */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Do odbiorcy</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { 
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

              {/* Recipient Address */}
              <View style={styles.inputGroup}>
                <ThemedText style={[styles.label]}>Adres odbiorcy</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: isDark ? '#FFFFFF' : '#000000',
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  value={recipientAddress}
                  onChangeText={setRecipientAddress}
                  placeholder="ul. Przykładowa 1, 00-001 Warszawa"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                />
              </View>

              {/* Account Number */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Na rachunek</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
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
                <ThemedText style={styles.label}>Tytuł</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: isDark ? '#FFFFFF' : '#000000',
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Zwrot za zakupy, opłata za mieszkanie..."
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                />
              </View>

              {/* Transfer Date */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Data przelewu</ThemedText>
                <TouchableOpacity
                  style={[
                    styles.input,
                    styles.dateButton,
                    { 
                      borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
                    }
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <ThemedText style={[
                    styles.dateText,
                    { color: isDark ? '#FFFFFF' : '#000000' }
                  ]}>
                    {transferDate.toLocaleDateString('pl-PL')}
                  </ThemedText>
                  <Ionicons name="calendar" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
                </TouchableOpacity>
              </View>
            </ThemedView>

            {/* Spacer for sticky button */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>

        {/* Sticky Transfer Button */}
        <View style={[
          styles.stickyButtonContainer,
          { 
            backgroundColor: isDark ? '#000000' : '#F5F5F5',
            paddingBottom: insets.bottom + 16
          }
        ]}>
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
                <ThemedText style={styles.transferButtonText}>Wyślij</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
      
      {/* Dropdown List - Positioned absolutely over everything */}
      {isDropdownOpen && (
        <View style={[
          styles.dropdownOverlay,
          { 
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderColor: isDark ? '#3A3A3C' : '#E5E5E7'
          }
        ]}>
          <ScrollView 
            style={styles.dropdownScroll}
            showsVerticalScrollIndicator={Platform.OS === 'web'}
            nestedScrollEnabled={true}
          >
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.dropdownItem,
                  selectedAccount.id === account.id && styles.selectedItem
                ]}
                onPress={() => {
                  setSelectedAccount(account);
                  setIsDropdownOpen(false);
                }}
              >
                <View style={styles.dropdownContent}>
                  <View style={styles.accountInfo}>
                    <ThemedText style={styles.accountNumber}>{account.number}</ThemedText>
                    <ThemedText style={styles.accountName}>{account.name}</ThemedText>
                  </View>
                  <View style={styles.accountBalance}>
                    <ThemedText style={styles.balanceAmount}>
                      {new Intl.NumberFormat('pl-PL', { 
                        style: 'currency', 
                        currency: 'PLN' 
                      }).format(account.balance)}
                    </ThemedText>
                    <ThemedText style={styles.accountType}>{account.type}</ThemedText>
                  </View>
                </View>
                {selectedAccount.id === account.id && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={transferDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* PIN Input Modal */}
      {showPinInput && (
        <View style={styles.modalOverlay}>
          <View style={[
            styles.pinModal,
            { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
          ]}>
            <ThemedText style={styles.pinTitle}>Wprowadź PIN</ThemedText>
            <TextInput
              style={[
                styles.pinInput,
                { 
                  backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                  color: isDark ? '#FFFFFF' : '#000000'
                }
              ]}
              value={pin}
              onChangeText={setPin}
              placeholder="••••"
              placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
            />
            <View style={styles.pinButtons}>
              <TouchableOpacity
                style={[styles.pinButton, styles.pinButtonCancel]}
                onPress={() => {
                  setShowPinInput(false);
                  setPin('');
                }}
              >
                <ThemedText style={styles.pinButtonTextCancel}>Anuluj</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pinButton, styles.pinButtonConfirm]}
                onPress={handlePinSubmit}
              >
                <ThemedText style={styles.pinButtonText}>Potwierdź</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Thank You Screen */}
      {showThankYou && (
        <View style={styles.modalOverlay}>
          <View style={[
            styles.thankYouModal,
            { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
          ]}>
            <View style={styles.thankYouIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#34C759" />
            </View>
            <ThemedText style={styles.thankYouTitle}>Przelew wysłany!</ThemedText>
            <ThemedText style={styles.thankYouMessage}>
              Przelew na kwotę {amount} PLN dla {recipientName} został pomyślnie wysłany.
            </ThemedText>
            <ThemedText style={styles.thankYouDate}>
              Data realizacji: {transferDate.toLocaleDateString('pl-PL')}
            </ThemedText>
            <TouchableOpacity
              style={styles.thankYouButton}
              onPress={() => {
                setShowThankYou(false);
                handleClose();
              }}
            >
              <ThemedText style={styles.thankYouButtonText}>Zakończ</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      </View>
    </ContainerComponent>
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
    overflow: 'visible',
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
    marginBottom: 16,
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  inputGroup: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  amountInput: {
    fontWeight: '600',
    fontSize: 18,
  },
  transferButton: {
    backgroundColor: '#4A3A7A',
    borderRadius: 16,
    padding: 12,
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
  labelRequired: {
    color: '#FF3B30',
  },
  contactButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
    padding: 8,
  },
  calendarButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
    padding: 10,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 9999,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    height: 60,
  },
  dropdownContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 13,
    opacity: 0.7,
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 13,
    opacity: 0.7,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 10000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 140, // Adjust based on header height + first input position
    left: 20,
    right: 20,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 200,
    zIndex: 10000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(142, 142, 147, 0.12)',
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownSubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  // Sticky button styles
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(142, 142, 147, 0.12)',
  },
  // Date button styles
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Modal overlay
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20000,
  },
  // PIN Modal styles
  pinModal: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 280,
  },
  pinTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  pinInput: {
    width: 120,
    height: 50,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  pinButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  pinButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  pinButtonCancel: {
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
  },
  pinButtonConfirm: {
    backgroundColor: '#4A3A7A',
  },
  pinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pinButtonTextCancel: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  // Thank You Modal styles
  thankYouModal: {
    margin: 20,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 320,
  },
  thankYouIcon: {
    marginBottom: 20,
  },
  thankYouTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  thankYouMessage: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 22,
  },
  thankYouDate: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 32,
  },
  thankYouButton: {
    backgroundColor: '#4A3A7A',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  thankYouButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});