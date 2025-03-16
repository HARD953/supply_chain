import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './src/AuthContext';
import Navigators from './src/Navigator'; // Importation par défaut

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return <Navigators user={user} isLoading={isLoading} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <StatusBar style="light" backgroundColor="#1E40AF" />
          <AppNavigator />
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});