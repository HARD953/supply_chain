import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal, 
  TextInput,
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductCatalog = () => {
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
      lastOrder: '2024-03-15',
      formats: [
        { 
          id: 'small', 
          name: 'Petit (25cl)', 
          price: 1000, 
          stock: 200 
        },
        { 
          id: 'medium', 
          name: 'Moyen (50cl)', 
          price: 1500, 
          stock: 150 
        },
        { 
          id: 'large', 
          name: 'Grand (1L)', 
          price: 2500, 
          stock: 100 
        }
      ]
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
      lastOrder: '2024-03-18',
      formats: [
        { 
          id: 'small', 
          name: 'Paquet (6 tranches)', 
          price: 1800, 
          stock: 100 
        },
        { 
          id: 'medium', 
          name: 'Paquet (12 tranches)', 
          price: 2300, 
          stock: 75 
        },
        { 
          id: 'large', 
          name: 'Paquet (18 tranches)', 
          price: 3000, 
          stock: 50 
        }
      ]
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
      lastOrder: '2024-03-10',
      formats: [
        { 
          id: 'small', 
          name: 'Petit (100ml)', 
          price: 2000, 
          stock: 150 
        },
        { 
          id: 'medium', 
          name: 'Moyen (250ml)', 
          price: 3200, 
          stock: 100 
        },
        { 
          id: 'large', 
          name: 'Grand (500ml)', 
          price: 5000, 
          stock: 50 
        }
      ]
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
      lastOrder: '2024-03-20',
      formats: [
        { 
          id: 'small', 
          name: 'Canette (33cl)', 
          price: 800, 
          stock: 200 
        },
        { 
          id: 'medium', 
          name: 'Bouteille (1L)', 
          price: 1200, 
          stock: 150 
        },
        { 
          id: 'large', 
          name: 'Pack (6x1.5L)', 
          price: 5000, 
          stock: 50 
        }
      ]
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
      lastOrder: '2024-03-12',
      formats: [
        { 
          id: 'small', 
          name: 'Petit (50ml)', 
          price: 1000, 
          stock: 100 
        },
        { 
          id: 'medium', 
          name: 'Moyen (100ml)', 
          price: 1500, 
          stock: 75 
        },
        { 
          id: 'large', 
          name: 'Grand (200ml)', 
          price: 2500, 
          stock: 50 
        }
      ]
    },
    {
      id: '6',
      name: 'Ciment',
      supplier: 'Lafarge',
      price: 6500,
      stock: 500,
      minStock: 100,
      categoryId: '1',
      image: require('../assets/ciment.jpeg'),
      lastOrder: '2024-03-25',
      formats: [
        { 
          id: 'small', 
          name: 'Sac 25kg', 
          price: 4500, 
          stock: 200 
        },
        { 
          id: 'medium', 
          name: 'Sac 35kg', 
          price: 6500, 
          stock: 150 
        },
        { 
          id: 'large', 
          name: 'Sac 50kg', 
          price: 9000, 
          stock: 100 
        }
      ]
    }
  ]);

  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [selectedSupplier, setSelectedSupplier] = useState('Tous');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    // Filtrer les produits selon la recherche, catégorie et fournisseur
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== '0') {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    if (selectedSupplier !== 'Tous') {
      filtered = filtered.filter(product => product.supplier === selectedSupplier);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, selectedSupplier]);

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => 
      item.id === product.id && 
      (item.selectedFormat?.id === product.selectedFormat?.id)
    );
    
    if (existingProductIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += product.quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, product]);
    }
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        minWidth: 100,
        backgroundColor: selectedCategory === item.id ? item.color : item.backgroundColor
      }}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon 
        name={item.icon} 
        size={24} 
        color={selectedCategory === item.id ? 'white' : item.color} 
      />
      <Text 
        style={{
          marginLeft: 10,
          fontWeight: 'bold',
          color: selectedCategory === item.id ? 'white' : item.color
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSupplierItem = (supplier) => (
    <TouchableOpacity 
      style={{
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: selectedSupplier === supplier ? '#b937a8' : '#F5F5F5'
      }}
      onPress={() => setSelectedSupplier(supplier)}
    >
      <Text 
        style={{
          fontWeight: 'bold',
          color: selectedSupplier === supplier ? 'white' : 'black'
        }}
      >
        {supplier}
      </Text>
    </TouchableOpacity>
  );

  const renderProductDetailsModal = () => {
    const [selectedFormat, setSelectedFormat] = useState(selectedProduct.formats[0]);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
      const productToAdd = {
        ...selectedProduct,
        selectedFormat: selectedFormat,
        quantity: quantity
      };
      addToCart(productToAdd);
      setModalVisible(false);
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 25,
            padding: 20,
            width: '90%',
            alignItems: 'center'
          }}>
            <TouchableOpacity 
              style={{
                position: 'absolute',
                top: 15,
                right: 15
              }}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color="#b937a8" />
            </TouchableOpacity>
            
            <Image 
              source={selectedProduct.image} 
              style={{
                width: 200,
                height: 200,
                borderRadius: 25,
                marginBottom: 15
              }} 
            />
            
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 5
            }}>
              {selectedProduct.name}
            </Text>
            
            <Text style={{
              color: '#666',
              marginBottom: 10
            }}>
              {selectedProduct.supplier}
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 15,
              width: '100%'
            }}>
              {selectedProduct.formats.map(format => (
                <TouchableOpacity
                  key={format.id}
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: selectedFormat.id === format.id ? '#b937a8' : '#E0E0E0',
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: selectedFormat.id === format.id ? '#b937a8' : 'white'
                  }}
                  onPress={() => setSelectedFormat(format)}
                >
                  <Text style={{
                    fontWeight: 'bold',
                    color: selectedFormat.id === format.id ? 'white' : '#333'
                  }}>
                    {format.name}
                  </Text>
                  <Text style={{
                    marginTop: 5,
                    color: selectedFormat.id === format.id ? 'white' : '#666'
                  }}>
                    {(format.price / 100).toFixed(2)} €
                  </Text>
                  <Text style={{
                    marginTop: 5,
                    fontSize: 12,
                    color: selectedFormat.id === format.id ? 'white' : '#999'
                  }}>
                    Stock: {format.stock}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 15
            }}>
               <TouchableOpacity 
                style={{
                  padding: 10,
                  backgroundColor: '#F5F5F5',
                  borderRadius: 10
                }}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon name="minus" size={20} color="#b937a8" />
              </TouchableOpacity>
              <Text style={{
                marginHorizontal: 20,
                fontSize: 18,
                fontWeight: 'bold'
              }}>
                {quantity}
              </Text>
              <TouchableOpacity 
                style={{
                  padding: 10,
                  backgroundColor: '#F5F5F5',
                  borderRadius: 10
                }}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Icon name="plus" size={20} color="#b937a8" />
              </TouchableOpacity>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: 10
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#b937a8'
              }}>
                Total: {((selectedFormat.price * quantity) / 100).toFixed(2)} €
              </Text>
              <TouchableOpacity 
                style={{
                  backgroundColor: '#b937a8',
                  borderRadius: 15,
                  padding: 15,
                  paddingHorizontal: 30
                }}
                onPress={handleAddToCart}
              >
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  Ajouter au panier
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={{
        flex: 1,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        maxWidth: '48%'
      }}
      onPress={() => openProductDetails(item)}
    >
      <Image source={item.image} style={{
        width: 120,
        height: 120,
        borderRadius: 15
      }} />
      <View style={{
        width: '100%',
        marginTop: 10
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          height: 40
        }} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={{
          color: '#666',
          marginBottom: 5,
          fontSize: 12
        }}>
          {item.supplier}
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#b937a8'
          }}>
            {(item.price / 100).toFixed(2)} €
          </Text>
          <TouchableOpacity onPress={() => addToCart(item)}>
            <Icon name="cart-plus" size={24} color="#b937a8" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <LinearGradient 
        colors={['#b937a8', '#8e2e8b']} 
        style={{
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25
        }}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15
        }}>
          <Text style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold'
          }}>
            Catalogue
          </Text>
          <TouchableOpacity>
            <Icon name="cart" size={24} color="white" />
            {cart.length > 0 && (
              <View style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: 'white',
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: '#b937a8',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  {cart.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <TextInput
          placeholder="Rechercher un produit"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 10
          }}
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginTop: 10, marginBottom: 10 }}
        >
          <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 10, marginBottom: 10 }}
        />
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginBottom: 10 }}
        >
          {suppliers.map(renderSupplierItem)}
        </ScrollView>
      </LinearGradient>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        numColumns={2}
      />

      {selectedProduct && renderProductDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notificationBadgeText: {
    color: '#b937a8',
    fontSize: 12,
    fontWeight: 'bold'
  },
  productList: {
    padding: 10
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center'
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 15
  },
  productInfo: {
    width: '100%',
    marginTop: 10
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  productCategory: {
    color: '#666',
    marginBottom: 5
  },
  productPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b937a8'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    width: '90%',
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  modalProductImage: {
    width: 200,
    height: 200,
    borderRadius: 25,
    marginBottom: 15
  },
  modalProductName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  modalProductCategory: {
    color: '#666',
    marginBottom: 10
  },
  modalProductDescription: {
    textAlign: 'center',
    marginBottom: 15
  },
  modalProductDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15
  },
  modalProductPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8'
  },
  modalProductStock: {
    color: '#666'
  },
  addToCartButton: {
    backgroundColor: '#b937a8',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    alignItems: 'center'
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  //scroll
  categoriesScrollView: {
    marginTop: 10,
    marginBottom: 10
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 100
  },
  categoryItemText: {
    marginLeft: 10,
    fontWeight: 'bold'
  },
  suppliersScrollView: {
    marginBottom: 10
  },
  supplierItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10
  },
  supplierItemText: {
    fontWeight: 'bold'
  },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    maxWidth: '48%'
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 15
  },
  productInfo: {
    width: '100%',
    marginTop: 10
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    height: 40
  },
  productSupplier: {
    color: '#666',
    marginBottom: 5,
    fontSize: 12
  },
  productPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#b937a8'
  },

  formatSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    width: '100%'
  },
  formatOptionButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center'
  },
  selectedFormatButton: {
    backgroundColor: '#b937a8',
    borderColor: '#b937a8'
  },
  formatOptionText: {
    fontWeight: 'bold',
    color: '#333'
  },
  selectedFormatText: {
    color: 'white'
  },
  formatPriceText: {
    marginTop: 5,
    color: '#666'
  },
  formatStockText: {
    marginTop: 5,
    fontSize: 12,
    color: '#999'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10
  },
  quantityText: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold'
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8'
  }
});

export default ProductCatalog;