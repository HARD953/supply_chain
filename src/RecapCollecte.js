import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CATEGORIES = {
  construction: { name: 'Construction', color: '#FF9800' },
  vivrier: { name: 'Vivrier', color: '#4CAF50' },
  electronique: { name: 'Électronique', color: '#2196F3' },
  cosmetique: { name: 'Cosmétique', color: '#E91E63' },
  textile: { name: 'Textile', color: '#9C27B0' }
};

const SurfaceRecapScreen = ({ route }) => {
  // En réalité, ces données viendraient de l'API ou de la navigation
  const [surfaceData] = useState({
    nomSurface: 'Boutique Centrale Abidjan',
    categorie: 'cosmetique',
    adresse: '15 Avenue Jean-Paul II, Abidjan',
    superficie: '120',
    contactGerant: 'Marie Kouassi',
    horairesOuverture: 'Lun-Sam: 8h-20h',
    location: {
      latitude: 5.356819,
      longitude: -4.008256
    },
    chiffreAffairesMoyen: '2 500 000',
    nombreEmployes: '5',
    images: [
      require('../assets/solibra.jpg'),
      require('../assets/solibra.jpg'),
    ],
    detailsSpecifiques: {
      typeProduits: 'Cosmétiques et soins de beauté',
      gammesPrix: '5 000 - 50 000 FCFA',
      clienteleCible: 'Femmes 25-45 ans',
      marquesPrincipales: 'L\'Oréal, Nivea, Local Brands'
    },
    zoneChalandise: '10 km',
    potentielDeveloppement: 'Très bon potentiel. Quartier en développement avec une demande croissante.'
  });

  const renderImageGallery = () => (
    <ScrollView 
      horizontal 
      style={styles.imageGallery}
      showsHorizontalScrollIndicator={false}
    >
      {surfaceData.images.map((image, index) => (
        <Image 
          key={index} 
          source={image} 
          style={styles.galleryImage} 
        />
      ))}
    </ScrollView>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[
        styles.categoryHeader, 
        { backgroundColor: CATEGORIES[surfaceData.categorie].color }
      ]}>
        <Text style={styles.categoryTitle}>
          {CATEGORIES[surfaceData.categorie].name}
        </Text>
        <Text style={styles.surfaceName}>
          {surfaceData.nomSurface}
        </Text>
      </View>

      {renderImageGallery()}

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations Générales</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={24} color="#666" />
          <Text style={styles.infoText}>{surfaceData.adresse}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="aspect-ratio" size={24} color="#666" />
          <Text style={styles.infoText}>
            Superficie: {surfaceData.superficie} m²
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={24} color="#666" />
          <Text style={styles.infoText}>
            Gérant: {surfaceData.contactGerant}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={24} color="#666" />
          <Text style={styles.infoText}>
            Horaires: {surfaceData.horairesOuverture}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations Commerciales</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="attach-money" size={24} color="#666" />
          <Text style={styles.infoText}>
            Chiffre d'affaires moyen: {surfaceData.chiffreAffairesMoyen} FCFA
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="people" size={24} color="#666" />
          <Text style={styles.infoText}>
            Nombre d'employés: {surfaceData.nombreEmployes}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>
          Détails {CATEGORIES[surfaceData.categorie].name}
        </Text>
        {Object.entries(surfaceData.detailsSpecifiques).map(([key, value]) => (
          <View key={key} style={styles.infoRow}>
            <MaterialIcons name="info-outline" size={24} color="#666" />
            <Text style={styles.infoText}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Potentiel Marketing</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-searching" size={24} color="#666" />
          <Text style={styles.infoText}>
            Zone de chalandise: {surfaceData.zoneChalandise}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="trending-up" size={24} color="#666" />
          <Text style={styles.infoText}>
            Potentiel de développement: {surfaceData.potentielDeveloppement}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <MaterialIcons name="edit" size={24} color="white" />
        <Text style={styles.editButtonText}>Modifier les informations</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoryHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  surfaceName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  imageGallery: {
    paddingVertical: 15,
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  infoSection: {
    backgroundColor: 'white',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SurfaceRecapScreen;