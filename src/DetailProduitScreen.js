import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Share
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Button,
  Badge,
  Divider,
  Portal,
  Modal,
  ActivityIndicator
} from 'react-native-paper';

const ProductDetailsScreen = ({ route, navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dans un cas réel, ces données viendraient des props de navigation
  const product = {
    id: '1',
    name: 'Lait demi-écrémé',
    supplier: 'Lactel',
    price: 1500,
    stock: 150,
    minStock: 50,
    categoryId: '2',
    description: 'Lait demi-écrémé de haute qualité, source de calcium et de protéines. Idéal pour toute la famille.',
    nutrition: {
      calories: '46 kcal/100ml',
      protein: '3.3g/100ml',
      fat: '1.5g/100ml',
      carbs: '4.8g/100ml',
      calcium: '120mg/100ml'
    },
    specifications: {
      volume: '1 litre',
      storage: 'À conserver entre 2°C et 6°C',
      shelfLife: '7 jours après ouverture',
      packaging: 'Bouteille recyclable'
    },
    lastOrder: '2024-03-15',
    reviews: 4.5,
    reviewCount: 128
  };

  const getStockStatus = (stock, minStock) => {
    if (stock <= minStock * 0.5) return { color: '#FF4444', text: 'Stock critique' };
    if (stock <= minStock) return { color: '#FFA000', text: 'Stock bas' };
    return { color: '#00C853', text: 'En stock' };
  };

  const stockStatus = getStockStatus(product.stock, product.minStock);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez ${product.name} de ${product.supplier} sur notre application !`,
        title: product.name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = () => {
    setIsLoading(true);
    // Simuler un délai de chargement
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
      // Ici vous ajouteriez la logique pour mettre à jour le panier
    }, 1000);
  };

  const renderHeader = () => (
    <SafeAreaView style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{product.name}</Text>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleShare}
      >
        <MaterialCommunityIcons name="share-variant" size={24} color="#333" />
      </TouchableOpacity>
    </SafeAreaView>
  );

  const renderImageSection = () => (
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => setShowImageModal(true)}
    >
      <Image
        source={require('../assets/iphone.jpg')}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.zoomIndicator}>
        <MaterialCommunityIcons name="magnify-plus" size={20} color="#666" />
        <Text style={styles.zoomText}>Toucher pour agrandir</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPriceSection = () => (
    <View style={styles.priceContainer}>
      <View>
        <Text style={styles.price}>{product.price.toFixed(2)} FCFA</Text>
        <View style={styles.stockIndicator}>
          <View style={[styles.stockDot, { backgroundColor: stockStatus.color }]} />
          <Text style={styles.stockText}>{stockStatus.text}</Text>
          <Text style={styles.stockAmount}>({product.stock} unités)</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <MaterialCommunityIcons name="star" size={20} color="#FFC107" />
        <Text style={styles.rating}>{product.reviews}</Text>
        <Text style={styles.reviewCount}>({product.reviewCount})</Text>
      </View>
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>Quantité:</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <MaterialCommunityIcons 
            name="minus" 
            size={20} 
            color={quantity <= 1 ? '#999' : '#333'} 
          />
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{quantity}</Text>
        <TouchableOpacity
          style={[styles.quantityButton, quantity >= product.stock && styles.quantityButtonDisabled]}
          onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
          disabled={quantity >= product.stock}
        >
          <MaterialCommunityIcons 
            name="plus" 
            size={20} 
            color={quantity >= product.stock ? '#999' : '#333'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSupplierInfo = () => (
    <View style={styles.supplierContainer}>
      <View style={styles.supplierHeader}>
        <MaterialCommunityIcons name="factory" size={24} color="#666" />
        <Text style={styles.supplierName}>{product.supplier}</Text>
      </View>
      <Text style={styles.lastOrder}>
        Dernière commande: {new Date(product.lastOrder).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.specificationsContainer}>
      <Text style={styles.sectionTitle}>Spécifications</Text>
      {Object.entries(product.specifications).map(([key, value]) => (
        <View key={key} style={styles.specificationRow}>
          <Text style={styles.specificationLabel}>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </Text>
          <Text style={styles.specificationValue}>{value}</Text>
        </View>
      ))}
    </View>
  );

  const renderNutrition = () => (
    <View style={styles.nutritionContainer}>
      <Text style={styles.sectionTitle}>Informations nutritionnelles</Text>
      {Object.entries(product.nutrition).map(([key, value]) => (
        <View key={key} style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel}>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </Text>
          <Text style={styles.nutritionValue}>{value}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView>
        {renderImageSection()}
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          {renderPriceSection()}
          {renderQuantitySelector()}
          <Divider style={styles.divider} />
          {renderSupplierInfo()}
          <Divider style={styles.divider} />
          <Text style={styles.description}>{product.description}</Text>
          <Divider style={styles.divider} />
          {renderSpecifications()}
          <Divider style={styles.divider} />
          {renderNutrition()}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          style={styles.addToCartButton}
          loading={isLoading}
          onPress={handleAddToCart}
        >
          Ajouter au panier • {(product.price * quantity).toFixed(2)} FCFA
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showImageModal}
          onDismiss={() => setShowImageModal(false)}
          contentContainerStyle={styles.imageModal}
        >
          <Image
            source={require('../assets/iphone.jpg')}
            style={styles.modalImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeModal}
            onPress={() => setShowImageModal(false)}
          >
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  zoomIndicator: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  zoomText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  contentContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E4D92',
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  stockAmount: {
    fontSize: 14,
    color: '#999',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  quantityButton: {
    padding: 8,
    borderRadius: 8,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    minWidth: 48,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  supplierContainer: {
    marginBottom: 16,
  },
  supplierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  lastOrder: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  specificationsContainer: {
    marginBottom: 16,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  specificationLabel: {
    fontSize: 14,
    color: '#666',
  },
  specificationValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  nutritionContainer: {
    marginBottom: 80,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
},
    nutritionContainer: {
        marginBottom: 80,
      },
      nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
      },
      nutritionLabel: {
        fontSize: 14,
        color: '#666',
      },
      nutritionValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
      },
      footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      addToCartButton: {
        borderRadius: 8,
        backgroundColor: '#1E4D92',
      },
      imageModal: {
        backgroundColor: 'black',
        margin: 0,
        flex: 1,
        justifyContent: 'center',
      },
      modalImage: {
        width: '100%',
        height: '100%',
      },
      closeModal: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
      }
    });
    
    export default ProductDetailsScreen;