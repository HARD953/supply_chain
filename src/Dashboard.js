import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 124,
    pendingOrders: 15,
    monthlyRevenue: 750000,
    topProducts: [
      { name: 'Lait', sales: 45, image: 'https://via.placeholder.com/100' },
      { name: 'Pain', sales: 38, image: 'https://via.placeholder.com/100' },
      { name: 'Eau', sales: 32, image: 'https://via.placeholder.com/100' }
    ],
    revenueData: {
      labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai'],
      datasets: [
        {
          data: [500000, 620000, 750000, 680000, 820000]
        }
      ]
    }
  });

  const renderHeader = () => (
    <LinearGradient
      colors={['#b937a8', '#e91e63']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.welcomeText}>Bonjour, Gérant</Text>
          <Text style={styles.subHeaderText}>Tableau de bord de votre boutique</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell" size={24} color="white" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderQuickStats = () => (
    <View style={styles.quickStatsContainer}>
      {[
        { 
          title: 'Total Commandes', 
          value: dashboardData.totalOrders, 
          icon: 'cart', 
          colors: ['#b937a8', '#e91e63'] 
        },
        { 
          title: 'Commandes en Attente', 
          value: dashboardData.pendingOrders, 
          icon: 'timer-sand', 
          colors: ['#007AFF', '#4FC3F7'] 
        },
        { 
          title: 'Revenu Mensuel', 
          value: `${dashboardData.monthlyRevenue.toLocaleString()} FCFA`, 
          icon: 'cash', 
          colors: ['#2ECC71', '#81C784'] 
        }
      ].map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <LinearGradient 
            colors={stat.colors} 
            style={styles.statCardGradient}
          >
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

  const renderTopProducts = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Produits les plus vendus</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.topProductsContainer}>
        {dashboardData.topProducts.map((product, index) => (
          <View key={index} style={styles.topProductCard}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.topProductImage} 
            />
            <Text style={styles.topProductName}>{product.name}</Text>
            <Text style={styles.topProductSales}>{product.sales} ventes</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRevenueChart = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Évolution du Revenu</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ce mois</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={dashboardData.revenueData}
          width={width - 60}
          height={220}
          chartConfig={{
            backgroundColor: 'white',
            backgroundGradientFrom: 'white',
            backgroundGradientTo: 'white',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(185, 55, 168, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#b937a8"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Actions Rapides</Text>
      <View style={styles.quickActionButtons}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('CreateOrder')}
        >
          <View style={styles.quickActionButtonContent}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="#b937a8" />
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

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
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
    backgroundColor: '#F5F5F5'
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
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  subHeaderText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5
  },
  notificationButton: {
    position: 'relative'
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
    alignItems: 'center'
  },
  notificationBadgeText: {
    color: '#b937a8',
    fontSize: 12,
    fontWeight: 'bold'
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
    shadowColor: '#b937a8',
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
    marginTop: 10
  },
  statCardValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
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
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8'
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14
  },
  topProductsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topProductCard: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    width: '30%'
  },
  topProductImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },
  topProductName: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  topProductSales: {
    color: '#666'
  },
  chartContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 10
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
    justifyContent: 'space-between'
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
    padding: 15
  },
  quickActionButtonText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#333'
  }
});

export default Dashboard;