import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SurfaceCollectScreen from './src/collecte';
import OrderManagementMobile from './src/Order';
//import LoginScreen from './src/LoginPage';
import OrderRecapPage from './src/OrderRecapPage';
import DistributorManagementMobile from './src/DistributorManagementMobile';
import LoginScreen from './src/LoginBoutique';
import SupplierProductsScreen from './src/ListeProduit';
import PreOrderManagement from './src/PreOrderCommande';
import SurfaceRecapScreen from './src/RecapCollecte';
import Navigue from './src/Navigate';
//import ProductDetailsScreen from './src/DetailProduitScreen';
import ProductDetailsScreen from './src/ProductDetail';
import UVManagementScreen from './src/UVManagementScreen';

import Navigators from './src/Navigator';
export default function App() {
  return (
    <UVManagementScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
