import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { TextInput } from 'react-native-paper';

const PRE_ORDERS = [
  {
    id: '1',
    shopName: 'Boutique Abidjan Centre',
    distributorName: 'Solibra A',
    status: 'En cours',
    totalAmount: 750000,
    orderDate: '2024-02-15',
    expectedDelivery: '2024-02-22',
    items: [
      { name: 'Eau minérale', quantity: 100, unitPrice: 500 },
      { name: 'Soda', quantity: 50, unitPrice: 800 },
    ]
  },
  {
    id: '2',
    shopName: 'Commerce Bouaké',
    distributorName: 'Carré dOR B',
    status: 'Livré',
    totalAmount: 450000,
    orderDate: '2024-02-10',
    expectedDelivery: '2024-02-17',
    items: [
      { name: 'Pain', quantity: 200, unitPrice: 250 },
      { name: 'Lait', quantity: 75, unitPrice: 1000 },
    ]
  },
  {
    id: '3',
    shopName: 'Supérette Bassam',
    distributorName: 'Celeste C',
    status: 'Annulé',
    totalAmount: 350000,
    orderDate: '2024-02-12',
    expectedDelivery: null,
    items: [
      { name: 'Savon', quantity: 50, unitPrice: 2000 },
    ]
  },
  {
    id: '4',
    shopName: 'Supérette Bassam',
    distributorName: 'Celeste C',
    status: 'Annulé',
    totalAmount: 350000,
    orderDate: '2024-02-12',
    expectedDelivery: null,
    items: [
      { name: 'Savon', quantity: 50, unitPrice: 2000 },
    ]
  },
  {
    id: '5',
    shopName: 'Commerce Bouaké',
    distributorName: 'Carré dOR B',
    status: 'Livré',
    totalAmount: 450000,
    orderDate: '2024-02-10',
    expectedDelivery: '2024-02-17',
    items: [
      { name: 'Pain', quantity: 200, unitPrice: 250 },
      { name: 'Lait', quantity: 75, unitPrice: 1000 },
    ]
  },
];

const statusColors = {
  'En cours': '#FFA500',   // Orange
  'Livré': '#2ECC71',      // Green
  'Annulé': '#E74C3C',     // Red
};

const PreOrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [preOrders, setPreOrders] = useState(PRE_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredPreOrders = useMemo(() => {
    return preOrders.filter(order => 
      (searchQuery ? 
        order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.distributorName.toLowerCase().includes(searchQuery.toLowerCase())
        : true) &&
      (statusFilter ? order.status === statusFilter : true)
    );
  }, [searchQuery, statusFilter, preOrders]);

  const handleStatusChange = (newStatus) => {
    if (selectedOrder) {
      const updatedOrders = preOrders.map(order => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            status: newStatus,
            expectedDelivery: newStatus === 'Annulé' ? null : order.expectedDelivery
          };
        }
        return order;
      });
      setPreOrders(updatedOrders);
      setModalVisible(false);
      setSelectedOrder(null);
    }
  };

  const StatusUpdateModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier le statut</Text>
          {selectedOrder && (
            <Text style={styles.modalSubtitle}>
              {selectedOrder.shopName} - Commande #{selectedOrder.id}
            </Text>
          )}
          
          {Object.keys(statusColors).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                { borderLeftColor: statusColors[status], borderLeftWidth: 4 }
              ]}
              onPress={() => handleStatusChange(status)}
            >
              <Text style={styles.statusOptionText}>{status}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPreOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.preOrderCard}
      onPress={() => {
        setSelectedOrder(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.preOrderHeader}>
        <Text style={styles.shopName}>{item.shopName}</Text>
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: statusColors[item.status] }
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.distributorName}>
        Distributeur: {item.distributorName}
      </Text>
      <View style={styles.orderDetails}>
        <Text>Date de commande: {item.orderDate}</Text>
        {item.expectedDelivery && (
          <Text>Livraison prévue: {item.expectedDelivery}</Text>
        )}
        <Text style={styles.totalAmount}>
          Total: {item.totalAmount.toLocaleString()} FCFA
        </Text>
      </View>
      <View style={styles.itemsContainer}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <Text>{product.name}</Text>
            <Text>
              {product.quantity} x {product.unitPrice.toLocaleString()} FCFA
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <StatusUpdateModal />
      <View style={styles.header}>
        <Text style={styles.title}>Mes Précommandes</Text>
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une commande..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          dense
        />
        <View style={styles.statusFilterContainer}>
          {['En cours', 'Livré', 'Annulé'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusFilterButton,
                statusFilter === status && styles.activeStatusFilter
              ]}
              onPress={() => setStatusFilter(statusFilter === status ? null : status)}
            >
              <Text 
                style={[
                  styles.statusFilterText,
                  statusFilter === status && styles.activeStatusFilterText
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredPreOrders}
        renderItem={renderPreOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    marginBottom: 10,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusFilterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeStatusFilter: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusFilterText: {
    color: '#666',
  },
  activeStatusFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  preOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  preOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  distributorName: {
    color: '#666',
    marginBottom: 10,
  },
  orderDetails: {
    marginBottom: 10,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusOption: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 8,
  },
  statusOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PreOrderManagement;