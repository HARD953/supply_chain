import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Image
} from 'react-native';
import { TextInput, Chip } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STATUS_CONFIG = {
  'En attente': {
    color: '#FFA500',
    gradient: ['#FFD700', '#FFA500'],
    icon: 'clock-outline'
  },
  'En cours': {
    color: '#1E90FF',
    gradient: ['#4FC3F7', '#1E90FF'],
    icon: 'progress-check'
  },
  'Livrée': {
    color: '#2ECC71',
    gradient: ['#81C784', '#2ECC71'],
    icon: 'check-circle-outline'
  },
  'Annulée': {
    color: '#E74C3C',
    gradient: ['#EF5350', '#E74C3C'],
    icon: 'close-circle-outline'
  }
};

const PreOrderManagement = ({ route, navigation }) => {
  const { cart = [], totalAmount, totalItems, orderDate } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [preOrders, setPreOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);

  useEffect(() => {
    console.log('Cart received:', cart);
    console.log('Total Amount:', totalAmount);
    console.log('Total Items:', totalItems);
    console.log('Order Date:', orderDate);
    if (cart && cart.length > 0) {
      const newPreOrder = {
        id: `PRE-${Date.now()}`,
        shopName: 'Ma Boutique',
        distributorName: 'Mon Distributeur',
        status: 'En attente',
        totalAmount: totalAmount || cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        orderDate: orderDate || new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          image: item.image || 'https://via.placeholder.com/100' // Placeholder image if no image provided
        }))
      };

      setPreOrders(prevOrders => [newPreOrder, ...prevOrders]);
    }
  }, [cart]);

  const updateOrderStatus = (orderId, newStatus) => {
    setPreOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setStatusModalVisible(false);
    setSelectedOrder(null);
  };

  const StatusChangeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isStatusModalVisible}
      onRequestClose={() => setStatusModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Changer le statut de la commande</Text>
          {Object.keys(STATUS_CONFIG).map(status => (
            <TouchableOpacity
              key={status}
              style={styles.statusOption}
              onPress={() => updateOrderStatus(selectedOrder.id, status)}
            >
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: STATUS_CONFIG[status].color }
                ]} 
              />
              <Text style={styles.statusOptionText}>{status}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setStatusModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const filteredPreOrders = useMemo(() => {
    return preOrders.filter(order => 
      (searchQuery ? 
        order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.distributorName.toLowerCase().includes(searchQuery.toLowerCase())
        : true) &&
      (statusFilter ? order.status === statusFilter : true)
    );
  }, [searchQuery, statusFilter, preOrders]);

  const renderPreOrderItem = ({ item, index }) => (
    <Animated.View 
      entering={SlideInRight.delay(index * 100)}
      style={styles.preOrderCard}
    >
      <LinearGradient
        colors={STATUS_CONFIG[item.status].gradient}
        style={styles.cardHeader}
      >
        <View style={styles.cardHeaderContent}>
          <MaterialCommunityIcons 
            name={STATUS_CONFIG[item.status].icon} 
            size={24} 
            color="white" 
          />
          <Text style={styles.shopName}>{item.shopName}</Text>
          <TouchableOpacity 
            onPress={() => {
              setSelectedOrder(item);
              setStatusModalVisible(true);
            }}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.cardBody}>
        <View style={styles.orderInfoRow}>
          <View style={styles.orderInfoColumn}>
            <Text style={styles.labelText}>Distributeur</Text>
            <Text style={styles.valueText}>{item.distributorName}</Text>
          </View>
          <View style={styles.orderInfoColumn}>
            <Text style={styles.labelText}>Total</Text>
            <Text style={styles.amountText}>
              {item.totalAmount.toLocaleString()} FCFA
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.dateContainer}>
          <View style={styles.dateColumn}>
            <MaterialCommunityIcons name="calendar-today" size={16} color="#666" />
            <Text style={styles.dateText}>
              Commandée: {item.orderDate}
            </Text>
          </View>
          <View style={styles.dateColumn}>
            <MaterialCommunityIcons name="truck-delivery" size={16} color="#666" />
            <Text style={styles.dateText}>
              Livrée: {item.expectedDelivery}
            </Text>
          </View>
        </View>

        <View style={styles.itemsSection}>
          {item.items.map((product, prodIndex) => (
            <View key={prodIndex} style={styles.productItem}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDetails}>
                {product.quantity} x {product.unitPrice.toLocaleString()} FCFA
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.itemsSection}>
          {item.items.map((product, prodIndex) => (
            <View key={prodIndex} style={styles.productItemContainer}>
              <Image 
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productTextContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetails}>
                  {product.quantity} x {product.unitPrice.toLocaleString()} FCFA
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Commandes</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setAdvancedFiltersVisible(!advancedFiltersVisible)}
        >
          <MaterialCommunityIcons 
            name={advancedFiltersVisible ? "filter-remove" : "filter-variant"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            mode="outlined"
            placeholder="Rechercher une commande..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            left={
              <TextInput.Icon 
                name="magnify" 
                color={searchQuery ? '#007AFF' : '#999'} 
              />
            }
            right={
              <TextInput.Icon 
                name={advancedFiltersVisible ? "chevron-up" : "chevron-down"}
                onPress={() => setAdvancedFiltersVisible(!advancedFiltersVisible)}
              />
            }
            style={styles.searchInput}
            theme={{ 
              roundness: 10,
              colors: { primary: '#007AFF' } 
            }}
          />
        </View>
        
        {advancedFiltersVisible && (
          <Animated.View entering={FadeIn}>
            <View style={styles.advancedFiltersContainer}>
              <TextInput
                mode="outlined"
                placeholder="Distributeur"
                style={styles.advancedFilterInput}
              />
              <TouchableOpacity style={styles.datePickerButton}>
                <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
                <Text style={styles.datePickerText}>Date de commande</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        <View style={styles.chipContainer}>
          {Object.keys(STATUS_CONFIG).map(status => (
            <Chip
              key={status}
              selected={statusFilter === status}
              onPress={() => setStatusFilter(statusFilter === status ? null : status)}
              style={[
                styles.statusChip,
                statusFilter === status && styles.selectedChip
              ]}
              textStyle={[
                styles.chipText,
                statusFilter === status && styles.selectedChipText
              ]}
            >
              {status}
            </Chip>
          ))}
        </View>
      </View>

      {filteredPreOrders.length === 0 ? (
        <Animated.View 
          entering={FadeIn}
          style={styles.emptyStateContainer}
        >
          <MaterialCommunityIcons 
            name="package-variant-closed" 
            size={80} 
            color="#007AFF" 
          />
          <Text style={styles.emptyStateText}>
            Aucune commande trouvée
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Vos commandes apparaîtront ici
          </Text>
          <TouchableOpacity 
            style={styles.createOrderButton}
            onPress={() => navigation.navigate('CreateOrder')}
          >
            <Text style={styles.createOrderButtonText}>
              Créer une nouvelle commande
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredPreOrders}
          renderItem={renderPreOrderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <StatusChangeModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Light purple background
  },
  topBar: {
    backgroundColor: '#b937a8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  filterButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#b937a8',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    marginBottom: 10,
    flex: 1,
  },
  advancedFiltersContainer: {
    marginTop: 10,
  },
  advancedFilterInput: {
    marginBottom: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  datePickerText: {
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusChip: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  selectedChip: {
    backgroundColor: 'white',
  },
  chipText: {
    color: 'white',
  },
  selectedChipText: {
    color: '#b937a8',
  },
  preOrderCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#b937a8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardHeader: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardBody: {
    backgroundColor: '#FCE4EC', // Light pink background
    padding: 15,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderInfoColumn: {
    flex: 1,
  },
  labelText: {
    color: '#666',
    fontSize: 12,
  },
  valueText: {
    fontWeight: 'bold',
    color: '#b937a8', // Highlight text with new color
  },
  amountText: {
    color: '#b937a8',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(185,55,168,0.2)', // Subtle divider
    marginVertical: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateColumn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  itemsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(185,55,168,0.2)',
    paddingTop: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  productName: {
    fontWeight: 'bold',
    color: '#b937a8',
  },
  productDetails: {
    color: '#666',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F3E5F5', // Consistent with container background
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8',
  },
  emptyStateSubtext: {
    color: '#666',
    marginTop: 5,
  },
  createOrderButton: {
    marginTop: 20,
    backgroundColor: '#b937a8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  createOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(185,55,168,0.5)', // Translucent modal background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    borderTopWidth: 5,
    borderTopColor: '#b937a8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#b937a8',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(185,55,168,0.2)',
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  statusOptionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#b937a8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  productItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(185,55,168,0.05)',
    borderRadius: 10,
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default PreOrderManagement;