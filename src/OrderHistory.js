import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal, 
  ScrollView,
  StyleSheet 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OrderHistory = () => {
  const [orders] = useState([
    {
      id: '1',
      date: '2024-03-15',
      totalAmount: 4500,
      status: 'Livré',
      items: [
        {
          id: '1',
          name: 'Lait demi-écrémé',
          quantity: 2,
          price: 1500,
          format: 'Moyen (50cl)',
          image: require('../assets/chocolat.jpeg')
        },
        {
          id: '2',
          name: 'iPhone 12',
          quantity: 1,
          price: 1500,
          format: 'Noir 64Go',
          image: require('../assets/iphone.jpg')
        }
      ]
    },
    {
      id: '2',
      date: '2024-02-20',
      totalAmount: 3000,
      status: 'En cours',
      items: [
        {
          id: '1',
          name: 'Bouteille de vin',
          quantity: 1,
          price: 3000,
          format: 'Grand format',
          image: require('../assets/iphone.jpg')
        }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Tous');

  const orderStatuses = ['Tous', 'En cours', 'Livré', 'Annulé'];

  const filteredOrders = selectedStatus === 'Tous' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const renderStatusFilter = (status) => (
    <TouchableOpacity 
      style={{
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: selectedStatus === status ? '#b937a8' : '#F5F5F5'
      }}
      onPress={() => setSelectedStatus(status)}
    >
      <Text 
        style={{
          fontWeight: 'bold',
          color: selectedStatus === status ? 'white' : 'black'
        }}
      >
        {status}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={orderDetailsModal}
        onRequestClose={() => setOrderDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setOrderDetailsModal(false)}
            >
              <Icon name="close" size={24} color="#b937a8" />
            </TouchableOpacity>
            
            <Text style={styles.modalOrderTitle}>
              Détails de la commande
            </Text>
            
            <Text style={styles.modalOrderId}>
              Commande #{selectedOrder.id}
            </Text>
            
            <View style={styles.modalOrderInfoContainer}>
              <View style={styles.modalOrderInfoItem}>
                <Icon name="calendar" size={20} color="#b937a8" />
                <Text style={styles.modalOrderInfoText}>
                  {selectedOrder.date}
                </Text>
              </View>
              
              <View style={styles.modalOrderInfoItem}>
                <Icon name="check-circle" size={20} color="#b937a8" />
                <Text style={styles.modalOrderInfoText}>
                  {selectedOrder.status}
                </Text>
              </View>
            </View>

            <Text style={styles.modalSectionTitle}>Produits</Text>
            
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={styles.modalProductItem}>
                <Image 
                  source={item.image} 
                  style={styles.modalProductImage} 
                />
                <View style={styles.modalProductDetails}>
                  <Text style={styles.modalProductName}>{item.name}</Text>
                  <Text style={styles.modalProductFormat}>{item.format}</Text>
                  <View style={styles.modalProductPriceContainer}>
                    <Text style={styles.modalProductPrice}>
                      {(item.price / 100).toFixed(2)} €
                    </Text>
                    <Text style={styles.modalProductQuantity}>
                      Qté: {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.modalTotalContainer}>
              <Text style={styles.modalTotalLabel}>Total</Text>
              <Text style={styles.modalTotalAmount}>
                {(selectedOrder.totalAmount / 100).toFixed(2)} €
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => {
        setSelectedOrder(item);
        setOrderDetailsModal(true);
      }}
    >
      <View style={styles.orderCardHeader}>
        <Text style={styles.orderCardId}>Commande #{item.id}</Text>
        <Text style={[
          styles.orderCardStatus, 
          item.status === 'Livré' ? styles.deliveredStatus : 
          item.status === 'En cours' ? styles.pendingStatus : 
          styles.cancelledStatus
        ]}>
          {item.status}
        </Text>
      </View>
      
      <View style={styles.orderCardContent}>
        <View style={styles.orderCardImageContainer}>
          {item.items.slice(0, 2).map((product, index) => (
            <Image 
              key={index}
              source={product.image} 
              style={styles.orderCardImage} 
            />
          ))}
          {item.items.length > 2 && (
            <View style={styles.orderCardImageOverlay}>
              <Text style={styles.orderCardImageOverlayText}>
                +{item.items.length - 2}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.orderCardTextContainer}>
          <Text style={styles.orderCardDate}>{item.date}</Text>
          <Text style={styles.orderCardTotal}>
            Total: {(item.totalAmount / 100).toFixed(2)} €
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#b937a8', '#8e2e8b']} 
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Historique des commandes</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.statusFilterScrollView}
        >
          {orderStatuses.map(renderStatusFilter)}
        </ScrollView>
      </LinearGradient>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Icon 
              name="cart-off" 
              size={100} 
              color="#E0E0E0" 
            />
            <Text style={styles.emptyListText}>
              Aucune commande trouvée
            </Text>
          </View>
        }
      />

      {orderDetailsModal && renderOrderDetailsModal()}
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
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  statusFilterScrollView: {
    marginTop: 10
  },
  orderList: {
    padding: 10
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  orderCardId: {
    fontWeight: 'bold'
  },
  orderCardStatus: {
    fontWeight: 'bold',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 12
  },
  deliveredStatus: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50'
  },
  pendingStatus: {
    backgroundColor: '#FFF3E0',
    color: '#FF9800'
  },
  cancelledStatus: {
    backgroundColor: '#FFEBEE',
    color: '#F44336'
  },
  orderCardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderCardImageContainer: {
    flexDirection: 'row',
    marginRight: 15
  },
  orderCardImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 5
  },
  orderCardImageOverlay: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  orderCardImageOverlayText: {
    color: 'white',
    fontWeight: 'bold'
  },
  orderCardTextContainer: {
    flex: 1
  },
  orderCardDate: {
    color: '#666',
    marginBottom: 5
  },
  orderCardTotal: {
    fontWeight: 'bold',
    color: '#b937a8'
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  emptyListText: {
    marginTop: 20,
    color: '#666',
    fontSize: 18
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    width: '90%',
    maxHeight: '90%'
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  modalOrderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  modalOrderId: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15
  },
  modalOrderInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  modalOrderInfoItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalOrderInfoText: {
    marginLeft: 10,
    color: '#666'
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15
  },
  modalProductImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15
  },
  modalProductDetails: {
    flex: 1
  },
  modalProductName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  modalProductFormat: {
    color: '#666',
    marginBottom: 5
  },
  modalProductPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalProductPrice: {
    fontWeight: 'bold',
    color: '#b937a8'
  },
  modalProductQuantity: {
    color: '#666'
  },
  modalTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  modalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8'
  }
});

export default OrderHistory;