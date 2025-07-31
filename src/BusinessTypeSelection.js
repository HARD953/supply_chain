import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useAuth } from './AuthContext';

const { width, height } = Dimensions.get('window');

const businessTypes = [
  {
    id: '1',
    name: 'Fabricant',
    icon: 'factory',
    description: 'Producteur de biens industriels',
    colors: ['#FF6F61', '#FF9F1C'],
    textColor: '#FFF5E1'
  },
  {
    id: '2',
    name: 'Grossiste',
    icon: 'warehouse',
    description: 'Distribution en gros à grande échelle',
    colors: ['#2A9D8F', '#48C9B0'],
    textColor: '#E8F8F5'
  },
  {
    id: '3',
    name: 'Semi-Grossiste',
    icon: 'store',
    description: 'Distribution intermédiaire spécialisée',
    colors: ['#9B59B6', '#D7BDE2'],
    textColor: '#F5EEF8'
  },
  {
    id: '4',
    name: 'Detaillant',
    icon: 'shopping-outline',
    description: 'Vente au détail direct aux consommateurs',
    colors: ['#3498DB', '#85C1E9'],
    textColor: '#EBF5FB'
  }
];

const BusinessTypeSelection = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken, refreshToken, refreshAccessToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!accessToken) {
          throw new Error('Aucun token d’accès disponible');
        }

        const response = await axios.get('https://supply-3.onrender.com/api/current-user/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401 && refreshToken) {
          try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            const response = await axios.get('https://supply-3.onrender.com/api/current-user/', {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json',
              },
            });
            setUser(response.data);
          } catch (refreshError) {
            console.error('Échec du rafraîchissement du token:', refreshError);
            setUser(null);
          }
        } else {
          console.error("Erreur lors de la récupération de l'utilisateur:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken, refreshToken, refreshAccessToken]);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    // Passer l'objet complet 'type' à ProductCatalogScreen
    navigation.navigate('ProductCatalog', { businessType: type });
  };

  const filteredBusinessTypes = () => {
    if (loading || !user || !user.user_type) return businessTypes;

    const userType = user.user_type;
    switch (userType) {
      case 'All':
        return businessTypes;
      case 'Fabricant':
        return businessTypes.filter(type => 
          ['Grossiste', 'Detaillant', 'Semi-Grossiste'].includes(type.name)
        );
      case 'Grossiste':
        return businessTypes.filter(type => 
          ['Détaillant', 'Semi-Grossiste'].includes(type.name)
        );
      case 'Semi-Grossiste':
        return businessTypes.filter(type => 
          type.name === 'Détaillant'
        );
      default:
        return businessTypes;
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Retour"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Choisissez votre catégorie</Text>
          <Text style={styles.headerSubtitle}>Sélectionnez un type d'entreprise</Text>
        </View>
        <View style={styles.placeholderView} />
      </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const filteredTypes = filteredBusinessTypes();
  const menuHeight = filteredTypes.length < 4 ? height * 0.15 * filteredTypes.length : height;

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView 
        style={styles.menuContainer}
        contentContainerStyle={{ height: menuHeight }}
        showsVerticalScrollIndicator={false}
      >
        {filteredTypes.map((type) => {
          const isSelected = selectedType === type;
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => handleTypeSelection(type)}
              style={styles.menuItem}
              activeOpacity={0.8}
              accessibilityLabel={`Sélectionner ${type.name}`}
              accessibilityHint="Appuyez pour choisir ce type d'entreprise"
            >
              <LinearGradient
                colors={type.colors}
                style={styles.menuGradient}
              >
                <MaterialCommunityIcons
                  name={type.icon}
                  size={50}
                  color={isSelected ? '#fff' : type.textColor}
                  style={styles.icon}
                />
                <Text style={[styles.menuTitle, { color: isSelected ? '#fff' : type.textColor }]}>
                  {type.name}
                </Text>
                <Text style={[styles.menuDescription, { color: isSelected ? 'rgba(255,255,255,0.9)' : type.textColor }]}>
                  {type.description}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 30 : 20,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 5,
  },
  backButton: {
    padding: 10,
  },
  placeholderView: {
    width: 40,
  },
  menuContainer: {
    flexGrow: 1,
  },
  menuItem: {
    width: width,
    height: height * 0.15,
    marginVertical: 0,
  },
  menuGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 0,
  },
  icon: {
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 20,
    color: '#333',
  },
});

export default BusinessTypeSelection;