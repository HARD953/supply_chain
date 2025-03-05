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
  Keyboard
} from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const SupplierSignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    user_type: 'WHOLESALER',
    phone_number: '',
    address: '',
    user_name: '',
    company_name: '',
    company_tax_id: '',
    website: '',
    contact_email: '',
    contact_person: '',
    business_address: '',
    image: null
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
        Alert.alert(
          'Permission refusée',
          'L\'accès à la localisation est nécessaire pour cette fonctionnalité'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (address && address[0]) {
        const addr = address[0];
        const locationString = [
          addr.street,
          addr.postalCode,
          addr.city,
          addr.region,
        ].filter(Boolean).join(', ');
        setFormData(prev => ({
          ...prev,
          business_address: locationString,
          address: locationString
        }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer votre position');
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
      setFormData(prev => ({
        ...prev,
        image: result.assets[0]
      }));
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.email || 
        !formData.phone_number || !formData.company_name || !formData.company_tax_id) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      // Création du FormData pour envoyer à la fois les données et l'image
      const formDataToSend = new FormData();
  
      // Ajout de toutes les données du formulaire
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('user_type', 'WHOLESALER');
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('address', formData.business_address);
      formDataToSend.append('user_name', formData.username);
      formDataToSend.append('company_name', formData.company_name);
      formDataToSend.append('company_tax_id', formData.company_tax_id);
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('contact_email', formData.email);
      formDataToSend.append('contact_person', formData.username);
      formDataToSend.append('business_address', formData.business_address);
  
      // Ajout de l'image si elle existe
      if (formData.image) {
        formDataToSend.append('image', {
          uri: formData.image.uri,
          type: 'image/jpeg',
          name: 'profile.jpg'
        });
      }
  
      console.log('Envoi des données...', Object.fromEntries(formDataToSend));
  
      const response = await fetch('https://supply-3.onrender.com/api/register/', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Status de la réponse:', response.status);
      
      const responseData = await response.text();
      console.log('Réponse brute:', responseData);
  
      let jsonData;
      try {
        jsonData = JSON.parse(responseData);
      } catch (e) {
        console.log('Erreur parsing JSON:', e);
        Alert.alert('Erreur', 'Format de réponse invalide du serveur');
        return;
      }
  
      if (response.ok) {
        Alert.alert(
          'Inscription réussie',
          'Votre compte a été créé avec succès',
          [
            {
              text: 'Continuer',
              onPress: () => navigation.navigate('LoginScreen')
            }
          ]
        );
      } else {
        const errorMessage = jsonData.message || 
                           Object.values(jsonData).join('\n') ||
                           'Une erreur est survenue lors de l\'inscription';
        Alert.alert('Erreur', errorMessage);
      }
    } catch (error) {
      console.log('Erreur lors de l\'inscription:', error);
      Alert.alert(
        'Erreur de connexion',
        'Impossible de communiquer avec le serveur. Veuillez vérifier votre connexion internet.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Créer un compte fournisseur</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Nom d'utilisateur"
              value={formData.username}
              onChangeText={(value) => updateFormData('username', value)}
              style={styles.input}
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="account" color="#666" />}
            />

            <TextInput
              label="Nom de l'entreprise"
              value={formData.company_name}
              onChangeText={(value) => updateFormData('company_name', value)}
              style={styles.input}
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="domain" color="#666" />}
            />

            <TextInput
              label="Numéro SIRET"
              value={formData.company_tax_id}
              onChangeText={(value) => updateFormData('company_tax_id', value)}
              style={styles.input}
              keyboardType="number-pad"
              mode="outlined"
              maxLength={14}
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="identifier" color="#666" />}
            />

            <TextInput
              label="Téléphone"
              value={formData.phone_number}
              onChangeText={(value) => updateFormData('phone_number', value)}
              style={styles.input}
              keyboardType="phone-pad"
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="phone" color="#666" />}
            />

            <TextInput
              label="Site web"
              value={formData.website}
              onChangeText={(value) => updateFormData('website', value)}
              style={styles.input}
              keyboardType="url"
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="web" color="#666" />}
            />

            <View style={styles.locationContainer}>
              <TextInput
                label="Adresse"
                value={formData.business_address}
                onChangeText={(value) => updateFormData('business_address', value)}
                style={[styles.input, styles.locationInput]}
                mode="outlined"
                theme={{
                  colors: { primary: '#1E4D92', placeholder: '#666' },
                  roundness: 12,
                }}
                left={<TextInput.Icon icon="map-marker" color="#666" />}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <TextInput
              label="Email professionnel"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="email" color="#666" />}
            />

            <TextInput
              label="Mot de passe"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              style={styles.input}
              secureTextEntry={!isPasswordVisible}
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="lock" color="#666" />}
              right={
                <TextInput.Icon 
                  icon={isPasswordVisible ? "eye-off" : "eye"}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  color="#666"
                />
              }
            />

            <TextInput
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              style={styles.input}
              secureTextEntry={!isConfirmPasswordVisible}
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="lock-check" color="#666" />}
              right={
                <TextInput.Icon 
                  icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  color="#666"
                />
              }
            />

            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <MaterialCommunityIcons name="camera" size={24} color="#1E4D92" />
              <Text style={styles.imagePickerText}>
                {formData.image ? 'Changer la photo' : 'Ajouter une photo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signUpButton}
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
                onPress={() => navigation.navigate('LoginScreen')}
                activeOpacity={0.7}
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
});

export default SupplierSignUpScreen;