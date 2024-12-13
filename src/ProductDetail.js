import React, { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Chip } from 'react-native-paper';
// import { format } from 'date-fns';
// import { formatCurrency } from 'react-native-localize';

const ProductDetailsScreen = memo(({ route, navigation }) => {
  const { product, categories } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fallback si la catégorie est manquante
  const category = categories.find(cat => cat.id === product.categoryId) || {
    name: 'Non catégorisé', 
    icon: 'tag', 
    color: '#666'
  };

  // Obtenir la couleur dynamique du stock
  const getStockColor = (stock, minStock) => {
    if (stock <= 0) return '#FF4444';
    if (stock <= minStock * 0.5) return '#FFA000';
    return '#00C853';
  };

  // Gestion de l'ajout au panier
  const handleAddToCart = () => {
    if (quantity > product.stock) {
      Alert.alert(
        "Stock insuffisant", 
        `Quantité maximale disponible : ${product.stock}`
      );
      return;
    }
    
    setIsAddingToCart(true);
    try {
      // Logique d'ajout au panier
      // Potentiellement un appel à une API ou un store de gestion d'état
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter au panier");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Contrôle de la quantité
  const decrementQuantity = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        accessibilityLabel="Retour"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons 
          name="arrow-left" 
          size={24} 
          color="#333" 
          accessibilityHidden
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Détails du Produit</Text>
      <TouchableOpacity 
        style={styles.shareButton}
        accessibilityLabel="Partager"
      >
        <MaterialCommunityIcons name="share-variant" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderProductImage = () => (
    <View style={styles.imageContainer}>
      <Image
        source={product.image}
        style={styles.productImage}
        resizeMode="contain"
        // defaultSource={require('./placeholder-image.png')}
        progressiveRenderingEnabled
        cache="force-cache"
      />
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfoContainer}>
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.categoryTag}>
        <MaterialCommunityIcons
          name={category.icon}
          size={16}
          color={category.color}
        />
        <Text style={[styles.categoryTagText, { color: category.color }]}>
          {category.name}
        </Text>
      </View>
      <Text style={styles.supplierName}>Fournisseur: {product.supplier}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {product.price}
        </Text>
        <View style={styles.stockInfo}>
          <MaterialCommunityIcons 
            name="warehouse" 
            size={16} 
            color={getStockColor(product.stock, product.minStock)}
          />
          <Text style={styles.stockText}>Stock: {product.stock}</Text>
        </View>
      </View>
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.quantitySelectorContainer}>
      <Text style={styles.quantityLabel}>Quantité</Text>
      <View style={styles.quantitySelector}>
        <TouchableOpacity 
          onPress={decrementQuantity}
          style={styles.quantityButton}
          accessibilityLabel="Réduire la quantité"
        >
          <MaterialCommunityIcons name="minus" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity 
          onPress={incrementQuantity}
          style={styles.quantityButton}
          accessibilityLabel="Augmenter la quantité"
        >
          <MaterialCommunityIcons name="plus" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAdditionalInfo = () => (
    <View style={styles.additionalInfoContainer}>
      <Text style={styles.sectionTitle}>Informations supplémentaires</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Dernière commande</Text>
        <Text style={styles.infoValue}>
          {product.lastOrder}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Stock minimum</Text>
        <Text style={styles.infoValue}>{product.minStock}</Text>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <Button 
        mode="contained" 
        style={styles.addToCartButton}
        loading={isAddingToCart}
        disabled={isAddingToCart || product.stock === 0}
        onPress={handleAddToCart}
      >
        {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderProductImage()}
        {renderProductInfo()}
        {renderQuantitySelector()}
        {renderAdditionalInfo()}
        {renderActions()}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
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
  productInfoContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTagText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  supplierName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E4D92',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  quantitySelectorContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 24,
  },
  additionalInfoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  addToCartButton: {
    backgroundColor: '#1E4D92',
  },
});

export default ProductDetailsScreen;