import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SupplierProductsScreen from './ListeProduit';
import LoginScreen from './LoginBoutique';
import OrderRecapPage from './OrderRecapPage';
import PreOrderManagement from './PreOrderCommande';
import SupplierSignUpScreen from './SupplierSignUpScreen';
import ProductDetailsScreen from './ProductDetail';
import Dashboard from './Dashboard';
import ProductCatalog from './ProductCatalog';
import OrderHistory from './OrderHistory';
import TopProductsScreen from './TopProductsScreen';
import ManagerProfileScreen from './ManagerProfileScreen';
import PriceComparator from './PriceComparator';
import NotificationsScreen from './NotificationsScreen';
import HomeDashboard from './HomeDashboard';
import CommercialDataCollection from './CommercialDataCollection';
import LoginCollecte from './LoginCollecte';
import CommercialDataRecap from './CommercialDataRecap';
import SelectionModal from './SelectionModal';
import BoutiqueDataCollection from './BoutiqueDataCollection';
import ProduitDataCollection from './ProduitDataCollection';
import FournisseurDataCollection from './FournisseurDataCollection';
import BusinessTypeSelection from './BusinessTypeSelection';

const Stack = createStackNavigator();

function UnauthenticatedNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginCollecte">
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginCollecte" component={LoginCollecte} options={{ headerShown: false }} />
      <Stack.Screen name="SupplierSignUpScreen" component={SupplierSignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AuthenticatedNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeDashboard">
      <Stack.Screen name="HomeDashboard" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="ProductCatalog" component={ProductCatalog} options={{ headerShown: false }} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: false }} />
      <Stack.Screen name="TopProductsScreen" component={TopProductsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PriceComparator" component={PriceComparator} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ManagerProfileScreen" component={ManagerProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SupplierProductsScreen" component={SupplierProductsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PreOrderManagement" component={PreOrderManagement} options={{ headerShown: false }} />
      <Stack.Screen name="CommercialDataCollection" component={CommercialDataCollection} options={{ headerShown: false }} />
      <Stack.Screen name="CommercialDataRecap" component={CommercialDataRecap} options={{ headerShown: false }} />
      <Stack.Screen name="HomeDashboard" component={HomeDashboard} options={{ headerShown: false }} />
      <Stack.Screen name="SelectionModal" component={SelectionModal} options={{ headerShown: false }} />
      <Stack.Screen name="BoutiqueDataCollection" component={BoutiqueDataCollection} options={{ headerShown: false }} />
      <Stack.Screen name="ProduitDataCollection" component={ProduitDataCollection} options={{ headerShown: false }} />
      <Stack.Screen name="FournisseurDataCollection" component={FournisseurDataCollection} options={{ headerShown: false }} />
      <Stack.Screen name="BusinessTypeSelection" component={BusinessTypeSelection} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export { UnauthenticatedNavigator, AuthenticatedNavigator };