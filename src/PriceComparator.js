import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const PriceComparator = ({ navigation }) => {
  // Exemple de données pour les produits avec différents fournisseurs
  const [products] = useState([
    {
      id: '1',
      name: 'Lait demi-écrémé',
      category: 'Vivrier',
      suppliers: [
        {
          name: 'Lactel',
          price: 1500,
          distance: 5,
          deliveryTime: '24h',
          minOrderQuantity: 50,
          rating: 4.5,
          stock: 1000,
          lastDeliveryIssue: '2024-01-15',
          image: require('../assets/chocolat.jpeg'),
        },
        {
          name: 'Nestlé',
          price: 1450,
          distance: 8,
          deliveryTime: '48h',
          minOrderQuantity: 100,
          rating: 4.2,
          stock: 800,
          lastDeliveryIssue: '2024-02-20',
          image: require('../assets/chocolat.jpeg'),
        },
        {
          name: 'Carrefour',
          price: 1600,
          distance: 3,
          deliveryTime: '12h',
          minOrderQuantity: 25,
          rating: 4.0,
          stock: 500,
          lastDeliveryIssue: '2024-03-01',
          image: require('../assets/chocolat.jpeg'),
        }
      ]
    },
    // Ajoutez d'autres produits ici
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('price'); // 'price', 'distance', 'rating'
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  const sortSuppliers = (suppliers) => {
    return [...suppliers].sort((a, b) => {
      switch (sortCriteria) {
        case 'price':
          return a.price - b.price;
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  };

  const calculateScore = (supplier) => {
    // Score sur 100 points
    let score = 100;
    
    // Prix (30 points) - Plus le prix est bas, plus le score est élevé
    const maxPrice = Math.max(...products[0].suppliers.map(s => s.price));
    const minPrice = Math.min(...products[0].suppliers.map(s => s.price));
    const priceScore = 30 * (1 - (supplier.price - minPrice) / (maxPrice - minPrice));
    
    // Distance (20 points) - Plus proche = meilleur score
    const maxDistance = Math.max(...products[0].suppliers.map(s => s.distance));
    const distanceScore = 20 * (1 - supplier.distance / maxDistance);
    
    // Note (20 points)
    const ratingScore = 20 * (supplier.rating / 5);
    
    // Stock disponible (15 points)
    const maxStock = Math.max(...products[0].suppliers.map(s => s.stock));
    const stockScore = 15 * (supplier.stock / maxStock);
    
    // Délai de livraison (15 points)
    const deliveryScore = supplier.deliveryTime === '12h' ? 15 :
                         supplier.deliveryTime === '24h' ? 10 :
                         supplier.deliveryTime === '48h' ? 5 : 0;
    
    return Math.round(priceScore + distanceScore + ratingScore + stockScore + deliveryScore);
  };

  const renderSupplierCard = ({ item: supplier }) => (
    <View style={styles.supplierCard}>
      <Image source={supplier.image} style={styles.supplierImage} />
      <View style={styles.supplierInfo}>
        <Text style={styles.supplierName}>{supplier.name}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {calculateScore(supplier)}/100</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{supplier.rating}</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Icon name="cash" size={16} color="#1E40AF" />
            <Text style={styles.detailText}>{(supplier.price / 100).toFixed(2)} €</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={16} color="#1E40AF" />
            <Text style={styles.detailText}>{supplier.distance} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="truck-delivery" size={16} color="#1E40AF" />
            <Text style={styles.detailText}>{supplier.deliveryTime}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.orderButton}
          onPress={() => {
            Alert.alert(
              "Commander",
              `Voulez-vous commander ce produit auprès de ${supplier.name} ?`,
              [
                {
                  text: "Annuler",
                  style: "cancel"
                },
                { 
                  text: "Confirmer",
                  onPress: () => {
                    Alert.alert("Commande effectuée", "Votre commande a été enregistrée avec succès !");
                    navigation.goBack();
                  }
                }
              ]
            );
          }}
        >
          <Text style={styles.orderButtonText}>Commander</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProductComparison = () => {
    if (!selectedProduct) return null;

    const sortedSuppliers = sortSuppliers(selectedProduct.suppliers);

    return (
      <View style={styles.comparisonContainer}>
        <View style={styles.sortButtons}>
          <TouchableOpacity 
            style={[styles.sortButton, sortCriteria === 'price' && styles.activeSortButton]}
            onPress={() => setSortCriteria('price')}
          >
            <Text style={[styles.sortButtonText, sortCriteria === 'price' && styles.activeSortButtonText]}>
              Prix
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortCriteria === 'distance' && styles.activeSortButton]}
            onPress={() => setSortCriteria('distance')}
          >
            <Text style={[styles.sortButtonText, sortCriteria === 'distance' && styles.activeSortButtonText]}>
              Distance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortCriteria === 'rating' && styles.activeSortButton]}
            onPress={() => setSortCriteria('rating')}
          >
            <Text style={[styles.sortButtonText, sortCriteria === 'rating' && styles.activeSortButtonText]}>
              Note
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={sortedSuppliers}
          renderItem={renderSupplierCard}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.suppliersList}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#1E40AF', '#3B82F6']} 
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comparateur de prix</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <TextInput
          placeholder="Rechercher un produit"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#666"
        />
      </LinearGradient>

      <View style={styles.content}>
        {!selectedProduct ? (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.productCard}
                onPress={() => setSelectedProduct(item)}
              >
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.suppliersCount}>
                  {item.suppliers.length} fournisseurs disponibles
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          renderProductComparison()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCategory: {
    color: '#666',
    marginBottom: 5,
  },
  suppliersCount: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  comparisonContainer: {
    flex: 1,
  },
  sortButtons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  sortButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  activeSortButton: {
    backgroundColor: '#1E40AF',
  },
  sortButtonText: {
    fontWeight: '500',
    color: '#666',
  },
  activeSortButtonText: {
    color: 'white',
  },
  suppliersList: {
    padding: 5,
  },
  supplierCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
  },
  supplierImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 10,
    color: '#666',
  },
  orderButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PriceComparator;