import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const TopProductsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const filterHeight = useRef(new Animated.Value(1)).current;

  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);
    
    Animated.timing(filterHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  // Données des produits avec fournisseur et catégorie
  const topProducts = [
    { 
      id: 1, 
      name: 'Lait', 
      sales: 45, 
      image: 'https://via.placeholder.com/150', 
      description: 'Lait frais de la région',
      price: 500,
      stockQuantity: 120,
      supplier: 'Laiterie du Nord',
      category: 'Produits laitiers'
    },
    { 
      id: 2, 
      name: 'Pain', 
      sales: 38, 
      image: 'https://via.placeholder.com/150', 
      description: 'Pain artisanal fait maison',
      price: 250,
      stockQuantity: 80,
      supplier: 'Boulangerie Centrale',
      category: 'Boulangerie'
    },
    { 
      id: 3, 
      name: 'Eau', 
      sales: 32, 
      image: 'https://via.placeholder.com/150', 
      description: 'Eau minérale naturelle',
      price: 300,
      stockQuantity: 200,
      supplier: 'Eau Pure SA',
      category: 'Boissons'
    },
    { 
      id: 4, 
      name: 'Yaourt', 
      sales: 28, 
      image: 'https://via.placeholder.com/150', 
      description: 'Yaourt nature',
      price: 350,
      stockQuantity: 90,
      supplier: 'Laiterie du Nord',
      category: 'Produits laitiers'
    },
    { 
      id: 5, 
      name: 'Fromage', 
      sales: 22, 
      image: 'https://via.placeholder.com/150', 
      description: 'Fromage de vache local',
      price: 1200,
      stockQuantity: 50,
      supplier: 'Laiterie du Nord',
      category: 'Produits laitiers'
    }
  ];

  // Extraire les catégories et fournisseurs uniques
  const categories = [...new Set(topProducts.map(p => p.category))];
  const suppliers = [...new Set(topProducts.map(p => p.supplier))];

  // Initialiser les produits filtrés
  useEffect(() => {
    setFilteredProducts(topProducts);
  }, []);

  // Filtrer les produits
  useEffect(() => {
    let filtered = [...topProducts];
    
    if (searchText) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchText.toLowerCase()) ||
        p.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (selectedSupplier) {
      filtered = filtered.filter(p => p.supplier === selectedSupplier);
    }
    
    setFilteredProducts(filtered);
  }, [searchText, selectedCategory, selectedSupplier]);

  // Calculer les totaux
  const totals = {
    totalSales: filteredProducts.reduce((sum, p) => sum + p.sales, 0),
    totalStock: filteredProducts.reduce((sum, p) => sum + p.stockQuantity, 0),
    totalValue: filteredProducts.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#b937a8', '#e91e63']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produits les plus achetés</Text>
      </View>
    </LinearGradient>
  );

  const renderSearchAndFilters = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchHeader}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.filterToggleButton,
            showFilters && styles.filterToggleButtonActive
          ]}
          onPress={toggleFilters}
        >
          <MaterialCommunityIcons
            name={showFilters ? "filter-off" : "filter"}
            size={24}
            color="#b937a8"
          />
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.filtersWrapper,
          {
            maxHeight: filterHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 150]
            }),
            opacity: filterHeight,
            marginBottom: filterHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 10]
            })
          }
        ]}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filtersScroll}
        >
          <View style={styles.filtersContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category ? '' : category
                )}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filtersScroll}
        >
          <View style={styles.filtersContainer}>
            {suppliers.map(supplier => (
              <TouchableOpacity
                key={supplier}
                style={[
                  styles.filterChip,
                  selectedSupplier === supplier && styles.filterChipActive
                ]}
                onPress={() => setSelectedSupplier(
                  selectedSupplier === supplier ? '' : supplier
                )}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedSupplier === supplier && styles.filterChipTextActive
                ]}>
                  {supplier}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );

  const renderTotals = () => (
    <View style={styles.totalsContainer}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Ventes</Text>
        <Text style={styles.totalValue}>{totals.totalSales}</Text>
      </View>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Stock Total</Text>
        <Text style={styles.totalValue}>{totals.totalStock}</Text>
      </View>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Valeur Totale</Text>
        <Text style={styles.totalValue}>{totals.totalValue.toLocaleString()} FCFA</Text>
      </View>
    </View>
  );

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: product.image }} 
        style={styles.productImage} 
      />
      <View style={styles.productDetails}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.salesBadge}>{product.sales} ventes</Text>
        </View>
        <Text style={styles.productDescription}>{product.description}</Text>
        <View style={styles.productMetadata}>
          <Text style={styles.metadataText}>
            <MaterialCommunityIcons name="tag" size={14} color="#666" /> {product.category}
          </Text>
          <Text style={styles.metadataText}>
            <MaterialCommunityIcons name="truck" size={14} color="#666" /> {product.supplier}
          </Text>
        </View>
        <View style={styles.productFooter}>
          <View style={styles.productStats}>
            <Text style={styles.productPrice}>{product.price} FCFA</Text>
            <Text style={styles.stockText}>Stock: {product.stockQuantity}</Text>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {/* Action pour modifier le produit */}}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#b937a8" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearchAndFilters()}
      {renderTotals()}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 20
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16
  },
  filterToggleButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filterToggleButtonActive: {
    backgroundColor: '#f0e6ef',
  },
  filtersWrapper: {
    overflow: 'hidden',
  },
  filtersScroll: {
    marginBottom: 5,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  filterChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10
  },
  filterChipActive: {
    backgroundColor: '#b937a8'
  },
  filterChipText: {
    color: '#666'
  },
  filterChipTextActive: {
    color: 'white'
  },
  totalsContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  totalCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10
  },
  totalLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b937a8'
  },
  scrollContainer: {
    flex: 1
  },
  contentContainer: {
    padding: 20
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#b937a8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 15
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between'
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8'
  },
  salesBadge: {
    backgroundColor: '#e91e63',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12
  },
  productDescription: {
    color: '#666',
    marginTop: 5
  },
  productMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  metadataText: {
    color: '#666',
    fontSize: 12
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  productStats: {
    flexDirection: 'column'
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#2ECC71'
  },
  stockText: {
    color: '#666',
    fontSize: 12
  },
  actionButton: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginRight: 10
  },
  filterToggleButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  filtersWrapper: {
    marginTop: 5
  },
});

export default TopProductsScreen;