import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput } from 'react-native-paper';

// Constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const INPUT_HEIGHT = Platform.OS === 'ios' ? 50 : 45;

// Mock data
const STORES = [
  { id: '1', name: 'Solibra A - Abidjan' },
  { id: '2', name: 'Carré dOR B - Bouake' },
  { id: '3', name: 'Celeste C - Bassam' },
  { id: '4', name: 'Solibra A - Abidjan' },
  { id: '5', name: 'Carré dOR B - Bouake' },
  { id: '6', name: 'Celeste C - Bassam' },
  { id: '7', name: 'Solibra A - Abidjan' },
  { id: '8', name: 'Carré dOR B - Bouake' },
  { id: '9', name: 'Celeste C - Bassam' }
];

const PRODUCTS = [
  { id: '1', name: 'Doddel 1', ref: 'REF001', stock: 100 },
  { id: '2', name: 'Produit 2', ref: 'REF002', stock: 75 },
  { id: '3', name: 'Produit 3', ref: 'REF003', stock: 50 },
  { id: '4', name: 'Doddel 1', ref: 'REF001', stock: 100 },
  { id: '5', name: 'Produit 2', ref: 'REF002', stock: 75 },
  { id: '6', name: 'Produit 3', ref: 'REF003', stock: 50 },
  { id: '7', name: 'Doddel 1', ref: 'REF001', stock: 100 },
  { id: '8', name: 'Produit 2', ref: 'REF002', stock: 75 },
  { id: '9', name: 'Produit 3', ref: 'REF003', stock: 50 },
  { id: '10', name: 'Doddel 1', ref: 'REF001', stock: 100 },
  { id: '11', name: 'Produit 2', ref: 'REF002', stock: 75 },
  { id: '12', name: 'Produit 3', ref: 'REF003', stock: 50 }
];

const UNITS = ['unités', 'cartons', 'palettes'].map(unit => ({ id: unit, name: unit }));

