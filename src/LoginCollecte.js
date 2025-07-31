import React, { useState, useEffect } from 'react';
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
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from './AuthContext';

const { width, height } = Dimensions.get('window');

const LoginCollecte = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const { login } = useAuth();

  // Animation d'apparition du formulaire
  useEffect(() => {
    setTimeout(() => setFormVisible(true), 200); // Délai léger pour l'effet d'entrée
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.', [
        { text: 'OK', style: 'default' },
      ]);
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide.', [
        { text: 'OK', style: 'default' },
      ]);
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      // Navigation vers HomeDashboard gérée par Navigator.js après mise à jour AuthContext
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const errorMessage =
        error.message === 'Email ou mot de passe incorrect'
          ? 'Email ou mot de passe incorrect'
          : error.message || 'Une erreur est survenue lors de la connexion';
      Alert.alert('Erreur', errorMessage, [{ text: 'Réessayer', style: 'default' }]);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Animatable.Image
              animation="zoomIn"
              duration={800}
              source={require('../assets/collecte.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Animatable.Text animation="fadeIn" duration={1000} style={styles.brandName}>
              Supply Chain Collecte
            </Animatable.Text>
            <Animatable.Text
              animation="fadeIn"
              duration={1200}
              delay={200}
              style={styles.subtitle}
            >
              Gérez la collecte des informations sur une surface
            </Animatable.Text>
          </View>

          <Animatable.View
            animation={formVisible ? 'slideInUp' : undefined}
            duration={800}
            style={styles.formContainer}
          >
            <Text style={styles.welcomeText}>Connexion</Text>

            <TextInput
              label="Adresse email professionnelle"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, isEmailFocused && styles.inputFocused]}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              // onFocus={() => setIsEmailFocused(true)}
              // onBlur={() => setIsEmailFocused(false)}
              error={email.length > 0 && !validateEmail(email)}
              theme={{
                colors: {
                  primary: '#2563EB',
                  error: '#DC2626',
                  placeholder: '#64748B',
                },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="email" color={isEmailFocused ? '#2563EB' : '#64748B'} />}
              disabled={loading}
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, isPasswordFocused && styles.inputFocused]}
              secureTextEntry={!isPasswordVisible}
              mode="outlined"
              // onFocus={() => setIsPasswordFocused(true)}
              // onBlur={() => setIsPasswordFocused(false)}
              theme={{
                colors: {
                  primary: '#2563EB',
                  placeholder: '#64748B',
                },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="lock" color={isPasswordFocused ? '#2563EB' : '#64748B'} />}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? 'eye-off' : 'eye'}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  color={isPasswordFocused ? '#2563EB' : '#64748B'}
                />
              }
              disabled={loading}
            />

            <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              <LinearGradient
                colors={['#1E40AF', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.ssoButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SupplierSignUpScreen')}
              disabled={loading}
            >
              <MaterialCommunityIcons name="store" size={24} color="#2563EB" />
              <Text style={styles.ssoButtonText}>Créer une boutique</Text>
            </TouchableOpacity>

            <View style={styles.helpContainer}>
              <MaterialCommunityIcons name="help-circle-outline" size={20} color="#64748B" />
              <Text style={styles.helpText}>Besoin d'aide ?</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.helpLink}>Contactez-nous</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
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
    height: height * 0.4, // Réduit légèrement pour un meilleur équilibre
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: height * 0.06, // Réduit pour un meilleur espacement
    paddingBottom: height * 0.03,
  },
  logo: {
    width: 90, // Légèrement réduit pour un look plus compact
    height: 90,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 26, // Réduit pour un meilleur équilibre
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15, // Légèrement réduit pour la lisibilité
    color: '#E0E7FF',
    textAlign: 'center',
    paddingHorizontal: 24,
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20, // Réduit pour un meilleur alignement
    paddingTop: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    elevation: 10,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  welcomeText: {
    fontSize: 24, // Réduit pour un meilleur équilibre
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  inputFocused: {
    borderColor: '#2563EB',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    padding: 6,
  },
  forgotPasswordText: {
    color: '#2563EB',
    fontSize: 13, // Réduit pour un look plus discret
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 14, // Légèrement réduit pour un bouton plus compact
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#64748B',
    fontWeight: '500',
    fontSize: 14,
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12, // Réduit pour un bouton plus compact
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ssoButtonText: {
    color: '#2563EB',
    fontSize: 15, // Réduit pour un meilleur équilibre
    fontWeight: '600',
    marginLeft: 10,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  helpText: {
    color: '#64748B',
    fontSize: 13, // Réduit pour un look plus discret
    fontWeight: '400',
  },
  helpLink: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default LoginCollecte;