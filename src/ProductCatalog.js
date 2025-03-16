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
  RefreshControl, // Ajout de RefreshControl
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import api from './api';
import { useAuth } from './AuthContext';
import axios from 'axios';


const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;
const BASE_MEDIA_URL = 'https://supply-3.onrender.com/media/';


const ProductsScreen = ({ navigation, route }) => {
  const { accessToken, logout } = useAuth();
  const [modalStates, setModalStates] = useState({
    cart: false,
    confirm: false,
    filter: false,
    productDetails: false,
    map: false,
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
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState({ communes: [], quartiers: [], zones: [] });
  const [refreshing, setRefreshing] = useState(false); // État pour le rafraîchissement
  const [loading, setLoading] = useState(true);
  const { businessType } = route.params; // Objet complet businessType reçu

  const toggleModal = useCallback((modalName, value) => {
    setModalStates(prev => ({ ...prev, [modalName]: value }));
  }, []);

  const resetProductModalStates = useCallback(() => {
    setSelectedFormat(null);
    setQuantity(1);
    setCurrentImageIndex(0);
  }, []);

  // Fonction pour charger les données initiales
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchLocations(),
      ]);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
      setRefreshing(false); // Désactiver refreshing après le chargement
    }
  };

  useEffect(() => {
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
      const transformedData = response.data.map((category, index) => ({
        id: category.id || index + 2,
        name: category.name,
        icon: getIconForCategory(category.name),
      }));
      setCategories([{ id: 1, name: 'Tous', icon: 'grid-view' }, ...transformedData]);
    } catch (error) {
      console.error('Erreur fetchCategories:', error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        throw new Error('Aucun token d’accès disponible');
      }

      // Mapper le nom du businessType à l'endpoint correspondant
      const endpointMap = {
        'Fabricant': 'fabricant',
        'Grossiste': 'grossiste',
        'Semi-Grossiste': 'semi-grossiste',
        'Détaillant': 'detaillant',
      };
      const endpoint = endpointMap[businessType.name] || 'grossiste'; // Par défaut 'grossiste' si non trouvé
      const url = `https://supply-3.onrender.com/api/products/${endpoint}/`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Ajouter l'URL complète aux images des formats
      const productsWithFullUrls = response.data.map(product => ({
        ...product,
        formats: product.formats.map(format => ({
          ...format,
          image: format.image.startsWith('http') 
            ? format.image 
            : `${BASE_MEDIA_URL}${format.image}`,
        })),
      }));
      setProducts(productsWithFullUrls);
    } catch (error) {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);
          const endpointMap = {
            'Fabricant': 'fabricant',
            'Grossiste': 'grossiste',
            'Semi-Grossiste': 'semi-grossiste',
            'Détaillant': 'detaillant',
          };
          const endpoint = endpointMap[businessType.name] || 'grossiste';
          const url = `https://supply-3.onrender.com/api/products/${endpoint}/`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const productsWithFullUrls = response.data.map(product => ({
            ...product,
            formats: product.formats.map(format => ({
              ...format,
              image: format.image.startsWith('http') 
                ? format.image 
                : `${BASE_MEDIA_URL}${format.image}`,
            })),
          }));
          setProducts(productsWithFullUrls);
        } catch (refreshError) {
          console.error('Échec du rafraîchissement du token:', refreshError);
          setProducts([]);
        }
      } else {
        console.error('Erreur lors de la récupération des produits:', error);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const [communesRes, quartiersRes, zonesRes] = await Promise.all([
        api.get('/commune/'),
        api.get('/quartier/'),
        api.get('/zone/'),
      ]);
      setLocations({
        communes: communesRes.data || [],
        quartiers: quartiersRes.data || [],
        zones: zonesRes.data || [],
      });
    } catch (error) {
      console.error('Erreur fetchLocations:', error);
      throw error;
    }
  };

  const getIconForCategory = (categoryName) => {
    const categoryIcons = {
      construction: 'build',
      aliment: 'restaurant',
      cosmetique: 'spa',
      bricolage: 'handyman',
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
      .reduce((sum, item) => sum + (parseFloat(item.format.price || 0) * item.quantity), 0)
      .toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [cart]);

  const calculateProductTotal = useCallback(() => {
    if (!selectedFormat) return '0.00';
    return (parseFloat(selectedFormat.price || 0) * quantity).toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Order Response:', response.data);

      setCart([]);
      toggleModal('confirm', false);
      Alert.alert('Succès', 'Commande envoyée avec succès !');

      // Rafraîchir les produits après une commande réussie
      await fetchProducts(); // Recharger les produits pour refléter les changements (ex: stock)
    } catch (error) {
      console.error('Erreur submitOrder:', error);
      const errorMessage = error.response?.data?.detail ||
                          JSON.stringify(error.response?.data) ||
                          'Erreur lors de la soumission de la commande';
      Alert.alert('Erreur', errorMessage);
      if (error.response?.status === 401) {
        logout();
        navigation.navigate('Login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer le "pull-to-refresh"
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInitialData(); // Recharger toutes les données
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
      onClose();
    };

    return (
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <Text style={styles.modalTitle}>Filtres</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>Prix ({localFilters.minPrice.toLocaleString()} - {localFilters.maxPrice.toLocaleString()} FCFA)</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                value={localFilters.minPrice}
                onValueChange={value => updateLocalFilters('minPrice', Math.round(value))}
                minimumTrackTintColor="#2563EB"
                thumbTintColor="#2563EB"
                step={1000}
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                value={localFilters.maxPrice}
                onValueChange={value => updateLocalFilters('maxPrice', Math.round(value))}
                minimumTrackTintColor="#2563EB"
                thumbTintColor="#2563EB"
                step={1000}
              />

              {['commune', 'quartier', 'zone'].map((type) => (
                <View key={type} style={styles.pickerContainer}>
                  <Text style={styles.filterLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                  <Picker
                    selectedValue={localFilters[type]}
                    onValueChange={value => updateLocalFilters(type, value)}
                    style={styles.picker}
                  >
                    <Picker.Item label={`Sélectionner un ${type}`} value="" />
                    {locations[`${type}s`].length > 0 ? (
                      locations[`${type}s`].map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item.name || item[type]}
                          value={item.name || item[type]}
                        />
                      ))
                    ) : (
                      <Picker.Item label="Aucune donnée" value="" />
                    )}
                  </Picker>
                </View>
              ))}

              <View style={styles.switchContainer}>
                <Text style={styles.filterLabel}>En stock</Text>
                <Switch
                  value={localFilters.inStock}
                  onValueChange={value => updateLocalFilters('inStock', value)}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={localFilters.inStock ? '#2563EB' : '#F3F4F6'}
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

  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.formats?.[0]?.price || 0);
    return (
      (filters.category === 'Tous' || product.category_name === filters.category) &&
      price >= filters.minPrice &&
      price <= filters.maxPrice &&
      (!filters.inStock || product.formats?.[0]?.stock > 0) &&
      (!searchText || product.name.toLowerCase().includes(searchText.toLowerCase())) &&
      (!filters.commune || product.supplier_commune?.toLowerCase().includes(filters.commune.toLowerCase())) &&
      (!filters.quartier || product.supplier_quartier?.toLowerCase().includes(filters.quartier.toLowerCase())) &&
      (!filters.zone || product.supplier_zone?.toLowerCase().includes(filters.zone.toLowerCase()))
    );
  });

  const renderProductCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => openProductDetails(item)}
    >
      <Image
        source={{ uri: item.formats[0]?.image || 'https://via.placeholder.com/120' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.supplierName}>{item.supplier_name || 'Fournisseur inconnu'}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{parseInt(item.formats[0]?.price || 0).toLocaleString()} FCFA</Text>
          <Text style={styles.stock}>{item.formats[0]?.stock || 0} en stock</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [openProductDetails]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
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
          <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Supply</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={() => toggleModal('filter', true)}>
                <Icon name="filter-list" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => toggleModal('map', true)}>
                <Icon name="map" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => toggleModal('cart', true)}>
                <Icon name="shopping-cart" size={24} color="#fff" />
                {cart.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cart.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  { width: 120, height: 50 },
                  selectedCategory === item.name && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(item.name)}
              >
                <Icon name={item.icon} size={20} color={selectedCategory === item.name ? '#2563EB' : '#666'} />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.name && styles.categoryTextActive
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />

          {isLoading && !refreshing ? (
            <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductCard}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.productList}
              ListEmptyComponent={<Text style={styles.emptyText}>Aucun produit trouvé</Text>}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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
                  <Text style={styles.emptyText}>Panier vide</Text>
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
                    <Text style={styles.totalText}>Total: {getTotal()} FCFA</Text>
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
                <Text style={styles.totalText}>Total: {getTotal()} FCFA</Text>
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
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => toggleModal('productDetails', false)}
                  >
                    <Icon name="close" size={24} color="#2563EB" />
                  </TouchableOpacity>

                  <Image
                    source={{ uri: selectedFormat?.image || selectedProduct.formats[0].image }}
                    style={styles.productDetailImage}
                  />

                  <Text style={styles.productDetailName}>{selectedProduct.name}</Text>

                  <View style={styles.formatContainer}>
                    <Text style={styles.formatLabel}>Choisir un format :</Text>
                    <Picker
                      selectedValue={selectedFormat?.id}
                      onValueChange={(itemValue) => {
                        const format = selectedProduct.formats.find(f => f.id === itemValue);
                        setSelectedFormat(format);
                        setCurrentImageIndex(selectedProduct.formats.findIndex(f => f.id === itemValue));
                      }}
                      style={styles.formatPicker}
                    >
                      {selectedProduct.formats.map((format) => (
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
                      <Icon name="remove" size={20} color="#2563EB" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <Icon name="add" size={20} color="#2563EB" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.productTotalText}>
                    Total: {calculateProductTotal()} FCFA
                  </Text>

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

          <Modal visible={modalStates.map} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.mapModalContent}>
                <Text style={styles.modalTitle}>Localisation des fournisseurs</Text>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: parseFloat(products[0]?.supplier_latitude) || 6.5244,
                    longitude: parseFloat(products[0]?.supplier_longitude) || 3.3792,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {products.map((product) => (
                    product.supplier_latitude && product.supplier_longitude && (
                      <Marker
                        key={product.id}
                        coordinate={{
                          latitude: parseFloat(product.supplier_latitude),
                          longitude: parseFloat(product.supplier_longitude),
                        }}
                        title={product.supplier_name || 'Fournisseur'}
                        description={`${product.supplier_type || ''} - ${product.supplier_commune || ''}`}
                      />
                    )
                  ))}
                </MapView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => toggleModal('map', false)}
                >
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    elevation: 2,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    elevation: 1,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
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
    fontWeight: 'bold',
    color: '#2563EB',
  },
  stock: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  mapModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
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
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#2563EB',
    marginTop: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'right',
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  productModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  closeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  productDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  productDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
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
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 16,
    fontWeight: 'bold',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  slider: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
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
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  productTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginVertical: 12,
  },
  map: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  retryText: {
    color: '#2563EB',
    fontSize: 16,
  },
});

export default ProductsScreen;