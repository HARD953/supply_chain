import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import Navigators from './src/Navigator';
import OrderHistoryScreen from './src/OrderHistoryScreen';
import ProductCatalog from './src/ProductCatalog'
import OrderHistory from './src/OrderHistory'
import SupplierProductsScreen from './src/ListeProduit'
import SurfaceCollectScreen from './src/collecte'
import CollectionPage from './src/CollectionPage'
import StrategicCollectionPage from './src/DetailedCollectionPage'
import * as SplashScreen from 'expo-splash-screen' // Importez la bibliothèque   
import StoreLocations from './src/StoreLocations' 
import ScheduleOrderScreen from './src/ScheduleOrderScreen' 
import CommercialDataCollection from './src/CommercialDataCollection'
import HomeDashboard from './src/HomeDashboard' 
import CommercialDataRecap from './src/CommercialDataRecap'

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar 
          style="light" 
          backgroundColor="#b937a8" 
        />
        <Navigators />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});