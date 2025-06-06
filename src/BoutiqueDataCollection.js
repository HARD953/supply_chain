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
import { useAuth } from './AuthContext';

const BoutiqueDataCollection = ({ navigation }) => {
  const { accessToken, logout } = useAuth(); // Récupérer accessToken et logout depuis AuthContext
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    adresse: '',
    categories: '',
    latitude: '',
    longitude: '',
    taille: '',
    frequence: '',
    image: null,
    estBrander: false,
    marque: '',
    proprietaire: {
      nom: '',
      genre: '',
      telephone: '',
      email: '',
    },
  });

  const typeCommerces = ['Boutique', 'Supérette'];
  const Categories = ['Grossiste', 'Semi-grossiste', 'Détaillant', 'Mixte'];
  const typeTaille = ['Petite', 'Moyenne', 'Grande'];
  const typeFrequence = ['Journalière', 'Hebdomadaire', 'Mensuelle', 'Annuelle'];
  const genres = ['Homme', 'Femme'];

  useEffect(() => {
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
        setFormData((prev) => ({
          ...prev,
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
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
        setFormData((prev) => ({
          ...prev,
          image: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible de charger l'image");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Vérification des champs obligatoires
      if (!formData.nom || !formData.type || !formData.adresse || !formData.proprietaire.nom) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Vérification de la présence du token
      if (!accessToken) {
        Alert.alert('Erreur', 'Vous devez être connecté pour enregistrer une boutique');
        navigation.navigate('LoginScreen');
        return;
      }

      const formDataToSend = new FormData();

      if (formData.image) {
        const filename = formData.image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formDataToSend.append('image', {
          uri: formData.image,
          name: filename || 'image.jpg',
          type,
        });
      }

      formDataToSend.append('name', formData.nom);
      formDataToSend.append('typecommerce', formData.type.toUpperCase());
      formDataToSend.append('type', formData.estBrander ? 'BRANDED' : 'NON_BRANDED');
      formDataToSend.append('categorie', formData.categories);
      formDataToSend.append('brand', formData.marque || '');
      formDataToSend.append('address', formData.adresse);
      formDataToSend.append('taille', formData.taille);
      formDataToSend.append('frequence_appr', formData.frequence);
      formDataToSend.append('latitude', formData.latitude || '0');
      formDataToSend.append('longitude', formData.longitude || '0');
      formDataToSend.append('owner_name', formData.proprietaire.nom);
      formDataToSend.append(
        'owner_gender',
        formData.proprietaire.genre === 'Homme' ? 'Male' : formData.proprietaire.genre === 'Femme' ? 'Female' : 'Other'
      );
      formDataToSend.append('owner_phone', formData.proprietaire.telephone);
      formDataToSend.append('owner_email', formData.proprietaire.email);

      console.log('FormData being sent:', formDataToSend);

      const response = await fetch('https://supply-3.onrender.com/api/shops/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`, // Token déjà présent
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        if (response.status === 401) {
          Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
          navigation.navigate('LoginScreen');
          return;
        }
        throw new Error('Erreur lors de l\'enregistrement');
      }

      const result = await response.json();
      console.log('Success response:', result);
      Alert.alert('Succès', 'La boutique a été enregistrée avec succès');
      navigation.navigate('HomeDashboard');
    } catch (error) {
      console.error('Error details:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout(); // Appeler la fonction logout du contexte
      Alert.alert('Déconnexion réussie', 'Vous avez été déconnecté avec succès.');
      navigation.navigate('LoginScreen'); // Rediriger vers LoginScreen
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
    } finally {
      setLoading(false);
    }
  };

  const ImageSelector = ({ image }) => (
    <View style={styles.imageContainer}>
      <Text style={styles.inputLabel}>Image</Text>
      <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
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
      <LinearGradient colors={['#1E3A8A', '#3B82F6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collecte des données</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
            <MaterialIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.formSection}>
          <LinearGradient colors={['#ffffff', '#f8f8f8']} style={styles.gradientCard}>
            <Text style={styles.sectionTitle}>Informations sur le site</Text>

            <ImageSelector image={formData.image} />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Raison sociale</Text>
              <TextInput
                style={styles.input}
                value={formData.nom}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, nom: text }))}
                placeholder="Entrez le nom"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Type de commerce</Text>
              <Picker
                selectedValue={formData.type}
                style={styles.picker}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <Picker.Item label="Sélectionnez le type" value="" />
                {typeCommerces.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Catégories</Text>
              <Picker
                selectedValue={formData.categories}
                style={styles.picker}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categories: value }))}
              >
                <Picker.Item label="Sélectionnez le type" value="" />
                {Categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Taille de la surface</Text>
              <Picker
                selectedValue={formData.taille}
                style={styles.picker}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, taille: value }))}
              >
                <Picker.Item label="Sélectionnez le type" value="" />
                {typeTaille.map((taille) => (
                  <Picker.Item key={taille} label={taille} value={taille} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Fréquence d'approvisionnement</Text>
              <Picker
                selectedValue={formData.frequence}
                style={styles.picker}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, frequence: value }))}
              >
                <Picker.Item label="Sélectionnez le type" value="" />
                {typeFrequence.map((frequence) => (
                  <Picker.Item key={frequence} label={frequence} value={frequence} />
                ))}
              </Picker>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.inputLabel}>Boutique brandée</Text>
              <Switch
                value={formData.estBrander}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    estBrander: value,
                    marque: value ? prev.marque : '',
                  }))
                }
                trackColor={{ false: '#d1d1d1', true: '#90caf9' }}
                thumbColor={formData.estBrander ? '#1E3A8A' : '#f4f3f4'}
              />
            </View>

            {formData.estBrander && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Marque</Text>
                <TextInput
                  style={styles.input}
                  value={formData.marque}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, marque: text }))}
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
                onChangeText={(text) => setFormData((prev) => ({ ...prev, adresse: text }))}
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
                <TouchableOpacity style={styles.locationButton} onPress={requestLocationPermission}>
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
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    proprietaire: { ...prev.proprietaire, nom: text },
                  }))
                }
                placeholder="Entrez le nom du propriétaire"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.inputLabel}>Genre</Text>
              <Picker
                selectedValue={formData.proprietaire.genre}
                style={styles.picker}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    proprietaire: { ...prev.proprietaire, genre: value },
                  }))
                }
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
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    proprietaire: { ...prev.proprietaire, telephone: text },
                  }))
                }
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
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    proprietaire: { ...prev.proprietaire, email: text },
                  }))
                }
                placeholder="Adresse email"
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer la boutique</Text>
              )}
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
    justifyContent: 'space-between',
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
    textAlign: 'center',
  },
  logoutButton: {
    padding: 8,
    marginLeft: 16,
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