import React, { useEffect, useState } from 'react';
import { 
  View,
  Image, 
  StyleSheet, 
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animation d'apparition
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Navigation après un délai
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Durée plus longue pour une transition fluide
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Main'); // Remplacez 'Navigator' par 'Main'
      });
    }, 2000); // Délai ajusté pour attendre la fin de l'animation d'apparition

    // Nettoyage du timer au démontage
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Image 
              source={require('../assets/image.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoPlaceholder: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});

export default SplashScreen;