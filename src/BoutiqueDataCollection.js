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
  KeyboardAvoidingView,
  Image,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BoutiqueDataCollection = ({ navigation }) => {  
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    adresse: '',
    latitude: '',
    longitude: '',
    image: null,
    estBrander: false,
    marque: '',
    proprietaire: {
      nom: '',
      genre: '',
      telephone: '',
      email: ''
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
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString()
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

  const pickImage = async () => {
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
          image: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

  const ImageSelector = ({ image }) => (
    <View style={styles.imageContainer}>
      <Text style={styles.inputLabel}>Image</Text>
      <TouchableOpacity 
        style={styles.imageSelector} 
        onPress={pickImage}
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
  
      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formSection}>
          <LinearGradient
            colors={['#ffffff', '#f8f8f8']}
            style={styles.gradientCard}
          >
            <Text style={styles.sectionTitle}>Informations de la boutique</Text>
            
            <ImageSelector image={formData.image} />
  
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom de la boutique</Text>
              <TextInput
                style={styles.input}
                value={formData.nom}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nom: text }))}
                placeholder="Entrez le nom"
                placeholderTextColor="#999"
              />
            </View>
  
            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Type de commerce</Text>
              <Picker
                selectedValue={formData.type}
                style={styles.picker}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <Picker.Item label="Sélectionnez le type" value="" />
                {typeCommerces.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>
  
            <View style={styles.switchContainer}>
              <Text style={styles.inputLabel}>Boutique brandée</Text>
              <Switch
                value={formData.estBrander}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  estBrander: value,
                  marque: value ? prev.marque : ''
                }))}
                trackColor={{ false: "#d1d1d1", true: "#90caf9" }}
                thumbColor={formData.estBrander ? "#1E3A8A" : "#f4f3f4"}
              />
            </View>
  
            {formData.estBrander && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Marque</Text>
                <TextInput
                  style={styles.input}
                  value={formData.marque}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, marque: text }))}
                  placeholder="Entrez la marque"
                  placeholderTextColor="#999"
                />
              </View>
            )}
  
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Adresse</Text>
              <TextInput
                style={styles.input}
                value={formData.adresse}
                onChangeText={(text) => setFormData(prev => ({ ...prev, adresse: text }))}
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
                    value={formData.latitude}
                    editable={false}
                    placeholder="Latitude"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.locationField}>
                  <TextInput
                    style={styles.locationInput}
                    value={formData.longitude}
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
                value={formData.proprietaire.nom}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  proprietaire: { ...prev.proprietaire, nom: text }
                }))}
                placeholder="Entrez le nom du propriétaire"
                placeholderTextColor="#999"
              />
            </View>
  
            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Genre</Text>
              <Picker
                selectedValue={formData.proprietaire.genre}
                style={styles.picker}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  proprietaire: { ...prev.proprietaire, genre: value }
                }))}
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
                value={formData.proprietaire.telephone}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  proprietaire: { ...prev.proprietaire, telephone: text }
                }))}
                placeholder="Numéro de téléphone"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>
  
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.proprietaire.email}
                onChangeText={(text) => setFormData(prev => ({
                  ...prev,
                  proprietaire: { ...prev.proprietaire, email: text }
                }))}
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
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
});

export default BoutiqueDataCollection;