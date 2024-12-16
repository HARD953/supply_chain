import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';
import { Chip, FAB, Menu, Divider, Badge, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SupplierProductsScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [user, setUser] = useState(null); // Add user state at the top of the component
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsModalVisible, setIsProductDetailsModalVisible] = useState(false);
  const [selectedProductFormat, setSelectedProductFormat] = useState(null);

  const productFormats = {
    '1': [
      { id: '1_small', name: 'Petit format', price: 1200, volume: '250ml' },
      { id: '1_medium', name: 'Format moyen', price: 1500, volume: '500ml' },
      { id: '1_large', name: 'Grand format', price: 2000, volume: '1L' }
    ],
    '2': [
      { id: '2_small', name: 'Pack de 4', price: 2000, quantity: '4 tranches' },
      { id: '2_medium', name: 'Pack de 8', price: 3500, quantity: '8 tranches' },
      { id: '2_large', name: 'Pack de 12', price: 5000, quantity: '12 tranches' }
    ],
    // Add more product formats as needed
  };

  const categories = [
    { 
      id: '0', 
      name: 'Tous', 
      icon: 'view-grid', 
      color: '#607D8B',
      backgroundColor: '#ECEFF1'
    },
    { 
      id: '1', 
      name: 'Construction', 
      icon: 'hammer', 
      color: '#FF5722',
      backgroundColor: '#FBE9E7'
    },
    { 
      id: '2', 
      name: 'Vivrier', 
      icon: 'food-apple', 
      color: '#4CAF50',
      backgroundColor: '#E8F5E9'
    },
    { 
      id: '3', 
      name: 'Cosmétique', 
      icon: 'face-woman', 
      color: '#E91E63',
      backgroundColor: '#FCE4EC'
    },
    { 
      id: '4', 
      name: 'Boissons', 
      icon: 'bottle-wine', 
      color: '#2196F3',
      backgroundColor: '#E3F2FD'
    },
    { 
      id: '5', 
      name: 'Hygiène', 
      icon: 'shower', 
      color: '#00BCD4',
      backgroundColor: '#E0F7FA'
    },
    { 
      id: '6', 
      name: 'Électronique', 
      icon: 'television', 
      color: '#9C27B0',
      backgroundColor: '#F3E5F5'
    },
    { 
      id: '7', 
      name: 'Papeterie', 
      icon: 'pencil', 
      color: '#795548',
      backgroundColor: '#EFEBE9'
    },
    { 
      id: '8', 
      name: 'Textile', 
      icon: 'tshirt-crew', 
      color: '#3F51B5',
      backgroundColor: '#E8EAF6'
    }
  ];

  const [products] = useState([
    {
      id: '1',
      name: 'Lait demi-écrémé',
      supplier: 'Lactel',
      price: 1500,
      stock: 150,
      minStock: 50,
      categoryId: '2',
      image: require('../assets/chocolat.jpeg'),
      lastOrder: '2024-03-15'
    },
    {
      id: '2',
      name: 'Pain de mie',
      supplier: 'Harry\'s',
      price: 2300,
      stock: 45,
      minStock: 30,
      categoryId: '2',
      image: require('../assets/brouette.jpg'),
      lastOrder: '2024-03-18'
    },
    {
      id: '3',
      name: 'Shampoing',
      supplier: 'L\'Oréal',
      price: 3200,
      stock: 75,
      minStock: 25,
      categoryId: '5',
      image: require('../assets/ciment.jpeg'),
      lastOrder: '2024-03-10'
    },
    {
      id: '4',
      name: 'Coca-Cola 1.5L',
      supplier: 'Coca-Cola',
      price: 1200,
      stock: 0,
      minStock: 100,
      categoryId: '4',
      image: require('../assets/iphone.jpg'),
      lastOrder: '2024-03-20'
    },
    {
      id: '5',
      name: 'Crème hydratante',
      supplier: 'Nivea',
      price: 1500,
      stock: 60,
      minStock: 20,
      categoryId: '3',
      image: require('../assets/solibra.jpg'),
      lastOrder: '2024-03-12'
    },
    {
      id: '6',
      name: 'Ciment',
      supplier: 'Lafarge',
      price: 6500,
      stock: 500,
      minStock: 100,
      categoryId: '1',
      image: 'https://placeholder.com/cement.jpg',
      lastOrder: '2024-03-25'
    },
    {
      id: '7',
      name: 'Smartphone',
      supplier: 'Samsung',
      price: 500,
      stock: 30,
      minStock: 10,
      categoryId: '6',
      image: 'https://placeholder.com/phone.jpg',
      lastOrder: '2024-03-22'
    },
    {
      id: '8',
      name: 'Smartphone',
      supplier: 'Samsung',
      price: 500,
      stock: 30,
      minStock: 10,
      categoryId: '6',
      image: 'https://placeholder.com/phone.jpg',
      lastOrder: '2024-03-22'
    },
    {
      id: '9',
      name: 'Smartphone',
      supplier: 'Samsung',
      price: 500,
      stock: 30,
      minStock: 10,
      categoryId: '6',
      image: 'https://placeholder.com/phone.jpg',
      lastOrder: '2024-03-22'
    },
    {
      id: '10',
      name: 'Smartphone',
      supplier: 'Samsung',
      price: 500,
      stock: 30,
      minStock: 10,
      categoryId: '6',
      image: 'https://placeholder.com/phone.jpg',
      lastOrder: '2024-03-22'
    },
    {
      id: '11',
      name: 'Smartphone',
      supplier: 'Samsung',
      price: 500,
      stock: 30,
      minStock: 10,
      categoryId: '6',
      image: 'https://placeholder.com/phone.jpg',
      lastOrder: '2024-03-22'
    },
    {
      id: '12',
      name: 'Smartphone',
      supplier: 'Samsung',
      price: 500,
      stock: 30,
      minStock: 10,
      categoryId: '6',
      image: 'https://placeholder.com/phone.jpg',
      lastOrder: '2024-03-22'
    },
    {
      id: '13',
      name: 'Smartphone',
      supplier: 'Samsung',
      price: 500,
      stock: 30,
      minStock: 10,
      categoryId: '6',
      image: 'https://placeholder.com/phone.jpg',
      lastOrder: '2024-03-22'
    }
  ]);

  const suppliers = [
    'Tous',
    'Lactel',
    'Harry\'s',
    'Coca-Cola',
    'L\'Oréal',
    'Nivea',
    'Lafarge',
    'Samsung'
  ];

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: Math.max(0, newQuantity) }
        : item
    ).filter(item => item.quantity > 0);
    
    setCart(updatedCart);
  };

  const getTotalCartAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }
    
    if (selectedSupplier && selectedSupplier !== 'Tous') {
      filtered = filtered.filter(product => product.supplier === selectedSupplier);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSupplier, searchQuery, products]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock * 0.5) return 'danger';
    if (stock <= minStock) return 'warning';
    return 'success';
  };

  const renderCategoryNavigation = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        data={categories}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === item.id 
                  ? item.color 
                  : item.backgroundColor
              }
            ]}
            onPress={() => setSelectedCategory(item.id === '0' ? null : item.id)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={selectedCategory === item.id ? '#fff' : item.color}
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryText,
                { 
                  color: selectedCategory === item.id 
                    ? '#fff' 
                    : item.color
                }
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  // const renderHeader = () => (
  //   <View style={styles.header}>
  //     <Text style={styles.headerTitle}>Produits Distributeurs</Text>
  //     <View style={styles.headerActions}>
  //       <TouchableOpacity 
  //         style={styles.iconButton}
  //         onPress={() => setFilterMenuVisible(true)}
  //       >
  //         <MaterialCommunityIcons name="filter-variant" size={24} color="#333" />
  //       </TouchableOpacity>
  //       <TouchableOpacity 
  //         style={styles.iconButton}
  //         onPress={() => setSortMenuVisible(true)}
  //       >
  //         <MaterialCommunityIcons name="sort" size={24} color="#333" />
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeftSection}>
        <Text style={styles.headerTitle}>Distributeurs</Text>
      </View>
      <View style={styles.headerRightSection}>
        <TouchableOpacity 
          style={styles.cartIconContainer} 
          onPress={() => setIsCartModalVisible(true)}
        >
          <View style={styles.cartBadgeContainer}>
            <Text style={styles.cartBadgeText}>{cart.length}</Text>
          </View>
          <MaterialCommunityIcons 
            name="cart" 
            size={24} 
            color={cart.length > 0 ? "white" : "#A9A9A9"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <MaterialCommunityIcons name="magnify" size={24} color="#666" />
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const renderSupplierFilter = () => (
    <View style={styles.supplierContainer}>
      <FlatList
        horizontal
        data={suppliers}
        showsHorizontalScrollIndicator={false}
        style={styles.supplierList}
        renderItem={({ item }) => (
          <Chip
            style={styles.supplierChip}
            selected={selectedSupplier === item}
            onPress={() => setSelectedSupplier(item === 'Tous' ? null : item)}
            mode={selectedSupplier === item ? 'flat' : 'outlined'}
          >
            {item}
          </Chip>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );

  const renderProductItem = ({ item }) => {
    const stockStatus = getStockStatus(item.stock, item.minStock);
    const category = categories.find(cat => cat.id === item.categoryId);
    
    return (
      <TouchableOpacity 
        style={styles.productCard} 
        onPress={() => openProductDetailsModal(item)}
      >
        <Image
        source={item.image} // Use the image directly from the product object
        style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.categoryTag}>
            <MaterialCommunityIcons
              name={category ? category.icon : 'tag'}
              size={16}
              color={category ? category.color : '#666'}
            />
            <Text style={[styles.categoryTagText, { color: category ? category.color : '#666' }]}>
              {category ? category.name : 'Non catégorisé'}
            </Text>
          </View>
          <Text style={styles.supplierName}>{item.supplier}</Text>
          <View style={styles.productDetails}>
            <Text style={styles.price}>{item.price.toFixed(2)} FCFA</Text>
            <Badge
              style={[
                styles.stockBadge,
                { backgroundColor: stockStatus === 'danger' ? '#FFE5E5' : stockStatus === 'warning' ? '#FFF4E5' : '#E5FFE9' }
              ]}
            >
              <Text style={[
                styles.stockText,
                { color: stockStatus === 'danger' ? '#FF4444' : stockStatus === 'warning' ? '#FFA000' : '#00C853' }
              ]}>
                Stock: {item.stock}
              </Text>
            </Badge>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#666" />
          </TouchableOpacity>
          
        </View>
      </TouchableOpacity>
    );
  };

  const openProductDetailsModal = (product) => {
    setSelectedProduct(product);
    setSelectedProductFormat(null); // Reset format selection
    setIsProductDetailsModalVisible(true);
  };

  const renderProductDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isProductDetailsModalVisible}
      onRequestClose={() => setIsProductDetailsModalVisible(false)}
    >
      {selectedProduct && (
        <View style={styles.productDetailsModalOverlay}>
          <View style={styles.productDetailsModalContainer}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeProductModalButton}
              onPress={() => setIsProductDetailsModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>

            {/* Product Image */}
            <Image
              source={selectedProduct.image}
              style={styles.productDetailsImage}
            />

            {/* Product Details */}
            <ScrollView 
              style={styles.productDetailsScrollView}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.productDetailsName}>{selectedProduct.name}</Text>
              <Text style={styles.productDetailsSupplier}>{selectedProduct.supplier}</Text>

              {/* Product Formats */}
              <Text style={styles.formatSectionTitle}>Formats disponibles</Text>
              <View style={styles.formatContainer}>
                {productFormats[selectedProduct.id]?.map((format) => (
                  <TouchableOpacity
                    key={format.id}
                    style={[
                      styles.formatCard, 
                      selectedProductFormat?.id === format.id && styles.selectedFormatCard
                    ]}
                    onPress={() => setSelectedProductFormat(format)}
                  >
                    <Text style={styles.formatName}>{format.name}</Text>
                    <Text style={styles.formatDetails}>
                      {format.volume ? `Volume: ${format.volume}` : `Quantité: ${format.quantity}`}
                    </Text>
                    <Text style={styles.formatPrice}>{format.price} FCFA</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Additional Product Details */}
              <View style={styles.additionalDetailsContainer}>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="cube-outline" size={24} color="#666" />
                  <Text style={styles.detailText}>Stock: {selectedProduct.stock}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="calendar-today" size={24} color="#666" />
                  <Text style={styles.detailText}>Dernière commande: {selectedProduct.lastOrder}</Text>
                </View>
              </View>

              {/* Add to Cart Button */}
              <Button 
                mode="contained" 
                style={styles.addToCartButton}
                disabled={!selectedProductFormat}
                onPress={() => {
                  if (selectedProductFormat) {
                    const productToAdd = {
                      ...selectedProduct,
                      ...selectedProductFormat
                    };
                    addToCart(productToAdd);
                    setIsProductDetailsModalVisible(false);
                  }
                }}
              >
                {selectedProductFormat 
                  ? `Ajouter au panier (${selectedProductFormat.price} FCFA)` 
                  : 'Sélectionnez un format'}
              </Button>
            </ScrollView>
          </View>
        </View>
      )}
    </Modal>
  );

  const renderCartModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCartModalVisible}
      onRequestClose={() => setIsCartModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mon Panier</Text>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setIsCartModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
  
          {cart.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <MaterialCommunityIcons name="cart-off" size={64} color="#A9A9A9" />
              <Text style={styles.emptyCartText}>Votre panier est vide</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cartItemsList}
                renderItem={({ item }) => (
                  <View style={styles.cartItemCard}>
                    <Image 
                      source={item.image}
                      style={styles.cartItemImage} 
                    />
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.cartItemSupplier}>
                        {item.supplier}
                      </Text>
                      <View style={styles.cartItemQuantityContainer}>
                        <TouchableOpacity 
                          onPress={() => updateCartQuantity(item.id, item.quantity - 1)}
                          style={styles.quantityButton}
                        >
                          <MaterialCommunityIcons name="minus" size={20} color="#b937a8" />
                        </TouchableOpacity>
                        <Text style={styles.cartItemQuantity}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity 
                          onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
                          style={styles.quantityButton}
                        >
                          <MaterialCommunityIcons name="plus" size={20} color="#b937a8" />
                        </TouchableOpacity>
                        <Text style={styles.cartItemPrice}>
                          {(item.price * item.quantity).toFixed(2)} FCFA
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item.id)}
                      style={styles.deleteItemButton}
                    >
                      <MaterialCommunityIcons name="trash-can" size={24} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              />
  
              <View style={styles.cartSummary}>
                <View style={styles.cartSummaryRow}>
                  <Text style={styles.cartSummaryLabel}>Nombre d'articles</Text>
                  <Text style={styles.cartSummaryValue}>
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </Text>
                </View>
                <View style={styles.cartSummaryRow}>
                  <Text style={styles.cartSummaryLabel}>Total</Text>
                  <Text style={styles.cartSummaryTotal}>
                    {getTotalCartAmount().toFixed(2)} FCFA
                  </Text>
                </View>
              </View>
  
              <Button 
                mode="contained" 
                style={styles.validateOrderButton}
                onPress={() => {
                  if (cart.length === 0) {
                    Alert.alert('Panier vide', 'Veuillez ajouter des articles à votre panier.');
                    return;
                  }
                  // Préparer les informations de la commande à passer
                  const orderDetails = {
                    cart: cart.map(item => ({
                      id: item.id,
                      name: item.name,
                      quantity: item.quantity,
                      price: item.price,
                      image: item.image,
                      supplier: item.supplier
                    })),
                    totalAmount: getTotalCartAmount(),
                    totalItems: cart.reduce((total, item) => total + item.quantity, 0),
                    orderDate: new Date().toISOString()
                  };
                  console.log(orderDetails.cart)
                  setIsCartModalVisible(false);
                  navigation.navigate('PreOrderManagement', {
                    cart: orderDetails.cart,
                    totalAmount: orderDetails.totalAmount,
                    totalItems: orderDetails.totalItems,
                    orderDate: orderDetails.orderDate
                  });
                }}
              >
      Valider la commande
      </Button>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearchBar()}
      {renderCategoryNavigation()}
      {renderSupplierFilter()}
      {renderProductDetailsModal()}
      
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="alert" size={48} color="#666" />
            <Text style={styles.emptyText}>Aucun produit trouvé</Text>
          </View>
        )}
      />

      {renderCartModal()}

      <Menu
        visible={sortMenuVisible}
        onDismiss={() => setSortMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
        <Menu.Item onPress={() => {}} title="Prix croissant" />
        <Menu.Item onPress={() => {}} title="Prix décroissant" />
        <Menu.Item onPress={() => {}} title="Stock bas en premier" />
        <Menu.Item onPress={() => {}} title="Dernière commande" />
      </Menu>

      <Menu
        visible={filterMenuVisible}
        onDismiss={() => setFilterMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
        <Menu.Item onPress={() => {}} title="Stock bas" />
        <Menu.Item onPress={() => {}} title="Rupture de stock" />
        <Menu.Item onPress={() => {}} title="À commander" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Réinitialiser les filtres" />
      </Menu>
      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
      },
      categoryContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
      },
      categoryList: {
        paddingHorizontal: 16,
      },
      categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      categoryIcon: {
        marginRight: 8,
      },
      categoryText: {
        fontSize: 14,
        fontWeight: '600',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
        },
        headerActions: {
          flexDirection: 'row',
        },
        iconButton: {
          padding: 8,
          marginLeft: 8,
        },
        searchContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          margin: 16,
          padding: 12,
          borderRadius: 8,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        searchInput: {
          flex: 1,
          marginLeft: 8,
          fontSize: 16,
        },
        supplierContainer: {
          backgroundColor: '#fff',
          paddingVertical: 8,
        },
        supplierList: {
          paddingHorizontal: 16,
        },
        supplierChip: {
          marginRight: 8,
        },
        productList: {
          padding: 16,
        },
        headerContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: '#fff',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        headerLeftSection: {
          flex: 1,
        },
        headerRightSection: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#9c7fa7',
          borderRadius:30,
          width:'10%',
          height:'150%',
          justifyContent:'center'
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: 'black',
        },
        cartFab: {
          marginLeft: 10,
          backgroundColor: '#fff',
        },
        cartFabLabel: {
          color: '#fff',
          fontWeight: 'bold',
        },
        userStatusContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 15,
        },
        userStatusText: {
          marginLeft: 8,
          fontSize: 14,
          color: '#333',
        },
        
        productList: {
          padding: 8,
        },
        productRow: {
          justifyContent: 'space-between',
          paddingHorizontal: 4,
        },
        productCard: {
          width: (Dimensions.get('window').width - 32) / 2, // Calcule la largeur pour 2 colonnes avec marge
          backgroundColor: '#fff',
          borderRadius: 12,
          marginBottom: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          overflow: 'hidden',
        },
        productImage: {
          width: '100%',
          height: 150,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          backgroundColor: '#fff',
          alignItems:'center',
          padding:5
        },
        productInfo: {
          padding: 8,
        },
        productName: {
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
          marginBottom: 4,
        },
        categoryTag: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 4,
        },
        categoryTagText: {
          fontSize: 11,
          marginLeft: 4,
          fontWeight: '500',
        },
        supplierName: {
          fontSize: 12,
          color: '#666',
          marginBottom: 4,
        },
        productDetails: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        price: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333',
        },
        stockBadge: {
          paddingHorizontal: 6,
          paddingVertical: 2,
        },
        stockText: {
          fontSize: 11,
          fontWeight: '500',
        },
        moreButton: {
          padding: 4,
        },
        fab: {
          position: 'absolute',
          margin: 10,
          right: 0,
          bottom: 0,
          // backgroundColor: '#18812d',
          borderWidth:2
        },
        emptyContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        },
        emptyText: {
          fontSize: 16,
          color: '#666',
          marginTop: 8,
        },
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        },
        modalContainer: {
          backgroundColor: '#F5F5F5',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 20,
          maxHeight: '90%',
        },
        modalHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          marginBottom: 15,
        },
        modalTitle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
        },
        closeModalButton: {
          padding: 10,
        },
        emptyCartContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        },
        emptyCartText: {
          fontSize: 18,
          color: '#A9A9A9',
          marginTop: 15,
        },
        cartItemsList: {
          paddingHorizontal: 20,
        },
        cartItemCard: {
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          marginBottom: 15,
          padding: 15,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        cartItemImage: {
          width: 60,
          height: 60,
          borderRadius: 10,
          marginRight: 15,
        },
        cartItemDetails: {
          flex: 1,
        },
        cartItemName: {
          fontSize: 16,
          fontWeight: '600',
          color: '#b937a8',
          marginBottom: 5,
        },
        cartItemSupplier: {
          fontSize: 12,
          color: '#b937a8',
          marginBottom: 5,
        },
        cartItemQuantityContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        quantityButton: {
          padding: 5,
          backgroundColor: '#F0F0F0',
          borderRadius: 5,
        },
        cartItemQuantity: {
          marginHorizontal: 10,
          fontSize: 16,
          fontWeight: '800',
          color:'#b937a8'
        },
        cartItemPrice: {
          marginLeft: 'auto',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#b937a8',
        },
        deleteItemButton: {
          padding: 10,
        },
        cartSummary: {
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          margin: 20,
          padding: 15,
        },
        cartSummaryRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        },
        cartSummaryLabel: {
          fontSize: 16,
          color: '#b937a8',
        },
        cartSummaryValue: {
          fontSize: 16,
          fontWeight: '500',
        },
        cartSummaryTotal: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#b937a8',
        },
        validateOrderButton: {
          margin: 20,
          backgroundColor: '#b937a8',
        },  
  userStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  userStatusText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  addButton: {
    backgroundColor: '#b937a8',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  cartIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#b937a8',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productDetailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  productDetailsModalContainer: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  closeProductModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 10,
  },
  productDetailsImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  productDetailsScrollView: {
    paddingHorizontal: 20,
  },
  productDetailsName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  productDetailsSupplier: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  formatSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  formatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedFormatCard: {
    borderColor: '#b937a8',
    backgroundColor: '#F3E5F5',
  },
  formatName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  formatDetails: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  formatPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#b937a8',
  },
  additionalDetailsContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  addToCartButton: {
    marginTop: 20,
    backgroundColor: '#b937a8',
  },
});

export default SupplierProductsScreen;
