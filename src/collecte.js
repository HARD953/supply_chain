import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

const CATEGORIES = [
  {
    id: 'construction',
    name: 'Construction',
    icon: 'home',
    color: '#FF9800',
    fields: ['typeMateriaux', 'surfaceExposition', 'capaciteStockage', 'typeClient']
  },
  {
    id: 'vivrier',
    name: 'Vivrier',
    icon: 'local-grocery-store',
    color: '#4CAF50',
    fields: ['typesProduits', 'origineProvenance', 'conditionsStockage', 'frequenceReapprovisionnement']
  },
  {
    id: 'electronique',
    name: 'Électronique',
    icon: 'devices',
    color: '#2196F3',
    fields: ['typesAppareils', 'serviceApresVente', 'garantieOfferte', 'origineMarques']
  },
  {
    id: 'cosmetique',
    name: 'Cosmétique',
    icon: 'spa',
    color: '#E91E63',
    fields: ['typeProduits', 'gammesPrix', 'marquesPrincipales', 'clienteleCible']
  },
  {
    id: 'textile',
    name: 'Textile',
    icon: 'checkroom',
    color: '#9C27B0',
    fields: ['typeVetements', 'origineTextile', 'gammesPrix', 'saisonalite']
  }
];

const CategoryCard = ({ category, selected, onSelect }) => (
  <TouchableOpacity 
    style={[
      styles.categoryCard,
      { backgroundColor: category.color },
      selected && styles.categoryCardSelected
    ]}
    onPress={() => onSelect(category)}
  >
    <MaterialIcons name={category.icon} size={28} color="white" />
    <Text style={styles.categoryText}>{category.name}</Text>
  </TouchableOpacity>
);

const SurfaceCollectScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    nomSurface: '',
    adresse: '',
    superficie: '',
    description: '',
    contactGerant: '',
    images: [],
    location: null,
    equipements: [],
    horairesOuverture: '',
    // Champs spécifiques aux catégories
    typeMateriaux: '',
    surfaceExposition: '',
    capaciteStockage: '',
    typeClient: '',
    typesProduits: '',
    origineProvenance: '',
    conditionsStockage: '',
    frequenceReapprovisionnement: '',
    typesAppareils: '',
    serviceApresVente: '',
    garantieOfferte: '',
    origineMarques: '',
    gammesPrix: '',
    clienteleCible: '',
    // Informations financières
    chiffreAffairesMoyen: '',
    nombreEmployes: '',
    methodePaiement: [],
    // Informations marketing
    concurrent: [],
    zoneChalandise: '',
    potentielDeveloppement: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status: locationStatus } = 
        await Location.requestForegroundPermissionsAsync();
      const { status: cameraStatus } = 
        await ImagePicker.requestCameraPermissionsAsync();
      
      if (locationStatus !== 'granted' || cameraStatus !== 'granted') {
        Alert.alert(
          'Permissions requises',
          'Les permissions de localisation et caméra sont nécessaires.'
        );
      }
    })();
  }, []);

  const getLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setFormData(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer la localisation');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...result.assets.map(asset => asset.uri)],
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

  const renderCategorySpecificFields = () => {
    if (!selectedCategory) return null;

    const fields = selectedCategory.fields;
    return fields.map((field) => (
      <TextInput
        key={field}
        mode="outlined"
        label={getFieldLabel(field)}
        value={formData[field]}
        onChangeText={(text) => setFormData(prev => ({...prev, [field]: text}))}
        style={styles.input}
        multiline={field.includes('description')}
      />
    ));
  };

  const getFieldLabel = (field) => {
    const labels = {
      typeMateriaux: 'Types de matériaux proposés',
      surfaceExposition: 'Surface d\'exposition (m²)',
      capaciteStockage: 'Capacité de stockage',
      typeClient: 'Type de clientèle principale',
      typesProduits: 'Types de produits',
      origineProvenance: 'Origine/Provenance des produits',
      conditionsStockage: 'Conditions de stockage',
      frequenceReapprovisionnement: 'Fréquence de réapprovisionnement',
      typesAppareils: 'Types d\'appareils',
      serviceApresVente: 'Service après-vente',
      garantieOfferte: 'Garantie offerte',
      origineMarques: 'Origine des marques',
      gammesPrix: 'Gammes de prix',
      clienteleCible: 'Clientèle cible',
    };
    return labels[field] || field;
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !formData.nomSurface || !formData.location) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      // Simulation d'envoi au serveur
      console.log('Données à envoyer:', {
        ...formData,
        categorie: selectedCategory.id
      });
      Alert.alert('Succès', 'Les informations ont été enregistrées');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer les données');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collecte d'Informations</Text>
        <Text style={styles.headerSubtitle}>Surface de Distribution</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          renderItem={({item}) => (
            <CategoryCard
              category={item}
              selected={selectedCategory?.id === item.id}
              onSelect={setSelectedCategory}
            />
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
        />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.form}>
          {/* Informations de base */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            <TextInput
              mode="outlined"
              label="Nom de la surface *"
              value={formData.nomSurface}
              onChangeText={(text) => setFormData(prev => ({...prev, nomSurface: text}))}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Adresse complète"
              value={formData.adresse}
              onChangeText={(text) => setFormData(prev => ({...prev, adresse: text}))}
              style={styles.input}
              multiline
            />

            <TextInput
              mode="outlined"
              label="Superficie totale (m²)"
              value={formData.superficie}
              onChangeText={(text) => setFormData(prev => ({...prev, superficie: text}))}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>

          {/* Champs spécifiques à la catégorie */}
          {selectedCategory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Informations {selectedCategory.name}
              </Text>
              {renderCategorySpecificFields()}
            </View>
          )}

          {/* Localisation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localisation</Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={getLocation}
              disabled={loading}
            >
              <MaterialIcons name="location-on" size={24} color="white" />
              <Text style={styles.locationButtonText}>
                {formData.location ? 'Actualiser la position' : 'Obtenir la position'}
              </Text>
            </TouchableOpacity>
            {formData.location && (
              <Text style={styles.locationText}>
                Position: {formData.location.latitude.toFixed(6)}, 
                {formData.location.longitude.toFixed(6)}
              </Text>
            )}
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <MaterialIcons name="add-a-photo" size={24} color="white" />
              <Text style={styles.imageButtonText}>Ajouter des photos</Text>
            </TouchableOpacity>
            <ScrollView horizontal style={styles.imagePreviewContainer}>
              {formData.images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.imagePreview}
                />
              ))}
            </ScrollView>
          </View>

          {/* Informations commerciales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations commerciales</Text>
            <TextInput
              mode="outlined"
              label="Contact du gérant"
              value={formData.contactGerant}
              onChangeText={(text) => setFormData(prev => ({...prev, contactGerant: text}))}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Horaires d'ouverture"
              value={formData.horairesOuverture}
              onChangeText={(text) => setFormData(prev => ({...prev, horairesOuverture: text}))}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Chiffre d'affaires moyen mensuel"
              value={formData.chiffreAffairesMoyen}
              onChangeText={(text) => setFormData(prev => ({...prev, chiffreAffairesMoyen: text}))}
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              mode="outlined"
              label="Nombre d'employés"
              value={formData.nombreEmployes}
              onChangeText={(text) => setFormData(prev => ({...prev, nombreEmployes: text}))}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>

          {/* Informations marketing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations marketing</Text>
            <TextInput
              mode="outlined"
              label="Zone de chalandise (km)"
              value={formData.zoneChalandise}
              onChangeText={(text) => setFormData(prev => ({...prev, zoneChalandise: text}))}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Potentiel de développement"
              value={formData.potentielDeveloppement}
              onChangeText={(text) => setFormData(prev => ({...prev, potentielDeveloppement: text}))}
              style={styles.input}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Bouton de soumission */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Enregistrement...' : 'Enregistrer les informations'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoriesList: {
    padding: 10,
  },
  categoryCard: {
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  categoryCardSelected: {
    transform: [{ scale: 1.05 }],
    borderWidth: 3,
    borderColor: 'white',
},
categoryText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
},
formContainer: {
    flex: 1,
},
form: {
    padding: 16,
},
section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
},
sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
},
input: {
    marginBottom: 16,
    backgroundColor: 'white',
},
locationButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
},
locationButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
},
locationText: {
    color: '#666',
    fontSize: 14,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
},
imageButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
},
imageButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
},
imagePreviewContainer: {
    flexDirection: 'row',
    marginBottom: 8,
},
imagePreview: {
    width: 120,
    height: 120,
    marginRight: 8,
    borderRadius: 8,
},
submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
},
});

export default SurfaceCollectScreen;