import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import Navigators from './src/Navigator';
import OrderHistoryScreen from './src/OrderHistoryScreen';
import ProductCatalog from './src/ProductCatalog'
import OrderHistory from './src/OrderHistory'
import SupplierProductsScreen from './src/ListeProduit'

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