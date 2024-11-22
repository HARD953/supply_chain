import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from 'react-native';
import { TextInput } from 'react-native-paper';

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: '1',
    store: 'Solibra A - Abidjan',
    date: '2024-03-20',
    status: 'pending',
    items: [
      { 
        id: '1', 
        name: 'Doddel 1', 
        quantity: 10, 
        unit: 'cartons', 
        ref: 'REF001',
        unitPrice: 2500,
        currency: 'FCFA'
      },
      { 
        id: '2', 
        name: 'Produit 2', 
        quantity: 5, 
        unit: 'unités', 
        ref: 'REF002',
        unitPrice: 1500,
        currency: 'FCFA'
      }
    ]
  },
  {
    id: '2',
    store: 'Carré dOR B - Bouake',
    date: '2024-03-19',
    status: 'delivered',
    items: [
      { 
        id: '3', 
        name: 'Produit 3', 
        quantity: 20, 
        unit: 'palettes', 
        ref: 'REF003',
        unitPrice: 15000,
        currency: 'FCFA'
      }
    ]
  }
];

const OrderRecapPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter(order => 
      order.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ref.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Livrée';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatPrice = (amount, currency = 'FCFA') => {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleOrderPress = (order) => {
    setSelectedOrder(order.id === selectedOrder?.id ? null : order);
  };

  const OrderCard = ({ order }) => {
    const isExpanded = selectedOrder?.id === order.id;
    const orderTotal = calculateOrderTotal(order.items);

    return (
      <TouchableOpacity
        style={[
          styles.orderCard,
          isExpanded && styles.orderCardExpanded
        ]}
        onPress={() => handleOrderPress(order)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderMainInfo}>
            <Text style={styles.storeName}>{order.store}</Text>
            <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
          </View>
          <View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) + '20' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(order.status) }
              ]}>
                {getStatusText(order.status)}
              </Text>
            </View>
            <Text style={styles.totalAmount}>
              {formatPrice(orderTotal)}
            </Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.orderDetails}>
            <Text style={styles.detailsTitle}>Détails de la commande</Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemRef}>{item.ref}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemUnitPrice}>
                    Prix unitaire: {formatPrice(item.unitPrice)}
                  </Text>
                </View>
                <View style={styles.itemPricing}>
                  <Text style={styles.itemQuantity}>
                    {item.quantity} {item.unit}
                  </Text>
                  <Text style={styles.itemTotal}>
                    {formatPrice(item.quantity * item.unitPrice)}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.orderSummary}>
              <Text style={styles.orderSummaryText}>Total</Text>
              <Text style={styles.orderSummaryAmount}>
                {formatPrice(orderTotal)}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Récapitulatif des commandes</Text>
        <Text style={styles.subtitle}>
          Consultez et suivez vos commandes
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une commande..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          dense
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Aucune commande trouvée
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  orderCardExpanded: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  orderDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemRef: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  itemUnitPrice: {
    fontSize: 13,
    color: '#666',
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 14,
    color: '#666',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
  },
  orderSummaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderSummaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default OrderRecapPage;