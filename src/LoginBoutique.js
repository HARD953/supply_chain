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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert(
        'Champs requis',
        'Veuillez remplir tous les champs pour continuer',
        [{ text: 'Compris', style: 'default' }]
      );
      return;
    }

    setTimeout(() => {
      navigation.navigate('SupplierProductsScreen');
    }, 1000);
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            
            <Image 
              source={require('../assets/image.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Supply Chain Portal</Text>
            <Text style={styles.subtitle}>Gérez vos commandes efficacement</Text>
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
              onFocus={() => setIsEmailFocused(false)}
              onBlur={() => setIsEmailFocused(false)}
              error={email.length > 0 && !validateEmail(email)}
              theme={{
                colors: { 
                  primary: '#1E4D92',
                  error: '#FF6B6B',
                  placeholder: '#666',
                },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="email" color={isEmailFocused ? '#1E4D92' : '#666'} />}
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              style={[styles.input, isPasswordFocused && styles.inputFocused]}
              secureTextEntry={!isPasswordVisible}
              mode="outlined"
              onFocus={() => setIsPasswordFocused(false)}
              onBlur={() => setIsPasswordFocused(false)}
              theme={{
                colors: { 
                  primary: '#1E4D92',
                  placeholder: '#666',
                },
                roundness: 12,
              }}
              left={<TextInput.Icon icon="lock" color={isPasswordFocused ? '#1E4D92' : '#666'} />}
              right={
                <TextInput.Icon 
                  icon={isPasswordVisible ? "eye-off" : "eye"}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  color={isPasswordFocused ? '#1E4D92' : '#666'}
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
              onPress={()=>{navigation.navigate('SupplierProductsScreen')}}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1E4D92', '#2E79CC']}
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
              <MaterialCommunityIcons name="microsoft" size={24} color="#1E4D92" />
              <Text style={styles.ssoButtonText}>Connexion avec Microsoft</Text>
            </TouchableOpacity>

            <View style={styles.helpContainer}>
              <MaterialCommunityIcons name="help-circle-outline" size={20} color="#666" />
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
    shadowColor: '#000',
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
    borderColor: '#1E4D92',
    elevation: 2,
    shadowColor: '#1E4D92',
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
    color: '#1E4D92',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
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
    color: '#666',
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
    borderColor: '#1E4D92',
  },
  ssoButtonText: {
    color: '#1E4D92',
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
    color: '#666',
    fontSize: 14,
  },
  helpLink: {
    color: '#1E4D92',
    fontWeight: '600',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default LoginScreen;