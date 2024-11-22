import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  FlatList,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');


const CATEGORIES = [
  {
    id: 'construction',
    name: 'Construction',
    icon: 'home',
    gradientColors: ['#FF9800', '#F57C00'],
    fields: ['typeMateriaux', 'surfaceExposition', 'capaciteStockage', 'typeClient']
  },
  {
    id: 'vivrier',
    name: 'Vivrier',
    icon: 'local-grocery-store',
    gradientColors: ['#4CAF50', '#388E3C'],
    fields: ['typesProduits', 'origineProvenance', 'conditionsStockage', 'frequenceReapprovisionnement']
  },
  {
    id: 'electronique',
    name: 'Électronique',
    icon: 'devices',
    gradientColors: ['#2196F3', '#1976D2'],
    fields: ['typesAppareils', 'serviceApresVente', 'garantieOfferte', 'origineMarques']
  },
  {
    id: 'cosmetique',
    name: 'Cosmétique',
    icon: 'spa',
    gradientColors: ['#E91E63', '#C2185B'],
    fields: ['typeProduits', 'gammesPrix', 'marquesPrincipales', 'clienteleCible']
  },
  {
    id: 'textile',
    name: 'Textile',
    icon: 'checkroom',
    gradientColors: ['#9C27B0', '#7B1FA2'],
    fields: ['typeVetements', 'origineTextile', 'gammesPrix', 'saisonalite']
  }
];

