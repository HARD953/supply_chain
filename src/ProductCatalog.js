import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
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
  Animated,
  Alert
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24;

const ProductsScreen = () => {
  // État initial des modales
  const [modalStates, setModalStates] = useState({
    cart: false,
    confirm: false,
    filter: false,
    productDetails: false
  });

  // États pour les données
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Tous', icon: 'grid-view' }
  ]);
  const [filters, setFilters] = useState({
    category: 'Tous',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    quartier: '',
    zone: '',
    delai: '',
    etoiles: '',
  });

  // Fonction améliorée pour gérer l'état des modales
  const toggleModal = (modalName, value) => {
    // Utiliser cette méthode pour éviter les mises à jour partielles d'état
    setModalStates(prev => ({
      ...prev,
      [modalName]: value
    }));
  };

  // Fonction pour réinitialiser les états des modales produit sans fermer la modale
  const resetProductModalStates = () => {
    setSelectedFormat(null);
    setQuantity(1);
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://supply-3.onrender.com/api/categories/');
      const data = await response.json();
      const transformedData = data.map((category, index) => ({
        id: index + 2,
        name: category.name,
        icon: getIconForCategory(category.name)
      }));
      setCategories([{ id: 1, name: 'Tous', icon: 'grid-view' }, ...transformedData]);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://supply-3.onrender.com/api/products/');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  const getIconForCategory = (categoryName) => {
    const categoryIcons = {
      'construction': 'build',
      'aliment': 'restaurant',
      'cosmetique': 'spa',
      'bricolage': 'handyman'
    };
    return categoryIcons[categoryName.toLowerCase()] || 'category';
  };

  // Fonction modifiée pour ajouter au panier sans fermer la modale
  const addToCart = (product, format, quantity) => {
    const item = {
      id: `${product.id}-${format.id}`,
      name: product.name,
      format,
      quantity,
    };
    
    // Ajouter au panier sans fermer la modale
    setCart(prev => [...prev, item]);
    
    // Réinitialiser uniquement le format sélectionné et la quantité
    setSelectedFormat(null);
    setQuantity(1);
    
    // Afficher un message de confirmation sans fermer la modale
    Alert.alert(
      "Produit ajouté",
      `${product.name} ajouté au panier`,
      [{ text: "OK" }],
      { cancelable: true }
    );
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => 
      sum + (parseFloat(item.format.price || 0) * item.quantity), 0
    ).toFixed(2);
  };

  const submitOrder = async () => {
    try {
      const orderData = {
        user: 1,
        status: "PENDING",
        items: cart.map(item => ({
          product_format: item.format.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch('https://supply-3.onrender.com/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Erreur réseau');

      setCart([]);
      toggleModal('confirm', false);
      Alert.alert("Succès", "Commande envoyée avec succès !");
    } catch (error) {
      Alert.alert("Erreur", "Erreur lors de la soumission");
      console.error('Erreur:', error);
    }
  };

  // Composant FilterModal modifié
  const FilterModal = ({ visible, onClose, onApplyFilters, filters, setFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [communes, setCommunes] = useState([]);
    const [quartiers, setQuartiers] = useState([]);
    const [zones, setZones] = useState([]);

    // Utiliser des états locaux pour éviter les mises à jour en cascade
    const [minPrice, setMinPrice] = useState(filters.minPrice ? parseFloat(filters.minPrice) : 0);
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice ? parseFloat(filters.maxPrice) : 1000000);

    // Synchroniser les filtres locaux avec les filtres globaux quand la modale s'ouvre
    useEffect(() => {
      if (visible) {
        setLocalFilters(filters);
        setMinPrice(filters.minPrice ? parseFloat(filters.minPrice) : 0);
        setMaxPrice(filters.maxPrice ? parseFloat(filters.maxPrice) : 1000000);
      }
    }, [visible, filters]);

    useEffect(() => {
      fetchLocations();
    }, []);

    const fetchLocations = async () => {
      try {
        const [communesRes, quartiersRes, zonesRes] = await Promise.all([
          fetch('https://supply-3.onrender.com/api/commune/'),
          fetch('https://supply-3.onrender.com/api/quartier/'),
          fetch('https://supply-3.onrender.com/api/zone/')
        ]);
        
        const communesData = await communesRes.json();
        const quartiersData = await quartiersRes.json();
        const zonesData = await zonesRes.json();
        
        setCommunes(communesData);
        setQuartiers(quartiersData);
        setZones(zonesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de localisation:', error);
      }
    };

    // Mettre à jour les filtres locaux
    const updateLocalFilters = (key, value) => {
      setLocalFilters(prev => ({
        ...prev,
        [key]: value
      }));
    };

    // Appliquer les filtres globalement seulement quand on clique sur "Appliquer"
    const applyLocalFilters = () => {
      setFilters({
        ...localFilters,
        minPrice,
        maxPrice
      });
      onApplyFilters();
    };

    // Réinitialiser tous les filtres
    const resetFilters = () => {
      const defaultFilters = {
        category: 'Tous',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        quartier: '',
        zone: '',
        delai: '',
        etoiles: '',
      };
      setLocalFilters(defaultFilters);
      setMinPrice(0);
      setMaxPrice(1000000);
      setFilters(defaultFilters);
      onClose();
    };

    const StarRating = () => {
      const stars = [1, 2, 3, 4, 5];
      return (
        <View style={styles.starsContainer}>
          {stars.map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => updateLocalFilters('etoiles', star)}
              style={styles.starButton}
            >
              <Icon
                name={localFilters.etoiles >= star ? "star" : "star-border"}
                size={30}
                color={localFilters.etoiles >= star ? "#FFD700" : "#D1D5DB"}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrer les produits</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>Prix ({minPrice.toLocaleString()} - {maxPrice.toLocaleString()} FCFA)</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1000000}
                  value={minPrice}
                  onValueChange={setMinPrice}
                  minimumTrackTintColor="#2563EB"
                  maximumTrackTintColor="#D1D5DB"
                  thumbTintColor="#2563EB"
                  step={1000}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1000000}
                  value={maxPrice}
                  onValueChange={setMaxPrice}
                  minimumTrackTintColor="#2563EB"
                  maximumTrackTintColor="#D1D5DB"
                  thumbTintColor="#2563EB"
                  step={1000}
                />
              </View>

              <Text style={styles.filterLabel}>Commune</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={localFilters.commune}
                  onValueChange={(value) => updateLocalFilters('commune', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionner une commune" value="" />
                  {communes.map((item, index) => (
                    <Picker.Item key={index} label={item.commune} value={item.commune} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.filterLabel}>Quartier</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={localFilters.quartier}
                  onValueChange={(value) => updateLocalFilters('quartier', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionner un quartier" value="" />
                  {quartiers.map((item, index) => (
                    <Picker.Item key={index} label={item.quartier} value={item.quartier} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.filterLabel}>Zone</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={localFilters.zone}
                  onValueChange={(value) => updateLocalFilters('zone', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionner une zone" value="" />
                  {zones.map((item, index) => (
                    <Picker.Item key={index} label={item.zone} value={item.zone} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.filterLabel}>Évaluation minimum</Text>
              <StarRating />

              <View style={styles.filterSwitchContainer}>
                <Text style={styles.filterSwitchLabel}>En stock seulement</Text>
                <Switch
                  value={localFilters.inStock}
                  onValueChange={(value) => updateLocalFilters('inStock', value)}
                  trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                  thumbColor={localFilters.inStock ? '#2563EB' : '#F3F4F6'}
                />
              </View>

              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyLocalFilters}
              >
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={resetFilters}>
                <Text style={styles.closeButtonText}>Réinitialiser</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Filtre des produits
  const filteredProducts = products.filter(product => {
    const matchesCategory = filters.category === 'Tous' || product.category_name === filters.category;
    const price = parseFloat(product.formats?.[0]?.price || 0);
    const matchesPrice = (
      (!filters.minPrice || price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || price <= parseFloat(filters.maxPrice))
    );
    const matchesStock = !filters.inStock || (product.formats?.[0]?.stock > 0);
    const matchesSearch = !searchText || product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesQuartier = !filters.quartier || product.supplier_quartier.toLowerCase().includes(filters.quartier.toLowerCase());
    const matchesZone = !filters.zone || product.supplier_zone.toLowerCase().includes(filters.zone.toLowerCase());
    const matchesDelai = !filters.delai || product.last_order <= filters.delai;
    const matchesEtoiles = !filters.etoiles || product.etoiles >= parseFloat(filters.etoiles);

    return (
      matchesCategory &&
      matchesPrice &&
      matchesStock &&
      matchesSearch &&
      matchesQuartier &&
      matchesZone &&
      matchesDelai &&
      matchesEtoiles
    );
  });
  
  const CartModal = () => (
    <Modal 
      visible={modalStates.cart} 
      animationType="slide" 
      transparent={true}
      onRequestClose={() => toggleModal('cart', false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Panier</Text>
            <TouchableOpacity onPress={() => toggleModal('cart', false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {cart.length === 0 ? (
              <Text style={styles.emptyCartText}>Votre panier est vide</Text>
            ) : (
              cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.format.image }} style={styles.cartItemImage} />
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      {parseInt(item.format.price || 0).toLocaleString()} FCFA
                    </Text>
                    <Text style={styles.cartItemQuantity}>Quantité: {item.quantity}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
          
          {cart.length > 0 && (
            <>
              <Text style={styles.totalText}>
                Total: {getTotal().toLocaleString()} FCFA
              </Text>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={() => {
                  toggleModal('cart', false);
                  toggleModal('confirm', true);
                }}
              >
                <Text style={styles.validateButtonText}>Valider</Text>
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => toggleModal('cart', false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ConfirmModal = () => (
    <Modal 
      visible={modalStates.confirm} 
      animationType="slide" 
      transparent={true}
      onRequestClose={() => toggleModal('confirm', false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirmer la commande</Text>
            <TouchableOpacity onPress={() => toggleModal('confirm', false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalText}>
            Total: {getTotal().toLocaleString()} FCFA
          </Text>
          <TouchableOpacity style={styles.confirmButton} onPress={submitOrder}>
            <Text style={styles.confirmButtonText}>Confirmer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => toggleModal('confirm', false)}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ProductDetailsModal = () => {
    if (!selectedProduct) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalStates.productDetails}
        onRequestClose={() => {
          // Fermer uniquement quand l'utilisateur le demande
          toggleModal('productDetails', false);
          resetProductModalStates();
        }}
      >
        <View style={styles.detailsModalContainer}>
          <View style={styles.detailsModalContent}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => {
                toggleModal('productDetails', false);
                resetProductModalStates();
              }}
            >
              <Icon name="close" size={24} color="#2563EB" />
            </TouchableOpacity>
            <View style={styles.carouselContainer}>
              <Image
                source={{ uri: selectedProduct.formats[currentImageIndex]?.image }}
                style={styles.detailsImage}
              />
              <View style={styles.dotIndicators}>
                {selectedProduct.formats.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentImageIndex && styles.dotActive
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.detailsProductName}>{selectedProduct.name}</Text>
            <Text style={styles.detailsSupplier}>{selectedProduct.supplier}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.formatsContainer}>
                {selectedProduct.formats.map((format, index) => (
                  <TouchableOpacity
                    key={format.id}
                    style={[
                      styles.formatButton,
                      selectedFormat?.id === format.id && styles.formatButtonSelected
                    ]}
                    onPress={() => {
                      setSelectedFormat(format);
                      setCurrentImageIndex(index);
                    }}
                  >
                    <Text style={[
                      styles.formatName,
                      selectedFormat?.id === format.id && styles.formatTextSelected
                    ]}>
                      {format.name}
                    </Text>
                    <Text style={[
                      styles.formatPrice,
                      selectedFormat?.id === format.id && styles.formatTextSelected
                    ]}>
                      {parseInt(format.price || 0).toLocaleString()} FCFA
                    </Text>
                    <Text style={[
                      styles.formatStock,
                      selectedFormat?.id === format.id && styles.formatTextSelected
                    ]}>
                      Stock: {format.stock}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.quantityContainer}>
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
            <View style={styles.detailsFooter}>
              <Text style={styles.detailsTotal}>
                Total: {selectedFormat ? (parseInt(selectedFormat.price || 0) * quantity).toLocaleString() : 0} FCFA
              </Text>
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  !selectedFormat && styles.addToCartButtonDisabled
                ]}
                onPress={() => {
                  if (selectedFormat) {
                    addToCart(selectedProduct, selectedFormat, quantity);
                  }
                }}
                disabled={!selectedFormat}
              >
                <Text style={styles.addToCartButtonText}>Ajouter au panier</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.finishButton, {marginTop: 15}]}
              onPress={() => {
                toggleModal('productDetails', false);
                resetProductModalStates();
                if (cart.length > 0) {
                  toggleModal('cart', true);
                }
              }}
            >
              <Text style={styles.finishButtonText}>Terminer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        setSelectedProduct(item);
        setSelectedFormat(null);
        setQuantity(1);
        setCurrentImageIndex(0);
        toggleModal('productDetails', true);
      }}
    >
      <Image source={{ uri: item.formats[0]?.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.categoryName}>{item.supplier_name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {parseInt(item.formats[0]?.price || 0).toLocaleString()} FCFA
          </Text>
          <View style={styles.stockContainer}>
            <Icon name="inventory" size={14} color="#666" />
            <Text style={styles.stockText}>{item.formats[0]?.stock || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon name="menu" size={24} color="#fff" />
            <Text style={styles.title}>Catalogue</Text>
          </View>
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={() => toggleModal('cart', true)}
          >
            <Icon name="shopping-cart" size={24} color="#fff" />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => toggleModal('filter', true)}
          >
            <Icon name="filter-list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un produit"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === item.name && styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(item.name)}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={selectedCategory === item.name ? '#fff' : '#2563EB'}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === item.name && styles.categoryButtonTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
        <FilterModal
          visible={modalStates.filter}
          onClose={() => toggleModal('filter', false)}
          onApplyFilters={() => toggleModal('filter', false)}
          filters={filters}
          setFilters={setFilters}
        />
        <CartModal />
        <ConfirmModal />
        <ProductDetailsModal />
      </SafeAreaView>
    </SafeAreaProvider>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    marginVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 8,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#2563EB',
  },
  categoryButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  productList: {
    padding: 16,
    gap: 16,
  },
  productCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cartItemInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#2563EB',
    marginBottom: 4,
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'right',
    color: '#2563EB',
  },
  validateButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  closeButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  carouselContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  carouselControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  carouselButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  dotIndicators: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  detailsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  detailsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  closeModalButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  detailsImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  detailsProductName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1F2937',
  },
  detailsSupplier: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 15,
  },
  formatsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignContent:'center'
  },
  formatButton: {
    width: 120,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formatButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  formatName: {
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  formatPrice: {
    color: '#2563EB',
    marginBottom: 4,
  },
  formatStock: {
    fontSize: 12,
    color: '#6B7280',
  },
  formatTextSelected: {
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  quantityText: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  detailsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  detailsTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  addToCartButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 15,
  },
  addToCartButtonDisabled: {
    opacity: 0.5,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  filterButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  filterCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterCheckboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  closeButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    marginBottom: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },

  //Modal
  sliderContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
  pickerContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: 'transparent',
  },
  filterSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  filterSwitchLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
});

export default ProductsScreen;