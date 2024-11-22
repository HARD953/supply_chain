import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SurfaceCollectScreen from './src/collecte';
import OrderManagementMobile from './src/Order';
import LoginScreen from './src/LoginPage';
import OrderRecapPage from './src/OrderRecapPage';
import DistributorManagementMobile from './src/DistributorManagementMobile';
//import LoginScreen from './src/LoginBoutique';
import SupplierProductsScreen from './src/ListeProduit';
import PreOrderManagement from './src/PreOrderCommande';
import SurfaceRecapScreen from './src/RecapCollecte';
import Navigue from './src/Navigate';

import Navigators from './src/Navigator';
export default function App() {
  return (
    <Navigators />
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
