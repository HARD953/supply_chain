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
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const LoginCollecte = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // const handleLogin = () => {
  //   Keyboard.dismiss();
  //   if (!email || !password) {
  //     Alert.alert(
  //       'Champs requis',
  //       'Veuillez remplir tous les champs pour continuer',
  //       [{ text: 'Compris', style: 'default' }]
  //     );
  //     return;
  //   }

  //   setTimeout(() => {
  //     navigation.navigate('SupplierProductsScreen');
  //   }, 1000);
  // };

  const handleLogin = async () => {
      Keyboard.dismiss();
  
      // Vérification des champs requis
      if (!email || !password) {
        Alert.alert('Champs requis', 'Veuillez remplir tous les champs pour continuer', [
          { text: 'Compris', style: 'default' },
        ]);
        return;
      }
  
      // Vérification des identifiants
      if (
        (email === 'issa@gmail.com' && password === 'issa01') ||
        (email === 'romy@gmail.com' && password === 'romy01')
      ) {
        // Connexion réussie, naviguer vers le tableau de bord
        navigation.navigate('HomeDashboard');
      } else {
        // Identifiants incorrects
        Alert.alert('Erreur de connexion', 'Email ou mot de passe incorrect');
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
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/collecte.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Supply Chain Collecte</Text>
            <Text style={styles.subtitle}>Gérez la collecte des informations sur une surface</Text>
          </View>
          <Animatable.View 
            animation="slideInUp"
            duration={1000}
            style={styles.formContainer}
          >
            <View style={styles.formContainer}>
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
                    icon={isPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    color={isPasswordFocused ? '#2563EB' : '#64748B'}
                  />
                }
              />
              <TouchableOpacity 
                style={styles.forgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#1E40AF', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
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
                onPress={()=>navigation.navigate('SupplierSignUpScreen')}
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
    height: height * 0.45,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: height * 0.04,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    paddingHorizontal: 20,
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
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#2563EB',
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    padding: 4,
  },
  forgotPasswordText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#2563EB',
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
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  ssoButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  helpText: {
    color: '#64748B',
    fontSize: 14,
  },
  helpLink: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default LoginCollecte;