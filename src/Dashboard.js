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
  Animated,
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
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation pour le fade-in

  const fetchData = async () => {
    try {
      if (!accessToken) throw new Error('Utilisateur non authentifié');
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

      const totalOrders = statsData.status_statistics.reduce((sum, stat) => sum + stat.count, 0);
      const pendingOrders = statsData.status_statistics.find(stat => stat.status === 'PENDING')?.count || 0;

      const topProducts = statsData.top_3_products.map(product => ({
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

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.response?.data?.message || 'Erreur de chargement');
      if (err.response?.status === 401) logout();
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

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Main');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const renderHeader = () => (
    <LinearGradient colors={['#1E3A8A', '#60A5FA']} style={styles.headerGradient}>
      <View style={styles.headerContent}>
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
          <Text style={styles.profileName}>{currentUser?.username || 'Utilisateur'}</Text>
        </TouchableOpacity>
        <View style={styles.headerRightContent}>
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationsScreen')}
            style={styles.notificationButton}
          >
            <MaterialCommunityIcons name="bell-outline" size={28} color="white" />
            <Animated.View style={[styles.notificationBadge, { opacity: fadeAnim }]}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.headerSubtitle}>Votre tableau de bord en temps réel</Text>
    </LinearGradient>
  );

  const renderQuickStats = () => {
    if (!dashboardData) return null;

    return (
      <Animated.View style={[styles.quickStatsContainer, { opacity: fadeAnim }]}>
        {[
          { title: 'Total Commandes', value: dashboardData.totalOrders, icon: 'cart-outline', colors: ['#3B82F6', '#1E40AF'] },
          { title: 'En Attente', value: dashboardData.pendingOrders, icon: 'clock-outline', colors: ['#F59E0B', '#D97706'] },
          { title: 'Revenus', value: `${dashboardData.monthlyRevenue.toLocaleString()} FCFA`, icon: 'cash-multiple', colors: ['#10B981', '#059669'] },
        ].map((stat, index) => (
          <TouchableOpacity key={index} style={styles.statCard}>
            <LinearGradient colors={stat.colors} style={styles.statCardGradient}>
              <MaterialCommunityIcons name={stat.icon} size={32} color="white" />
              <Text style={styles.statCardValue}>{stat.value}</Text>
              <Text style={styles.statCardTitle}>{stat.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  const renderTopProducts = () => {
    if (!dashboardData) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Produits</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TopProductsScreen')}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topProductsContainer}>
          {dashboardData.topProducts.map((product, index) => (
            <TouchableOpacity key={index} style={styles.topProductCard}>
              <Image source={{ uri: product.image }} style={styles.topProductImage} />
              <Text style={styles.topProductName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.topProductSales}>{product.sales} ventes</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRevenueChart = () => {
    if (!dashboardData || !dashboardData.monthlyEvolution) return null;

    const chartData = {
      labels: dashboardData.monthlyEvolution.map(item => item.month.slice(5, 7)), // Mois uniquement (ex: "01" pour janvier)
      datasets: [{ data: dashboardData.monthlyEvolution.map(item => item.order_count) }],
    };

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tendances Commandes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Mois</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
          <BarChart
            data={chartData}
            width={width - 40}
            height={240}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#F9FAFB',
              decimalPlaces: 0,
              color: () => '#3B82F6',
              labelColor: () => '#6B7280',
              barPercentage: 0.7,
              propsForBars: {
                strokeWidth: '1',
                stroke: '#1E40AF',
              },
              fillShadowGradient: '#60A5FA',
              fillShadowGradientOpacity: 0.8,
            }}
            style={styles.chartStyle}
          />
          <Text style={styles.chartLegend}>Commandes mensuelles</Text>
        </Animated.View>
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
          <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.quickActionGradient}>
            <MaterialCommunityIcons name="plus-circle-outline" size={28} color="white" />
            <Text style={styles.quickActionButtonText}>Nouvelle Commande</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.quickActionGradient}>
            <MaterialCommunityIcons name="history" size={28} color="white" />
            <Text style={styles.quickActionButtonText}>Historique</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <MaterialCommunityIcons name="loading" size={40} color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </Animated.View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={50} color="#EF4444" />
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />}
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
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 15,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileIconButton: {
    alignItems: 'center',
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  notificationButton: {
    position: 'relative',
    marginRight: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 5,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '32%',
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statCardGradient: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  statCardTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  statCardValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  topProductsContainer: {
    paddingVertical: 5,
  },
  topProductCard: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 15,
    marginRight: 15,
    width: 120,
    elevation: 2,
  },
  topProductImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  topProductSales: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  chartStyle: {
    borderRadius: 15,
    padding: 5,
  },
  chartLegend: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 10,
    fontSize: 14,
  },
  quickActionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    elevation: 4,
    marginBottom: 20,
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionButton: {
    width: '48%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  quickActionButtonText: {
    marginLeft: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3B82F6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    marginTop: 10,
  },
  retryText: {
    color: '#3B82F6',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '600',
  },
});

export default Dashboard;