import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import SelectionModal from './SelectionModal';
import UpdateModal from './UpdateModal';
import { useAuth } from './AuthContext';

const { width } = Dimensions.get('window');

const HomeDashboard = ({ navigation }) => {
  const { logout, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState('surfaces');
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [shopsData, setShopsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!accessToken) {
      navigation.navigate('LoginScreen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        activeTab === 'surfaces' ? 'shops' : activeTab === 'produits' ? 'productscollecte' : 'fournisseurs';
      const response = await fetch(`https://supply-3.onrender.com/api/${endpoint}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigation.navigate('LoginScreen');
          return;
        }
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      setShopsData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setShopsData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, accessToken, navigation, logout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setUpdateModalVisible(true);
  };

  const handleUpdateItem = (updatedItem) => {
    setShopsData((prevData) =>
      prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
    }
  };

  const calculateCategoryTotals = () => {
    const totals = {};
    shopsData.forEach((item) => {
      const category = activeTab === 'surfaces' ? item.typecommerce : item.category;
      if (category) {
        totals[category] = (totals[category] || 0) + 1;
      }
    });
    return totals;
  };

  const renderTotalCard = () => {
    const categoryTotals = calculateCategoryTotals();
    const totalItems = shopsData.length;
    const categories = Object.entries(categoryTotals);
    const midPoint = Math.ceil(categories.length / 2);
    const leftColumn = categories.slice(0, midPoint);
    const rightColumn = categories.slice(midPoint);

    return (
      <Animatable.View animation="fadeIn" duration={600} style={styles.totalCardContainer}>
        <LinearGradient
          colors={['#3B82F6', '#1E3A8A']}
          style={styles.totalCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.totalCardContent}>
            <MaterialIcons name="store" size={24} color="#fff" style={styles.totalCardIcon} />
            <View style={styles.totalCardTextContainer}>
              <Text style={styles.totalCardTitle}>
                {activeTab === 'surfaces' ? 'Total Sites' : 'Total Produits'} ({totalItems})
              </Text>
              <View style={styles.categoryColumns}>
                <View style={styles.column}>
                  {leftColumn.map(([category, count]) => (
                    <Text key={category} style={styles.categoryText}>
                      {category}: {count}
                    </Text>
                  ))}
                </View>
                <View style={styles.column}>
                  {rightColumn.map(([category, count]) => (
                    <Text key={category} style={styles.categoryText}>
                      {category}: {count}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animatable.View>
    );
  };

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderList = () => (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.collectesList}>
      {shopsData.length === 0 && !loading ? (
        <Text style={styles.emptyText}>Aucune donnée disponible</Text>
      ) : (
        shopsData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.collecteItem}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.8}
          >
            <View style={styles.shopItemContainer}>
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/50' }}
                style={styles.shopImage}
                onError={() => console.log(`Erreur de chargement de l'image pour ${item.name}`)}
              />
              <View style={styles.collecteInfo}>
                <Text style={styles.collecteName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.collecteType}>
                  {activeTab === 'produits' ? item.category : item.typecommerce}
                </Text>
                <Text style={styles.shopOwner}>
                  {activeTab === 'produits' ? `Stock: ${item.stock}` : item.owner_name}
                </Text>
              </View>
            </View>
            <View style={styles.collecteStatus}>
              <Text
                style={[
                  styles.statusText,
                  { color: item.type === 'BRANDED' ? '#2563EB' : '#60A5FA' },
                ]}
              >
                {activeTab === 'produits' ? item.price : item.type}
              </Text>
              <Text style={styles.collecteDate}>
                {activeTab === 'produits' ? item.frequence_appr : item.owner_phone}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </Animatable.View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#EF4444" />
        <Text style={styles.errorText}>Erreur : {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tableau de Bord</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('MapScreen1', { shopsData })} 
            style={styles.mapButton}
          >
            <MaterialIcons name="map" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : (
          <>
            {renderTotalCard()}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Collectes cette semaine</Text>
              {/* Ajouter un graphique ici si nécessaire */}
            </View>
            <View style={styles.recentCollectes}>
              <Text style={styles.sectionTitle}>Liste des données</Text>
              <View style={styles.tabsContainer}>
                <TabButton
                  title="Sites"
                  isActive={activeTab === 'surfaces'}
                  onPress={() => setActiveTab('surfaces')}
                />
                <TabButton
                  title="Produits"
                  isActive={activeTab === 'produits'}
                  onPress={() => setActiveTab('produits')}
                />
              </View>
              {renderList()}
            </View>
          </>
        )}
      </ScrollView>

      <SelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        navigation={navigation}
      />
      {selectedItem && (
        <UpdateModal
          visible={updateModalVisible}
          onClose={() => {
            setUpdateModalVisible(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          type={activeTab === 'surfaces' ? 'shops' : 'products'}
          onUpdate={handleUpdateItem}
          imageUri={selectedItem.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: 40, // Static value instead of Platform.OS check
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  mapButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 6,
  },
  logoutButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    padding: 16,
  },
  totalCardContainer: {
    marginBottom: 16,
  },
  totalCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  totalCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  totalCardIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  totalCardTextContainer: {
    flex: 1,
  },
  totalCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  recentCollectes: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E3A8A',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#1E3A8A',
    fontWeight: '700',
  },
  collectesList: {
    borderRadius: 8,
  },
  collecteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  shopItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shopImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  collecteInfo: {
    flex: 1,
  },
  collecteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  collecteType: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  shopOwner: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  collecteStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  collecteDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    padding: 20,
  },
});

export default HomeDashboard;