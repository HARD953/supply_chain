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
  Keyboard,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from './AuthContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.', [{ text: 'OK' }]);
      return;
    }

    try {
      await login(email, password);
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Email ou mot de passe incorrect');
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
        colors={['#1E3A8A', '#60A5FA']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View animation="fadeInDown" duration={800} style={styles.logoContainer}>
            <Image
              source={require('../assets/image.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Supply Chain</Text>
            <Text style={styles.subtitle}>Optimisez vos commandes</Text>
          </Animatable.View>

          <Animatable.View animation="slideInUp" duration={1000} style={styles.formContainer}>
            <Text style={styles.welcomeText}>Connexion</Text>

            <TextInput
              label="Email professionnel"
              value={email}
              onChangeText={setEmail}
              // onFocus={() => setIsEmailFocused(true)}
              // onBlur={() => setIsEmailFocused(false)}
              style={[styles.input, isEmailFocused && styles.inputFocused]}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              error={email.length > 0 && !validateEmail(email)}
              theme={{
                colors: {
                  primary: '#3B82F6',
                  error: '#EF4444',
                  placeholder: '#6B7280',
                },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="email" color={isEmailFocused ? '#3B82F6' : '#6B7280'} />}
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              // onFocus={() => setIsPasswordFocused(true)}
              // onBlur={() => setIsPasswordFocused(false)}
              style={[styles.input, isPasswordFocused && styles.inputFocused]}
              secureTextEntry={!isPasswordVisible}
              mode="outlined"
              theme={{
                colors: {
                  primary: '#3B82F6',
                  placeholder: '#6B7280',
                },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="lock" color={isPasswordFocused ? '#3B82F6' : '#6B7280'} />}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? 'eye-off' : 'eye'}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  color={isPasswordFocused ? '#3B82F6' : '#6B7280'}
                />
              }
            />

            <TouchableOpacity style={styles.forgotPassword} onPress={() => {}}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={['#3B82F6', '#1E40AF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.loginButtonText}>Se connecter</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.ssoButton}
              onPress={() => navigation.navigate('SupplierSignUpScreen')}
            >
              <MaterialCommunityIcons name="store" size={24} color="#3B82F6" />
              <Text style={styles.ssoButtonText}>Créer une boutique</Text>
            </TouchableOpacity>

            <View style={styles.helpContainer}>
              <MaterialCommunityIcons name="help-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.helpText}>Besoin d’aide ?</Text>
              <TouchableOpacity onPress={() => {}}>
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
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height * 0.4,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: height * 0.06,
    paddingBottom: height * 0.03,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#3B82F6',
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    elevation: 2,
  },
  ssoButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  helpText: {
    color: '#6B7280',
    fontSize: 14,
  },
  helpLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;