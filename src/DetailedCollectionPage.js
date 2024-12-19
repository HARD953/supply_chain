import React, { useState } from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLLECTION_SECTIONS = [
  {
    id: 'boutiques',
    name: 'Boutiques et Points de Vente',
    icon: 'store',
    color: '#FF9800',
    fields: [
      { name: 'Nom de la boutique', type: 'text' },
      { name: 'Type de commerce', type: 'select', options: ['Boutique', 'Supérette', 'Supermarché', 'Grossiste', 'Demi-grossiste'] },
      { name: 'Adresse physique', type: 'text' },
      { name: 'Coordonnées GPS', type: 'text' },
      { name: 'Propriétaire', type: 'text' },
      { name: 'Contact téléphonique', type: 'tel' },
      { name: 'Email', type: 'email' },
      { name: 'Horaires d\'ouverture', type: 'text' },
      { name: 'Catégories de produits', type: 'multiselect', options: ['Alimentation', 'Vêtements', 'Électronique', 'Cosmétique'] },
      { name: 'Capacité de stockage', type: 'number' },
      { name: 'Volume de stock actuel', type: 'number' },
      { name: 'Modes de paiement', type: 'multiselect', options: ['Espèces', 'Mobile Money', 'Carte bancaire', 'Chèque'] }
    ]
  },
  {
    id: 'produits',
    name: 'Produits',
    icon: 'package-variant',
    color: '#4CAF50',
    fields: [
      { name: 'Nom du produit', type: 'text' },
      { name: 'Catégorie du produit', type: 'select', options: ['Alimentaire', 'Cosmétique', 'Vêtements', 'Électronique'] },
      { name: 'Prix actuel', type: 'number' },
      { name: 'Prix historique', type: 'number' },
      { name: 'Quantité en stock', type: 'number' },
      { name: 'Certification', type: 'multiselect', options: ['Bio', 'Local', 'Importé'] },
      { name: 'Fréquence de réapprovisionnement', type: 'text' }
    ]
  },
  {
    id: 'fournisseurs',
    name: 'Fournisseurs',
    icon: 'truck-delivery',
    color: '#2196F3',
    fields: [
      { name: 'Nom du fournisseur', type: 'text' },
      { name: 'Type de fournisseur', type: 'select', options: ['Grossiste', 'Fabricant', 'Importateur'] },
      { name: 'Coordonnées', type: 'text' },
      { name: 'Produits fournis', type: 'text' },
      { name: 'Délai de livraison moyen', type: 'text' },
      { name: 'Répartition des commandes', type: 'number' },
      { name: 'Fréquence des commandes', type: 'text' }
    ]
  }
];

const DetailedCollectionPage = ({ navigation }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  const handleFieldChange = (sectionId, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [fieldName]: value
      }
    }));
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#b937a8', '#e91e63']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collecte de Données Détaillée</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="information" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderSectionCard = (section) => (
    <TouchableOpacity 
      key={section.id}
      style={styles.sectionCard}
      onPress={() => setSelectedSection(section)}
    >
      <LinearGradient
        colors={[section.color, section.color + 'CC']}
        style={styles.sectionCardGradient}
      >
        <MaterialCommunityIcons 
          name={section.icon} 
          size={40} 
          color="white" 
        />
        <Text style={styles.sectionTitle}>{section.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSectionFields = () => {
    if (!selectedSection) return null;

    return (
      <ScrollView 
        style={styles.fieldsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.fieldsHeader}>
          Collecte pour {selectedSection.name}
        </Text>
        {selectedSection.fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.name}</Text>
            {field.type === 'select' ? (
              <View style={styles.selectContainer}>
                <MaterialCommunityIcons 
                  name="chevron-down" 
                  size={24} 
                  color="#b937a8" 
                  style={styles.selectIcon} 
                />
                <Text style={styles.selectText}>
                  Sélectionner {field.name}
                </Text>
              </View>
            ) : (
              <TextInput
                style={styles.textInput}
                placeholder={`Entrez ${field.name}`}
                keyboardType={
                  field.type === 'number' ? 'numeric' : 
                  field.type === 'tel' ? 'phone-pad' : 
                  field.type === 'email' ? 'email-address' : 
                  'default'
                }
                onChangeText={(value) => handleFieldChange(selectedSection.id, field.name, value)}
              />
            )}
          </View>
        ))}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => {/* Logique de sauvegarde */}}
        >
          <Text style={styles.saveButtonText}>
            Enregistrer les Données
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderInstructionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Instructions de Collecte</Text>
          <ScrollView>
            <Text style={styles.modalText}>
              1. Sélectionnez une rubrique de collecte
              2. Remplissez soigneusement tous les champs
              3. Vérifiez l'exactitude des informations
              4. Utilisez des informations récentes et précises
            </Text>
          </ScrollView>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>Compris</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instructionText}>
          Sélectionnez une rubrique pour commencer la collecte
        </Text>
        
        <View style={styles.sectionsContainer}>
          {COLLECTION_SECTIONS.map(renderSectionCard)}
        </View>

        {renderSectionFields()}
      </ScrollView>

      {renderInstructionModal()}
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
  sectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  sectionCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15
  },
  sectionCardGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center'
  },
  sectionTitle: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  fieldsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    maxHeight: height * 0.6
  },
  fieldsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b937a8',
    marginBottom: 15,
    textAlign: 'center'
  },
  fieldContainer: {
    marginBottom: 15
  },
  fieldLabel: {
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F5F5F5'
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F5F5F5'
  },
  selectIcon: {
    position: 'absolute',
    right: 10
  },
  selectText: {
    color: '#999'
  },
  saveButton: {
    backgroundColor: '#b937a8',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: height * 0.6
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b937a8',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333'
  },
  modalCloseButton: {
    backgroundColor: '#b937a8',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },
  modalCloseButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default DetailedCollectionPage;