const AnimatedCategoryCard = ({ category, selected, onSelect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: selected ? 1.05 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: selected ? 1 : 0.8,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [selected]);

  return (
    <Animated.View
      style={[
        styles.categoryCardContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelect(category)}
      >
        <LinearGradient
          colors={category.gradientColors}
          style={[
            styles.categoryCard,
            selected && styles.categoryCardSelected
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name={category.icon} size={32} color="white" />
          <Text style={styles.categoryText}>{category.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SectionHeader = ({ title, icon }) => (
  <View style={styles.sectionHeader}>
    <MaterialIcons name={icon} size={24} color="#2196F3" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const ProgressBar = ({ progress }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
);

const FloatingAddButton = ({ onPress }) => (
  <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
    <LinearGradient
      colors={['#2196F3', '#1976D2']}
      style={styles.gradientButton}
    >
      <MaterialIcons name="add" size={30} color="white" />
    </LinearGradient>
  </TouchableOpacity>
);

const SurfaceCollectScreen = () => {
  // ... [Garder le même état et les fonctions existantes]
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    nomSurface: '',
    adresse: '',
    superficie: '',
    description: '',
    contactGerant: '',
    images: [],
    location: null,
    equipements: [],
    horairesOuverture: '',
    // Champs spécifiques aux catégories
    typeMateriaux: '',
    surfaceExposition: '',
    capaciteStockage: '',
    typeClient: '',
    typesProduits: '',
    origineProvenance: '',
    conditionsStockage: '',
    frequenceReapprovisionnement: '',
    typesAppareils: '',
    serviceApresVente: '',
    garantieOfferte: '',
    origineMarques: '',
    gammesPrix: '',
    clienteleCible: '',
    // Informations financières
    chiffreAffairesMoyen: '',
    nombreEmployes: '',
    methodePaiement: [],
    // Informations marketing
    concurrent: [],
    zoneChalandise: '',
    potentielDeveloppement: '',
  });

  const [formProgress, setFormProgress] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Calculer la progression du formulaire
    const requiredFields = ['nomSurface', 'location'];
    const completedFields = requiredFields.filter(field => formData[field]).length;
    const progress = (completedFields / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const renderInput = (label, field, options = {}) => (
    <View style={styles.inputContainer}>
      <TextInput
        mode="outlined"
        label={label}
        value={formData[field]}
        onChangeText={(text) => setFormData(prev => ({...prev, [field]: text}))}
        style={styles.input}
        outlineColor="#E0E0E0"
        activeOutlineColor="#2196F3"
        {...options}
        theme={{
          colors: {
            background: 'white',
            placeholder: '#9E9E9E',
          },
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header avec gradient */}
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Collecte d'Informations</Text>
        <Text style={styles.headerSubtitle}>Surface de Distribution</Text>
        <ProgressBar progress={formProgress} />
      </LinearGradient>

      {/* Catégories scrollables */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          renderItem={({item}) => (
            <AnimatedCategoryCard
              category={item}
              selected={selectedCategory?.id === item.id}
              onSelect={setSelectedCategory}
            />
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Formulaire principal */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Informations générales */}
          <View style={styles.section}>
            <SectionHeader title="Informations générales" icon="info" />
            {renderInput('Nom de la surface *', 'nomSurface')}
            {renderInput('Adresse complète', 'adresse', { multiline: true })}
            {renderInput('Superficie totale (m²)', 'superficie', { keyboardType: 'numeric' })}
          </View>

          {/* Champs spécifiques à la catégorie */}
          {selectedCategory && (
            <View style={styles.section}>
              <SectionHeader 
                title={`Informations ${selectedCategory.name}`} 
                icon={selectedCategory.icon} 
              />
              {renderCategorySpecificFields()}
            </View>
          )}

          {/* Localisation */}
          <View style={styles.section}>
            <SectionHeader title="Localisation" icon="location-on" />
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={getLocation}
              disabled={loading}
            >
              <LinearGradient
                colors={['#4CAF50', '#388E3C']}
                style={styles.gradientButton}
              >
                <MaterialIcons name="location-on" size={24} color="white" />
                <Text style={styles.buttonText}>
                  {formData.location ? 'Actualiser la position' : 'Obtenir la position'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {formData.location && (
              <View style={styles.locationInfo}>
                <MaterialIcons name="location-on" size={20} color="#666" />
                <Text style={styles.locationText}>
                  {formData.location.latitude.toFixed(6)}, 
                  {formData.location.longitude.toFixed(6)}
                </Text>
              </View>
            )}
          </View>

          {/* Photos */}
          <View style={styles.section}>
            <SectionHeader title="Photos" icon="photo-camera" />
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={pickImage}
            >
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                style={styles.gradientButton}
              >
                <MaterialIcons name="add-a-photo" size={24} color="white" />
                <Text style={styles.buttonText}>Ajouter des photos</Text>
              </LinearGradient>
            </TouchableOpacity>
            {formData.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageGallery}
              >
                {formData.images.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.imageDeleteButton}
                      onPress={() => {
                        const newImages = [...formData.images];
                        newImages.splice(index, 1);
                        setFormData(prev => ({...prev, images: newImages}));
                      }}
                    >
                      <MaterialIcons name="close" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Informations commerciales */}
          <View style={styles.section}>
            <SectionHeader title="Informations commerciales" icon="business" />
            {renderInput('Contact du gérant', 'contactGerant')}
            {renderInput('Horaires d\'ouverture', 'horairesOuverture')}
            {renderInput('Chiffre d\'affaires moyen mensuel', 'chiffreAffairesMoyen', {
              keyboardType: 'numeric'
            })}
            {renderInput('Nombre d\'employés', 'nombreEmployes', {
              keyboardType: 'numeric'
            })}
          </View>

          {/* Informations marketing */}
          <View style={styles.section}>
            <SectionHeader title="Informations marketing" icon="trending-up" />
            {renderInput('Zone de chalandise (km)', 'zoneChalandise')}
            {renderInput('Potentiel de développement', 'potentielDeveloppement', {
              multiline: true,
              numberOfLines: 4
            })}
          </View>

          {/* Bouton de soumission */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.gradientButton}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Enregistrement...' : 'Enregistrer les informations'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bouton flottant d'ajout rapide */}
      <FloatingAddButton onPress={() => {
        // Implémenter l'ajout rapide ici
        Alert.alert('Ajout rapide', 'Fonctionnalité à venir');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1,
  },
  categoriesList: {
    flexGrow: 0,
  },
  categoriesContent: {
    padding: 12,
  },
  categoryCardContainer: {
    marginHorizontal: 6,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
  },
  categoryCardSelected: {
    borderWidth: 3,
    borderColor: 'white',
  },
  categoryText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
  },
  actionButton: {
    marginVertical: 8,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  locationText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  imageGallery: {
    marginTop: 12,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  imageDeleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  gradientButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default SurfaceCollectScreen;