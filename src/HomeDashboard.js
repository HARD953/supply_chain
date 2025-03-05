import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SelectionModal from './SelectionModal';
import UpdateModal from './UpdateModal';

const { width, height } = Dimensions.get('window');

const HomeDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('surfaces');
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [shopsData, setShopsData] = useState([]);

  const typeColors = {
    'BRANDED': ["#EC4899", "#DB2777"],
    'SUPÉRETTE': ["#8B5CF6", "#6D28D9"],
    'SUPERMARCHÉ': ["#10B981", "#059669"],
    'QUINCAILLERIE': ["#F59E0B", "#D97706"],
    'BOUTIQUE': ["#3B82F6", "#1D4ED8"],
    'GROSSISTE': ["#6366F1", "#4F46E5"]
  };

  const typeIcons = {
    'BRANDED': "people",
    'SUPÉRETTE': "inventory",
    'SUPERMARCHÉ': "store",
    'QUINCAILLERIE': "build",
    'BOUTIQUE': "store",
    'GROSSISTE': "local-shipping"
  };

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://supply-3.onrender.com/api/stats/by-type/');
      const data = await response.json();
      setStatsData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const fetchData = async () => {
    try {
      let endpoint = 'shops';
      if (activeTab === 'fournisseurs') endpoint = 'fournisseurs'; // À remplacer par l'endpoint réel
      if (activeTab === 'produits') endpoint = 'productscollecte'; // À remplacer par l'endpoint réel

      const response = await fetch(`https://supply-3.onrender.com/api/${endpoint}/`);
      const data = await response.json();
      setShopsData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setUpdateModalVisible(true);
  };

  const handleUpdateItem = (updatedItem) => {
    setShopsData(prevData => 
      prevData.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const renderStatCard = (title, value, icon, colors) => (
    <LinearGradient
      colors={colors}
      style={styles.statCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statCardIcon}>
          <MaterialIcons name={icon} size={24} color="#fff" />
        </View>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Text style={styles.statCardValue}>{value}</Text>
      </View>
    </LinearGradient>
  );

  const renderDynamicStatCards = () => {
    return statsData.map((stat) => {
      const type = stat.typecommerce.toUpperCase();
      return renderStatCard(
        type,
        stat.total,
        typeIcons[type] || "store",
        typeColors[type] || ["#6B7280", "#4B5563"]
      );
    });
  };

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderList = () => (
    <View style={styles.collectesList}>
      {shopsData.map(item => (
        <TouchableOpacity 
          key={item.id}
          style={styles.collecteItem}
          onPress={() => handleItemPress(item)}
        >
          <View style={styles.shopItemContainer}>
            {item.image && (
              <Image 
                source={{ uri: item.image }}
                style={styles.shopImage}
              />
            )}
            <View style={styles.collecteInfo}>
              <Text style={styles.collecteName}>{item.name}</Text>
              <Text style={styles.collecteType}>{item.typecommerce}</Text>
              <Text style={styles.shopOwner}>{item.owner_name}</Text>
            </View>
          </View>
          <View style={styles.collecteStatus}>
            <Text style={[
              styles.statusText,
              { color: item.type === 'BRANDED' ? '#2563EB' : '#60A5FA' }
            ]}>
              {item.type}
            </Text>
            <Text style={styles.collecteDate}>{item.owner_phone}</Text>
            
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tableau de Bord</Text>
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {renderDynamicStatCards()}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Collectes cette semaine</Text>
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
              title="Fournisseurs" 
              isActive={activeTab === 'fournisseurs'} 
              onPress={() => setActiveTab('fournisseurs')}
            />
            <TabButton 
              title="Produits" 
              isActive={activeTab === 'produits'} 
              onPress={() => setActiveTab('produits')}
            />
          </View>
          {renderList()}
        </View>
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
          type={activeTab === 'surfaces' ? 'shops' : activeTab}
          onUpdate={handleUpdateItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 40) / 2,
    height: height / 8,
    marginBottom: 8,
    borderRadius: 12,
    
    padding: 10,
    elevation: 3,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statCardContent: {
    alignItems: 'flex-start',
  },
  statCardIcon: {
    marginBottom: 8,
  },
  statCardTitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  statCardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E3A8A',
  },
  recentCollectes: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E3A8A',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#fff',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
  collectesList: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  collecteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
  },
  collecteInfo: {
    flex: 1,
  },
  collecteName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  collecteType: {
    fontSize: 14,
    color: '#64748b',
  },
  shopOwner: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  collecteStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  collecteDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default HomeDashboard;