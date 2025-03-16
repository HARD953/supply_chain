import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from './api'; // Importez votre instance axios configurée
import { useAuth } from './AuthContext'; // Importez le contexte d'authentification

const BASE_MEDIA_URL = 'https://supply-3.onrender.com/media/'; // URL de base pour les médias

const OrderHistory = ({ navigation }) => {
  const { accessToken, logout } = useAuth(); // Récupérez le token et la fonction de déconnexion
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderStatuses = ['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
  }, [accessToken]); // Ajoutez accessToken comme dépendance

  const fetchOrders = async () => {
    try {
      if (!accessToken) {
        throw new Error('Utilisateur non authentifié');
      }
      setLoading(true);
      const response = await api.get('/orders/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Ajouter l'URL complète aux images si elles sont relatives
      const ordersWithFullImageUrls = response.data.map(order => ({
        ...order,
        items_detail: order.items_detail.map(item => ({
          ...item,
          image: item.image.startsWith('http') ? item.image : `${BASE_MEDIA_URL}${item.image}`
        }))
      }));
      setOrders(ordersWithFullImageUrls);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.detail || 'Erreur lors du chargement des commandes');
      if (error.response?.status === 401) {
        logout(); // Déconnexion si non autorisé
        navigation.navigate('Login'); // Redirection vers la page de connexion
      }
      setLoading(false);
    }
  };

  const filteredOrders = selectedStatus === 'ALL'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price_at_order) * item.quantity);
    }, 0);
  };

  const renderStatusFilter = (status) => (
    <TouchableOpacity
      key={status}
      style={[
        styles.statusFilter,
        { backgroundColor: selectedStatus === status ? '#3B82F6' : '#F5F5F5' }
      ]}
      onPress={() => setSelectedStatus(status)}
    >
      <Text style={{
        color: selectedStatus === status ? 'white' : 'black',
        fontWeight: 'bold'
      }}>
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
              <Icon name="close" size={24} color="#3B82F6" />
            </TouchableOpacity>

            <Text style={styles.modalOrderTitle}>Détails de la commande</Text>
            <Text style={styles.modalOrderId}>Commande #{selectedOrder.id}</Text>

            <View style={styles.modalOrderInfoContainer}>
              <View style={styles.modalOrderInfoItem}>
                <Icon name="calendar" size={20} color="#3B82F6" />
                <Text style={styles.modalOrderInfoText}>
                  {new Date(selectedOrder.created_at).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.modalOrderInfoItem}>
                <Icon name="check-circle" size={20} color="#3B82F6" />
                <Text style={styles.modalOrderInfoText}>
                  {selectedOrder.status}
                </Text>
              </View>
            </View>

            <Text style={styles.modalSectionTitle}>Produits</Text>

            <ScrollView>
              {selectedOrder.items_detail.map((item, index) => (
                <View key={index} style={styles.modalProductItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.modalProductImage}
                  />
                  <View style={styles.modalProductDetails}>
                    <Text style={styles.modalProductName}>{item.product_name}</Text>
                    <Text style={styles.modalProductFormat}>
                      {item.category_name} - Taille: {item.taille}
                    </Text>
                    <View style={styles.modalProductPriceContainer}>
                      <Text style={styles.modalProductPrice}>
                        {parseFloat(item.price_at_order).toLocaleString()} FCFA
                      </Text>
                      <Text style={styles.modalProductQuantity}>
                        Qté: {item.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalTotalContainer}>
              <Text style={styles.modalTotalLabel}>Total</Text>
              <Text style={styles.modalTotalAmount}>
                {calculateOrderTotal(selectedOrder.items_detail).toLocaleString()} FCFA
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
          item.status === 'COMPLETED' ? styles.deliveredStatus : // Changé DELIVERED à COMPLETED
          item.status === 'PENDING' ? styles.pendingStatus :
          item.status === 'CANCELLED' ? styles.cancelledStatus : styles.processingStatus // Ajouté PROCESSING
        ]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.orderCardContent}>
        <View style={styles.orderCardImageContainer}>
          {item.items_detail.slice(0, 2).map((product, index) => (
            <Image
              key={index}
              source={{ uri: product.image }}
              style={styles.orderCardImage}
            />
          ))}
          {item.items_detail.length > 2 && (
            <View style={styles.orderCardImageOverlay}>
              <Text style={styles.orderCardImageOverlayText}>
                +{item.items_detail.length - 2}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.orderCardTextContainer}>
          <Text style={styles.orderCardDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.orderCardTotal}>
            Total: {calculateOrderTotal(item.items_detail).toLocaleString()} FCFA
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.retryText}>Se reconnecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.orderList}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Icon name="cart-off" size={100} color="#E0E0E0" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16
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
  statusFilter: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10
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
    marginBottom: 10,
    elevation: 2
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
  processingStatus: {
    backgroundColor: '#E3F2FD',
    color: '#1E88E5'
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
    color: '#3B82F6'
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
    color: '#3B82F6'
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
    color: '#3B82F6'
  }
});

export default OrderHistory;