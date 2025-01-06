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
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }).start(() => {
        navigation.replace('Navigue');
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Image 
              source={require('../assets/image.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    alignItems: 'center'
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  }
});

export default SplashScreen;