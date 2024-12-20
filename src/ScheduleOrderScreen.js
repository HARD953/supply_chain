import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ScheduleOrderScreen = ({ navigation }) => {
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderDate, setOrderDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const [note, setNote] = useState('');

  // Exemple de données (à remplacer par des vraies données de l'API)
  const distributors = [
    { id: 1, name: 'Distributeur A', address: '123 Rue Principale' },
    { id: 2, name: 'Distributeur B', address: '456 Avenue Centrale' },
    { id: 3, name: 'Distributeur C', address: '789 Boulevard Est' },
  ];

  const products = [
    { id: 1, name: 'Lait', price: 500 },
    { id: 2, name: 'Pain', price: 300 },
    { id: 3, name: 'Eau', price: 200 },
  ];

  const renderHeader = () => (
    <LinearGradient
      colors={['#b937a8', '#e91e63']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Programmer une commande</Text>
        <View style={{ width: 24 }} />
      </View>
    </LinearGradient>
  );

  const handleProductSelect = (product) => {
    const exists = selectedProducts.find(p => p.id === product.id);
    if (exists) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const updateProductQuantity = (productId, quantity) => {
    setSelectedProducts(selectedProducts.map(product => 
      product.id === productId ? { ...product, quantity: parseInt(quantity) || 0 } : product
    ));
  };

  const handleDateChange = (event, selectedDate, isOrderDate) => {
    if (Platform.OS === 'android') {
      setShowOrderDatePicker(false);
      setShowDeliveryDatePicker(false);
    }
    
    if (selectedDate) {
      if (isOrderDate) {
        setOrderDate(selectedDate);
      } else {
        setDeliveryDate(selectedDate);
      }
    }
  };

  const renderDistributorSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Choisir un distributeur</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {distributors.map((distributor) => (
          <TouchableOpacity
            key={distributor.id}
            style={[
              styles.distributorCard,
              selectedDistributor?.id === distributor.id && styles.selectedDistributorCard
            ]}
            onPress={() => setSelectedDistributor(distributor)}
          >
            <MaterialCommunityIcons 
              name="store" 
              size={24} 
              color={selectedDistributor?.id === distributor.id ? '#b937a8' : '#666'} 
            />
            <Text style={styles.distributorName}>{distributor.name}</Text>
            <Text style={styles.distributorAddress}>{distributor.address}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sélectionner les produits</Text>
      <View style={styles.productsGrid}>
        {products.map((product) => {
          const selectedProduct = selectedProducts.find(p => p.id === product.id);
          return (
            <View key={product.id} style={styles.productCard}>
              <TouchableOpacity
                style={[
                  styles.productSelectButton,
                  selectedProduct && styles.selectedProductButton
                ]}
                onPress={() => handleProductSelect(product)}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price} FCFA</Text>
              </TouchableOpacity>
              {selectedProduct && (
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => updateProductQuantity(product.id, (selectedProduct.quantity - 1))}
                    disabled={selectedProduct.quantity <= 1}
                  >
                    <MaterialCommunityIcons name="minus-circle" size={24} color="#b937a8" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.quantityInput}
                    value={String(selectedProduct.quantity)}
                    onChangeText={(text) => updateProductQuantity(product.id, text)}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={() => updateProductQuantity(product.id, (selectedProduct.quantity + 1))}
                  >
                    <MaterialCommunityIcons name="plus-circle" size={24} color="#b937a8" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderDateSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dates de commande et livraison</Text>
      
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowOrderDatePicker(true)}
      >
        <MaterialCommunityIcons name="calendar" size={24} color="#b937a8" />
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateLabel}>Date de commande</Text>
          <Text style={styles.dateValue}>
            {orderDate.toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowDeliveryDatePicker(true)}
      >
        <MaterialCommunityIcons name="truck-delivery" size={24} color="#b937a8" />
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateLabel}>Date de livraison souhaitée</Text>
          <Text style={styles.dateValue}>
            {deliveryDate.toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </TouchableOpacity>

      {(showOrderDatePicker || showDeliveryDatePicker) && (
        <DateTimePicker
          value={showOrderDatePicker ? orderDate : deliveryDate}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, showOrderDatePicker)}
          minimumDate={new Date()}
        />
      )}
    </View>
  );

  const renderNote = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Note pour le distributeur</Text>
      <TextInput
        style={styles.noteInput}
        multiline
        numberOfLines={4}
        value={note}
        onChangeText={setNote}
        placeholder="Ajouter une note ou des instructions spéciales..."
      />
    </View>
  );

  const renderTotal = () => {
    const total = selectedProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    );

    return (
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total estimé:</Text>
        <Text style={styles.totalAmount}>{total.toLocaleString()} FCFA</Text>
      </View>
    );
  };

  const handleSubmit = () => {
    // Logique pour soumettre la commande
    console.log({
      distributor: selectedDistributor,
      products: selectedProducts,
      orderDate,
      deliveryDate,
      note
    });
    // Navigation vers la confirmation ou le tableau de bord
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderDistributorSelection()}
        {renderProductSelection()}
        {renderDateSelection()}
        {renderNote()}
        {selectedProducts.length > 0 && renderTotal()}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedDistributor || selectedProducts.length === 0) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={!selectedDistributor || selectedProducts.length === 0}
        >
          <Text style={styles.submitButtonText}>Programmer la commande</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  distributorCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 150,
    alignItems: 'center'
  },
  selectedDistributorCard: {
    backgroundColor: '#fce4ec',
    borderWidth: 1,
    borderColor: '#b937a8'
  },
  distributorName: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center'
  },
  distributorAddress: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  productCard: {
    width: '48%',
    marginBottom: 10
  },
  productSelectButton: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  selectedProductButton: {
    backgroundColor: '#fce4ec',
    borderWidth: 1,
    borderColor: '#b937a8'
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  productPrice: {
    color: '#666'
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10
  },
  quantityInput: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 40,
    textAlign: 'center'
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  dateTextContainer: {
    marginLeft: 10
  },
  dateLabel: {
    color: '#666',
    fontSize: 12
  },
  dateValue: {
    fontWeight: 'bold',
    marginTop: 5
  },
  noteInput: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top'
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8'
  },
  footer: {
    backgroundColor: 'white',
    padding: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  submitButton: {
    backgroundColor: '#b937a8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ScheduleOrderScreen;