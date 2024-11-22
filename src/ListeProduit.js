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
  Dimensions
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
      image: 'https://placeholder.com/milk.jpg',
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
      image: 'https://placeholder.com/bread.jpg',
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
      image: 'https://placeholder.com/shampoo.jpg',
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
      image: 'https://placeholder.com/coke.jpg',
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
      image: 'https://placeholder.com/cream.jpg',
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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Produits Distributeurs</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setFilterMenuVisible(true)}
        >
          <MaterialCommunityIcons name="filter-variant" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setSortMenuVisible(true)}
        >
          <MaterialCommunityIcons name="sort" size={24} color="#333" />
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
        onPress={() => addToCart(item)}
      >
        <Image
          source={require('../assets/brouette.jpg')}
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
        <TouchableOpacity style={styles.moreButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderCartModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCartModalVisible}
      onRequestClose={() => setIsCartModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Votre Panier</Text>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItemContainer}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <View style={styles.cartItemQuantityContainer}>
                  <TouchableOpacity onPress={() => updateCartQuantity(item.id, item.quantity - 1)}>
                    <MaterialCommunityIcons name="minus" size={24} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateCartQuantity(item.id, item.quantity + 1)}>
                    <MaterialCommunityIcons name="plus" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartItemPrice}>{(item.price * item.quantity).toFixed(2)} FCFA</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <MaterialCommunityIcons name="delete" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.cartTotalContainer}>
            <Text style={styles.cartTotalText}>Total: {getTotalCartAmount().toFixed(2)} FCFA</Text>
          </View>
          <Button 
            mode="contained" 
            style={styles.validateCartButton}
            onPress={() => {
              // Logique de validation de commande
              console.log('Commande validée:', cart);
              setCart([]);
              setIsCartModalVisible(false);
              navigation.navigate('PreOrderManagement')
              // Add additional logic for order processing if needed
            }}
    
          >
            Valider la commande
          </Button>
          <Button 
            mode="outlined" 
            style={styles.closeCartButton}
            onPress={() => setIsCartModalVisible(false)}
          >
            Fermer
          </Button>
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

      <FAB
      style={styles.fab}
      icon="cart"
      onPress={() => setIsCartModalVisible(true)}
      label={`Panier (${cart.length})`}
      labelStyle={{ color: '#fff' }}  // Ajout de cette ligne
    />
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
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
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
        // productCard: {
        //   flexDirection: 'row',
        //   backgroundColor: '#fff',
        //   borderRadius: 12,
        //   padding: 12,
        //   marginBottom: 12,
        //   elevation: 2,
        //   shadowColor: '#000',
        //   shadowOffset: { width: 0, height: 1 },
        //   shadowOpacity: 0.1,
        //   shadowRadius: 2,
        // },
        // productImage: {
        //   width: 100,
        //   height: 80,
        //   borderRadius: 8,
        //   backgroundColor: '#f0f0f0',
        // },
        // productInfo: {
        //   flex: 1,
        //   marginLeft: 12,
        // },
        // productName: {
        //   fontSize: 16,
        //   fontWeight: '600',
        //   color: '#333',
        //   marginBottom: 4,
        // },
        // categoryTag: {
        //   flexDirection: 'row',
        //   alignItems: 'center',
        //   marginBottom: 4,
        // },
        // categoryTagText: {
        //   fontSize: 12,
        //   marginLeft: 4,
        //   fontWeight: '500',
        // },
        // supplierName: {
        //   fontSize: 14,
        //   color: '#666',
        //   marginBottom: 8,
        // },
        // productDetails: {
        //   flexDirection: 'row',
        //   alignItems: 'center',
        //   justifyContent: 'space-between',
        // },
        // price: {
        //   fontSize: 16,
        //   fontWeight: 'bold',
        //   color: '#333',
        // },
        // stockBadge: {
        //   paddingHorizontal: 8,
        //   paddingVertical: 4,
        //   height:''
        // },
        // stockText: {
        //   fontSize: 12,
        //   fontWeight: '500',
        // },
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
          height: 120,
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
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: '#1E4D92',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cartItemName: {
    flex: 2,
    fontSize: 16,
  },
  cartItemQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cartItemQuantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  cartItemPrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cartTotalContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cartTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  validateCartButton: {
    marginTop: 15,
    backgroundColor: '#4A90E2',
    
  },
  closeCartButton: {
    marginTop: 10,
  },
});

export default SupplierProductsScreen;