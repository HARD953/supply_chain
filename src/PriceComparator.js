import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const PriceComparator = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compareProductPrices = async () => {
    if (!searchQuery.trim()) {
      setError('Veuillez entrer un nom de produit');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simuler un appel API - À remplacer par votre vrai appel API
      const response = await new Promise((resolve) => setTimeout(() => {
        resolve({
          data: [
            {
              id: 1,
              supplier: "Lactel",
              price: 1500,
              availability: "En stock",
              location: "Paris",
              lastUpdate: "2024-03-19"
            },
            {
              id: 2,
              supplier: "Harry's",
              price: 1450,
              availability: "En stock",
              location: "Lyon",
              lastUpdate: "2024-03-19"
            },
            {
              id: 3,
              supplier: "Coca-Cola",
              price: 1550,
              availability: "Rupture",
              location: "Marseille",
              lastUpdate: "2024-03-18"
            },
            {
              id: 4,
              supplier: "L'Oréal",
              price: 1480,
              availability: "En stock",
              location: "Bordeaux",
              lastUpdate: "2024-03-19"
            }
          ]
        });
      }, 1000));

      setResults(response.data);
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#b937a8', '#e91e63']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comparateur de prix</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Rechercher un produit"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setError(null);
            }}
            style={styles.searchInput}
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            onPress={compareProductPrices}
            style={styles.searchButton}
            disabled={loading}
          >
            <Icon 
              name={loading ? "loading" : "magnify"} 
              size={24} 
              color="white"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b937a8" />
          <Text style={styles.loadingText}>Recherche des meilleurs prix...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.supplierName}>{item.supplier}</Text>
                <Text style={[
                  styles.availability,
                  { color: item.availability === "En stock" ? '#4CAF50' : '#FF5722' }
                ]}>
                  {item.availability}
                </Text>
              </View>
              
              <View style={styles.resultDetails}>
                <View style={styles.locationContainer}>
                  <Icon name="map-marker" size={16} color="#666" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
                
                <Text style={styles.priceText}>
                  {(item.price / 100).toFixed(2)} €
                </Text>
              </View>
              
              <Text style={styles.updateText}>
                Dernière mise à jour: {item.lastUpdate}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Icon name="magnify" size={64} color="#E0E0E0" />
                <Text style={styles.emptyText}>
                  Recherchez un produit pour comparer les prix
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 15,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  resultsList: {
    padding: 15,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  availability: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    color: '#666',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b937a8',
  },
  updateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
});

export default PriceComparator;