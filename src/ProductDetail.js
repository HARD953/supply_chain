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
  const [selectedFormat, setSelectedFormat] = useState(null);
  

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

  const productFormats = [
    { 
      id: 'unit', 
      name: 'Unité', 
      image: product.image,
      priceMultiplier: 1 
    },
    { 
      id: 'pack', 
      name: 'Pack de 6', 
      image: product.image,
      priceMultiplier: 5 
    },
    { 
      id: 'box', 
      name: 'Boîte de 12', 
      image: product.image,
      priceMultiplier: 10 
    }
  ];

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
          color="#fff" 
          accessibilityHidden
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Détail du produit</Text>
      <TouchableOpacity 
        style={styles.shareButton}
        accessibilityLabel="Partager"
      >
        <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
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
        disabled={isAddingToCart || product.stock === 0 || !selectedFormat}
        onPress={handleAddToCart}
      >
        {!selectedFormat 
          ? "Sélectionnez un format" 
          : (product.stock === 0 
              ? "Rupture de stock" 
              : "Ajouter au panier")}
      </Button>
    </View>
  );

  const renderProductFormatSelector = () => (
    <View style={styles.formatSelectorContainer}>
      <Text style={styles.sectionTitle}>Formats disponibles</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.formatScrollContainer}
      >
        {productFormats.map((format) => (
          <TouchableOpacity 
            key={format.id}
            style={[
              styles.formatOption, 
              selectedFormat?.id === format.id && styles.selectedFormatOption
            ]}
            onPress={() => setSelectedFormat(format)}
          >
            <Image
              source={format.image}
              style={styles.formatOptionImage}
              resizeMode="contain"
            />
            <Text style={styles.formatOptionText}>{format.name}</Text>
            <Text style={styles.formatOptionPrice}>
              {(product.price * format.priceMultiplier).toFixed(2)}€
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
        {renderProductFormatSelector()}
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
    backgroundColor: '#F3E5F5', // Light purple background
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#b937a8', // New header color
    elevation: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
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
    shadowColor: '#b937a8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '90%', // Slightly reduced to add some breathing room
    height: '90%',
  },
  productInfoContainer: {
    padding: 16,
    backgroundColor: '#FCE4EC', // Light pink background
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b937a8', // Highlighted product name
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
    color: '#b937a8', // Price in brand color
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(185,55,168,0.1)', // Subtle brand color border
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#b937a8',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    padding: 8,
    backgroundColor: 'rgba(185,55,168,0.1)', // Light brand color background
    borderRadius: 24,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 24,
    color: '#b937a8',
  },
  additionalInfoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(185,55,168,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#b937a8',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(185,55,168,0.1)',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#b937a8',
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  addToCartButton: {
    backgroundColor: '#b937a8', // Brand color for the button
  },

  formatSelectorContainer: {
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  formatScrollContainer: {
    paddingHorizontal: 16,
  },
  formatOption: {
    marginRight: 16,
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(185,55,168,0.2)',
    borderRadius: 10,
    width: 120,
  },
  selectedFormatOption: {
    borderColor: '#b937a8',
    backgroundColor: 'rgba(185,55,168,0.1)',
  },
  formatOptionImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  formatOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b937a8',
  },
  formatOptionPrice: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProductDetailsScreen;