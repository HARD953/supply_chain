import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Modal,
  Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const OrderHistoryScreen = ({ navigation, route }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsModalVisible, setIsOrderDetailsModalVisible] = useState(false);

  // Statuts possibles de commande - Couleurs plus douces et modernes
  const orderStatuses = {
    'pending': { 
      label: 'En attente', 
      color: '#FFA07A', // Couleur saumon plus douce
      icon: 'clock-outline'
    },
    'processing': { 
      label: 'En cours', 
      color: '#6495ED', // Bleu cornflower plus élégant
      icon: 'cog-outline'
    },
    'shipped': { 
      label: 'Expédié', 
      color: '#3CB371', // Vert de mer médium
      icon: 'truck-outline'
    },
    'delivered': { 
      label: 'Livré', 
      color: '#2E8B57', // Vert de mer sombre
      icon: 'check-circle-outline'
    },
    'canceled': { 
      label: 'Annulé', 
      color: '#CD5C5C', // Rouge indien plus doux
      icon: 'close-circle-outline'
    }
  };

  // Données simulées d'historique de commandes (restent les mêmes)
  const [orderHistory] = useState([
    {
      id: 'CMD-001',
      date: '2024-03-15',
      totalAmount: 45000,
      status: 'pending',
      items: [
        { 
          id: '1', 
          name: 'Lait demi-écrémé', 
          quantity: 2, 
          price: 1500, 
          supplier: 'Lactel',
          image: require('../assets/chocolat.jpeg')
        },
        { 
          id: '2', 
          name: 'Pain de mie', 
          quantity: 1, 
          price: 2300, 
          supplier: 'Harry\'s',
          image: require('../assets/brouette.jpg')
        }
      ]
    },
    {
      id: 'CMD-002',
      date: '2024-03-22',
      totalAmount: 12000,
      status: 'processing',
      items: [
        { 
          id: '3', 
          name: 'Shampoing', 
          quantity: 3, 
          price: 3200, 
          supplier: 'L\'Oréal',
          image: require('../assets/ciment.jpeg')
        }
      ]
    },
    {
      id: 'CMD-003',
      date: '2024-03-10',
      totalAmount: 15000,
      status: 'shipped',
      items: [
        { 
          id: '4', 
          name: 'Coca-Cola 1.5L', 
          quantity: 5, 
          price: 1200, 
          supplier: 'Coca-Cola',
          image: require('../assets/iphone.jpg')
        }
      ]
    },
    {
      id: 'CMD-004',
      date: '2024-03-05',
      totalAmount: 22500,
      status: 'delivered',
      items: [
        { 
          id: '5', 
          name: 'Crème hydratante', 
          quantity: 3, 
          price: 1500, 
          supplier: 'Nivea',
          image: require('../assets/solibra.jpg')
        }
      ]
    },
    {
      id: 'CMD-005',
      date: '2024-02-28',
      totalAmount: 8500,
      status: 'canceled',
      items: [
        { 
          id: '6', 
          name: 'Ciment', 
          quantity: 1, 
          price: 6500, 
          supplier: 'Lafarge',
          image: require('../assets/ciment.jpeg')
        }
      ]
    }
  ]);

  const openOrderDetailsModal = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalVisible(true);
  };

  const renderOrderDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOrderDetailsModalVisible}
      onRequestClose={() => setIsOrderDetailsModalVisible(false)}
    >
      {selectedOrder && (
        <View style={styles.modalOverlay}>
          <BlurView intensity={50} style={styles.blurContainer}>
            <View style={styles.modalContainer}>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setIsOrderDetailsModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Détails de la commande</Text>
              <Text style={styles.orderIdText}>N° {selectedOrder.id}</Text>

              <View style={styles.orderStatusContainer}>
                <MaterialCommunityIcons 
                  name={orderStatuses[selectedOrder.status].icon} 
                  size={24} 
                  color={orderStatuses[selectedOrder.status].color} 
                />
                <Text 
                  style={[
                    styles.orderStatusText, 
                    { color: orderStatuses[selectedOrder.status].color }
                  ]}
                >
                  {orderStatuses[selectedOrder.status].label}
                </Text>
              </View>

              <Text style={styles.orderDateText}>
                Date de commande : {selectedOrder.date}
              </Text>

              <FlatList
                data={selectedOrder.items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.orderItemCard}>
                    <Image 
                      source={item.image} 
                      style={styles.orderItemImage} 
                      blurRadius={1}
                    />
                    <View style={styles.orderItemDetails}>
                      <Text style={styles.orderItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.orderItemSupplier} numberOfLines={1}>
                        {item.supplier}
                      </Text>
                      <Text style={styles.orderItemPrice}>
                        {item.quantity} x {item.price} FCFA
                      </Text>
                    </View>
                  </View>
                )}
              />

              <View style={styles.orderTotalContainer}>
                <Text style={styles.orderTotalLabel}>Total</Text>
                <Text style={styles.orderTotalAmount}>
                  {selectedOrder.totalAmount} FCFA
                </Text>
              </View>
            </View>
          </BlurView>
        </View>
      )}
    </Modal>
  );

  const renderOrderItem = ({ item }) => {
    const status = orderStatuses[item.status];
    
    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        onPress={() => openOrderDetailsModal(item)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderIdText}>N° {item.id}</Text>
          <View style={[styles.orderStatusBadge, { backgroundColor: status.color }]}>
            <MaterialCommunityIcons 
              name={status.icon} 
              size={16} 
              color="white" 
              style={styles.orderStatusIcon}
            />
            <Text style={styles.orderStatusBadgeText}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.orderDateText}>
            Date : {item.date}
          </Text>
          <Text style={styles.orderTotalText}>
            Total : {item.totalAmount} FCFA
          </Text>
        </View>

        <View style={styles.orderItemsPreview}>
          {item.items.map((product) => (
            <View key={product.id} style={styles.orderItemPreviewWrapper}>
              <Image 
                source={product.image}
                style={styles.orderItemPreviewImage} 
                blurRadius={1}
              />
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

 return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique des Commandes</Text>
      </View>

      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="archive-off" 
              size={64} 
              color="#A9A9A9" 
            />
            <Text style={styles.emptyText}>
              Aucune commande dans l'historique
            </Text>
          </View>
        )}
      />

      {renderOrderDetailsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8' // Un fond plus doux et moderne
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  backButton: {
    marginRight: 15,
    padding: 5
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50'
  },
  orderList: {
    paddingHorizontal: 20,
    paddingTop: 15
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15, // Coins plus arrondis
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  orderIdText: {
    fontWeight: '600',
    color: '#2C3E50',
    fontSize: 15
  },
  orderStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
  orderStatusIcon: {
    marginRight: 5
  },
  orderStatusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500'
  },
  orderDetails: {
    marginBottom: 10
  },
  orderDateText: {
    color: '#7F8C8D',
    fontSize: 13
  },
  orderTotalText: {
    fontWeight: '600',
    color: '#34495E',
    fontSize: 15
  },
  orderItemsPreview: {
    flexDirection: 'row',
    marginTop: 10
  },
  orderItemPreviewWrapper: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  orderItemPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 10
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '90%'
  },
  closeModalButton: {
    alignSelf: 'flex-end',
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2C3E50'
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  orderStatusText: {
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16
  },
  orderItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F7F9FC',
    borderRadius: 15
  },
  orderItemImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginRight: 15
  },
  orderItemDetails: {
    flex: 1
  },
  orderItemName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2C3E50'
  },
  orderItemSupplier: {
    color: '#7F8C8D',
    fontSize: 14
  },
  orderItemPrice: {
    fontWeight: '600',
    color: '#34495E'
  },
  orderTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ECF0F1'
  },
  orderTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50'
  },
  orderTotalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9B59B6'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    marginTop: 15,
    color: '#7F8C8D',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default OrderHistoryScreen;