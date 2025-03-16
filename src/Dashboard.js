import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from './AuthContext';
import api from './api';
import { BarChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');
const BASE_MEDIA_URL = 'https://supply-3.onrender.com/media/';
const BASE_MEDIA_URL1 = 'https://supply-3.onrender.com';

const Dashboard = ({ navigation }) => {
  const { accessToken, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      if (!accessToken) {
        throw new Error('Utilisateur non authentifié');
      }
      setLoading(true);
      const userResponse = await api.get('/current-user/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCurrentUser(userResponse.data);

      const statsResponse = await api.get('/order-statistics/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const statsData = statsResponse.data;

      const monthlyResponse = await api.get('/monthly-orders-evolution/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const monthlyData = monthlyResponse.data.monthly_evolution;

      const totalOrders = statsData.status_statistics.reduce(
        (sum, stat) => sum + stat.count,
        0
      );
      const pendingOrders = statsData.status_statistics.find(
        (stat) => stat.status === 'PENDING'
      )?.count || 0;

      const topProducts = statsData.top_3_products.map((product) => ({
        name: product.product_format__product__name,
        sales: product.total_sold,
        image: `${BASE_MEDIA_URL}${product.product_format__image}`,
      }));

      setDashboardData({
        totalOrders,
        pendingOrders,
        monthlyRevenue: statsData.total_amount,
        topProducts,
        monthlyEvolution: monthlyData,
      });
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.response?.data?.message || 'Erreur de chargement');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken, logout]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Main'); // Rediriger vers l'écran de connexion après déconnexion
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const renderHeader = () => (
    <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.headerGradient}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeftContent}>
          <TouchableOpacity
            style={styles.profileIconButton}
            onPress={() => navigation.navigate('ManagerProfileScreen')}
          >
            <Image
              source={{
                uri: currentUser?.image
                  ? `${BASE_MEDIA_URL1}${currentUser.image}`
                  : 'https://via.placeholder.com/50',
              }}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Bonjour, {currentUser?.username || 'Utilisateur'}</Text>
            <Text style={styles.subHeaderText}>Tableau de bord de votre boutique</Text>
          </View>
        </View>
        <View style={styles.headerRightContent}>
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationsScreen')}
            style={styles.notificationButton}
          >
            <MaterialCommunityIcons name="bell" size={24} color="white" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <MaterialCommunityIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderQuickStats = () => {
    if (!dashboardData) return null;

    return (
      <View style={styles.quickStatsContainer}>
        {[
          { title: 'Total Commandes', value: dashboardData.totalOrders, icon: 'cart', colors: ['#1E40AF', '#3B82F6'] },
          { title: 'Commandes en Attente', value: dashboardData.pendingOrders, icon: 'timer-sand', colors: ['#007AFF', '#4FC3F7'] },
          { title: 'Montant des achats', value: `${dashboardData.monthlyRevenue.toLocaleString()} FCFA`, icon: 'cash', colors: ['#2ECC71', '#81C784'] },
        ].map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <LinearGradient colors={stat.colors} style={styles.statCardGradient}>
              <MaterialCommunityIcons name={stat.icon} size={30} color="white" />
              <View>
                <Text style={styles.statCardTitle}>{stat.title}</Text>
                <Text style={styles.statCardValue}>{stat.value}</Text>
              </View>
            </LinearGradient>
          </View>
        ))}
      </View>
    );
  };

  const renderTopProducts = () => {
    if (!dashboardData) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits les plus achetés</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TopProductsScreen')}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.topProductsContainer}>
          {dashboardData.topProducts.map((product, index) => (
            <View key={index} style={styles.topProductCard}>
              <Image source={{ uri: product.image }} style={styles.topProductImage} />
              <Text style={styles.topProductName}>{product.name}</Text>
              <Text style={styles.topProductSales}>{product.sales} achats</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderRevenueChart = () => {
    if (!dashboardData || !dashboardData.monthlyEvolution) return null;

    const chartData = {
      labels: dashboardData.monthlyEvolution.map((item) => item.month.slice(0, 7)),
      datasets: [
        {
          data: dashboardData.monthlyEvolution.map((item) => item.order_count),
        },
      ],
    };

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Évolution des commandes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ce mois</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={width - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#F5F5F5',
              backgroundGradientFrom: '#F5F5F5',
              backgroundGradientTo: '#F5F5F5',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
              style: {
                borderRadius: 15,
              },
              propsForBars: {
                strokeWidth: '2',
                stroke: '#3B82F6',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 15,
            }}
          />
          <Text style={styles.chartLegend}>Nombre de commandes par mois</Text>
        </View>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Actions Rapides</Text>
      <View style={styles.quickActionButtons}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('BusinessTypeSelection')}
        >
          <View style={styles.quickActionButtonContent}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="#1E40AF" />
            <Text style={styles.quickActionButtonText}>Nouvelle Commande</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <View style={styles.quickActionButtonContent}>
            <MaterialCommunityIcons name="history" size={24} color="#007AFF" />
            <Text style={styles.quickActionButtonText}>Historique</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
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
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.retryText}>Se reconnecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderHeader()}
      <View style={styles.contentContainer}>
        {renderQuickStats()}
        {renderTopProducts()}
        {renderRevenueChart()}
        {renderQuickActions()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    marginTop: -30,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  notificationButton: {
    position: 'relative',
    marginRight: 15, // Espacement entre la cloche et le bouton de déconnexion
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 5,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    width: '30%',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  statCardGradient: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    borderRadius: 15,
  },
  statCardTitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 10,
  },
  statCardValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  topProductsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topProductCard: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    width: '30%',
  },
  topProductImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  topProductName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  topProductSales: {
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  chartLegend: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  quickActionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  quickActionButtonText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIconButton: {
    marginRight: 15,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Dashboard;