import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Chip } from 'react-native-paper';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product, categories } = route.params;
  const [quantity, setQuantity] = useState(1);

  const category = categories.find(cat => cat.id === product.categoryId);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Détails du Produit</Text>
      <TouchableOpacity style={styles.shareButton}>
        <MaterialCommunityIcons name="share-variant" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderProductImage = () => (
    <View style={styles.imageContainer}>
      <Image
        source={require('../assets/brouette.jpg')}
        style={styles.productImage}
        resizeMode="cover"
      />
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfoContainer}>
      <Text style={styles.productName}>{product.name}</Text>
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
      <Text style={styles.supplierName}>Fournisseur: {product.supplier}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{product.price.toFixed(2)} FCFA</Text>
        <View style={styles.stockInfo}>
          <MaterialCommunityIcons 
            name="warehouse" 
            size={16} 
            color={product.stock <= product.minStock * 0.5 ? '#FF4444' : product.stock <= product.minStock ? '#FFA000' : '#00C853'}
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
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
          style={styles.quantityButton}
        >
          <MaterialCommunityIcons name="minus" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity 
          onPress={() => setQuantity(quantity + 1)}
          style={styles.quantityButton}
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
        <Text style={styles.infoValue}>{product.lastOrder}</Text>
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
        onPress={() => {
          // Add to cart logic
          navigation.goBack();
        }}
      >
        Ajouter au panier
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
};

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
    resizeMode: 'cover',
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