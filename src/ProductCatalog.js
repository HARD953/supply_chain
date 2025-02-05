  import React, { useState, useEffect } from 'react';
  import { 
    View, 
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    ScrollView,
    StyleSheet,
    Pressable,
    Platform
  } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import { Alert } from 'react-native';

  const ProductCatalog = ({ navigation }) => {
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
        typesupplier: 'Fabricant',
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
        name: 'Lait demi-écrémé',
        typesupplier: 'Grossiste',
        supplier: 'Lactel',
        price: 1500,
        stock: 150,
        minStock: 50,
        categoryId: '3',
        image: require('../assets/iphone.jpg'),
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
        id: '3',
        name: 'Lait demi-écrémé',
        typesupplier: 'Semi-Grossiste',
        supplier: 'Lactel',
        price: 1500,
        stock: 150,
        minStock: 50,
        categoryId: '2',
        image: require('../assets/ciment.jpeg'),
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
        id: '4',
        name: 'Lait demi-écrémé',
        typesupplier: 'Lactel',
        supplier: 'Lactel',
        price: 1500,
        stock: 150,
        minStock: 50,
        categoryId: '2',
        image: require('../assets/brouette.jpg'),
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
        id: '5',
        name: 'Lait demi-écrémé',
        typesupplier: 'Lactel',
        supplier: 'Lactel',
        price: 1500,
        stock: 150,
        minStock: 50,
        categoryId: '2',
        image: require('../assets/ciment.jpeg'),
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
        id: '6',
        name: 'Lait demi-écrémé',
        typesupplier: 'Lactel',
        supplier: 'Lactel',
        price: 1500,
        stock: 150,
        minStock: 50,
        categoryId: '2',
        image: require('../assets/brouette.jpg'),
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
      // ... (autres produits restent les mêmes)
    ]);

    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('0');
    const [selectedSupplier, setSelectedSupplier] = useState('Tous');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [cartModalVisible, setCartModalVisible] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedZone, setSelectedZone] = useState('Tous');
    const [selectedSupplierType, setSelectedSupplierType] = useState('0');

    const DropdownSelect = ({ 
      label, 
      value, 
      options, 
      onChange, 
      placeholder 
    }) => {
      const [isOpen, setIsOpen] = useState(false);
    
      return (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            {label}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 10,
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onPress={() => setIsOpen(!isOpen)}
          >
            <Text style={{ color: value ? '#000' : '#666' }}>
              {value || placeholder}
            </Text>
            <Icon 
              name={isOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
    
          {isOpen && (
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              marginTop: 5,
              maxHeight: 200,
              borderWidth: 1,
              borderColor: '#E0E0E0'
            }}>
              <ScrollView>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={{
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E0E0E0'
                    }}
                    onPress={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                  >
                    <Text style={{
                      color: value === option ? '#2563EB' : '#000',
                      fontWeight: value === option ? 'bold' : 'normal'
                    }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      );
    };

    const getSupplierTypeFromId = (id) => {
      switch (id) {
        case '1':
          return 'Fabricant';
        case '2':
          return 'Grossiste';
        case '3':
          return 'Semi-Grossiste';
        default:
          return null;
      }
    };

    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
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

      if (selectedZone !== 'Tous') {
        // Ajoutez ici la logique de filtrage par zone
        // filtered = filtered.filter(product => product.zone === selectedZone);
      }

      if (selectedSupplierType !== '0') {
        const targetType = getSupplierTypeFromId(selectedSupplierType);
        if (targetType) {
          filtered = filtered.filter(product => product.typesupplier === targetType);
        }
      }

      setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory, selectedSupplier, selectedZone, selectedSupplierType]);

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


    const handleAddToCart = () => {
      if (!selectedProduct || !selectedFormat) return;

      const productToAdd = {
        ...selectedProduct,
        selectedFormat: selectedFormat,
        quantity: quantity
      };
      addToCart(productToAdd);
      setModalVisible(false);
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
          backgroundColor: selectedSupplier === supplier ? '#2563EB' : '#F5F5F5'
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
      if (!selectedProduct) return null;

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
                <Icon name="close" size={24} color="#2563EB" />
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
                      borderColor: selectedFormat?.id === format.id ? '#2563EB' : '#E0E0E0',
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: selectedFormat?.id === format.id ? '#2563EB' : 'white'
                    }}
                    onPress={() => setSelectedFormat(format)}
                  >
                    <Text style={{
                      fontWeight: 'bold',
                      color: selectedFormat?.id === format.id ? 'white' : '#333'
                    }}>
                      {format.name}
                    </Text>
                    <Text style={{
                      marginTop: 5,
                      color: selectedFormat?.id === format.id ? 'white' : '#666'
                    }}>
                      {(format.price / 100).toFixed(2)} FCFA
                    </Text>
                    <Text style={{
                      marginTop: 5,
                      fontSize: 12,
                      color: selectedFormat?.id === format.id ? 'white' : '#999'
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
                  <Icon name="minus" size={20} color="#2563EB" />
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
                  <Icon name="plus" size={20} color="#2563EB" />
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
                  color: '#2563EB'
                }}>
                  Total: {((selectedFormat?.price * quantity) / 100).toFixed(2)} FCFA
                </Text>
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#2563EB',
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

    const FilterModal = ({ 
      visible, 
      onClose, 
      categories, 
      suppliers,
      selectedCategory,
      setSelectedCategory,
      selectedSupplier,
      setSelectedSupplier,
      selectedZone,
      setSelectedZone,
      selectedSupplierType,
      setSelectedSupplierType,
    }) => {

      // État local pour stocker temporairement les valeurs des filtres
    const [tempCategory, setTempCategory] = useState(selectedCategory);
    const [tempSupplier, setTempSupplier] = useState(selectedSupplier);
    const [tempZone, setTempZone] = useState(selectedZone);
    const [tempSupplierType, setTempSupplierType] = useState(selectedSupplierType);

    // Réinitialiser les états temporaires quand le modal s'ouvre
    useEffect(() => {
      if (visible) {
        setTempCategory(selectedCategory);
        setTempSupplier(selectedSupplier);
        setTempZone(selectedZone);
        setTempSupplierType(selectedSupplierType);
      }
    }, [visible]);

    const handleApplyFilters = () => {
      // Appliquer les filtres
      setSelectedCategory(tempCategory);
      setSelectedSupplier(tempSupplier);
      setSelectedZone(tempZone);
      setSelectedSupplierType(tempSupplierType);
      
      // Fermer le modal
      onClose();
    };

      const supplierTypes = [
        { 
          id: '0', 
          name: 'Tous', 
          icon: 'store', 
          color: '#607D8B',
          backgroundColor: '#ECEFF1'
        },
        { 
          id: '1', 
          name: 'Fabricant', 
          icon: 'factory', 
          color: '#FF9800',
          backgroundColor: '#FFF3E0'
        },
        { 
          id: '2', 
          name: 'Grossiste', 
          icon: 'warehouse', 
          color: '#4CAF50',
          backgroundColor: '#E8F5E9'
        },
        { 
          id: '3', 
          name: 'Semi-Grossiste', 
          icon: 'store-check', 
          color: '#9C27B0',
          backgroundColor: '#F3E5F5'
        }
      ];
      const zones = ['Tous', 'Nord', 'Sud', 'Est', 'Ouest', 'Centre'];
    
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              padding: 20,
              maxHeight: '80%'
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Filtres</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#2563EB" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {/* Catégories */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Catégories</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 10,
                        marginRight: 10,
                        marginBottom: 10,
                        backgroundColor: selectedCategory === category.id ? category.color : category.backgroundColor
                      }}
                      onPress={() =>
                        { setSelectedCategory(category.id);
                          // Ferme le modal
                        onClose();

                        }
                      }
                    >
                      <Icon 
                        name={category.icon} 
                        size={20} 
                        color={selectedCategory === category.id ? 'white' : category.color}
                      />
                      <Text style={{
                        marginLeft: 5,
                        color: selectedCategory === category.id ? 'white' : category.color,
                        fontWeight: 'bold'
                      }}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
    
                {/* Type de fournisseur */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Type de fournisseur</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                  {supplierTypes.map(type => (
                    <TouchableOpacity
                      key={type.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 10,
                        marginRight: 10,
                        marginBottom: 10,
                        backgroundColor: selectedSupplierType === type.id ? type.color : type.backgroundColor
                      }}
                      onPress={() => {
                        // Met à jour le type de fournisseur sélectionné
                        setSelectedSupplierType(type.id);
                        
                        // Ferme le modal
                        onClose();
                      }}
                    >
                      <Icon 
                        name={type.icon} 
                        size={20} 
                        color={selectedSupplierType === type.id ? 'white' : type.color}
                      />
                      <Text style={{
                        marginLeft: 5,
                        color: selectedSupplierType === type.id ? 'white' : type.color,
                        fontWeight: 'bold'
                      }}>
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
    
                {/* Zone Dropdown */}
                <DropdownSelect
                  label="Zone"
                  value={selectedZone}
                  options={zones}
                  onChange={setSelectedZone}
                  placeholder="Sélectionner une zone"
                />
    
                {/* Fournisseur Dropdown */}
                <DropdownSelect
                  label="Fournisseur"
                  value={selectedSupplier}
                  options={suppliers}
                  onChange={setSelectedSupplier}
                  placeholder="Sélectionner un fournisseur"
                />
              </ScrollView>
    
              <TouchableOpacity
                style={{
                  backgroundColor: '#2563EB',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 20
                }}
                onPress={onClose}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Appliquer les filtres</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    };

    //Validation de panier

    const renderCartModal = () => {
      const calculateTotal = () => {
        return cart.reduce((total, item) => 
          total + (item.selectedFormat?.price * item.quantity), 0
        );
      };
    
      const removeFromCart = (indexToRemove) => {
        const updatedCart = cart.filter((_, index) => index !== indexToRemove);
        setCart(updatedCart);
      };
    
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={cartModalVisible}
          onRequestClose={() => setCartModalVisible(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              padding: 20,
              maxHeight: '90%'
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15
              }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold'
                }}>
                  Votre Panier
                </Text>
                <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                  <Icon name="close" size={24} color="#2563EB" />
                </TouchableOpacity>
              </View>
    
              {cart.length === 0 ? (
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Icon 
                    name="cart-off" 
                    size={100} 
                    color="#E0E0E0" 
                    style={{ marginBottom: 20 }}
                  />
                  <Text style={{
                    fontSize: 18,
                    color: '#666'
                  }}>
                    Votre panier est vide
                  </Text>
                </View>
              ) : (
                <>
                  <FlatList
                    data={cart}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={({ item, index }) => (
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        paddingVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0'
                      }}>
                        <Image 
                          source={item.image} 
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 10,
                            marginRight: 10
                          }} 
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold'
                          }}>
                            {item.name}
                          </Text>
                          <Text style={{ color: '#666' }}>
                            {item.selectedFormat?.name}
                          </Text>
                          <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                            {(item.selectedFormat?.price / 100 * item.quantity).toFixed(2)} FCFA
                          </Text>
                        </View>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                          <Text style={{ marginRight: 10 }}>
                            {item.quantity}
                          </Text>
                          <TouchableOpacity 
                            onPress={() => removeFromCart(index)}
                            style={{
                              backgroundColor: '#FFE5E5',
                              padding: 5,
                              borderRadius: 5
                            }}
                          >
                            <Icon name="delete" size={20} color="#FF6B6B" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
    
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 15
                  }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold'
                    }}>
                      Total
                    </Text>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#2563EB'
                    }}>
                      {(calculateTotal() / 100).toFixed(2)} FCFA
                    </Text>
                  </View>
    
                  <TouchableOpacity 
                    style={{
                      backgroundColor: '#2563EB',
                      borderRadius: 15,
                      padding: 15,
                      marginTop: 15,
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      // Logique de validation de commande
                      Alert.alert(
                        "Confirmation de commande",
                        "Voulez-vous vraiment valider cette commande ?",
                        [
                          {
                            text: "Annuler",
                            style: "cancel"
                          },
                          { 
                            text: "Confirmer", 
                            onPress: () => {
                              // Ici vous pouvez ajouter la logique de soumission de commande
                              Alert.alert("Commande validée", "Merci pour votre achat !");
                              setCart([]);
                              setCartModalVisible(false);
                            }
                          }
                        ]
                      );
                    }}
                  >
                    <Text style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 16
                    }}>
                      Valider la commande
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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
              color: '#2563EB'
            }}>
              {item.typesupplier }
            </Text>
            {/* <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#2563EB'
            }}>
              {(item.price / 100).toFixed(2)} FCFA
            </Text> */}
            <TouchableOpacity onPress={() => addToCart(item)}>
              <Icon name="cart-plus" size={24} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <LinearGradient 
          colors={['#1E40AF', '#3B82F6']}
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => setFilterModalVisible(true)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 8,
                  borderRadius: 8
                }}
              >
                <Icon name="filter-variant" size={20} color="white" />
              </TouchableOpacity>
              <Text style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                marginRight: 10
              }}>
                Catalogue
              </Text>
            
            </View>
            <TouchableOpacity onPress={() => setCartModalVisible(true)}>
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
                    color: '#2563EB',
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

          {/* <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={{ marginBottom: 10 }}
          >
            {suppliers.map(renderSupplierItem)}
          </ScrollView> */}

      <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          categories={categories}
          suppliers={suppliers}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          selectedSupplierType={selectedSupplierType}
        setSelectedSupplierType={setSelectedSupplierType}
        />

        
        </LinearGradient>

        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
          numColumns={2}
        />
          <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: '#2563EB',
                borderRadius: 30,
                padding: 15,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              onPress={() => navigation.navigate('PriceComparator')}
            >
          <Icon name="chart-line-variant" size={24} color="white" />
        </TouchableOpacity>

        {modalVisible && renderProductDetailsModal()}
        {cartModalVisible && renderCartModal()}
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
      color: '#2563EB',
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
      color: '#2563EB'
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
      color: '#2563EB'
    },
    modalProductStock: {
      color: '#666'
    },
    addToCartButton: {
      backgroundColor: '#2563EB',
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
      color: '#2563EB'
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
      backgroundColor: '#2563EB',
      borderColor: '#2563EB'
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
      color: '#2563EB'
    }
  });

  export default ProductCatalog;