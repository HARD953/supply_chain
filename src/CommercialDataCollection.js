import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CommercialDataCollection = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('boutique');
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  const [formData, setFormData] = useState({
    boutique: {
      nom: '',
      type: '',
      adresse: '',
      latitude: '',
      longitude: '',
      image: null,
      proprietaire: {
        nom: '',
        genre: '',
        telephone: '',
        email: ''
      },
      horaires: {
        ouverture: '',
        fermeture: ''
      },
      categorieProduits: [],
      capaciteStockage: '',
      volumeStockActuel: '',
      modesPaiement: []
    },
    produit: {
      nom: '',
      categorie: '',
      prix: '',
      image: null,
      prixHistorique: [],
      quantiteStock: '',
      certification: [],
      frequenceReapprovisionnement: ''
    },
    fournisseur: {
      nom: '',
      type: '',
      image: null,
      coordonnees: {
        telephone: '',
        email: '',
        adresse: ''
      },
      produitsFournis: [],
      delaiLivraison: '',
      frequenceCommandes: ''
    }
  });

  const typeCommerces = [
    'Boutique',
    'Supérette',
    'Supermarché',
    'Grossiste',
    'Demi-grossiste'
  ];

  const genres = [
    'Homme',
    'Femme',
    'Autre',
    'Préfère ne pas préciser'
  ];

  const categoriesProduits = [
    'Alimentation',
    'Vêtements',
    'Électronique',
    'Cosmétique',
    'Mobilier',
    'Autre'
  ];

  const modesPaiement = [
    'Espèces',
    'Carte bancaire',
    'Mobile Money',
    'Chèque',
    'Virement'
  ];

  const certifications = [
    'Bio',
    'Local',
    'Importé',
    'Commerce équitable',
    'Label qualité'
  ];

  

  useEffect(() => {
    requestLocationPermission();
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la galerie.');
    }
  };

  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setFormData(prev => ({
          ...prev,
          boutique: {
            ...prev.boutique,
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString()
          }
        }));
      } else {
        setLocationError('Permission de localisation refusée');
      }
    } catch (error) {
      setLocationError('Erreur lors de la récupération de la position');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (section) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            image: result.assets[0].uri
          }
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

 const InputField = React.memo(({ label, value, onChangeText, placeholder, keyboardType = 'default', style = {} }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#999"
    />
  </View>
));


  const ImageSelector = ({ section, image }) => (
    <View style={styles.imageContainer}>
      <Text style={styles.inputLabel}>Image</Text>
      <TouchableOpacity 
        style={styles.imageSelector} 
        onPress={() => pickImage(section)}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="add-photo-alternate" size={40} color="#666" />
            <Text style={styles.imagePlaceholderText}>Ajouter une image</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const updateFormField = (section, field, value, isNested = false, nestedField = '') => {
    if (isNested) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [nestedField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const renderBoutiqueForm = () => (
    <View style={styles.formSection}>
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.gradientCard}
      >
        <Text style={styles.sectionTitle}>Informations de la boutique</Text>
        
        <ImageSelector 
          section="boutique"
          image={formData.boutique.image}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nom de la boutique</Text>
          <TextInput
            style={styles.input}
            value={formData.boutique.nom}
            onChangeText={(text) => updateFormField('boutique', 'nom', text)}
            placeholder="Entrez le nom"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.inputLabel}>Type de commerce</Text>
          <Picker
            selectedValue={formData.boutique.type}
            style={styles.picker}
            onValueChange={(value) => updateFormField('boutique', 'type', value)}
          >
            <Picker.Item label="Sélectionnez le type" value="" />
            {typeCommerces.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Adresse</Text>
          <TextInput
            style={styles.input}
            value={formData.boutique.adresse}
            onChangeText={(text) => updateFormField('boutique', 'adresse', text)}
            placeholder="Entrez l'adresse complète"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.inputLabel}>Coordonnées GPS</Text>
          <View style={styles.locationFields}>
            <View style={styles.locationField}>
              <TextInput
                style={styles.locationInput}
                value={formData.boutique.latitude}
                editable={false}
                placeholder="Latitude"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.locationField}>
              <TextInput
                style={styles.locationInput}
                value={formData.boutique.longitude}
                editable={false}
                placeholder="Longitude"
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={requestLocationPermission}
            >
              <MaterialIcons name="my-location" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {loading && <ActivityIndicator style={styles.loader} color="#1E3A8A" />}
          {locationError && <Text style={styles.errorText}>{locationError}</Text>}
        </View>

        <Text style={styles.subSectionTitle}>Informations du propriétaire</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nom du propriétaire</Text>
          <TextInput
            style={styles.input}
            value={formData.boutique.proprietaire.nom}
            onChangeText={(text) => {
              setFormData(prev => ({
                ...prev,
                boutique: {
                  ...prev.boutique,
                  proprietaire: {
                    ...prev.boutique.proprietaire,
                    nom: text
                  }
                }
              }));
            }}
            placeholder="Entrez le nom du propriétaire"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.inputLabel}>Genre</Text>
          <Picker
            selectedValue={formData.boutique.proprietaire.genre}
            style={styles.picker}
            onValueChange={(value) => {
              setFormData(prev => ({
                ...prev,
                boutique: {
                  ...prev.boutique,
                  proprietaire: {
                    ...prev.boutique.proprietaire,
                    genre: value
                  }
                }
              }));
            }}
          >
            <Picker.Item label="Sélectionnez le genre" value="" />
            {genres.map((genre) => (
              <Picker.Item key={genre} label={genre} value={genre} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={formData.boutique.proprietaire.telephone}
            onChangeText={(text) => {
              setFormData(prev => ({
                ...prev,
                boutique: {
                  ...prev.boutique,
                  proprietaire: {
                    ...prev.boutique.proprietaire,
                    telephone: text
                  }
                }
              }));
            }}
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.boutique.proprietaire.email}
            onChangeText={(text) => {
              setFormData(prev => ({
                ...prev,
                boutique: {
                  ...prev.boutique,
                  proprietaire: {
                    ...prev.boutique.proprietaire,
                    email: text
                  }
                }
              }));
            }}
            placeholder="Adresse email"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => navigation.navigate("CommercialDataRecap")}
        >
          <Text style={styles.submitButtonText}>Enregistrer la boutique</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderProduitForm = () => (
    <View style={styles.formSection}>
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.gradientCard}
      >
        <Text style={styles.sectionTitle}>Informations du produit</Text>
        
        <ImageSelector 
          section="produit"
          image={formData.produit.image}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nom du produit</Text>
          <TextInput
            style={styles.input}
            value={formData.produit.nom}
            onChangeText={(text) => updateFormField('produit', 'nom', text)}
            placeholder="Entrez le nom du produit"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.inputLabel}>Catégorie</Text>
          <Picker
            selectedValue={formData.produit.categorie}
            style={styles.picker}
            onValueChange={(value) => updateFormField('produit', 'categorie', value)}
          >
            <Picker.Item label="Sélectionnez la catégorie" value="" />
            {categoriesProduits.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Prix actuel</Text>
          <TextInput
            style={styles.input}
            value={formData.produit.prix}
            onChangeText={(text) => updateFormField('produit', 'prix', text)}
            placeholder="Prix du produit"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Quantité en stock</Text>
          <TextInput
            style={styles.input}
            value={formData.produit.quantiteStock}
            onChangeText={(text) => updateFormField('produit', 'quantiteStock', text)}
            placeholder="Quantité disponible"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => navigation.navigate("CommercialDataRecap")}
        >
          <Text style={styles.submitButtonText}>Enregistrer le produit</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderFournisseurForm = () => (
    <View style={styles.formSection}>
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.gradientCard}
      >
        <Text style={styles.sectionTitle}>Informations du fournisseur</Text>
        
        <ImageSelector 
          section="fournisseur"
          image={formData.fournisseur.image}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nom du fournisseur</Text>
          <TextInput
            style={styles.input}
            value={formData.fournisseur.nom}
            onChangeText={(text) => updateFormField('fournisseur', 'nom', text)}
            placeholder="Entrez le nom du fournisseur"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.inputLabel}>Type de fournisseur</Text>
          <Picker
            selectedValue={formData.fournisseur.type}
            style={styles.picker}
            onValueChange={(value) => updateFormField('fournisseur', 'type', value)}
          >
            <Picker.Item label="Sélectionnez le type" value="" />
            <Picker.Item label="Grossiste" value="grossiste" />
            <Picker.Item label="Fabricant" value="fabricant" />
            <Picker.Item label="Importateur" value="importateur" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Délai de livraison moyen (jours)</Text>
          <TextInput
            style={styles.input}
            value={formData.fournisseur.delaiLivraison}
            onChangeText={(text) => updateFormField('fournisseur', 'delaiLivraison', text)}
            placeholder="Nombre de jours"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => navigation.navigate("CommercialDataRecap")}
        >
          
          <Text style={styles.submitButtonText}>Enregistrer le fournisseur</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collecte des données</Text>
      </View>
      
      </LinearGradient>
      <View style={styles.tabs}>
        {['boutique', 'produit', 'fournisseur'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      >
        {activeTab === 'boutique' && renderBoutiqueForm()}
        {activeTab === 'produit' && renderProduitForm()}
        {activeTab === 'fournisseur' && renderFournisseurForm()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1E3A8A',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  gradientCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#444',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationFields: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationField: {
    flex: 1,
    marginRight: 8,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  locationButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  loader: {
    marginTop: 8,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageSelector: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default CommercialDataCollection;