// Custom Select Component
const CustomSelect = ({
  value,
  options,
  onChange,
  placeholder,
  labelExtractor = (item) => item.label || item.name,
  valueExtractor = (item) => item.value || item.id,
  renderOption,
  searchable = false,
  searchPlaceholder = "Rechercher...",
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedItem = options.find(
    item => valueExtractor(item) === value
  );

  const filteredOptions = useMemo(() => 
    options.filter(item =>
      labelExtractor(item)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [options, searchQuery, labelExtractor]
  );

  const defaultRenderOption = useCallback((item) => (
    <View style={styles.optionContainer}>
      <Text style={styles.optionText}>
        {labelExtractor(item)}
      </Text>
    </View>
  ), [labelExtractor]);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSearchQuery('');
  }, []);

  const handleOptionSelect = useCallback((item) => {
    onChange(valueExtractor(item));
    handleModalClose();
  }, [onChange, valueExtractor, handleModalClose]);

  return (
    <View>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          styles.selectButtonText,
          !selectedItem && styles.placeholderText
        ]}>
          {selectedItem ? labelExtractor(selectedItem) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={handleModalClose}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{placeholder}</Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleModalClose}
                    >
                      <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                  </View>

                  {searchable && (
                    <View style={styles.searchContainer}>
                      <TextInput
                        style={styles.searchInput}
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        mode="outlined"
                        dense
                      />
                    </View>
                  )}

                  <FlatList
                    data={filteredOptions}
                    keyExtractor={(item) => valueExtractor(item).toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          valueExtractor(item) === value && styles.selectedOption
                        ]}
                        onPress={() => handleOptionSelect(item)}
                      >
                        {renderOption ? renderOption(item) : defaultRenderOption(item)}
                        {valueExtractor(item) === value && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const OrderManagementMobile = () => {
  // States
  const [selectedStore, setSelectedStore] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product: '',
    quantity: '',
    unit: UNITS[0].id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized calculations
  const orderTotal = useMemo(() => orderItems.length, [orderItems]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.ref.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Form validation
  const isFormValid = useCallback(() => {
    if (!currentItem.product || !currentItem.quantity) {
      return false;
    }
    const quantity = parseInt(currentItem.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return false;
    }
    const product = PRODUCTS.find(p => p.id === currentItem.product);
    return quantity <= product?.stock;
  }, [currentItem]);

  // Handlers
  const handleAddItem = useCallback(() => {
    if (!isFormValid()) {
      Alert.alert('Erreur', 'Veuillez vérifier la quantité et le produit sélectionné');
      return;
    }

    const product = PRODUCTS.find(p => p.id === currentItem.product);
    setOrderItems(prevItems => [...prevItems, {
      ...currentItem,
      productName: product.name,
      ref: product.ref,
      id: Date.now().toString()
    }]);
    
    setCurrentItem({
      product: '',
      quantity: '',
      unit: UNITS[0].id
    });
  }, [currentItem, isFormValid]);

  const handleRemoveItem = useCallback((index) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet article ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setOrderItems(prevItems => prevItems.filter((_, i) => i !== index));
          }
        }
      ]
    );
  }, []);

  const handleSubmitOrder = useCallback(async () => {
    if (!selectedStore || orderItems.length === 0) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        'Succès',
        'Votre commande a été envoyée avec succès',
        [
          { 
            text: 'OK',
            onPress: () => {
              setOrderItems([]);
              setSelectedStore('');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi de la commande');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedStore, orderItems]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Nouvelle Commande</Text>
            <Text style={styles.subtitle}>
              Créez une nouvelle commande pour une surface de distribution
            </Text>
          </View>

          {/* Store Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Surface de distribution</Text>
            <CustomSelect
              value={selectedStore}
              options={STORES}
              onChange={setSelectedStore}
              placeholder="Sélectionner une surface"
            />
          </View>

          {/* Add Product Form */}
          <View style={styles.section}>
            <Text style={styles.label}>Ajouter un produit</Text>
            <View style={styles.form}>
              <CustomSelect
                value={currentItem.product}
                options={filteredProducts}
                onChange={(value) => setCurrentItem(prev => ({ ...prev, product: value }))}
                placeholder="Sélectionner un produit"
                searchable={true}
                searchPlaceholder="Rechercher un produit..."
                renderOption={(product) => (
                  <View>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDetails}>
                      {product.ref} - Stock: {product.stock}
                    </Text>
                  </View>
                )}
              />

              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={currentItem.quantity}
                onChangeText={value => setCurrentItem(prev => ({ ...prev, quantity: value }))}
                placeholder="Quantité"
                mode="outlined"
                dense
              />

              <CustomSelect
                value={currentItem.unit}
                options={UNITS}
                onChange={(value) => setCurrentItem(prev => ({ ...prev, unit: value }))}
                placeholder="Sélectionner une unité"
              />

              <TouchableOpacity
                style={[styles.addButton, !isFormValid() && styles.buttonDisabled]}
                onPress={handleAddItem}
                disabled={!isFormValid()}
              >
                <Text style={styles.buttonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Items List */}
          <View style={styles.section}>
            <Text style={styles.label}>Produits commandés ({orderTotal})</Text>
            {orderItems.map((item, index) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemRef}>{item.ref}</Text>
                  <Text style={styles.orderItemName}>{item.productName}</Text>
                  <Text style={styles.orderItemQuantity}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(index)}
                >
                  <Text style={styles.removeButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedStore || orderItems.length === 0 || isSubmitting) && styles.buttonDisabled
            ]}
            onPress={handleSubmitOrder}
            disabled={!selectedStore || orderItems.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Envoyer la commande</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
  },
  option: {
    flexDirection: 'row',alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    color: '#007AFF',
    fontSize: 20,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  textInput: {
    height: INPUT_HEIGHT,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  form: {
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    margin: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A8A8A8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemRef: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#444',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
  }
});

export default OrderManagementMobile;