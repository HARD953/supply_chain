import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  StatusBar,
  ScrollView,
  Keyboard,
} from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Ajout du Picker
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const SupplierSignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'Grossiste', // Valeur par défaut modifiée pour correspondre à la liste
    company_name: '',
    company_tax_id: '',
    phone_number: '',
    website: '',
    business_address: '',
    latitude: '',
    longitude: '',
    commune: '',
    quartier: '',
    zone: '',
    registre: '',
    date_creation: '',
    image: null,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getLocation = async () => {
    setIsLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "L'accès à la localisation est nécessaire");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address && address[0]) {
        const addr = address[0];
        const locationString = [addr.street, addr.postalCode, addr.city, addr.region]
          .filter(Boolean)
          .join(', ');
        setFormData((prev) => ({
          ...prev,
          business_address: locationString,
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
          commune: addr.city || '',
          quartier: addr.subregion || addr.district || '',
          zone: addr.region || '',
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer votre position');
      console.error('Erreur localisation:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        image: result.assets[0],
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWebsite = (url) => {
    if (!url) return true; // Optionnel
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(url);
  };

  const validateForm = () => {
    const requiredFields = [
      'username',
      'email',
      'password',
      'user_type',
      'company_name',
      'company_tax_id',
      'phone_number',
      'registre',
      'date_creation',
      'image',
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        Alert.alert('Champs requis', `Le champ "${field === 'image' ? 'Image' : field}" est requis`);
        return false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide');
      return false;
    }

    if (formData.username.length > 150) {
      Alert.alert('Erreur', "Le nom d'utilisateur doit contenir 150 caractères ou moins");
      return false;
    }

    if (!/^[a-zA-Z0-9@.+-_]+$/.test(formData.username)) {
      Alert.alert(
        'Erreur',
        "Le nom d'utilisateur ne doit contenir que des lettres, chiffres et @/./+/-/_"
      );
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    if (formData.website && !validateWebsite(formData.website)) {
      Alert.alert('Erreur', 'Veuillez entrer une URL valide (ex: https://example.com)');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') {
          if (key === 'image' && value) {
            formDataToSend.append('image', {
              uri: value.uri,
              type: 'image/jpeg',
              name: 'profile.jpg',
            });
          } else if (value !== null && value !== '') {
            formDataToSend.append(key, value);
          }
        }
      });

      console.log('Données envoyées:', Object.fromEntries(formDataToSend.entries()));

      const response = await axios.post(
        'https://supply-3.onrender.com/api/register/',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Réponse serveur:', response.data);

      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé avec succès',
        [
          {
            text: 'Continuer',
            onPress: () => navigation.navigate('LoginScreen'),
          },
        ]
      );
    } catch (error) {
      console.error('Erreur inscription:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Une erreur est survenue lors de l'inscription";
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1E4D92', '#2E79CC']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Créer un compte fournisseur</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Informations de connexion */}
            <TextInput
              label="Nom d'utilisateur"
              value={formData.username}
              onChangeText={(value) => updateFormData('username', value)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="account" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Email professionnel"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="email" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Mot de passe"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              style={styles.input}
              secureTextEntry={!isPasswordVisible}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="lock" color="#666" />}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? 'eye-off' : 'eye'}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  color="#666"
                />
              }
              disabled={isSubmitting}
            />

            <TextInput
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              style={styles.input}
              secureTextEntry={!isConfirmPasswordVisible}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="lock-check" color="#666" />}
              right={
                <TextInput.Icon
                  icon={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  color="#666"
                />
              }
              disabled={isSubmitting}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Type d'utilisateur</Text>
              <Picker
                selectedValue={formData.user_type}
                onValueChange={(value) => updateFormData('user_type', value)}
                style={styles.picker}
                enabled={!isSubmitting}
              >
                <Picker.Item label="Fabricant" value="Fabricant" />
                <Picker.Item label="Grossiste" value="Grossiste" />
                <Picker.Item label="Semi-Grossiste" value="Semi-Grossiste" />
                <Picker.Item label="Détaillant" value="Détaillant" /> 
                <Picker.Item label="All" value="All" />
              </Picker>
            </View>

            {/* Informations de l'entreprise */}
            <TextInput
              label="Nom de l'entreprise"
              value={formData.company_name}
              onChangeText={(value) => updateFormData('company_name', value)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="domain" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Numéro SIRET"
              value={formData.company_tax_id}
              onChangeText={(value) => updateFormData('company_tax_id', value)}
              style={styles.input}
              keyboardType="number-pad"
              mode="outlined"
              maxLength={14}
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="identifier" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Téléphone"
              value={formData.phone_number}
              onChangeText={(value) => updateFormData('phone_number', value)}
              style={styles.input}
              keyboardType="phone-pad"
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="phone" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Site web (optionnel, ex: https://example.com)"
              value={formData.website}
              onChangeText={(value) => updateFormData('website', value)}
              style={styles.input}
              keyboardType="url"
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="web" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Numéro de registre (ex. CI-M-2025)"
              value={formData.registre}
              onChangeText={(value) => updateFormData('registre', value)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="file-document" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Date de création (ex. 01012025)"
              value={formData.date_creation}
              onChangeText={(value) => updateFormData('date_creation', value)}
              style={styles.input}
              keyboardType="number-pad"
              mode="outlined"
              maxLength={8}
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="calendar" color="#666" />}
              disabled={isSubmitting}
            />

            {/* Informations de localisation */}
            <View style={styles.locationContainer}>
              <TextInput
                label="Adresse"
                value={formData.business_address}
                onChangeText={(value) => updateFormData('business_address', value)}
                style={[styles.input, styles.locationInput]}
                mode="outlined"
                theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
                left={<TextInput.Icon icon="map-marker" color="#666" />}
                disabled={isSubmitting}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getLocation}
                disabled={isLoadingLocation || isSubmitting}
              >
                {isLoadingLocation ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <TextInput
              label="Latitude"
              value={formData.latitude}
              onChangeText={(value) => updateFormData('latitude', value)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="latitude" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Longitude"
              value={formData.longitude}
              onChangeText={(value) => updateFormData('longitude', value)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="longitude" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Commune"
              value={formData.commune}
              onChangeText={(value) => updateFormData('commune', value)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="city" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Quartier"
              value={formData.quartier}
              onChangeText={(value) => updateFormData('quartier', value)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="home-group" color="#666" />}
              disabled={isSubmitting}
            />

            <TextInput
              label="Zone"
              value={formData.zone}
              onChangeText={(value) => updateFormData('zone', value)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#1E4D92', placeholder: '#666' }, roundness: 12 }}
              left={<TextInput.Icon icon="map" color="#666" />}
              disabled={isSubmitting}
            />

            {/* Image */}
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
              disabled={isSubmitting}
            >
              <MaterialCommunityIcons name="camera" size={24} color="#1E4D92" />
              <Text style={styles.imagePickerText}>
                {formData.image ? 'Changer la photo' : 'Ajouter une photo'}
              </Text>
            </TouchableOpacity>

            {/* Boutons */}
            <TouchableOpacity
              style={[styles.signUpButton, isSubmitting && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1E4D92', '#2E79CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.signUpButtonText}>Créer mon compte</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginPromptContainer}>
              <Text style={styles.loginPromptText}>Déjà inscrit ?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('LoginCollecte')}
                activeOpacity={0.7}
                disabled={isSubmitting}
              >
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.35,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight + 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
  },
  locationButton: {
    backgroundColor: '#1E4D92',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E4D92',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginLeft: 8,
    color: '#1E4D92',
    fontSize: 14,
    fontWeight: '500',
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1E4D92',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loginPromptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginPromptText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#1E4D92',
    fontWeight: '600',
    fontSize: 14,
  },
  pickerContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E4D92',
    overflow: 'hidden',
  },
  pickerLabel: {
    paddingHorizontal: 12,
    paddingTop: 8,
    fontSize: 12,
    color: '#666',
  },
  picker: {
    height: Platform.OS === 'ios' ? 120 : 50,
    width: '100%',
  },
});

export default SupplierSignUpScreen;