import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
  Switch,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import api from './api';
import { useAuth } from './AuthContext';
import axios from 'axios';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 20;
const BASE_MEDIA_URL = 'https://supply-3.onrender.com/media/';

const ProductsScreen = ({ navigation, route }) => {
  const { accessToken, logout } = useAuth();
  const [modalStates, setModalStates] = useState({
    cart: false,
    confirm: false,
    filter: false,
    productDetails: false,
  });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState([{ id: 1, name: 'Tous', icon: 'grid-view' }]);
  const [filters, setFilters] = useState({
    category: 'Tous',
    minPrice: 0,
    maxPrice: 1000000,
    inStock: false,
    commune: '',
    quartier: '',
    zone: '',
    delai: '',
    etoiles: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState({ communes: [], quartiers: [], zones: [] });
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    next: null,
    previous: null,
    currentPage: 1,
  });
  const fadeAnim = useState(new Animated.Value(0))[0];
  const headerAnim = useState(new Animated.Value(0))[0];
  const { businessType } = route.params;

  const toggleModal = useCallback((modalName, value) => {
    setModalStates(prev => ({ ...prev, [modalName]: value }));
    if (!value && modalName === 'productDetails') resetProductModalStates();
  }, []);

  const resetProductModalStates = useCallback(() => {
    setSelectedFormat(null);
    setQuantity(1);
    setCurrentImageIndex(0);
  }, []);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [categoriesData, productsData, locationsData] = await Promise.all([
        fetchCategories(),
        fetchProducts(1),
        fetchLocations(),
      ]);

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(headerAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      return { categoriesData, productsData, locationsData };
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données initiales');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    if (!accessToken) {
      setError('Utilisateur non authentifié');
      navigation.navigate('Login');
      return;
    }
    loadInitialData();
  }, [accessToken, navigation]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log('Réponse brute de fetchCategories:', JSON.stringify(response.data, null, 2));

      let categoriesData;
      if (Array.isArray(response.data)) {
        categoriesData = response.data; // API renvoie un tableau directement
      } else if (response.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data; // API renvoie un objet avec "data"
      } else {
        throw new Error('Les données des catégories ne sont pas dans le format attendu');
      }

      const transformedData = categoriesData.map((category, index) => ({
        id: category.id || index + 2,
        name: category.name,
        icon: getIconForCategory(category.name),
      }));
      setCategories([{ id: 1, name: 'Tous', icon: 'grid-view' }, ...transformedData]);
    } catch (error) {
      console.error('Erreur fetchCategories:', error);
      setError(`Erreur lors de la récupération des catégories: ${error.message}`);
      throw error;
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const endpointMap = {
        Fabricant: 'fabricant',
        Grossiste: 'grossiste',
        'Semi-Grossiste': 'semi-grossiste',
        Détaillant: 'detaillant',
      };
      const endpoint = endpointMap[businessType.name] || 'grossiste';
      const url = `https://supply-3.onrender.com/api/products/${endpoint}/?page=${page}&page_size=10`;
      console.log('Fetching products from URL:', url);
      console.log('Using token:', accessToken);

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });

      console.log('Réponse brute de fetchProducts:', JSON.stringify(response.data, null, 2));

      let productsData;
      let total = 0;
      let next = null;
      let previous = null;

      if (Array.isArray(response.data)) {
        productsData = response.data;
        total = response.data.length;
      } else if (response.data && typeof response.data === 'object') {
        const { total: apiTotal, next: apiNext, previous: apiPrevious, data } = response.data;
        productsData = Array.isArray(data) ? data : [];
        total = apiTotal || 0;
        next = apiNext || null;
        previous = apiPrevious || null;
      } else {
        throw new Error('La réponse de l\'API est invalide ou vide');
      }

      console.log('Valeur de "productsData" après traitement:', productsData);

      const productsWithFullUrls = productsData.map(product => ({
        ...product,
        formats: product.formats.map(format => ({
          ...format,
          image: format.image.startsWith('http') ? format.image : `${BASE_MEDIA_URL}${format.image}`,
        })),
      }));

      setProducts(prev => (page === 1 ? productsWithFullUrls : [...prev, ...productsWithFullUrls]));
      setPagination({
        total,
        next,
        previous,
        currentPage: page,
      });
    } catch (error) {
      console.error('Erreur fetchProducts:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      setError(`Erreur lors de la récupération des produits: ${error.message}`);
      throw error;
    }
  };

  const loadMoreProducts = useCallback(async () => {
    if (pagination.next && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        const nextPage = pagination.currentPage + 1;
        await fetchProducts(nextPage);
      } catch (error) {
        setError('Erreur lors du chargement des produits supplémentaires');
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [pagination.next, pagination.currentPage, isLoadingMore]);

  const fetchLocations = async () => {
    try {
      const [communesRes, quartiersRes, zonesRes] = await Promise.all([
        api.get('/commune/'),
        api.get('/quartier/'),
        api.get('/zone/'),
      ]);
      console.log('Réponse brute de fetchLocations - communes:', JSON.stringify(communesRes.data, null, 2));
      console.log('Réponse brute de fetchLocations - quartiers:', JSON.stringify(quartiersRes.data, null, 2));
      console.log('Réponse brute de fetchLocations - zones:', JSON.stringify(zonesRes.data, null, 2));

      setLocations({
        communes: Array.isArray(communesRes.data.results) ? communesRes.data.results : [],
        quartiers: Array.isArray(quartiersRes.data.results) ? quartiersRes.data.results : [],
        zones: Array.isArray(zonesRes.data.results) ? zonesRes.data.results : [],
      });
    } catch (error) {
      console.error('Erreur fetchLocations:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      setError(`Erreur lors de la récupération des emplacements: ${error.message}`);
      setLocations({ communes: [], quartiers: [], zones: [] });
      throw error;
    }
  };

  const getIconForCategory = (categoryName) => {
    const categoryIcons = {
      construction: 'build',
      aliment: 'restaurant',
      cosmetique: 'spa',
      bricolage: 'handyman',
      savon: 'soap',
      nourriture: 'fastfood',
    };
    return categoryIcons[categoryName.toLowerCase()] || 'category';
  };

  const addToCart = useCallback((product, format, qty) => {
    const item = {
      id: `${product.id}-${format.id}`,
      name: product.name,
      format,
      quantity: qty,
    };
    setCart(prev => [...prev.filter(i => i.id !== item.id), item]);
    toggleModal('productDetails', false);
  }, [toggleModal]);

  const getTotal = useCallback(() => {
    return cart
      .reduce((sum, item) => sum + parseFloat(item.format.price || 0) * item.quantity, 0)
      .toLocaleString('fr-FR', { minimumFractionDigits: 2 });
  }, [cart]);

  const calculateProductTotal = useCallback(() => {
    if (!selectedFormat) return '0.00';
    return (parseFloat(selectedFormat.price || 0) * quantity).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
    });
  }, [selectedFormat, quantity]);

  const openProductDetails = useCallback((product) => {
    setSelectedProduct(product);
    setSelectedFormat(null);
    setQuantity(1);
    setCurrentImageIndex(0);
    toggleModal('productDetails', true);
  }, [toggleModal]);

  const submitOrder = async () => {
    setIsLoading(true);
    try {
      const totalAmount = cart.reduce(
        (sum, item) => sum + parseFloat(item.format.price || 0) * item.quantity,
        0
      );
      const orderData = {
        status: 'PENDING',
        total_amount: totalAmount,
        items: cart.map(item => ({
          product_format: item.format.id,
          quantity: item.quantity,
          price_at_order: parseFloat(item.format.price),
        })),
      };
      const response = await api.post('/orders/', orderData, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });
      setCart([]);
      toggleModal('confirm', false);
      Alert.alert('Succès', 'Commande envoyée avec succès !');
      await fetchProducts(1);
    } catch (error) {
      console.error('Erreur submitOrder:', error);
      Alert.alert('Erreur', error.response?.data?.detail || 'Erreur lors de la soumission');
      if (error.response?.status === 401) {
        logout();
        navigation.navigate('Login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPagination({ total: 0, next: null, previous: null, currentPage: 1 });
    loadInitialData();
  }, []);

  const FilterModal = ({ visible, onClose, onApplyFilters, filters, setFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
      if (visible) setLocalFilters(filters);
    }, [visible, filters]);

    const updateLocalFilters = (key, value) => {
      setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
      setFilters(localFilters);
      onApplyFilters();
      fetchProducts(1);
    };

    const resetFilters = () => {
      const defaultFilters = {
        category: 'Tous',
        minPrice: 0,
        maxPrice: 1000000,
        inStock: false,
        commune: '',
        quartier: '',
        zone: '',
        delai: '',
        etoiles: 0,
      };
      setLocalFilters(defaultFilters);
      setFilters(defaultFilters);
      setSelectedCategory('Tous');
      onClose();
      fetchProducts(1);
    };

    console.log('Valeur de locations dans FilterModal:', JSON.stringify(locations, null, 2));

    return (
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                <Icon name="close" size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>
                Prix ({localFilters.minPrice.toLocaleString()} - {localFilters.maxPrice.toLocaleString()} FCFA)
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                value={localFilters.minPrice}
                onValueChange={value => updateLocalFilters('minPrice', Math.round(value))}
                minimumTrackTintColor="#3B82F6"
                thumbTintColor="#3B82F6"
                step={1000}
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                value={localFilters.maxPrice}
                onValueChange={value => updateLocalFilters('maxPrice', Math.round(value))}
                minimumTrackTintColor="#3B82F6"
                thumbTintColor="#3B82F6"
                step={1000}
              />
              {['commune', 'quartier', 'zone'].map(type => (
                <View key={type} style={styles.pickerContainer}>
                  <Text style={styles.filterLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  <Picker
                    selectedValue={localFilters[type]}
                    onValueChange={value => updateLocalFilters(type, value)}
                    style={styles.picker}
                  >
                    <Picker.Item label={`Sélectionner un ${type}`} value="" />
                    {Array.isArray(locations[`${type}s`]) && locations[`${type}s`].length > 0 ? (
                      locations[`${type}s`].map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item[type] || item.name}
                          value={item[type] || item.name}
                        />
                      ))
                    ) : (
                      <Picker.Item label="Aucune donnée disponible" value="" />
                    )}
                  </Picker>
                </View>
              ))}
              <View style={styles.switchContainer}>
                <Text style={styles.filterLabel}>En stock uniquement</Text>
                <Switch
                  value={localFilters.inStock}
                  onValueChange={value => updateLocalFilters('inStock', value)}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={localFilters.inStock ? '#3B82F6' : '#F3F4F6'}
                />
              </View>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Réinitialiser</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setFilters(prev => ({ ...prev, category: categoryName }));
    fetchProducts(1);
  };

  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.formats?.[0]?.price || 0);
    return (
      (selectedCategory === 'Tous' || product.category_name === selectedCategory) &&
      price >= filters.minPrice &&
      price <= filters.maxPrice &&
      (!filters.inStock || product.formats?.[0]?.stock > 0) &&
      (!searchText || product.name.toLowerCase().includes(searchText.toLowerCase())) &&
      (!filters.commune || product.supplier_commune?.toLowerCase().includes(filters.commune.toLowerCase())) &&
      (!filters.quartier || product.supplier_quartier?.toLowerCase().includes(filters.quartier.toLowerCase())) &&
      (!filters.zone || product.supplier_zone?.toLowerCase().includes(filters.zone.toLowerCase()))
    );
  });

  const renderProductCard = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.productCard} onPress={() => openProductDetails(item)}>
        <Image
          source={{ uri: item.formats[0]?.image || 'https://via.placeholder.com/120' }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.supplierName}>{item.supplier_name || 'Fournisseur'}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{parseFloat(item.formats[0]?.price || 0).toLocaleString()} FCFA</Text>
            <Text style={styles.stock}>{item.formats[0]?.stock || 0} en stock</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [openProductDetails]
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={50} color="#EF4444" />
        <Text style={styles.errorText}>Erreur : {error}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.retryText}>Se reconnecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="#1E3A8A" barStyle="light-content" />
          
          <Animated.View style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0]
                })
              }]
            }
          ]}>
            <Text style={styles.headerTitle}>Supply</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => toggleModal('filter', true)}
                activeOpacity={0.7}
              >
                <Icon name="filter-list" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => navigation.navigate('MapScreen', { products })}
                activeOpacity={0.7}
              >
                <Icon name="map" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={() => toggleModal('cart', true)}
                activeOpacity={0.7}
              >
                <Icon name="shopping-cart" size={20} color="#fff" />
                {cart.length > 0 && (
                  <Animated.View style={[styles.cartBadge, { opacity: fadeAnim }]}>
                    <Text style={styles.cartBadgeText}>{cart.length}</Text>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un produit..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </Animated.View>

          <Animated.FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item.name && styles.categoryButtonActive,
                ]}
                onPress={() => handleCategorySelect(item.name)}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={selectedCategory === item.name ? '#3B82F6' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.name && styles.categoryTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />

          {isLoading && !refreshing ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : (
            <Animated.FlatList
              data={filteredProducts}
              renderItem={renderProductCard}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.productList}
              ListEmptyComponent={<Text style={styles.emptyText}>Aucun produit trouvé</Text>}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              onEndReached={loadMoreProducts}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoadingMore ? (
                  <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: 20 }} />
                ) : null
              }
              style={{ opacity: fadeAnim }}
            />
          )}

          <FilterModal
            visible={modalStates.filter}
            onClose={() => toggleModal('filter', false)}
            onApplyFilters={() => toggleModal('filter', false)}
            filters={filters}
            setFilters={setFilters}
          />

          <Modal visible={modalStates.cart} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Panier</Text>
                {cart.length === 0 ? (
                  <Text style={styles.emptyText}>Votre panier est vide</Text>
                ) : (
                  <>
                    <FlatList
                      data={cart}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => (
                        <View style={styles.cartItem}>
                          <Image source={{ uri: item.format.image }} style={styles.cartItemImage} />
                          <View style={styles.cartItemInfo}>
                            <Text style={styles.cartItemName}>{item.name}</Text>
                            <Text style={styles.cartItemPrice}>
                              {parseFloat(item.format.price).toLocaleString('fr-FR')} FCFA x {item.quantity}
                            </Text>
                          </View>
                        </View>
                      )}
                    />
                    <Text style={styles.totalText}>Total : {getTotal()} FCFA</Text>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        toggleModal('cart', false);
                        toggleModal('confirm', true);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Commander</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={() => toggleModal('cart', false)}>
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal visible={modalStates.confirm} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirmation</Text>
                <Text style={styles.totalText}>Total : {getTotal()} FCFA</Text>
                <TouchableOpacity style={styles.actionButton} onPress={submitOrder} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.actionButtonText}>Confirmer</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => toggleModal('confirm', false)}>
                  <Text style={styles.closeButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal visible={modalStates.productDetails} animationType="slide" transparent>
            {selectedProduct && (
              <View style={styles.modalOverlay}>
                <View style={styles.productModalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.productDetailName}>{selectedProduct.name}</Text>
                    <TouchableOpacity
                      style={styles.closeIcon}
                      onPress={() => toggleModal('productDetails', false)}
                    >
                      <Icon name="close" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: selectedFormat?.image || selectedProduct.formats[0]?.image || 'https://via.placeholder.com/200' }}
                    style={styles.productDetailImage}
                  />
                  <View style={styles.formatContainer}>
                    <Text style={styles.formatLabel}>Format :</Text>
                    <Picker
                      selectedValue={selectedFormat?.id}
                      onValueChange={itemValue => {
                        const format = selectedProduct.formats.find(f => f.id === itemValue);
                        setSelectedFormat(format);
                        setCurrentImageIndex(selectedProduct.formats.findIndex(f => f.id === itemValue));
                      }}
                      style={styles.formatPicker}
                    >
                      {selectedProduct.formats.map(format => (
                        <Picker.Item
                          key={format.id}
                          label={`${format.taille} - ${format.couleur} (${parseFloat(format.price).toLocaleString('fr-FR')} FCFA)`}
                          value={format.id}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Icon name="remove" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <Icon name="add" size={20} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.productTotalText}>Total : {calculateProductTotal()} FCFA</Text>
                  <TouchableOpacity
                    style={[styles.actionButton, !selectedFormat && styles.actionButtonDisabled]}
                    onPress={() => selectedFormat && addToCart(selectedProduct, selectedFormat, quantity)}
                    disabled={!selectedFormat}
                  >
                    <Text style={styles.actionButtonText}>Ajouter au panier</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flexShrink: 1,
  },
  categoryTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  productList: {
    padding: 15,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  supplierName: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  stock: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    textAlign: 'right',
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  actionButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  productModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  closeIcon: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  productDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  productDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 10,
  },
  formatContainer: {
    marginBottom: 16,
  },
  formatLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formatPicker: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 20,
  },
  productTotalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
    textAlign: 'center',
    marginVertical: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  slider: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: 'transparent',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    padding: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3B82F6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    marginTop: 10,
  },
  retryText: {
    color: '#3B82F6',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '600',
  },
});

export default ProductsScreen;