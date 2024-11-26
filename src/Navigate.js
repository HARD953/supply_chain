import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import { StyleSheet,View,Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import SupplierProductsScreen from './ListeProduit';
import LoginScreen from './LoginBoutique';
import OrderRecapPage from './OrderRecapPage';
import PreOrderManagement from './PreOrderCommande';
import SupplierSignUpScreen from './SupplierSignUpScreen';
import ProductDetailsScreen from './ProductDetail';
// import YourComponent1 from './Pages/Coordonne';
  
const Stack = createStackNavigator();

const CustomHeaderTitle = ({ title }) => (
  <View style={styles.headerTitleContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

export default function Navigue({ navigation }) {
  return (
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SupplierSignUpScreen" component={SupplierSignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SupplierProductsScreen" component={SupplierProductsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PreOrderManagement" component={PreOrderManagement} options={{ headerShown: true }}/>
      </Stack.Navigator> 
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    // Ajoutez un décalage à gauche selon votre préférence
    justifyContent:'flex-start'
  },
  headerTitle: {
    fontSize: 18, // Ajustez la taille de la police selon votre préférence
    fontWeight: 'bold',
    color: '#D0D3D4',
    marginLeft:15
  },
});
