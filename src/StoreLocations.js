import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let MapView, Marker;
try {
  const MapComponent = require('react-native-maps');
  MapView = MapComponent.default;
  Marker = MapComponent.Marker;
} catch (err) {
  console.log('Map component not available:', err);
}

const { width, height } = Dimensions.get('window');

const STORE_TYPES = {
  BOUTIQUE: 'Boutique',
  SUPERMARKET: 'Supermarché',
  MINIMARKET: 'Supérette',
  WHOLESALER: 'Grossiste',
  SEMI_WHOLESALER: 'Demi-grossiste',
};

const StoreLocations = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const [region, setRegion] = useState({
    latitude: 14.6937,
    longitude: -17.4441,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [stores, setStores] = useState([
    {
      id: 1,
      name: 'Supermarché Exclusive',
      type: STORE_TYPES.SUPERMARKET,
      address: 'Point E, Dakar',
      image: 'https://via.placeholder.com/100',
      coordinates: {
        latitude: 14.7007,
        longitude: -17.4559,
      },
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Boutique Chez Abdoul',
      type: STORE_TYPES.BOUTIQUE,
      address: 'Médina, Dakar',
      image: 'https://via.placeholder.com/100',
      coordinates: {
        latitude: 14.6827,
        longitude: -17.4397,
      },
      rating: 4.2,
    },
  ]);

  useEffect(() => {
    if (MapView) {
      setMapLoaded(true);
    }
  }, []);

  const filteredStores = stores.filter(store => 
    (selectedFilters.length === 0 || selectedFilters.includes(store.type)) &&
    (searchQuery === '' || store.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <Text style={styles.headerTitle}>Points de vente</Text>
      </View>
    </LinearGradient>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <MaterialCommunityIcons name="magnify" size={24} color="#666" />
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un point de vente..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
    </View>
  );

  const renderFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
    >
      {Object.values(STORE_TYPES).map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterChip,
            selectedFilters.includes(type) && styles.filterChipSelected
          ]}
          onPress={() => {
            if (selectedFilters.includes(type)) {
              setSelectedFilters(selectedFilters.filter(f => f !== type));
            } else {
              setSelectedFilters([...selectedFilters, type]);
            }
          }}
        >
          <Text style={[
            styles.filterChipText,
            selectedFilters.includes(type) && styles.filterChipTextSelected
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderMap = () => {
    if (!mapLoaded) {
      return (
        <View style={[styles.mapContainer, styles.mapFallback]}>
          <MaterialCommunityIcons name="map-marker-radius" size={48} color="#b937a8" />
          <Text style={styles.mapFallbackText}>
            Carte en cours de chargement...
          </Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.mapContainer,
        showFullMap && styles.mapContainerExpanded
      ]}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {filteredStores.map(store => (
            <Marker
              key={store.id}
              coordinate={store.coordinates}
              title={store.name}
              description={store.type}
            >
              <View style={styles.markerContainer}>
                <MaterialCommunityIcons 
                  name="store"
                  size={30}
                  color="#b937a8"
                />
              </View>
            </Marker>
          ))}
        </MapView>
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => setShowFullMap(!showFullMap)}
        >
          <MaterialCommunityIcons 
            name={showFullMap ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#b937a8"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderStoreList = () => (
    <ScrollView 
      style={[
        styles.storeListContainer,
        showFullMap && styles.storeListHidden
      ]}
    >
      {filteredStores.map(store => (
        <TouchableOpacity 
          key={store.id}
          style={styles.storeCard}
          onPress={() => navigation.navigate('StoreDetails', { store })}
        >
          <Image 
            source={{ uri: store.image }}
            style={styles.storeImage}
          />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeType}>{store.type}</Text>
            <Text style={styles.storeAddress}>{store.address}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{store.rating}</Text>
            </View>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color="#666"
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.contentContainer}>
        {renderSearchBar()}
        {renderFilters()}
        {renderMap()}
        {renderStoreList()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333',
  },
  filtersContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#b937a8',
  },
  filterChipSelected: {
    backgroundColor: '#b937a8',
  },
  filterChipText: {
    color: '#b937a8',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: 'white',
  },
  mapContainer: {
    height: height * 0.4,
    margin: 20,
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
  },
  mapContainerExpanded: {
    height: height * 0.75,
  },
  mapFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapFallbackText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  expandButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  storeListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  storeListHidden: {
    display: 'none',
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  storeImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  storeType: {
    color: '#b937a8',
    fontSize: 14,
    marginBottom: 5,
  },
  storeAddress: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: '500',
  },
});

export default StoreLocations;