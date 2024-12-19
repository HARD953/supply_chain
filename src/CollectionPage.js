import React, { useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  {
    id: 'construction',
    name: 'Construction',
    icon: 'home',
    color: '#FF9800',
    fields: ['typeMateriaux', 'surfaceExposition', 'capaciteStockage', 'typeClient']
  },
  {
    id: 'vivrier',
    name: 'Vivrier',
    icon: 'local-grocery-store',
    color: '#4CAF50',
    fields: ['typesProduits', 'origineProvenance', 'conditionsStockage', 'frequenceReapprovisionnement']
  },
  {
    id: 'electronique',
    name: 'Électronique',
    icon: 'devices',
    color: '#2196F3',
    fields: ['typesAppareils', 'serviceApresVente', 'garantieOfferte', 'origineMarques']
  },
  {
    id: 'cosmetique',
    name: 'Cosmétique',
    icon: 'spa',
    color: '#E91E63',
    fields: ['typeProduits', 'gammesPrix', 'marquesPrincipales', 'clienteleCible']
  },
  {
    id: 'textile',
    name: 'Textile',
    icon: 'checkroom',
    color: '#9C27B0',
    fields: ['typeVetements', 'origineTextile', 'gammesPrix', 'saisonalite']
  },
  
];

const CollectionPage = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderHeader = () => (
    <LinearGradient
      colors={['#b937a8', '#e91e63']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collecte de Surfaces</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="help-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderCategoryCard = (category) => (
    <TouchableOpacity 
      key={category.id}
      style={styles.categoryCard}
      onPress={() => setSelectedCategory(category)}
    >
      <LinearGradient
        colors={[category.color, category.color + 'CC']}
        style={styles.categoryCardGradient}
      >
        <MaterialCommunityIcons 
          name={category.icon} 
          size={40} 
          color="white" 
        />
        <Text style={styles.categoryTitle}>{category.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoryFields = () => {
    if (!selectedCategory) return null;

    return (
      <View style={styles.fieldsContainer}>
        <Text style={styles.fieldsHeader}>
          Détails pour {selectedCategory.name}
        </Text>
        {selectedCategory.fields.map((field, index) => (
          <View key={index} style={styles.fieldRow}>
            <MaterialCommunityIcons 
              name="form-textbox" 
              size={24} 
              color="#b937a8" 
            />
            <Text style={styles.fieldText}>{field}</Text>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.collectButton}
          onPress={() => {/* Logique de collecte */}}
        >
          <Text style={styles.collectButtonText}>
            Commencer la Collecte
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instructionText}>
          Sélectionnez une catégorie pour commencer la collecte
        </Text>
        
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map(renderCategoryCard)}
        </View>

        {renderCategoryFields()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333'
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  categoryCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15
  },
  categoryCardGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center'
  },
  categoryTitle: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  fieldsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    elevation: 3
  },
  fieldsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8',
    marginBottom: 15,
    textAlign: 'center'
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10
  },
  fieldText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333'
  },
  collectButton: {
    backgroundColor: '#b937a8',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },
  collectButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CollectionPage;