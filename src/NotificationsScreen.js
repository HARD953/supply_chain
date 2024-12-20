import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'product',
      title: 'Nouveau produit disponible',
      message: 'Le distributeur "Diallo Market" a ajouté du riz parfumé à son catalogue',
      timestamp: '2024-12-19T10:30:00',
      read: false,
      image: 'https://via.placeholder.com/50',
      distributorName: 'Diallo Market'
    },
    {
      id: 2,
      type: 'promo',
      title: 'Promotion exceptionnelle',
      message: '-15% sur tous les produits laitiers cette semaine',
      timestamp: '2024-12-18T15:45:00',
      read: true,
      image: 'https://via.placeholder.com/50',
      distributorName: 'Supermarché Express'
    },
    {
      id: 3,
      type: 'message',
      title: 'Message du distributeur',
      message: 'Votre commande #123 est prête à être récupérée',
      timestamp: '2024-12-18T09:15:00',
      read: true,
      image: 'https://via.placeholder.com/50',
      distributorName: 'Alimentation Générale Koné'
    }
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simuler un rafraîchissement des données
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'product':
        return 'package-variant';
      case 'promo':
        return 'tag';
      case 'message':
        return 'message-text';
      default:
        return 'bell';
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#b937a8', '#e91e63']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
    </LinearGradient>
  );

  const renderNotificationItem = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationIcon}>
          <MaterialCommunityIcons 
            name={getNotificationIcon(notification.type)} 
            size={24} 
            color="#b937a8" 
          />
        </View>
        <View style={styles.notificationTextContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <View style={styles.notificationFooter}>
            <Image 
              source={{ uri: notification.image }} 
              style={styles.distributorImage} 
            />
            <Text style={styles.distributorName}>{notification.distributorName}</Text>
            <Text style={styles.timestamp}>
              {new Date(notification.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#b937a8']}
          />
        }
      >
        {notifications.length > 0 ? (
          notifications.map(renderNotificationItem)
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off" size={50} color="#ccc" />
            <Text style={styles.emptyStateText}>Aucune notification</Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  backButton: {
    marginRight: 15
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  contentContainer: {
    flex: 1,
    padding: 15
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  unreadNotification: {
    backgroundColor: '#FCF8FF'
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  notificationTextContent: {
    flex: 1
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  notificationMessage: {
    color: '#666',
    marginBottom: 10
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  distributorImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5
  },
  distributorName: {
    fontSize: 12,
    color: '#666',
    flex: 1
  },
  timestamp: {
    fontSize: 12,
    color: '#999'
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#b937a8',
    marginLeft: 10
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },
  emptyStateText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16
  }
});

export default NotificationsScreen;