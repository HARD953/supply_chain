import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MapScreen1 = ({ navigation, route }) => {
  const { shopsData } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Carte des Sites Collectés</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: shopsData.length > 0 ? parseFloat(shopsData[0].latitude) || 0 : 0,
          longitude: shopsData.length > 0 ? parseFloat(shopsData[0].longitude) || 0 : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {shopsData.map((site) =>
          site.latitude && site.longitude ? (
            <Marker
              key={site.id}
              coordinate={{
                latitude: parseFloat(site.latitude),
                longitude: parseFloat(site.longitude),
              }}
              title={site.name}
              description={site.typecommerce}
            />
          ) : null
        )}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    paddingTop: 40, // Static value instead of Platform.OS check
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen1;