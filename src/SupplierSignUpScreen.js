import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
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

const { width, height } = Dimensions.get('window');

const SupplierSignUpScreen = ({ navigation }) => {
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [surfaceType, setSurfaceType] = useState('');
  const [location, setLocation] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const getLocation = async () => {
    setIsLoadingLocation(true);
    try {
      // Demande de permission d'accès à la localisation
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'L\'accès à la localisation est nécessaire pour cette fonctionnalité',
          [{ text: 'OK', style: 'default' }]
        );
        setIsLoadingLocation(false);
        return;
      }

      // Récupération de la position actuelle
      const location = await Location.getCurrentPositionAsync({});
      
      // Conversion des coordonnées en adresse
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
        setLocation(locationString);
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible de récupérer votre position',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const validateForm = () => {
    if (!companyName || !siret || !email || !password || !confirmPassword || !surfaceType || !location) {
      Alert.alert(
        'Champs requis',
        'Veuillez remplir tous les champs pour continuer',
        [{ text: 'Compris', style: 'default' }]
      );
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert(
        'Erreur',
        'Les mots de passe ne correspondent pas',
        [{ text: 'Compris', style: 'default' }]
      );
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert(
        'Email invalide',
        'Veuillez entrer une adresse email valide',
        [{ text: 'Compris', style: 'default' }]
      );
      return false;
    }

    return true;
  };

  const handleSignUp = () => {
    Keyboard.dismiss();
    if (validateForm()) {
      // Logique d'inscription à implémenter
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
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
              label="Nom de l'entreprise"
              value={companyName}
              onChangeText={setCompanyName}
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
              value={siret}
              onChangeText={setSiret}
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
              label="Type de surface"
              value={surfaceType}
              onChangeText={setSurfaceType}
              style={styles.input}
              mode="outlined"
              theme={{
                colors: { primary: '#1E4D92', placeholder: '#666' },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="floor-plan" color="#666" />}
            />

            <View style={styles.locationContainer}>
              <TextInput
                label="Localisation"
                value={location}
                onChangeText={setLocation}
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
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              error={email.length > 0 && !validateEmail(email)}
              theme={{
                colors: { 
                  primary: '#1E4D92',
                  error: '#FF6B6B',
                  placeholder: '#666',
                },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="email" color="#666" />}
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
              style={styles.signUpButton}
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1E4D92', '#2E79CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.signUpButtonText}>Créer mon compte</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
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