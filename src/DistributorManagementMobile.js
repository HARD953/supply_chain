import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const INPUT_HEIGHT = Platform.OS === 'ios' ? 50 : 45;

// Mock data with more details
const DISTRIBUTORS = [
  { 
    id: '1', 
    name: 'Solibra A - Abidjan', 
    description: 'Leader de la distribution de boissons en Côte d\'Ivoire',
    subscriptionFee: 50000,
    minOrderAmount: 500000,
    deliveryAreas: ['Abidjan', 'Bingerville', 'Grand-Bassam'],
    subscribers: 245,
    imageUrl: require('../assets/icon.png') // Vous devrez fournir ces images
  },
  { 
    id: '2', 
    name: 'Carré dOR B - Bouake',
    description: 'Spécialiste des produits alimentaires de première nécessité',
    subscriptionFee: 35000,
    minOrderAmount: 300000,
    deliveryAreas: ['Bouake', 'Yamoussoukro'],
    subscribers: 178,
    imageUrl: require('../assets/icon.png')
  },
  { 
    id: '3', 
    name: 'Celeste C - Bassam',
    description: 'Distribution de produits cosmétiques et d\'hygiène',
    subscriptionFee: 40000,
    minOrderAmount: 400000,
    deliveryAreas: ['Bassam', 'Abidjan-Sud'],
    subscribers: 156,
    imageUrl: require('../assets/icon.png')
  },
];

// Shop information form fields
const SHOP_FIELDS = [
  { id: 'name', label: 'Nom du commerce', type: 'text' },
  { id: 'address', label: 'Adresse', type: 'text' },
  { id: 'phone', label: 'Téléphone', type: 'phone' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'registrationNumber', label: 'Numéro de registre de commerce', type: 'text' },
];

const DistributorSubscriptionMobile = () => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shopInfo, setShopInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    registrationNumber: '',
  });

  // Filtered distributors based on search
  const filteredDistributors = useMemo(() => {
    return DISTRIBUTORS.filter(distributor =>
      distributor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      distributor.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Validate shop information
  const validateShopInfo = () => {
    const requiredFields = ['name', 'address', 'phone'];
    for (const field of requiredFields) {
      if (!shopInfo[field]) {
        Alert.alert('Erreur', `Le champ "${SHOP_FIELDS.find(f => f.id === field).label}" est requis`);
        return false;
      }
    }
    // Validate phone number
    if (!/^\d{8,}$/.test(shopInfo.phone.replace(/\s/g, ''))) {
      Alert.alert('Erreur', 'Numéro de téléphone invalide');
      return false;
    }
    // Validate email if provided
    if (shopInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shopInfo.email)) {
      Alert.alert('Erreur', 'Adresse email invalide');
      return false;
    }
    return true;
  };

  // Handle subscription submission
  const handleSubscribe = useCallback(async (distributor) => {
    if (!validateShopInfo()) return;

    Alert.alert(
      'Confirmation d\'abonnement',
      `Voulez-vous vous abonner à ${distributor.name}?\n\nFrais d'abonnement: ${distributor.subscriptionFee.toLocaleString()} FCFA\nCommande minimum: ${distributor.minOrderAmount.toLocaleString()} FCFA`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setIsSubmitting(true);
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              Alert.alert(
                'Succès',
                'Votre demande d\'abonnement a été envoyée avec succès. Le distributeur vous contactera pour finaliser l\'inscription.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setSelectedDistributor(null);
                      setShopInfo({
                        name: '',
                        address: '',
                        phone: '',
                        email: '',
                        registrationNumber: '',
                      });
                    }
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi de la demande');
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  }, [shopInfo]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Abonnement Distributeurs</Text>
            <Text style={styles.subtitle}>
              Abonnez-vous aux meilleurs distributeurs pour approvisionner votre commerce
            </Text>
          </View>

          {/* Search Section */}
          <View style={styles.section}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un distributeur..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="outlined"
              dense
            />
          </View>

          {/* Shop Information Form */}
          {!selectedDistributor && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information du Commerce</Text>
              {SHOP_FIELDS.map(field => (
                <View key={field.id} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={shopInfo[field.id]}
                    onChangeText={(text) => setShopInfo(prev => ({ ...prev, [field.id]: text }))}
                    keyboardType={field.type === 'phone' ? 'phone-pad' : field.type === 'email' ? 'email-address' : 'default'}
                    mode="outlined"
                    dense
                  />
                </View>
              ))}
            </View>
          )}

          {/* Distributors List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distributeurs Disponibles</Text>
            {filteredDistributors.map((distributor) => (
              <View key={distributor.id} style={styles.distributorCard}>
                <Image
                source={require('../assets/solibra.jpg')}
                style={styles.distributorImage}
                />
                <View style={styles.distributorInfo}>
                  <Text style={styles.distributorName}>{distributor.name}</Text>
                  <Text style={styles.distributorDescription}>{distributor.description}</Text>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.detailText}>
                      Frais d'abonnement: {distributor.subscriptionFee.toLocaleString()} FCFA
                    </Text>
                    <Text style={styles.detailText}>
                      Commande minimum: {distributor.minOrderAmount.toLocaleString()} FCFA
                    </Text>
                    <Text style={styles.detailText}>
                      Zones de livraison: {distributor.deliveryAreas.join(', ')}
                    </Text>
                    <Text style={styles.detailText}>
                      {distributor.subscribers} commerces abonnés
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.subscribeButton,
                      isSubmitting && styles.buttonDisabled
                    ]}
                    onPress={() => handleSubscribe(distributor)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>S'abonner</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  searchInput: {
    height: INPUT_HEIGHT,
    backgroundColor: '#fff',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    height: INPUT_HEIGHT,
    backgroundColor: '#fff',
  },
  distributorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distributorImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  distributorInfo: {
    padding: 16,
  },
  distributorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  distributorDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A8A8A8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DistributorSubscriptionMobile;